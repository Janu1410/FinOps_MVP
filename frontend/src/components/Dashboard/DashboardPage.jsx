import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/Authstore'; // ✅ Added Auth Store

// Layout Components
import VerticalSidebar from './VerticalSidebar';
import Header from './Header';

// Sub-Page Components
import Overview from './Overview';
import DataExplorer from './DataExplorer';
import CostAnalysis from './CostAnalysis';
import CostDrivers from './CostDrivers';
import ResourceInventory from './ResourceInventory'; // ✅ Preserved
import DataQuality from './DataQuality'; // ✅ Preserved
import Optimization from './Optimization';
import Reports from './Reports';
import AccountsOwnership from './AccountsOwnership';

const DashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchUser } = useAuthStore(); // ✅ Added Auth Hook
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ✅ Lifted filter state up so anomaly calculation can use it
  const [filters, setFilters] = useState({ provider: 'All', service: 'All', region: 'All' });

  // --- 0. FETCH USER DATA ON MOUNT ---
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // --- 1. DATA LOADING ---
  useEffect(() => {
    const storedRaw = localStorage.getItem('rawRecords');
    if (storedRaw) {
      try {
        const parsed = JSON.parse(storedRaw);
        let cleanData = [];
        if (Array.isArray(parsed)) {
          cleanData = parsed;
        } else if (parsed && typeof parsed === 'object') {
          if (parsed.data && Array.isArray(parsed.data)) cleanData = parsed.data;
          else if (parsed.records && Array.isArray(parsed.records)) cleanData = parsed.records;
          else cleanData = Object.values(parsed);
        }

        if (cleanData.length > 0) {
          setRawData(cleanData);
          // Reset filters when new data is loaded
          setFilters({ provider: 'All', service: 'All', region: 'All' });
          setLoading(false);
        } else {
          console.warn("Data found but empty");
          navigate('/upload');
        }
      } catch (e) {
        console.error("Failed to parse data:", e);
        navigate('/upload');
      }
    } else {
      navigate('/upload');
    }
  }, [navigate]);

  // --- 2. GLOBAL ANOMALY CHECK (Smarter Logic) ---
  // Calculate anomalies based on FILTERED data
  const anomalyInfo = useMemo(() => {
    if (!rawData.length) return { list: [], count: 0 };
    
    // Apply the same filters that Overview uses
    let filteredData = rawData.filter(item => {
      const itemProvider = item.ProviderName || 'Unknown';
      const itemService = item.ServiceName || 'Unknown';
      const itemRegion = item.RegionName || 'Unknown';

      const matchProvider = filters.provider === 'All' || itemProvider === filters.provider;
      const matchService = filters.service === 'All' || itemService === filters.service;
      const matchRegion = filters.region === 'All' || itemRegion === filters.region;

      return matchProvider && matchService && matchRegion;
    });

    // If no data after filtering, return empty
    if (!filteredData.length) return { list: [], count: 0 };
    
    // Quick anomaly detection logic on filtered data
    const costs = filteredData.map(item => parseFloat(item.BilledCost) || 0).filter(cost => cost > 0);
    
    // Handle edge cases
    if (costs.length === 0) return { list: [], count: 0 };
    if (costs.length === 1) {
      const singleCost = costs[0];
      if (singleCost > 1000) {
        return { 
          list: filteredData.map((item, index) => ({ ...item, cost: singleCost, index })), 
          count: 1 
        };
      }
      return { list: [], count: 0 };
    }
    
    const avg = costs.reduce((a, b) => a + b, 0) / costs.length;
    
    // Calculate variance
    const variance = costs.reduce((sum, cost) => sum + Math.pow(cost - avg, 2), 0) / costs.length;
    
    if (variance < 0.01) return { list: [], count: 0 };
    
    const stdDev = Math.sqrt(variance);
    const threshold = avg + (2 * stdDev);

    const anomalies = filteredData
      .map((item, index) => ({ ...item, cost: parseFloat(item.BilledCost) || 0, index }))
      .filter(item => item.cost > threshold)
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 10);

    return { list: anomalies, count: anomalies.length };
  }, [rawData, filters]);

  if (loading) return (
    <div className="min-h-screen bg-[#0f0f11] flex items-center justify-center">
      <Loader2 className="animate-spin text-[#a02ff1]" />
    </div>
  );

  // --- ROUTING LOGIC ---
  const isDataExplorer = location.pathname.includes('/data-explorer');
  const isCostAnalysis = location.pathname.includes('/cost-analysis'); 
  const isCostDrivers = location.pathname.includes('/cost-drivers'); 
  const isResources = location.pathname.includes('/resources'); // ✅ Preserved
  const isDataQuality = location.pathname.includes('/data-quality'); // ✅ Preserved
  const isOptimization = location.pathname.includes('/optimization');
  const isReports = location.pathname.includes('/reports');
