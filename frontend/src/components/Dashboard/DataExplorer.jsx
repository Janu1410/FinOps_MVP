import React, { useMemo, useState, useEffect } from 'react';
import { 
  Download, Search, Table as TableIcon, Filter, AlertCircle, 
  X, ChevronDown, ChevronUp, EyeOff, Check, Copy,
  ChevronLeft, ChevronRight, Layers, BarChart3, CheckSquare,
  PieChart, Save, Bookmark, Trash2, TrendingUp, DollarSign, Activity,
  FileSpreadsheet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DataExplorer = ({ data }) => {
  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  
  // Table State
  const [selectedRow, setSelectedRow] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({});
  const [showFilterRow, setShowFilterRow] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  
  // Display Options
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [density, setDensity] = useState('compact');
  const [showDataBars, setShowDataBars] = useState(true);
  
  // Selection
  const [selectedIndices, setSelectedIndices] = useState(new Set()); 

  // View Mode
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'pivot'
  const [groupByCol, setGroupByCol] = useState(null); 
  const [savedViews, setSavedViews] = useState([]);
  const [showViewsMenu, setShowViewsMenu] = useState(false);
  const [newViewName, setNewViewName] = useState('');

  // --- 1. INITIALIZATION ---
  const allColumns = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  const visibleColumns = useMemo(() => {
    return allColumns.filter(col => !hiddenColumns.includes(col));
  }, [allColumns, hiddenColumns]);

  useEffect(() => {
    const saved = localStorage.getItem('finops_saved_views');
    if (saved) setSavedViews(JSON.parse(saved));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedIndices(new Set());
  }, [searchTerm, filters, groupByCol, viewMode]);

  // --- 2. CORE DATA PROCESSING ---
  const processedData = useMemo(() => {
    if (!data) return [];
    let result = [...data];

    // Global Search
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(row => 
        Object.values(row).some(val => String(val).toLowerCase().includes(lowerTerm))
      );
    }

    // Column Filters
    Object.keys(filters).forEach(key => {
      const filterValue = filters[key];
      // FIX: Handle "Empty" drill-downs correctly
      if (filterValue === '__EMPTY__') {
         result = result.filter(row => !row[key] || row[key] === '');
      } else if (filterValue) {
         const lowerFilter = String(filterValue).toLowerCase();
         result = result.filter(row => 
            String(row[key] || '').toLowerCase().includes(lowerFilter)
         );
      }
    });

    return result;
  }, [data, searchTerm, filters]);

  // --- 3. SORTING ---
  const sortedData = useMemo(() => {
    let result = [...processedData];
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        const aNum = parseFloat(aVal);
        const bNum = parseFloat(bVal);

        if (!isNaN(aNum) && !isNaN(bNum)) {
            return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
        }
        const aStr = String(aVal || '').toLowerCase();
        const bStr = String(bVal || '').toLowerCase();
        if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [processedData, sortConfig]);

  // --- 4. GROUP BY / PIVOT LOGIC ---
  const groupedData = useMemo(() => {
    if (!groupByCol || viewMode !== 'pivot') return [];

    const groups = {};
    let grandTotalCost = 0;
    const costCol = allColumns.find(c => c.toLowerCase().includes('cost') && !c.toLowerCase().includes('unit')) || 'BilledCost';

    sortedData.forEach(row => {
      const rawKey = row[groupByCol];
      const key = rawKey || '(Empty)'; // Display label
      
      if (!groups[key]) {
        groups[key] = { 
            name: key, 
            rawValue: rawKey, // Store real value for filtering
            count: 0, 
            totalCost: 0 
        };
      }
      const cost = parseFloat(row[costCol] || 0);
      groups[key].count++;
      groups[key].totalCost += isNaN(cost) ? 0 : cost;
      grandTotalCost += isNaN(cost) ? 0 : cost;
    });

    return Object.values(groups)
      .map(g => ({ ...g, percent: grandTotalCost ? (g.totalCost / grandTotalCost) * 100 : 0 }))
      .sort((a, b) => b.totalCost - a.totalCost);
      
  }, [sortedData, groupByCol, viewMode, allColumns]);

  // --- 5. SMART STATS ---
  const quickStats = useMemo(() => {
     if (sortedData.length === 0) return null;
     
     const costCol = allColumns.find(c => c.toLowerCase().includes('cost') && !c.toLowerCase().includes('unit')) || 'BilledCost';
     
     const totalCost = sortedData.reduce((acc, row) => acc + (parseFloat(row[costCol]) || 0), 0);
     const avgCost = totalCost / sortedData.length;
     const maxCost = Math.max(...sortedData.map(r => parseFloat(r[costCol]) || 0));

     return { totalCost, avgCost, maxCost };
  }, [sortedData, allColumns]);

  // --- 6. SUMMARY FOOTER LOGIC ---
  const summaryData = useMemo(() => {
    const summary = {};
    visibleColumns.forEach(col => {
      const lower = col.toLowerCase();
      // Expanded logic to catch more numeric columns (e.g. usage, rates)
      const isNumeric = lower.includes('cost') || lower.includes('price') || lower.includes('amount') || lower.includes('quantity') || lower.includes('usage') || lower.includes('rate');
      const isId = lower.includes('id') && !lower.includes('price'); // Avoid summing IDs

      if (isNumeric && !isId) {
        summary[col] = sortedData.reduce((acc, row) => {
          const val = parseFloat(row[col]);
          return acc + (isNaN(val) ? 0 : val);
        }, 0);
      } else {
        summary[col] = null;
      }
    });
    return summary;
  }, [sortedData, visibleColumns]);

  const columnMaxValues = useMemo(() => {
    const maxes = {};
    visibleColumns.forEach(col => {
       if (summaryData[col] !== null) {
          maxes[col] = Math.max(...sortedData.map(d => parseFloat(d[col]) || 0));
       }
    });
    return maxes;
  }, [sortedData, visibleColumns, summaryData]);

  // --- 7. PAGINATION ---
  const tableDataToRender = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  // --- ACTIONS ---
  const handleSaveView = () => {
    if (!newViewName.trim()) return;
    const newView = {
      id: Date.now(),
      name: newViewName,
      config: { filters, sortConfig, hiddenColumns, groupByCol, viewMode, searchTerm }
    };
    const updated = [...savedViews, newView];
    setSavedViews(updated);
    localStorage.setItem('finops_saved_views', JSON.stringify(updated));
    setNewViewName('');
  };

  const loadView = (view) => {
    setFilters(view.config.filters || {});
    setSortConfig(view.config.sortConfig || { key: null, direction: 'asc' });
    setHiddenColumns(view.config.hiddenColumns || []);
    setGroupByCol(view.config.groupByCol || null);
    setViewMode(view.config.viewMode || 'table');
    setSearchTerm(view.config.searchTerm || '');
    setShowViewsMenu(false);
  };

  const deleteView = (id) => {
    const updated = savedViews.filter(v => v.id !== id);
    setSavedViews(updated);
    localStorage.setItem('finops_saved_views', JSON.stringify(updated));
  };

  // FIX: Robust Drill Down Logic
  const handleDrillDown = (group) => {
    // 1. Determine filter value (handle nulls/empty)
    const filterVal = (group.rawValue === null || group.rawValue === undefined || group.rawValue === '') 
      ? '__EMPTY__' 
      : group.rawValue;

    // 2. Apply filter
    setFilters(prev => ({ ...prev, [groupByCol]: filterVal }));
    
    // 3. Switch to Table
    setViewMode('table');
    
    // NOTE: We do NOT reset groupByCol here. This keeps the context.
  };

  const removeFilter = (key) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
  };

  // --- EXPORT LOGIC ---
  const downloadCSV = () => {
    const dataToExport = selectedIndices.size > 0 
      ? sortedData.filter((_, idx) => selectedIndices.has((currentPage - 1) * rowsPerPage + idx)) 
      : sortedData;

    if (!dataToExport.length) return;
    
    const headers = visibleColumns.join(',');
    const rows = dataToExport.map(row => 
      visibleColumns.map(col => `"${String(row[col] || '').replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    
    const blob = new Blob([headers + '\n' + rows], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `FinOps_Export_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
  };

  const toggleColumn = (col) => {
    setHiddenColumns(prev => prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]);
  };

  // --- UI HELPERS ---
  const getRowHeight = () => {
    if (density === 'compact') return 'py-1.5';
    if (density === 'standard') return 'py-3';
    return 'py-5';
  };

  const getColumnWidth = (index) => {
    if (index === 0) return 50; 
    const colName = visibleColumns[index - 1].toLowerCase();
    if (colName.includes('id') && !colName.includes('sku')) return 260;
    if (colName.includes('tags') || colName.includes('name')) return 300;
    if (colName.includes('cost') || colName.includes('price')) return 150;
    return 180;
  };

  // --- SUB-COMPONENTS ---
  const DetailPanel = () => (
    <AnimatePresence>
      {selectedRow && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedRow(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40" />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="absolute right-0 top-0 bottom-0 w-[450px] bg-[#1a1b20] border-l border-white/10 shadow-2xl z-50 flex flex-col">
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-[#25262b]">
              <div><h3 className="text-white font-bold text-lg">Row Details</h3><p className="text-gray-400 text-xs font-mono mt-1">Full Record Inspection</p></div>
              <button onClick={() => setSelectedRow(null)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-gray-700">
              {allColumns.map(col => (
                <div key={col} className="group">
                  <div className="flex justify-between items-baseline mb-1">
                    <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">{col}</label>
                    <button onClick={() => navigator.clipboard.writeText(selectedRow[col])} className="opacity-0 group-hover:opacity-100 text-[#a02ff1] text-[10px] flex items-center gap-1 hover:underline"><Copy size={10} /> Copy</button>
                  </div>
                  <div className="text-sm text-gray-200 bg-black/20 p-2 rounded border border-white/5 font-mono break-all">
                    {selectedRow[col] !== null ? String(selectedRow[col]) : <span className="text-gray-600 italic">null</span>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  if (!data || data.length === 0) return (
    <div className="h-[60vh] flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl bg-[#1a1b20]/50"><AlertCircle className="text-gray-500 mb-2" size={32} /><p className="text-gray-400">No data available to display</p></div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] w-full bg-[#0f0f11] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 relative">
      
      {/* 1. TOP TOOLBAR */}
      <div className="flex flex-col border-b border-white/10 bg-[#1a1b20]">
        
        {/* Main Controls */}
        <div className="flex justify-between items-center p-3">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-[#a02ff1]/10 rounded-lg"><TableIcon className="text-[#a02ff1]" size={18} /></div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 pr-4 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#a02ff1] w-48 transition-all" />
            </div>

            <div className="h-6 w-px bg-white/10 mx-1" />

            {/* View Mode Toggle */}
            <div className="flex bg-black/40 rounded-lg border border-white/10 p-0.5">
               <button onClick={() => setViewMode('table')} className={`px-3 py-1 flex items-center gap-2 rounded-md text-xs font-bold transition-all ${viewMode === 'table' ? 'bg-[#a02ff1] text-white' : 'text-gray-400 hover:text-white'}`}><TableIcon size={14} /> List</button>
               <button onClick={() => setViewMode('pivot')} className={`px-3 py-1 flex items-center gap-2 rounded-md text-xs font-bold transition-all ${viewMode === 'pivot' ? 'bg-[#a02ff1] text-white' : 'text-gray-400 hover:text-white'}`}><PieChart size={14} /> Group</button>
            </div>

            {/* Group By Select (Pivot Mode) */}
            {viewMode === 'pivot' && (
               <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-4">
                 <span className="text-xs text-gray-500">by</span>
                 <select value={groupByCol || ''} onChange={(e) => setGroupByCol(e.target.value)} className="bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white focus:border-[#a02ff1] outline-none">
                   <option value="" disabled>Select Column...</option>
                   {allColumns.map(col => <option key={col} value={col}>{col}</option>)}
                 </select>
               </div>
            )}
          </div>

          <div className="flex items-center gap-2">
             {/* Saved Views */}
             <div className="relative">
                <button onClick={() => setShowViewsMenu(!showViewsMenu)} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-white hover:bg-white/10"><Bookmark size={14} /> Views</button>
                {showViewsMenu && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-[#25262b] border border-white/10 rounded-xl shadow-2xl z-50 p-3">
                     <h4 className="text-[10px] uppercase text-gray-500 font-bold mb-2">Saved Views</h4>
                     <div className="space-y-1 mb-3 max-h-40 overflow-y-auto">
                        {savedViews.length === 0 ? <p className="text-xs text-gray-500 italic p-1">No saved views</p> : savedViews.map(view => (
                          <div key={view.id} className="flex items-center justify-between p-2 hover:bg-white/5 rounded group">
                             <button onClick={() => loadView(view)} className="text-xs text-white hover:text-[#a02ff1]">{view.name}</button>
                             <button onClick={() => deleteView(view.id)} className="text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={12} /></button>
                          </div>
                        ))}
                     </div>
                     <div className="pt-2 border-t border-white/10 flex gap-2">
                        <input type="text" placeholder="New view name..." value={newViewName} onChange={(e) => setNewViewName(e.target.value)} className="flex-1 bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white" />
                        <button onClick={handleSaveView} disabled={!newViewName} className="p-1.5 bg-[#a02ff1] rounded text-white disabled:opacity-50"><Save size={14} /></button>
                     </div>
                  </div>
                )}
             </div>
             
             {viewMode === 'table' && (
               <>
                 {/* COLUMN SELECTION BUTTON (Restored) */}
                 <div className="relative group">
                    <button 
                      onClick={() => setShowColumnMenu(!showColumnMenu)} 
                      className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-xs font-bold transition-all ${showColumnMenu ? 'bg-[#a02ff1] text-white border-[#a02ff1]' : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'}`}
                    >
                      <EyeOff size={14} /> Cols
                    </button>
                    {showColumnMenu && (
                      <div className="absolute top-full right-0 mt-2 w-56 max-h-80 overflow-y-auto bg-[#25262b] border border-white/10 rounded-xl shadow-2xl z-50 p-2 grid grid-cols-1 gap-1">
                         {allColumns.map(col => (
                           <button key={col} onClick={() => toggleColumn(col)} className="flex items-center justify-between px-3 py-2 text-xs text-left text-gray-300 hover:bg-white/5 rounded-lg">
                             <span className="truncate w-40">{col}</span>{!hiddenColumns.includes(col) && <Check size={12} className="text-[#a02ff1]" />}
                           </button>
                         ))}
                      </div>
                    )}
                 </div>

                 <button onClick={() => setShowDataBars(!showDataBars)} className={`p-1.5 rounded-lg border transition-all ${showDataBars ? 'bg-[#a02ff1]/10 border-[#a02ff1] text-[#a02ff1]' : 'border-white/10 text-gray-400 hover:text-white'}`}><BarChart3 size={14} /></button>
                 <button onClick={() => setShowFilterRow(!showFilterRow)} className={`p-1.5 rounded-lg border transition-all ${showFilterRow ? 'bg-[#a02ff1] text-white border-[#a02ff1]' : 'border-white/10 text-gray-400 hover:text-white'}`}><Filter size={14} /></button>
                 
                 {/* EXPORT BUTTON (Restored) */}
                 <button 
                   onClick={downloadCSV}
                   className="flex items-center gap-2 px-3 py-1.5 bg-[#a02ff1] hover:bg-[#8e25d9] text-white border border-[#a02ff1] rounded-lg text-xs font-bold transition-all shadow-lg shadow-purple-500/20"
                 >
                   <FileSpreadsheet size={14} /> 
                   {selectedIndices.size > 0 ? 'Export Sel.' : 'Export'}
                 </button>
               </>
             )}
          </div>
        </div>
        
        {/* 2. SMART STATS & ACTIVE FILTERS (New Logic: Shows filter tags) */}
        {quickStats && (
          <div className="flex items-center justify-between px-4 py-2 bg-[#15161a] border-t border-white/5 text-xs">
             <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                   <div className="p-1 rounded bg-green-500/10 text-green-500"><DollarSign size={12} /></div>
                   <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 uppercase font-bold">Total Cost</span>
                      <span className="text-white font-mono font-bold">${quickStats.totalCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                   </div>
                </div>
                <div className="h-6 w-px bg-white/5" />
                <div className="flex items-center gap-2">
                   <div className="p-1 rounded bg-blue-500/10 text-blue-500"><TrendingUp size={12} /></div>
                   <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 uppercase font-bold">Avg. Cost</span>
                      <span className="text-white font-mono font-bold">${quickStats.avgCost.toFixed(4)}</span>
                   </div>
                </div>
                <div className="h-6 w-px bg-white/5" />
                <div className="flex items-center gap-2">
                   <div className="p-1 rounded bg-purple-500/10 text-purple-500"><Activity size={12} /></div>
                   <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 uppercase font-bold">Records</span>
                      <span className="text-white font-mono font-bold">{sortedData.length.toLocaleString()}</span>
                   </div>
                </div>
             </div>

             <div className="flex items-center gap-2">
                {Object.keys(filters).length > 0 && (
                  <>
                    <span className="text-[10px] text-gray-500 uppercase font-bold mr-1">Active Filters:</span>
                    {Object.entries(filters).map(([key, val]) => (
                       <button 
                         key={key} 
                         onClick={() => removeFilter(key)}
                         className="flex items-center gap-1 px-2 py-0.5 bg-[#a02ff1]/20 border border-[#a02ff1]/30 text-[#a02ff1] rounded text-[10px] hover:bg-[#a02ff1]/30 transition-colors"
                       >
                         <span className="font-bold">{key}:</span> {val === '__EMPTY__' ? '(Empty)' : val} <X size={10} />
                       </button>
                    ))}
                    <button onClick={() => setFilters({})} className="text-[10px] text-gray-500 hover:text-white underline ml-2">Clear All</button>
                  </>
                )}
             </div>
          </div>
        )}
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="flex-1 w-full overflow-auto bg-[#1a1b20] relative scrollbar-thin scrollbar-thumb-gray-700">
        
        {/* VIEW A: STANDARD TABLE */}
        {viewMode === 'table' && (
          <table className="min-w-full border-collapse text-xs text-left">
            <thead className="bg-[#25262b] text-gray-400 font-bold sticky top-0 z-20 shadow-lg">
              <tr>
                <th className="px-4 py-3 sticky left-0 z-40 bg-[#25262b] border-b border-r border-white/10 w-[50px] text-center">
                   <button onClick={() => selectedIndices.size === tableDataToRender.length ? setSelectedIndices(new Set()) : setSelectedIndices(new Set(tableDataToRender.map((_, i) => (currentPage-1)*rowsPerPage + i)))} className="text-gray-400 hover:text-white"><CheckSquare size={14} /></button>
                </th>
                {visibleColumns.map((col, idx) => (
                  <th key={col} className={`px-4 py-3 border-b border-r border-white/10 whitespace-nowrap bg-[#25262b] hover:bg-white/5 cursor-pointer group select-none ${idx === 0 ? 'sticky left-[50px] z-30 shadow-[4px_0_10px_rgba(0,0,0,0.5)] border-r-[#a02ff1]/50' : ''}`} style={{ width: getColumnWidth(idx + 1), minWidth: getColumnWidth(idx + 1) }} onClick={() => setSortConfig({ key: col, direction: sortConfig.key === col && sortConfig.direction === 'asc' ? 'desc' : 'asc' })}>
                    <div className="flex items-center justify-between gap-2"><span>{col}</span><div className="opacity-0 group-hover:opacity-100">{sortConfig.key === col ? (sortConfig.direction === 'asc' ? <ChevronUp size={12} className="text-[#a02ff1]" /> : <ChevronDown size={12} className="text-[#a02ff1]" />) : <div className="h-3 w-3" />}</div></div>
                  </th>
                ))}
              </tr>
              {showFilterRow && <tr className="bg-[#1e1f24]"><th className="sticky left-0 z-40 bg-[#1e1f24] border-b border-r border-white/10"></th>{visibleColumns.map((col, idx) => (<th key={`filter-${col}`} className={`p-1 border-b border-r border-white/10 bg-[#1e1f24] ${idx === 0 ? 'sticky left-[50px] z-30' : ''}`}><input type="text" placeholder="Filter..." value={filters[col] || ''} onChange={(e) => setFilters(prev => ({...prev, [col]: e.target.value}))} className="w-full px-2 py-1 bg-black/30 border border-white/5 rounded text-[10px] text-white focus:outline-none focus:border-[#a02ff1]" /></th>))}</tr>}
            </thead>
            <tbody>
              {tableDataToRender.map((row, rIdx) => {
                const globalIndex = (currentPage - 1) * rowsPerPage + rIdx;
                const isSelected = selectedIndices.has(globalIndex);
                return (
                  <tr key={globalIndex} className={`border-b border-white/5 transition-colors ${isSelected ? 'bg-[#a02ff1]/20' : (rIdx % 2 === 0 ? 'bg-[#1a1b20]' : 'bg-[#0f0f11] hover:bg-white/5')}`}>
                    <td className="sticky left-0 z-20 bg-inherit border-r border-white/10 text-center px-2"><input type="checkbox" checked={isSelected} onChange={() => {const s = new Set(selectedIndices); if(s.has(globalIndex)) s.delete(globalIndex); else s.add(globalIndex); setSelectedIndices(s);}} className="rounded border-gray-600 bg-black/40 accent-[#a02ff1]" /></td>
                    {visibleColumns.map((col, cIdx) => {
                      const isCost = col.toLowerCase().includes('cost') || col.toLowerCase().includes('price');
                      const val = row[col];
                      const numVal = parseFloat(val);
                      const maxVal = columnMaxValues[col] || 1;
                      const barWidth = isCost && !isNaN(numVal) && showDataBars ? Math.min(100, Math.abs((numVal / maxVal) * 100)) : 0;
                      return (
                        <td key={`${globalIndex}-${cIdx}`} onClick={() => setSelectedRow(row)} className={`px-4 ${getRowHeight()} border-r border-white/5 whitespace-nowrap cursor-pointer relative overflow-hidden ${cIdx === 0 ? 'sticky left-[50px] z-10 shadow-[4px_0_10px_rgba(0,0,0,0.5)] border-r-[#a02ff1]/50 bg-inherit' : ''} ${isCost ? 'text-right font-mono' : 'text-gray-300'}`}>
                           {barWidth > 0 && <div className="absolute inset-y-0 right-0 bg-[#a02ff1]/20 pointer-events-none" style={{ width: `${barWidth}%` }} />}
                           <span className="relative z-10">{val !== null ? (isCost && !isNaN(numVal) ? numVal.toFixed(4) : String(val)) : '-'}</span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
            {/* FIXED SUMMARY FOOTER */}
            <tfoot className="sticky bottom-0 z-30 bg-[#25262b] shadow-[0_-4px_10px_rgba(0,0,0,0.5)] border-t-2 border-[#a02ff1]/30">
              <tr>
                <td className="sticky left-0 z-40 bg-[#25262b] border-r border-white/10"></td>
                {visibleColumns.map((col, idx) => {
                   const total = summaryData[col];
                   const isNumeric = total !== null;
                   return (
                      <td key={col} className={`px-4 py-3 font-bold text-xs whitespace-nowrap border-r border-white/10 bg-[#25262b] ${idx === 0 ? 'sticky left-[50px] z-40 border-r-[#a02ff1]/50 text-[#a02ff1]' : 'text-white'} ${isNumeric ? 'text-right text-[#a02ff1] font-mono' : ''}`}>
                         {idx === 0 ? 'TOTALS' : (isNumeric ? total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '')}
                      </td>
                   );
                })}
              </tr>
            </tfoot>
          </table>
        )}

        {/* VIEW B: PIVOT / GROUP BY */}
        {viewMode === 'pivot' && (
           <div className="w-full">
             {!groupByCol ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                   <Layers size={48} className="mb-4 opacity-50" />
                   <p>Select a column from the toolbar to group your data.</p>
                </div>
             ) : (
                <table className="min-w-full border-collapse text-xs text-left">
                  <thead className="bg-[#25262b] text-gray-400 font-bold sticky top-0 z-20 shadow-lg">
                     <tr>
                        <th className="px-4 py-3 border-b border-white/10 text-[#a02ff1]">{groupByCol} (Group)</th>
                        <th className="px-4 py-3 border-b border-white/10 text-right">Count</th>
                        <th className="px-4 py-3 border-b border-white/10 text-right">Total Cost</th>
                        <th className="px-4 py-3 border-b border-white/10 w-48">Distribution</th>
                     </tr>
                  </thead>
                  <tbody>
                     {groupedData.map((group, idx) => (
                        <tr key={idx} onClick={() => handleDrillDown(group)} className="border-b border-white/5 hover:bg-[#a02ff1]/10 cursor-pointer transition-colors bg-[#1a1b20]">
                           <td className="px-4 py-3 font-medium text-white">{group.name}</td>
                           <td className="px-4 py-3 text-right text-gray-300">{group.count.toLocaleString()}</td>
                           <td className="px-4 py-3 text-right font-mono text-[#a02ff1]">${group.totalCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                           <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                 <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#a02ff1]" style={{ width: `${group.percent}%` }} />
                                 </div>
                                 <span className="text-[10px] text-gray-500 w-8 text-right">{group.percent.toFixed(1)}%</span>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
                </table>
             )}
           </div>
        )}
      </div>

      <DetailPanel />

      {/* FOOTER CONTROLS */}
      {viewMode === 'table' && (
        <div className="bg-[#0f0f11] px-4 py-2 border-t border-white/10 flex justify-between items-center text-xs text-gray-400 shrink-0">
          <div className="flex items-center gap-4"><span>Page {currentPage} of {totalPages}</span><select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))} className="bg-black/40 border border-white/10 rounded px-2 py-1 focus:outline-none focus:border-[#a02ff1]"><option value={50}>50 rows</option><option value={100}>100 rows</option><option value={500}>500 rows</option><option value={1000}>1000 rows</option></select></div>
          <div className="flex gap-2"><button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30"><ChevronLeft size={16} /></button><button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30"><ChevronRight size={16} /></button></div>
        </div>
      )}
    </div>
  );
};

export default DataExplorer;