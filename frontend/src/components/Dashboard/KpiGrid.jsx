// src/components/dashboard/KpiGrid.jsx
import React from 'react';
import { DollarSign, MapPin, Server, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const KpiCard = ({ title, value, icon: Icon, color, subValue, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay * 0.1 }}
    whileHover={{ y: -5 }}
    // COMPACT: p-3 padding (was p-4)
    className="bg-[#1a1b20]/60 backdrop-blur-md border border-white/5 p-3 rounded-xl shadow-lg relative overflow-hidden group min-h-[100px]"
  >
    <div className={`absolute -top-10 -right-10 p-16 ${color} bg-opacity-5 blur-[40px] rounded-full group-hover:bg-opacity-10 transition-all duration-500`}></div>
    
    <div className="relative z-10 flex flex-col h-full justify-between">
      
      {/* Header Row: Icon + Badge */}
      <div className="flex justify-between items-start mb-2">
        <div className={`p-1.5 rounded-lg bg-white/5 ${color} bg-opacity-10 ring-1 ring-white/5`}>
          <Icon size={16} className={color} />
        </div>
        {subValue && (
            <span className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-gray-400 border border-white/5 font-mono whitespace-nowrap">
              {subValue}
            </span>
        )}
      </div>

      {/* Content Row: Title + Value */}
      <div>
        <div className="text-gray-500 text-[9px] font-bold uppercase tracking-widest truncate">{title}</div>
        
        {/* COMPACT FONT: text-xl (was 2xl) + truncate to prevent wrapping */}
        <div className="text-xl font-bold text-white tracking-tight mt-0.5 truncate" title={value}>
          {value}
        </div>
      </div>

    </div>
  </motion.div>
);

const KpiGrid = ({ spend, topRegion, topService }) => {
  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    // Grid matches the tight layout
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <KpiCard 
        delay={0} 
        title="Total Spend" 
        value={formatCurrency(spend)} 
        icon={DollarSign} 
        color="text-[#a02ff1]" 
        subValue="+12%" 
      />
      <KpiCard 
        delay={1} 
        title="Top Region" 
        value={topRegion?.name || 'N/A'} 
        icon={MapPin} 
        color="text-blue-400" 
        subValue={formatCurrency(topRegion?.value || 0)} 
      />
      <KpiCard 
        delay={2} 
        title="Top Service" 
        value={topService?.name || 'N/A'} 
        icon={Server} 
        color="text-emerald-400" 
        subValue={formatCurrency(topService?.value || 0)} 
      />
      <KpiCard 
        delay={3} 
        title="Anomalies" 
        value="3 Found" 
        icon={AlertTriangle} 
        color="text-amber-400" 
        subValue="Action Req." 
      />
    </div>
  );
};

export default KpiGrid;