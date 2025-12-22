import React, { useMemo, useState } from 'react';
import { MapPin, Globe, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

// Region name to approximate coordinates mapping
const REGION_COORDINATES = {
  // AWS Regions
  'us-east-1': { lat: 38.9072, lng: -77.0369, name: 'US East (N. Virginia)' },
  'us-east-2': { lat: 40.4173, lng: -82.9071, name: 'US East (Ohio)' },
  'us-west-1': { lat: 37.7749, lng: -122.4194, name: 'US West (N. California)' },
  'us-west-2': { lat: 45.5152, lng: -122.6784, name: 'US West (Oregon)' },
  'eu-west-1': { lat: 53.3498, lng: -6.2603, name: 'EU (Ireland)' },
  'eu-west-2': { lat: 51.5074, lng: -0.1278, name: 'EU (London)' },
  'eu-west-3': { lat: 48.8566, lng: 2.3522, name: 'EU (Paris)' },
  'eu-central-1': { lat: 50.1109, lng: 8.6821, name: 'EU (Frankfurt)' },
  'eu-central-2': { lat: 47.3769, lng: 8.5417, name: 'EU (Zurich)' },
  'eu-north-1': { lat: 59.3293, lng: 18.0686, name: 'EU (Stockholm)' },
  'eu-south-1': { lat: 41.9028, lng: 12.4964, name: 'EU (Milan)' },
  'ap-southeast-1': { lat: 1.3521, lng: 103.8198, name: 'Asia Pacific (Singapore)' },
  'ap-southeast-2': { lat: -33.8688, lng: 151.2093, name: 'Asia Pacific (Sydney)' },
  'ap-southeast-3': { lat: -6.2088, lng: 106.8456, name: 'Asia Pacific (Jakarta)' },
  'ap-northeast-1': { lat: 35.6762, lng: 139.6503, name: 'Asia Pacific (Tokyo)' },
  'ap-northeast-2': { lat: 37.5665, lng: 126.9780, name: 'Asia Pacific (Seoul)' },
  'ap-northeast-3': { lat: 34.6937, lng: 135.5023, name: 'Asia Pacific (Osaka)' },
  'ap-south-1': { lat: 19.0760, lng: 72.8777, name: 'Asia Pacific (Mumbai)' },
  'ap-south-2': { lat: 17.3850, lng: 78.4867, name: 'Asia Pacific (Hyderabad)' },
  'ca-central-1': { lat: 45.5017, lng: -73.5673, name: 'Canada (Central)' },
  'sa-east-1': { lat: -23.5505, lng: -46.6333, name: 'South America (São Paulo)' },
  'af-south-1': { lat: -33.9249, lng: 18.4241, name: 'Africa (Cape Town)' },
  'me-south-1': { lat: 25.2048, lng: 55.2708, name: 'Middle East (Bahrain)' },
  'me-central-1': { lat: 24.7136, lng: 46.6753, name: 'Middle East (UAE)' },
  
  // Azure Regions
  'eastus': { lat: 38.9072, lng: -77.0369, name: 'East US' },
  'eastus2': { lat: 40.4173, lng: -82.9071, name: 'East US 2' },
  'westus': { lat: 37.7749, lng: -122.4194, name: 'West US' },
  'westus2': { lat: 47.6062, lng: -122.3321, name: 'West US 2' },
  'westus3': { lat: 33.4484, lng: -112.0740, name: 'West US 3' },
  'centralus': { lat: 41.8781, lng: -87.6298, name: 'Central US' },
  'southcentralus': { lat: 29.4241, lng: -98.4936, name: 'South Central US' },
  'northcentralus': { lat: 41.8781, lng: -87.6298, name: 'North Central US' },
  'westeurope': { lat: 52.3676, lng: 4.9041, name: 'West Europe' },
  'northeurope': { lat: 53.3498, lng: -6.2603, name: 'North Europe' },
  'uksouth': { lat: 51.5074, lng: -0.1278, name: 'UK South' },
  'ukwest': { lat: 53.4808, lng: -2.2426, name: 'UK West' },
  'francecentral': { lat: 48.8566, lng: 2.3522, name: 'France Central' },
  'germanywestcentral': { lat: 50.1109, lng: 8.6821, name: 'Germany West Central' },
  'japaneast': { lat: 35.6762, lng: 139.6503, name: 'Japan East' },
  'japanwest': { lat: 34.6937, lng: 135.5023, name: 'Japan West' },
  'koreacentral': { lat: 37.5665, lng: 126.9780, name: 'Korea Central' },
  'southeastasia': { lat: 1.3521, lng: 103.8198, name: 'Southeast Asia' },
  'australiaeast': { lat: -33.8688, lng: 151.2093, name: 'Australia East' },
  'australiasoutheast': { lat: -37.8136, lng: 144.9631, name: 'Australia Southeast' },
  'brazilsouth': { lat: -23.5505, lng: -46.6333, name: 'Brazil South' },
  'canadacentral': { lat: 45.5017, lng: -73.5673, name: 'Canada Central' },
  'southafricanorth': { lat: -26.2041, lng: 28.0473, name: 'South Africa North' },
  'uaenorth': { lat: 25.2048, lng: 55.2708, name: 'UAE North' },
  
  // Generic mappings
  'global': { lat: 0, lng: 0, name: 'Global' },
  'unknown': { lat: 0, lng: 0, name: 'Unknown' },
};

// Helper to normalize region names
const normalizeRegionName = (regionName) => {
  if (!regionName) return 'unknown';
  const normalized = regionName.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[()]/g, '')
    .replace(/,/g, '');
  
  // Try exact match first
  if (REGION_COORDINATES[normalized]) {
    return normalized;
  }
  
  // Try partial matches
  for (const [key, value] of Object.entries(REGION_COORDINATES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return key;
    }
    const valueNameLower = value.name.toLowerCase();
    if (normalized.includes(valueNameLower) || valueNameLower.includes(normalized)) {
      return key;
    }
  }
  
  // Try common patterns
  if (normalized.includes('us-east') || normalized.includes('virginia') || normalized.includes('n.-virginia')) return 'us-east-1';
  if (normalized.includes('us-west') || normalized.includes('oregon')) return 'us-west-2';
  if (normalized.includes('eu') || normalized.includes('europe')) {
    if (normalized.includes('ireland')) return 'eu-west-1';
    if (normalized.includes('frankfurt') || normalized.includes('germany')) return 'eu-central-1';
    if (normalized.includes('london')) return 'eu-west-2';
    return 'eu-west-1';
  }
  if (normalized.includes('asia') || normalized.includes('singapore')) return 'ap-southeast-1';
  if (normalized.includes('sydney') || normalized.includes('australia')) return 'ap-southeast-2';
  if (normalized.includes('tokyo') || normalized.includes('japan')) return 'ap-northeast-1';
  if (normalized.includes('mumbai') || normalized.includes('india')) return 'ap-south-1';
  
  return 'unknown';
};

