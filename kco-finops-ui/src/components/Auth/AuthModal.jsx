import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SignIn, SignUp } from "@clerk/clerk-react";

const AuthModal = ({ isOpen, onClose }) => {
  const [view, setView] = useState("sign-in");

  if (!isOpen) return null;

  // Defines the shared style for both components to ensure they look exactly the same
  const sharedAppearance = {
    elements: {
      rootBox: "w-full",
      card: "bg-[#121214] border border-white/10 shadow-2xl rounded-3xl w-full p-8", // Added p-8 for padding consistency
      headerTitle: "text-white text-2xl font-bold",
      headerSubtitle: "text-gray-400 text-sm",
      
      // Social Buttons (Google/GitHub)
      socialButtonsBlockButton: "bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl h-10",
      socialButtonsBlockButtonText: "font-medium",
      dividerLine: "bg-white/10",
      dividerText: "text-gray-500",
      
      // Form Fields
      formFieldLabel: "text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1",
      formFieldInput: "bg-[#0a0a0c] border border-white/10 text-white rounded-xl py-2 px-3 focus:border-[#8B2FC9] focus:ring-[#8B2FC9]/20 transition-all outline-none",
      
      // Submit Button
      formButtonPrimary: "bg-[#8B2FC9] hover:bg-[#7a25b3] text-white font-bold rounded-xl py-3 shadow-[0_4px_14px_0_rgba(139,47,201,0.39)] transition-all",
      
      // Footer (Toggle Link)
      footerActionText: "text-gray-400 text-sm",
      footerActionLink: "text-[#8B2FC9] hover:text-white font-bold transition-colors ml-1",
      
      // Alerts (Error messages)
      alert: "bg-red-500/10 border border-red-500/20 text-red-400",
      alertText: "text-red-400"
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative z-10 w-full max-w-[420px]"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute -top-12 right-0 p-2 text-gray-400 hover:text-white bg-white/10 rounded-full transition-all hover:rotate-90"
            >
              <X size={24} />
            </button>

            {view === "sign-in" ? (
              <SignIn 
                forceRedirectUrl="/dashboard"
                onSignUpClick={() => setView("sign-up")}
                appearance={sharedAppearance} // Using the shared style variable
              />
            ) : (
              <SignUp 
                forceRedirectUrl="/dashboard"
                onSignInClick={() => setView("sign-in")}
                appearance={sharedAppearance} // Using the shared style variable
              />
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;