// src/components/dashboard/FilterBar.jsx
import React from 'react';
import { Filter, RefreshCw, ChevronDown, BarChart2, Cloud, Settings, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const FilterBar = ({ data, filters, onChange, groupBy, onGroupChange }) => {
  const getOptions = (key) => {
    if (!data) return ['All'];
    const values = data.map(item => item[key] || 'Unknown');
    const unique = [...new Set(values)];
    return ['All', ...unique.sort()];
  };

  const Select = ({ label, field, displayLabel, icon: Icon, iconColor }) => (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={14} className={iconColor || "text-gray-500"} />}
        <label className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
          {displayLabel}
        </label>
      </div>
      <div className="relative group">
        <select
          value={filters[field]}
          onChange={(e) => onChange(prev => ({ ...prev, [field]: e.target.value }))}
          className="appearance-none bg-[#0f0f11] border border-white/10 hover:border-[#a02ff1]/50 rounded-lg pl-3 pr-8 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#a02ff1]/50 focus:shadow-[0_0_15px_rgba(160,47,241,0.4)] transition-all min-w-[140px] cursor-pointer text-gray-300"
          style={{
            colorScheme: 'dark'
          }}
        >
          {getOptions(label).map(opt => (
            <option key={opt} value={opt} style={{ backgroundColor: '#0f0f11', color: '#d1d5db' }}>{opt}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
      </div>
    </div>
  );

  // Columns we might want to group by (you can add more from your CSV)
  const groupOptions = [
    { label: 'Service Name', value: 'ServiceName' },
    { label: 'Region', value: 'RegionName' },
    { label: 'Discount Status', value: 'CommitmentDiscountStatus' }, // Column 16
    { label: 'Resource Type', value: 'ResourceType' },
    { label: 'Charge Category', value: 'ChargeCategory' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }} 
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1a1b20]/80 backdrop-blur-xl border border-white/5 p-4 rounded-xl flex flex-wrap gap-4 items-center shadow-lg"
    >
      <div className="flex items-center gap-2 text-sm text-gray-400 font-bold mr-2 uppercase tracking-wider">
        <Filter size={16} className="text-[#a02ff1]" /> Filters
      </div>
      
      <Select label="ProviderName" field="provider" displayLabel="Provider" icon={Cloud} iconColor="text-cyan-400" />
      <Select label="ServiceName" field="service" displayLabel="Service" icon={Settings} iconColor="text-[#a02ff1]" />
      <Select label="RegionName" field="region" displayLabel="Region" icon={MapPin} iconColor="text-green-400" />

      {/* Divider */}
      <div className="w-px h-8 bg-white/10 mx-2 hidden md:block"></div>

      {/* Group By Selector */}
      <div className="flex flex-col gap-1.5">
         <div className="flex items-center gap-2">
           <BarChart2 size={14} className="text-blue-400" />
           <label className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
             Group By
           </label>
         </div>
         <div className="relative group">
            <select
                value={groupBy}
                onChange={(e) => onGroupChange(e.target.value)}
                className="appearance-none bg-[#0f0f11] border border-blue-500/30 hover:border-blue-500/70 rounded-lg pl-3 pr-8 py-2 text-xs font-bold text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all min-w-[140px] cursor-pointer"
                style={{
                  colorScheme: 'dark'
                }}
            >
                {groupOptions.map(opt => (
                  <option key={opt.value} value={opt.value} style={{ backgroundColor: '#0f0f11', color: '#dbeafe' }}>{opt.label}</option>
                ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-blue-400" />
         </div>
      </div>
      
      <button 
        onClick={() => {
            onChange({ provider: 'All', service: 'All', region: 'All' });
            onGroupChange('ServiceName');
        }}
        className="ml-auto p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors border border-white/5"
        title="Reset All"
      >
        <RefreshCw size={16} />
      </button>
    </motion.div>
  );
};

export default FilterBar;