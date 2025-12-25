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
  Lock,
  Cloud,
  TrendingUp,
  BarChart3,
  Server,
  Database,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import AuthModal from "../Auth/AuthModal";

// Add CSS for grid animation
const gridPulseStyle = `
  @keyframes gridPulse {
    0%, 100% { opacity: 0.2; }
    50% { opacity: 0.4; }
  }
`;

const Hero = ({ onOpenAuth, isCTAActivated = false, showAttentionGrabber = false, deactivateCTA = () => {}, showJourney = () => {} }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [counter, setCounter] = useState(0);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
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
    setIsAuthOpen(true);
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
    <>
    <style>{gridPulseStyle}</style>
    <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} initialView="signup" />
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
              <div 
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
              </div>
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

        {/* RIGHT COLUMN - Animated K&Co Logo */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative hidden lg:block h-[700px] perspective-1000"
        >
          <div
            className="absolute top-1/2 left-1/2 w-[520px] h-[600px] bg-[#0f0f11] border border-white/10 rounded-[24px] shadow-2xl flex flex-col transition-transform duration-100 ease-out overflow-hidden"
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
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">K&Co FinOps</div>
            </div>

            {/* Animated Logo Content */}
            <div className="flex-1 relative overflow-hidden">
              {/* Futuristic animated background */}
              <motion.div 
                animate={{
                  background: [
                    'linear-gradient(135deg, rgba(160,47,241,0.08) 0%, rgba(147,51,234,0.08) 100%)',
                    'linear-gradient(135deg, rgba(147,51,234,0.12) 0%, rgba(160,47,241,0.12) 100%)',
                    'linear-gradient(135deg, rgba(160,47,241,0.08) 0%, rgba(147,51,234,0.08) 100%)'
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0"
              />
              
              {/* Holographic grid overlay */}
              <div className="absolute inset-0 opacity-20">
                <div 
                  className="w-full h-full"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(160,47,241,0.3) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(160,47,241,0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: '30px 30px',
                    animation: 'gridPulse 4s ease-in-out infinite'
                  }}
                />
              </div>



              {/* Financial data streams */}
              <div className="absolute inset-0">
                {/* Horizontal cost trend lines */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={`cost-${i}`}
                    className="absolute h-px bg-gradient-to-r from-transparent via-[#10b981] to-transparent opacity-30"
                    style={{
                      top: `${25 + i * 15}%`,
                      left: '10%',
                      right: '10%',
                    }}
                    animate={{
                      scaleX: [0, 1, 0],
                      opacity: [0, 0.5, 0],
                    }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: "easeInOut"
                    }}
                  />
                ))}

                {/* Vertical analytics streams */}
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={`analytics-${i}`}
                    className="absolute w-px bg-gradient-to-b from-transparent via-[#3b82f6] to-transparent opacity-25"
                    style={{
                      left: `${20 + i * 20}%`,
                      top: '15%',
                      bottom: '15%',
                    }}
                    animate={{
                      scaleY: [0, 1, 0],
                      opacity: [0, 0.4, 0],
                    }}
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                      delay: i * 0.6,
                      ease: "easeInOut"
                    }}
                  />
                ))}

                {/* Upward trending bar charts */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={`bar-${i}`}
                    className="absolute bg-gradient-to-t from-[#10b981]/20 to-[#10b981]/5 opacity-15"
                    style={{
                      left: `${15 + i * 10}%`,
                      bottom: '20%',
                      width: '6px',
                      height: `${20 + Math.sin(i * 0.8) * 15 + 25}px`, // Upward trending heights
                    }}
                    animate={{
                      scaleY: [0, 1],
                      opacity: [0, 0.3, 0.15],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeOut"
                    }}
                  />
                ))}

                {/* Stock market style line graph */}
                <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 300">
                  <motion.path
                    d="M50,200 Q100,180 150,160 T250,120 T350,80"
                    stroke="#10b981"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                    animate={{
                      pathLength: [0, 1],
                      opacity: [0, 0.4, 0.1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.path
                    d="M60,220 Q110,200 160,180 T260,140 T360,100"
                    stroke="#22c55e"
                    strokeWidth="1.5"
                    fill="none"
                    strokeDasharray="3,3"
                    animate={{
                      pathLength: [0, 1],
                      opacity: [0, 0.3, 0.08],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      delay: 1,
                      ease: "easeInOut"
                    }}
                  />
                </svg>

                {/* Pie chart segments */}
                <div className="absolute top-16 right-16 w-12 h-12 opacity-8">
                  <svg viewBox="0 0 42 42" className="w-full h-full">
                    <motion.circle
                      cx="21" cy="21" r="15.915"
                      fill="transparent"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeDasharray="60 40"
                      strokeDashoffset="25"
                      animate={{
                        strokeDashoffset: [25, 15, 25],
                        opacity: [0.1, 0.3, 0.1],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </svg>
                </div>

                {/* Cost savings indicators */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={`savings-${i}`}
                    className="absolute text-[#10b981] text-xs font-mono opacity-10"
                    style={{
                      left: `${25 + i * 25}%`,
                      top: `${30 + i * 20}%`,
                    }}
                    animate={{
                      y: [0, -10, 0],
                      opacity: [0.05, 0.2, 0.05],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 1.5,
                      ease: "easeInOut"
                    }}
                  >
                    +{15 + i * 5}%
                  </motion.div>
                ))}

                {/* Data points */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={`point-${i}`}
                    className="absolute w-1 h-1 bg-[#10b981] rounded-full opacity-15"
                    style={{
                      left: `${20 + i * 12}%`,
                      top: `${40 + Math.sin(i) * 20}%`,
                    }}
                    animate={{
                      scale: [0.5, 1.5, 0.5],
                      opacity: [0.1, 0.4, 0.1],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>

              {/* Cloud Provider Icons in Corners */}
              <div className="absolute top-4 left-4">
                <motion.div
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-16 h-16 p-1 bg-white/90 rounded-lg border border-[#ff9900]/30 flex items-center justify-center"
                >
                  <img src="/aws.svg" alt="AWS" className="w-full h-full object-contain" />
                </motion.div>
              </div>
              <div className="absolute top-4 right-4">
                <motion.div
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: 0.5,
                    ease: "easeInOut"
                  }}
                  className="w-16 h-16 p-1 bg-white/90 rounded-lg border border-[#0078d4]/30 flex items-center justify-center"
                >
                  <img src="/azure.svg" alt="Azure" className="w-full h-full object-contain" />
                </motion.div>
              </div>
              <div className="absolute bottom-4 left-4">
                <motion.div
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: 1,
                    ease: "easeInOut"
                  }}
                  className="w-16 h-16 p-1 bg-white/90 rounded-lg border border-[#4285f4]/30 flex items-center justify-center"
                >
                  <img src="/gcp.svg" alt="Google Cloud" className="w-full h-full object-contain" />
                </motion.div>
              </div>
              <div className="absolute bottom-4 right-4">
                <motion.div
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: 1.5,
                    ease: "easeInOut"
                  }}
                  className="w-16 h-16 p-1 bg-white/90 rounded-lg border border-[#f80000]/30 flex items-center justify-center"
                >
                  <img src="/oracle.svg" alt="Oracle" className="w-full h-full object-contain" />
                </motion.div>
              </div>

              {/* Main logo container */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="relative"
                >
                  {/* Holographic glow ring */}
                  <motion.div
                    animate={{
                      scale: [1, 1.15, 1],
                      opacity: [0.2, 0.5, 0.2],
                      rotate: [0, 360],
                    }}
                    transition={{
                      scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                      opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" }
                    }}
                    className="absolute inset-0 rounded-full border-2 border-dashed border-[#a02ff1] opacity-30"
                    style={{ width: '200px', height: '200px', left: '-84px', top: '-84px' }}
                  />

                  {/* Inner energy ring */}
                  <motion.div
                    animate={{
                      scale: [1, 1.08, 1],
                      opacity: [0.4, 0.7, 0.4],
                      rotate: [360, 0],
                    }}
                    transition={{
                      scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
                      opacity: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
                      rotate: { duration: 15, repeat: Infinity, ease: "linear" }
                    }}
                    className="absolute inset-0 rounded-full border border-[#9333EA] opacity-40"
                    style={{ width: '150px', height: '150px', left: '-59px', top: '-59px' }}
                  />

                  {/* Logo with futuristic effects */}
                  <motion.div
                    animate={{
                      rotateY: [0, 5, 0, -5, 0],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="relative w-32 h-32 flex items-center justify-center"
                  >
                    {/* Scanning line effect */}
                    <motion.div
                      animate={{
                        y: [-50, 50],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                        repeatDelay: 3
                      }}
                      className="absolute inset-0 h-1 bg-gradient-to-r from-transparent via-[#a02ff1] to-transparent pointer-events-none"
                      style={{ 
                        boxShadow: '0 0 20px rgba(160, 47, 241, 0.8)',
                        filter: 'blur(1px)'
                      }}
                    />

                    {/* Logo image with holographic effect */}
                    <motion.img
                      src="/k&coicon.svg"
                      alt="K&Co Logo"
                      className="w-full h-full object-contain relative z-10"
                      animate={{
                        filter: [
                          'drop-shadow(0 0 20px rgba(160, 47, 241, 0.5)) drop-shadow(0 0 40px rgba(147, 51, 234, 0.3)) brightness(1)',
                          'drop-shadow(0 0 30px rgba(160, 47, 241, 0.8)) drop-shadow(0 0 60px rgba(147, 51, 234, 0.5)) brightness(1.3)',
                          'drop-shadow(0 0 20px rgba(160, 47, 241, 0.5)) drop-shadow(0 0 40px rgba(147, 51, 234, 0.3)) brightness(1)'
                        ]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    
                    {/* Logo shine effect overlay */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none z-20"
                      style={{
                        background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
                        backgroundSize: '200% 200%',
                        mixBlendMode: 'overlay'
                      }}
                      animate={{
                        backgroundPosition: ['-200% -200%', '200% 200%']
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                        repeatDelay: 3
                      }}
                    />
                  </motion.div>

                  {/* Orbiting data nodes */}
                  {[0, 1, 2, 3].map((index) => (
                    <motion.div
                      key={index}
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 12 + index * 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        width: '220px',
                        height: '220px',
                        left: '-66px',
                        top: '-66px'
                      }}
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.6, 1, 0.6],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.5,
                          ease: "easeInOut"
                        }}
                        className="absolute w-2 h-2 bg-[#a02ff1] rounded-full"
                        style={{
                          top: `${10 + index * 20}px`,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          boxShadow: '0 0 15px rgba(160, 47, 241, 0.8)',
                          border: '1px solid rgba(160, 47, 241, 0.5)'
                        }}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Company branding with animated icons */}
              <div className="absolute bottom-6 left-0 right-0 text-center">
                <motion.div
                  className="text-2xl font-bold text-white mb-4 font-mono tracking-wider"
                  animate={{
                    opacity: [0.7, 1, 0.7],
                    textShadow: [
                      '0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(160,47,241,0.6), 0 0 30px rgba(160,47,241,0.4)',
                      '0 0 20px rgba(255,255,255,0.9), 0 0 30px rgba(160,47,241,0.8), 0 0 40px rgba(160,47,241,0.6)',
                      '0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(160,47,241,0.6), 0 0 30px rgba(160,47,241,0.4)'
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  K&Co.
                </motion.div>
                
                {/* Three business pillars represented by animated icons */}
                <div className="flex items-center justify-center gap-6 mb-3">
                  {/* Cloud Technologies */}
                  <motion.div 
                    animate={{
                      y: [0, -4, 0],
                      opacity: [0.6, 1, 0.6],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="p-3 bg-[#10b981]/10 rounded-lg border border-[#10b981]/30">
                      <Cloud size={18} className="text-[#10b981]" />
                    </div>
                    <div className="w-1 h-1 bg-[#10b981] rounded-full animate-pulse"></div>
                  </motion.div>
                  
                  {/* Financial Operations */}
                  <motion.div 
                    animate={{
                      y: [0, -6, 0],
                      opacity: [0.6, 1, 0.6],
                      scale: [1, 1.15, 1],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      delay: 0.8,
                      ease: "easeInOut"
                    }}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="p-3 bg-[#f59e0b]/10 rounded-lg border border-[#f59e0b]/30">
                      <DollarSign size={18} className="text-[#f59e0b]" />
                    </div>
                    <div className="w-1 h-1 bg-[#f59e0b] rounded-full animate-pulse"></div>
                  </motion.div>
                  
                  {/* Analytics Engine */}
                  <motion.div 
                    animate={{
                      y: [0, -5, 0],
                      opacity: [0.6, 1, 0.6],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      delay: 1.6,
                      ease: "easeInOut"
                    }}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="p-3 bg-[#a02ff1]/10 rounded-lg border border-[#a02ff1]/30">
                      <BarChart3 size={18} className="text-[#a02ff1]" />
                    </div>
                    <div className="w-1 h-1 bg-[#a02ff1] rounded-full animate-pulse"></div>
                  </motion.div>
                </div>
                
                <motion.div 
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-xs text-gray-500 font-mono flex items-center justify-center gap-2"
                >
                  <Activity size={10} className="text-[#a02ff1] animate-pulse" />
                  SYSTEM.ACTIVE
                  <Activity size={10} className="text-[#a02ff1] animate-pulse" />
                </motion.div>
              </div>

              {/* Futuristic corner accents with circuit patterns */}
              <div className="absolute top-0 right-0 w-16 h-16">
                <motion.div
                  animate={{
                    opacity: [0.2, 0.6, 0.2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-full h-full bg-gradient-to-bl from-[#a02ff1]/20 to-transparent rounded-bl-full border-l border-b border-[#a02ff1]/30"
                />
              </div>
              <div className="absolute bottom-0 left-0 w-12 h-12">
                <motion.div
                  animate={{
                    opacity: [0.2, 0.6, 0.2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: 1.5,
                    ease: "easeInOut"
                  }}
                  className="w-full h-full bg-gradient-to-tr from-[#9333EA]/20 to-transparent rounded-tr-full border-r border-t border-[#9333EA]/30"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
    </>
  );
};

export default Hero;