import React, { useEffect, useState } from 'react';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Clock,
  FileText,
  GitBranch,
  Github,
  ListFilter,
  Play,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  checks: string;
  coverage: string;
  lastUpdated: string;
}

type PanelView = 'new-module' | 'reports';
type StatusFilter = 'all' | 'risk' | 'active' | 'complete';

const INITIAL_FEATURES: Feature[] = [
  {
    id: '1',
    name: 'MonEmmBatTm',
    description:
      'Monitors the battery system for critical errors and requests a safe state if a persistent fault is detected.',
    branchName: 'feat/battery-monitor',
    repository: 'MonEmmBatTm',
    status: FeatureStatus.READY_FOR_STATIC_ANALYSIS,
    checks: '6 / 6',
    coverage: '88% / 92%',
    lastUpdated: '2 mins ago',
  },
  {
    id: '2',
    name: 'DcpChassis',
    description:
      'Processes vehicle dynamics signals including wheel speed, steering angle, torque requests, and ESP status.',
    branchName: 'feat/chassis-control',
    repository: 'DcpChassis',
    status: FeatureStatus.STATIC_ANALYSIS_FAILED,
    checks: '4 / 6',
    coverage: '72% / 85%',
    lastUpdated: '1 hour ago',
  },
  {
    id: '3',
    name: 'DtrTqshRbs',
    description: 'Torque request processing with robustness validation across failure envelopes.',
    branchName: 'feat/torque-robustness',
    repository: 'DtrTqshRbs',
    status: FeatureStatus.UNIT_TESTING_PASSED,
    checks: '6 / 6',
    coverage: '95% / 95%',
    lastUpdated: '3 hours ago',
  },
  {
    id: '4',
    name: 'SrsVReqVmsl',
    description: 'Vehicle requirement and speed limit orchestration for integration sign-off.',
    branchName: 'feat/speed-limit',
    repository: 'SrsVReqVmsl',
    status: FeatureStatus.INTEGRATION_COMPLETE,
    checks: '6 / 6',
    coverage: '98% / 98%',
    lastUpdated: 'Yesterday',
  },
];

const riskStatuses = new Set<FeatureStatus>([
  FeatureStatus.STATIC_ANALYSIS_FAILED,
  FeatureStatus.UNIT_TESTING_FAILED,
  FeatureStatus.INTEGRATION_FAILED,
]);

const activeStatuses = new Set<FeatureStatus>([
  FeatureStatus.READY_FOR_STATIC_ANALYSIS,
  FeatureStatus.STATIC_ANALYSIS_PASSED,
  FeatureStatus.UNIT_TESTING_PASSED,
]);

const getStatusMeta = (status: FeatureStatus) => {
  switch (status) {
    case FeatureStatus.READY_FOR_STATIC_ANALYSIS:
      return {
        tone: 'bg-amber-50 text-amber-900 border border-amber-200/80',
        icon: <Activity size={12} className="text-amber-600" />,
      };
    case FeatureStatus.STATIC_ANALYSIS_FAILED:
    case FeatureStatus.UNIT_TESTING_FAILED:
    case FeatureStatus.INTEGRATION_FAILED:
      return {
        tone: 'bg-rose-50 text-rose-900 border border-rose-200/80',
        icon: <AlertCircle size={12} className="text-rose-600" />,
      };
    case FeatureStatus.STATIC_ANALYSIS_PASSED:
    case FeatureStatus.UNIT_TESTING_PASSED:
      return {
        tone: 'bg-sky-50 text-sky-900 border border-sky-200/80',
        icon: <ArrowRight size={12} className="text-sky-600" />,
      };
    case FeatureStatus.INTEGRATION_COMPLETE:
      return {
        tone: 'bg-emerald-50 text-emerald-900 border border-emerald-200/80',
        icon: <CheckCircle size={12} className="text-emerald-600" />,
      };
  }
};

