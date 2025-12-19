import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Upload, CheckCircle2, Loader2, ArrowRight, FileText, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CSVUpload = () => {
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, processing, success, error
  const [fileDetails, setFileDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // --- THE UPLOAD LOGIC ---
  const handleFileUpload = async (file) => {
    if (!file) return;

    // 1. Show File Details UI
    setFileDetails({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
    });
    setUploadStatus('processing');
    setErrorMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      // 2. Send to Backend
      const response = await axios.post('http://localhost:5000/api/process-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { data, rawRecords } = response.data; // Expecting backend to return both

      // 3. Store Data for Dashboard
      // 'finopsData' = Calculated Metrics (Total Spend, Graphs)
      localStorage.setItem('finopsData', JSON.stringify(data));
      
      // 'rawRecords' = The full list of rows (For the Detailed Table)
      // If backend doesn't send rawRecords, we might need to parse client-side or update backend
      if (rawRecords) {
        localStorage.setItem('rawRecords', JSON.stringify(rawRecords));
      }

      // 4. Show Success
      // Small delay to let the user see the "100%" animation
      setTimeout(() => setUploadStatus('success'), 800);
      
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadStatus('error');
      
      // Show more detailed error message
      if (error.response) {
        // Server responded with error
        const serverError = error.response.data?.error || error.response.data?.details || 'Server error occurred';
        setErrorMessage(`Failed to process file: ${serverError}. Please ensure it's a valid FOCUS or Billing CSV.`);
      } else if (error.request) {
        // Request was made but no response received
        setErrorMessage("Cannot connect to backend server. Please ensure the backend is running on port 5000.");
      } else {
        // Something else happened
        setErrorMessage(`Failed to process file: ${error.message}. Please ensure it's a valid FOCUS or Billing CSV.`);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files[0]);
  };

  const handleChange = (e) => {
    handleFileUpload(e.target.files[0]);
  };

  return (
    <div className="min-h-screen bg-[#0f0f11] flex items-center justify-center px-6 py-12 font-sans relative overflow-hidden">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#a02ff1]/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      <div className="relative z-10 w-full max-w-3xl">
        
        {/* Header Text */}
        <div className="text-center mb-10">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#a02ff1] text-xs font-bold uppercase tracking-wider mb-4">
             <span className="w-2 h-2 rounded-full bg-[#a02ff1]"></span>
             Secure Ingestion
           </div>
           <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
             Connect Your Cloud Data
           </h1>
           <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
             Upload your billing export (CSV) to generate instant cost intelligence. 
             <br/><span className="text-gray-500 text-sm">We process data in-memory. No permanent storage.</span>
           </p>
        </div>

        {/* --- MAIN CARD --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1a1b20]/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative"
        >
          {/* Card Content Container */}
          <div className="p-10 min-h-[420px] flex flex-col items-center justify-center">

            <AnimatePresence mode="wait">
              
              {/* STATE 1: IDLE (Upload Box) */}
              {uploadStatus === 'idle' && (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="w-full h-full flex flex-col items-center"
                >
                  <label 
                    className="w-full flex-1 border-2 border-dashed border-[#a02ff1]/30 hover:border-[#a02ff1] hover:bg-[#a02ff1]/5 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer group min-h-[300px]"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <input type="file" accept=".csv" onChange={handleChange} className="hidden" />
                    
                    <div className="w-20 h-20 rounded-full bg-[#1a1b20] border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl">
                      <Upload className="text-[#a02ff1] w-8 h-8" />
                    </div>
                    
                    <h3 className="text-white font-bold text-xl mb-2">Click to upload or drag & drop</h3>
                    <p className="text-gray-500 text-sm mb-6">Max file size 50MB (CSV only)</p>
                    
                    <div className="flex gap-4">
                       <span className="px-3 py-1 rounded bg-white/5 border border-white/5 text-[10px] text-gray-400 font-mono">AWS CUR</span>
                       <span className="px-3 py-1 rounded bg-white/5 border border-white/5 text-[10px] text-gray-400 font-mono">Azure Export</span>
                       <span className="px-3 py-1 rounded bg-white/5 border border-white/5 text-[10px] text-gray-400 font-mono">GCP Billing</span>
                    </div>
                  </label>
                </motion.div>
              )}

              {/* STATE 2: PROCESSING */}
              {uploadStatus === 'processing' && (
                <motion.div 
                  key="processing"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center w-full"
                >
                  <div className="relative w-24 h-24 mb-8">
                    <svg className="animate-spin w-full h-full text-[#a02ff1]" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FileText className="text-white w-8 h-8" />
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-2">Analyzing Data</h2>
                  <p className="text-gray-400 mb-8 flex items-center gap-2">
                    {fileDetails?.name} <span className="w-1 h-1 rounded-full bg-gray-600"></span> {fileDetails?.size}
                  </p>

                  <div className="w-full max-w-sm bg-gray-800 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2 }}
                      className="h-full bg-[#a02ff1]" 
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-4 animate-pulse">Calculating unit costs and anomalies...</p>
                </motion.div>
              )}

              {/* STATE 3: ERROR */}
              {uploadStatus === 'error' && (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-center max-w-md"
                >
                   <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6 text-red-500 border border-red-500/20">
                     <AlertCircle size={40} />
                   </div>
                   <h2 className="text-2xl font-bold text-white mb-2">Upload Failed</h2>
                   <p className="text-gray-400 mb-8">{errorMessage}</p>
                   <button 
                     onClick={() => setUploadStatus('idle')}
                     className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
                   >
                     Try Again
                   </button>
                </motion.div>
              )}

              {/* STATE 4: SUCCESS */}
              {uploadStatus === 'success' && (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center"
                >
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} type="spring"
                    className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20"
                  >
                    <CheckCircle2 className="text-green-500 w-12 h-12" />
                  </motion.div>
                  
                  <h2 className="text-3xl font-bold text-white mb-2">Analysis Ready</h2>
                  <p className="text-gray-400 mb-8 max-w-md">
                    We've processed your billing data and identified optimization opportunities.
                  </p>

                  <button
                    onClick={() => navigate('/dashboard')}
                    className="group relative px-8 py-4 bg-[#a02ff1] hover:bg-[#8e25d9] rounded-xl font-bold text-white shadow-[0_0_20px_rgba(160,47,241,0.4)] hover:shadow-[0_0_30px_rgba(160,47,241,0.6)] transition-all flex items-center gap-3"
                  >
                    <span>Launch Dashboard</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>

        {/* Footer Links */}
        <div className="flex justify-center gap-6 mt-8 text-sm text-gray-500">
           <a href="#" className="hover:text-white transition-colors">Documentation</a>
           <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
           <a href="#" className="hover:text-white transition-colors">Support</a>
        </div>

      </div>
    </div>
  );
};

export default CSVUpload;