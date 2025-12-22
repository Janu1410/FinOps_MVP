import React, { useMemo, useState } from 'react';
import { 
  Users, Building, Wallet, Search, Download, 
  UserPlus, PieChart, X, BarChart3, TrendingUp,
  AlertTriangle, CheckCircle, ArrowRight, Filter,
  Briefcase, Globe, Target, Calculator
} from 'lucide-react';
import { 
  Treemap, ResponsiveContainer, Tooltip as RechartsTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// --- UTILS ---
const formatCurrency = (val) => 
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(val);

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
};

// --- DESIGN SYSTEM ---
const THEME = {
  colors: ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#3b82f6', '#f59e0b'],
  barGradient: ['#3b82f6', '#8b5cf6'], // Blue to Purple for Side Panel
};

// --- COMPONENT: TREEMAP CONTENT (Main View) ---
const CustomTreemapContent = (props) => {
  const { root, depth, x, y, width, height, index, name, value } = props;
  const color = THEME.colors[index % THEME.colors.length];

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: depth < 2 ? 'transparent' : color,
          stroke: '#0f0f11',
          strokeWidth: 3,
          fillOpacity: 0.85,
          rx: 4, ry: 4
        }}
      />
      {width > 70 && height > 50 && (
        <>
          <text x={x + width / 2} y={y + height / 2 - 6} textAnchor="middle" fill="#fff" fontSize={12} fontWeight="bold" style={{ pointerEvents: 'none', textShadow: '0px 1px 3px rgba(0,0,0,0.8)' }}>
            {name.substring(0, 12)}{name.length > 12 ? '...' : ''}
          </text>
          <text x={x + width / 2} y={y + height / 2 + 12} textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize={10} fontWeight="500" style={{ pointerEvents: 'none', textShadow: '0px 1px 2px rgba(0,0,0,0.8)' }}>
            {formatCurrency(value)}
          </text>
        </>
      )}
    </g>
  );
};

