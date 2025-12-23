// src/components/Hero.jsx
import React, { useState, useEffect } from "react";
import { 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Calendar, 
  Zap,
  Target,
  PieChart,
  DollarSign,
  CheckCircle2,
  FileSpreadsheet,
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = ({ onOpenAuth, isCTAActivated = false, showAttentionGrabber = false, deactivateCTA = () => {}, showJourney = () => {} }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [counter, setCounter] = useState(0);
  const [showOnboardingHint, setShowOnboardingHint] = useState(false);

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

  // Delayed onboarding hint (7-9 seconds, using 8 seconds)
  useEffect(() => {
    const hintTimer = setTimeout(() => {
      setShowOnboardingHint(true);
    }, 8000);

    return () => clearTimeout(hintTimer);
  }, []);

  // Hide hint on significant scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowOnboardingHint(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide hint when primary CTA is clicked
  const handleCTAClick = () => {
    setShowOnboardingHint(false);
    deactivateCTA();
  };

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
      id="hero"
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
          {/* UPDATED TAG: Focused on the Tool aspect */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-[#2a2a30]/50 border border-white/10 rounded-full px-3 py-1 mb-6 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[#a02ff1]" />
            <span className="text-[11px] font-bold tracking-widest text-[#d4a6f9] uppercase">
              Instant Cloud FinOps
            </span>
          </motion.div>

          {/* UPDATED HEADLINE: "Turn Billing Data into Pure Profit" */}
          <div className="mb-6">
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1] mb-2">
              TURN BILLING <br /> DATA
            </motion.h1>
            <motion.div variants={itemVariants} className="relative inline-block">
              <span className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#a02ff1] via-[#c06eff] to-white animate-gradient bg-300%">
                INTO PURE SAVING
              </span>
            </motion.div>
          </div>

          {/* UPDATED DESCRIPTION: Aligns with Upload CSV flow */}
          <motion.p variants={itemVariants} className="text-lg text-gray-400 max-w-lg leading-relaxed font-light mb-8">
            Stop guessing where your budget goes. <strong>Upload your billing file</strong> to instantly visualize waste, spot anomalies, and find savings—securely and for free.
          </motion.p>

          {/* Feature Tags (Updated for Instant/Secure nature) */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mb-10">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1b26] border border-blue-500/30 text-blue-200 text-sm font-medium">
              <Clock size={16} className="text-blue-400" /> <span>Instant Audit</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1b26] border border-[#a02ff1]/30 text-purple-200 text-sm font-medium">
              <FileSpreadsheet size={16} className="text-[#a02ff1]" /> <span>CSV Upload</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1b26] border border-green-500/30 text-green-200 text-sm font-medium">
              <Lock size={16} className="text-green-400" /> <span>Secure & Private</span>
            </div>
          </motion.div>

          {/* Buttons with ANIMATION */}
          <motion.div variants={itemVariants} className="flex flex-col w-full">
            <div className="flex justify-start w-full relative">
              <AnimatePresence>
                {showAttentionGrabber && (
                  <>
                    {/* Multiple expanding border rings - 3 cycles over 4.5 seconds */}
                    {[0, 1, 2].map((cycle) => (
                      <motion.div
                        key={cycle}
                        className="absolute -inset-4 rounded-3xl border-2 border-[#a02ff1] pointer-events-none"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{
                          opacity: [0, 0.8, 0],
                          scale: [0.9, 1.1, 1.3],
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 1.5,
                          delay: cycle * 1.5,
                          ease: "easeOut"
                        }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>
              <Link 
                to="/sign-up" 
                className="inline-block"
                onClick={handleCTAClick}
              >
                <motion.button
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 0 40px rgba(160, 47, 241, 0.6)",
                    y: -2
                  }}
                  whileTap={{ scale: 0.98 }}
                  animate={isCTAActivated ? {
                    boxShadow: [
                      "0 0 20px rgba(160, 47, 241, 0.4), inset 0 0 20px rgba(160, 47, 241, 0.1)",
                      "0 0 50px rgba(160, 47, 241, 0.8), inset 0 0 40px rgba(160, 47, 241, 0.3)",
                      "0 0 20px rgba(160, 47, 241, 0.4), inset 0 0 20px rgba(160, 47, 241, 0.1)"
                    ]
                  } : {}}
                  transition={isCTAActivated ? {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  } : {}}
                  className="relative px-10 py-5 text-xl rounded-2xl font-bold text-white overflow-hidden bg-gradient-to-r from-[#a02ff1] via-[#8a25d4] to-[#a02ff1] transition-all shadow-lg tracking-tight"
                  style={{
                    backgroundSize: isCTAActivated ? '200% 100%' : '100% 100%',
                    backgroundPosition: isCTAActivated ? '0% 50%' : '50% 50%'
                  }}
                >
                  {/* Animated gradient background */}
                  <motion.div
                    className="absolute inset-0"
                    animate={isCTAActivated ? {
                      background: [
                        'linear-gradient(90deg, #a02ff1 0%, #c06eff 50%, #a02ff1 100%)',
                        'linear-gradient(90deg, #8a25d4 0%, #a02ff1 50%, #8a25d4 100%)',
                        'linear-gradient(90deg, #a02ff1 0%, #c06eff 50%, #a02ff1 100%)'
                      ]
                    } : {}}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  
                  {/* Futuristic grid overlay */}
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }} />
                  
                  {/* Shimmer shine effect on text */}
                  {isCTAActivated && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
                        backgroundSize: '200% 100%'
                      }}
                      animate={{
                        backgroundPosition: ['-200% 0', '200% 0']
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                        repeatDelay: 0.5
                      }}
                    />
                  )}
                  
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    <motion.span 
                      className="tracking-tight relative inline-block text-white"
                      style={{
                        textShadow: isCTAActivated 
                          ? '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(160,47,241,0.6), 0 0 30px rgba(160,47,241,0.4)'
                          : 'none',
                        filter: isCTAActivated ? 'brightness(1.2)' : 'none'
                      }}
                      animate={isCTAActivated ? {
                        scale: [1, 1.04, 1],
                        textShadow: [
                          '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(160,47,241,0.6), 0 0 30px rgba(160,47,241,0.4)',
                          '0 0 20px rgba(255,255,255,1), 0 0 30px rgba(160,47,241,0.8), 0 0 40px rgba(160,47,241,0.6)',
                          '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(160,47,241,0.6), 0 0 30px rgba(160,47,241,0.4)'
                        ]
                      } : {}}
                      transition={isCTAActivated ? {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      } : {}}
                    >
                      Get Started
                    </motion.span>
                    <motion.div
                      animate={isCTAActivated ? {
                        x: [0, 6, 0],
                        scale: [1, 1.2, 1],
                        filter: [
                          'drop-shadow(0 0 0px rgba(255,255,255,0))',
                          'drop-shadow(0 0 10px rgba(255,255,255,0.9)) drop-shadow(0 0 15px rgba(160,47,241,0.7))',
                          'drop-shadow(0 0 0px rgba(255,255,255,0))'
                        ]
                      } : {
                        type: "spring",
                        stiffness: 400
                      }}
                      transition={isCTAActivated ? {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      } : {
                        type: "spring",
                        stiffness: 400
                      }}
                    >
                      <ArrowRight size={24} strokeWidth={2.5} />
                    </motion.div>
                  </div>
                </motion.button>
              </Link>
            </div>
            
            {/* Onboarding Hint - Attractive tagline, positioned below button */}
            <AnimatePresence>
              {showOnboardingHint && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="mt-6 flex items-center justify-start"
                >
                  <p className="text-sm text-gray-400 flex items-center gap-2 group">
                    <span className="relative">
                      New here?
                      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#a02ff1] group-hover:w-full transition-all duration-300"></span>
                    </span>
                    <span className="text-[#a02ff1] font-medium flex items-center gap-1.5">
                      See how K&Co works
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        →
                      </motion.span>
                    </span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* RIGHT COLUMN (Dashboard) - EXACTLY AS REQUESTED */}
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