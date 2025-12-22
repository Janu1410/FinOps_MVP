import React, { useState, useMemo } from 'react';
import { 
  Sparkles, TrendingDown, AlertTriangle, CheckCircle2, 
  ChevronDown,
  Zap, Target, AlertCircle, Info, X, Lightbulb,
  Filter, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);

const Optimization = ({ data }) => {
  const [activeTab, setActiveTab] = useState('opportunities');
  const [expandedItems, setExpandedItems] = useState({});
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [idleFilter, setIdleFilter] = useState('all'); // 'all', 'prod', 'non-prod'
  const [idleSort, setIdleSort] = useState('savings-desc'); // 'savings-desc', 'savings-asc', 'days-desc', 'days-asc'
  const [idleSearch, setIdleSearch] = useState('');

  // Process data for optimization insights
  const optimizationData = useMemo(() => {
    if (!data || data.length === 0) return null;

    // 1. Top Optimization Opportunities (Insight Briefs)
    const opportunities = [
      {
        id: 'idle-ec2',
        priority: 'HIGH IMPACT',
        title: 'Idle EC2 Instances',
        savings: 4.20,
        confidence: 'High',
        regions: ['us-east-1', 'us-west-2'],
        description: 'Multiple EC2 instances running with minimal utilization',
        affectedResources: 12,
        evidence: [
          '7 instances running with <1% CPU for >14 days',
          'Mostly non-prod workloads',
          'No network activity detected'
        ],
        resolutionPaths: [
          'Stop outside business hours',
          'Replace with on-demand smaller instance',
          'Decommission if unused'
        ],
        costImpact: {
          current: 4.20,
          optimized: 0.00
        }
      },
      {
        id: 'right-size-compute',
        priority: 'MEDIUM IMPACT',
        title: 'Right-Size Compute Resources',
        savings: 2.85,
        confidence: 'High',
        regions: ['us-east-1'],
        description: 'Instances running at low utilization can be downsized',
        affectedResources: 8,
        evidence: [
          'Average CPU utilization: 12%',
          'Memory usage consistently below 20%',
          'Stable workload pattern over 30 days'
        ],
        resolutionPaths: [
          'Downsize to smaller instance family',
          'Consider burstable instances (t3)',
          'Review during next maintenance window'
        ],
        costImpact: {
          current: 2.85,
          optimized: 0.00
        }
      },
      {
        id: 'unattached-storage',
        priority: 'MEDIUM IMPACT',
        title: 'Unattached EBS Volumes',
        savings: 1.50,
        confidence: 'High',
        regions: ['us-west-2'],
        description: 'EBS volumes not attached to any instance',
        affectedResources: 5,
        evidence: [
          '5 volumes unattached for >30 days',
          'No snapshots created',
          'All in non-prod accounts'
        ],
        resolutionPaths: [
          'Create snapshot if data needed',
          'Delete if no longer required',
          'Review with team before deletion'
        ],
        costImpact: {
          current: 1.50,
          optimized: 0.00
        }
      },
      {
        id: 'reserved-capacity',
        priority: 'LOW IMPACT',
        title: 'Reserved Capacity Opportunities',
        savings: 3.20,
        confidence: 'Medium',
        regions: ['us-east-1', 'eu-west-1'],
        description: 'Consider Reserved Instances for predictable workloads',
        affectedResources: 15,
        evidence: [
          'Consistent usage pattern over 60 days',
          '65% of compute spend is On-Demand',
          'Predictable workload detected'
        ],
        resolutionPaths: [
          'Evaluate Savings Plans for EC2',
          'Consider Reserved Instances for 1-year term',
          'Review commitment coverage strategy'
        ],
        costImpact: {
          current: 3.20,
          optimized: 0.00
        }
      }
    ].sort((a, b) => b.savings - a.savings);

    // 2. Idle/Underutilized Resources (Evidence Rows)
    const idleResources = [
      {
        id: 'i-0a23bc',
        type: 'EC2',
        name: 'i-0a23bc',
        status: 'Running',
        daysIdle: 14,
        utilization: '<1%',
        savings: 0.35,
        risk: 'Non-prod',
        lastActivity: '2024-09-15',
        region: 'us-east-1',
        tags: ['dev', 'testing'],
        costHistory: [0.35, 0.35, 0.35, 0.35],
        whyFlagged: 'Instance running continuously with <1% CPU utilization for 14+ days. No network traffic detected.',
        confidence: 'High', // High / Medium / Low
        utilizationSignal: 'CPU <1%, Memory <5%, Network 0 bytes',
        serviceSpendPercent: 2.5, // % of EC2 spend in region
        regionSpendPercent: 0.8, // % of total region spend
        owner: null, // Could be tagged owner
        typicalResolutionPaths: [
          'Scheduling shutdown outside business hours',
          'Downsizing to burstable instances (t3 family)',
          'Decommissioning after validation with team'
        ]
      },
      {
        id: 'vol-91df',
        type: 'EBS',
        name: 'vol-91df',
        status: 'Unattached',
        daysIdle: 30,
        utilization: 'N/A',
        savings: 0.12,
        risk: 'Non-prod',
        lastActivity: '2024-08-20',
        region: 'us-west-2',
        tags: ['backup', 'old'],
        costHistory: [0.12, 0.12, 0.12, 0.12],
        whyFlagged: 'Volume detached from instance 30 days ago. No snapshots created. Appears to be orphaned.',
        confidence: 'High',
        utilizationSignal: 'Unattached for 30+ days, no I/O activity',
        serviceSpendPercent: 1.2,
        regionSpendPercent: 0.3,
        owner: null,
        typicalResolutionPaths: [
          'Create snapshot if data is needed',
          'Delete volume if no longer required',
          'Review with team before deletion'
        ]
      },
      {
        id: 'lb-prod-3',
        type: 'Load Balancer',
        name: 'lb-prod-3',
        status: 'Active',
        daysIdle: 7,
        utilization: 'No backend traffic',
        savings: 0.45,
        risk: 'Prod',
        lastActivity: '2024-09-22',
        region: 'us-east-1',
        tags: ['production', 'legacy'],
        costHistory: [0.45, 0.45, 0.45, 0.45],
        whyFlagged: 'Load balancer active but no backend traffic for 7 days. Target groups empty or unhealthy.',
        confidence: 'Medium', // Prod resources need review
        utilizationSignal: 'No backend traffic, target groups empty',
        serviceSpendPercent: 3.8,
        regionSpendPercent: 1.2,
        owner: 'platform-team',
        typicalResolutionPaths: [
          'Review target group configuration',
          'Verify if load balancer is still needed',
          'Consider removing if replaced by newer infrastructure'
        ]
      }
    ];

    // 3. Right-Sizing Recommendations
    const rightSizingRecs = [
      {
        id: 'rs-1',
        currentInstance: 'm5.large',
        currentCPU: 12,
        currentCost: 2.10,
        recommendedInstance: 't3.medium',
        recommendedCost: 0.90,
        savings: 1.20,
        riskLevel: 'Low',
        resourceId: 'i-abc123',
        region: 'us-east-1',
        assumptions: [
          'CPU utilization remains below 20%',
          'Memory usage stays under 2GB',
          'Workload pattern remains stable'
        ]
      },
      {
        id: 'rs-2',
        currentInstance: 'c5.xlarge',
        currentCPU: 18,
        currentCost: 3.50,
        recommendedInstance: 'c5.large',
        recommendedCost: 1.75,
        savings: 1.75,
        riskLevel: 'Low',
        resourceId: 'i-def456',
        region: 'us-west-2',
        assumptions: [
          'CPU utilization remains below 25%',
          'Network performance requirements met',
          'No burst capacity needed'
        ]
      }
    ];

    // 4. Commitment Coverage Gaps
    const commitmentGaps = {
      onDemandPercentage: 65,
      totalComputeSpend: 1250.00,
      recommendation: 'Savings Plan for EC2',
      potentialSavings: 1.85,
      predictableWorkload: true,
      workloadPattern: 'Stable compute workload shows consistent usage over 30 days',
      typicalApproach: 'Organizations typically evaluate Savings Plans in such cases'
    };

    // 5. Optimization Status Tracker
    const trackerItems = [
      { id: 'opt-1', title: 'Idle EC2 Cleanup', savings: 4.20, status: 'identified', priority: 'high', detectedDate: '2024-09-25' },
      { id: 'opt-2', title: 'Right-size m5.large', savings: 1.20, status: 'in-review', priority: 'medium', detectedDate: '2024-09-24' },
      { id: 'opt-3', title: 'EBS Volume Cleanup', savings: 1.50, status: 'in-review', priority: 'medium', detectedDate: '2024-09-23' },
      { id: 'opt-4', title: 'Reserved Instance Purchase', savings: 3.20, status: 'optimized', priority: 'low', detectedDate: '2024-09-20', completedDate: '2024-09-22' },
      { id: 'opt-5', title: 'Load Balancer Review', savings: 0.45, status: 'ignored', priority: 'low', detectedDate: '2024-09-21' }
    ];

    return {
      opportunities,
      idleResources,
      rightSizingRecs,
      commitmentGaps,
      trackerItems,
      totalPotentialSavings: opportunities.reduce((sum, opp) => sum + opp.savings, 0)
    };
  }, [data]);

  if (!optimizationData) {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center justify-center min-h-[400px] text-gray-500">
          No optimization data available
        </div>
      </div>
    );
  }

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };



  // Filter and sort idle resources
  const filteredIdleResources = useMemo(() => {
    if (!optimizationData) return [];
    
    let filtered = optimizationData.idleResources;
    
    // Apply search filter
    if (idleSearch) {
      const searchLower = idleSearch.toLowerCase();
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(searchLower) ||
        r.type.toLowerCase().includes(searchLower) ||
        r.region.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply risk filter
    if (idleFilter === 'prod') {
      filtered = filtered.filter(r => r.risk === 'Prod');
    } else if (idleFilter === 'non-prod') {
      filtered = filtered.filter(r => r.risk === 'Non-prod');
    }
    
    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (idleSort) {
        case 'savings-desc':
          return b.savings - a.savings;
        case 'savings-asc':
          return a.savings - b.savings;
        case 'days-desc':
          return b.daysIdle - a.daysIdle;
        case 'days-asc':
          return a.daysIdle - b.daysIdle;
        default:
          return 0;
      }
    });
    
    return sorted;
  }, [optimizationData, idleFilter, idleSort, idleSearch]);

  const getStatusColor = (status) => {
    const colors = {
      'identified': 'bg-gray-700',
      'in-review': 'bg-blue-600',
      'optimized': 'bg-green-600',
      'ignored': 'bg-gray-600'
    };
    return colors[status] || colors['identified'];
  };

  const getPriorityColor = (priority) => {
    if (priority === 'HIGH IMPACT') return 'text-red-400 bg-red-400/10 border-red-400/30';
    if (priority === 'MEDIUM IMPACT') return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
    return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles size={24} className="text-[#a02ff1]" />
            Optimization Insights
          </h1>
          <p className="text-sm text-gray-400 mt-1 italic">
            Decision-support intelligence. No actions are executed from this platform.
          </p>
          <div className="mt-2">
            <p className="text-sm text-gray-400">
              Total Potential Savings: <span className="text-green-400 font-bold">{formatCurrency(optimizationData.totalPotentialSavings)}/month</span>
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-white/5">
        {[
          { id: 'opportunities', label: 'Top Opportunities', icon: Target },
          { id: 'idle', label: 'Idle Resources', icon: Zap },
          { id: 'rightsizing', label: 'Right-Sizing', icon: TrendingDown },
          { id: 'commitments', label: 'Commitments', icon: AlertCircle },
          { id: 'tracker', label: 'Optimization Posture', icon: CheckCircle2 }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-[#a02ff1] text-[#a02ff1]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon size={16} />
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* 1. TOP OPTIMIZATION OPPORTUNITIES - Insight Briefs */}
        {activeTab === 'opportunities' && (
          <motion.div
            key="opportunities"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {optimizationData.opportunities.map((opp, index) => (
              <motion.div
                key={opp.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1a1b20]/60 backdrop-blur-md border border-white/5 rounded-xl p-6 hover:border-[#a02ff1]/30 transition-all cursor-pointer"
                onClick={() => setSelectedInsight(opp)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(opp.priority)}`}>
                        {opp.priority}
                      </span>
                      <h3 className="text-lg font-bold text-white">{opp.title}</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">{opp.description}</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Estimated Monthly Savings</div>
                        <div className="text-xl font-bold text-green-400">{formatCurrency(opp.savings)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Confidence</div>
                        <div className="text-sm font-semibold text-white">{opp.confidence}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Affected Regions</div>
                        <div className="text-sm text-gray-300">{opp.regions.join(', ')}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                  <Info size={14} className="text-gray-500" />
                  <span className="text-xs text-gray-500">Click to view detailed insight</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* 2. IDLE / UNDERUTILIZED RESOURCES - Clickable Evidence Rows */}
        {activeTab === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Toolbar: Filters, Search */}
            <div className="bg-[#1a1b20]/60 backdrop-blur-md border border-white/5 rounded-lg p-4">
              <div className="flex flex-wrap items-center gap-4">
                {/* Search */}
                <div className="flex-1 min-w-[200px] relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search resources..."
                    value={idleSearch}
                    onChange={(e) => setIdleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#0f0f11] border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#a02ff1]"
                  />
                </div>
                
                {/* Filter by Risk */}
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-gray-400" />
                  <select
                    value={idleFilter}
                    onChange={(e) => setIdleFilter(e.target.value)}
                    className="px-3 py-2 bg-[#0f0f11] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#a02ff1]"
                  >
                    <option value="all">All Resources</option>
                    <option value="prod">Production Only</option>
                    <option value="non-prod">Non-Production Only</option>
                  </select>
                </div>
                
                {/* Sort */}
                <div className="flex items-center gap-2">
                  <select
                    value={idleSort}
                    onChange={(e) => setIdleSort(e.target.value)}
                    className="px-3 py-2 bg-[#0f0f11] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#a02ff1]"
                  >
                    <option value="savings-desc">Savings: High to Low</option>
                    <option value="savings-asc">Savings: Low to High</option>
                    <option value="days-desc">Days Idle: Most</option>
                    <option value="days-asc">Days Idle: Least</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Resources List */}
            <div className="space-y-3">
              {filteredIdleResources.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No resources found matching your filters.
                </div>
              ) : (
                filteredIdleResources.map((resource) => (
              <div
                key={resource.id}
                className="bg-[#1a1b20]/60 backdrop-blur-md border border-white/5 rounded-lg p-4 transition-all hover:border-[#a02ff1]/30 cursor-pointer"
                onClick={() => toggleExpand(resource.id)}
              >
                <div className="flex items-center gap-3">
                  <ChevronDown 
                    size={16} 
                    className={`text-gray-400 transition-transform ${expandedItems[resource.id] ? 'rotate-180' : ''}`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-white">{resource.type} {resource.name}</span>
                      {/* Confidence Indicator */}
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        resource.confidence === 'High'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : resource.confidence === 'Medium'
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {resource.confidence === 'High' ? '🟢' : resource.confidence === 'Medium' ? '🟡' : '🔴'} {resource.confidence} confidence
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        resource.risk === 'Prod' 
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {resource.risk}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {resource.status} • {resource.daysIdle} days idle • {resource.utilization} utilization
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-400">{formatCurrency(resource.savings)}/mo</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Click to expand
                    </div>
                  </div>
                </div>
                
                <AnimatePresence>
                  {expandedItems[resource.id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 pt-4 border-t border-white/5 space-y-4"
                    >
                      {/* Why Flagged */}
                      <div>
                        <div className="text-xs text-gray-500 mb-2 font-bold uppercase">Why This Resource Is Classified as Idle</div>
                        <div className="text-sm text-gray-300">{resource.whyFlagged}</div>
                      </div>
                      
                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Duration of Inactivity</div>
                          <div className="text-sm text-white font-semibold">{resource.daysIdle} days</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Estimated Monthly Waste</div>
                          <div className="text-sm text-green-400 font-semibold">{formatCurrency(resource.savings)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Confidence Level</div>
                          <div className="text-sm text-white">
                            {resource.confidence === 'High' ? '🟢' : resource.confidence === 'Medium' ? '🟡' : '🔴'} {resource.confidence}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Risk Note</div>
                          <div className="text-sm text-white">{resource.risk} Environment</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Last Activity</div>
                          <div className="text-sm text-white">{resource.lastActivity}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Region</div>
                          <div className="text-sm text-white">{resource.region}</div>
                        </div>
                      </div>
                      
                      {/* Common Actions */}
                      <div className="bg-[#0f0f11] rounded-lg p-4 border border-white/5">
                        <div className="text-xs text-gray-500 mb-3 font-bold uppercase">Common Actions Teams Usually Take</div>
                        <ul className="space-y-2">
                          {resource.typicalResolutionPaths?.map((action, idx) => (
                            <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                              <span className="text-[#a02ff1] mt-1">•</span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
              </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* 3. RIGHT-SIZING RECOMMENDATIONS - What-if Comparison (Read-only) */}
        {activeTab === 'rightsizing' && (
          <motion.div
            key="rightsizing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {optimizationData.rightSizingRecs.map((rec) => (
              <div
                key={rec.id}
                className="bg-[#1a1b20]/60 backdrop-blur-md border border-white/5 rounded-xl p-6 hover:border-[#a02ff1]/30 transition-all cursor-pointer"
                onClick={() => setSelectedInsight({ ...rec, type: 'rightsizing' })}
              >
                <div className="grid grid-cols-2 gap-6 mb-6">
                  {/* CURRENT */}
                  <div className="bg-[#0f0f11] rounded-lg p-4 border border-white/5">
                    <div className="text-xs text-gray-500 mb-3 font-bold uppercase">Current</div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-xs text-gray-500">Instance</div>
                        <div className="text-sm font-semibold text-white">{rec.currentInstance}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Avg CPU</div>
                        <div className="text-sm font-semibold text-white">{rec.currentCPU}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Monthly Cost</div>
                        <div className="text-lg font-bold text-white">{formatCurrency(rec.currentCost)}</div>
                      </div>
                    </div>
                  </div>

                  {/* RECOMMENDED */}
                  <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                    <div className="text-xs text-green-400 mb-3 font-bold uppercase">Recommended</div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-xs text-gray-500">Instance</div>
                        <div className="text-sm font-semibold text-green-400">{rec.recommendedInstance}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Expected Cost</div>
                        <div className="text-lg font-bold text-green-400">{formatCurrency(rec.recommendedCost)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Estimated Savings</div>
                    <div className="text-xl font-bold text-green-400">{formatCurrency(rec.savings)}/month</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Risk Level: <span className={`font-medium ${
                        rec.riskLevel === 'Low' ? 'text-green-400' : 'text-yellow-400'
                      }`}>{rec.riskLevel}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Info size={14} />
                    <span>Click card to view detailed comparison</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="text-xs text-gray-400">
                    <span className="font-semibold">Note:</span> Recommendations require implementation through your cloud provider's management console or infrastructure automation tools.
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* 4. COMMITMENT COVERAGE GAPS - Advisory Notices */}
        {activeTab === 'commitments' && (
          <motion.div
            key="commitments"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <Info size={24} className="text-blue-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-blue-400">Commitment Opportunity Detected</h3>
                  </div>
                  <p className="text-sm text-gray-300 mb-4">
                    {optimizationData.commitmentGaps.workloadPattern}
                  </p>
                  
                  <div className="bg-[#0f0f11] rounded-lg p-4 mb-4 border border-white/5">
                    <div className="text-xs text-gray-500 mb-2 font-bold uppercase">📘 Recommendation</div>
                    <div className="text-sm text-white mb-2">
                      {optimizationData.commitmentGaps.typicalApproach}
                    </div>
                    <div className="text-sm">
                      Consider {optimizationData.commitmentGaps.recommendation}
                    </div>
                    <div className="text-sm mt-2">
                      Potential savings: <span className="text-green-400 font-bold">{formatCurrency(optimizationData.commitmentGaps.potentialSavings)}/month</span>
                    </div>
                  </div>

                  <div className="bg-[#0f0f11] rounded-lg p-4 border border-white/5">
                    <div className="text-xs text-gray-500 mb-2 font-bold uppercase">🧠 Insight</div>
                    <div className="text-sm text-gray-300">
                      {optimizationData.commitmentGaps.onDemandPercentage}% of compute spend is On-Demand. 
                      Organizations typically evaluate commitment strategies when predictable workloads exceed 50% of spend.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 5. OPTIMIZATION POSTURE - Read-only Status Distribution */}
        {activeTab === 'tracker' && (
          <motion.div
            key="tracker"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="text-xs text-blue-400 font-semibold mb-1">Optimization Posture</div>
              <div className="text-sm text-gray-300">
                Status reflects external review and decisions, not system actions. This view shows the distribution of optimization outcomes.
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[
                { key: 'identified', label: 'Identified' },
                { key: 'in-review', label: 'Under Review' },
                { key: 'optimized', label: 'Confirmed Optimized' },
                { key: 'ignored', label: 'Explicitly Ignored' }
              ].map(({ key, label }) => {
                const statusItems = optimizationData.trackerItems.filter(
                  item => item.status === key
                );
                
                return (
                  <div key={key} className="bg-[#1a1b20]/60 backdrop-blur-md border border-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(key)}`} />
                      <h3 className="text-sm font-bold text-white">{label}</h3>
                      <span className="ml-auto text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded">
                        {statusItems.length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {statusItems.length === 0 ? (
                        <div className="text-xs text-gray-500 text-center py-4">No items</div>
                      ) : (
                        statusItems.map((item) => (
                          <div
                            key={item.id}
                            className="bg-[#0f0f11] border border-white/5 rounded-lg p-3"
                          >
                            <div className="text-xs font-semibold text-white mb-1">{item.title}</div>
                            <div className="text-xs text-green-400 font-bold mb-2">
                              {formatCurrency(item.savings)}/mo
                            </div>
                            <div className="text-[10px] text-gray-500 mb-1">
                              Detection: {item.detectedDate}
                            </div>
                            {item.completedDate && (
                              <div className="text-[10px] text-gray-500 mb-1">
                                Completed: {item.completedDate}
                              </div>
                            )}
                            <div className="mt-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                                item.priority === 'high' 
                                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                  : item.priority === 'medium'
                                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                              }`}>
                                {item.priority} priority
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Insight Modal/Drawer */}
      <AnimatePresence>
        {selectedInsight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedInsight(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1a1b20] border border-white/10 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Lightbulb size={20} className="text-[#a02ff1]" />
                  {selectedInsight.title || 'Insight Details'}
                </h2>
                <button
                  onClick={() => setSelectedInsight(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {selectedInsight.type === 'combined-insight' ? (
                <div className="space-y-4">
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <div className="text-xs text-blue-400 font-bold mb-2 uppercase">Investigation Summary</div>
                    <div className="text-sm text-gray-300 mb-3">{selectedInsight.summary}</div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Resources in Investigation</div>
                        <div className="text-white font-bold">{selectedInsight.selectedCount}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Total Monthly Cost</div>
                        <div className="text-green-400 font-bold">{formatCurrency(selectedInsight.totalSavings)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Oldest Idle Resource</div>
                        <div className="text-white font-bold">{selectedInsight.oldestIdle} days</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Services Involved</div>
                        <div className="text-white font-bold">{selectedInsight.services.join(', ')}</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-2 font-bold uppercase">Environments Affected</div>
                    <div className="flex gap-2">
                      {selectedInsight.environments.map(env => (
                        <span key={env} className={`px-2 py-1 rounded text-xs font-medium ${
                          env === 'Prod' 
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {env}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-2 font-bold uppercase">Regions</div>
                    <div className="text-sm text-white">{selectedInsight.regions.join(', ')}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-2 font-bold uppercase">Resources in Investigation</div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {selectedInsight.resources.map((r) => (
                        <div key={r.id} className="bg-[#0f0f11] rounded p-3 text-xs border border-white/5">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white font-semibold">{r.type} {r.name}</span>
                            <span className="text-green-400 font-bold">{formatCurrency(r.savings)}/mo</span>
                          </div>
                          <div className="text-gray-400">{r.region} • {r.daysIdle} days idle • {r.confidence} confidence</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : selectedInsight.type === 'report-preview' ? (
                <div className="space-y-4">
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <div className="text-xs text-blue-400 font-bold mb-2 uppercase">Report Summary</div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Resources Selected</div>
                        <div className="text-white font-bold">{selectedInsight.selectedCount}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Total Potential Savings</div>
                        <div className="text-green-400 font-bold">{formatCurrency(selectedInsight.totalSavings)}/month</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Production Resources</div>
                        <div className="text-red-400 font-bold">{selectedInsight.prodCount}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Non-Production Resources</div>
                        <div className="text-yellow-400 font-bold">{selectedInsight.nonProdCount}</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-2 font-bold uppercase">Selected Resources</div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {selectedInsight.resources.map((r) => (
                        <div key={r.id} className="bg-[#0f0f11] rounded p-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-white font-semibold">{r.type} {r.name}</span>
                            <span className="text-green-400">{formatCurrency(r.savings)}/mo</span>
                          </div>
                          <div className="text-gray-400 mt-1">{r.region} • {r.daysIdle} days idle</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <div className="text-xs text-yellow-400 font-bold mb-2">💡 Report Generation</div>
                    <div className="text-sm text-gray-300">
                      This preview shows what would be included in a comprehensive optimization report. 
                      Full report generation will be available in the Reporting section.
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      // In future, this could navigate to reporting section
                      alert('Full report generation will be available in the Reporting section.');
                    }}
                    className="w-full px-4 py-2 bg-[#a02ff1] hover:bg-[#8e25d9] text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Generate Full Report (Coming Soon)
                  </button>
                </div>
              ) : selectedInsight.type === 'rightsizing' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0f0f11] rounded-lg p-4 border border-white/5">
                      <div className="text-xs text-gray-500 mb-2">Current Monthly Cost</div>
                      <div className="text-2xl font-bold text-white">{formatCurrency(selectedInsight.currentCost)}</div>
                    </div>
                    <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                      <div className="text-xs text-gray-500 mb-2">Estimated Optimized Cost</div>
                      <div className="text-2xl font-bold text-green-400">{formatCurrency(selectedInsight.recommendedCost)}</div>
                    </div>
                  </div>
                  <div className="bg-[#0f0f11] rounded-lg p-4 border border-white/5">
                    <div className="text-xs text-gray-500 mb-2 font-bold uppercase">Assumptions Used</div>
                    <ul className="space-y-1 text-sm text-gray-300">
                      {selectedInsight.assumptions?.map((assumption, idx) => (
                        <li key={idx}>• {assumption}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/30">
                    <div className="text-xs text-yellow-400 font-bold mb-2">Risk Explanation</div>
                    <div className="text-sm text-gray-300">
                      Risk Level: <span className="font-semibold text-green-400">{selectedInsight.riskLevel}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      This recommendation is based on historical utilization patterns. Actual performance may vary.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-2 font-bold uppercase">📌 What is Detected</div>
                    <div className="text-sm text-white">{selectedInsight.description}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-2 font-bold uppercase">🔍 Evidence (Data Signals)</div>
                    <ul className="space-y-1 text-sm text-gray-300">
                      {selectedInsight.evidence?.map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0f0f11] rounded-lg p-4 border border-white/5">
                      <div className="text-xs text-gray-500 mb-1">Current Cost Impact</div>
                      <div className="text-lg font-bold text-white">{formatCurrency(selectedInsight.costImpact?.current || selectedInsight.savings)}/mo</div>
                    </div>
                    <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                      <div className="text-xs text-gray-500 mb-1">Optimized Cost Impact</div>
                      <div className="text-lg font-bold text-green-400">{formatCurrency(selectedInsight.costImpact?.optimized || 0)}/mo</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-2 font-bold uppercase">🧠 Typical Resolution Paths</div>
                    <div className="text-xs text-gray-400 mb-2 italic">Common approaches teams use to address this:</div>
                    <ul className="space-y-1 text-sm text-gray-300">
                      {selectedInsight.resolutionPaths?.map((path, idx) => (
                        <li key={idx}>• {path}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-white/5">
                <div className="text-xs text-gray-400">
                  <span className="font-semibold">Implementation:</span> All recommendations require execution through your cloud provider's management console or approved infrastructure automation workflows.
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resource Evidence Side Panel */}
      <AnimatePresence>
        {selectedResource && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedResource(null)}
          >
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              className="bg-[#1a1b20] border border-white/10 rounded-xl p-6 w-full max-w-md h-[90vh] overflow-y-auto ml-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">{selectedResource.type} {selectedResource.name}</h2>
                <button
                  onClick={() => setSelectedResource(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Section 1: Why it's flagged */}
                <div>
                  <div className="text-xs text-gray-500 mb-3 font-bold uppercase">Why It's Flagged</div>
                  <div className="bg-[#0f0f11] rounded-lg p-4 border border-white/5 space-y-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Idle Duration</div>
                      <div className="text-sm text-white font-semibold">{selectedResource.daysIdle} days</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Utilization Signal Used</div>
                      <div className="text-sm text-gray-300">{selectedResource.utilizationSignal || selectedResource.utilization}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Confidence Level</div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          selectedResource.confidence === 'High'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : selectedResource.confidence === 'Medium'
                            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {selectedResource.confidence === 'High' ? '🟢' : selectedResource.confidence === 'Medium' ? '🟡' : '🔴'} {selectedResource.confidence}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Details</div>
                      <div className="text-sm text-gray-300">{selectedResource.whyFlagged}</div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Cost Context */}
                <div>
                  <div className="text-xs text-gray-500 mb-3 font-bold uppercase">Cost Context</div>
                  <div className="bg-[#0f0f11] rounded-lg p-4 border border-white/5 space-y-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Monthly Cost</div>
                      <div className="text-lg font-bold text-green-400">{formatCurrency(selectedResource.savings)}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">% of {selectedResource.type} Spend</div>
                        <div className="text-sm text-white">{selectedResource.serviceSpendPercent || 'N/A'}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">% of Region Spend</div>
                        <div className="text-sm text-white">{selectedResource.regionSpendPercent || 'N/A'}%</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-2">Cost History (Last 4 Months)</div>
                      <div className="flex items-end gap-2 h-16">
                        {selectedResource.costHistory?.map((cost, idx) => (
                          <div key={idx} className="flex-1 flex flex-col items-center">
                            <div 
                              className="w-full bg-green-500/30 rounded-t"
                              style={{ height: `${(cost / Math.max(...selectedResource.costHistory)) * 100}%` }}
                            />
                            <div className="text-[10px] text-gray-500 mt-1">{formatCurrency(cost)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Typical Resolution Paths */}
                <div>
                  <div className="text-xs text-gray-500 mb-3 font-bold uppercase">Typical Resolution Paths</div>
                  <div className="bg-[#0f0f11] rounded-lg p-4 border border-white/5">
                    <div className="text-xs text-gray-400 mb-2 italic">Teams usually resolve this by:</div>
                    <ul className="space-y-2">
                      {selectedResource.typicalResolutionPaths?.map((path, idx) => (
                        <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-[#a02ff1] mt-1">•</span>
                          <span>{path}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Section 4: Risk Notes */}
                <div>
                  <div className="text-xs text-gray-500 mb-3 font-bold uppercase">Risk Notes</div>
                  <div className="bg-[#0f0f11] rounded-lg p-4 border border-white/5 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Environment</div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          selectedResource.risk === 'Prod' 
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {selectedResource.risk}
                        </span>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Tagged Owner</div>
                        <div className="text-sm text-white">{selectedResource.owner || 'Not assigned'}</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Last Activity Timestamp</div>
                      <div className="text-sm text-white">{selectedResource.lastActivity}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Region</div>
                      <div className="text-sm text-white">{selectedResource.region}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Tags</div>
                      <div className="flex flex-wrap gap-1">
                        {selectedResource.tags?.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-white/5 rounded text-xs text-gray-300">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Optimization;
