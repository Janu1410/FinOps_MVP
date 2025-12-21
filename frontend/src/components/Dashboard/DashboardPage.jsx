import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

// Layout Components
import VerticalSidebar from "./VerticalSidebar";
import Header from "./Header";

// Sub-Page Components
import Overview from "./Overview";
import DataExplorer from "./DataExplorer";
import CostAnalysis from "./CostAnalysis";
import CostDrivers from "./CostDrivers";
import ResourceInventory from "./ResourceInventory";
import DataQuality from "./DataQuality";

const DashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. DATA LOADING ---
  useEffect(() => {
    const storedRaw = localStorage.getItem("rawRecords");
    if (storedRaw) {
      try {
        const parsed = JSON.parse(storedRaw);
        let cleanData = [];
        if (Array.isArray(parsed)) {
          cleanData = parsed;
        } else if (parsed && typeof parsed === "object") {
          if (parsed.data && Array.isArray(parsed.data))
            cleanData = parsed.data;
          else if (parsed.records && Array.isArray(parsed.records))
            cleanData = parsed.records;
          else cleanData = Object.values(parsed);
        }

        if (cleanData.length > 0) {
          setRawData(cleanData);
          setLoading(false);
        } else {
          console.warn("Data found but empty");
          navigate("/upload");
        }
      } catch (e) {
        console.error("Failed to parse data:", e);
        navigate("/upload");
      }
    } else {
      navigate("/upload");
    }
  }, [navigate]);

  // --- 2. GLOBAL ANOMALY CHECK (For Header) ---
  const anomalyInfo = useMemo(() => {
    if (!rawData.length) return { list: [], count: 0 };

    // Quick anomaly detection logic for the Header notification bell
    const costs = rawData.map((item) => parseFloat(item.BilledCost) || 0);
    const avg = costs.reduce((a, b) => a + b, 0) / (costs.length || 1);

    // Simple variance calculation
    const variance =
      costs.reduce((sum, cost) => sum + Math.pow(cost - avg, 2), 0) /
      costs.length;
    const stdDev = Math.sqrt(variance);
    const threshold = avg + 2 * stdDev;

    const anomalies = rawData
      .map((item, index) => ({
        ...item,
        cost: parseFloat(item.BilledCost) || 0,
        index,
      }))
      .filter((item) => item.cost > threshold)
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 10);

    return { list: anomalies, count: anomalies.length };
  }, [rawData]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#0f0f11] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#a02ff1]" />
      </div>
    );

  // --- ROUTING LOGIC ---
  const isDataExplorer = location.pathname.includes("/data-explorer");
  const isCostAnalysis = location.pathname.includes("/cost-analysis");
  const isCostDrivers = location.pathname.includes("/cost-drivers");
  const isResources = location.pathname.includes("/resources"); // ✅ Route Check
  const isDataQuality = location.pathname.includes("/data-quality");

  // Dynamic Header Title
  const getPageTitle = () => {
    if (isDataExplorer) return "Data Explorer";
    if (isCostAnalysis) return "Cost Analysis";
    if (isCostDrivers) return "Cost Drivers";
    if (isResources) return "Resource Inventory"; // ✅ Title Update
    if (isDataQuality) return "Data Quality Hub";
    return "Cost Overview";
  };

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white font-sans">
      <VerticalSidebar />
      <Header
        title={getPageTitle()}
        anomalies={anomalyInfo.list}
        anomaliesCount={anomalyInfo.count}
      />

      <main className="ml-[240px] pt-[64px] min-h-screen relative">
        <div className="p-6 space-y-4 max-w-[1920px] mx-auto h-full">
          <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none -z-10 ml-[240px] mt-[64px]" />

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

          {/* 4. RESOURCE INVENTORY VIEW (Added) */}
          {isResources && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <ResourceInventory data={rawData} />
            </div>
          )}
          {isDataQuality && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <DataQuality data={rawData} />
            </div>
          )}

          {/* 5. OVERVIEW VIEW (Default) */}
          {!isDataExplorer &&
            !isCostAnalysis &&
            !isCostDrivers &&
            !isResources && 
            !isDataQuality && <Overview data={rawData} />}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
