import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Target, TrendingUp, TrendingDown, Calendar, Info } from 'lucide-react';

// Helper function to parse dates safely
const parseDate = (dateStr) => {
  if (!dateStr) return null;
  // Handle YYYY-MM-DD format
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  }
  // Fallback to standard parsing
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
};

const CostPredictability = ({ dailyData }) => {
  const [showVarianceTooltip, setShowVarianceTooltip] = useState(false);
  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);
  
  const formatMonthYear = (month, year) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[month]} ${year}`;
  };

  const predictabilityData = useMemo(() => {
    if (!dailyData || dailyData.length === 0) return { chartData: [], monthEndProjection: 0, variance: 0, avgDaily: 0, daysRemaining: 0, totalSpend: 0 };

    // Find the most recent month in the data

    const validDates = dailyData.map(d => parseDate(d.date)).filter(d => d !== null);
    if (validDates.length === 0) return { chartData: [], monthEndProjection: 0, variance: 0, avgDaily: 0, daysRemaining: 0, totalSpend: 0 };
    
    const latestDate = new Date(Math.max(...validDates.map(d => d.getTime())));
    const targetMonth = latestDate.getMonth();
    const targetYear = latestDate.getFullYear();
    
    // Filter data for the most recent month in dataset
    let monthData = dailyData.filter(d => {
      const date = parseDate(d.date);
      if (!date) return false;
      return date.getMonth() === targetMonth && date.getFullYear() === targetYear;
    });

    // If no data for most recent month, use the latest 30 days of data
    let actualTargetMonth = targetMonth;
    let actualTargetYear = targetYear;
    if (monthData.length === 0) {
      // Use last 30 days of data
      const sortedData = [...dailyData].sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        if (!dateA || !dateB) return 0;
        return dateB.getTime() - dateA.getTime();
      });
      monthData = sortedData.slice(0, 30).filter(d => parseDate(d.date) !== null);
      if (monthData.length === 0) {
        return { chartData: [], monthEndProjection: 0, variance: 0, avgDaily: 0, daysRemaining: 0, totalSpend: 0 };
      }
      // Get the month from the most recent data point
      const mostRecentDate = parseDate(monthData[0].date);
      if (mostRecentDate) {
        actualTargetMonth = mostRecentDate.getMonth();
        actualTargetYear = mostRecentDate.getFullYear();
      }
    }

    // Calculate average daily spend
    const totalSpend = monthData.reduce((sum, d) => sum + d.cost, 0);
    const avgDaily = totalSpend / monthData.length;

    // Get days in target month and days elapsed
    const daysInMonth = new Date(actualTargetYear, actualTargetMonth + 1, 0).getDate();
    const daysElapsed = monthData.length;
    const daysRemaining = Math.max(0, daysInMonth - daysElapsed);

    // Project month-end total
    const monthEndProjection = totalSpend + (avgDaily * daysRemaining);

    // Calculate variance (compare recent period vs earlier period in same dataset)
    let variance = 0;
    
    // Strategy: Compare first half vs second half of current month data
    // If we have enough data, compare recent days vs earlier days
    if (monthData.length >= 7) {
      const midPoint = Math.floor(monthData.length / 2);
      const firstHalf = monthData.slice(0, midPoint);
      const secondHalf = monthData.slice(midPoint);
      
      const firstHalfAvg = firstHalf.reduce((sum, d) => sum + d.cost, 0) / firstHalf.length;
      const secondHalfAvg = secondHalf.reduce((sum, d) => sum + d.cost, 0) / secondHalf.length;
      
      if (firstHalfAvg > 0) {
        variance = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
      }
    } else if (dailyData.length > monthData.length) {
      // Fallback: Compare current month avg with overall historical avg
      const historicalData = dailyData.filter(d => {
        const date = parseDate(d.date);
        if (!date) return false;
        // Exclude current month
        return !(date.getMonth() === actualTargetMonth && date.getFullYear() === actualTargetYear);
      });
      
      if (historicalData.length > 0) {
        const historicalAvg = historicalData.reduce((sum, d) => sum + d.cost, 0) / historicalData.length;
        if (historicalAvg > 0) {
          variance = ((avgDaily - historicalAvg) / historicalAvg) * 100;
        }
      }
    }

    // Build chart data with actual and projected
    const chartData = monthData.map(d => ({
      ...d,
      actual: d.cost,
      projected: null,
      cumulativeActual: 0,
      cumulativeProjected: 0
    }));

    // Calculate cumulative values
    let cumActual = 0;
    chartData.forEach((d, idx) => {
      cumActual += d.actual;
      d.cumulativeActual = cumActual;
      d.cumulativeProjected = cumActual + (avgDaily * (idx + 1 - daysElapsed + daysRemaining));
    });

    // Add projected days
    const lastDate = new Date(monthData[monthData.length - 1].date);
    for (let i = 1; i <= daysRemaining; i++) {
      const nextDate = new Date(lastDate);
      nextDate.setDate(nextDate.getDate() + i);
      const projectedCost = avgDaily;
      const dayNum = daysElapsed + i;
      chartData.push({
        date: nextDate.toISOString().split('T')[0],
        actual: null,
        projected: projectedCost,
        cumulativeActual: totalSpend + (avgDaily * i),
        cumulativeProjected: totalSpend + (avgDaily * i),
        isProjected: true
      });
    }

    // Determine if period is closed (all days in month have data)
    const isPeriodClosed = daysRemaining === 0;
    
    // Analyze spend pattern for variance explanation
    let varianceExplanation = '';
    if (monthData.length >= 7) {
      const midPoint = Math.floor(monthData.length / 2);
      const firstHalf = monthData.slice(0, midPoint);
      const secondHalf = monthData.slice(midPoint);
      const firstHalfTotal = firstHalf.reduce((sum, d) => sum + d.cost, 0);
      const secondHalfTotal = secondHalf.reduce((sum, d) => sum + d.cost, 0);
      const firstHalfPct = (firstHalfTotal / totalSpend) * 100;
      
      if (firstHalfPct < 40) {
        varianceExplanation = 'End-loaded spend: Most costs occurred in the latter half of the period';
      } else if (firstHalfPct > 60) {
        varianceExplanation = 'Front-loaded spend: Most costs occurred in the first half of the period';
      } else if (Math.abs(variance) > 15) {
        varianceExplanation = 'High variance: Significant day-to-day cost fluctuations detected';
      } else {
        varianceExplanation = 'Consistent spending pattern throughout the period';
      }
    }

    return { 
      chartData, 
      monthEndProjection, 
      variance, 
      avgDaily, 
      daysRemaining, 
      totalSpend,
      targetMonth: actualTargetMonth,
      targetYear: actualTargetYear,
      isPeriodClosed,
      varianceExplanation
    };
  }, [dailyData]);

  const isOverProjection = predictabilityData.variance > 0;

  return (
    <div className="bg-[#1a1b20]/60 backdrop-blur-md border border-white/5 rounded-2xl p-5 flex flex-col shadow-xl min-h-[300px]">
      <div className="mb-4">
        <div className="flex justify-between items-center h-8 mb-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Target size={16} className="text-[#a02ff1]" />
            Cost Predictability
          </h3>
          <div className="relative">
            <div 
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold cursor-help ${
                Math.abs(predictabilityData.variance) < 5 ? 'bg-green-400/10 text-green-400' :
                Math.abs(predictabilityData.variance) < 15 ? 'bg-yellow-400/10 text-yellow-400' :
                'bg-red-400/10 text-red-400'
              }`}
              onMouseEnter={() => setShowVarianceTooltip(true)}
              onMouseLeave={() => setShowVarianceTooltip(false)}
            >
              {isOverProjection ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {Math.abs(predictabilityData.variance).toFixed(1)}% spend acceleration
            </div>
            {showVarianceTooltip && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-[#1a1b20] border border-white/10 rounded-lg p-3 shadow-2xl z-50">
                <div className="flex items-start gap-2">
                  <Info size={14} className="text-[#a02ff1] mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Rate of spend increase compared to early-period average
                    {predictabilityData.varianceExplanation && (
                      <span className="block mt-1 text-gray-400">
                        {predictabilityData.varianceExplanation}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Context Label */}
        <div className="flex items-center gap-2 text-[10px] text-gray-500 mb-1">
          <Calendar size={12} />
          <span>
            Billing period: {formatMonthYear(predictabilityData.targetMonth, predictabilityData.targetYear)}
            {predictabilityData.isPeriodClosed && (
              <span className="text-gray-600 ml-1">(closed)</span>
            )}
          </span>
        </div>
        {predictabilityData.isPeriodClosed && (
          <div className="text-[10px] text-gray-600">
            Billing period closed · Retrospective analysis
          </div>
        )}
      </div>

      {/* Projection Card */}
      <div className="mb-4 p-3 bg-[#0f0f11] border border-white/10 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Month-End Projection</p>
            <p className="text-lg font-bold text-white">{formatCurrency(predictabilityData.monthEndProjection)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Days Remaining</p>
            <p className="text-lg font-bold text-[#a02ff1]">{predictabilityData.daysRemaining || 0}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        {predictabilityData.chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Calendar size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No data available for projection</p>
              <p className="text-xs text-gray-600 mt-1">Ensure your data includes date information</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={predictabilityData.chartData}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a02ff1" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#a02ff1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280" 
              fontSize={10} 
              tickFormatter={(str) => {
                const date = new Date(str);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }} 
              tickMargin={10} 
              axisLine={false} 
              tickLine={false} 
            />
            <YAxis 
              stroke="#6b7280" 
              fontSize={10} 
              tickFormatter={(val) => `$${val.toFixed(0)}`} 
              axisLine={false} 
              tickLine={false} 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1a1b20', borderColor: 'rgba(255,255,255,0.2)', borderRadius: '8px', fontSize: '12px', color: '#fff', padding: '8px 12px' }} 
              itemStyle={{ color: '#fff' }} 
              formatter={(value, name) => {
                if (name === 'cumulativeActual') return [formatCurrency(value), 'Cumulative Actual'];
                if (name === 'cumulativeProjected') return [formatCurrency(value), 'Cumulative Projected'];
                return [formatCurrency(value), name];
              }} 
            />
            <ReferenceLine 
              x={predictabilityData.chartData.find(d => !d.isProjected && d.date)?.date} 
              stroke="#6b7280" 
              strokeDasharray="2 2" 
              label={{ value: 'Today', position: 'top', fill: '#9ca3af', fontSize: 10 }}
            />
            <Line 
              type="monotone" 
              dataKey="cumulativeActual" 
              stroke="#a02ff1" 
              strokeWidth={2} 
              dot={false}
              data={predictabilityData.chartData.filter(d => !d.isProjected)}
              activeDot={{ r: 4, fill: '#a02ff1' }}
            />
            {predictabilityData.daysRemaining > 0 && (
              <Line 
                type="monotone" 
                dataKey="cumulativeProjected" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                strokeDasharray="5 5"
                dot={{ r: 3, fill: '#3b82f6' }}
                data={predictabilityData.chartData.filter(d => d.isProjected)}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
        )}
      </div>

      <div className="mt-3 flex items-center gap-4 text-[10px] text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#a02ff1]"></div>
          <span>Cumulative Actual</span>
        </div>
        {predictabilityData.daysRemaining > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500 border border-dashed"></div>
            <span>Cumulative Projected</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CostPredictability;