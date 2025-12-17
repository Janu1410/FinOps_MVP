import React from 'react';

const Logo = ({ className = "w-8 h-8" }) => {
  return (
    <div className={`relative rounded-full overflow-hidden shrink-0 ${className}`}>
      {/* Left Half: Dark/Black (Slate-900) */}
      <div className="absolute left-0 top-0 w-1/2 h-full bg-slate-900"></div>
      
      {/* Right Half Container */}
      <div className="absolute right-0 top-0 w-1/2 h-full flex flex-col">
          {/* Top Right: Primary Purple */}
          <div className="h-1/2 w-full bg-purple-600"></div> 
          
          {/* Bottom Right: Vibrant Pink/Fuchsia */}
          <div className="h-1/2 w-full bg-fuchsia-500"></div> 
      </div>
    </div>
  );
};

export default Logo;