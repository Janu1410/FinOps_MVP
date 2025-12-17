// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

// 1. FIXED PROP DESTRUCTURING (Add curly braces)
const Navbar = ({ onOpenAuth }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#0f0f11]/80 backdrop-blur-md border-b border-white/10 py-4' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group"> 
            <div className="relative w-6 h-6 rounded-full overflow-hidden bg-black border border-white/5 group-hover:border-[#a02ff1]/50 transition-colors">
              <div className="absolute left-0 top-0 w-[44%] h-full bg-[#7e32ec]"></div>
              <div className="absolute right-0 top-0 w-[44%] h-full flex flex-col justify-between">
                  <div className="h-[46%] w-full bg-[#a02ff1]"></div>
                  <div className="h-[46%] w-full bg-[#a02ff1]"></div>
              </div>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white group-hover:text-white/90 transition-colors">
              K&Co.
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#services" className="hover:text-white transition-colors relative group">
              Services <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#a02ff1] transition-all group-hover:w-full"></span>
            </a>
            <a href="#about" className="hover:text-white transition-colors relative group">
              About <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#a02ff1] transition-all group-hover:w-full"></span>
            </a>
            <a href="#pricing" className="hover:text-white transition-colors relative group">
              Pricing <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#a02ff1] transition-all group-hover:w-full"></span>
            </a>
            <a href="#contact" className="hover:text-white transition-colors relative group">
              Contact <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#a02ff1] transition-all group-hover:w-full"></span>
            </a>
            
            {/* 2. ATTACH EVENT HANDLER TO BUTTON */}
            <button 
              onClick={onOpenAuth}
              className="px-5 py-2.5 rounded-full border border-white/20 text-white hover:bg-[#a02ff1] hover:border-[#a02ff1] transition-all duration-300 shadow-[0_0_15px_rgba(160,47,241,0)] hover:shadow-[0_0_20px_rgba(160,47,241,0.4)] font-semibold"
            >
              Get 90-Day Plan
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white hover:text-[#a02ff1] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0f0f11] pt-24 px-6 md:hidden animate-in slide-in-from-top-10 fade-in duration-200">
          <div className="flex flex-col gap-6 text-xl font-bold text-gray-300">
            <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#a02ff1]">Services</a>
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#a02ff1]">About</a>
            <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#a02ff1]">Pricing</a>
            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#a02ff1]">Contact</a>
            
            {/* 3. ATTACH EVENT HANDLER TO MOBILE BUTTON */}
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="w-full py-4 bg-[#a02ff1] text-white rounded-xl mt-4 shadow-lg shadow-purple-900/50"
            >
              Get 90-Day Plan
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;