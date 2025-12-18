import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';

const ProductList = ({ title, data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="glass-card !p-0 overflow-hidden flex flex-col h-full">
      {/* Card Header */}
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          {title}
          <span className="px-2 py-0.5 rounded-full bg-[#a02ff1]/10 border border-[#a02ff1]/20 text-[#a02ff1] text-xs shadow-[0_0_10px_rgba(160,47,241,0.2)]">
            {data.length} Issues
          </span>
        </h3>
        <button className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1">
          View All <ArrowRight size={12} />
        </button>
      </div>
      
      {/* Table Area */}
      <div className="overflow-x-auto">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Resource Name</th>
              <th>Service</th>
              <th>Status</th>
              <th>Region</th>
              <th className="text-right">Monthly Waste</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 8).map((item, idx) => (
              <tr key={idx} className="group">
                <td className="font-medium text-white max-w-[200px] truncate" title={item.name}>
                  {item.name}
                </td>
                <td className="text-gray-400">{item.service}</td>
                <td>
                  <span className="status-badge badge-red flex w-fit items-center gap-1">
                    <AlertCircle size={10} /> On-Demand
                  </span>
                </td>
                <td className="text-gray-400">{item.region || 'Global'}</td>
                <td className="text-right font-mono font-bold text-[#a02ff1]">
                  ${item.cost.toFixed(2)}
                </td>
                <td>
                  <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#a02ff1] hover:text-white text-xs text-gray-400 transition-all border border-white/5">
                    Optimize
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;