const isAccounts = location.pathname.includes('/accounts');

  const getPageTitle = () => {
    if (isDataExplorer) return "Data Explorer";
    if (isCostAnalysis) return "Cost Analysis";
    if (isCostDrivers) return "Cost Drivers"; 
    if (isResources) return "Resource Inventory"; 
    if (isDataQuality) return "Data Quality Hub";
    if (isOptimization) return "Optimization";
    if (isReports) return "Reports";
    return "Overview";
  };

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white font-sans">
      <VerticalSidebar />
      <Header 
        title={getPageTitle()} 
        anomalies={anomalyInfo.list} 
        anomaliesCount={anomalyInfo.count} 
      />

      {/* ✅ Updated to responsive margin logic */}
      <main className="ml-[72px] lg:ml-[240px] pt-[64px] min-h-screen relative transition-all duration-300">
        <div className="p-4 lg:p-6 space-y-4 max-w-[1920px] mx-auto h-full">
          
          {/* Background Grid */}
          <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none -z-10 ml-[72px] lg:ml-[240px] mt-[64px] transition-all duration-300" />

          {/* 1. DATA EXPLORER VIEW */}
          {isDataExplorer && (
             <div className="h-full w-full animate-in fade-in zoom-in-95 duration-300">
               <DataExplorer data={rawData} />
             </div>
          )}

          {/* 2. COST ANALYSIS VIEW */}
          {isCostAnalysis && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
               <CostAnalysis data={rawData} />
            </div>
          )}

          {/* 3. COST DRIVERS VIEW */}
          {isCostDrivers && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
               <CostDrivers data={rawData} />
            </div>
          )}

          {/* 4. RESOURCE INVENTORY VIEW (Preserved) */}
          {isResources && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <ResourceInventory data={rawData} />
            </div>
          )}

          {/* 5. DATA QUALITY VIEW (Preserved) */}
          {isDataQuality && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <DataQuality data={rawData} />
            </div>
          )}

          {/* 6. OPTIMIZATION VIEW */}
          {isOptimization && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <Optimization data={rawData} />
            </div>
          )}

          {/* 7. REPORTS VIEW */}
          {isReports && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <Reports data={rawData} />
            </div>
          )}

          {/* 8. OVERVIEW VIEW (Default) */}
          {isAccounts && (
   <div className="animate-in fade-in zoom-in-95 duration-300">
      <AccountsOwnership data={rawData} />
   </div>
)}

          {/* 6. OVERVIEW VIEW (Default) */}
          {!isDataExplorer && 
           !isCostAnalysis && 
           !isCostDrivers && 
           !isResources && 
           !isDataQuality && 
           !isOptimization && 
           !isReports && (
           !isAccounts && (
             <Overview 
                data={rawData} 
                filters={filters} 
                onFiltersChange={setFilters} 
             />
          )}

        </div>
      </main>
    </div>
  );
};
export default DashboardPage;