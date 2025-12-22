import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Globe } from 'lucide-react';

// Region to Country Code Mapping (ISO-2)
const REGION_TO_COUNTRY = {
  // AWS US Regions
  'us-east-1': 'US', 'us-east-2': 'US', 'us-west-1': 'US', 'us-west-2': 'US',
  'us-west-3': 'US', 'us-gov-east-1': 'US', 'us-gov-west-1': 'US',
  
  // Azure US Regions
  'eastus': 'US', 'eastus2': 'US', 'westus': 'US', 'westus2': 'US', 'westus3': 'US',
  'centralus': 'US', 'southcentralus': 'US', 'northcentralus': 'US',
  
  // AWS EU Regions
  'eu-west-1': 'IE', 'eu-west-2': 'GB', 'eu-west-3': 'FR', 'eu-central-1': 'DE',
  'eu-central-2': 'CH', 'eu-north-1': 'SE', 'eu-south-1': 'IT',
  
  // Azure EU Regions
  'westeurope': 'NL', 'northeurope': 'IE', 'uksouth': 'GB', 'ukwest': 'GB',
  'francecentral': 'FR', 'francesouth': 'FR', 'germanywestcentral': 'DE',
  'germanynorth': 'DE', 'switzerlandnorth': 'CH', 'switzerlandwest': 'CH',
  'norwayeast': 'NO', 'norwaywest': 'NO', 'swedencentral': 'SE',
  
  // AWS Asia Pacific
  'ap-southeast-1': 'SG', 'ap-southeast-2': 'AU', 'ap-southeast-3': 'ID',
  'ap-northeast-1': 'JP', 'ap-northeast-2': 'KR', 'ap-northeast-3': 'JP',
  'ap-south-1': 'IN', 'ap-south-2': 'IN', 'ap-east-1': 'HK',
  
  // Azure Asia Pacific
  'japaneast': 'JP', 'japanwest': 'JP', 'koreacentral': 'KR', 'koreasouth': 'KR',
  'southeastasia': 'SG', 'australiaeast': 'AU', 'australiasoutheast': 'AU',
  'centralindia': 'IN', 'southindia': 'IN', 'westindia': 'IN',
  'eastasia': 'HK', 'southeastasia': 'SG',
  
  // AWS Other Regions
  'ca-central-1': 'CA', 'sa-east-1': 'BR', 'af-south-1': 'ZA',
  'me-south-1': 'BH', 'me-central-1': 'AE',
  
  // Azure Other Regions
  'canadacentral': 'CA', 'canadaeast': 'CA', 'brazilsouth': 'BR',
  'brazilsoutheast': 'BR', 'southafricanorth': 'ZA', 'southafricawest': 'ZA',
  'uaenorth': 'AE', 'uaecentral': 'AE',
  
  // Generic fallbacks
  'global': null, 'unknown': null, 'any': null
};

// Helper to normalize region name and map to country
const regionToCountry = (regionName) => {
  if (!regionName) return null;
  
  const normalized = regionName.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[()]/g, '')
    .replace(/,/g, '')
    .replace(/\./g, '');
  
  // Direct lookup
  if (REGION_TO_COUNTRY[normalized]) {
    return REGION_TO_COUNTRY[normalized];
  }
  
  // Pattern matching
  if (normalized.includes('us-') || normalized.includes('eastus') || normalized.includes('westus') || normalized.includes('centralus')) return 'US';
  if (normalized.includes('eu-') || normalized.includes('europe')) {
    if (normalized.includes('london') || normalized.includes('uk')) return 'GB';
    if (normalized.includes('ireland')) return 'IE';
    if (normalized.includes('frankfurt') || normalized.includes('germany')) return 'DE';
    if (normalized.includes('paris') || normalized.includes('france')) return 'FR';
    return 'GB'; // Default EU to GB
  }
  if (normalized.includes('ap-') || normalized.includes('asia')) {
    if (normalized.includes('mumbai') || normalized.includes('india') || normalized.includes('hyderabad')) return 'IN';
    if (normalized.includes('singapore')) return 'SG';
    if (normalized.includes('sydney') || normalized.includes('australia')) return 'AU';
    if (normalized.includes('tokyo') || normalized.includes('japan') || normalized.includes('osaka')) return 'JP';
    if (normalized.includes('seoul') || normalized.includes('korea')) return 'KR';
    if (normalized.includes('jakarta') || normalized.includes('indonesia')) return 'ID';
    if (normalized.includes('hong') || normalized.includes('hk')) return 'HK';
  }
  if (normalized.includes('ca-') || normalized.includes('canada')) return 'CA';
  if (normalized.includes('sa-') || normalized.includes('brazil') || normalized.includes('sao-paulo')) return 'BR';
  if (normalized.includes('af-') || normalized.includes('south-africa') || normalized.includes('cape-town')) return 'ZA';
  if (normalized.includes('me-') || normalized.includes('uae') || normalized.includes('bahrain')) return 'AE';
  
  return null;
};

