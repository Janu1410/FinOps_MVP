import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, Sparkles, User, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Non-functional for now - navigate to CSV upload page
    navigate('/upload');
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

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-black border border-white/5">
              <div className="absolute left-0 top-0 w-[44%] h-full bg-[#6D23A0]"></div>
              <div className="absolute right-0 top-0 w-[44%] h-full flex flex-col justify-between">
                <div className="h-[46%] w-full bg-[#8B2FC9]"></div>
                <div className="h-[46%] w-full bg-[#8B2FC9]"></div>
              </div>
            </div>
            <span className="text-3xl font-bold tracking-tight text-white">K&Co.</span>
          </div>
          
          <div className="inline-flex items-center gap-2 bg-[#8B2FC9]/10 border border-[#8B2FC9]/20 rounded-full px-3 py-1 mb-4 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[#8B2FC9]" />
            <span className="text-[10px] font-bold tracking-widest text-[#8B2FC9] uppercase">
              Start Your Free Audit
            </span>
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[#121214] border border-white/10 rounded-2xl p-8 shadow-2xl"
        >
          {/* Toggle Login/Signup */}
          <div className="flex justify-center mb-8">
            <div className="relative bg-[#18181b] p-1.5 rounded-full border border-white/10 flex w-[280px]">
              <div 
                className={`absolute top-1.5 bottom-1.5 w-[134px] rounded-full transition-all duration-300 ease-out bg-[#8B2FC9] ${isLogin ? 'left-1.5' : 'left-[144px]'}`}
              ></div>
              <button 
                onClick={() => setIsLogin(true)}
                className={`relative z-10 w-1/2 py-2.5 text-sm font-bold transition-colors duration-300 ${isLogin ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Login
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={`relative z-10 w-1/2 py-2.5 text-sm font-bold transition-colors duration-300 ${!isLogin ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input - Only for Signup */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#8B2FC9] focus:ring-1 focus:ring-[#8B2FC9] transition-all"
                    required
                  />
                </div>
              </div>
            )}

            {/* Company Name Input - Only for Signup */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Company Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter your company name"
                    className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#8B2FC9] focus:ring-1 focus:ring-[#8B2FC9] transition-all"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#8B2FC9] focus:ring-1 focus:ring-[#8B2FC9] transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#8B2FC9] focus:ring-1 focus:ring-[#8B2FC9] transition-all"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full group relative px-8 py-3.5 rounded-xl font-bold text-white overflow-hidden shadow-[0_0_20px_rgba(139,47,201,0.4)]"
            >
              <div className="absolute inset-0 bg-[#8B2FC9] hover:bg-[#7822b0] transition-colors" />
              <div className="relative flex items-center justify-center gap-2">
                <span>{isLogin ? 'Login' : 'Sign Up'}</span>
                <ArrowRight
                  className="group-hover:translate-x-1 transition-transform"
                  size={18}
                />
              </div>
            </motion.button>
          </form>

          {/* Info Text */}
          <p className="mt-6 text-center text-xs text-gray-500">
            This is a demo. Enter any email and password to continue.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

