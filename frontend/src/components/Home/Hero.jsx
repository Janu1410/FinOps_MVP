// src/components/Hero.jsx
import React, { useState, useEffect } from "react";
import { 
  ArrowRight, 
  Terminal, 
  Sparkles, 
  Clock, 
  Calendar, 
  Zap,
  CheckCircle2,
  Target,
  PieChart,
  DollarSign
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = ({ onOpenAuth }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [counter, setCounter] = useState(0);

  // Handle 3D Parallax Effect
  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    setMousePosition({ x, y });
  };

  // Animated Counter Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => (prev < 12500 ? prev + 150 : 12500));
    }, 20);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1, delayChildren: 0.2 } 
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.6, ease: "easeOut" } 
    },
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center bg-[#0f0f11] overflow-hidden pt-24 pb-12"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#7e32ec]/20 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#a02ff1]/10 rounded-full blur-[120px] pointer-events-none"
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* LEFT COLUMN */}
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="visible" 
          className="text-left relative"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-[#2a2a30]/50 border border-white/10 rounded-full px-3 py-1 mb-6 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[#a02ff1]" />
            <span className="text-[11px] font-bold tracking-widest text-[#d4a6f9] uppercase">
              AI-Powered Cloud FinOps
            </span>
          </motion.div>

          <div className="mb-6">
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1] mb-2">
              CUT CLOUD <br /> COSTS
            </motion.h1>
            <motion.div variants={itemVariants} className="relative inline-block">
              <span className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#a02ff1] via-[#c06eff] to-white animate-gradient bg-300%">
                10-30% IN 90 DAYS
              </span>
            </motion.div>
          </div>

          <motion.p variants={itemVariants} className="text-lg text-gray-400 max-w-lg leading-relaxed font-light mb-8">
            Master your unit economics. We align your infrastructure spend with business value to eliminate waste and forecast with precision.
          </motion.p>

          {/* Feature Tags */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mb-10">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1b26] border border-blue-500/30 text-blue-200 text-sm font-medium">
              <Clock size={16} className="text-blue-400" /> <span>3-4 Wk Audit</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1b26] border border-[#a02ff1]/30 text-purple-200 text-sm font-medium">
              <Calendar size={16} className="text-[#a02ff1]" /> <span>90 Day Plan</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1b26] border border-green-500/30 text-green-200 text-sm font-medium">
              <Zap size={16} className="text-green-400" /> <span>Weekly Rhythm</span>
            </div>
          </motion.div>

          {/* Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4">
            
            <Link to="/sign-up" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(160, 47, 241, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="w-full relative px-8 py-4 rounded-xl font-bold text-white overflow-hidden bg-[#a02ff1] transition-all"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Start Free Audit</span>
                  <ArrowRight size={18} />
                </div>
              </motion.button>
            </Link>

            <a href="#about" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-6 py-4 border border-white/20 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2"
              >
                <Terminal size={18} className="text-gray-400" />
                <span>How it Works</span>
              </motion.button>
            </a>
          </motion.div>
        </motion.div>

        {/* RIGHT COLUMN (Dashboard) */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative hidden lg:block h-[600px] perspective-1000"
        >
          <div
            className="absolute top-1/2 left-1/2 w-[420px] bg-[#0f0f11] border border-white/10 rounded-[24px] shadow-2xl flex flex-col transition-transform duration-100 ease-out"
            style={{
              transform: `translate(-50%, -50%) rotateX(${mousePosition.y * -4}deg) rotateY(${mousePosition.x * 4}deg)`,
              boxShadow: `0 30px 60px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)`,
            }}
          >
             {/* Header */}
             <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02] rounded-t-[24px]">
               <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
               </div>
               <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">FinOps OS v1.4</div>
            </div>

            {/* Dashboard Body */}
            <div className="p-6 flex flex-col gap-6 relative overflow-hidden">
               <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

               {/* Metric Card 1 (Unit Cost - Blue) */}
               <div className="relative z-10 bg-[#1a1b20]/80 backdrop-blur-sm p-4 rounded-xl border border-white/5">
                 <div className="flex justify-between items-center mb-1">
                   <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                     <PieChart size={14} /> Unit Cost / Transaction
                   </div>
                   <div className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20">LIVE</div>
                 </div>
                 <div className="text-3xl font-bold text-white mb-2">$0.0042</div>
                 <div className="text-xs text-gray-500">vs $0.0058 (Last Month)</div>
                 <div className="flex gap-1 mt-3 items-end h-8">
                    {[60, 55, 50, 48, 45, 42, 40, 38].map((h, i) => (
                      <div key={i} style={{height: `${h}%`}} className="flex-1 bg-blue-500/20 rounded-sm"></div>
                    ))}
                 </div>
               </div>

                {/* Floating Badge (Purple) */}
                <motion.div 
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-20 self-center"
                >
                  <div className="px-4 py-2 rounded-full bg-[#151518] border border-[#a02ff1]/50 shadow-[0_0_15px_rgba(160,47,241,0.3)] flex items-center gap-3">
                     <Target size={16} className="text-[#a02ff1]" />
                     <span className="text-sm font-bold text-white">Efficiency 94%</span>
                     <div className="px-1.5 py-0.5 bg-[#a02ff1] text-white text-[10px] font-bold rounded">HIGH</div>
                  </div>
                </motion.div>

               {/* Metric Card 2 (Waste Eliminated - UPDATED TO GREEN) */}
               <div className="relative z-10 bg-[#1a1b20]/80 backdrop-blur-sm p-4 rounded-xl border border-white/5 mt-auto">
                 <div className="flex justify-between items-center mb-1">
                   <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                     <DollarSign size={14} className="text-green-400" /> {/* Icon is now Green */}
                     Waste Eliminated
                   </div>
                 </div>
                 <div className="flex items-end justify-between">
                    <div>
                        {/* Text is now Green-tinted for emphasis */}
                        <div className="text-3xl font-bold text-white">${counter.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Annualized Savings</div>
                    </div>
                    {/* Graph Bars are now GREEN */}
                    <div className="flex gap-1 items-end h-10">
                        {[20, 35, 45, 50, 65, 75, 85, 100].map((h, i) => (
                        <motion.div 
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            className="w-1.5 bg-green-500 rounded-t-sm shadow-[0_0_10px_rgba(34,197,94,0.3)]" 
                        />
                        ))}
                    </div>
                 </div>
               </div>

               {/* Success Pill */}
               <motion.div 
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 1.5 }}
                 className="absolute -right-12 top-20 bg-[#0f0f11] border border-green-500/30 p-3 rounded-xl shadow-xl z-30 flex flex-col items-center gap-1"
               >
                 <CheckCircle2 size={20} className="text-green-400" />
                 <span className="text-[10px] font-bold text-white">Budget</span>
                 <span className="text-xs font-mono text-green-400">UNDER</span>
               </motion.div>

            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;