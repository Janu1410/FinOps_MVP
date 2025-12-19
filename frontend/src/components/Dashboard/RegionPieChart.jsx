import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { MapPin, Settings2 } from 'lucide-react';

const COLORS = ['#a02ff1', '#60a5fa', '#34d399', '#f87171', '#fbbf24', '#a78bfa', '#fb7185', '#38bdf8'];

const RegionPieChart = ({ data, limit = 8, onLimitChange }) => {
  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="bg-[#1a1b20]/60 backdrop-blur-md border border-white/5 rounded-2xl p-5 flex flex-col shadow-xl min-h-[300px]">
      <div className="mb-4 flex justify-between items-center h-8">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <MapPin size={16} className="text-blue-400" /> Regional Distribution
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
              <option value={12} style={{ backgroundColor: '#0f0f11', color: '#d1d5db' }}>Top 12</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex-1 w-full min-h-0 flex flex-col lg:flex-row items-start gap-4">
        {/* Pie Chart */}
        <div className="flex-1 w-full flex items-center justify-center" style={{ minHeight: '320px', height: '320px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 30, right: 40, bottom: 30, left: 40 }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                label={({ percent, cx, cy, midAngle, innerRadius, outerRadius }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = outerRadius + 25; // Position labels outside the pie
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  
                  return (
                    <text
                      x={x}
                      y={y}
                      fill="white"
                      textAnchor={x > cx ? 'start' : 'end'}
                      dominantBaseline="central"
                      fontSize="9"
                      fontWeight="400"
                    >
                      {`${(percent * 100).toFixed(0)}%`}
                    </text>
                  );
                }}
                outerRadius={95}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1b20', borderColor: 'rgba(255,255,255,0.2)', borderRadius: '8px', fontSize: '12px', color: '#fff', padding: '8px 12px' }} 
                itemStyle={{ color: '#fff' }}
                formatter={(value, name) => [formatCurrency(value), name]} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Custom Legend that wraps properly */}
        <div className="flex-shrink-0 w-full lg:w-auto lg:max-w-[220px] lg:pr-2">
          <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-2">
            {data.map((entry, index) => (
              <div key={`legend-${index}`} className="flex items-center gap-2 text-[10px] min-w-0">
                <div 
                  className="w-3 h-3 rounded-sm flex-shrink-0" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-gray-300 truncate flex-1" title={entry.name}>
                  {entry.name}
                </span>
                <span className="text-gray-500 flex-shrink-0">
                  {formatCurrency(entry.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionPieChart;