// Color thresholds based on percentage
const getColorByPercentage = (percentage) => {
  if (percentage > 30) return '#ef4444'; // Red
  if (percentage > 15) return '#f59e0b'; // Orange
  if (percentage > 5) return '#10b981';  // Green
  if (percentage > 1) return '#3b82f6';  // Blue
  return '#6b7280'; // Gray
};

const MostPopularRegion = ({ data, totalSpend = 0 }) => {
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);

  // Aggregate spend by country
  const countrySpend = useMemo(() => {
    if (!data || data.length === 0) return {};
    
    const countryMap = {};
    
    data.forEach(item => {
      const countryCode = regionToCountry(item.name);
      if (countryCode) {
        if (!countryMap[countryCode]) {
          countryMap[countryCode] = {
            code: countryCode,
            value: 0,
            regions: []
          };
        }
        countryMap[countryCode].value += item.value;
        countryMap[countryCode].regions.push({
          name: item.name,
          value: item.value
        });
      }
    });
    
    // Calculate percentages
    Object.values(countryMap).forEach(country => {
      country.percentage = totalSpend > 0 ? (country.value / totalSpend) * 100 : 0;
    });
    
    return countryMap;
  }, [data, totalSpend]);

  // Handle SVG path hover
  const handlePathMouseEnter = (e, countryCode) => {
    if (countrySpend[countryCode]) {
      setHoveredCountry(countryCode);
      setTooltipPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handlePathMouseMove = (e) => {
    if (hoveredCountry) {
      setTooltipPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handlePathMouseLeave = () => {
    setHoveredCountry(null);
  };

  // World Map SVG Component - Loads SVG and binds data directly to paths
  const WorldMapSVG = ({ countrySpend, onPathHover, onPathMove, onPathLeave, getColorByPercentage }) => {
    const containerRef = useRef(null);
    const objectRef = useRef(null);

    useEffect(() => {
      if (!containerRef.current) return;

      // Create object element to load SVG
      const object = document.createElement('object');
      object.data = '/world.svg';
      object.type = 'image/svg+xml';
      object.style.width = '100%';
      object.style.height = '100%';
      object.style.pointerEvents = 'all';
      
      object.onload = () => {
        try {
          const svgDoc = object.contentDocument;
          if (!svgDoc) return;

          // Apply colors to paths based on country spend
          Object.entries(countrySpend).forEach(([code, country]) => {
            const path = svgDoc.getElementById(code);
            if (path) {
              const color = getColorByPercentage(country.percentage);
              path.setAttribute('fill', color);
              path.setAttribute('style', 'cursor: pointer; transition: fill 0.2s; stroke: #374151; stroke-width: 0.3;');
              
              // Add hover effects
              path.addEventListener('mouseenter', (e) => {
                path.setAttribute('fill', '#a02ff1');
                path.setAttribute('stroke', '#a02ff1');
                path.setAttribute('stroke-width', '1');
                onPathHover(e, code);
              });
              
              path.addEventListener('mousemove', onPathMove);
              
              path.addEventListener('mouseleave', () => {
                const originalColor = getColorByPercentage(country.percentage);
                path.setAttribute('fill', originalColor);
                path.setAttribute('stroke', '#374151');
                path.setAttribute('stroke-width', '0.3');
                onPathLeave();
              });
            }
          });

          // Set default fill for countries without data
          const allPaths = svgDoc.querySelectorAll('path');
          allPaths.forEach(path => {
            const id = path.getAttribute('id');
            if (id && !countrySpend[id]) {
              path.setAttribute('fill', '#374151');
              path.setAttribute('style', 'stroke: #4b5563; stroke-width: 0.3;');
            }
          });
        } catch (err) {
          console.error('Error processing SVG:', err);
        }
      };

      object.onerror = () => {
        console.error('Failed to load world.svg');
      };

      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(object);
      objectRef.current = object;

      return () => {
        if (objectRef.current && objectRef.current.parentNode) {
          objectRef.current.parentNode.removeChild(objectRef.current);
        }
      };
    }, [countrySpend, getColorByPercentage, onPathHover, onPathMove, onPathLeave]);

    return (
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ height: '100%', width: '100%' }}
      />
    );
  };

  if (Object.keys(countrySpend).length === 0) {
    return (
      <div className="bg-[#1a1b20]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col shadow-xl min-h-[500px]">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe size={16} className="text-[#a02ff1]" />
            Most Popular Region by Effective Cost
          </h3>
          <div className="text-[10px] text-gray-500">
            Previous month • Use drill down + Provider
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
          No region data available
        </div>
      </div>
    );
  }

  const topCountries = Object.values(countrySpend)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="bg-[#1a1b20]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col shadow-xl">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Globe size={16} className="text-[#a02ff1]" />
          Most Popular Region by Effective Cost
        </h3>
        <div className="text-[10px] text-gray-500">
          Previous month • Use drill down + Provider
        </div>
      </div>

      {/* World Map SVG */}
      <div className="w-full relative bg-[#0f0f11] rounded-lg overflow-hidden" style={{ height: '500px', width: '100%' }}>
        <WorldMapSVG
          countrySpend={countrySpend}
          onPathHover={handlePathMouseEnter}
          onPathMove={handlePathMouseMove}
          onPathLeave={handlePathMouseLeave}
          getColorByPercentage={getColorByPercentage}
        />
        
        {/* Tooltip */}
        {hoveredCountry && countrySpend[hoveredCountry] && (
          <div
            className="fixed bg-[#0f0f11] border border-[#a02ff1]/50 rounded-lg p-4 shadow-2xl z-50 min-w-[220px] pointer-events-none"
            style={{
              left: `${tooltipPosition.x + 10}px`,
              top: `${tooltipPosition.y + 10}px`,
              boxShadow: '0 0 30px rgba(160,47,241,0.5)'
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Globe size={16} className="text-[#a02ff1]" />
              <h4 className="text-sm font-bold text-white">
                {countrySpend[hoveredCountry].code}
              </h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Effective Cost:</span>
                <span className="text-sm font-bold text-[#a02ff1]">
                  {formatCurrency(countrySpend[hoveredCountry].value)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Percentage:</span>
                <span className="text-sm font-bold text-white">
                  {countrySpend[hoveredCountry].percentage.toFixed(2)}%
                </span>
              </div>
              {countrySpend[hoveredCountry].regions.length > 0 && (
                <div className="pt-2 border-t border-white/5">
                  <div className="text-xs text-gray-400 mb-1">Regions:</div>
                  <div className="text-xs text-gray-300">
                    {countrySpend[hoveredCountry].regions.slice(0, 3).map(r => r.name).join(', ')}
                    {countrySpend[hoveredCountry].regions.length > 3 && '...'}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Top Countries Summary */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="flex flex-wrap gap-3">
          {topCountries.map((country) => (
            <div
              key={country.code}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0f0f11] rounded-lg border border-white/5 hover:border-[#a02ff1]/30 transition-colors"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getColorByPercentage(country.percentage) }}
              />
              <span className="text-[10px] text-gray-300 font-medium">
                {country.code}
              </span>
              <span className="text-[10px] text-gray-500 font-bold">
                {country.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MostPopularRegion;
