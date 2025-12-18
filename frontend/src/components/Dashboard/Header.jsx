// src/components/Header.jsx
import React, { useState } from 'react';
import { Search, Bell, Download, MapPin, ChevronDown } from 'lucide-react';

const Header = ({ title }) => {
  const [selectedCity, setSelectedCity] = useState('New York, USA');

  return (
    // HEIGHT: h-[64px], LEFT: left-[240px]
    <header className="fixed top-0 left-[240px] right-0 h-[64px] bg-[#0f0f11]/90 backdrop-blur-md border-b border-white/5 z-40 flex items-center px-6 justify-between">
      
      {/* Left: Title */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium uppercase tracking-wider mb-0.5">
          <span className="hover:text-[#a02ff1] cursor-pointer">K&Co.</span>
          <span>/</span>
          <span className="text-[#a02ff1]">Dashboard</span>
        </div>
        <h1 className="text-lg font-bold text-white tracking-tight">{title}</h1>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex flex-1 justify-center px-8">
        <div className="relative w-full max-w-sm group/search">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/search:text-[#a02ff1] transition-colors" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-[#1a1b20]/50 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white outline-none focus:bg-[#0f0f11] focus:border-[#a02ff1] transition-all"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        
        {/* Region Selector */}
        <div className="hidden xl:flex items-center gap-2 bg-[#1a1b20] border border-white/10 rounded-md p-1 pr-2">
          <div className="p-1 bg-[#a02ff1]/10 rounded text-[#a02ff1]"><MapPin size={12} /></div>
          <div className="flex flex-col">
             <span className="text-[8px] text-gray-500 font-bold uppercase leading-none">Region</span>
             <span className="text-[10px] font-semibold text-white leading-none mt-0.5">{selectedCity}</span>
          </div>
          <ChevronDown size={10} className="text-gray-600 ml-1 cursor-pointer hover:text-white" />
        </div>
        
        <div className="h-6 w-px bg-white/10 hidden lg:block"></div>
        
        {/* Actions Buttons */}
        <div className="flex items-center gap-1">
            <button className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">
            <Bell size={16} />
            <span className="absolute top-1.5 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-[#0f0f11]"></span>
            </button>

            <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">
            <Download size={16} />
            </button>
        </div>

        {/* User Profile */}
        <div className="pl-2 border-l border-white/10 ml-1">
          <button className="group flex items-center gap-2 p-1 rounded-full hover:bg-white/5 transition-all">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#a02ff1] to-[#60a5fa] flex items-center justify-center text-white font-bold text-xs shadow-lg ring-1 ring-[#0f0f11]">
                KC
            </div>
            
            <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-white group-hover:text-[#a02ff1] transition-colors">Client Admin</div>
            </div>
            
            <ChevronDown size={12} className="text-gray-500 group-hover:text-white transition-colors" />
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;