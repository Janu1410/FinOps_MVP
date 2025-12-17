import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Github, Chrome, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(false); // Default to Sign Up as requested

  // Animation Variants
  const formVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-[#0f0f11] flex items-center justify-center relative overflow-hidden p-6">
      
      {/* --- BACKGROUND EFFECTS (Consistent with Hero) --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#8B2FC9]/20 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#a02ff1]/10 rounded-full blur-[120px] pointer-events-none"
      />

      {/* --- BACK BUTTON --- */}
      <a href="/" className="absolute top-8 left-8 text-gray-400 hover:text-white flex items-center gap-2 transition-colors z-20">
        <ArrowLeft size={20} /> <span className="text-sm font-medium">Back to Home</span>
      </a>

      {/* --- AUTH CARD --- */}
      <div className="w-full max-w-md relative z-10">
        <motion.div 
          layout
          className="bg-[#121214]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-3 rounded-xl bg-[#8B2FC9]/10 border border-[#8B2FC9]/20 mb-4">
               <User className="text-[#8B2FC9]" size={24} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-400 text-sm">
              {isLogin ? 'Enter your credentials to access your dashboard.' : 'Start your 90-day FinOps plan today.'}
            </p>
          </div>

          {/* Form Fields */}
          <AnimatePresence mode='wait'>
            <motion.form 
              key={isLogin ? 'login' : 'signup'}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#8B2FC9] transition-colors" size={18} />
                    <input type="text" className="w-full bg-[#0f0f11] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-[#8B2FC9] focus:outline-none transition-all placeholder:text-gray-600" placeholder="John Doe" />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Work Email</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#8B2FC9] transition-colors" size={18} />
                  <input type="email" className="w-full bg-[#0f0f11] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-[#8B2FC9] focus:outline-none transition-all placeholder:text-gray-600" placeholder="name@company.com" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#8B2FC9] transition-colors" size={18} />
                  <input type="password" className="w-full bg-[#0f0f11] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-[#8B2FC9] focus:outline-none transition-all placeholder:text-gray-600" placeholder="••••••••" />
                </div>
              </div>

              {isLogin && (
                <div className="flex justify-end">
                  <a href="#" className="text-xs text-[#8B2FC9] hover:text-white transition-colors">Forgot Password?</a>
                </div>
              )}

              <button className="w-full py-3.5 bg-[#8B2FC9] hover:bg-[#7a25b3] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-purple-900/20 mt-2">
                {isLogin ? 'Sign In' : 'Get Started'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.form>
          </AnimatePresence>

          {/* Social Login Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#121214] px-2 text-gray-500">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all text-sm font-medium">
              <Github size={18} /> GitHub
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all text-sm font-medium">
              <Chrome size={18} /> Google
            </button>
          </div>

          {/* Toggle Login/Signup */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => setIsLogin(!isLogin)} 
                className="text-[#8B2FC9] font-bold hover:text-white transition-colors ml-1"
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default Auth;