const StatusBadge: React.FC<{ status: FeatureStatus }> = ({ status }) => {
  const meta = getStatusMeta(status);

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${meta.tone}`}>
      {meta.icon}
      <span>{status}</span>
    </span>
  );
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [features, setFeatures] = useState<Feature[]>(INITIAL_FEATURES);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelView, setPanelView] = useState<PanelView>('new-module');
  const [modalStep, setModalStep] = useState(1);
  const [newFeature, setNewFeature] = useState({
    name: '',
    description: '',
    ecuTarget: 'powertrain',
    repository: 'MonEmmBatTm',
    branch: '',
    baseBranch: 'develop',
  });

  useEffect(() => {
    if (!isPanelOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsPanelOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPanelOpen]);

  const filteredFeatures = features.filter((feature) => {
    const normalizedQuery = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !normalizedQuery ||
      [
        feature.name,
        feature.description,
        feature.repository,
        feature.branchName,
        feature.status,
      ].some((value) => value.toLowerCase().includes(normalizedQuery));

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'risk' && riskStatuses.has(feature.status)) ||
      (statusFilter === 'active' && activeStatuses.has(feature.status)) ||
      (statusFilter === 'complete' && feature.status === FeatureStatus.INTEGRATION_COMPLETE);

    return matchesSearch && matchesStatus;
  });

  const atRiskCount = features.filter((feature) => riskStatuses.has(feature.status)).length;
  const inProgressCount = features.filter((feature) => activeStatuses.has(feature.status)).length;
  const integrationCompleteCount = features.filter(
    (feature) => feature.status === FeatureStatus.INTEGRATION_COMPLETE
  ).length;
  const statusFilters = [
    { key: 'all' as const, label: 'All Modules' },
    { key: 'risk' as const, label: 'Needs Attention' },
    { key: 'active' as const, label: 'In Progress' },
    { key: 'complete' as const, label: 'Integrated' },
  ];
  const averageCoverage =
    features.reduce((total, feature) => total + Number(feature.coverage.split(' / ')[0].replace('%', '')), 0) /
    Math.max(features.length, 1);

  const handleOpenPanel = (view: PanelView) => {
    setPanelView(view);
    setIsPanelOpen(true);
  };

  const handleAddFeature = () => {
    const feature: Feature = {
      id: Date.now().toString(),
      name: newFeature.name.trim(),
      description: newFeature.description.trim(),
      branchName: newFeature.branch.trim(),
      repository: newFeature.repository,
      status: FeatureStatus.READY_FOR_STATIC_ANALYSIS,
      checks: '0 / 6',
      coverage: '0 / 0',
      lastUpdated: 'Just now',
    };

    setFeatures((currentFeatures) => [feature, ...currentFeatures]);
    setIsPanelOpen(false);
    setModalStep(1);
    setNewFeature({
      name: '',
      description: '',
      ecuTarget: 'powertrain',
      repository: 'MonEmmBatTm',
      branch: '',
      baseBranch: 'develop',
    });
  };

  const handleDeleteFeature = (id: string) => {
    if (window.confirm('Are you sure you want to delete this module? This action cannot be undone.')) {
      setFeatures((currentFeatures) => currentFeatures.filter((feature) => feature.id !== id));
    }
  };

  const renderActions = (feature: Feature) => (
    <div className="flex items-center justify-end gap-1">
      {(feature.status === FeatureStatus.READY_FOR_STATIC_ANALYSIS ||
        riskStatuses.has(feature.status)) && (
        <button
          type="button"
          onClick={() => navigate(`/workflow/${feature.id}`)}
          aria-label={
            feature.status === FeatureStatus.READY_FOR_STATIC_ANALYSIS
              ? `Start workflow for ${feature.name}`
              : `Retry workflow for ${feature.name}`
          }
          className="focus-ring rounded-2xl border border-white/70 bg-white/90 p-2.5 text-slate-700 transition-colors hover:bg-slate-950 hover:text-white"
          title={feature.status === FeatureStatus.READY_FOR_STATIC_ANALYSIS ? 'Start V-Cycle' : 'Retry / Fix'}
        >
          {feature.status === FeatureStatus.READY_FOR_STATIC_ANALYSIS ? (
            <Play size={17} aria-hidden="true" />
          ) : (
            <RotateCcw size={17} aria-hidden="true" />
          )}
        </button>
      )}

      {feature.status === FeatureStatus.INTEGRATION_COMPLETE && (
        <button
          type="button"
          aria-label={`View final report for ${feature.name}`}
          className="focus-ring rounded-2xl border border-white/70 bg-white/90 p-2.5 text-slate-700 transition-colors hover:bg-slate-950 hover:text-white"
          title="View Final Report"
        >
          <FileText size={17} aria-hidden="true" />
        </button>
      )}

      <button
        type="button"
        onClick={() => handleDeleteFeature(feature.id)}
        aria-label={`Delete ${feature.name}`}
        className="focus-ring rounded-2xl border border-white/70 bg-white/90 p-2.5 text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-700"
        title="Delete Module"
      >
        <X size={17} aria-hidden="true" />
      </button>
    </div>
  );

  const canContinueStepOne = newFeature.name.trim().length > 0 && newFeature.description.trim().length > 0;
  const canContinueStepTwo = newFeature.branch.trim().length > 0;
  const panelTitle = panelView === 'new-module' ? 'Create New Module' : 'Recent Reports';

  return (
    <>
      <section className="panel-surface relative overflow-hidden rounded-[28px] p-4 sm:p-5 xl:h-32">
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 w-full bg-[radial-gradient(circle_at_top_right,_rgba(177,31,41,0.14),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(35,50,69,0.16),_transparent_36%)]"
        />
        <div className="relative hidden h-full xl:grid xl:grid-cols-[minmax(320px,1fr)_repeat(4,112px)_auto] xl:items-center xl:gap-3">
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Live Module Summary
            </div>
            <h1 className="mt-1 font-display text-[2rem] font-bold tracking-tight text-slate-950">
              Module Overview
            </h1>
            <p className="truncate text-sm text-slate-600">
              Fast orientation for module progress, review risk, and V-cycle readiness.
            </p>
          </div>

          <div className="panel-card-soft rounded-[18px] px-4 py-3">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Modules</div>
            <div className="mt-1 text-2xl font-bold text-slate-950">{features.length}</div>
          </div>
          <div className="panel-card-soft rounded-[18px] px-4 py-3">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Active</div>
            <div className="mt-1 text-2xl font-bold text-slate-950">{inProgressCount}</div>
          </div>
          <div className="panel-card-soft rounded-[18px] px-4 py-3">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Risk</div>
            <div className="mt-1 text-2xl font-bold text-slate-950">{atRiskCount}</div>
          </div>
          <div className="panel-card-soft rounded-[18px] px-4 py-3">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Coverage</div>
            <div className="mt-1 text-2xl font-bold text-slate-950">{Math.round(averageCoverage)}%</div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => handleOpenPanel('reports')}
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/85 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-white hover:text-slate-950"
            >
              <FileText size={15} aria-hidden="true" />
              Activity
            </button>
            <button
              type="button"
              onClick={() => handleOpenPanel('new-module')}
              className="focus-ring inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_26px_rgba(17,19,24,0.14)] transition-colors hover:bg-black"
            >
              <Plus size={15} aria-hidden="true" />
              New Module
            </button>
          </div>
        </div>

        <div className="relative flex flex-col gap-4 xl:hidden">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              <ShieldCheck size={14} className="text-[#b11f29]" aria-hidden="true" />
              Live Module Summary
            </div>
            <h1 className="mt-3 font-display text-[2rem] font-bold tracking-tight text-slate-950 sm:text-[2.2rem]">
              Module Overview
            </h1>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Fast orientation for module progress, review risk, and V-cycle readiness.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="panel-card-soft rounded-[18px] px-4 py-3">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Modules</div>
              <div className="mt-1 text-2xl font-bold text-slate-950">{features.length}</div>
            </div>
            <div className="panel-card-soft rounded-[18px] px-4 py-3">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">In Progress</div>
              <div className="mt-1 text-2xl font-bold text-slate-950">{inProgressCount}</div>
            </div>
            <div className="panel-card-soft rounded-[18px] px-4 py-3">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Needs Attention</div>
              <div className="mt-1 text-2xl font-bold text-slate-950">{atRiskCount}</div>
            </div>
            <div className="panel-card-soft rounded-[18px] px-4 py-3">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Avg Coverage</div>
              <div className="mt-1 text-2xl font-bold text-slate-950">{Math.round(averageCoverage)}%</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleOpenPanel('new-module')}
              className="focus-ring inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_28px_rgba(17,19,24,0.14)] transition-colors hover:bg-black"
            >
              <Plus size={16} aria-hidden="true" />
              New Module
            </button>
            <button
              type="button"
              onClick={() => handleOpenPanel('reports')}
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-white hover:text-slate-950"
            >
              <FileText size={16} aria-hidden="true" />
              Recent Activity
            </button>
          </div>
        </div>
      </section>

      <section className="panel-surface overflow-hidden rounded-[28px]">
        <div className="border-b border-white/70 px-4 py-3 sm:px-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Modules</div>
              <h2 className="font-display text-[1.35rem] font-bold text-slate-950">Active Work</h2>
            </div>

            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-end">
              <div className="flex flex-wrap gap-2">
                {statusFilters.map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => setStatusFilter(filter.key)}
                    className={`focus-ring inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      statusFilter === filter.key
                        ? 'bg-[#b11f29] text-white shadow-[0_14px_26px_rgba(177,31,41,0.24)]'
                        : 'border border-white/70 bg-white/70 text-slate-600 hover:bg-white hover:text-slate-950'
                    }`}
                  >
                    <ListFilter size={15} aria-hidden="true" />
                    {filter.label}
                  </button>
                ))}
              </div>

              <div className="relative min-w-0 xl:w-80">
                <label htmlFor="module-search" className="sr-only">
                  Search modules
                </label>
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="module-search"
                  name="moduleSearch"
                  type="search"
                  autoComplete="off"
                  placeholder="Search modules…"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="focus-ring w-full rounded-full border border-white/80 bg-white/90 py-2.5 pl-11 pr-4 text-sm placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>
        </div>

        {filteredFeatures.length > 0 ? (
          <>
          <div className="grid gap-3 p-4 md:hidden">
            {filteredFeatures.map((feature) => (
              <article key={feature.id} className="panel-surface rounded-[24px] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-display text-xl font-bold text-slate-950">{feature.name}</h3>
                    <p className="mt-2 break-words text-sm leading-6 text-slate-600">{feature.description}</p>
                  </div>
                  <StatusBadge status={feature.status} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="panel-card-soft rounded-[20px] p-3">
                    <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Repository</div>
                    <div className="mt-2 flex items-center gap-2 font-semibold text-slate-900">
                      <Github size={14} className="text-slate-400" aria-hidden="true" />
                      <span className="min-w-0 truncate">{feature.repository}</span>
                    </div>
                  </div>
                  <div className="panel-card-soft rounded-[20px] p-3">
                    <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Branch</div>
                    <div className="mt-2 flex items-center gap-2 font-mono text-xs font-semibold text-slate-900">
                      <GitBranch size={14} className="text-slate-400" aria-hidden="true" />
                      <span className="min-w-0 truncate">{feature.branchName}</span>
                    </div>
                  </div>
                  <div className="panel-card-soft rounded-[20px] p-3">
                    <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Checks</div>
                    <div className="mt-2 font-semibold text-slate-900 [font-variant-numeric:tabular-nums]">
                      {feature.checks}
                    </div>
                  </div>
                  <div className="panel-card-soft rounded-[20px] p-3">
                    <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Coverage</div>
                    <div className="mt-2 font-semibold text-slate-900 [font-variant-numeric:tabular-nums]">
                      {feature.coverage}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <Clock size={14} aria-hidden="true" />
                    {feature.lastUpdated}
                  </div>
                  {renderActions(feature)}
                </div>
              </article>
            ))}
          </div>

          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                <thead className="bg-white/65 text-slate-500">
                  <tr>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em]">Module</th>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em]">Repository & Branch</th>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em]">Checks</th>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em]">Coverage</th>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em]">Status</th>
                    <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-[0.18em]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFeatures.map((feature) => (
                    <tr
                      key={feature.id}
                      className="border-t border-white/80 transition-colors hover:bg-white/45"
                    >
                      <td className="px-5 py-4 align-top">
                        <div className="min-w-0">
                          <div className="font-display text-lg font-bold text-slate-950">{feature.name}</div>
                          <p className="mt-1 max-w-md text-sm leading-6 text-slate-600">{feature.description}</p>
                          <div className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
                            <Clock size={13} aria-hidden="true" />
                            {feature.lastUpdated}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <div className="flex min-w-0 flex-col gap-2">
                          <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                            <Github size={15} className="text-slate-400" aria-hidden="true" />
                            <span className="min-w-0 truncate">{feature.repository}</span>
                          </div>
                          <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-slate-500">
                            <GitBranch size={14} className="text-slate-400" aria-hidden="true" />
                            <span className="min-w-0 truncate">{feature.branchName}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-1.5 font-semibold text-slate-900 [font-variant-numeric:tabular-nums]">
                          {feature.checks.startsWith('6') ? (
                            <CheckCircle size={15} className="text-emerald-600" aria-hidden="true" />
                          ) : (
                            <AlertCircle size={15} className="text-rose-600" aria-hidden="true" />
                          )}
                          {feature.checks}
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <div className="grid gap-1 text-sm [font-variant-numeric:tabular-nums]">
                          <div className="font-semibold text-slate-950">{feature.coverage.split(' / ')[0]} actual</div>
                          <div className="text-slate-500">{feature.coverage.split(' / ')[1]} target</div>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <StatusBadge status={feature.status} />
                      </td>
                      <td className="px-5 py-4 align-top text-right">{renderActions(feature)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="p-10 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-950 text-white shadow-[0_20px_36px_rgba(17,19,24,0.16)]">
            <Search size={28} aria-hidden="true" />
          </div>
          <h3 className="mt-5 font-display text-2xl font-bold text-slate-950">No modules match this view</h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
            Adjust the search term or filter selection to widen the result set.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
            className="focus-ring mt-6 inline-flex items-center gap-2 rounded-full bg-[#b11f29] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#981822]"
          >
            Reset Filters
          </button>
        </div>
      )}
      </section>

      {isPanelOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
            onClick={() => setIsPanelOpen(false)}
          />

          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="dashboard-panel-title"
            className="panel-surface fixed right-0 top-0 z-50 flex h-full w-full max-w-[430px] flex-col [overscroll-behavior:contain]"
          >
            <div className="flex items-start justify-between border-b border-white/80 px-6 py-5">
              <div className="min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  {panelView === 'new-module' ? 'Module Intake' : 'Evidence Review'}
                </div>
                <h2 id="dashboard-panel-title" className="mt-2 font-display text-2xl font-bold text-slate-950">
                  {panelTitle}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsPanelOpen(false)}
                aria-label="Close panel"
                className="focus-ring rounded-full border border-white/70 bg-white/80 p-2 text-slate-500 transition-colors hover:bg-white hover:text-slate-950"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-6 py-6">
              {panelView === 'new-module' ? (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {[1, 2, 3].map((step) => (
                        <div
                          key={step}
                          className={`h-1.5 flex-1 rounded-full transition-colors ${
                            step <= modalStep ? 'bg-[#b11f29]' : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                      Step {modalStep} of 3
                    </p>
                  </div>

                  {modalStep === 1 && (
                    <div className="space-y-5">
                      <div>
                        <label
                          htmlFor="module-name"
                          className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400"
                        >
                          Module Name
                        </label>
                        <input
                          id="module-name"
                          name="moduleName"
                          type="text"
                          autoComplete="off"
                          placeholder="Powertrain Control Module…"
                          value={newFeature.name}
                          onChange={(event) =>
                            setNewFeature((current) => ({ ...current, name: event.target.value }))
                          }
                          className="focus-ring w-full rounded-3xl border border-white/80 bg-white/90 px-4 py-3 text-sm placeholder:text-slate-400"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="module-description"
                          className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400"
                        >
                          Description
                        </label>
                        <textarea
                          id="module-description"
                          name="moduleDescription"
                          autoComplete="off"
                          placeholder="Describe the ECU scope, safety goal, and validation intent…"
                          value={newFeature.description}
                          onChange={(event) =>
                            setNewFeature((current) => ({ ...current, description: event.target.value }))
                          }
                          className="focus-ring min-h-[140px] w-full resize-none rounded-3xl border border-white/80 bg-white/90 px-4 py-3 text-sm leading-6 placeholder:text-slate-400"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="ecu-target"
                          className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400"
                        >
                          ECU Target
                        </label>
                        <select
                          id="ecu-target"
                          name="ecuTarget"
                          value={newFeature.ecuTarget}
                          onChange={(event) =>
                            setNewFeature((current) => ({ ...current, ecuTarget: event.target.value }))
                          }
                          className="focus-ring w-full rounded-3xl border border-white/80 bg-white/90 px-4 py-3 text-sm"
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
                    <div className="space-y-5">
                      <div>
                        <label
                          htmlFor="module-repository"
                          className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400"
                        >
                          Repository
                        </label>
                        <select
                          id="module-repository"
                          name="moduleRepository"
                          value={newFeature.repository}
                          onChange={(event) =>
                            setNewFeature((current) => ({ ...current, repository: event.target.value }))
                          }
                          className="focus-ring w-full rounded-3xl border border-white/80 bg-white/90 px-4 py-3 text-sm"
                        >
                          <option value="MonEmmBatTm">org/MonEmmBatTm</option>
                          <option value="DcpChassis">org/DcpChassis</option>
                          <option value="DtrTqshRbs">org/DtrTqshRbs</option>
                          <option value="SrsVReqVmsl">org/SrsVReqVmsl</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="feature-branch"
                          className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400"
                        >
                          Feature Branch
                        </label>
                        <input
                          id="feature-branch"
                          name="featureBranch"
                          type="text"
                          autoComplete="off"
                          spellCheck={false}
                          placeholder="feat/acc-logic…"
                          value={newFeature.branch}
                          onChange={(event) =>
                            setNewFeature((current) => ({ ...current, branch: event.target.value }))
                          }
                          className="focus-ring w-full rounded-3xl border border-white/80 bg-white/90 px-4 py-3 font-mono text-sm placeholder:text-slate-400"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="base-branch"
                          className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400"
                        >
                          Base Branch
                        </label>
                        <select
                          id="base-branch"
                          name="baseBranch"
                          value={newFeature.baseBranch}
                          onChange={(event) =>
                            setNewFeature((current) => ({ ...current, baseBranch: event.target.value }))
                          }
                          className="focus-ring w-full rounded-3xl border border-white/80 bg-white/90 px-4 py-3 text-sm"
                        >
                          <option value="develop">develop</option>
                          <option value="main">main</option>
                          <option value="release/v3.2">release/v3.2</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {modalStep === 3 && (
                    <div className="space-y-5">
                      <div className="grid gap-4 rounded-[28px] border border-white/80 bg-white/85 p-5 sm:grid-cols-2">
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Module Name</div>
                          <div className="mt-2 text-sm font-semibold text-slate-950">{newFeature.name || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Repository</div>
                          <div className="mt-2 text-sm font-semibold text-slate-950">{newFeature.repository}</div>
                        </div>
                        <div className="sm:col-span-2">
                          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Description</div>
                          <div className="mt-2 text-sm leading-6 text-slate-600">{newFeature.description || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Feature Branch</div>
                          <div className="mt-2 font-mono text-xs font-semibold text-slate-950">
                            {newFeature.branch || 'N/A'}
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Base Branch</div>
                          <div className="mt-2 text-sm font-semibold text-slate-950">{newFeature.baseBranch}</div>
                        </div>
                      </div>

                      <div className="rounded-[28px] bg-[linear-gradient(135deg,#12161d,#233245)] p-5 text-white">
                        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">Automation Plan</div>
                        <p className="mt-3 text-sm leading-6 text-white/80">
                          Astree, Tessy, summary, visualization, quality, and integration agents will be queued the
                          moment the module is saved.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {features.map((feature) => (
                    <article key={feature.id} className="rounded-[28px] border border-white/80 bg-white/85 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="font-display text-xl font-bold text-slate-950">{feature.name}</h3>
                          <div className="mt-2 font-mono text-xs font-semibold text-slate-500">{feature.branchName}</div>
                        </div>
                        <StatusBadge status={feature.status} />
                      </div>
                      <p className="mt-4 text-sm leading-6 text-slate-600">{feature.description}</p>
                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => navigate(`/workflow/${feature.id}`)}
                          className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
                        >
                          <Play size={15} aria-hidden="true" />
                          Open Workflow
                        </button>
                        <button
                          type="button"
                          className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-white/80 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-950 hover:text-white"
                        >
                          <FileText size={15} aria-hidden="true" />
                          View Report
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {panelView === 'new-module' && (
              <div className="flex items-center justify-between border-t border-white/80 px-6 py-5">
                <button
                  type="button"
                  onClick={() => setIsPanelOpen(false)}
                  className="focus-ring rounded-full px-3 py-2 text-sm font-semibold text-slate-500 transition-colors hover:bg-white hover:text-slate-950"
                >
                  Cancel
                </button>
                <div className="flex items-center gap-2">
                  {modalStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setModalStep((step) => step - 1)}
                      className="focus-ring rounded-full border border-white/80 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-950 hover:text-white"
                    >
                      Back
                    </button>
                  )}
                  {modalStep < 3 ? (
                    <button
                      type="button"
                      onClick={() => setModalStep((step) => step + 1)}
                      disabled={(modalStep === 1 && !canContinueStepOne) || (modalStep === 2 && !canContinueStepTwo)}
                      className="focus-ring rounded-full bg-[#b11f29] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#981822] disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="focus-ring inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black"
                    >
                      <Play size={15} aria-hidden="true" />
                      Save & Start V-Cycle
                    </button>
                  )}
                </div>
              </div>
            )}
          </aside>
        </>
      )}
    </>
  );
};
