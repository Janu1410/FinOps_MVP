import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine, PieChart, Pie, Legend } from 'recharts';
import { AlertTriangle, Layers, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';

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

  // Prepare pie chart data for top services
  const pieChartData = useMemo(() => {
    if (!groupedData || groupedData.length === 0 || totalSpend === 0) return [];
    
    const topServices = groupedData.slice(0, 5);
    const othersValue = totalSpend - topServices.reduce((sum, item) => sum + (item.value || 0), 0);
    
    const pieData = topServices.map((item, index) => ({
      name: item.name,
      value: item.value,
      percentage: ((item.value / totalSpend) * 100),
      color: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#a02ff1'][index] || '#6b7280'
    }));
    
    if (othersValue > 0) {
      pieData.push({
        name: 'Others',
        value: othersValue,
        percentage: ((othersValue / totalSpend) * 100),
        color: '#6b7280'
      });
    }
    
    return pieData;
  }, [groupedData, totalSpend]);

  // Custom label for pie chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    if (percent < 0.05) return null; // Don't show labels for slices < 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={10}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#1a1b20]/60 backdrop-blur-md border border-white/5 rounded-2xl p-5 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers size={16} className="text-[#a02ff1]" />
            Cost Concentration
          </h3>
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold ${riskLevel.bg} ${riskLevel.color}`}>
            <AlertTriangle size={10} />
            {riskLevel.level} Risk
          </div>
        </div>

        {/* Risk Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {concentrationData.map((item, index) => (
            <div key={index} className="bg-[#0f0f11] border border-white/10 rounded-lg p-3 text-center">
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">{item.category}</p>
              <p className="text-lg font-bold text-white">{item.percentage.toFixed(1)}%</p>
              <p className="text-[10px] text-gray-400 mt-1">{formatCurrency(item.value)}</p>
            </div>
          ))}
        </div>

        {/* Top Service Info */}
        {groupedData && groupedData.length > 0 && (
          <div className="bg-[#0f0f11] border border-white/10 rounded-lg p-3">
            <p className="text-[10px] text-gray-500 text-center mb-1">
              Top 1 service accounts for <span className="text-white font-bold">{concentrationData[0]?.percentage.toFixed(1)}%</span> of total spend
            </p>
            <p className="text-sm text-[#a02ff1] text-center font-semibold">
              {groupedData[0].name}
            </p>
          </div>
        )}
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Service Distribution */}
        <div className="bg-[#1a1b20]/60 backdrop-blur-md border border-white/5 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon size={16} className="text-[#a02ff1]" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Service Distribution</h4>
          </div>
          {pieChartData.length > 0 ? (
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={80}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1b20', borderColor: 'rgba(255,255,255,0.2)', borderRadius: '8px', fontSize: '12px', color: '#fff', padding: '8px 12px' }}
                    formatter={(value, name, props) => [
                      `${props.payload.percentage.toFixed(1)}% (${formatCurrency(value)})`,
                      props.payload.name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-500">
              <p className="text-sm">No data available</p>
            </div>
          )}
          
          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {pieChartData.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center gap-1.5 px-2 py-1 bg-[#0f0f11] rounded-lg border border-white/5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] text-gray-300 font-medium truncate max-w-[100px]" title={item.name}>
                  {item.name}
                </span>
                <span className="text-[10px] text-gray-500">({item.percentage.toFixed(1)}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Horizontal Bar Chart - Concentration Levels */}
        <div className="bg-[#1a1b20]/60 backdrop-blur-md border border-white/5 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <Layers size={16} className="text-[#a02ff1]" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Concentration Levels</h4>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={concentrationData} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 5 }}>
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
                  fontSize={11}
                  fontWeight="bold"
                  axisLine={false} 
                  tickLine={false}
                  width={70}
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
                <Bar dataKey="percentage" radius={[0, 6, 6, 0]}>
                  {concentrationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Services Breakdown with Progress Bars */}
      {groupedData && groupedData.length > 0 && (
        <div className="bg-[#1a1b20]/60 backdrop-blur-md border border-white/5 rounded-2xl p-5 shadow-xl">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <TrendingUp size={14} className="text-[#a02ff1]" />
            Top Services Breakdown
          </h4>
          <div className="space-y-3">
            {groupedData.slice(0, 5).map((service, index) => {
              const percentage = totalSpend > 0 ? (service.value / totalSpend) * 100 : 0;
              const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#a02ff1'];
              const color = colors[index] || '#6b7280';
              
              return (
                <div key={index} className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-xs font-medium text-white truncate" title={service.name}>
                        {service.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <span className="text-xs font-bold text-gray-300">{percentage.toFixed(1)}%</span>
                      <span className="text-xs font-mono font-bold text-[#a02ff1]">{formatCurrency(service.value)}</span>
                    </div>
                  </div>
                  <div className="w-full bg-[#0f0f11] rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${percentage}%`, 
                        backgroundColor: color,
                        boxShadow: `0 0 8px ${color}40`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Risk Interpretation */}
      <div className="bg-[#0f0f11]/50 border border-white/5 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <AlertTriangle size={14} className={`mt-0.5 flex-shrink-0 ${riskLevel.color}`} />
          <div>
            <p className="text-xs font-bold text-white mb-1">Risk Assessment</p>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              {concentrationData[0]?.percentage > 50 
                ? 'High dependency risk: Over 50% of spend is tied to a single service. Consider diversification to reduce vendor lock-in and improve cost resilience.'
                : concentrationData[0]?.percentage > 30
                ? 'Moderate dependency risk: Monitor top services closely for cost volatility. Consider establishing backup options for critical services.'
                : 'Well-distributed spend across services reduces dependency risk. Maintain this healthy distribution pattern.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostConcentration;