import React from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart } from 'lucide-react'; // Import the icon

const COLORS = ['#a02ff1', '#60a5fa', '#34d399', '#f87171', '#fbbf24'];

const ServiceSpendChart = ({ data, title }) => { 
  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    // Compact Container: rounded-2xl, p-5, min-h-[300px]
    <div className="bg-[#1a1b20]/60 backdrop-blur-md border border-white/5 rounded-2xl p-5 flex flex-col shadow-xl min-h-[300px]">
      
      {/* Dynamic Header */}
      <div className="mb-4 flex justify-between items-center h-8">
         <h3 className="text-sm font-bold text-white flex items-center gap-2">
           <PieChart size={16} className="text-blue-400" /> {title || 'Spend by Service'}
         </h3>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
            
            <XAxis 
              type="number" 
              stroke="#6b7280" 
              fontSize={10} 
              tickFormatter={(val) => `$${val}`} 
              axisLine={false} 
              tickLine={false}
            />
            
            <YAxis 
              dataKey="name" 
              type="category" 
              width={100} 
              stroke="#9ca3af" 
              fontSize={10} 
              tick={{fill: '#9ca3af'}} 
              axisLine={false} 
              tickLine={false}
            />
            
            <Tooltip 
              cursor={{fill: 'rgba(255,255,255,0.05)', radius: 4}} 
              contentStyle={{ backgroundColor: '#0f0f11', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} 
              formatter={(value) => formatCurrency(value)} 
            />
            
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
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