const AccountsOwnership = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  
  // Filters
  const [filterOwner, setFilterOwner] = useState('All'); 
  const [filterProvider, setFilterProvider] = useState('All'); 

  // --- 1. DATA PROCESSING ---
  const { accountGroups, kpis, treemapData, flatList, providers } = useMemo(() => {
    if (!data || data.length === 0) return { accountGroups: [], kpis: {}, treemapData: [], flatList: [], providers: [] };

    const hierarchy = {};
    const flatListArray = [];
    const providerSet = new Set();
    let totalSpend = 0;
    
    // Metadata Maps
    const accountServices = {};
    const accountDaily = {};
    const ghostAssets = {}; // Track $0 resources

    data.forEach(row => {
      const payerId = row.PayerAccountId || row.BillingAccountId || 'Unassigned Root';
      const linkedId = row.LinkedAccountId || row.SubscriptionId || row.SubAccountName || 'Unknown';
      const linkedName = row.SubAccountName || row.SubscriptionName || linkedId;
      const provider = row.ProviderName || 'Unknown';
      
      let rawCost = row.BilledCost;
      if (typeof rawCost === 'string') rawCost = rawCost.replace(/[$,]/g, '');
      const cost = parseFloat(rawCost) || 0;
      const date = row.ChargePeriodStart?.split(' ')[0];

      totalSpend += cost;
      providerSet.add(provider);

      if (!hierarchy[payerId]) hierarchy[payerId] = { id: payerId, totalCost: 0, provider, children: {} };
      if (!hierarchy[payerId].children[linkedId]) {
        hierarchy[payerId].children[linkedId] = {
          id: linkedId,
          name: linkedName,
          cost: 0,
          provider,
          owner: Math.random() > 0.5 ? 'finance@company.com' : null, 
          parentId: payerId
        };
      }

      hierarchy[payerId].totalCost += cost;
      hierarchy[payerId].children[linkedId].cost += cost;

      if (!accountServices[linkedId]) accountServices[linkedId] = {};
      const svc = row.ServiceName || 'Other';
      accountServices[linkedId][svc] = (accountServices[linkedId][svc] || 0) + cost;

      if (!accountDaily[linkedId]) accountDaily[linkedId] = {};
      if (date) accountDaily[linkedId][date] = (accountDaily[linkedId][date] || 0) + cost;

      // Ghost Asset Check
      if (cost === 0 && row.ResourceId) {
          ghostAssets[linkedId] = (ghostAssets[linkedId] || 0) + 1;
      }
    });

    const groups = Object.values(hierarchy).map((payer, idx) => ({
      ...payer,
      color: THEME.colors[idx % THEME.colors.length],
      linkedAccounts: Object.values(payer.children).map(child => {
        const days = Object.keys(accountDaily[child.id] || {}).sort();
        const start = accountDaily[child.id][days[0]] || 0;
        const end = accountDaily[child.id][days[days.length-1]] || 0;
        const isSpiking = end > start * 1.2 && start > 1;

        // Forecast Calculation (Simple Projection)
        const avgDaily = child.cost / (days.length || 1);
        const projected = avgDaily * 30; // Assuming 30 day month
        const budget = projected * 0.9; // Simulate a budget slightly lower than projection

        const fullObj = {
            ...child,
            topServices: Object.entries(accountServices[child.id]).sort((a,b) => b[1] - a[1]).slice(0, 5).map(([k,v]) => ({ name: k, value: v })),
            dailyTrend: days.map(d => ({ date: d, value: accountDaily[child.id][d] })),
            isSpiking,
            ghostCount: ghostAssets[child.id] || 0,
            projected,
            budget
        };
        flatListArray.push(fullObj);
        return fullObj;
      }).sort((a, b) => b.cost - a.cost)
    })).sort((a, b) => b.totalCost - a.totalCost);

    const treeData = groups.map(payer => ({
      name: payer.id,
      children: payer.linkedAccounts.slice(0, 15).map(acc => ({ name: acc.name, size: acc.cost }))
    }));

    return { 
      accountGroups: groups, 
      kpis: { totalSpend, payerCount: groups.length, linkedCount: flatListArray.length },
      treemapData: treeData,
      flatList: flatListArray,
      providers: Array.from(providerSet)
    };
  }, [data]);

  // --- 2. FILTERING ---
  const filteredGroups = useMemo(() => {
    return accountGroups.map(payer => {
      const validChildren = payer.linkedAccounts.filter(acc => {
        const matchesSearch = acc.name.toLowerCase().includes(searchTerm.toLowerCase()) || acc.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesOwner = filterOwner === 'All' ? true : filterOwner === 'Assigned' ? acc.owner : !acc.owner;
        const matchesProvider = filterProvider === 'All' || acc.provider === filterProvider;
        return matchesSearch && matchesOwner && matchesProvider;
      });
      if (validChildren.length > 0) return { ...payer, linkedAccounts: validChildren };
      return null;
    }).filter(Boolean);
  }, [accountGroups, searchTerm, filterOwner, filterProvider]);

  const getShare = (part, total) => ((part / total) * 100).toFixed(1);

  if (!data || data.length === 0) return <div className="p-10 text-gray-500 text-center">Loading Accounts...</div>;

  return (
    <div className="p-6 space-y-6 min-h-screen bg-[#0f0f11] text-white font-sans animate-in fade-in duration-500 relative">
      
      {/* 1. HEADER */}
      <div className="flex flex-col xl:flex-row justify-between gap-6">
         <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
               <Users className="text-[#a02ff1]" /> Accounts & Ownership
            </h1>
            <p className="text-gray-400 text-sm mt-1">Manage billing hierarchy, assign owners, and track spend.</p>
         </div>
         <div className="flex gap-4 overflow-x-auto pb-2">
            <div className="bg-[#1a1b20] border border-white/10 px-5 py-3 rounded-xl min-w-[150px] flex flex-col justify-center">
               <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Total Spend</p>
               <p className="text-2xl font-bold text-white mt-1">{formatCurrency(kpis.totalSpend)}</p>
            </div>
            <div className="bg-[#1a1b20] border border-white/10 px-5 py-3 rounded-xl min-w-[150px] flex flex-col justify-center">
               <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Unassigned</p>
               <p className="text-2xl font-bold text-orange-400 mt-1">{flatList.filter(a => !a.owner).length} <span className="text-xs text-gray-500 font-normal">accounts</span></p>
            </div>
            <div className="bg-[#1a1b20] border border-white/10 px-5 py-3 rounded-xl min-w-[150px] flex flex-col justify-center">
               <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Spiking</p>
               <p className="text-2xl font-bold text-red-400 mt-1 flex items-center gap-2">{flatList.filter(a => a.isSpiking).length} <TrendingUp size={16}/></p>
            </div>
         </div>
      </div>

      {/* 2. SPEND MAP */}
      <div className="bg-[#1a1b20] border border-white/10 rounded-xl p-6 h-[420px] flex flex-col shadow-lg">
         <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
               <PieChart size={14} className="text-[#a02ff1]" /> Spend Volume Map
            </h3>
            <div className="flex gap-3 text-[10px]">
               {accountGroups.slice(0, 5).map((g, i) => (
                  <div key={g.id} className="flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded-full border border-white/5">
                     <div className="w-2 h-2 rounded-full" style={{backgroundColor: g.color}} />
                     <span className="text-gray-300 font-medium">{g.id.substring(0, 10)}</span>
                  </div>
               ))}
            </div>
         </div>
         <div className="flex-1 min-h-0 bg-[#0f0f11] rounded-lg border border-white/5 overflow-hidden relative">
            <ResponsiveContainer width="100%" height="100%">
               <Treemap
                  data={treemapData}
                  dataKey="size"
                  stroke="#0f0f11"
                  fill="#8884d8"
                  content={<CustomTreemapContent />}
               >
                  <RechartsTooltip contentStyle={{ backgroundColor: '#25262b', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px', borderRadius: '8px' }} formatter={(value) => formatCurrency(value)} />
               </Treemap>
            </ResponsiveContainer>
         </div>
      </div>

      {/* 3. ACCOUNTS TABLE */}
      <div className="bg-[#1a1b20] border border-white/10 rounded-xl flex flex-col shadow-lg">
         <div className="p-4 border-b border-white/10 flex flex-col lg:flex-row justify-between items-center gap-4 bg-[#25262b]">
            <div className="flex-1 w-full lg:w-auto relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
               <input type="text" placeholder="Search accounts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:border-[#a02ff1] focus:ring-1 focus:ring-[#a02ff1] outline-none transition-all placeholder:text-gray-600" />
            </div>
            <div className="flex gap-2 w-full lg:w-auto overflow-x-auto">
               <select value={filterOwner} onChange={(e) => setFilterOwner(e.target.value)} className="pl-3 pr-8 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-white outline-none cursor-pointer min-w-[120px]">
                  <option value="All" className="bg-[#1a1b20]">All Owners</option>
                  <option value="Assigned" className="bg-[#1a1b20]">Assigned</option>
                  <option value="Unassigned" className="bg-[#1a1b20]">Unassigned</option>
               </select>
               <select value={filterProvider} onChange={(e) => setFilterProvider(e.target.value)} className="pl-3 pr-8 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-white outline-none cursor-pointer min-w-[120px]">
                  <option value="All" className="bg-[#1a1b20]">All Providers</option>
                  {providers.map(p => <option key={p} value={p} className="bg-[#1a1b20]">{p}</option>)}
               </select>
               <button className="flex items-center gap-2 px-4 py-2 bg-[#a02ff1]/10 hover:bg-[#a02ff1]/20 border border-[#a02ff1]/30 rounded-lg text-xs font-bold text-[#a02ff1] transition-all whitespace-nowrap"><Download size={14} /> Export</button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead className="bg-[#15161a] text-gray-500 font-bold text-[10px] uppercase tracking-wider sticky top-0 z-10 shadow-sm">
                  <tr>
                     <th className="px-6 py-4 w-[40%]">Account Hierarchy</th>
                     <th className="px-6 py-4">Ownership</th>
                     <th className="px-6 py-4">Health</th>
                     <th className="px-6 py-4 text-right">Billed Cost</th>
                     <th className="px-6 py-4 text-right">Contribution</th>
                  </tr>
               </thead>
               <tbody className="text-sm divide-y divide-white/5">
                  {filteredGroups.map((payer) => (
                     <React.Fragment key={payer.id}>
                        <tr className="bg-[#25262b]/50">
                           <td className="px-6 py-3 font-bold text-white flex items-center gap-3">
                              <div className="p-1.5 rounded-lg bg-black/40 border border-white/5 shadow-sm" style={{ color: payer.color }}><Wallet size={16} /></div>
                              <div className="flex flex-col">
                                 <span className="text-sm">{payer.id}</span>
                                 <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider bg-white/5 px-1.5 py-0.5 rounded w-fit">Management Account</span>
                              </div>
                           </td>
                           <td className="px-6 py-3 text-gray-500 italic text-xs">Finance Dept.</td>
                           <td className="px-6 py-3 text-gray-500 text-xs">{payer.linkedAccounts.length} Linked Accounts</td>
                           <td className="px-6 py-3 text-right font-mono font-bold text-white" style={{ textShadow: `0 0 10px ${payer.color}40` }}>{formatCurrency(payer.totalCost)}</td>
                           <td className="px-6 py-3 text-right text-gray-500 text-xs">100%</td>
                        </tr>
                        {payer.linkedAccounts.map((child) => (
                           <tr key={child.id} onClick={() => setSelectedAccount(child)} className="hover:bg-white/5 transition-colors group cursor-pointer">
                              <td className="px-6 py-3 pl-12 flex items-center gap-4 relative">
                                 <div className="w-px h-full bg-white/10 absolute left-8 top-0" />
                                 <div className="w-3 h-px bg-white/10 absolute left-8 top-1/2" />
                                 <Building size={14} className="text-gray-600 group-hover:text-white transition-colors" />
                                 <div className="flex flex-col">
                                    <span className="text-gray-200 text-xs font-bold group-hover:text-[#a02ff1] transition-colors">{child.name}</span>
                                    <span className="text-[10px] text-gray-500 font-mono">{child.id}</span>
                                 </div>
                              </td>
                              <td className="px-6 py-3">
                                 {child.owner ? (
                                    <div className="flex items-center gap-2">
                                       <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-[9px] font-bold text-blue-400">{child.owner.charAt(0).toUpperCase()}</div>
                                       <span className="text-xs text-gray-400 truncate max-w-[120px]">{child.owner}</span>
                                    </div>
                                 ) : <button className="flex items-center gap-1.5 text-[10px] text-orange-400 bg-orange-500/10 px-2 py-1 rounded-md border border-orange-500/20 hover:bg-orange-500/20 transition-all"><UserPlus size={10} /> Assign Owner</button>}
                              </td>
                              <td className="px-6 py-3">
                                 {child.isSpiking ? <span className="flex items-center gap-1 text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20 w-fit font-bold"><TrendingUp size={10} /> Spiking</span> : <span className="flex items-center gap-1 text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20 w-fit font-bold"><CheckCircle size={10} /> Stable</span>}
                              </td>
                              <td className="px-6 py-3 text-right"><span className="font-mono text-xs font-bold text-white bg-white/5 px-2 py-1 rounded border border-white/5 group-hover:border-white/20 transition-all">{formatCurrency(child.cost)}</span></td>
                              <td className="px-6 py-3 text-right">
                                 <div className="flex items-center justify-end gap-2">
                                    <span className="text-[10px] text-gray-500 font-mono w-8">{getShare(child.cost, kpis.totalSpend)}%</span>
                                    <div className="w-16 h-1.5 bg-black/40 rounded-full overflow-hidden"><div className="h-full" style={{ width: `${getShare(child.cost, kpis.totalSpend)}%`, backgroundColor: payer.color }} /></div>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </React.Fragment>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* 4. ACCOUNT INSPECTOR (SLIDE-OVER) */}
      <AnimatePresence>
         {selectedAccount && (
            <>
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedAccount(null)} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" />
               <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25 }} className="fixed right-0 top-0 bottom-0 w-[500px] bg-[#1a1b20] border-l border-white/10 shadow-2xl z-50 flex flex-col">
                  {/* Header */}
                  <div className="p-6 border-b border-white/10 bg-[#25262b] flex justify-between items-start">
                     <div>
                        <div className="flex items-center gap-2 mb-2">
                           <span className="text-[10px] font-bold uppercase bg-[#a02ff1]/10 text-[#a02ff1] px-2 py-0.5 rounded border border-[#a02ff1]/20">Account Inspector</span>
                           <span className="text-xs text-gray-500">{selectedAccount.provider}</span>
                        </div>
                        <h2 className="text-xl font-bold text-white mt-1">{selectedAccount.name}</h2>
                        <span className="text-xs font-mono text-gray-400 bg-black/30 px-2 py-0.5 rounded mt-1 inline-block border border-white/5">{selectedAccount.id}</span>
                     </div>
                     <button onClick={() => setSelectedAccount(null)} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
                  </div>

                  {/* Body */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                     {/* Forecast Card */}
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                           <p className="text-xs text-gray-500 uppercase font-bold flex items-center gap-1"><Target size={12}/> Month Forecast</p>
                           <p className="text-2xl font-bold text-white mt-1">{formatCurrency(selectedAccount.projected)}</p>
                        </div>
                        <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                           <p className="text-xs text-gray-500 uppercase font-bold flex items-center gap-1"><Calculator size={12}/> Budget Cap</p>
                           <div className="flex items-end justify-between mt-1">
                              <p className="text-lg font-bold text-gray-300">{formatCurrency(selectedAccount.budget)}</p>
                              <span className="text-[10px] text-red-400 bg-red-500/10 px-1 rounded">110%</span>
                           </div>
                           <div className="w-full h-1 bg-gray-700 mt-2 rounded-full overflow-hidden">
                              <div className="h-full bg-red-500" style={{ width: '100%' }}></div>
                           </div>
                        </div>
                     </div>

                     {/* Top Services */}
                     <div>
                        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><BarChart3 size={14} /> Spending Breakdown</h3>
                        <div className="space-y-2">
                           {selectedAccount.topServices.map((svc, i) => (
                              <div key={i} className="flex items-center gap-3 text-xs bg-white/5 p-2 rounded-lg border border-white/5">
                                 <span className="w-6 text-gray-500 font-mono text-center">{i+1}</span>
                                 <span className="flex-1 font-medium text-gray-200">{svc.name}</span>
                                 <div className="w-20 h-1.5 bg-black/40 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500" style={{ width: `${(svc.value / selectedAccount.cost) * 100}%` }} />
                                 </div>
                                 <span className="text-white font-mono font-bold w-16 text-right">{formatCurrency(svc.value)}</span>
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* Daily Cost Bar Chart */}
                     <div className="h-56">
                        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><TrendingUp size={14} /> Daily Cost Trend</h3>
                        <div className="w-full h-full bg-black/20 rounded-xl border border-white/5 p-3">
                           <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={selectedAccount.dailyTrend}>
                                 <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                 <XAxis dataKey="date" tickFormatter={formatDate} stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                                 <YAxis stroke="#666" fontSize={10} tickFormatter={(val) => `$${val}`} tickLine={false} axisLine={false} />
                                 <RechartsTooltip 
                                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                    contentStyle={{ backgroundColor: '#25262b', borderColor: '#333', color: '#fff', fontSize: '12px', borderRadius: '8px' }}
                                    formatter={(value) => [formatCurrency(value), 'Cost']}
                                 />
                                 <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {selectedAccount.dailyTrend.map((entry, index) => (
                                       <Cell key={`cell-${index}`} fill={`url(#barGradient)`} />
                                    ))}
                                 </Bar>
                                 <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                       <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1}/>
                                       <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                    </linearGradient>
                                 </defs>
                              </BarChart>
                           </ResponsiveContainer>
                        </div>
                     </div>

                     {/* Ghost Assets */}
                     <div className="bg-orange-500/10 border border-orange-500/20 p-3 rounded-lg flex items-center gap-3">
                        <AlertTriangle className="text-orange-500" size={18} />
                        <div>
                           <p className="text-xs font-bold text-orange-400">Potential Waste Detected</p>
                           <p className="text-[10px] text-orange-300/70">{selectedAccount.ghostCount} resources exist but have $0 spend (stopped/zombie).</p>
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

export default AccountsOwnership;