// Convert lat/lng to SVG coordinates (Equirectangular projection)
const latLngToXY = (lat, lng, width, height) => {
  const x = ((lng + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return { x, y };
};

const WorldMap = ({ data, totalSpend = 0 }) => {
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);

  // Process region data
  const regionData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const regionMap = {};
    data.forEach(item => {
      const regionKey = normalizeRegionName(item.name);
      const coords = REGION_COORDINATES[regionKey];
      if (coords && coords.lat !== 0 && coords.lng !== 0) {
        if (!regionMap[regionKey]) {
          regionMap[regionKey] = {
            ...coords,
            value: 0,
            percentage: 0,
            originalName: item.name
          };
        }
        regionMap[regionKey].value += item.value;
      }
    });
    
    return Object.values(regionMap)
      .map(region => ({
        ...region,
        percentage: totalSpend > 0 ? (region.value / totalSpend) * 100 : 0
      }))
      .sort((a, b) => b.value - a.value);
  }, [data, totalSpend]);

  // Calculate color intensity based on cost
  const getColorIntensity = (percentage) => {
    if (percentage > 30) return '#ef4444'; // Red - High
    if (percentage > 15) return '#f59e0b'; // Orange - Medium-High
    if (percentage > 5) return '#10b981'; // Green - Medium
    if (percentage > 1) return '#3b82f6'; // Blue - Low
    return '#6b7280'; // Gray - Very Low
  };

  const getMarkerSize = (percentage) => {
    if (percentage > 30) return 20;
    if (percentage > 15) return 16;
    if (percentage > 5) return 14;
    if (percentage > 1) return 12;
    return 10;
  };

  const mapWidth = 1000;
  const mapHeight = 500;

  return (
    <div className="bg-[#1a1b20]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col shadow-xl min-h-[600px]">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Globe size={16} className="text-[#a02ff1]" />
          Most Popular Region by Effective Cost
        </h3>
        <div className="text-[10px] text-gray-500">
          Previous month • Use drill down + Provider
        </div>
      </div>

      <div className="flex-1 w-full min-h-[500px] relative bg-[#0f0f11] rounded-lg overflow-hidden">
        {/* World Map SVG with realistic paths */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1000 500"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0a0e27" stopOpacity="1" />
              <stop offset="100%" stopColor="#1a1b20" stopOpacity="1" />
            </linearGradient>
          </defs>
          
          {/* Ocean background */}
          <rect width="1000" height="500" fill="url(#oceanGradient)" />
          
          {/* World map continents - More accurate simplified paths */}
          <g opacity="0.15" fill="#4b5563" stroke="#6b7280" strokeWidth="1">
            {/* North America */}
            <path d="M 120 80 L 280 60 L 320 100 L 300 180 L 250 220 L 180 240 L 140 220 L 100 180 L 90 120 Z" />
            {/* South America */}
            <path d="M 220 220 L 260 200 L 280 280 L 260 360 L 220 380 L 200 340 L 200 280 Z" />
            {/* Europe */}
            <path d="M 420 60 L 480 50 L 500 100 L 480 150 L 440 160 L 400 140 L 400 90 Z" />
            {/* Africa */}
            <path d="M 440 140 L 480 120 L 500 200 L 480 300 L 440 320 L 420 280 L 420 200 Z" />
            {/* Asia */}
            <path d="M 500 40 L 750 30 L 800 80 L 780 180 L 720 220 L 600 240 L 520 200 L 500 120 Z" />
            {/* Australia */}
            <path d="M 680 280 L 750 270 L 780 300 L 760 340 L 720 350 L 680 330 Z" />
            {/* Greenland */}
            <path d="M 380 20 L 440 15 L 450 50 L 420 70 L 380 60 Z" />
            {/* Middle East */}
            <path d="M 520 120 L 580 110 L 600 150 L 580 180 L 540 190 L 520 160 Z" />
            {/* India */}
            <path d="M 600 140 L 650 130 L 670 170 L 650 200 L 620 210 L 600 180 Z" />
            {/* Japan */}
            <path d="M 750 100 L 770 95 L 775 115 L 770 130 L 755 135 L 750 115 Z" />
            {/* UK */}
            <path d="M 410 70 L 430 65 L 435 80 L 425 90 L 410 85 Z" />
          </g>

          {/* Region Markers */}
          {regionData.map((region, index) => {
            const { x, y } = latLngToXY(region.lat, region.lng, mapWidth, mapHeight);
            const color = getColorIntensity(region.percentage);
            const size = getMarkerSize(region.percentage);
            const isHovered = hoveredRegion === index;

            // Skip if coordinates are invalid
            if (x < 0 || x > mapWidth || y < 0 || y > mapHeight) return null;

            return (
              <g key={index}>
                {/* Pulse animation for high-cost regions */}
                {region.percentage > 15 && (
                  <circle
                    cx={x}
                    cy={y}
                    r={size + 6}
                    fill={color}
                    opacity="0.2"
                    className="animate-pulse"
                  />
                )}
                
                {/* Outer glow */}
                {isHovered && (
                  <circle
                    cx={x}
                    cy={y}
                    r={size + 8}
                    fill={color}
                    opacity="0.15"
                  />
                )}
                
                {/* Marker circle */}
                <motion.circle
                  cx={x}
                  cy={y}
                  r={isHovered ? size + 3 : size}
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth={isHovered ? 3 : 2}
                  opacity={isHovered ? 1 : 0.95}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredRegion(index)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  animate={{
                    scale: isHovered ? 1.3 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                  style={{
                    filter: `drop-shadow(0 0 ${size/2}px ${color})`,
                  }}
                />
                
                {/* Inner highlight */}
                <circle
                  cx={x}
                  cy={y}
                  r={size * 0.4}
                  fill="#ffffff"
                  opacity="0.6"
                  className="pointer-events-none"
                />
                
                {/* Region label (show for top 3 or on hover) */}
                {(isHovered || index < 3) && (
                  <g className="pointer-events-none">
                    {/* Label background */}
                    <rect
                      x={x - 80}
                      y={y - size - 35}
                      width="160"
                      height="30"
                      rx="4"
                      fill="#0f0f11"
                      fillOpacity="0.9"
                      stroke={color}
                      strokeWidth="1"
                    />
                    {/* Region name */}
                    <text
                      x={x}
                      y={y - size - 18}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="11"
                      fontWeight="bold"
                      style={{
                        textShadow: '0 0 8px rgba(0,0,0,0.8)'
                      }}
                    >
                      {region.name}
                    </text>
                    {/* Percentage */}
                    <text
                      x={x}
                      y={y - size - 6}
                      textAnchor="middle"
                      fill={color}
                      fontSize="10"
                      fontWeight="700"
                      style={{
                        textShadow: '0 0 6px rgba(0,0,0,0.8)'
                      }}
                    >
                      {region.percentage.toFixed(1)}%
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hoveredRegion !== null && regionData[hoveredRegion] && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-[#0f0f11] border border-[#a02ff1]/50 rounded-lg p-4 shadow-2xl z-10 min-w-[220px]"
            style={{
              boxShadow: '0 0 30px rgba(160,47,241,0.5)'
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={16} className="text-[#a02ff1]" />
              <h4 className="text-sm font-bold text-white">
                {regionData[hoveredRegion].originalName || regionData[hoveredRegion].name}
              </h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Effective Cost:</span>
                <span className="text-sm font-bold text-[#a02ff1]">
                  {formatCurrency(regionData[hoveredRegion].value)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Percentage:</span>
                <span className="text-sm font-bold text-white">
                  {regionData[hoveredRegion].percentage.toFixed(2)}%
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={12} className="text-gray-400" />
            <span className="text-[10px] text-gray-500 uppercase font-bold">Top Regions:</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {regionData.slice(0, 5).map((region, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0f0f11] rounded-lg border border-white/5 hover:border-[#a02ff1]/30 transition-colors"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getColorIntensity(region.percentage) }}
                />
                <span className="text-[10px] text-gray-300 font-medium truncate max-w-[140px]" title={region.originalName || region.name}>
                  {region.originalName || region.name}
                </span>
                <span className="text-[10px] text-gray-500 font-bold">
                  {region.percentage.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
