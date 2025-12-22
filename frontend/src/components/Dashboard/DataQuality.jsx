import React, { useMemo, useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle, 
  Tag, Database, FileWarning, Search, BarChart3, 
  Download, X, Copy, Info, Mail, TrendingUp, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- UTILS ---
const formatCurrency = (val) => 
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(val);

const DataQuality = ({ data }) => {
  const [activeTab, setActiveTab] = useState('overview'); 
  const [selectedIssue, setSelectedIssue] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // --- 1. ADVANCED ANALYSIS ---
  const stats = useMemo(() => {
    if (!data || data.length === 0) return null;

    let totalRows = data.length;
    let totalSpend = 0;
    
    // ✅ CRITICAL FIX: Ensure keys here match the Tab IDs below
    const buckets = { 
        untagged: [], 
        missingMeta: [], // This name must match the tab ID
        anomalies: [], 
        all: [] 
    };
    
    const serviceOffenders = {};
    const tagKeyCounts = {}; 
    const dailyScores = {};

    data.forEach(row => {
      let rawCost = row.BilledCost;
      if (typeof rawCost === 'string') rawCost = rawCost.replace(/[$,]/g, '');
      const cost = parseFloat(rawCost) || 0;
      totalSpend += cost;
      
      const date = row.ChargePeriodStart ? row.ChargePeriodStart.split(' ')[0] : 'Unknown';

      // A. Check Tags
      let isUntagged = false;
      let tagsObj = {};
      try {
         if (row.Tags && row.Tags !== '{}') {
            const clean = row.Tags.replace(/""/g, '"').replace(/^"|"$/g, '');
            tagsObj = JSON.parse(clean);
            Object.keys(tagsObj).forEach(k => {
                tagKeyCounts[k] = (tagKeyCounts[k] || 0) + 1;
            });
         }
      } catch (e) {}

      if (!row.Tags || Object.keys(tagsObj).length === 0) isUntagged = true;

      // B. Check Metadata
      const missingId = !row.ResourceId && !row.ResourceName;
      const missingService = !row.ServiceName;
      const missingRegion = !row.RegionName;
      
      const issuesFound = [];
      if (isUntagged) issuesFound.push('Untagged');
      if (missingId) issuesFound.push('Missing ID');
      if (missingService) issuesFound.push('Missing Service');
      if (cost <= 0) issuesFound.push('Zero Cost');

      const enriched = { ...row, _parsedCost: cost, _issues: issuesFound };
      
      buckets.all.push(enriched);
      if (isUntagged) buckets.untagged.push(enriched);
      // Logic for missingMeta
      if (missingId || missingService || missingRegion) buckets.missingMeta.push(enriched);
      if (cost <= 0) buckets.anomalies.push(enriched);

      // C. Daily Scoring
      if (!dailyScores[date]) dailyScores[date] = { total: 0, bad: 0 };
      dailyScores[date].total++;
      if (isUntagged || missingId) dailyScores[date].bad++;

      // D. Offenders
      if (isUntagged && cost > 0) {
        const svc = row.ServiceName || 'Unknown';
        if (!serviceOffenders[svc]) serviceOffenders[svc] = { count: 0, cost: 0 };
        serviceOffenders[svc].count++;
        serviceOffenders[svc].cost += cost;
      }
    });

    // Score Calculation
    let score = 100;
    const untaggedSpend = buckets.untagged.reduce((a,b) => a + b._parsedCost, 0);
    const untaggedPct = totalSpend > 0 ? (untaggedSpend / totalSpend) : 0;
    
    if (untaggedPct > 0.01) score -= Math.min(40, Math.ceil(untaggedPct * 100 * 0.5));
    if ((buckets.missingMeta.length / totalRows) > 0.05) score -= 30;
    if (buckets.anomalies.length > 0) score -= 10;

    const compliance = Object.entries(tagKeyCounts)
       .map(([key, count]) => ({ key, count, pct: (count / totalRows) * 100 }))
       .sort((a,b) => b.count - a.count)
       .slice(0, 5);

    const trendData = Object.keys(dailyScores).sort().map(d => {
        const day = dailyScores[d];
        const dailyScore = Math.max(0, 100 - Math.round((day.bad / day.total) * 100)); 
        return { date: d, score: dailyScore };
    });

    return { 
        score: Math.max(0, score), 
        totalRows, 
        costAtRisk: untaggedSpend, 
        buckets, 
        compliance,
        trendData,
        topOffenders: Object.entries(serviceOffenders)
            .map(([name, val]) => ({ name, ...val }))
            .sort((a, b) => b.cost - a.cost).slice(0, 5)
    };
  }, [data]);

  // --- ACTIONS ---
  const handleEmailDraft = () => {
    const subject = `Action Required: Cloud Data Quality Report (${stats.score}/100)`;
    const body = `Team,%0D%0A%0D%0AWe analyzed our cloud billing data and found issues affecting ${formatCurrency(stats.costAtRisk)} of spend.%0D%0A%0D%0A- Untagged Resources: ${stats.buckets.untagged.length}%0D%0A- Missing Metadata: ${stats.buckets.missingMeta.length}%0D%0A%0D%0APlease review the attached remediation plan.%0D%0A%0D%0AThanks,`;
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  // --- 2. PAGINATION (CRASH FIXED HERE) ---
  const currentListData = useMemo(() => {
    if (!stats) return [];
    
    // ✅ SAFETY CHECK: If the key doesn't exist, default to empty array
    const list = activeTab === 'overview' ? stats.buckets.all : (stats.buckets[activeTab] || []);
    
    const start = (currentPage - 1) * itemsPerPage;
    return list.slice(start, start + itemsPerPage);
  }, [stats, activeTab, currentPage]);

  const totalPages = useMemo(() => {
    if (!stats) return 0;
    // ✅ SAFETY CHECK here too
    const list = activeTab === 'overview' ? stats.buckets.all : (stats.buckets[activeTab] || []);
    return Math.ceil(list.length / itemsPerPage);
  }, [stats, activeTab]);

  // --- HELPER: SCORE COLORS ---
  const getScoreColor = (s) => s >= 90 ? 'text-green-400' : s >= 70 ? 'text-yellow-400' : 'text-red-500';
  const getScoreBg = (s) => s >= 90 ? 'bg-green-500/10 border-green-500/20' : s >= 70 ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-red-500/10 border-red-500/20';

  // --- RENDER BADGE ---
  const getBadge = (issues) => {
    if (!issues || issues.length === 0) return <span className="text-green-500 text-xs flex items-center gap-1"><CheckCircle size={12}/> Healthy</span>;
    if (issues.includes('Missing ID') || issues.includes('Missing Service')) return <span className="text-red-400 text-xs flex items-center gap-1 font-bold"><ShieldAlert size={12}/> Broken</span>;
    if (issues.includes('Untagged')) return <span className="text-yellow-400 text-xs flex items-center gap-1"><Tag size={12}/> Untagged</span>;
    return <span className="text-blue-400 text-xs flex items-center gap-1"><FileWarning size={12}/> Info</span>;
  };

  if (!stats) return <div className="p-10 text-gray-500 text-center">Analyzing Data Quality...</div>;

  return (
    <div className="p-6 space-y-6 min-h-screen bg-[#0f0f11] text-white font-sans animate-in fade-in duration-500 relative">
      
      {/* 1. HEADER ROW */}
      <div className="flex flex-col lg:flex-row gap-6">
         
         {/* SCORE CARD */}
         <div className={`flex-1 flex flex-col justify-center p-6 rounded-2xl border ${getScoreBg(stats.score)} relative overflow-hidden`}>
            <div className="z-10">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-xs font-bold uppercase opacity-70">Data Health Score</p>
                    <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-black/20 ${getScoreColor(stats.score)}`}>
                        {stats.score >= 90 ? 'Excellent' : stats.score >= 70 ? 'Fair' : 'Critical'}
                    </div>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className={`text-5xl font-black ${getScoreColor(stats.score)}`}>{stats.score}</span>
                    <span className="text-sm opacity-50">/ 100</span>
                </div>
            </div>
            {/* Simple Trend Visual */}
            <div className="absolute bottom-0 right-0 w-32 h-16 opacity-20">
                <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                    <polyline points={stats.trendData.map((d,i) => `${(i/(stats.trendData.length-1))*100},${100-d.score}`).join(' ')} fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
            </div>
         </div>

         {/* TAG COMPLIANCE MATRIX */}
         <div className="flex-[2] bg-[#1a1b20] border border-white/10 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Tag size={14} className="text-[#a02ff1]" /> Tag Compliance Breakdown
            </h3>
            <div className="space-y-3">
                {stats.compliance.length > 0 ? stats.compliance.map((item) => (
                    <div key={item.key} className="flex items-center gap-3 text-xs">
                        <span className="w-24 text-gray-400 truncate text-right font-mono">{item.key}</span>
                        <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${item.pct > 80 ? 'bg-green-500' : item.pct > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${item.pct}%` }} />
                        </div>
                        <span className="w-10 text-right text-white font-bold">{item.pct.toFixed(0)}%</span>
                    </div>
                )) : (
                    <div className="text-gray-500 text-center py-4 italic">No tags found in dataset.</div>
                )}
            </div>
         </div>
      </div>

      {/* 2. ACTION BAR */}
      <div className="flex justify-between items-center bg-[#1a1b20] p-3 rounded-xl border border-white/10">
         <div className="flex gap-4 items-center px-2">
             <div className="flex flex-col">
                 <span className="text-[10px] text-gray-500 uppercase font-bold">Cost at Risk</span>
                 <span className="text-lg font-bold text-red-400">{formatCurrency(stats.costAtRisk)}</span>
             </div>
             <div className="w-px h-8 bg-white/10" />
             <div className="flex flex-col">
                 <span className="text-[10px] text-gray-500 uppercase font-bold">Untagged Rows</span>
                 <span className="text-lg font-bold text-white">{stats.buckets.untagged.length.toLocaleString()}</span>
             </div>
         </div>
         <button onClick={handleEmailDraft} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-bold transition-colors">
             <Mail size={14} /> Draft Alert Email
         </button>
      </div>

      {/* 3. MAIN TABLE & INSPECTOR CONTAINER */}
      <div className="bg-[#1a1b20] border border-white/10 rounded-xl flex flex-col h-[550px]">
         {/* Tabs - ✅ FIXED ID NAMING HERE */}
         <div className="p-4 border-b border-white/10 flex gap-2 bg-[#25262b] overflow-x-auto">
            {[
                { id: 'overview', label: 'All Records' },
                { id: 'untagged', label: `Untagged (${stats.buckets.untagged.length})` },
                { id: 'missingMeta', label: `Broken Metadata (${stats.buckets.missingMeta.length})` }, // ✅ Matched keys
                { id: 'anomalies', label: `Zero Cost (${stats.buckets.anomalies.length})` }
            ].map(tab => (
                <button 
                    key={tab.id} 
                    onClick={() => { setActiveTab(tab.id); setCurrentPage(1); }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-[#a02ff1] text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    {tab.label}
                </button>
            ))}
         </div>

         {/* Table */}
         <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-xs">
               <thead className="bg-[#15161a] text-gray-500 font-bold sticky top-0 z-10 shadow-sm">
                  <tr>
                     <th className="px-6 py-3 w-10">Status</th>
                     <th className="px-6 py-3">Service</th>
                     <th className="px-6 py-3">Resource Identifier</th>
                     <th className="px-6 py-3">Issues Found</th>
                     <th className="px-6 py-3 text-right">Cost</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {currentListData.length > 0 ? currentListData.map((row, i) => (
                     <tr key={i} onClick={() => setSelectedIssue(row)} className="hover:bg-white/5 cursor-pointer transition-colors group">
                        <td className="px-6 py-3">{getBadge(row._issues)}</td>
                        <td className="px-6 py-3 text-white">{row.ServiceName || 'Unknown'}</td>
                        <td className="px-6 py-3 font-mono text-gray-400 truncate max-w-[200px]">{row.ResourceId || row.ResourceName || <span className="italic opacity-50">--</span>}</td>
                        <td className="px-6 py-3">
                            {row._issues.length > 0 ? (
                                <div className="flex gap-1">
                                    {row._issues.slice(0, 2).map(iss => (
                                        <span key={iss} className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-[10px]">{iss}</span>
                                    ))}
                                    {row._issues.length > 2 && <span className="text-gray-500 text-[10px] self-center">+{row._issues.length - 2}</span>}
                                </div>
                            ) : <span className="text-green-500 text-[10px]">Healthy</span>}
                        </td>
                        <td className="px-6 py-3 text-right font-mono text-white">{formatCurrency(row._parsedCost)}</td>
                     </tr>
                  )) : (
                      <tr><td colSpan="5" className="p-10 text-center text-gray-500">No records found for this category.</td></tr>
                  )}
               </tbody>
            </table>
         </div>

         {/* Pagination */}
         <div className="p-3 bg-[#15161a] border-t border-white/10 flex justify-between items-center text-xs text-gray-500">
            <span>Page {currentPage} of {totalPages || 1}</span>
            <div className="flex gap-2">
               <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage===1} className="px-3 py-1 bg-white/5 rounded hover:bg-white/10 disabled:opacity-30">Prev</button>
               <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage===totalPages || totalPages===0} className="px-3 py-1 bg-white/5 rounded hover:bg-white/10 disabled:opacity-30">Next</button>
            </div>
         </div>
      </div>

      {/* 4. SLIDE-OVER INSPECTOR */}
      <AnimatePresence>
         {selectedIssue && (
            <>
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedIssue(null)} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" />
               <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25 }} className="fixed right-0 top-0 bottom-0 w-[500px] bg-[#1a1b20] border-l border-white/10 shadow-2xl z-50 flex flex-col">
                  
                  {/* Inspector Header */}
                  <div className="p-6 border-b border-white/10 bg-[#25262b] flex justify-between items-start">
                     <div>
                        <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Issue Inspector</span>
                        <h2 className="text-xl font-bold text-white mt-1 break-all">{selectedIssue.ResourceId || 'Unknown Resource'}</h2>
                     </div>
                     <button onClick={() => setSelectedIssue(null)} className="p-2 hover:bg-white/10 rounded-full"><X size={20} className="text-gray-400" /></button>
                  </div>

                  {/* Inspector Content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                     
                     {/* Diagnosis */}
                     {selectedIssue._issues.length > 0 ? (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                           <h3 className="text-sm font-bold text-red-400 mb-2 flex items-center gap-2"><AlertTriangle size={14}/> Diagnosis</h3>
                           <ul className="list-disc list-inside text-xs text-gray-300 space-y-2">
                              {selectedIssue._issues.map(issue => (
                                 <li key={issue}>
                                    <strong className="text-white">{issue}:</strong> 
                                    {issue === 'Untagged' ? ' Missing allocation tags. Cost cannot be assigned.' : 
                                     issue === 'Missing ID' ? ' Resource ID is null. Cannot track lifecycle.' : 
                                     issue === 'Missing Service' ? ' Service Name is null.' :
                                     ' Value is suspiciously low or negative.'}
                                 </li>
                              ))}
                           </ul>
                        </div>
                     ) : (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-2 text-green-400 text-sm font-bold">
                           <CheckCircle size={16} /> No Quality Issues Detected.
                        </div>
                     )}

                     {/* Metadata */}
                     <div>
                        <h3 className="text-sm font-bold text-white mb-2">Record Details</h3>
                        <div className="bg-black/20 rounded-lg border border-white/5 divide-y divide-white/5">
                           {['ServiceName', 'RegionName', 'UsageType', 'Operation'].map(k => (
                              <div key={k} className="flex justify-between p-3 text-xs">
                                 <span className="text-gray-500">{k}</span>
                                 <span className="text-gray-200 font-mono text-right">{selectedIssue[k] || '--'}</span>
                              </div>
                           ))}
                           <div className="flex justify-between p-3 text-xs bg-white/5">
                                 <span className="text-gray-500 font-bold">Billed Cost</span>
                                 <span className="text-white font-mono font-bold">{formatCurrency(selectedIssue._parsedCost)}</span>
                           </div>
                        </div>
                     </div>

                  </div>
               </motion.div>
            </>
         )}
      </AnimatePresence>

    </div>
  );
};

export default DataQuality;

