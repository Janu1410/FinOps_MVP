// src/components/dashboard/KpiGrid.jsx
import React, { useState } from 'react';
import { DollarSign, MapPin, Server, TrendingUp, Cloud, Tag, FileX, ChevronDown, ChevronUp, X } from 'lucide-react';
import { motion } from 'framer-motion';

const KpiCard = ({ title, value, icon: Icon, color, subValue, delay, onClick }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay * 0.1 }}
    whileHover={{ y: -5 }}
    onClick={onClick}
    // COMPACT: p-3 padding (was p-4)
    className="bg-[#1a1b20]/60 backdrop-blur-md border border-white/5 p-3 rounded-xl shadow-lg relative overflow-hidden group min-h-[100px] cursor-pointer hover:border-[#a02ff1]/30 transition-all"
  >
    <div className={`absolute -top-10 -right-10 p-16 ${color} bg-opacity-5 blur-[40px] rounded-full group-hover:bg-opacity-10 transition-all duration-500`}></div>
    
    <div className="relative z-10 flex flex-col h-full justify-between">
      
      {/* Header Row: Icon + Badge */}
      <div className="flex justify-between items-start mb-2">
        <div className={`p-1.5 rounded-lg bg-white/5 ${color} bg-opacity-10 ring-1 ring-white/5`}>
          <Icon size={16} className={color} />
        </div>
        {subValue && (
            <span className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-gray-400 border border-white/5 font-mono whitespace-nowrap">
              {subValue}
            </span>
        )}
      </div>

      {/* Content Row: Title + Value */}
      <div>
        <div className="text-gray-500 text-[9px] font-bold uppercase tracking-widest truncate">{title}</div>
        
        {/* COMPACT FONT: text-xl (was 2xl) + truncate to prevent wrapping */}
        <div className="text-xl font-bold text-white tracking-tight mt-0.5 truncate" title={value}>
          {value}
        </div>
      </div>

    </div>
  </motion.div>
);

