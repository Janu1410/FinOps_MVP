import React, { useMemo, useState } from 'react';
import { 
  BarChart3, LineChart as LineChartIcon, Activity, 
  Layers, ChevronDown, DollarSign, ArrowUpRight, ArrowDownRight,
  Maximize2, AlertCircle, Info, Download, Target, Calendar, X, Eye, EyeOff
} from 'lucide-react';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, ReferenceLine, Brush 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import FilterBar from './Views/FilterBar';
import CostPredictability from './Views/CostPredictability';
import CostConcentration from './Views/CostConcentration';

// --- CONSTANTS ---
const TOP_N_LIMIT = 5; 
const COLOR_PALETTE = ['#a02ff1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899']; 
const OTHER_COLOR = '#4b5563'; 

// --- SMART CURRENCY FORMATTER (Handles Micro-costs) ---
const formatCurrency = (val, precision = null) => {
  if (val === 0) return '$0.00';
  const absVal = Math.abs(val);
  
  let digits = precision !== null ? precision : 2;
  if (precision === null) {
    if (absVal < 0.01) digits = 4;
    if (absVal < 0.0001) digits = 6;
  }
  
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD', 
    minimumFractionDigits: digits, 
    maximumFractionDigits: digits 
  }).format(val);
};

const CostAnalysis = ({ data }) => {
  // --- TAB STATE ---
  const [activeTab, setActiveTab] = useState('overview');
  
  // --- FILTER STATE (persists across tabs) ---
  const [filters, setFilters] = useState({ provider: 'All', service: 'All', region: 'All' });
  const [groupBy, setGroupBy] = useState('ServiceName');
  
  // --- CHART STATE ---
  const [chartType, setChartType] = useState('bar');
  const [showAverage, setShowAverage] = useState(true);
  const [hiddenSeries, setHiddenSeries] = useState(new Set());
  const [activeSolo, setActiveSolo] = useState(null);
  const [selectedKpi, setSelectedKpi] = useState(null);

  // --- 1. DATA FILTERING ---
  const filteredData = useMemo(() => {
    if (!data || !data.length) return [];
    
    return data.filter(item => {
      const itemProvider = item.ProviderName || 'Unknown';
      const itemService = item.ServiceName || 'Unknown';
      const itemRegion = item.RegionName || 'Unknown';

      const matchProvider = filters.provider === 'All' || itemProvider === filters.provider;
      const matchService = filters.service === 'All' || itemService === filters.service;
      const matchRegion = filters.region === 'All' || itemRegion === filters.region;

      return matchProvider && matchService && matchRegion;
    });
  }, [data, filters]);

  // --- 2. DATA PROCESSING ENGINE ---
  const processed = useMemo(() => {
    try {
      if (!filteredData || !filteredData.length) return null;

      const cleanData = filteredData.map(row => ({
        ...row,
        _cost: parseFloat(row.BilledCost) || 0,
        _date: row.ChargePeriodStart ? row.ChargePeriodStart.split(' ')[0] : 'Unknown',
        _group: row[groupBy] || 'Unknown'
      }));

      const groupTotals = {};
      cleanData.forEach(d => { groupTotals[d._group] = (groupTotals[d._group] || 0) + d._cost; });

      const sortedKeys = Object.entries(groupTotals).sort((a, b) => b[1] - a[1]).map(entry => entry[0]);
      const topKeys = sortedKeys.slice(0, TOP_N_LIMIT);
      const topKeysSet = new Set(topKeys);

      const dailyMap = {};
      let grandTotal = 0;

      cleanData.forEach(row => {
        const date = row._date;
        if (!dailyMap[date]) dailyMap[date] = { date, total: 0, Others: 0 };
        topKeys.forEach(k => { if (dailyMap[date][k] === undefined) dailyMap[date][k] = 0; });

        const key = topKeysSet.has(row._group) ? row._group : 'Others';
        dailyMap[date][key] = (dailyMap[date][key] || 0) + row._cost;
        dailyMap[date].total += row._cost;
        grandTotal += row._cost;
      });

      const finalData = Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));
      
      // Safety check: ensure we have data
      if (finalData.length === 0) return null;
      
      const average = grandTotal / (finalData.length || 1);
      const maxDayObj = [...finalData].sort((a,b) => b.total - a.total)[0];

      let othersTotal = 0;
      Object.entries(groupTotals).forEach(([k, v]) => { if (!topKeysSet.has(k)) othersTotal += v; });
      groupTotals['Others'] = othersTotal;

      const mid = Math.floor(finalData.length / 2);
      const prevHalf = mid > 0 ? finalData.slice(0, mid).reduce((a, b) => a + b.total, 0) : 0;
      const currHalf = finalData.slice(mid).reduce((a, b) => a + b.total, 0);

      // Prepare daily data for Predictability component
      const dailyData = finalData.map(d => ({
        date: d.date,
        cost: d.total
      }));

      // Prepare grouped data for Concentration component
      const groupedData = sortedKeys.slice(0, 10).map(key => ({
        name: key,
        value: groupTotals[key] || 0
      }));

      return { 
        chartData: finalData, 
        activeKeys: [...topKeys, 'Others'],
        totalSpend: grandTotal, 
        avgDaily: average, 
        trend: prevHalf ? ((currHalf - prevHalf) / prevHalf) * 100 : 0,
        categoryTotals: groupTotals, 
        maxDaily: maxDayObj?.total || 0, 
        peakDay: maxDayObj?.date,
        dailyData,
        groupedData
      };
    } catch (error) {
      console.error('Error processing cost analysis data:', error);
      return null;
    }
  }, [filteredData, groupBy]);

  const toggleSeries = (key) => {
    const newSet = new Set(hiddenSeries);
    if (newSet.has(key)) newSet.delete(key);
    else newSet.add(key);
    setHiddenSeries(newSet);
  };

  const handleSolo = (key) => {
    if (!processed) return;
    if (activeSolo === key) { setActiveSolo(null); setHiddenSeries(new Set()); }
    else {
      setActiveSolo(key);
      setHiddenSeries(new Set(processed.activeKeys.filter(k => k !== key)));
    }
  };

  const getKpiDetails = () => {
    if (!selectedKpi || !processed) return null;
    const topItems = Object.entries(processed.categoryTotals).sort((a, b) => b[1] - a[1]).slice(0, 5);

    switch(selectedKpi) {
      case 'Total Spend': return { title: "Spend Breakdown", description: "Top spending categories across the selected timeframe.", items: topItems.map(([name, val]) => ({ name, val })) };
      case 'Daily Average': return { title: "Burn Rate Efficiency", description: "Standard daily operating cost.", stats: [{ label: 'Baseline Avg', val: processed.avgDaily }, { label: 'Peak Variance', val: processed.maxDaily - processed.avgDaily }] };
      case 'Peak Usage': return { title: "Maximum Resource Load", description: `Highest recorded spend on ${processed.peakDay}.`, tip: "Often corresponds to database backups or scheduled maintenance." };
      case 'Period Trend': return { title: "Growth Direction", description: "Comparison between the first and second half of the dataset.", status: processed.trend > 0 ? "⚠️ Costs Increasing" : "✅ Costs Stabilizing" };
      default: return null;
    }
  };

  const kpiDetails = getKpiDetails();

  return (
    <div className="flex flex-col h-full bg-[#0f0f11] text-white overflow-hidden relative">
      {/* HEADER */}
      <header className="flex justify-between items-center p-6 border-b border-white/5 shrink-0">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <div className="p-2 bg-[#a02ff1]/10 rounded-lg text-[#a02ff1]"><Target size={22} /></div>
          Cost Analysis
        </h1>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-1.5 bg-[#a02ff1] hover:bg-[#8e25d9] rounded-lg text-xs font-bold transition-all shadow-lg"><Download size={14} /> Export</button>
        </div>
      </header>

      {/* HORIZONTAL SUB-NAVIGATION */}
      <div className="px-6 pt-4 pb-0 border-b border-white/5 shrink-0">
        <div className="flex gap-1 bg-[#1a1b20] p-1 rounded-lg border border-white/5 w-fit">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-2 text-sm font-bold rounded-md transition-all ${
              activeTab === 'overview'
                ? 'bg-[#a02ff1] text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('predictability')}
            className={`px-6 py-2 text-sm font-bold rounded-md transition-all ${
              activeTab === 'predictability'
                ? 'bg-[#a02ff1] text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Predictability
          </button>
          <button
            onClick={() => setActiveTab('risk')}
            className={`px-6 py-2 text-sm font-bold rounded-md transition-all ${
              activeTab === 'risk'
                ? 'bg-[#a02ff1] text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Risk
          </button>
        </div>
      </div>

      {/* FILTER BAR (persists across tabs) */}
      <div className="px-6 pt-4 shrink-0">
        <FilterBar 
          data={data} 
          filters={filters} 
          onChange={setFilters}
          groupBy={groupBy}
          onGroupChange={setGroupBy}
        />
      </div>

      {/* TAB CONTENT */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0">
        {/* EMPTY STATE - No data matches filters */}
        {!processed && (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] pt-12">
            <div className="bg-[#1a1b20] border border-white/10 rounded-2xl p-8 max-w-md text-center">
              <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Data Matches Your Filters</h3>
              <p className="text-sm text-gray-400 mb-4">
                The selected filter combination ({filters.provider !== 'All' ? filters.provider : 'All Providers'}, {filters.service !== 'All' ? filters.service : 'All Services'}, {filters.region !== 'All' ? filters.region : 'All Regions'}) returned no results.
              </p>
              <button
                onClick={() => setFilters({ provider: 'All', service: 'All', region: 'All' })}
                className="px-6 py-2 bg-[#a02ff1] hover:bg-[#8e25d9] rounded-lg text-sm font-bold transition-all shadow-lg"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        {/* DATA CONTENT */}
        {processed && (
        <AnimatePresence mode="wait">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6 pt-6"
            >
              {/* KPI CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Spend', value: formatCurrency(processed.totalSpend), icon: DollarSign, color: 'text-purple-400' },
                  { label: 'Daily Average', value: formatCurrency(processed.avgDaily), icon: Activity, color: 'text-blue-400' },
                  { label: 'Peak Usage', value: formatCurrency(processed.maxDaily), icon: Maximize2, color: 'text-emerald-400' },
                  { label: 'Period Trend', value: `${processed.trend > 0 ? '+' : ''}${processed.trend.toFixed(1)}%`, icon: processed.trend > 0 ? ArrowUpRight : ArrowDownRight, color: processed.trend > 0 ? 'text-red-400' : 'text-green-400' },
                ].map((kpi, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ y: -4 }} 
                    onClick={() => setSelectedKpi(kpi.label)} 
                    className="bg-[#1a1b20] border border-white/5 p-4 rounded-2xl cursor-pointer hover:border-[#a02ff1]/40 transition-all shadow-sm group"
                  >
                    <div className="flex justify-between text-gray-500 mb-1">
                      <span className="text-[10px] uppercase font-bold tracking-widest">{kpi.label}</span>
                      <kpi.icon size={14} className={kpi.color} />
                    </div>
                    <div className="text-xl font-bold tracking-tight">{kpi.value}</div>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-1 gap-6 overflow-hidden min-h-0">
                {/* SPEND BEHAVIOR CHART */}
                <div className="flex-[3] flex flex-col bg-[#1a1b20] border border-white/5 rounded-3xl p-6 relative overflow-hidden shadow-xl">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex flex-col gap-1">
                      <h2 className="font-bold text-lg">Spend Behavior</h2>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                        {processed.trend > 0 ? <ArrowUpRight size={10} className="text-red-400" /> : <ArrowDownRight size={10} className="text-green-400" />}
                        {Math.abs(processed.trend).toFixed(1)}% Deviation Observed
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-[#0f0f11] p-1.5 rounded-xl border border-white/10 shadow-inner">
                      <div className="flex gap-1 pr-3 border-r border-white/10">
                        <button onClick={() => setChartType('bar')} className={`p-2 rounded-lg transition-all ${chartType === 'bar' ? 'bg-[#a02ff1] text-white' : 'text-gray-500'}`}><BarChart3 size={16} /></button>
                        <button onClick={() => setChartType('area')} className={`p-2 rounded-lg transition-all ${chartType === 'area' ? 'bg-[#a02ff1] text-white' : 'text-gray-500'}`}><Activity size={16} /></button>
                        <button onClick={() => setChartType('line')} className={`p-2 rounded-lg transition-all ${chartType === 'line' ? 'bg-[#a02ff1] text-white' : 'text-gray-500'}`}><LineChartIcon size={16} /></button>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === 'bar' ? (
                        <BarChart data={processed.chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                          <XAxis dataKey="date" stroke="#4b5563" fontSize={10} tickFormatter={str => str.slice(5)} axisLine={false} tickLine={false} />
                          <YAxis stroke="#4b5563" fontSize={10} tickFormatter={val => `$${val}`} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ background: '#0f0f11', border: '1px solid #333', borderRadius: '12px' }} formatter={(val) => formatCurrency(val)} />
                          {processed.activeKeys.map((key, index) => !hiddenSeries.has(key) && (
                            <Bar key={key} dataKey={key} stackId="a" fill={key === 'Others' ? OTHER_COLOR : COLOR_PALETTE[index % COLOR_PALETTE.length]} radius={key === processed.activeKeys[processed.activeKeys.length-1] ? [3, 3, 0, 0] : [0,0,0,0]} />
                          ))}
                          {showAverage && <ReferenceLine y={processed.avgDaily} stroke="#ef4444" strokeDasharray="3 3" />}
                          <Brush dataKey="date" height={25} stroke="#333" fill="#0f0f11" tickFormatter={() => ''} />
                        </BarChart>
                      ) : chartType === 'area' ? (
                        <AreaChart data={processed.chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                          <XAxis dataKey="date" stroke="#4b5563" fontSize={10} tickFormatter={str => str.slice(5)} />
                          <YAxis stroke="#4b5563" fontSize={10} tickFormatter={val => `$${val}`} />
                          <Tooltip contentStyle={{ background: '#0f0f11', border: '1px solid #333', borderRadius: '12px' }} formatter={(val) => formatCurrency(val)} />
                          {processed.activeKeys.map((key, index) => !hiddenSeries.has(key) && (
                            <Area key={key} type="monotone" dataKey={key} stackId="1" stroke={key === 'Others' ? OTHER_COLOR : COLOR_PALETTE[index % COLOR_PALETTE.length]} fill={key === 'Others' ? OTHER_COLOR : COLOR_PALETTE[index % COLOR_PALETTE.length]} fillOpacity={0.4} />
                          ))}
                          <Brush dataKey="date" height={25} stroke="#333" fill="#0f0f11" />
                        </AreaChart>
                      ) : (
                        <LineChart data={processed.chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                          <XAxis dataKey="date" stroke="#4b5563" fontSize={10} tickFormatter={str => str.slice(5)} />
                          <YAxis stroke="#4b5563" fontSize={10} tickFormatter={val => `$${val}`} />
                          <Tooltip contentStyle={{ background: '#0f0f11', border: '1px solid #333', borderRadius: '12px' }} formatter={(val) => formatCurrency(val)} />
                          {processed.activeKeys.map((key, index) => !hiddenSeries.has(key) && (
                            <Line key={key} type="monotone" dataKey={key} stroke={key === 'Others' ? OTHER_COLOR : COLOR_PALETTE[index % COLOR_PALETTE.length]} strokeWidth={2} dot={false} />
                          ))}
                        </LineChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* COST DRIVER CONTRIBUTION PANEL */}
                <div className="flex-1 flex flex-col bg-[#1a1b20] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                  <div className="p-6 pb-4 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400">Cost Driver Contribution</h3>
                    <button onClick={() => {setHiddenSeries(new Set()); setActiveSolo(null);}} className="text-[10px] text-[#a02ff1] font-bold hover:underline">Reset View</button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                    {processed.activeKeys.map((key, idx) => {
                      const val = processed.categoryTotals[key];
                      const isHidden = hiddenSeries.has(key);
                      const color = key === 'Others' ? OTHER_COLOR : COLOR_PALETTE[idx % COLOR_PALETTE.length];
                      
                      return (
                        <div key={key} onClick={() => toggleSeries(key)} className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border ${isHidden ? 'bg-transparent border-transparent opacity-30 scale-95' : 'bg-[#0f0f11]/50 border-white/5 hover:border-[#a02ff1]/40 shadow-sm'}`}>
                          <div className="flex items-center gap-3 overflow-hidden">
                            <button onClick={(e) => { e.stopPropagation(); handleSolo(key); }} className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${activeSolo === key ? 'bg-[#a02ff1] text-white' : 'bg-white/10 text-gray-500 hover:text-white'}`}>
                              <Target size={12} />
                            </button>
                            <div className="overflow-hidden">
                              <div className="text-[11px] font-bold text-white truncate max-w-[100px]">{key}</div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                                <span className="text-[10px] text-gray-500">{((val/processed.totalSpend)*100).toFixed(1)}% share</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right font-mono text-xs font-bold text-[#a02ff1]">{formatCurrency(val)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* PREDICTABILITY TAB */}
          {activeTab === 'predictability' && (
            <motion.div
              key="predictability"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="pt-6"
            >
              <div className="grid grid-cols-1 gap-6">
                <CostPredictability dailyData={processed?.dailyData || []} />
              </div>
            </motion.div>
          )}

          {/* RISK TAB */}
          {activeTab === 'risk' && (
            <motion.div
              key="risk"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="pt-6"
            >
              <div className="grid grid-cols-1 gap-6">
                <CostConcentration groupedData={processed?.groupedData || []} totalSpend={processed?.totalSpend || 0} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        )}
      </div>

      {/* KPI DETAIL MODAL */}
      <AnimatePresence>
        {selectedKpi && kpiDetails && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/40">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#1a1b20] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#25262b]">
                <h3 className="text-xl font-bold text-white">{kpiDetails.title}</h3>
                <button onClick={() => setSelectedKpi(null)} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white"><X size={20}/></button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-400">{kpiDetails.description}</p>
                {kpiDetails.items && (
                  <div className="space-y-2">
                    {kpiDetails.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-black/20 rounded-xl border border-white/5">
                        <span className="text-xs text-gray-300 truncate w-40">{item.name}</span>
                        <span className="text-xs font-mono font-bold text-[#a02ff1]">{formatCurrency(item.val)}</span>
                      </div>
                    ))}
                  </div>
                )}
                {kpiDetails.stats && (
                   <div className="grid grid-cols-2 gap-3">
                      {kpiDetails.stats.map((s, i) => (
                        <div key={i} className="bg-black/20 p-3 rounded-xl border border-white/5 text-center">
                           <div className="text-[10px] text-gray-500 uppercase font-bold">{s.label}</div>
                           <div className="text-sm font-bold text-white mt-1">{formatCurrency(s.val)}</div>
                        </div>
                      ))}
                   </div>
                )}
              </div>
              <div className="p-4 bg-[#0f0f11] flex justify-end">
                <button onClick={() => setSelectedKpi(null)} className="px-6 py-2 bg-[#a02ff1] text-white text-xs font-bold rounded-xl shadow-lg">Confirm & Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CostAnalysis;
