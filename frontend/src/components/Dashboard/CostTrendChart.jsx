import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const CostTrendChart = ({ data }) => {
  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    // Reduced padding (p-5) and min-height (min-h-[300px])
    <div className="xl:col-span-2 bg-[#1a1b20]/60 backdrop-blur-md border border-white/5 rounded-2xl p-5 flex flex-col shadow-xl min-h-[300px]">
      <div className="mb-4 flex justify-between items-center h-8">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <TrendingUp size={16} className="text-[#a02ff1]" /> Daily Cost Trend
        </h3>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a02ff1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#a02ff1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickFormatter={(str) => str.slice(5)} tickMargin={10} axisLine={false} tickLine={false} />
            <YAxis stroke="#6b7280" fontSize={10} tickFormatter={(val) => `$${val}`} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f0f11', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} 
              itemStyle={{ color: '#fff' }} 
              formatter={(value) => [formatCurrency(value), 'Cost']} 
            />
            <Area type="monotone" dataKey="cost" stroke="#a02ff1" strokeWidth={2} fillOpacity={1} fill="url(#colorCost)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CostTrendChart;