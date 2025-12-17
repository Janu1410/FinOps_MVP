import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, CheckCircle2, ArrowRight, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const CSVUpload = () => {
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, ready
  const navigate = useNavigate();

  const handleDrop = (e) => {
    e.preventDefault();
    // Non-functional for now - just show ready state
    setUploadStatus('ready');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleClick = () => {
    // Non-functional for now - just show ready state
    setUploadStatus('ready');
  };

  return (
    <div className="min-h-screen bg-[#0f0f11] flex items-center justify-center px-6 py-12">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      
      {/* Floating Blobs */}
      <motion.div
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-72 h-72 bg-[#8B2FC9]/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"
      />
      <motion.div
        animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"
      />

      <div className="relative z-10 w-full max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Upload Your Billing CSV
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Upload your AWS, Azure, or GCP billing export to get started with your free audit.
          </p>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[#121214] border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-8"
        >
          {uploadStatus === 'idle' && (
            <div 
              className="border-2 border-dashed border-[#8B2FC9]/30 hover:border-[#8B2FC9] rounded-2xl flex flex-col items-center justify-center bg-[#8B2FC9]/5 transition-all cursor-pointer group min-h-[400px]"
              onClick={handleClick}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-20 h-20 rounded-full bg-[#8B2FC9]/20 flex items-center justify-center mb-6 group-hover:bg-[#8B2FC9]/30 transition-colors"
              >
                <Upload className="text-[#8B2FC9] w-10 h-10" />
              </motion.div>
              <h3 className="text-white font-bold text-2xl mb-2">Drop Billing CSV</h3>
              <p className="text-gray-500 text-sm mb-4">or click to browse</p>
              <p className="text-gray-600 text-xs">Supports AWS, Azure, and GCP billing exports</p>
            </div>
          )}

          {uploadStatus === 'ready' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center text-center min-h-[400px]"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 bg-[#8B2FC9]/20 rounded-full flex items-center justify-center mb-6"
              >
                <CheckCircle2 className="text-[#8B2FC9] w-10 h-10" />
              </motion.div>
              
              <h2 className="text-3xl font-bold text-white mb-2">Insights ready</h2>
              <p className="text-gray-400 text-sm mb-8 max-w-md">
                Your billing data has been analyzed. View your dashboard to see detailed insights and recommendations.
              </p>

              <motion.button
                onClick={() => navigate('/dashboard')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-3.5 rounded-xl font-bold text-white overflow-hidden shadow-[0_0_20px_rgba(139,47,201,0.4)]"
              >
                <div className="absolute inset-0 bg-[#8B2FC9] hover:bg-[#7822b0] transition-colors" />
                <div className="relative flex items-center justify-center gap-2">
                  <span>View Dashboard</span>
                  <ArrowRight
                    className="group-hover:translate-x-1 transition-transform"
                    size={18}
                  />
                </div>
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CSVUpload;


