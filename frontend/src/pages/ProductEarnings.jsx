import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ProductEarnings = ({ data }) => {
  return (
    <div className="bg-[#1a1b20] border border-white/5 p-6 rounded-2xl h-[400px] flex flex-col">
      <h3 className="text-lg font-bold text-white mb-2">Top Spend Drivers</h3>
      <p className="text-xs text-gray-500 mb-6">Highest cost services this period</p>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 30 }}>
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={100} 
              tick={{ fill: '#9ca3af', fontSize: 11 }} 
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              cursor={{fill: 'transparent'}}
              contentStyle={{ backgroundColor: '#0f0f11', border: '1px solid #333', borderRadius: '8px' }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
              {data && data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? '#a02ff1' : '#3f3f46'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductEarnings;