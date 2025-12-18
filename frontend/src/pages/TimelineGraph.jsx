import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const TimelineGraph = ({ data }) => {
  if (!data || data.length === 0) return (
    <div className="bg-[#1a1b20] h-[350px] rounded-2xl flex items-center justify-center text-gray-500">
      No timeline data available
    </div>
  );

  return (
    <div className="bg-[#1a1b20] border border-white/5 p-6 rounded-2xl h-[400px] flex flex-col">
      <h3 className="text-lg font-bold text-white mb-6">Daily Spend Trend</h3>
      
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a02ff1" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#a02ff1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#666" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(str) => {
                const date = new Date(str);
                return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
              }}
            />
            <YAxis 
              stroke="#666" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(val) => `$${val}`} 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f0f11', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#a02ff1' }}
              formatter={(value) => [`$${value.toFixed(2)}`, 'Cost']}
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
            />
            <Area 
              type="monotone" 
              dataKey="cost" 
              stroke="#a02ff1" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorCost)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TimelineGraph;