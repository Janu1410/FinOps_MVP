import React from 'react';
import { CheckCircle2, ArrowRight, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const InquirySection = () => {
  
  // Animation Variants for Parent Container
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

  // Slide-in from left for content
  const slideLeftVariants = {
    hidden: { x: -40, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };

  // Slide-in from right for form
  const slideRightVariants = {
    hidden: { x: 40, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };

  // Fade-up for form elements
  const formItemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.4 } 
    }
  };

  return (
    <section className="py-24 bg-[#0f0f11] relative overflow-hidden" id="contact">
      
      {/* Background Glow - Animated Pulse */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-0 bottom-0 w-[600px] h-[600px] bg-[#8B2FC9]/10 rounded-full blur-[120px] pointer-events-none"
      />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10"
      >
        
        {/* LEFT SIDE: The Pitch */}
        <motion.div variants={slideLeftVariants}>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-6">
            <motion.span 
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-[#8B2FC9]"
            />
            Accepting New Audits
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            See your baseline & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#8B2FC9]">Quick Wins.</span>
          </h2>
          
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            Book a 3–4 week <strong>Cloud FinOps Audit</strong>. 
            We deliver a focused 90-day plan so you can hit plan and expand margins.
          </p>

          <div className="space-y-4 mb-10">
            {[
              "For VC-backed & mid-market B2B SaaS teams",
              "Ideal for 20–500 FTE organizations",
              "Secure-by-default (Read-only access)"
            ].map((text, index) => (
              <motion.div 
                key={index}
                variants={formItemVariants}
                className="flex items-center gap-3"
              >
                <CheckCircle2 className="text-[#8B2FC9]" size={20} />
                <p className="text-gray-300">{text}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            variants={formItemVariants}
            whileHover={{ x: 5 }}
            className="p-6 bg-white/5 border border-white/10 rounded-2xl max-w-md hover:bg-white/[0.07] transition-colors"
          >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#8B2FC9]/20 flex items-center justify-center text-[#8B2FC9]">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Direct Email</p>
                  <a href="mailto:partnerships@kandco.com" className="text-white font-medium hover:text-[#8B2FC9] transition-colors">
                    partnerships@kandco.com
                  </a>
                </div>
              </div>
          </motion.div>
        </motion.div>

        {/* RIGHT SIDE: The Form */}
        <motion.div 
          variants={slideRightVariants}
          className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl relative max-w-lg mx-auto w-full"
        >
          <motion.form variants={containerVariants} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <motion.div variants={formItemVariants} className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">First Name</label>
                <input type="text" className="w-full bg-[#0f0f11]/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-[#8B2FC9] focus:outline-none transition-all focus:ring-2 focus:ring-[#8B2FC9]/20" placeholder="Jane" />
              </motion.div>
              <motion.div variants={formItemVariants} className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Last Name</label>
                <input type="text" className="w-full bg-[#0f0f11]/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-[#8B2FC9] focus:outline-none transition-all focus:ring-2 focus:ring-[#8B2FC9]/20" placeholder="Doe" />
              </motion.div>
            </div>

            <motion.div variants={formItemVariants} className="space-y-1.5">
              <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Work Email</label>
              <input type="email" className="w-full bg-[#0f0f11]/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-[#8B2FC9] focus:outline-none transition-all focus:ring-2 focus:ring-[#8B2FC9]/20" placeholder="jane@company.com" />
            </motion.div>

            <motion.div variants={formItemVariants} className="space-y-1.5">
              <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">I am interested in</label>
              <select className="w-full bg-[#0f0f11]/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-[#8B2FC9] focus:outline-none transition-all focus:ring-2 focus:ring-[#8B2FC9]/20 cursor-pointer">
                <option className="bg-[#0f0f11]">Cloud FinOps Audit (3-4 Weeks)</option>
                <option className="bg-[#0f0f11]">Monthly Subscription Bundle</option>
                <option className="bg-[#0f0f11]">Other Inquiry</option>
              </select>
            </motion.div>

            <motion.div variants={formItemVariants} className="space-y-1.5">
              <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Message (Optional)</label>
              <textarea rows="3" className="w-full bg-[#0f0f11]/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-[#8B2FC9] focus:outline-none transition-all focus:ring-2 focus:ring-[#8B2FC9]/20 resize-none" placeholder="Tell us about your team size or cloud spend..."></textarea>
            </motion.div>

            <motion.div variants={formItemVariants}>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button" 
                className="w-full py-3.5 bg-[#8B2FC9] hover:bg-[#7e22ce] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(139,47,201,0.3)] hover:shadow-[0_0_30px_rgba(139,47,201,0.5)] text-sm"
              >
                Book Your Audit
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
            
            <motion.p variants={formItemVariants} className="text-center text-[10px] text-gray-500">
              We respect your inbox. No spam, ever.
            </motion.p>
          </motion.form>
        </motion.div>

      </motion.div>
    </section>
  );
};

export default InquirySection;