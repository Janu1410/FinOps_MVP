import React, { useState, useMemo } from 'react';
import FilterBar from './Views/FilterBar';
import KpiGrid from './Views/KpiGrid';
import CostTrendChart from './Views/CostTrendChart';
import ServiceSpendChart from './Views/ServiceSpendChart';
import RegionPieChart from './Views/RegionPieChart';

const Overview = ({ data }) => {
  // --- STATE (Moved from DashboardPage) ---
  const [filters, setFilters] = useState({ provider: 'All', service: 'All', region: 'All' });
  const [groupBy, setGroupBy] = useState('ServiceName'); 
  const [chartFilters, setChartFilters] = useState({
    trendChart: { limit: 30 }, 
    pieChart: { limit: 8 }, 
    barChart: { limit: 8 }, 
    dataLimit: 1000 
  });

  // --- DATA PROCESSING ---
  const processedData = useMemo(() => {
    if (!data || !data.length) return null;

    // 1. Limit Data Size
    let dataToProcess = [...data];
    if (dataToProcess.length > chartFilters.dataLimit) {
      dataToProcess = dataToProcess
        .sort((a, b) => (parseFloat(b.BilledCost) || 0) - (parseFloat(a.BilledCost) || 0))
        .slice(0, chartFilters.dataLimit);
    }

    // 2. Apply Filters
    let filtered = dataToProcess.filter(item => {
      const itemProvider = item.ProviderName || 'Unknown';
      const itemService = item.ServiceName || 'Unknown';
      const itemRegion = item.RegionName || 'Unknown';

      const matchProvider = filters.provider === 'All' || itemProvider === filters.provider;
      const matchService = filters.service === 'All' || itemService === filters.service;
      const matchRegion = filters.region === 'All' || itemRegion === filters.region;

      return matchProvider && matchService && matchRegion;
    });

    const totalSpend = filtered.reduce((acc, curr) => acc + (parseFloat(curr.BilledCost) || 0), 0);
    
    // 3. Daily Data for Trend Chart
    const dailyMap = {};
    filtered.forEach(item => {
      const date = item.ChargePeriodStart ? item.ChargePeriodStart.split(' ')[0] : 'Unknown';
      dailyMap[date] = (dailyMap[date] || 0) + (parseFloat(item.BilledCost) || 0);
    });
    let dailyData = Object.keys(dailyMap).sort().map(date => ({ date, cost: dailyMap[date] }));
    if (dailyData.length > chartFilters.trendChart.limit) {
      dailyData = dailyData.slice(-chartFilters.trendChart.limit);
    }

    // 4. Grouped Data for Bar Chart
    const groupMap = {};
    filtered.forEach(item => {
      const key = item[groupBy] || 'Unknown'; 
      groupMap[key] = (groupMap[key] || 0) + (parseFloat(item.BilledCost) || 0);
    });
    const groupedData = Object.entries(groupMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, chartFilters.barChart.limit); 

    // 5. Region Data for Pie Chart
    const regionMap = {};
    filtered.forEach(item => {
      const r = item.RegionName || 'Global';
      regionMap[r] = (regionMap[r] || 0) + (parseFloat(item.BilledCost) || 0);
    });
    const topRegion = Object.entries(regionMap).sort((a,b) => b[1] - a[1])[0];
    const regionData = Object.entries(regionMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, chartFilters.pieChart.limit); 

    // 6. KPIs
    // Spend Change
    const sortedByDate = [...filtered].sort((a, b) => {
      const dateA = a.ChargePeriodStart ? new Date(a.ChargePeriodStart.split(' ')[0]) : new Date(0);
      const dateB = b.ChargePeriodStart ? new Date(b.ChargePeriodStart.split(' ')[0]) : new Date(0);
      return dateA - dateB;
    });
    const midPoint = Math.floor(sortedByDate.length / 2);
    const previousPeriodSpend = sortedByDate.slice(0, midPoint).reduce((acc, curr) => acc + (parseFloat(curr.BilledCost) || 0), 0);
    const currentPeriodSpend = sortedByDate.slice(midPoint).reduce((acc, curr) => acc + (parseFloat(curr.BilledCost) || 0), 0);
    const spendChangePercent = previousPeriodSpend > 0 
      ? ((currentPeriodSpend - previousPeriodSpend) / previousPeriodSpend) * 100 
      : 0;

    // Top Provider
    const providerMap = {};
    filtered.forEach(item => {
      const provider = item.ProviderName || 'Unknown';
      providerMap[provider] = (providerMap[provider] || 0) + (parseFloat(item.BilledCost) || 0);
    });
    const topProvider = Object.entries(providerMap).sort((a, b) => b[1] - a[1])[0];

    // Untagged Cost
    const untaggedCost = filtered
      .filter(item => {
        const tags = item.Tags || item.Tag || '';
        return !tags || tags.trim() === '' || tags.toLowerCase() === 'null' || tags.toLowerCase() === 'none';
      })
      .reduce((acc, curr) => acc + (parseFloat(curr.BilledCost) || 0), 0);

    // Missing Metadata Cost
    const missingMetadataCost = filtered
      .filter(item => {
        const hasServiceName = item.ServiceName && item.ServiceName.trim() !== '';
        const hasRegionName = item.RegionName && item.RegionName.trim() !== '';
        const hasResourceName = item.ResourceName && item.ResourceName.trim() !== '';
        return !hasServiceName || !hasRegionName || !hasResourceName;
      })
      .reduce((acc, curr) => acc + (parseFloat(curr.BilledCost) || 0), 0);

    return { 
      totalSpend, dailyData, groupedData, regionData,
      topRegion: { name: topRegion?.[0], value: topRegion?.[1] },
      topService: groupedData[0], 
      filteredRecords: filtered,
      spendChangePercent,
      topProvider: { name: topProvider?.[0] || 'N/A', value: topProvider?.[1] || 0 },
      untaggedCost,
      missingMetadataCost
    };
  }, [data, filters, groupBy, chartFilters]);

  if (!processedData) return null;

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 space-y-4">
      <FilterBar 
        data={data} 
        filters={filters} 
        onChange={setFilters}
        groupBy={groupBy}
        onGroupChange={setGroupBy} 
      />
      
      <KpiGrid 
        spend={processedData.totalSpend}
        topRegion={processedData.topRegion}
        topService={processedData.topService}
        spendChangePercent={processedData.spendChangePercent}
        topProvider={processedData.topProvider}
        untaggedCost={processedData.untaggedCost}
        missingMetadataCost={processedData.missingMetadataCost}
        filteredRecords={processedData.filteredRecords}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <CostTrendChart 
          data={processedData.dailyData} 
          limit={chartFilters.trendChart.limit}
          onLimitChange={(limit) => setChartFilters(prev => ({ ...prev, trendChart: { limit } }))}
        />
        <ServiceSpendChart 
          data={processedData.groupedData} 
          title={`Spend by ${groupBy.replace(/([A-Z])/g, ' $1').trim()}`}
          limit={chartFilters.barChart.limit}
          onLimitChange={(limit) => setChartFilters(prev => ({ ...prev, barChart: { limit } }))}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <RegionPieChart 
          data={processedData.regionData} 
          limit={chartFilters.pieChart.limit}
          onLimitChange={(limit) => setChartFilters(prev => ({ ...prev, pieChart: { limit } }))}
        />
        <ServiceSpendChart 
          data={processedData.groupedData.slice(0, 6)} 
          title="Top Services Breakdown"
          limit={6}
        />
        <CostTrendChart 
          data={processedData.dailyData.slice(-14)} 
          limit={14}
        />
      </div>
    </div>
  );
};

export default Overview;