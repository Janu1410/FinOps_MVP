import React from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Settings2 } from 'lucide-react';

const COLORS = ['#a02ff1', '#60a5fa', '#34d399', '#f87171', '#fbbf24'];

const ServiceSpendChart = ({ data, title, limit = 8, onLimitChange }) => { 
  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  // Calculate dynamic height based on number of items
  const chartHeight = Math.max(400, data.length * 35 + 100);

  return (
    // Compact Container: rounded-2xl, p-5, dynamic height
    <div className="bg-[#1a1b20]/60 backdrop-blur-md border border-white/5 rounded-2xl p-5 flex flex-col shadow-xl" style={{ minHeight: `${chartHeight}px` }}>
      
      {/* Dynamic Header */}
      <div className="mb-4 flex justify-between items-center h-8">
         <h3 className="text-sm font-bold text-white flex items-center gap-2">
           <PieChart size={16} className="text-blue-400" /> {title || 'Spend by Service'}
         </h3>
         {onLimitChange && (
           <div className="flex items-center gap-2">
             <Settings2 size={12} className="text-gray-500" />
             <select
               value={limit}
               onChange={(e) => onLimitChange(Number(e.target.value))}
               className="text-[10px] bg-[#0f0f11] border border-white/10 hover:border-[#a02ff1]/50 rounded px-2 py-1 text-gray-300 focus:outline-none focus:border-[#a02ff1] focus:ring-2 focus:ring-[#a02ff1]/50 focus:shadow-[0_0_15px_rgba(160,47,241,0.4)] transition-all cursor-pointer"
               style={{
                 colorScheme: 'dark'
               }}
             >
               <option value={5} style={{ backgroundColor: '#0f0f11', color: '#d1d5db' }}>Top 5</option>
               <option value={8} style={{ backgroundColor: '#0f0f11', color: '#d1d5db' }}>Top 8</option>
               <option value={10} style={{ backgroundColor: '#0f0f11', color: '#d1d5db' }}>Top 10</option>
               <option value={15} style={{ backgroundColor: '#0f0f11', color: '#d1d5db' }}>Top 15</option>
             </select>
           </div>
         )}
      </div>

      <div className="flex-1 w-full min-h-0" style={{ height: `${chartHeight - 80}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20, top: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
            
            <XAxis 
              type="number" 
              stroke="#6b7280" 
              fontSize={11} 
              tickFormatter={(val) => {
                if (val >= 1000) return `$${(val/1000).toFixed(1)}k`;
                return `$${val}`;
              }} 
              axisLine={false} 
              tickLine={false}
              domain={[0, 'dataMax']}
            />
            
            <YAxis 
              dataKey="name" 
              type="category" 
              width={150}
              stroke="#9ca3af" 
              fontSize={10} 
              tick={{fill: '#d1d5db'}} 
              axisLine={false} 
              tickLine={false}
              tickFormatter={(value) => {
                // Truncate long names with better length
                if (value.length > 22) {
                  return value.substring(0, 20) + '...';
                }
                return value;
              }}
            />
            
            <Tooltip 
              cursor={{fill: 'rgba(255,255,255,0.05)', radius: 4}} 
              contentStyle={{ backgroundColor: '#1a1b20', borderColor: 'rgba(255,255,255,0.2)', borderRadius: '8px', fontSize: '12px', color: '#fff', padding: '8px 12px' }} 
              itemStyle={{ color: '#fff' }}
              formatter={(value) => formatCurrency(value)} 
            />
            
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ServiceSpendChart;