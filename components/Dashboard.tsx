import React, { useState } from 'react';
import { 
  FileText, Code2, ShieldCheck, BarChart2, GitBranch, ArrowRight, Activity, 
  Clock, Database, Layers, Cpu, Plus, Play, Trash2, Eye, AlertCircle, 
  CheckCircle, Archive, RotateCcw, Filter, ListFilter, Calendar, Search, 
  MoreVertical, ChevronRight, ExternalLink, Github, Box, X, Bot
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Types & Enums ---

export enum FeatureStatus {
  READY_FOR_STATIC_ANALYSIS = 'Ready for Static Code Analysis',
  STATIC_ANALYSIS_FAILED = 'Static Code Analysis Failed',
  STATIC_ANALYSIS_PASSED = 'Static Code Analysis Passed',
  UNIT_TESTING_FAILED = 'Unit Testing Failed',
  UNIT_TESTING_PASSED = 'Unit Testing Passed',
  INTEGRATION_FAILED = 'Integration Failed',
  INTEGRATION_COMPLETE = 'Integration Complete',
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  status: FeatureStatus;
  branchName: string;
  repository: string;
  checks: string; // e.g. "6 / 6"
  coverage: string; // e.g. "88% / 92%"
  lastUpdated: string;
}

// --- Components ---

const StatCard: React.FC<{ icon: React.ReactNode; value: string | number; label: string; iconBgClass?: string; iconColorClass?: string }> = ({ icon, value, label, iconBgClass = 'bg-blue-50', iconColorClass = 'text-blue-500' }) => (
  <div className="bg-white p-5 rounded-2xl border border-gray-200 flex items-center justify-between">
    <div className="flex flex-col gap-1">
      <div className="text-xs font-semibold text-gray-500">{label}</div>
      <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
    </div>
    <div className={`w-10 h-10 ${iconBgClass} ${iconColorClass} rounded-xl flex items-center justify-center`}>
      {icon}
    </div>
  </div>
);

const StatusBadge: React.FC<{ status: FeatureStatus }> = ({ status }) => {
  let colorClass = 'bg-gray-100 text-gray-800';
  let icon = <Activity size={12} />;

  switch (status) {
    case FeatureStatus.READY_FOR_STATIC_ANALYSIS:
      colorClass = 'bg-indigo-50 text-indigo-700 border border-indigo-100';
      break;
    case FeatureStatus.STATIC_ANALYSIS_FAILED:
    case FeatureStatus.UNIT_TESTING_FAILED:
    case FeatureStatus.INTEGRATION_FAILED:
      colorClass = 'bg-red-50 text-red-700 border border-red-100';
      icon = <AlertCircle size={12} />;
      break;
    case FeatureStatus.STATIC_ANALYSIS_PASSED:
    case FeatureStatus.UNIT_TESTING_PASSED:
      colorClass = 'bg-blue-50 text-blue-700 border border-blue-100';
      icon = <ArrowRight size={12} />;
      break;
    case FeatureStatus.INTEGRATION_COMPLETE:
      colorClass = 'bg-emerald-50 text-emerald-700 border border-emerald-100';
      icon = <CheckCircle size={12} />;
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${colorClass}`}>
      {icon}
      {status}
    </span>
  );
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'sessions' | 'work-items'>('sessions');
  const [features, setFeatures] = useState<Feature[]>([
    { 
      id: '1', 
      name: 'MonEmmBatTm', 
      description: 'Monitors the battery system for critical errors and ensures a "Safe State" is requested if a persistent fault is detected.',
      branchName: 'feat/battery-monitor', 
      repository: 'MonEmmBatTm',
      status: FeatureStatus.READY_FOR_STATIC_ANALYSIS, 
      checks: '6 / 6',
      coverage: '88% / 92%',
      lastUpdated: '2 mins ago' 
    },
    { 
      id: '2', 
      name: 'DcpChassis', 
      description: 'Processes signals related to vehicle dynamics, such as wheel speeds, steering angles, torque requests, and ESP status.',
      branchName: 'feat/chassis-control', 
      repository: 'DcpChassis',
      status: FeatureStatus.STATIC_ANALYSIS_FAILED, 
      checks: '4 / 6',
      coverage: '72% / 85%',
      lastUpdated: '1 hour ago' 
    },
    { 
      id: '3', 
      name: 'DtrTqshRbs', 
      description: 'Torque request processing and robustness.',
      branchName: 'feat/torque-robustness', 
      repository: 'DtrTqshRbs',
      status: FeatureStatus.UNIT_TESTING_PASSED, 
      checks: '6 / 6',
      coverage: '95% / 95%',
      lastUpdated: '3 hours ago' 
    },
    { 
      id: '4', 
      name: 'SrsVReqVmsl', 
      description: 'Vehicle requirement and speed limit processing.',
      branchName: 'feat/speed-limit', 
      repository: 'SrsVReqVmsl',
      status: FeatureStatus.INTEGRATION_COMPLETE, 
      checks: '6 / 6',
      coverage: '98% / 98%',
      lastUpdated: 'Yesterday' 
    },
  ]);

  // Panel State (replaces modal)
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelView, setPanelView] = useState<'new-module' | 'reports'>('new-module');
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [newFeature, setNewFeature] = useState({
    name: '',
    description: '',
    ecuTarget: 'powertrain',
    repository: 'MonEmmBatTm',
    branch: '',
    baseBranch: 'develop'
  });

  const handleAddFeature = () => {
    const feature: Feature = {
      id: Date.now().toString(),
      name: newFeature.name,
      description: newFeature.description,
      branchName: newFeature.branch,
      repository: newFeature.repository,
      status: FeatureStatus.READY_FOR_STATIC_ANALYSIS,
      checks: '0 / 6',
      coverage: '0 / 0',
      lastUpdated: 'Just now',
    };
    setFeatures([feature, ...features]);
    setIsPanelOpen(false);
    setModalStep(1);
    setNewFeature({ name: '', description: '', ecuTarget: 'powertrain', repository: 'MonEmmBatTm', branch: '', baseBranch: 'develop' });
  };

  const handleDeleteFeature = (id: string) => {
    if (window.confirm("Are you sure you want to delete this feature? This action cannot be undone.")) {
      setFeatures(features.filter(f => f.id !== id));
    }
  };

  const renderActions = (feature: Feature) => {
    return (
      <div className="flex items-center justify-end gap-1">
        {feature.status === FeatureStatus.READY_FOR_STATIC_ANALYSIS && (
          <button onClick={() => navigate(`/workflow/${feature.id}`)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Start V-Cycle">
            <Play size={18} />
          </button>
        )}
        {(feature.status === FeatureStatus.STATIC_ANALYSIS_FAILED || feature.status === FeatureStatus.UNIT_TESTING_FAILED || feature.status === FeatureStatus.INTEGRATION_FAILED) && (
          <button onClick={() => navigate(`/workflow/${feature.id}`)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Retry / Fix">
            <RotateCcw size={18} />
          </button>
        )}
        {feature.status === FeatureStatus.INTEGRATION_COMPLETE && (
          <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="View Final Report">
            <FileText size={18} />
          </button>
        )}
        <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical size={18} />
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-12 w-full h-full overflow-y-auto relative">
      <div className="flex items-center justify-between mt-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">V-Cycle AI Orchestrator</h1>
        </div>
        {/* 3-dot menu */}
        <div className="relative">
          <button
            id="header-menu-btn"
            onClick={() => setHeaderMenuOpen(v => !v)}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="More actions"
          >
            <MoreVertical size={20} />
          </button>
          {headerMenuOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setHeaderMenuOpen(false)} />
              <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-40 overflow-hidden">
                <button
                  onClick={() => { setPanelView('new-module'); setIsPanelOpen(true); setHeaderMenuOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2.5"
                >
                  <Plus size={14} className="text-indigo-600" />
                  New Module
                </button>
                <button
                  onClick={() => { setPanelView('reports'); setIsPanelOpen(true); setHeaderMenuOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2.5"
                >
                  <FileText size={14} className="text-gray-500" />
                  View Reports
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={<Activity size={20} />} value={features.length} label="Active Modules" iconBgClass="bg-blue-50 text-blue-500" />
        <StatCard icon={<Bot size={20} />} value="7 / 7" label="Specialist Agents Online" iconBgClass="bg-emerald-50 text-emerald-500" />
        <StatCard icon={<ShieldCheck size={20} />} value="84%" label="Avg Preflight Score" iconBgClass="bg-purple-50 text-purple-500" />
        <StatCard icon={<Github size={20} />} value={12} label="GitHub Syncs" iconBgClass="bg-amber-50 text-amber-500" />
      </div>

      {/* Tabs & Filters */}
      <div className="space-y-4">
        <div className="flex items-center border-b border-gray-200 gap-6">
          <button 
            onClick={() => setActiveTab('sessions')}
            className={`py-3 text-[13px] font-bold transition-all relative ${
              activeTab === 'sessions' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Modules
            <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[10px] ${activeTab === 'sessions' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>{features.length}</span>
          </button>
          <button 
            onClick={() => setActiveTab('work-items')}
            className={`py-3 text-[13px] font-bold transition-all relative ${
              activeTab === 'work-items' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Validation Tasks
            <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[10px] ${activeTab === 'work-items' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>0</span>
          </button>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FAFC] border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
              <ListFilter size={14} className="text-gray-400" />
              Filter
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FAFC] border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
              <Activity size={14} className="text-gray-400" />
              Sort
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FAFC] border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
              <Calendar size={14} className="text-gray-400" />
              Last 30 Days
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 w-64"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      {activeTab === 'sessions' ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-[0px_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-gray-600 text-xs font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-3.5">Module</th>
                <th className="px-6 py-3.5">Repository & Branch</th>
                <th className="px-6 py-3.5">Quality Checks</th>
                <th className="px-6 py-3.5">Coverage</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {features.map((feature) => (
                <tr key={feature.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 text-[13px]">{feature.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5 max-w-[200px] truncate" title={feature.description}>{feature.description}</div>
                    <div className="flex items-center gap-1 text-[11px] text-gray-400 font-medium mt-1">
                      <Clock size={10} /> {feature.lastUpdated}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5 align-start justify-center">
                      <span className="text-xs text-gray-700 flex items-center gap-1.5 font-medium">
                        <Github size={14} className="text-gray-400" />
                        {feature.repository}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-gray-500 text-xs font-medium w-fit">
                        <GitBranch size={12} className="text-gray-400" />
                        {feature.branchName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5 shadow-sm border border-gray-100 rounded-lg px-2.5 py-1.5 w-fit bg-white">
                      {feature.checks.startsWith('6') ? (
                        <CheckCircle size={14} className="text-emerald-500" />
                      ) : (
                        <X size={14} className="text-red-500" />
                      )}
                      <span className="font-semibold text-gray-700 text-xs">{feature.checks}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className="flex flex-col gap-0.5">
                         <span className="text-[10px] font-semibold text-gray-400 uppercase">Actual</span>
                         <span className="text-xs font-semibold text-gray-800">
                           {feature.coverage.split(' / ')[0]}
                         </span>
                       </div>
                      <span className="text-gray-300 mx-1">/</span>
                      <div className="flex flex-col gap-0.5">
                         <span className="text-[10px] font-semibold text-gray-400 uppercase">Target</span>
                         <span className="text-xs font-medium text-gray-500">
                           {feature.coverage.split(' / ')[1]}
                         </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={feature.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {renderActions(feature)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-16 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5">
            <CheckCircle size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">No Pending Validation Tasks</h3>
          <p className="text-gray-500 mt-2 text-sm max-w-sm">All validation modules are currently running on schedule. Check back later for pending approvals.</p>
        </div>
      )}

      {/* Right Slide-In Panel */}
      {isPanelOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-[1px]"
            onClick={() => setIsPanelOpen(false)}
          />
          {/* Panel */}
          <div className="fixed right-0 top-0 h-full w-[420px] bg-white z-40 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            {/* Panel Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                {/* Tab switcher */}
                <button
                  onClick={() => setPanelView('new-module')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    panelView === 'new-module' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  New Module
                </button>
                <button
                  onClick={() => setPanelView('reports')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    panelView === 'reports' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Reports
                </button>
              </div>
              <button onClick={() => setIsPanelOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Panel Body */}
            <div className="flex-1 overflow-y-auto">
              {panelView === 'new-module' && (
                <div className="p-6 space-y-5">
                  {/* Step indicator */}
                  <div className="flex items-center gap-2 mb-2">
                    {[1, 2, 3].map(step => (
                      <div key={step} className={`flex-1 h-1 rounded-full transition-colors ${
                        step <= modalStep ? 'bg-[#2824D6]' : 'bg-gray-100'
                      }`} />
                    ))}
                  </div>
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                    Step {modalStep} of 3 — {modalStep === 1 ? 'Module Definition' : modalStep === 2 ? 'GitHub Branch' : 'Review'}
                  </p>

                  {modalStep === 1 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Module Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Powertrain Control Module"
                          value={newFeature.name}
                          onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Description</label>
                        <textarea
                          placeholder="Brief description of the ECU module..."
                          value={newFeature.description}
                          onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 min-h-[100px] resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">ECU Target</label>
                        <select
                          value={newFeature.ecuTarget}
                          onChange={(e) => setNewFeature({ ...newFeature, ecuTarget: e.target.value })}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                          <option value="adas">ADAS ECU</option>
                          <option value="powertrain">Powertrain Control Module</option>
                          <option value="body">Body Control Module</option>
                          <option value="infotainment">Infotainment System</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {modalStep === 2 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Repository</label>
                        <select
                          value={newFeature.repository}
                          onChange={(e) => setNewFeature({ ...newFeature, repository: e.target.value })}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                          <option value="MonEmmBatTm">org/MonEmmBatTm</option>
                          <option value="DcpChassis">org/DcpChassis</option>
                          <option value="DtrTqshRbs">org/DtrTqshRbs</option>
                          <option value="SrsVReqVmsl">org/SrsVReqVmsl</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Feature Branch</label>
                        <input
                          type="text"
                          placeholder="e.g. feat/acc-logic"
                          value={newFeature.branch}
                          onChange={(e) => setNewFeature({ ...newFeature, branch: e.target.value })}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Base Branch</label>
                        <select
                          value={newFeature.baseBranch}
                          onChange={(e) => setNewFeature({ ...newFeature, baseBranch: e.target.value })}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                          <option value="develop">develop</option>
                          <option value="main">main</option>
                          <option value="release/v3.2">release/v3.2</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {modalStep === 3 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-y-5 gap-x-6 bg-gray-50 p-5 rounded-xl border border-gray-100">
                        <div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Module Name</div>
                          <div className="text-sm font-bold text-gray-900 mt-1">{newFeature.name || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ECU Type</div>
                          <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold mt-1">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                            ECU Module
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</div>
                          <div className="text-sm font-medium text-gray-600 mt-1">{newFeature.description || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Branch</div>
                          <div className="text-sm font-bold text-indigo-700 mt-1 font-mono">{newFeature.branch || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Repository</div>
                          <div className="text-sm font-bold text-gray-900 mt-1">{newFeature.repository}</div>
                        </div>
                      </div>
                      <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Bot size={14} className="text-indigo-600" />
                          <span className="text-xs font-bold text-indigo-900 uppercase tracking-widest">Agents</span>
                        </div>
                        <p className="text-xs text-indigo-700 font-medium leading-relaxed">
                          Astree, Tessy, TC Summariser, Visualiser, Quality Report, and Integration Agents will be provisioned.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {panelView === 'reports' && (
                <div className="p-6 space-y-4">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Recent Reports</p>
                  {features.map(f => (
                    <div key={f.id} className="bg-gray-50 border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-[13px] font-bold text-gray-900">{f.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5 font-mono">{f.branchName}</div>
                        </div>
                        <StatusBadge status={f.status} />
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => navigate(`/workflow/${f.id}`)}
                          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Play size={12} /> Open Workflow
                        </button>
                        <button className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                          <FileText size={12} /> View Report
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Panel Footer */}
            {panelView === 'new-module' && (
              <div className="p-5 bg-white border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => setIsPanelOpen(false)}
                  className="text-sm font-bold text-gray-400 hover:text-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <div className="flex gap-2">
                  {modalStep > 1 && (
                    <button
                      onClick={() => setModalStep(modalStep - 1)}
                      className="px-4 py-2 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      Back
                    </button>
                  )}
                  {modalStep < 3 ? (
                    <button
                      onClick={() => setModalStep(modalStep + 1)}
                      disabled={modalStep === 1 && !newFeature.name}
                      className="px-5 py-2 bg-[#2824D6] text-white text-xs font-bold rounded-lg hover:bg-indigo-800 transition-colors disabled:opacity-50"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      onClick={handleAddFeature}
                      className="px-5 py-2 bg-[#2824D6] text-white text-xs font-bold rounded-lg hover:bg-indigo-800 flex items-center gap-1.5"
                    >
                      <Play size={13} /> Save & Start V-Cycle
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
