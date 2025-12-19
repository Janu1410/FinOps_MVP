import React, { useMemo, useState } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Calendar, Filter, 
  PieChart, BarChart3, ArrowRight, AlertTriangle, Layers, 
  Check, X, Zap, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- UTILITY: FORMAT CURRENCY ---
const formatCurrency = (val) => 
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(val);

// --- COMPONENT: CUSTOM STACKED BAR CHART ---
// A lightweight, responsive chart built with Flexbox/CSS to avoid heavy libraries
const StackedChart = ({ data, keys, height = 300 }) => {
  const maxTotal = Math.max(...data.map(d => d.total));
  
  if (data.length === 0) return <div className="h-full flex items-center justify-center text-gray-500">No data for chart</div>;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 flex items-end gap-1 relative pt-6">
        {/* Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 z-0">
          {[1, 0.75, 0.5, 0.25, 0].map(p => (
            <div key={p} className="w-full border-t border-gray-500 relative">
              <span className="absolute -top-3 -left-8 text-[9px] text-gray-400">
                ${(maxTotal * p).toLocaleString(undefined, { notation: "compact" })}
              </span>
            </div>
          ))}
        </div>

        {/* Bars */}
        {data.map((day, idx) => (
          <div key={idx} className="flex-1 flex flex-col justify-end h-full relative group z-10">
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#25262b] border border-white/10 p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-40 z-50 text-[10px]">
              <div className="font-bold text-white mb-1 border-b border-white/10 pb-1">{day.date}</div>
              <div className="space-y-0.5">
                {day.stacks.sort((a,b) => b.value - a.value).slice(0, 5).map(s => (
                  <div key={s.key} className="flex justify-between text-gray-300">
                    <span className="truncate w-24">{s.key}</span>
                    <span className="font-mono text-white">${s.value.toFixed(2)}</span>
                  </div>
                ))}
                {day.stacks.length > 5 && <div className="text-gray-500 italic">...and {day.stacks.length - 5} more</div>}
                <div className="pt-1 mt-1 border-t border-white/10 flex justify-between font-bold text-[#a02ff1]">
                   <span>Total</span>
                   <span>${day.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Stack Segments */}
            <div className="w-full bg-[#1a1b20] rounded-t-sm overflow-hidden flex flex-col-reverse hover:brightness-110 transition-all cursor-pointer" style={{ height: `${(day.total / maxTotal) * 100}%` }}>
              {day.stacks.map((stack, sIdx) => (
                <div 
                  key={sIdx}
                  className="w-full transition-all"
                  style={{ 
                    height: `${(stack.value / day.total) * 100}%`,
                    backgroundColor: stack.color 
                  }} 
                />
              ))}
            </div>
            
            {/* X-Axis Label */}
            <div className="mt-2 text-[9px] text-gray-500 text-center -rotate-45 origin-top-left truncate w-6">
              {day.date.slice(5)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CostAnalysis = ({ data }) => {
  // --- STATE ---
  const [groupBy, setGroupBy] = useState('ServiceName'); // ServiceName, RegionName, ProviderName, or TAG:xxx
  const [timeRange, setTimeRange] = useState('30'); // Days
  const [selectedFilters, setSelectedFilters] = useState({}); // { ProviderName: 'AWS' }

  // --- 1. PARSE & PROCESS DATA ---
  const { allTags, processedData, uniqueValues } = useMemo(() => {
    if (!data || !data.length) return { allTags: [], processedData: [], uniqueValues: {} };

    // 1. Identify all available Tag Keys (e.g., 'environment', 'business_unit')
    const tagKeys = new Set();
    const cleanData = data.map(row => {
      let parsedTags = {};
      try {
        if (row.Tags) {
          // Handle potential double-escaped JSON from CSV
          const cleanedJson = row.Tags.replace(/""/g, '"').replace(/^"|"$/g, '');
          parsedTags = JSON.parse(cleanedJson);
          Object.keys(parsedTags).forEach(k => tagKeys.add(k));
        }
      } catch (e) { /* ignore invalid json */ }
      
      // Add numeric cost for safety
      return {
        ...row,
        _cost: parseFloat(row.BilledCost) || 0,
        _date: row.ChargePeriodStart ? row.ChargePeriodStart.split(' ')[0] : 'Unknown',
        _tags: parsedTags
      };
    });

    // 2. Extract Unique Values for Filters
    const uniques = {
      ProviderName: [...new Set(cleanData.map(d => d.ProviderName).filter(Boolean))],
      ServiceName: [...new Set(cleanData.map(d => d.ServiceName).filter(Boolean))],
      RegionName: [...new Set(cleanData.map(d => d.RegionName).filter(Boolean))],
    };

    return { allTags: Array.from(tagKeys), processedData: cleanData, uniqueValues: uniques };
  }, [data]);

  // --- 2. AGGREGATE FOR CHART ---
  const chartData = useMemo(() => {
    // A. Filter Data
    let filtered = processedData;
    Object.entries(selectedFilters).forEach(([key, val]) => {
      if (val) filtered = filtered.filter(d => d[key] === val);
    });

    // B. Group By Logic
    const dailyGroups = {};
    const groupKeys = new Set();
    const colorPalette = ['#a02ff1', '#7c3aed', '#5b21b6', '#4c1d95', '#3b82f6', '#2563eb', '#1d4ed8', '#10b981', '#059669', '#f59e0b', '#d97706'];

    filtered.forEach(row => {
      const date = row._date;
      if (!dailyGroups[date]) dailyGroups[date] = { date, total: 0, stacks: {} };

      // Determine Group Key (Handle Tags specially)
      let key = 'Other';
      if (groupBy.startsWith('TAG:')) {
        const tagKey = groupBy.replace('TAG:', '');
        key = row._tags[tagKey] || 'Untagged';
      } else {
        key = row[groupBy] || 'Unknown';
      }

      groupKeys.add(key);
      dailyGroups[date].stacks[key] = (dailyGroups[date].stacks[key] || 0) + row._cost;
      dailyGroups[date].total += row._cost;
    });

    // C. Assign Colors to Keys
    const keyColors = {};
    Array.from(groupKeys).forEach((k, i) => {
      keyColors[k] = colorPalette[i % colorPalette.length];
    });

    // D. Format for Chart Component
    return Object.values(dailyGroups)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(day => ({
        date: day.date,
        total: day.total,
        stacks: Object.entries(day.stacks).map(([k, v]) => ({
          key: k,
          value: v,
          color: keyColors[k]
        }))
      }));
  }, [processedData, groupBy, selectedFilters]);

  // --- 3. INSIGHTS GENERATION ---
  const insights = useMemo(() => {
    if (!chartData.length) return null;

    const totalSpend = chartData.reduce((acc, day) => acc + day.total, 0);
    const avgDaily = totalSpend / chartData.length;
    
    // Forecast (Simple Projection)
    const forecast = avgDaily * 30; // Next 30 days

    // Top Mover (Group)
    const groupTotals = {};
    chartData.forEach(day => {
       day.stacks.forEach(s => {
         groupTotals[s.key] = (groupTotals[s.key] || 0) + s.value;
       });
    });
    const topGroup = Object.entries(groupTotals).sort((a,b) => b[1] - a[1])[0];

    return { totalSpend, forecast, topGroup };
  }, [chartData]);


  // --- RENDER ---
  return (
    <div className="p-6 space-y-6 min-h-screen bg-[#0f0f11] text-white font-sans animate-in fade-in duration-500">
      
      {/* 1. HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <PieChart className="text-[#a02ff1]" /> Cost Analysis
            </h1>
            <p className="text-gray-400 text-sm">Analyze spend drivers across clouds, services, and custom tags.</p>
         </div>

         {/* Control Bar */}
         <div className="flex flex-wrap items-center gap-3 bg-[#1a1b20] p-2 rounded-xl border border-white/10">
            {/* Dimension Selector */}
            <div className="relative group">
               <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs cursor-pointer hover:border-[#a02ff1] transition-colors">
                  <Layers size={14} className="text-gray-400" />
                  <span className="text-gray-300">Group By:</span>
                  <span className="font-bold text-white">
                    {groupBy.startsWith('TAG:') ? `Tag: ${groupBy.replace('TAG:', '')}` : groupBy.replace('Name', '')}
                  </span>
                  <ChevronDown size={12} className="text-gray-500" />
               </div>
               
               {/* Dropdown Menu */}
               <div className="absolute top-full right-0 mt-2 w-56 bg-[#25262b] border border-white/10 rounded-xl shadow-2xl z-50 p-2 hidden group-hover:block">
                  <div className="text-[10px] uppercase text-gray-500 font-bold px-2 py-1">Dimensions</div>
                  {['ServiceName', 'RegionName', 'ProviderName', 'BillingAccountName'].map(d => (
                    <button key={d} onClick={() => setGroupBy(d)} className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-white/5 ${groupBy === d ? 'text-[#a02ff1] bg-[#a02ff1]/10' : 'text-gray-300'}`}>
                      {d.replace('Name', '')}
                    </button>
                  ))}
                  
                  {allTags.length > 0 && (
                    <>
                      <div className="border-t border-white/10 my-1 mx-2"></div>
                      <div className="text-[10px] uppercase text-gray-500 font-bold px-2 py-1">Tags (Auto-Detected)</div>
                      {allTags.map(tag => (
                        <button key={tag} onClick={() => setGroupBy(`TAG:${tag}`)} className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-white/5 ${groupBy === `TAG:${tag}` ? 'text-[#a02ff1] bg-[#a02ff1]/10' : 'text-gray-300'}`}>
                          {tag}
                        </button>
                      ))}
                    </>
                  )}
               </div>
            </div>

            <div className="h-6 w-px bg-white/10" />

            {/* Simple Filter Example */}
            <div className="flex items-center gap-2">
               <select 
                 className="bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#a02ff1]"
                 onChange={(e) => setSelectedFilters(prev => ({ ...prev, ProviderName: e.target.value || undefined }))}
               >
                 <option value="">All Providers</option>
                 {uniqueValues.ProviderName?.map(p => <option key={p} value={p}>{p}</option>)}
               </select>
            </div>
         </div>
      </div>

      {/* 2. KPI CARDS */}
      {insights && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {/* Total Spend */}
           <div className="p-4 bg-[#1a1b20] border border-white/10 rounded-xl flex items-center justify-between">
              <div>
                 <p className="text-gray-400 text-xs font-bold uppercase">Total Spend (Period)</p>
                 <h2 className="text-2xl font-bold text-white mt-1">{formatCurrency(insights.totalSpend)}</h2>
              </div>
              <div className="p-3 bg-[#a02ff1]/10 rounded-full text-[#a02ff1]"><DollarSign size={20} /></div>
           </div>

           {/* Forecast */}
           <div className="p-4 bg-[#1a1b20] border border-white/10 rounded-xl flex items-center justify-between relative overflow-hidden">
              <div className="z-10">
                 <p className="text-gray-400 text-xs font-bold uppercase">Projected (30 Days)</p>
                 <h2 className="text-2xl font-bold text-white mt-1">{formatCurrency(insights.forecast)}</h2>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-full text-blue-500 z-10"><TrendingUp size={20} /></div>
              {/* Background Graph Effect */}
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-blue-500/20 to-transparent" />
           </div>

           {/* Top Driver */}
           <div className="p-4 bg-[#1a1b20] border border-white/10 rounded-xl flex items-center justify-between">
              <div className="truncate pr-2">
                 <p className="text-gray-400 text-xs font-bold uppercase">Top Cost Driver</p>
                 <h2 className="text-lg font-bold text-white mt-1 truncate" title={insights.topGroup?.[0]}>
                   {insights.topGroup ? insights.topGroup[0] : 'N/A'}
                 </h2>
                 <p className="text-xs text-[#a02ff1] font-mono">
                   {insights.topGroup ? formatCurrency(insights.topGroup[1]) : '$0.00'}
                 </p>
              </div>
              <div className="p-3 bg-orange-500/10 rounded-full text-orange-500"><AlertTriangle size={20} /></div>
           </div>
        </div>
      )}

      {/* 3. MAIN CHART SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[500px]">
         
         {/* Main Chart */}
         <div className="lg:col-span-3 bg-[#1a1b20] border border-white/10 rounded-xl p-5 flex flex-col shadow-lg">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-white flex items-center gap-2">
                 <BarChart3 size={16} className="text-[#a02ff1]" /> 
                 Spend Trend by <span className="text-[#a02ff1]">{groupBy.startsWith('TAG:') ? groupBy.replace('TAG:', '') : groupBy.replace('Name', '')}</span>
               </h3>
               {/* Legend (Top 3) */}
               <div className="flex gap-4 text-xs">
                  {chartData[0]?.stacks.slice(0, 3).map((s, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                       <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                       <span className="text-gray-300 truncate max-w-[100px]">{s.key}</span>
                    </div>
                  ))}
               </div>
            </div>
            
            <div className="flex-1 w-full min-h-0">
               <StackedChart data={chartData} />
            </div>
         </div>

         {/* Side Breakdown Panel */}
         <div className="bg-[#1a1b20] border border-white/10 rounded-xl p-0 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-[#25262b]">
               <h3 className="font-bold text-white text-sm">Cost Breakdown</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-700">
               {/* Sort stacks by total value */}
               {Object.entries(
                 chartData.reduce((acc, day) => {
                   day.stacks.forEach(s => {
                     if (!acc[s.key]) acc[s.key] = { value: 0, color: s.color };
                     acc[s.key].value += s.value;
                   });
                   return acc;
                 }, {})
               )
               .sort((a, b) => b[1].value - a[1].value)
               .map(([key, data], idx) => (
                 <div key={key} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg group transition-colors cursor-pointer">
                    <div className="flex items-center gap-2 overflow-hidden">
                       <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: data.color }} />
                       <span className="text-xs text-gray-300 truncate group-hover:text-white transition-colors" title={key}>{key}</span>
                    </div>
                    <div className="text-right">
                       <div className="text-xs font-mono font-bold text-white">{formatCurrency(data.value)}</div>
                       <div className="text-[9px] text-gray-500">
                         {((data.value / insights.totalSpend) * 100).toFixed(1)}%
                       </div>
                    </div>
                 </div>
               ))}
            </div>
            <div className="p-3 border-t border-white/10 bg-[#15161a] text-center">
               <button className="text-xs text-[#a02ff1] hover:text-white flex items-center justify-center gap-1 transition-colors">
                 View Full Report <ArrowRight size={12} />
               </button>
            </div>
         </div>
      </div>

    </div>
  );
};

export default CostAnalysis;