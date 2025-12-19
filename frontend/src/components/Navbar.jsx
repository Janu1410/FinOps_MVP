import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
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
          
          {/* --- LOGO --- */}
          <Link to="/" className="flex items-center gap-2 group"> 
            <img 
              src="/k&cologo.svg" 
              alt="K&Co Logo" 
              className="w-10 h-10 object-contain group-hover:opacity-90 transition-opacity"
            />
            <span className="text-2xl font-bold tracking-tight text-white group-hover:text-white/90 transition-colors">
              K&Co.
            </span>
          </Link>

          {/* --- DESKTOP NAVIGATION --- */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
           <a href="#about" className="hover:text-white transition-colors relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#a02ff1] transition-all group-hover:w-full"></span>
            </a>
            <a href="#services" className="hover:text-white transition-colors relative group">
              Services
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#a02ff1] transition-all group-hover:w-full"></span>
            </a>

            <a href="#pricing" className="hover:text-white transition-colors relative group">
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#a02ff1] transition-all group-hover:w-full"></span>
            </a>

            <a href="#contact" className="hover:text-white transition-colors relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#a02ff1] transition-all group-hover:w-full"></span>
            </a>
            
            {/* CTA BUTTON (Acts as Sign Up / Login) */}
            <Link to="/sign-up">
              <button className="px-5 py-2.5 rounded-full border border-white/20 text-white hover:bg-[#a02ff1] hover:border-[#a02ff1] transition-all duration-300 shadow-[0_0_15px_rgba(160,47,241,0)] hover:shadow-[0_0_20px_rgba(160,47,241,0.4)] font-semibold">
                Get 90-Day Plan
              </button>
            </Link>
          </div>

          {/* --- MOBILE MENU TOGGLE --- */}
          <button 
            className="md:hidden text-white hover:text-[#a02ff1] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* --- MOBILE MENU OVERLAY --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0f0f11] pt-24 px-6 md:hidden animate-in slide-in-from-top-10 fade-in duration-200">
          <div className="flex flex-col gap-6 text-xl font-bold text-gray-300">
            <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#a02ff1]">Services</a>
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#a02ff1]">About</a>
            <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#a02ff1]">Pricing</a>
            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#a02ff1]">Contact</a>
            
            {/* Mobile CTA */}
            <Link to="/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="w-full py-4 bg-[#a02ff1] text-white rounded-xl mt-4 shadow-lg shadow-purple-900/50">
                Get 90-Day Plan
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;