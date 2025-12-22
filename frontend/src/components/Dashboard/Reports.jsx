import React, { useMemo } from 'react';
import { FileText, Download, TrendingUp, Target, AlertTriangle, Shield, Calendar, Lock, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);

const Reports = ({ data }) => {
  // Calculate report data from actual data
  const reportData = useMemo(() => {
    if (!data || data.length === 0) return null;

    // Calculate total spend
    const totalSpend = data.reduce((sum, item) => sum + (parseFloat(item.BilledCost) || 0), 0);
    
    // Get billing period (assuming data has dates)
    const dates = data.map(item => item.BillingPeriodStartDate || item.Date).filter(Boolean);
    const period = dates.length > 0 ? dates[0] : new Date().toISOString().split('T')[0];
    
    // Calculate top services
    const serviceSpend = {};
    data.forEach(item => {
      const service = item.ServiceName || 'Unknown';
      const cost = parseFloat(item.BilledCost) || 0;
      serviceSpend[service] = (serviceSpend[service] || 0) + cost;
    });
    const topServices = Object.entries(serviceSpend)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, cost]) => ({ name, cost }));

    // Calculate top regions
    const regionSpend = {};
    data.forEach(item => {
      const region = item.RegionName || 'Unknown';
      const cost = parseFloat(item.BilledCost) || 0;
      regionSpend[region] = (regionSpend[region] || 0) + cost;
    });
    const topRegions = Object.entries(regionSpend)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, cost]) => ({ name, cost }));

    // Mock optimization data (in real app, this would come from Optimization component state)
    const optimizationData = {
      totalPotentialSavings: 11.75,
      highConfidencePercent: 63,
      underReviewPercent: 41,
      idleResources: 3,
      rightSizing: 2,
      commitments: 1
    };

    // Calculate cost concentration
    const topServicePercent = topServices.length > 0 
      ? (topServices[0].cost / totalSpend) * 100 
      : 0;

    // Calculate tagged vs untagged
    const taggedCost = data
      .filter(item => item.Tags && Object.keys(item.Tags).length > 0)
      .reduce((sum, item) => sum + (parseFloat(item.BilledCost) || 0), 0);
    const taggedPercent = totalSpend > 0 ? (taggedCost / totalSpend) * 100 : 0;

    // Calculate prod vs non-prod
    const prodCost = data
      .filter(item => {
        const tags = item.Tags || {};
        const env = tags.Environment || tags.environment || '';
        return env.toLowerCase().includes('prod') || env.toLowerCase().includes('production');
      })
      .reduce((sum, item) => sum + (parseFloat(item.BilledCost) || 0), 0);
    const prodPercent = totalSpend > 0 ? (prodCost / totalSpend) * 100 : 0;

    return {
      period,
      totalSpend,
      topServices,
      topRegions,
      optimizationData,
      topServicePercent,
      taggedPercent,
      prodPercent
    };
  }, [data]);

  if (!reportData) {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center justify-center min-h-[400px] text-gray-500">
          No data available for report generation
        </div>
      </div>
    );
  }

  const generatePDF = (reportType) => {
    // In a real implementation, this would call a backend API to generate PDF
    // For now, we'll show a message
    alert(`Generating ${reportType} PDF report...\n\nIn production, this would:\n1. Call backend API\n2. Generate PDF with report data\n3. Download the file`);
  };

  const formatPeriod = (dateString) => {
    if (!dateString) return 'Current Period';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return 'Current Period';
    }
  };

  const reports = [
    {
      id: 'executive-cost-summary',
      title: 'Executive Cost Summary',
      icon: FileText,
      frequency: 'Monthly / Quarterly',
      period: formatPeriod(reportData.period),
      includes: [
        `Total cloud spend: ${formatCurrency(reportData.totalSpend)}`,
        `Top 3 services: ${reportData.topServices.map(s => s.name).join(', ')}`,
        `Top region: ${reportData.topRegions[0]?.name || 'N/A'}`,
        'Spend trend summary',
        'Budget health assessment',
        'Key takeaways'
      ],
      description: 'Comprehensive overview of cloud spend for leadership decision-making',
      color: 'blue',
      isPremium: false
    },
    {
      id: 'optimization-impact',
      title: 'Optimization Impact Report',
      icon: Target,
      frequency: 'Monthly',
      period: formatPeriod(reportData.period),
      includes: [
        `Total potential savings: ${formatCurrency(reportData.optimizationData.totalPotentialSavings)}/month`,
        `${reportData.optimizationData.highConfidencePercent}% high-confidence recommendations`,
        `${reportData.optimizationData.underReviewPercent}% currently under review`,
        'Idle resources breakdown',
        'Right-sizing opportunities',
        'Commitment coverage analysis'
      ],
      description: 'Shows identified optimization opportunities and their potential impact',
      color: 'green',
      isPremium: true
    },
    {
      id: 'risk-predictability',
      title: 'Risk & Predictability Brief',
      icon: AlertTriangle,
      frequency: 'Monthly',
      period: formatPeriod(reportData.period),
      includes: [
        `Cost concentration: ${reportData.topServicePercent.toFixed(1)}% in top service`,
        'Predictability and volatility analysis',
        'Dependency risk assessment',
        'Vendor concentration signals',
        'Strategic risk indicators'
      ],
      description: 'Strategic insights on cost concentration and dependency risks',
      color: 'yellow',
      isPremium: true
    },
    {
      id: 'governance-accountability',
      title: 'Governance & Accountability Snapshot',
      icon: Shield,
      frequency: 'Quarterly',
      period: formatPeriod(reportData.period),
      includes: [
        `Tagged cost: ${reportData.taggedPercent.toFixed(1)}%`,
        `Production spend: ${reportData.prodPercent.toFixed(1)}%`,
        'Ownership gaps analysis',
        'Policy adherence notes',
        'Accountability mapping'
      ],
      description: 'Governance metrics and accountability tracking for enterprise compliance',
      color: 'purple',
      isPremium: true
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      green: 'bg-green-500/10 border-green-500/30 text-green-400',
      yellow: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
      purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileText size={24} className="text-[#a02ff1]" />
          Executive Reports
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Downloadable PDF reports for leadership and stakeholders
        </p>
      </div>

      {/* Reports Grid */}
      <div className="space-y-4">
        {reports.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative bg-[#1a1b20]/60 backdrop-blur-md border rounded-xl p-6 transition-all ${
              report.isPremium 
                ? 'border-white/5 opacity-60' 
                : 'border-white/5 hover:border-[#a02ff1]/30'
            }`}
          >
            {/* Premium Overlay */}
            {report.isPremium && (
              <div className="absolute inset-0 bg-[#0f0f11]/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                <div className="text-center p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/20 border-2 border-yellow-500/30 mb-4">
                    <Crown size={32} className="text-yellow-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Premium Feature</h3>
                  <p className="text-sm text-gray-400 mb-4 max-w-xs">
                    This report is available in our paid version
                  </p>
                  <button className="px-6 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 text-yellow-400 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 mx-auto">
                    <Lock size={16} />
                    Upgrade to Access
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <div className={`p-3 rounded-lg ${getColorClasses(report.color)}`}>
                  <report.icon size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white">{report.title}</h3>
                    <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">
                      {report.frequency}
                    </span>
                    {report.isPremium && (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded text-xs font-bold flex items-center gap-1">
                        <Crown size={12} />
                        Premium
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mb-4">{report.description}</p>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <Calendar size={14} />
                    <span>Period: {report.period}</span>
                  </div>

                  <div className="bg-[#0f0f11] rounded-lg p-4 border border-white/5">
                    <div className="text-xs text-gray-500 mb-2 font-bold uppercase">Includes</div>
                    <ul className="space-y-1.5">
                      {report.includes.map((item, idx) => (
                        <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-[#a02ff1] mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-white/5">
              {report.isPremium ? (
                <button
                  disabled
                  className="px-6 py-2 bg-white/5 text-gray-500 rounded-lg text-sm font-medium flex items-center gap-2 cursor-not-allowed"
                >
                  <Lock size={16} />
                  Premium Only
                </button>
              ) : (
                <button
                  onClick={() => generatePDF(report.title)}
                  className="px-6 py-2 bg-[#a02ff1] hover:bg-[#8e25d9] text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Download size={16} />
                  Download PDF
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info Note */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FileText size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-blue-400 mb-1">About Executive Reports</div>
            <div className="text-xs text-gray-300 space-y-1">
              <p>• Each report starts with a 1-page Executive Summary</p>
              <p>• Reports are generated as PDFs for easy sharing and presentation</p>
              <p>• All reports use clean typography and section headers for readability</p>
              <p>• Reports consolidate dashboard insights into executive-friendly formats</p>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="mt-12 pt-8 border-t border-white/10">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp size={20} className="text-gray-400" />
            Other Reports
            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full text-xs font-bold">
              Coming Soon
            </span>
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Additional report types are in development
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Departmental Cost Allocation',
              description: 'Breakdown of costs by department, team, or business unit',
              icon: Shield,
              color: 'purple'
            },
            {
              title: 'Forecast & Budget Variance',
              description: 'Projected spend vs budget with variance analysis',
              icon: TrendingUp,
              color: 'blue'
            },
            {
              title: 'Compliance & Audit Report',
              description: 'Policy compliance, tagging adherence, and audit trail',
              icon: FileText,
              color: 'green'
            },
            {
              title: 'Resource Utilization Report',
              description: 'Detailed utilization metrics and efficiency analysis',
              icon: Target,
              color: 'yellow'
            }
          ].map((report, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#1a1b20]/30 backdrop-blur-md border border-white/5 rounded-xl p-5 opacity-60"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${getColorClasses(report.color)} opacity-50`}>
                  <report.icon size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-400 mb-1">{report.title}</h3>
                  <p className="text-xs text-gray-500">{report.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;

