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
  FileText,
  Upload as UploadIcon,
  Play,
  FileBarChart,
} from "lucide-react";

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

  // 2. Navigation Groups Configuration
  // Note: Preserving '/dashboard' prefix to ensure compatibility with existing Router
  const navigationGroups = [
    {
      title: "ANALYTICS",
      items: [
        { to: "/dashboard", label: "Overview", icon: BarChart3, end: true },
        {
          to: "/dashboard/data-explorer",
          label: "Data Explorer",
          icon: FileText,
        },
        {
          to: "/dashboard/cost-analysis",
          label: "Cost Analysis",
          icon: TrendingUp,
        },
        { to: "/dashboard/cost-drivers", label: "Cost Drivers", icon: Gauge },
        { to: "/dashboard/resources", label: "Resources", icon: Boxes },
        {
          to: "/dashboard/data-quality",
          label: "Data Quality",
          icon: ShieldAlert,
        },
      ],
    },
    {
      title: "FINANCE",
      items: [
        // Updated label from "Accounts" to "Accounts & Ownership"
        {
          to: "/dashboard/accounts",
          label: "Accounts & Ownership",
          icon: Users,
        },
        {
          to: "/dashboard/optimization",
          label: "Optimization",
          icon: Sparkles,
        },
      ],
    },
    {
      title: "REPORTING",
      items: [
        { to: "/dashboard/reports", label: "Reports", icon: FileBarChart },
      ],
    },
  ];

  // 3. Helper for Nav Items
  const NavItem = ({ item }) => (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) => `
        group flex items-center gap-3 px-3 py-2 mb-1 rounded-lg transition-all duration-200 border border-transparent
        ${
          isActive
            ? "bg-[#a02ff1]/10 text-[#a02ff1] border-[#a02ff1]/20 shadow-[0_0_15px_rgba(160,47,241,0.1)]"
            : "text-gray-400 hover:bg-white/5 hover:text-white"
        }
      `}
    >
      <item.icon
        size={16}
        className="group-[.active]:text-[#a02ff1] group-hover:text-white transition-colors"
      />
      <span className="text-sm font-medium">{item.label}</span>
    </NavLink>
  );

  return (
    <div className="fixed top-0 left-0 h-screen w-[240px] bg-[#0f0f11] border-r border-white/5 z-50 flex flex-col">
      {/* --- LOGO SECTION --- */}
      <div className="px-5 py-6 mb-2 flex items-center gap-3">
        <img
          src="/k&cologo.svg"
          alt="K&Co Logo"
          className="w-11 h-11 object-contain"
        />
        <div>
          <h1 className="text-base font-bold text-white tracking-tight leading-none">
            K&Co.
          </h1>
          <p className="text-[10px] text-gray-500 font-mono mt-0.5">
            FINOPS OS v2.4
          </p>
        </div>
      </div>

      {/* --- NAVIGATION LINKS --- */}
      <div className="flex-1 overflow-y-auto px-3 space-y-6 scrollbar-hide">
        {navigationGroups.map((group, index) => (
          <div key={index}>
            {/* Section Header */}
            <p className="px-3 text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-2">
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
      <div className="p-3 mt-auto space-y-3 bg-[#0f0f11] border-t border-white/5">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Upload Widget */}
        <div
          onClick={openFilePicker}
          className="group relative border border-dashed border-gray-700 hover:border-[#a02ff1] rounded-lg p-3 text-center cursor-pointer bg-[#1a1b20]/50 hover:bg-[#a02ff1]/5 transition-all"
        >
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center justify-center gap-2 text-gray-400 group-hover:text-[#a02ff1] transition-colors">
              <UploadIcon size={14} />
              <span className="text-xs font-semibold text-white">
                Upload more data (CSV)
              </span>
            </div>
            <p className="text-[10px] text-gray-500/80">One-time upload</p>
          </div>
          {selectedFileName && (
            <p className="text-[10px] text-gray-400 truncate px-1 mt-2 font-medium">
              {selectedFileName}
            </p>
          )}
        </div>

        {/* Process Upload Button */}
        <button
          type="button"
          onClick={handleProcessUpload}
          disabled={!selectedFile}
          className={`
                w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-xs transition-all
                ${
                  selectedFile
                    ? "bg-[#a02ff1] hover:bg-[#8e25d9] text-white shadow-[0_0_15px_rgba(160,47,241,0.3)]"
                    : "bg-gray-800 text-gray-600 cursor-not-allowed"
                }
            `}
        >
          <Play size={14} fill={selectedFile ? "currentColor" : "none"} />
          <span>Process Upload</span>
        </button>
      </div>
    </div>
  );
};

export default VerticalSidebar;
