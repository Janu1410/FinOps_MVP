import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { AlertTriangle, Layers, TrendingUp } from 'lucide-react';

const CostConcentration = ({ groupedData, totalSpend }) => {
  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);

  const concentrationData = useMemo(() => {
    if (!groupedData || groupedData.length === 0 || totalSpend === 0) {
      return [
        { category: 'Top 1', value: 0, percentage: 0, cumulative: 0 },
        { category: 'Top 3', value: 0, percentage: 0, cumulative: 0 },
        { category: 'Top 5', value: 0, percentage: 0, cumulative: 0 }
      ];
    }

    const top1 = groupedData[0]?.value || 0;
    const top3 = groupedData.slice(0, 3).reduce((sum, item) => sum + (item.value || 0), 0);
    const top5 = groupedData.slice(0, 5).reduce((sum, item) => sum + (item.value || 0), 0);

    return [
      {
        category: 'Top 1',
        value: top1,
        percentage: (top1 / totalSpend) * 100,
        cumulative: (top1 / totalSpend) * 100,
        color: '#ef4444'
      },
      {
        category: 'Top 3',
        value: top3,
        percentage: (top3 / totalSpend) * 100,
        cumulative: (top3 / totalSpend) * 100,
        color: '#f59e0b'
      },
      {
        category: 'Top 5',
        value: top5,
        percentage: (top5 / totalSpend) * 100,
        cumulative: (top5 / totalSpend) * 100,
        color: '#10b981'
      }
    ];
  }, [groupedData, totalSpend]);

  const riskLevel = useMemo(() => {
    const top1Pct = concentrationData[0]?.percentage || 0;
    if (top1Pct > 50) return { level: 'High', color: 'text-red-400', bg: 'bg-red-400/10' };
    if (top1Pct > 30) return { level: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
    return { level: 'Low', color: 'text-green-400', bg: 'bg-green-400/10' };
  }, [concentrationData]);

  return (
    <div className="bg-[#1a1b20]/60 backdrop-blur-md border border-white/5 rounded-2xl p-5 flex flex-col shadow-xl min-h-[300px]">
      <div className="mb-4 flex justify-between items-center h-8">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers size={16} className="text-[#a02ff1]" />
          Cost Concentration
        </h3>
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold ${riskLevel.bg} ${riskLevel.color}`}>
          <AlertTriangle size={10} />
          {riskLevel.level} Risk
        </div>
      </div>

      {/* Risk Summary Card */}
      <div className="mb-4 p-3 bg-[#0f0f11] border border-white/10 rounded-lg">
        <div className="grid grid-cols-3 gap-2">
          {concentrationData.map((item, index) => (
            <div key={index} className="text-center">
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">{item.category}</p>
              <p className="text-sm font-bold text-white">{item.percentage.toFixed(1)}%</p>
            </div>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t border-white/10">
          <p className="text-[10px] text-gray-500 text-center mb-1">
            Top 1 service accounts for <span className="text-white font-bold">{concentrationData[0]?.percentage.toFixed(1)}%</span> of total spend
          </p>
          {groupedData && groupedData.length > 0 && (
            <p className="text-[10px] text-[#a02ff1] text-center font-semibold">
              {groupedData[0].name}
            </p>
          )}
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={concentrationData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
            <XAxis 
              type="number" 
              stroke="#6b7280" 
              fontSize={10} 
              tickFormatter={(val) => `${val.toFixed(0)}%`} 
              axisLine={false} 
              tickLine={false}
              domain={[0, 100]}
            />
            <YAxis 
              dataKey="category" 
              type="category" 
              stroke="#6b7280" 
              fontSize={10} 
              axisLine={false} 
              tickLine={false}
              width={60}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1a1b20', borderColor: 'rgba(255,255,255,0.2)', borderRadius: '8px', fontSize: '12px', color: '#fff', padding: '8px 12px' }} 
              itemStyle={{ color: '#fff' }} 
              formatter={(value, payload) => [
                `${value.toFixed(1)}%`,
                `${formatCurrency(payload[0]?.payload?.value || 0)}`
              ]} 
            />
            <ReferenceLine 
              x={80} 
              stroke="#ffffff" 
              strokeWidth={2}
              strokeDasharray="4 4" 
              strokeOpacity={0.9}
              label={{ 
                value: '80% Threshold', 
                position: 'right', 
                fill: '#ffffff', 
                fontSize: 10,
                fontWeight: 'bold',
                offset: 8,
                style: { 
                  textShadow: '0 0 6px rgba(255, 255, 255, 0.9), 0 0 8px rgba(160, 47, 241, 0.6)',
                  backgroundColor: 'rgba(26, 27, 32, 0.8)',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }
              }} 
            />
            <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
              {concentrationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Risk Interpretation */}
      <div className="mt-3 p-2 bg-[#0f0f11]/50 border border-white/5 rounded-lg">
        <div className="flex items-start gap-2">
          <TrendingUp size={12} className="text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-[10px] text-gray-400 leading-relaxed">
            {concentrationData[0]?.percentage > 50 
              ? 'High dependency risk: Over 50% of spend is tied to a single service. Consider diversification.'
              : concentrationData[0]?.percentage > 30
              ? 'Moderate dependency risk: Monitor top services closely for cost volatility.'
              : 'Well-distributed spend across services reduces dependency risk.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CostConcentration;