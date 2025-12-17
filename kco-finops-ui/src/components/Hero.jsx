import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Terminal,
  Clock,
  CalendarCheck,
  Zap,
  TrendingUp,
  BarChart2,
  Target,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [margin, setMargin] = useState(12);

  // MOUSE PARALLAX LOGIC
  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    setMousePosition({ x, y });
  };

  // MARGIN ANIMATION
  useEffect(() => {
    const timer = setInterval(() => {
      setMargin((prev) => (prev < 24 ? prev + 1 : 24));
    }, 150);
    return () => clearInterval(timer);
  }, []);

  // ANIMATION VARIANTS
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative h-screen min-h-[700px] flex items-center justify-center bg-[#0f0f11] overflow-hidden"
    >
      {/* --- BACKGROUND: THE "BOX LINE" GRID --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {/* Floating Blobs (Restored to Brand Purple #8B2FC9) */}
      <motion.div
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-72 h-72 bg-[#8B2FC9]/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"
      />
      <motion.div
        animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* --- LEFT COLUMN --- */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-left relative"
        >
          {/* Animated Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-[#8B2FC9]/10 border border-[#8B2FC9]/20 rounded-full px-3 py-1 mb-6 backdrop-blur-md"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-3.5 w-3.5 text-[#8B2FC9]" />
            </motion.div>
            <span className="text-[10px] font-bold tracking-widest text-[#8B2FC9] uppercase">
              AI-Powered Cloud Optimization
            </span>
          </motion.div>

          {/* HEADLINE: High Impact with Brand Gradient */}
          <div className="mb-6">
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[0.9]"
            >
              CUT CLOUD <br /> COSTS
            </motion.h1>

            <motion.div
              variants={itemVariants}
              className="relative inline-block mt-2"
            >
              {/* Glow effect behind text */}
              <motion.div
                className="absolute inset-0 bg-[#8B2FC9] blur-3xl opacity-20"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {/* Restored the Brand Gradient */}
              <span className="relative text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-[#8B2FC9] to-purple-400">
                10-30% IN 90 DAYS
              </span>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="mb-8">
            <p className="text-lg text-gray-400 max-w-md leading-relaxed font-light">
              Guaranteed savings or your money back. We align your revenue data
              with infrastructure costs to help you forecast with confidence.
            </p>
          </motion.div>

          {/* --- ANIMATED FEATURE CHIPS --- */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-3 mb-8"
          >
            {[
              {
                icon: Clock,
                label: "3-4 Wk Audit",
                color: "text-blue-400",
                bg: "bg-blue-500/10",
                border: "border-blue-500/20",
              },
              {
                icon: CalendarCheck,
                label: "90 Day Plan",
                color: "text-[#8B2FC9]",
                bg: "bg-[#8B2FC9]/10",
                border: "border-[#8B2FC9]/20",
              },
              {
                icon: Zap,
                label: "Weekly Rhythm",
                color: "text-green-400",
                bg: "bg-green-500/10",
                border: "border-green-500/20",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, y: -2 }}
                className={`flex items-center gap-2 ${item.bg} backdrop-blur-sm border ${item.border} rounded-lg px-3 py-2 cursor-default`}
              >
                <item.icon size={16} className={item.color} />
                <span className="text-sm text-gray-200 font-medium">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* --- BUTTONS (Restored Brand Purple) --- */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-4"
          >
            <motion.button
              onClick={() => window.open('/login', '_blank', 'noopener,noreferrer')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-3.5 rounded-xl font-bold text-white overflow-hidden shadow-[0_0_20px_rgba(139,47,201,0.4)]"
            >
              {/* Button Gradient - Restored to Brand Purple */}
              <div className="absolute inset-0 bg-[#8B2FC9] hover:bg-[#7822b0] transition-colors" />
              <div className="relative flex items-center gap-2">
                <span>Start Free Audit</span>
                <ArrowRight
                  className="group-hover:translate-x-1 transition-transform"
                  size={18}
                />
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3.5 border border-white/10 rounded-xl font-semibold text-white hover:bg-white/5 backdrop-blur-sm transition-all flex items-center gap-2 group"
            >
              <Terminal
                size={18}
                className="text-gray-500 group-hover:text-[#8B2FC9] transition-colors"
              />
              <span>How it Works</span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* --- RIGHT COLUMN: THE "DUAL ENGINE" DASHBOARD (Compact) --- */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative hidden lg:block h-[450px] perspective-1000"
        >
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[440px] bg-[#0a0a0c]/90 border border-white/10 rounded-[24px] shadow-2xl transition-transform duration-100 ease-out overflow-hidden flex flex-col backdrop-blur-xl"
            style={{
              transform: `translate(-50%, -50%) rotateX(${
                mousePosition.y * -3
              }deg) rotateY(${mousePosition.x * 3}deg)`,
              boxShadow: `0 30px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05)`,
            }}
          >
            {/* Header */}
            <div className="px-5 py-3 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                K&Co.OS
              </span>
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500/20"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/20"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500/20"></div>
              </div>
            </div>

            {/* --- SECTION 1: REVOPS (Growth) --- */}
            <div className="flex-1 p-5 border-b border-white/5 relative group">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <Target size={14} />
                  <span className="text-xs font-semibold">
                    Revenue Forecast
                  </span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 text-[9px] font-bold border border-green-500/20">
                  ON TRACK
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xl font-bold text-white">$2.4M</p>
                  <p className="text-[9px] text-gray-500">ARR Projected</p>
                </div>
                <div className="flex gap-1 items-end h-6">
                  {[40, 50, 45, 60, 55, 75, 80].map((h, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-green-500/40 rounded-t-[1px]"
                      style={{ height: `${h}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* --- CENTER: MARGIN BADGE (Brand Purple) --- */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  repeatType: "reverse",
                }}
                className="bg-[#18181b] border border-[#8B2FC9]/50 shadow-[0_0_20px_rgba(139,47,201,0.3)] px-3 py-1.5 rounded-full flex items-center gap-2"
              >
                <TrendingUp size={12} className="text-[#8B2FC9]" />
                <span className="text-[10px] font-bold text-white whitespace-nowrap">
                  Net Margin <span className="text-[#8B2FC9]">+{margin}%</span>
                </span>
              </motion.div>
            </div>

            {/* --- SECTION 2: FINOPS (Efficiency) --- */}
            {/* --- SECTION 2: FINOPS (Efficiency) - UPSCALED --- */}
            <div className="flex-[1.5] p-8 relative bg-gradient-to-b from-transparent to-[#8B2FC9]/5">
              {" "}
              {/* Changed flex-1 to flex-[1.5] and p-5 to p-8 */}
              <div className="flex justify-between items-start mb-4">
                {" "}
                {/* Increased margin */}
                <div className="flex items-center gap-3 text-gray-400">
                  <BarChart2 size={18} /> {/* Bigger Icon */}
                  <span className="text-sm font-semibold">Cloud Burn</span>{" "}
                  {/* Bigger Text */}
                </div>
                <span className="px-2 py-1 rounded bg-[#8B2FC9]/10 text-[#8B2FC9] text-[10px] font-bold border border-[#8B2FC9]/20">
                  OPTIMIZED
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">$12.5k</p>{" "}
                  {/* Bigger Number (text-3xl) */}
                  <p className="text-xs text-gray-500">Monthly Savings</p>
                </div>

                {/* Taller Graph */}
                <div className="flex gap-1.5 items-end h-12">
                  {" "}
                  {/* Increased Height h-6 -> h-12 */}
                  {[80, 70, 65, 50, 40, 30, 25].map((h, i) => (
                    <div
                      key={i}
                      className="w-2 bg-[#8B2FC9]/40 rounded-t-[1px]"
                      style={{ height: `${h}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-2.5 bg-black/40 border-t border-white/5">
              <div className="flex items-center gap-2 opacity-60">
                <Terminal size={10} className="text-gray-400" />
                <span className="text-[9px] font-mono text-gray-400">
                  syncing_crm_to_cloud.sh...{" "}
                  <span className="text-green-400">Done</span>
                </span>
              </div>
            </div>
          </div>

          {/* Floating Chip (Small) */}
          <motion.div
            className="absolute top-10 -right-4 bg-[#0a0a0c]/80 border border-white/10 py-2 px-3 rounded-lg shadow-xl z-20 backdrop-blur-md"
            style={{
              transform: `translate(${mousePosition.x * -20}px, ${
                mousePosition.y * 20
              }px)`,
            }}
          >
            <div className="flex items-center gap-2">
              <Target size={12} className="text-green-400" />
              <div>
                <p className="text-[8px] text-gray-500 uppercase font-bold">
                  Accuracy
                </p>
                <p className="text-xs font-bold text-white">99.8%</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
