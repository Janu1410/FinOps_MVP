import React, { useMemo, useState } from 'react';
import { 
  Server, Tag, AlertOctagon, Search, 
  Box, X, Copy, Globe, Layers, 
  CreditCard, Hash, Download,
  TrendingUp, TrendingDown, Zap, AlertTriangle, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- UTILS ---
const formatCurrency = (val) => 
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(val);

// --- COMPONENT: SPARKLINE ---
const Sparkline = ({ data, color = '#a02ff1' }) => {
  if (!data || data.length < 2) return <div className="h-8 w-24 bg-white/5 rounded" />;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg className="h-8 w-24 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
};

const ResourceInventory = ({ data }) => {
  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [showUntaggedOnly, setShowUntaggedOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedResource, setSelectedResource] = useState(null); 
  const itemsPerPage = 20;

  // --- 1. AGGREGATE DATA ---
  const { inventory, filters } = useMemo(() => {
    if (!data || data.length === 0) return { inventory: [], filters: { services: [], regions: [] } };

    const resourceMap = {};
    const services = new Set();
    const regions = new Set();

    data.forEach(row => {
      const resId = row.ResourceId || row.ResourceName || row.ItemDescription;
      if (!resId) return; 

      if (!resourceMap[resId]) {
        resourceMap[resId] = {
          id: resId,
          name: row.ResourceName,
          service: row.ServiceName || 'Unknown',
          region: row.RegionName || 'Global',
          account: row.SubAccountName || row.PayerAccountId || 'Unknown',
          zone: row.AvailabilityZone,
          operation: row.Operation,
          usageType: row.UsageType,
          totalCost: 0,
          dailyCosts: {},
          tags: {},
          rawRows: [], 
          allMetadata: {} 
        };
      }

      const r = resourceMap[resId];
      const cost = parseFloat(row.BilledCost) || 0;
      const date = row.ChargePeriodStart?.split(' ')[0];

      r.totalCost += cost;
      if (date) r.dailyCosts[date] = (r.dailyCosts[date] || 0) + cost;
      r.rawRows.push(row);

      Object.keys(row).forEach(key => {
        if (row[key] && !r.allMetadata[key]) r.allMetadata[key] = row[key];
      });

      if (Object.keys(r.tags).length === 0 && row.Tags && row.Tags !== '{}') {
        try {
           const cleaned = row.Tags.replace(/""/g, '"').replace(/^"|"$/g, '');
           const parsed = JSON.parse(cleaned);
           if (Object.keys(parsed).length > 0) r.tags = parsed;
        } catch(e) {}
      }

      if (row.ServiceName) services.add(row.ServiceName);
      if (row.RegionName) regions.add(row.RegionName);
    });

    const inventoryList = Object.values(resourceMap)
      .map(r => {
        const trend = Object.keys(r.dailyCosts).sort().map(d => r.dailyCosts[d]);
        // Smart Status Logic
        let status = 'Steady';
        const start = trend[0] || 0;
        const end = trend[trend.length - 1] || 0;
        
        if (end > start * 1.2 && start > 0) status = 'Spiking';
        else if (end === 0 && r.totalCost > 0) status = 'Zombie'; 
        else if (end < start * 0.8) status = 'Decreasing';
        else if (start === 0 && end > 0) status = 'New';

        return {
          ...r,
          trend,
          status,
          hasTags: Object.keys(r.tags).length > 0
        };
      })
      .sort((a, b) => b.totalCost - a.totalCost);

    return { 
      inventory: inventoryList, 
      filters: { services: Array.from(services).sort(), regions: Array.from(regions).sort() } 
    };
  }, [data]);

  // --- 2. FILTERING ---
  const filteredData = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (item.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesService = selectedService === 'All' || item.service === selectedService;
      const matchesRegion = selectedRegion === 'All' || item.region === selectedRegion;
      const matchesUntagged = !showUntaggedOnly || !item.hasTags;

      return matchesSearch && matchesService && matchesRegion && matchesUntagged;
    });
  }, [inventory, searchTerm, selectedService, selectedRegion, showUntaggedOnly]);

  // --- 3. PAGINATION ---
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // --- ACTIONS ---
  const copyToClipboard = (text) => navigator.clipboard.writeText(text);

  const downloadCSV = () => {
    if (!filteredData.length) return;
    const headers = ['Resource ID', 'Service', 'Region', 'Account', 'Total Cost', 'Status', 'Tags'];
    const rows = filteredData.map(item => [
        item.id,
        item.service,
        item.region,
        item.account,
        item.totalCost.toFixed(2),
        item.status,
        JSON.stringify(item.tags).replace(/"/g, '""') 
    ].join(','));
    
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Resource_Inventory_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
  };

  // --- HELPER: Status Badge ---
  const StatusBadge = ({ status }) => {
    let styles = "bg-gray-500/10 text-gray-400 border-gray-500/20";
    let icon = <Activity size={10} />;
    
    if (status === 'Spiking') { styles = "bg-red-500/10 text-red-400 border-red-500/20"; icon = <TrendingUp size={10} />; }
    if (status === 'Decreasing') { styles = "bg-green-500/10 text-green-400 border-green-500/20"; icon = <TrendingDown size={10} />; }
    if (status === 'Zombie') { styles = "bg-orange-500/10 text-orange-400 border-orange-500/20"; icon = <AlertTriangle size={10} />; }
    if (status === 'New') { styles = "bg-blue-500/10 text-blue-400 border-blue-500/20"; icon = <Zap size={10} />; }

    return (
        <span className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] uppercase font-bold w-fit ${styles}`}>
            {icon} {status}
        </span>
    );
  };

  if (!data || data.length === 0) return <div className="p-10 text-center text-gray-500">No data available.</div>;

  return (
    <div className="p-6 space-y-6 min-h-screen bg-[#0f0f11] text-white font-sans animate-in fade-in duration-500 relative">
      
      {/* 1. HEADER & SUMMARY */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Box className="text-[#a02ff1]" /> Resource Inventory
          </h1>
          <p className="text-gray-400 text-sm">Interactive asset explorer. Click any row for details.</p>
        </div>
        <div className="flex items-center gap-2">
            {/* Quick Stats */}
            <div className="hidden md:flex gap-4 text-xs text-gray-400 bg-[#1a1b20] px-3 py-1.5 rounded-lg border border-white/10 mr-2">
                <div className="flex gap-2"><span>Total:</span> <strong className="text-white">{inventory.length}</strong></div>
                <div className="w-px bg-white/10" />
                <div className="flex gap-2"><span>Untagged:</span> <strong className="text-red-400">{inventory.filter(i=>!i.hasTags).length}</strong></div>
            </div>
            
            <button onClick={downloadCSV} className="flex items-center gap-2 bg-[#a02ff1] hover:bg-[#8e25d9] text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg shadow-purple-500/20">
                <Download size={14} /> Export CSV
            </button>
        </div>
      </div>

      {/* 2. ADVANCED FILTERS (FIXED COLORS) */}
      <div className="bg-[#1a1b20] p-4 rounded-xl border border-white/10 flex flex-col md:flex-row gap-4">
         <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input 
              type="text" placeholder="Search by ID, Service, or Name..." 
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:border-[#a02ff1] outline-none"
            />
         </div>
         
         {/* SERVICE SELECT - Fixed Option Colors */}
         <select 
            value={selectedService} 
            onChange={(e) => setSelectedService(e.target.value)} 
            className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#a02ff1] outline-none cursor-pointer w-full md:w-auto"
         >
            <option value="All" className="bg-[#1a1b20] text-white">All Services</option>
            {filters.services.map(s => <option key={s} value={s} className="bg-[#1a1b20] text-white">{s}</option>)}
         </select>

         {/* REGION SELECT - Fixed Option Colors */}
         <select 
            value={selectedRegion} 
            onChange={(e) => setSelectedRegion(e.target.value)} 
            className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#a02ff1] outline-none cursor-pointer w-full md:w-auto"
         >
            <option value="All" className="bg-[#1a1b20] text-white">All Regions</option>
            {filters.regions.map(r => <option key={r} value={r} className="bg-[#1a1b20] text-white">{r}</option>)}
         </select>

         {/* UNTAGGED BUTTON - High Contrast Colors */}
         <button 
            onClick={() => setShowUntaggedOnly(!showUntaggedOnly)} 
            className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all flex items-center gap-2 whitespace-nowrap 
                ${showUntaggedOnly 
                    ? 'bg-red-500/20 border-red-500 text-red-400' 
                    : 'bg-black/40 border-white/10 text-gray-300 hover:text-white hover:border-white/30'
                }`}
         >
            <AlertOctagon size={14} /> Untagged Only
         </button>
      </div>

      {/* 3. MAIN TABLE */}
      <div className="bg-[#1a1b20] border border-white/10 rounded-xl overflow-hidden shadow-lg">
         <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
              <thead className="bg-[#25262b] text-gray-400 text-[10px] uppercase font-bold tracking-wider">
                 <tr>
                    <th className="px-4 py-3 border-b border-white/10">Identifier</th>
                    <th className="px-4 py-3 border-b border-white/10">Analysis</th>
                    <th className="px-4 py-3 border-b border-white/10">Tags</th>
                    <th className="px-4 py-3 border-b border-white/10">Spend Trend</th>
                    <th className="px-4 py-3 border-b border-white/10 text-right">Total Cost</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                 {paginatedData.map((item) => (
                    <tr 
                      key={item.id} 
                      onClick={() => setSelectedResource(item)}
                      className="hover:bg-white/5 cursor-pointer group transition-colors"
                    >
                       {/* ID Column */}
                       <td className="px-4 py-3">
                          <div className="flex items-start gap-3">
                             <div className="p-1.5 bg-[#a02ff1]/10 text-[#a02ff1] rounded mt-0.5"><Server size={14} /></div>
                             <div className="flex flex-col max-w-[280px]">
                                <span className="font-bold text-white truncate text-sm hover:text-[#a02ff1] transition-colors" title={item.id}>{item.id}</span>
                                <div className="flex items-center gap-2 mt-0.5">
                                   <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-gray-400 border border-white/5">{item.service}</span>
                                   <span className="text-[10px] text-gray-500">{item.region}</span>
                                </div>
                             </div>
                          </div>
                       </td>

                       {/* Status Analysis Column */}
                       <td className="px-4 py-3">
                          <div className="flex flex-col gap-1.5">
                             <StatusBadge status={item.status} />
                             <span className="text-[10px] text-gray-500 truncate max-w-[150px]">{item.account}</span>
                          </div>
                       </td>

                       {/* Tags Column */}
                       <td className="px-4 py-3">
                          {item.hasTags ? (
                             <div className="flex flex-wrap gap-1 max-w-[200px]">
                                {Object.entries(item.tags).slice(0, 2).map(([k, v]) => (
                                   <span key={k} className="px-1.5 py-0.5 bg-blue-500/5 border border-blue-500/20 rounded text-[9px] text-blue-300 truncate max-w-[100px]" title={`${k}: ${v}`}>
                                      {k}: {v}
                                   </span>
                                ))}
                                {Object.keys(item.tags).length > 2 && <span className="text-[9px] text-gray-500 px-1">+{Object.keys(item.tags).length - 2}</span>}
                             </div>
                          ) : (
                             // The No Tags Part
                             <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded">
                                <AlertTriangle size={10} /> Missing Tags
                             </span>
                          )}
                       </td>

                       {/* Trend */}
                       <td className="px-4 py-3">
                          <Sparkline data={item.trend} color={item.status === 'Spiking' ? '#ef4444' : '#a02ff1'} />
                       </td>

                       {/* Cost */}
                       <td className="px-4 py-3 text-right">
                          <div className="text-sm font-bold text-white font-mono">{formatCurrency(item.totalCost)}</div>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
         </div>
         
         {/* PAGINATION */}
         <div className="px-4 py-3 border-t border-white/10 flex justify-between items-center text-xs text-gray-500 bg-[#15161a]">
            <span>Showing {paginatedData.length} of {filteredData.length}</span>
            <div className="flex gap-2">
               <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 bg-white/5 rounded hover:bg-white/10 disabled:opacity-30 transition-colors">Previous</button>
               <span className="py-1">Page {currentPage} of {totalPages}</span>
               <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 bg-white/5 rounded hover:bg-white/10 disabled:opacity-30 transition-colors">Next</button>
            </div>
         </div>
      </div>

      {/* 4. RESOURCE INSPECTOR (SLIDE-OVER PANEL) */}
      <AnimatePresence>
         {selectedResource && (
            <>
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedResource(null)} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" />
               <motion.div 
                 initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} 
                 className="fixed right-0 top-0 bottom-0 w-[600px] bg-[#1a1b20] border-l border-white/10 shadow-2xl z-50 flex flex-col"
               >
                  {/* Panel Header */}
                  <div className="p-6 border-b border-white/10 bg-[#25262b] flex justify-between items-start">
                     <div>
                        <div className="flex items-center gap-2 mb-2">
                           <StatusBadge status={selectedResource.status} />
                           <span className="text-xs text-gray-500">{selectedResource.service}</span>
                        </div>
                        <h2 className="text-xl font-bold text-white break-all">{selectedResource.id}</h2>
                        <div className="flex items-center gap-2 mt-2">
                           <button onClick={() => copyToClipboard(selectedResource.id)} className="text-xs text-[#a02ff1] hover:text-white flex items-center gap-1 transition-colors"><Copy size={12} /> Copy ID</button>
                        </div>
                     </div>
                     <button onClick={() => setSelectedResource(null)} className="p-2 bg-white/5 rounded-full hover:bg-white/20 text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
                  </div>

                  {/* Panel Content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                     
                     {/* Cost Summary */}
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                           <p className="text-xs text-gray-500 uppercase font-bold mb-1">Total Cost (Period)</p>
                           <p className="text-2xl font-bold text-white">{formatCurrency(selectedResource.totalCost)}</p>
                        </div>
                        <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                           <p className="text-xs text-gray-500 uppercase font-bold mb-1">Tags Detected</p>
                           <p className={`text-2xl font-bold ${selectedResource.hasTags ? 'text-blue-400' : 'text-red-400'}`}>
                              {Object.keys(selectedResource.tags).length}
                           </p>
                        </div>
                     </div>

                     {/* Tag Grid */}
                     <div>
                        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Tag size={14} /> Resource Tags</h3>
                        {selectedResource.hasTags ? (
                           <div className="grid grid-cols-2 gap-2">
                              {Object.entries(selectedResource.tags).map(([k, v]) => (
                                 <div key={k} className="flex flex-col p-2 bg-white/5 rounded border border-white/5">
                                    <span className="text-[10px] text-gray-500 uppercase font-bold truncate">{k}</span>
                                    <span className="text-xs text-white truncate" title={v}>{v}</span>
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center flex flex-col items-center gap-2">
                              <AlertOctagon size={24} />
                              <span className="font-bold">Missing Tags</span>
                              <span className="text-xs opacity-70">This resource has no cost allocation tags.</span>
                           </div>
                        )}
                     </div>

                     {/* FULL METADATA TABLE */}
                     <div>
                        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><CreditCard size={14} /> All Attributes</h3>
                        <div className="border border-white/10 rounded-xl overflow-hidden">
                           <table className="w-full text-xs text-left">
                              <tbody className="divide-y divide-white/5">
                                 {Object.entries(selectedResource.allMetadata)
                                    .filter(([k]) => !['Tags', 'BilledCost', 'EffectiveCost', 'TotalCost'].includes(k)) 
                                    .sort()
                                    .map(([key, value]) => (
                                    <tr key={key} className="bg-[#15161a] hover:bg-white/5 transition-colors">
                                       <td className="px-4 py-2 text-gray-500 font-medium w-1/3 break-words border-r border-white/5 bg-black/20">{key}</td>
                                       <td className="px-4 py-2 text-gray-300 font-mono break-all">{String(value)}</td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
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

export default ResourceInventory;