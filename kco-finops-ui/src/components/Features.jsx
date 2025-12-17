import React from 'react';
import { Clock, Activity, ArrowRight, MoreHorizontal, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Features = () => {
  
  // Stagger Animation for the whole section
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  // Upward Fade for individual items
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };

  return (
    <section className="py-24 bg-[#0f0f11] relative overflow-hidden" id="services">
      
      {/* Background Decor - Animated Pulse */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-[#8B2FC9]/5 rounded-full blur-[120px] pointer-events-none"
      />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-6xl mx-auto px-6 relative z-10"
      >
        
        {/* --- HEADER --- */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B2FC9]/10 text-[#8B2FC9] text-xs font-bold uppercase mb-3 border border-[#8B2FC9]/20">
                <MoreHorizontal size={14} /> Service Models
            </div>
          </motion.div>
          
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-white mb-4">
            Cloud FinOps <span className="text-[#8B2FC9]">Service Models</span>
          </motion.h2>
          
          <motion.p variants={itemVariants} className="text-gray-400 text-base leading-relaxed">
            Choose the engagement model that fits your maturity level—from fast insights to continuous intelligence.
          </motion.p>
        </div>

        {/* --- SERVICE CARDS (Interactive) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            
            {/* Card 1: Snapshot */}
            <ServiceCard 
                icon={Clock} 
                title="FinOps Snapshot™" 
                desc="A fixed-duration engagement (3-4 weeks) to analyze a defined window of cloud data, surface cost drivers, and identify immediate quick wins."
                color="blue"
                tags={['Quick Start', 'Fixed Cost']}
                features={['Uses 30–90 days of billing data', 'Identifies idle resources', 'Delivers savings plan']}
                variants={itemVariants}
            />

            {/* Card 2: Continuous */}
            <ServiceCard 
                icon={Activity} 
                title="Continuous Integration™" 
                desc="An always-on FinOps operating model with real-time cloud data ingestion, continuous optimization, and a weekly savings cadence."
                color="purple"
                tags={['Ongoing', 'Monitoring']}
                features={['Real-time data ingestion', 'Continuous waste detection', 'Weekly executive insights']}
                variants={itemVariants}
            />
        </div>

        {/* Bottom CTA */}
        <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            className="w-full bg-[#0a0a0c] border border-white/10 rounded-2xl p-8 text-center relative overflow-hidden group shadow-2xl"
        >
            {/* Moving Gradient Background */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(139,47,201,0.05)_50%,transparent_75%,transparent_100%)] bg-[size:250%_250%] pointer-events-none animate-gradient-slow group-hover:animate-gradient-fast"></div>
            
            <h4 className="text-xl font-bold text-white mb-2 relative z-10">Not Sure Which Model Fits?</h4>
            <p className="text-gray-400 text-sm mb-5 relative z-10">Most companies start with a Snapshot to identify quick wins.</p>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-[#8B2FC9] hover:bg-[#7a25b3] text-white font-bold rounded-lg transition-all shadow-lg shadow-purple-900/30 relative z-10 text-sm"
            >
              Book a Free Consultation
            </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

const ServiceCard = ({ icon: Icon, title, desc, color, tags, features, variants }) => {
    // Dynamic Colors based on props
    const isPurple = color === 'purple';
    const accentColor = isPurple ? 'text-[#8B2FC9]' : 'text-blue-400';
    const bgClass = isPurple ? 'bg-[#8B2FC9]/10' : 'bg-blue-500/10';
    const borderClass = isPurple ? 'border-[#8B2FC9]/20' : 'border-blue-500/20';
    const hoverBorder = isPurple ? 'group-hover:border-[#8B2FC9]/50' : 'group-hover:border-blue-500/50';

    return (
        <motion.div 
            variants={variants}
            whileHover={{ y: -8 }}
            className={`bg-[#121214] border border-white/10 rounded-3xl p-8 ${hoverBorder} transition-colors duration-300 flex flex-col h-full group relative overflow-hidden shadow-lg hover:shadow-xl`}
        >
            {/* Subtle Grid Background inside card */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${bgClass} flex items-center justify-center border ${borderClass} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={accentColor} size={28} />
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                        {tags.map((tag, i) => (
                            <span key={i} className={`px-2 py-0.5 rounded-full ${bgClass} border ${borderClass} ${accentColor} text-[10px] font-bold uppercase`}>{tag}</span>
                        ))}
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-white transition-colors">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">{desc}</p>
                
                <div className="w-full h-[1px] bg-white/5 mb-6 group-hover:bg-white/10 transition-colors"></div>

                <div className="space-y-3 mb-8 flex-1">
                    {features.map((f, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <CheckCircle2 size={16} className={accentColor} />
                            <span className="text-gray-300 text-sm">{f}</span>
                        </div>
                    ))}
                </div>

                <button className={`w-full py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 group/btn hover:${bgClass} hover:${borderClass} transition-all`}>
                    Learn More <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </motion.div>
    )
}

export default Features;