import React from 'react';
import { Target, Zap, Users, ArrowRight, TrendingUp, ShieldCheck, BarChart3, Earth } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  
  // Animation Variants
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

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };

  return (
    <section className="py-24 bg-[#0f0f11] relative overflow-hidden" id="about">
      
      {/* Background Glow - Animated Pulse */}
      <motion.div 
        animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-[#8B2FC9]/10 rounded-full blur-[120px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- PART 1: WHO WE ARE --- */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <motion.span variants={itemVariants} className="text-[#8B2FC9] text-xs font-bold uppercase tracking-[0.2em] mb-4 block">
            Who We Are
          </motion.span>
          
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">
            Your Strategic <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B2FC9] to-purple-400">Cloud FinOps Partner</span>
          </motion.h2>
          
          <motion.p variants={itemVariants} className="text-gray-400 text-lg leading-relaxed mb-6">
            We're not just another cost-cutting consultancy. We're <span className="text-white font-semibold">K&Co.</span> — a team of former cloud engineers, FinOps practitioners, and financial analysts who've walked in your shoes. We transform cloud spending from a frustrating cost center into a strategic growth lever.
          </motion.p>
          
          <motion.p variants={itemVariants} className="text-gray-500 text-base font-light max-w-2xl mx-auto">
            Serving B2B SaaS, data platforms, and AI companies who believe that every dollar saved on infrastructure is a dollar earned for innovation.
          </motion.p>
        </motion.div>

        {/* --- PART 2: STATS ROW --- */}
        <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-white/5 py-12 mb-24"
        >
            <StatItem 
                icon={TrendingUp} 
                value="10-30%" 
                label="Average Cost Reduction" 
                color="text-white" 
                iconColor="text-[#8B2FC9]" 
            />
            <StatItem 
                icon={Earth} 
                value="50+" 
                label="Enterprise Clients" 
                color="text-white"
                iconColor="text-[#8B2FC9]"
            />
            <StatItem 
                icon={BarChart3} 
                value="$500M+" 
                label="Cloud Spend Managed" 
                color="text-white"
                iconColor="text-[#8B2FC9]"
            />
            <StatItem 
                icon={ShieldCheck} 
                value="98%" 
                label="Client Retention" 
                color="text-white"
                iconColor="text-[#8B2FC9]"
            />
        </motion.div>

        {/* --- PART 3: WHY PARTNER WITH US --- */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
        >
            <h3 className="text-3xl font-bold text-white mb-4">Why Partner With Us?</h3>
            <p className="text-gray-400">We bring more than tools and reports—we bring a partnership mindset that drives real change.</p>
        </motion.div>

        <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
            
            {/* Card 1: Mission Driven */}
            <ValueCard 
                icon={Target}
                title="Mission-Driven"
                desc="We exist to eliminate wasteful cloud spending so companies can invest more in innovation."
                color="bg-[#8B2FC9]"
                iconColor="text-white"
            />

            {/* Card 2: Engineering First */}
            <ValueCard 
                icon={Zap}
                title="Engineering-First"
                desc="Founded by engineers, for engineers. We speak your language and respect your infrastructure."
                color="bg-blue-600"
                iconColor="text-white"
            />

            {/* Card 3: Partner, Not Vendor */}
            <ValueCard 
                icon={Users}
                title="Partner, Not Vendor"
                desc="We embed with your team, share risks and rewards, and celebrate your growth as our own."
                color="bg-[#8B2FC9]"
                iconColor="text-white"
            />

        </motion.div>

      </div>
    </section>
  );
};

// --- HELPER COMPONENTS WITH ANIMATION ---

const StatItem = ({ icon: Icon, value, label, color, iconColor }) => (
    <motion.div 
      variants={{
        hidden: { scale: 0.8, opacity: 0 },
        visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } }
      }}
      whileHover={{ scale: 1.05 }}
      className="flex flex-col items-center justify-center text-center"
    >
        <div className="flex items-center gap-2 mb-2">
            <Icon size={20} className={iconColor} />
            <span className={`text-3xl md:text-4xl font-bold ${color}`}>{value}</span>
        </div>
        <span className="text-sm text-gray-500 uppercase tracking-wide font-medium">{label}</span>
    </motion.div>
);

const ValueCard = ({ icon: Icon, title, desc, color, iconColor }) => (
    <motion.div 
      variants={{
        hidden: { y: 30, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      }}
      whileHover={{ y: -10, borderColor: "rgba(139, 47, 201, 0.4)" }} // Hover lift + Purple Border Glow
      className="bg-[#121214] border border-white/10 rounded-2xl p-8 transition-all duration-300 group shadow-lg"
    >
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={24} className={iconColor} />
        </div>
        
        <h4 className="text-xl font-bold text-white mb-3">{title}</h4>
        <p className="text-gray-400 text-sm leading-relaxed mb-8 min-h-[60px]">
            {desc}
        </p>

        <div className="flex items-center gap-2 text-[#8B2FC9] text-sm font-bold cursor-pointer group-hover:gap-3 transition-all">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B2FC9]"></span>
            Our Approach 
            <ArrowRight size={14} />
        </div>
    </motion.div>
);

export default About;