import React, { useMemo, useState } from 'react';
import { 
  TrendingUp, ArrowUpRight, ArrowDownRight, Sliders, Filter,
  Activity, CheckCircle2, AlertTriangle, ChevronRight, X, BarChart2, Server
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell 
} from 'recharts';

// --- UTILS ---
const formatCurrency = (val) => {
  if (Math.abs(val) < 0.01 && val !== 0) return '$<0.01';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(val);
};

// --- SUB-COMPONENT: DRIVERS LIST (The Split Tables) ---
const DriversList = ({ title, items, type, onSelect }) => {
  return (
    <div className="space-y-3">
       <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
             <div className={`w-2 h-2 rounded-full ${type === 'inc' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div> 
             {title}
          </h3>
          <span className="text-xs text-gray-500">{items.length} items</span>
       </div>
       <div className="bg-[#1a1b20] border border-white/10 rounded-xl overflow-hidden min-h-[300px] flex flex-col">
          {items.length > 0 ? (
             <div className="divide-y divide-white/5">
                {items.slice(0, 10).map((item) => (
                   <div 
                     key={item.name} 
                     onClick={() => onSelect(item)}
                     className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/5 hover:border-l-4 hover:border-l-[#a02ff1] transition-all group border-l-4 border-l-transparent"
                   >
                      <div className="flex items-center gap-3">
                         <div className={`p-2 rounded-lg ${type === 'inc' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                            {type === 'inc' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                         </div>
                         <div className="min-w-0">
                            <h4 className="text-sm font-medium text-white truncate max-w-[180px] group-hover:text-[#a02ff1] transition-colors">{item.name}</h4>
                            <div className="flex items-center gap-2 text-[10px] text-gray-500">
                               <span>{formatCurrency(item.prev)}</span>
                               <span className="text-gray-600">➜</span>
                               <span className="text-gray-300">{formatCurrency(item.curr)}</span>
                            </div>
                         </div>
                      </div>
                      <div className="text-right">
                         <div className={`text-sm font-mono font-bold ${type === 'inc' ? 'text-red-400' : 'text-green-400'}`}>
                            {type === 'inc' ? '+' : ''}{formatCurrency(item.diff)}
                         </div>
                         <div className="flex items-center justify-end gap-1 text-[10px] text-gray-500 mt-0.5">
                            <span>{Math.abs(item.pct).toFixed(1)}%</span>
                            <ChevronRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#a02ff1]" />
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          ) : (
             <div className="flex flex-col items-center justify-center flex-1 h-full text-gray-500 py-10">
                {type === 'inc' ? <CheckCircle2 size={32} className="text-green-500/50 mb-2" /> : <AlertTriangle size={32} className="text-yellow-500/50 mb-2" />}
                <p>{type === 'inc' ? 'No cost spikes detected.' : 'No savings found.'}</p>
             </div>
          )}
       </div>
    </div>
  );
};

// --- SUB-COMPONENT: DRIVER INSPECTOR (The Slide-Over Panel) ---
const DriverInspector = ({ selectedDriver, onClose }) => {
  // Drill Data Processing
  const drillStats = useMemo(() => {
    if (!selectedDriver) return null;

    // Trend Data for Chart
    const dailyTrend = {};
    selectedDriver.rows.forEach(r => dailyTrend[r.dateStr] = (dailyTrend[r.dateStr] || 0) + r.cost);
    const trendData = Object.entries(dailyTrend)
        .sort((a,b) => a[0].localeCompare(b[0]))
        .map(([date, val]) => ({ date: date.slice(5), val })); // remove year for chart labels

    // Top Resources List
    const resourceStats = {};
    selectedDriver.rows.forEach(r => {
       if (r.period === 'curr') {
          const resId = r.ResourceId || r.ResourceName || 'Unknown Resource';
          resourceStats[resId] = (resourceStats[resId] || 0) + r.cost;
       }
    });
    const topResources = Object.entries(resourceStats)
      .sort((a,b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id, cost]) => ({ id, cost }));

    return { trendData, topResources };
  }, [selectedDriver]);

  return (
    <AnimatePresence>
       {selectedDriver && drillStats && (
          <>
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
             <motion.div 
               initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25 }} 
               className="fixed right-0 top-0 bottom-0 w-[500px] bg-[#1a1b20] border-l border-white/10 shadow-2xl z-50 flex flex-col"
             >
                
                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-[#25262b] flex justify-between items-start">
                   <div>
                      <h2 className="text-lg font-bold text-white break-all">{selectedDriver.name}</h2>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="text-xs text-gray-400">Analysis Mode</span>
                         <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${selectedDriver.diff > 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                            {selectedDriver.diff > 0 ? 'Cost Increase' : 'Cost Saving'}
                         </span>
                      </div>
                   </div>
                   <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white"><X size={20} /></button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4 p-6 border-b border-white/5 bg-[#1a1b20]">
                    <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Net Change</p>
                        <p className={`text-xl font-mono font-bold ${selectedDriver.diff > 0 ? 'text-red-400' : 'text-green-400'}`}>
                            {selectedDriver.diff > 0 ? '+' : ''}{formatCurrency(selectedDriver.diff)}
                        </p>
                    </div>
                    <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Total Current Spend</p>
                        <p className="text-xl font-mono font-bold text-white">{formatCurrency(selectedDriver.curr)}</p>
                    </div>
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                   
                   {/* 1. Daily Trend Chart */}
                   <div className="h-48">
                      <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2"><BarChart2 size={12} /> Spending Trend</h3>
                      <div className="w-full h-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={drillStats.trendData}>
                                <XAxis dataKey="date" hide />
                                <RechartsTooltip 
                                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                    contentStyle={{ backgroundColor: '#25262b', borderColor: '#333', borderRadius: '8px', fontSize: '12px' }}
                                    formatter={(value) => [formatCurrency(value), 'Cost']}
                                />
                                <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                                    {drillStats.trendData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={selectedDriver.diff > 0 ? '#f87171' : '#4ade80'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                      </div>
                   </div>

                   {/* 2. Top Contributing Resources */}
                   <div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2"><Server size={12} /> Top Resources (Current)</h3>
                      <div className="space-y-2">
                         {drillStats.topResources.map((res, i) => (
                            <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-white/5 hover:border-[#a02ff1]/30 transition-colors group">
                               <div className="flex items-center gap-3 overflow-hidden">
                                   <span className="text-[10px] text-gray-500 font-mono w-4">{i+1}</span>
                                   <span className="font-mono text-gray-300 text-xs truncate max-w-[200px]" title={res.id}>{res.id}</span>
                               </div>
                               <span className="font-bold text-white text-xs bg-white/5 px-2 py-1 rounded group-hover:bg-white/10">{formatCurrency(res.cost)}</span>
                            </div>
                         ))}
                         {drillStats.topResources.length === 0 && <p className="text-xs text-gray-500 italic">No individual resources identified.</p>}
                      </div>
                   </div>
                </div>
             </motion.div>
          </>
       )}
    </AnimatePresence>
  );
};

// --- MAIN COMPONENT: COST DRIVERS ---
const CostDrivers = ({ data }) => {
  // --- STATE ---
  const [period, setPeriod] = useState(7);
  const [dimension, setDimension] = useState('ServiceName');
  const [minChange, setMinChange] = useState(0); 
  const [selectedDriver, setSelectedDriver] = useState(null); 

  // --- 1. CORE CALCULATION LOGIC ---
  const { increases, decreases, overallStats } = useMemo(() => {
    if (!data || data.length === 0) return { increases: [], decreases: [], overallStats: {} };

    // A. Parse Data
    const cleanData = data.map(d => ({
      ...d,
      cost: parseFloat(d.BilledCost) || 0,
      date: new Date(d.ChargePeriodStart)
    }));

    // B. Determine Periods
    const maxDate = new Date(Math.max(...cleanData.map(d => d.date)));
    const cutoffCurrent = new Date(maxDate);
    cutoffCurrent.setDate(maxDate.getDate() - period);
    const cutoffPrev = new Date(cutoffCurrent);
    cutoffPrev.setDate(cutoffCurrent.getDate() - period);

    // C. Aggregate
    const groups = {};
    let totalCurr = 0, totalPrev = 0;

    cleanData.forEach(row => {
      if (row.date > maxDate) return;
      const key = row[dimension] || 'Unknown';
      if (!groups[key]) groups[key] = { curr: 0, prev: 0, rows: [] };
      
      if (row.date > cutoffCurrent) {
        groups[key].curr += row.cost;
        groups[key].rows.push({ ...row, period: 'curr', dateStr: row.date.toISOString().split('T')[0] });
        totalCurr += row.cost;
      } else if (row.date > cutoffPrev) {
        groups[key].prev += row.cost;
        groups[key].rows.push({ ...row, period: 'prev', dateStr: row.date.toISOString().split('T')[0] });
        totalPrev += row.cost;
      }
    });

    // D. Deltas
    const allResults = Object.entries(groups).map(([name, stats]) => ({
      name,
      ...stats,
      diff: stats.curr - stats.prev,
      pct: stats.prev === 0 ? 100 : ((stats.curr - stats.prev) / stats.prev) * 100
    })).filter(item => Math.abs(item.diff) >= minChange); 

    // E. Split Results
    const inc = allResults.filter(r => r.diff > 0).sort((a, b) => b.diff - a.diff);
    const dec = allResults.filter(r => r.diff < 0).sort((a, b) => a.diff - b.diff); 

    // Stats for Bridge
    const totalIncreases = inc.reduce((acc, i) => acc + i.diff, 0);
    const totalDecreases = dec.reduce((acc, i) => acc + i.diff, 0);

    return { 
      increases: inc,
      decreases: dec,
      overallStats: { totalCurr, totalPrev, diff: totalCurr - totalPrev, pct: totalPrev ? ((totalCurr - totalPrev)/totalPrev)*100 : 0, totalIncreases, totalDecreases }
    };
  }, [data, period, dimension, minChange]);

  // --- COMPONENT: BRIDGE VISUALIZATION ---
  const VarianceBridge = () => {
    if (!overallStats.totalPrev) return null;
    const maxVal = Math.max(overallStats.totalPrev, overallStats.totalCurr) * 1.3; 
    const getHeight = (val) => `${Math.max(4, (Math.abs(val) / maxVal) * 100)}%`;

    return (
      <div className="h-48 flex items-end justify-between gap-4 px-6 pb-2 relative select-none bg-[#1a1b20] rounded-xl border border-white/10 p-4">
         <div className="absolute inset-0 border-b border-white/5 pointer-events-none" />
         
         {/* Start Bar */}
         <div className="w-1/4 flex flex-col items-center group relative">
            <div style={{ height: getHeight(overallStats.totalPrev) }} className="w-full bg-gray-600 rounded-t-lg opacity-60 hover:opacity-100 transition-opacity relative flex justify-center">
               <span className="absolute -top-6 text-xs font-bold text-gray-300 bg-black/60 px-2 py-0.5 rounded">${formatCurrency(overallStats.totalPrev)}</span>
            </div>
            <span className="text-xs text-gray-400 mt-2 font-bold uppercase tracking-wider">Start</span>
         </div>

         {/* Increases Bar (Red) */}
         <div className="w-1/4 flex flex-col items-center group relative">
            <div style={{ height: getHeight(overallStats.totalIncreases) }} className="w-full bg-red-500/20 border-t-2 border-red-500 rounded-t-lg relative flex justify-center hover:bg-red-500/30 transition-colors">
               <span className="absolute -top-6 text-xs font-bold text-red-400 bg-black/60 px-2 py-0.5 rounded">+{formatCurrency(overallStats.totalIncreases)}</span>
            </div>
            <span className="text-xs text-red-400 mt-2 font-bold uppercase tracking-wider">Increases</span>
         </div>

         {/* Decreases Bar (Green) */}
         <div className="w-1/4 flex flex-col items-center group relative">
            <div style={{ height: getHeight(overallStats.totalDecreases) }} className="w-full bg-green-500/20 border-t-2 border-green-500 rounded-t-lg relative flex justify-center hover:bg-green-500/30 transition-colors">
               <span className="absolute -top-6 text-xs font-bold text-green-400 bg-black/60 px-2 py-0.5 rounded">{formatCurrency(overallStats.totalDecreases)}</span>
            </div>
            <span className="text-xs text-green-400 mt-2 font-bold uppercase tracking-wider">Savings</span>
         </div>

         {/* End Bar */}
         <div className="w-1/4 flex flex-col items-center group relative">
            <div style={{ height: getHeight(overallStats.totalCurr) }} className="w-full bg-[#a02ff1] rounded-t-lg relative flex justify-center hover:brightness-110 transition-all shadow-[0_0_20px_rgba(160,47,241,0.2)]">
               <span className="absolute -top-6 text-xs font-bold text-white bg-black/60 px-2 py-0.5 rounded">${formatCurrency(overallStats.totalCurr)}</span>
            </div>
            <span className="text-xs text-[#a02ff1] mt-2 font-bold uppercase tracking-wider">End</span>
         </div>
      </div>
    );
  };

  if (!data || data.length === 0) return <div className="p-10 text-center text-gray-500">No data available.</div>;

  return (
    <div className="p-6 space-y-6 min-h-screen bg-[#0f0f11] text-white font-sans animate-in fade-in duration-500 relative">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
               <TrendingUp className="text-[#a02ff1]" /> Cost Drivers
            </h1>
            <p className="text-gray-400 text-sm">Analyze what changed compared to previous periods.</p>
         </div>

         {/* Filter Controls */}
         <div className="flex items-center gap-3 bg-[#1a1b20] p-1.5 rounded-xl border border-white/10">
            <div className="flex bg-black/40 rounded-lg p-0.5">
               {[7, 30].map(d => (
                 <button key={d} onClick={() => setPeriod(d)} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${period === d ? 'bg-[#a02ff1] text-white' : 'text-gray-400 hover:text-white'}`}>{d} Days</button>
               ))}
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div className="relative group">
               <select value={dimension} onChange={(e) => setDimension(e.target.value)} className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#a02ff1] pr-8 appearance-none cursor-pointer">
                 <option value="ServiceName">By Service</option>
                 <option value="RegionName">By Region</option>
                 <option value="SubAccountName">By Account</option>
               </select>
               <Filter size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex items-center gap-2 px-2">
               <Sliders size={12} className="text-gray-500" />
               <input type="range" min="0" max="100" step="1" value={minChange} onChange={(e) => setMinChange(Number(e.target.value))} className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#a02ff1]" title={`Hide changes less than $${minChange}`} />
               <span className="text-[10px] text-gray-400 font-mono w-8">${minChange}</span>
            </div>
         </div>
      </div>

      {/* 2. VARIANCE BRIDGE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="bg-[#1a1b20] border border-white/10 rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10"><Activity size={100} className="text-[#a02ff1]" /></div>
            <h3 className="text-gray-400 text-xs font-bold uppercase mb-2">Net Variance ({period} Days)</h3>
            <div className="flex items-baseline gap-3">
               <span className={`text-4xl font-bold ${overallStats.diff > 0 ? 'text-red-400' : 'text-green-400'}`}>
                 {overallStats.diff > 0 ? '+' : ''}{formatCurrency(overallStats.diff)}
               </span>
               <span className="text-sm font-bold px-2 py-0.5 rounded bg-white/5 text-gray-300">
                  {overallStats.pct?.toFixed(1)}%
               </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
               Total spend moved from <span className="text-white">{formatCurrency(overallStats.totalPrev)}</span> to <span className="text-white">{formatCurrency(overallStats.totalCurr)}</span>
            </p>
         </div>
         <div className="lg:col-span-2">
            <VarianceBridge />
         </div>
      </div>

      {/* 3. SPLIT LISTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <DriversList 
            title="Top Increases (Losses)" 
            items={increases} 
            type="inc" 
            onSelect={setSelectedDriver} 
         />
         <DriversList 
            title="Top Savings (Profits)" 
            items={decreases} 
            type="dec" 
            onSelect={setSelectedDriver} 
         />
      </div>

      {/* 4. INSPECTOR */}
      <DriverInspector 
         selectedDriver={selectedDriver} 
         onClose={() => setSelectedDriver(null)} 
      />

    </div>
  );
};

export default CostDrivers;