const KpiGrid = ({ 
  spend, 
  topRegion, 
  topService,
  spendChangePercent = 0,
  topProvider = { name: 'N/A', value: 0 },
  untaggedCost = 0,
  missingMetadataCost = 0,
  filteredRecords = []
}) => {
  const [showMoreCards, setShowMoreCards] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  const formatPercent = (val) => {
    const sign = val >= 0 ? '+' : '';
    return `${sign}${val.toFixed(1)}%`;
  };

  // Generate insights for each card
  const getInsights = (cardId) => {
    switch(cardId) {
      case 'total-billed-cost':
        const avgDailySpend = spend / (filteredRecords.length > 0 ? new Set(filteredRecords.map(r => r.ChargePeriodStart?.split(' ')[0])).size : 1);
        const topServices = {};
        filteredRecords.forEach(item => {
          const service = item.ServiceName || 'Unknown';
          topServices[service] = (topServices[service] || 0) + (parseFloat(item.BilledCost) || 0);
        });
        const top3Services = Object.entries(topServices).sort((a, b) => b[1] - a[1]).slice(0, 3);
        return {
          title: "Total Billed Cost Insights",
          description: `Your total cloud spend across all services and regions.`,
          metrics: [
            { label: "Average Daily Spend", value: formatCurrency(avgDailySpend) },
            { label: "Total Records", value: filteredRecords.length.toLocaleString() },
            { label: "Period Change", value: formatPercent(spendChangePercent) }
          ],
          breakdown: top3Services.map(([name, value]) => ({
            label: name,
            value: formatCurrency(value),
            percentage: ((value / spend) * 100).toFixed(1) + '%'
          }))
        };

      case 'top-cost-region':
        const regionBreakdown = {};
        filteredRecords.forEach(item => {
          const region = item.RegionName || 'Unknown';
          regionBreakdown[region] = (regionBreakdown[region] || 0) + (parseFloat(item.BilledCost) || 0);
        });
        const allRegions = Object.entries(regionBreakdown).sort((a, b) => b[1] - a[1]);
        return {
          title: "Top Cost Region Insights",
          description: `Regional distribution of your cloud costs. ${topRegion?.name} accounts for the highest spend.`,
          metrics: [
            { label: "Region Spend", value: formatCurrency(topRegion?.value || 0) },
            { label: "% of Total", value: ((topRegion?.value / spend) * 100).toFixed(1) + '%' },
            { label: "Total Regions", value: allRegions.length }
          ],
          breakdown: allRegions.slice(0, 5).map(([name, value]) => ({
            label: name,
            value: formatCurrency(value),
            percentage: ((value / spend) * 100).toFixed(1) + '%'
          }))
        };

      case 'top-cost-service':
        const serviceBreakdown = {};
        filteredRecords.forEach(item => {
          const service = item.ServiceName || 'Unknown';
          serviceBreakdown[service] = (serviceBreakdown[service] || 0) + (parseFloat(item.BilledCost) || 0);
        });
        const allServices = Object.entries(serviceBreakdown).sort((a, b) => b[1] - a[1]);
        return {
          title: "Top Cost Driver (Service) Insights",
          description: `${topService?.name || 'N/A'} is your primary cost driver. Understanding service-level spend helps optimize resource allocation.`,
          metrics: [
            { label: "Service Spend", value: formatCurrency(topService?.value || 0) },
            { label: "% of Total", value: ((topService?.value / spend) * 100).toFixed(1) + '%' },
            { label: "Total Services", value: allServices.length }
          ],
          breakdown: allServices.slice(0, 5).map(([name, value]) => ({
            label: name,
            value: formatCurrency(value),
            percentage: ((value / spend) * 100).toFixed(1) + '%'
          }))
        };

      case 'spend-change':
        return {
          title: "Spend Change (%) Insights",
          description: `Your spend has ${spendChangePercent >= 0 ? 'increased' : 'decreased'} by ${Math.abs(spendChangePercent).toFixed(1)}% compared to the previous period. This is your early warning system for cost anomalies.`,
          metrics: [
            { label: "Change Percentage", value: formatPercent(spendChangePercent) },
            { label: "Trend", value: spendChangePercent >= 0 ? "Increasing" : "Decreasing" },
            { label: "Status", value: Math.abs(spendChangePercent) > 10 ? "⚠️ High Change" : "✓ Normal" }
          ],
          breakdown: []
        };

      case 'top-provider':
        const providerBreakdown = {};
        filteredRecords.forEach(item => {
          const provider = item.ProviderName || 'Unknown';
          providerBreakdown[provider] = (providerBreakdown[provider] || 0) + (parseFloat(item.BilledCost) || 0);
        });
        const allProviders = Object.entries(providerBreakdown).sort((a, b) => b[1] - a[1]);
        return {
          title: "Top Cloud Provider Insights",
          description: `${topProvider?.name || 'N/A'} is your primary cloud provider. This confirms whether "multi-cloud" is real or marketing.`,
          metrics: [
            { label: "Provider Spend", value: formatCurrency(topProvider?.value || 0) },
            { label: "% of Total", value: ((topProvider?.value / spend) * 100).toFixed(1) + '%' },
            { label: "Total Providers", value: allProviders.length }
          ],
          breakdown: allProviders.map(([name, value]) => ({
            label: name,
            value: formatCurrency(value),
            percentage: ((value / spend) * 100).toFixed(1) + '%'
          }))
        };

      case 'untagged-cost':
        const untaggedItems = filteredRecords.filter(item => {
          const tags = item.Tags || item.Tag || '';
          return !tags || tags.trim() === '' || tags.toLowerCase() === 'null' || tags.toLowerCase() === 'none';
        });
        return {
          title: "Untagged Cost Impact Insights",
          description: `Untagged costs represent ${((untaggedCost / spend) * 100).toFixed(1)}% of your total spend. Untagged = unaccountable = unoptimizable. This is a strong FinOps signal.`,
          metrics: [
            { label: "Untagged Cost", value: formatCurrency(untaggedCost) },
            { label: "% of Total", value: ((untaggedCost / spend) * 100).toFixed(1) + '%' },
            { label: "Untagged Resources", value: untaggedItems.length.toLocaleString() }
          ],
          breakdown: [],
          recommendation: untaggedCost > spend * 0.1 
            ? "⚠️ High untagged cost detected. Consider implementing a tagging strategy to improve cost accountability."
            : "✓ Untagged costs are within acceptable range."
        };

      case 'missing-metadata':
        const missingMetadataItems = filteredRecords.filter(item => {
          const hasServiceName = item.ServiceName && item.ServiceName.trim() !== '';
          const hasRegionName = item.RegionName && item.RegionName.trim() !== '';
          const hasResourceName = item.ResourceName && item.ResourceName.trim() !== '';
          return !hasServiceName || !hasRegionName || !hasResourceName;
        });
        return {
          title: "Cost With Missing Metadata Insights",
          description: `Costs with missing metadata represent ${((missingMetadataCost / spend) * 100).toFixed(1)}% of your total spend. This shows visibility debt that impacts optimization efforts.`,
          metrics: [
            { label: "Missing Metadata Cost", value: formatCurrency(missingMetadataCost) },
            { label: "% of Total", value: ((missingMetadataCost / spend) * 100).toFixed(1) + '%' },
            { label: "Affected Resources", value: missingMetadataItems.length.toLocaleString() }
          ],
          breakdown: [],
          recommendation: missingMetadataCost > spend * 0.05
            ? "⚠️ Significant metadata gaps detected. Improve data quality to enable better cost optimization."
            : "✓ Metadata quality is good."
        };

      default:
        return null;
    }
  };

  const baseCards = [
    {
      id: 'total-billed-cost',
      delay: 0,
      title: "Total Billed Cost",
      value: formatCurrency(spend),
      icon: DollarSign,
      color: "text-[#a02ff1]",
      subValue: formatPercent(spendChangePercent)
    },
    {
      id: 'top-cost-region',
      delay: 1,
      title: "Top Cost Region",
      value: topRegion?.name || 'N/A',
      icon: MapPin,
      color: "text-blue-400",
      subValue: formatCurrency(topRegion?.value || 0)
    },
    {
      id: 'top-cost-service',
      delay: 2,
      title: "Top Cost Driver (Service)",
      value: topService?.name || 'N/A',
      icon: Server,
      color: "text-emerald-400",
      subValue: formatCurrency(topService?.value || 0)
    }
  ];

  const additionalCards = [
    {
      id: 'spend-change',
      delay: 3,
      title: "Spend Change (%)",
      value: formatPercent(spendChangePercent),
      icon: TrendingUp,
      color: spendChangePercent >= 0 ? "text-red-400" : "text-green-400",
      subValue: "vs prev period"
    },
    {
      id: 'top-provider',
      delay: 4,
      title: "Top Cloud Provider",
      value: topProvider?.name || 'N/A',
      icon: Cloud,
      color: "text-cyan-400",
      subValue: formatCurrency(topProvider?.value || 0)
    },
    {
      id: 'untagged-cost',
      delay: 5,
      title: "Untagged Cost Impact",
      value: formatCurrency(untaggedCost),
      icon: Tag,
      color: "text-amber-400",
      subValue: `${((untaggedCost / spend) * 100).toFixed(1)}% of total`
    },
    {
      id: 'missing-metadata',
      delay: 6,
      title: "Cost With Missing Metadata",
      value: formatCurrency(missingMetadataCost),
      icon: FileX,
      color: "text-orange-400",
      subValue: `${((missingMetadataCost / spend) * 100).toFixed(1)}% of total`
    }
  ];

  const insights = selectedCard ? getInsights(selectedCard) : null;

  return (
    <>
      <div className="mb-4">
        {/* Grid matches the tight layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-1">
          {baseCards.map((card, index) => (
            <KpiCard 
              key={index}
              delay={card.delay} 
              title={card.title} 
              value={card.value} 
              icon={card.icon} 
              color={card.color} 
              subValue={card.subValue}
              onClick={() => setSelectedCard(card.id)}
            />
          ))}
          
          {/* Additional Cards - Shown when expanded */}
          {showMoreCards && additionalCards.map((card, index) => (
            <KpiCard 
              key={`additional-${index}`}
              delay={card.delay} 
              title={card.title} 
              value={card.value} 
              icon={card.icon} 
              color={card.color} 
              subValue={card.subValue}
              onClick={() => setSelectedCard(card.id)}
            />
          ))}
        </div>

        {/* Slim Line Toggle */}
        <div className="flex items-center justify-center mt-2">
          <button
            onClick={() => setShowMoreCards(!showMoreCards)}
            className="group flex items-center gap-2 w-full max-w-xs"
          >
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent shadow-[0_0_8px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_12px_rgba(160,47,241,0.3)] transition-shadow"></div>
            <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-medium text-gray-500 group-hover:text-[#a02ff1] transition-colors">
              <span>{showMoreCards ? 'Less' : 'More'}</span>
              <ChevronDown 
                size={12} 
                className={`transition-transform duration-300 ${showMoreCards ? 'rotate-180' : ''}`} 
              />
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent shadow-[0_0_8px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_12px_rgba(160,47,241,0.3)] transition-shadow"></div>
          </button>
        </div>
      </div>

      {/* Insights Dialog */}
      {insights && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCard(null)}
        >
          <div 
            className="bg-[#1a1b20] border border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dialog Header */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{insights.title}</h2>
              <button
                onClick={() => setSelectedCard(null)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Dialog Content */}
            <div className="p-5 overflow-y-auto max-h-[calc(80vh-100px)]">
              <p className="text-sm text-gray-300 mb-4">{insights.description}</p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {insights.metrics.map((metric, index) => (
                  <div key={index} className="bg-[#0f0f11]/50 border border-white/5 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">{metric.label}</div>
                    <div className="text-sm font-bold text-white">{metric.value}</div>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              {insights.breakdown && insights.breakdown.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-white mb-2">Breakdown</h3>
                  <div className="space-y-2">
                    {insights.breakdown.map((item, index) => (
                      <div 
                        key={index}
                        className="bg-[#0f0f11]/50 border border-white/5 rounded-lg p-3 flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-white truncate" title={item.label}>
                            {item.label}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-sm font-bold text-white">{item.value}</div>
                          <div className="text-xs text-gray-400">{item.percentage}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendation */}
              {insights.recommendation && (
                <div className="bg-amber-400/10 border border-amber-400/30 rounded-lg p-3">
                  <p className="text-xs text-amber-400">{insights.recommendation}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KpiGrid;