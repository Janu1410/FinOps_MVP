// src/components/VerticalSidebar.jsx
import React, { useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  BarChart3,
  TrendingUp,
  Gauge,
  Users,
  Boxes,
  Sparkles,
  ShieldAlert,
  Table,
  Upload as UploadIcon,
  Play,
  FileBarChart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const VerticalSidebar = ({ onCsvSelected }) => {
  const fileInputRef = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // 1. Handle File Selection Logic
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      setSelectedFile(file);
      if (onCsvSelected) onCsvSelected(file);
    }
  };

  // Handle Process Upload - Frontend only (refresh dashboard)
  const handleProcessUpload = () => {
    if (selectedFile) {
      // For now, just refresh the page (frontend only)
      // In the future, this will call the backend
      window.location.reload();
    }
  };

  // Preview Component for each section
  const PreviewContent = ({ item }) => {
    switch (item.to) {
      case "/dashboard":
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#0f0f11] border border-white/10 rounded p-2">
                <div className="text-[8px] text-gray-500 mb-1">Total Spend</div>
                <div className="text-xs font-bold text-white">$125,430</div>
              </div>
              <div className="bg-[#0f0f11] border border-white/10 rounded p-2">
                <div className="text-[8px] text-gray-500 mb-1">Top Region</div>
                <div className="text-xs font-bold text-white">us-east-1</div>
              </div>
            </div>
            <div className="bg-[#0f0f11] border border-white/10 rounded p-2">
              <div className="text-[8px] text-gray-500 mb-1.5">Cost Trend</div>
              <div className="flex items-end gap-0.5 h-8">
                {[3, 5, 4, 7, 6, 8, 5].map((h, i) => (
                  <div key={i} className="flex-1 bg-[#a02ff1] rounded-t" style={{ height: `${h * 4}px` }}></div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 text-[8px] text-gray-400">
              <div className="w-1.5 h-1.5 rounded-full bg-[#a02ff1]"></div>
              <span>KPI Grid • Charts • Filters</span>
            </div>
          </div>
        );
      
      case "/dashboard/data-explorer":
        return (
          <div className="space-y-2">
            <div className="bg-[#0f0f11] border border-white/10 rounded overflow-hidden">
              <div className="bg-[#25262b] px-2 py-1 border-b border-white/10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#a02ff1]"></div>
                <div className="text-[8px] text-gray-400">ServiceName</div>
                <div className="text-[8px] text-gray-400">BilledCost</div>
              </div>
              <div className="divide-y divide-white/5">
                {['Compute', 'Storage', 'Network'].map((service, i) => (
                  <div key={i} className="px-2 py-1.5 flex items-center gap-2 text-[8px]">
                    <div className="flex-1 text-white">{service}</div>
                    <div className="text-[#a02ff1] font-mono">${(Math.random() * 1000).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 text-[8px] text-gray-400">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              <span>Table View • Filters • Export</span>
            </div>
          </div>
        );
      
      case "/dashboard/cost-analysis":
        return (
          <div className="space-y-2">
            <div className="bg-[#0f0f11] border border-white/10 rounded p-2">
              <div className="text-[8px] text-gray-500 mb-1.5">Service Breakdown</div>
              <div className="space-y-1">
                {['EC2', 'S3', 'RDS'].map((svc, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full bg-[#a02ff1]" style={{ width: `${60 - i * 15}%` }}></div>
                    </div>
                    <div className="text-[8px] text-white w-8">{svc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 text-[8px] text-gray-400">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span>Trends • Analysis • Insights</span>
            </div>
          </div>
        );
      
      case "/dashboard/cost-drivers":
        return (
          <div className="space-y-2">
            <div className="bg-[#0f0f11] border border-white/10 rounded p-2">
              <div className="text-[8px] text-gray-500 mb-1.5">Top Drivers</div>
              <div className="space-y-1.5">
                {['Instance Size', 'Data Transfer', 'Storage Type'].map((driver, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="text-[8px] text-white">{driver}</div>
                    <div className="text-[8px] text-[#a02ff1] font-bold">{35 - i * 8}%</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 text-[8px] text-gray-400">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
              <span>Drivers • Impact • Metrics</span>
            </div>
          </div>
        );
      
      case "/dashboard/resources":
        return (
          <div className="space-y-2">
            <div className="bg-[#0f0f11] border border-white/10 rounded p-2">
              <div className="text-[8px] text-gray-500 mb-1.5">Resource List</div>
              <div className="space-y-1">
                {['i-123456', 'vol-abc123', 'sg-xyz789'].map((res, i) => (
                  <div key={i} className="flex items-center justify-between text-[8px]">
                    <div className="text-white truncate">{res}</div>
                    <div className="text-[#a02ff1]">${(Math.random() * 100).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 text-[8px] text-gray-400">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
              <span>Resources • Costs • Tags</span>
            </div>
          </div>
        );
      
      case "/dashboard/data-quality":
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#0f0f11] border border-white/10 rounded p-2">
                <div className="text-[8px] text-gray-500 mb-1">Untagged</div>
                <div className="text-xs font-bold text-amber-400">12%</div>
              </div>
              <div className="bg-[#0f0f11] border border-white/10 rounded p-2">
                <div className="text-[8px] text-gray-500 mb-1">Complete</div>
                <div className="text-xs font-bold text-green-400">88%</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[8px] text-gray-400">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
              <span>Quality Score • Issues • Health</span>
            </div>
          </div>
        );
      
      case "/dashboard/accounts":
        return (
          <div className="space-y-2">
            <div className="bg-[#0f0f11] border border-white/10 rounded p-2">
              <div className="text-[8px] text-gray-500 mb-1.5">Account Structure</div>
              <div className="space-y-1">
                {['Production', 'Staging', 'Dev'].map((acc, i) => (
                  <div key={i} className="flex items-center justify-between text-[8px]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-[#a02ff1]"></div>
                      <div className="text-white">{acc}</div>
                    </div>
                    <div className="text-[#a02ff1]">${(Math.random() * 5000).toFixed(0)}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 text-[8px] text-gray-400">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
              <span>Accounts • Ownership • Allocation</span>
            </div>
          </div>
        );
      
      case "/dashboard/optimization":
        return (
          <div className="space-y-2">
            <div className="bg-[#0f0f11] border border-white/10 rounded p-2">
              <div className="text-[8px] text-gray-500 mb-1.5">Opportunities</div>
              <div className="space-y-1">
                {['Right-size Instances', 'Reserved Capacity', 'Idle Resources'].map((opt, i) => (
                  <div key={i} className="flex items-center justify-between text-[8px]">
                    <div className="text-white">{opt}</div>
                    <div className="text-green-400 font-bold">-${(Math.random() * 500).toFixed(0)}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 text-[8px] text-gray-400">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span>Savings • Recommendations</span>
            </div>
          </div>
        );
      
      case "/dashboard/reports":
        return (
          <div className="space-y-2">
            <div className="bg-[#0f0f11] border border-white/10 rounded p-2">
              <div className="text-[8px] text-gray-500 mb-1.5">Report Types</div>
              <div className="space-y-1">
                {['Monthly Summary', 'Cost Breakdown', 'Executive Report'].map((report, i) => (
                  <div key={i} className="flex items-center gap-2 text-[8px]">
                    <div className="w-1 h-1 rounded-full bg-[#a02ff1]"></div>
                    <div className="text-white">{report}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 text-[8px] text-gray-400">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              <span>Generate • Export • Schedule</span>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  // 2. Navigation Groups Configuration
  // Note: Preserving '/dashboard' prefix to ensure compatibility with existing Router
  const navigationGroups = [
    {
      title: "CORE",
      items: [
        { 
          to: "/dashboard", 
          label: "Overview", 
          icon: BarChart3, 
          end: true,
          description: "Complete dashboard overview with KPIs, cost trends, and key metrics at a glance"
        },
        {
          to: "/dashboard/data-explorer",
          label: "Data Explorer",
          icon: Table,
          description: "Explore and analyze your cost data in tabular format with advanced filtering and sorting"
        },
      ],
    },
    {
      title: "ANALYTICS",
      items: [
        {
          to: "/dashboard/cost-analysis",
          label: "Cost Analysis",
          icon: TrendingUp,
          description: "Deep dive into cost patterns, trends, and spending analysis across services and regions"
        },
        { 
          to: "/dashboard/cost-drivers", 
          label: "Cost Drivers", 
          icon: Gauge,
          description: "Identify and analyze the primary factors driving your cloud costs and spending"
        },
        { 
          to: "/dashboard/resources", 
          label: "Resources", 
          icon: Boxes,
          description: "View and manage individual cloud resources, their costs, and utilization metrics"
        },
        {
          to: "/dashboard/data-quality",
          label: "Data Quality",
          icon: ShieldAlert,
          description: "Monitor data quality, missing metadata, untagged resources, and data completeness"
        },
      ],
    },
    {
      title: "FINANCE",
      items: [
        {
          to: "/dashboard/accounts",
          label: "Accounts & Ownership",
          icon: Users,
          description: "Manage account ownership, cost allocation, and financial responsibility mapping"
        },
        {
          to: "/dashboard/optimization",
          label: "Optimization",
          icon: Sparkles,
          description: "Discover cost optimization opportunities, recommendations, and savings potential"
        },
      ],
    },
    {
      title: "REPORTING",
      items: [
        { 
          to: "/dashboard/reports", 
          label: "Reports", 
          icon: FileBarChart,
          description: "Generate and export comprehensive cost reports, summaries, and financial documents"
        },
      ],
    },
  ];

  // 3. Hover Tooltip State
  const [hoveredItem, setHoveredItem] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  // 4. Helper for Nav Items with Tooltip
  const NavItem = ({ item }) => {
    const handleMouseEnter = (e) => {
      if (item.description) {
        const rect = e.currentTarget.getBoundingClientRect();
        // Check if sidebar is collapsed (width < 200px)
        const sidebarWidth = window.innerWidth >= 1024 ? 240 : 72;
        setTooltipPosition({
          top: rect.top + rect.height / 2,
          left: sidebarWidth + 12,
        });
        setHoveredItem(item);
      }
    };

    const handleMouseLeave = () => {
      setHoveredItem(null);
    };

    return (
      <div className="relative">
        <NavLink
          to={item.to}
          end={item.end}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={({ isActive }) => `
            group flex items-center justify-center lg:justify-start gap-0 lg:gap-3 px-2 lg:px-3 py-2.5 lg:py-2 mb-1 rounded-lg transition-all duration-200 border border-transparent
            ${
              isActive
                ? "bg-[#a02ff1]/10 text-[#a02ff1] border-[#a02ff1]/20 shadow-[0_0_15px_rgba(160,47,241,0.1)]"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }
          `}
        >
          <item.icon
            size={20}
            className="lg:w-4 lg:h-4 group-[.active]:text-[#a02ff1] group-hover:text-white transition-colors"
          />
          <span className="hidden lg:inline text-sm font-medium">{item.label}</span>
        </NavLink>
      </div>
    );
  };

  return (
    <>
      {/* Hover Preview Window */}
      <AnimatePresence>
        {hoveredItem && (
          <motion.div
            initial={{ opacity: 0, x: -10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed z-[60] pointer-events-none"
            style={{
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`,
              transform: "translateY(-50%)",
            }}
          >
            <div className="bg-[#1a1b20] border border-[#a02ff1]/30 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl w-[320px]">
              {/* Window Header */}
              <div className="bg-[#25262b] border-b border-white/10 px-3 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-[#a02ff1]/10 rounded">
                    <hoveredItem.icon size={14} className="text-[#a02ff1]" />
                  </div>
                  <h3 className="text-xs font-bold text-white">
                    {hoveredItem.label}
                  </h3>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                </div>
              </div>
              
              {/* Preview Content Window */}
              <div className="p-3 bg-[#0f0f11]">
                <PreviewContent item={hoveredItem} />
              </div>
              
              {/* Window Footer */}
              <div className="bg-[#25262b] border-t border-white/10 px-3 py-1.5">
                <p className="text-[9px] text-gray-500 text-center">
                  {hoveredItem.description}
                </p>
              </div>
              
              {/* Tooltip Arrow */}
              <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2">
                <div className="w-2 h-2 bg-[#1a1b20] border-l border-b border-[#a02ff1]/30 rotate-45"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed top-0 left-0 h-screen w-[72px] lg:w-[240px] bg-[#0f0f11] border-r border-white/5 z-50 flex flex-col transition-all duration-300">
      {/* --- LOGO SECTION --- */}
      <div className="px-2 lg:px-5 py-6 mb-2 flex items-center justify-center lg:justify-start gap-0 lg:gap-3">
        <img
          src="/k&cologo.svg"
          alt="K&Co Logo"
          className="w-10 h-10 lg:w-11 lg:h-11 object-contain"
        />
        <div className="hidden lg:block">
          <h1 className="text-base font-bold text-white tracking-tight leading-none">
            K&Co.
          </h1>
          <p className="text-[10px] text-gray-500 font-mono mt-0.5">
            FINOPS OS v2.4
          </p>
        </div>
      </div>

      {/* --- NAVIGATION LINKS --- */}
      <div className="flex-1 overflow-y-auto px-2 lg:px-3 space-y-4 lg:space-y-6 scrollbar-hide">
        {navigationGroups.map((group, index) => (
          <div key={index}>
            {/* Section Header - Hidden on small screens */}
            <p className="hidden lg:block px-3 text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-2">
              {group.title}
            </p>
            {/* Section Items */}
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavItem key={item.to} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* --- ACTIONS FOOTER --- */}
      <div className="p-2 lg:p-3 mt-auto space-y-2 lg:space-y-3 bg-[#0f0f11] border-t border-white/5">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Upload Widget - Collapsed on small screens */}
        <div
          onClick={openFilePicker}
          className="group relative border border-dashed border-gray-700 hover:border-[#a02ff1] rounded-lg p-2 lg:p-3 cursor-pointer bg-[#1a1b20]/50 hover:bg-[#a02ff1]/5 transition-all"
        >
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center justify-center gap-0 lg:gap-2 text-gray-400 group-hover:text-[#a02ff1] transition-colors">
              <UploadIcon size={18} className="lg:w-3.5 lg:h-3.5" />
              <span className="hidden lg:inline text-xs font-semibold text-white">
                Upload more data (CSV)
              </span>
            </div>
            <p className="hidden lg:block text-[10px] text-gray-500/80">One-time upload</p>
          </div>
          {selectedFileName && (
            <p className="hidden lg:block text-[10px] text-gray-400 truncate px-1 mt-2 font-medium">
              {selectedFileName}
            </p>
          )}
        </div>

        {/* Process Upload Button - Icon only on small screens */}
        <button
          type="button"
          onClick={handleProcessUpload}
          disabled={!selectedFile}
          className={`
                w-full flex items-center justify-center gap-0 lg:gap-2 py-2.5 rounded-lg font-bold text-xs transition-all
                ${
                  selectedFile
                    ? "bg-[#a02ff1] hover:bg-[#8e25d9] text-white shadow-[0_0_15px_rgba(160,47,241,0.3)]"
                    : "bg-gray-800 text-gray-600 cursor-not-allowed"
                }
            `}
          title={selectedFile ? "Process Upload" : "Select a file first"}
        >
          <Play size={18} className="lg:w-3.5 lg:h-3.5" fill={selectedFile ? "currentColor" : "none"} />
          <span className="hidden lg:inline">Process Upload</span>
        </button>
      </div>
    </div>
    </>
  );
};

export default VerticalSidebar;