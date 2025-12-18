// src/pages/DashboardPage.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import VerticalSidebar from '../components/Dashboard/VerticalSidebar';
import Header from '../components/Dashboard/Header';
import FilterBar from '../components/Dashboard/FilterBar';
import KpiGrid from '../components/Dashboard/KpiGrid';
import CostTrendChart from '../components/Dashboard/CostTrendChart';
import ServiceSpendChart from '../components/Dashboard/ServiceSpendChart';
import CostTable from '../components/Dashboard/CostTable';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for Filters & Dynamic Grouping
  const [filters, setFilters] = useState({ provider: 'All', service: 'All', region: 'All' });
  const [groupBy, setGroupBy] = useState('ServiceName'); // Default group by Service

  useEffect(() => {
    const storedRaw = localStorage.getItem('rawRecords');
    if (storedRaw) {
      try {
        setRawData(JSON.parse(storedRaw));
        setLoading(false);
      } catch (e) {
        navigate('/upload');
      }
    } else {
      navigate('/upload');
    }
  }, [navigate]);

  const processedData = useMemo(() => {
    if (!rawData.length) return null;

    // 1. FILTERING
    let filtered = rawData.filter(item => {
      const itemProvider = item.ProviderName || 'Unknown';
      const itemService = item.ServiceName || 'Unknown';
      const itemRegion = item.RegionName || 'Unknown';

      const matchProvider = filters.provider === 'All' || itemProvider === filters.provider;
      const matchService = filters.service === 'All' || itemService === filters.service;
      const matchRegion = filters.region === 'All' || itemRegion === filters.region;

      return matchProvider && matchService && matchRegion;
    });

    const totalSpend = filtered.reduce((acc, curr) => acc + (parseFloat(curr.BilledCost) || 0), 0);
    
    // 2. DAILY TREND
    const dailyMap = {};
    filtered.forEach(item => {
      const date = item.ChargePeriodStart ? item.ChargePeriodStart.split(' ')[0] : 'Unknown';
      dailyMap[date] = (dailyMap[date] || 0) + (parseFloat(item.BilledCost) || 0);
    });
    const dailyData = Object.keys(dailyMap).sort().map(date => ({ date, cost: dailyMap[date] }));

    // 3. DYNAMIC GROUPING (The key to "Working on all columns")
    const groupMap = {};
    filtered.forEach(item => {
      // Use the 'groupBy' state key (e.g., 'CommitmentDiscountStatus')
      const key = item[groupBy] || 'Unknown'; 
      groupMap[key] = (groupMap[key] || 0) + (parseFloat(item.BilledCost) || 0);
    });
    
    const groupedData = Object.entries(groupMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Top 8 items

    // Top Region (Static KPI)
    const regionMap = {};
    filtered.forEach(item => {
      const r = item.RegionName || 'Global';
      regionMap[r] = (regionMap[r] || 0) + (parseFloat(item.BilledCost) || 0);
    });
    const topRegion = Object.entries(regionMap).sort((a,b) => b[1] - a[1])[0];

    return { 
      totalSpend, 
      dailyData, 
      groupedData, // Dynamic Chart Data
      topRegion: { name: topRegion?.[0], value: topRegion?.[1] },
      topService: groupedData[0], // Top item of current group
      filteredRecords: filtered 
    };
  }, [rawData, filters, groupBy]);

  if (loading) return <div className="min-h-screen bg-[#0f0f11] flex items-center justify-center"><Loader2 className="animate-spin text-[#a02ff1]" /></div>;
  if (!processedData) return null;

  // Define the columns you want to see in the table (including Discount cols)
  const tableColumns = [
    'ChargePeriodStart', 
    'ProviderName', 
    'ServiceName', 
    'RegionName', 
    'CommitmentDiscountStatus', // Column 16
    'CommitmentDiscountType',   // Column 17
    'ResourceId',
    'BilledCost'
  ];

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white font-sans">
      <VerticalSidebar />
      <Header title="Cost Overview" />

      <main className="ml-[240px] pt-[64px] min-h-screen relative">
        <div className="p-6 space-y-4 max-w-[1920px] mx-auto">
          <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none -z-10 ml-[240px] mt-[64px]" />

          {/* Pass groupBy control to FilterBar */}
          <FilterBar 
            data={rawData} 
            filters={filters} 
            onChange={setFilters}
            groupBy={groupBy}
            onGroupChange={setGroupBy} 
          />
          
          <KpiGrid 
            spend={processedData.totalSpend}
            topRegion={processedData.topRegion}
            topService={processedData.topService}
          />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 h-auto xl:h-[340px]">
            <CostTrendChart data={processedData.dailyData} />
            {/* Chart now accepts a title prop to show what we are grouping by */}
            <ServiceSpendChart 
              data={processedData.groupedData} 
              title={`Spend by ${groupBy.replace(/([A-Z])/g, ' $1').trim()}`} 
            />
          </div>

          {/* Pass the specific columns we want to display */}
          <CostTable 
            data={processedData.filteredRecords} 
            columns={tableColumns} 
          />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;