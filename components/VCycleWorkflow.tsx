import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, Circle, Clock, AlertCircle, ChevronRight, Play, Check, X, 
  ArrowLeft, ArrowRight, Loader2, Layers, Bot, Send, Activity, ShieldCheck, Github, 
  MessageSquare, GitBranch, BarChart2, RotateCcw, ChevronDown, ChevronLeft, User, FileText, MoreVertical,
  Code2, FileJson, FolderOpen, Eye
} from 'lucide-react';
import Markdown from 'react-markdown';
import { analyzeStaticCode, analyzeUnitTesting, analyzeIntegration, AIAnalysisReport } from '../services/geminiService';
import { Feature, FeatureStatus } from './Dashboard';

const AIAnalysisSection: React.FC<{ report: AIAnalysisReport }> = ({ report }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case 'clock': return <Clock size={18} />;
      case 'clipboard': return <FileText size={18} />;
      case 'shield': return <ShieldCheck size={18} />;
      case 'activity': return <Activity size={18} />;
      case 'user': return <User size={18} />;
      default: return <Activity size={18} />;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{report.investigationTitle}</h3>
      {report.sections.map((section, idx) => (
        <div 
          key={idx} 
          className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all"
        >
          <button 
            onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
            className="w-full p-4 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
              {getIcon(section.iconType)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-gray-900">{section.title}</h4>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase border ${
                    section.status === 'Need to Review' 
                      ? 'bg-red-50 text-red-600 border-red-100' 
                      : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                  }`}>
                    {section.status === 'AI Verified' && <span className="inline-block mr-1">✨</span>}
                    {section.status}
                  </span>
                  {expandedIndex === idx ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{section.summary}</p>
            </div>
          </button>
          
          {expandedIndex === idx && (
            <div className="px-16 pb-6 animate-in slide-in-from-top-2 duration-300">
              <div className="prose prose-sm max-w-none prose-p:text-gray-600 prose-headings:text-gray-900 border-t border-gray-100 pt-4 mt-2">
                <Markdown>{section.content}</Markdown>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const Stepper: React.FC<{ currentStep: number }> = ({ currentStep }) => {
  const steps = ['Static Code Report', 'Unit Testing', 'Integration'];
  
  return (
    <div className="flex items-center gap-2 w-full overflow-x-auto">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className={`flex items-center gap-2 whitespace-nowrap ${index > currentStep ? 'opacity-50' : ''}`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold transition-all shrink-0 ${
              index < currentStep 
                ? 'bg-[#2824D6] text-white' 
                : index === currentStep 
                  ? 'bg-transparent border-2 border-[#2824D6] text-[#2824D6] ring-2 ring-[#2824D6]/20' 
                  : 'bg-gray-100 text-gray-400 border-2 border-transparent'
            }`}>
              {index < currentStep ? <Check size={12} strokeWidth={3} /> : <span className={`w-2 h-2 rounded-full ${index === currentStep ? 'bg-[#2824D6]' : 'bg-transparent'}`} />}
            </div>
            <span className={`text-sm font-semibold ${index === currentStep ? 'text-[#2824D6]' : 'text-gray-600'}`}>
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className="flex items-center justify-center px-1.5">
              <ArrowRight size={14} className="text-gray-300" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

interface FileItem {
  name: string;
  path: string;
  type: 'code' | 'report' | 'config';
  content: string;
}

const FileViewer: React.FC<{ files: FileItem[] }> = ({ files }) => {
  const [selectedFile, setSelectedFile] = useState<FileItem>(files[0]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-full bg-white">
      {/* Sidebar */}
      <div className={`${isSidebarCollapsed ? 'w-14' : 'w-56'} border-r border-gray-200/80 flex flex-col bg-slate-50/80 transition-[width] duration-200`}>
        <div className={`px-3 py-3 border-b border-gray-200/80 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between gap-2'}`}>
          {isSidebarCollapsed ? (
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(false)}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              aria-label="Expand workspace sidebar"
            >
              <ChevronRight size={16} />
            </button>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <FolderOpen size={16} className="text-gray-400" />
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">Workspace</span>
              </div>
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(true)}
                className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                aria-label="Collapse workspace sidebar"
              >
                <ChevronLeft size={16} />
              </button>
            </>
          )}
        </div>
        <div className="flex-1 overflow-y-auto py-1.5">
          {files.map((file, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedFile(file)}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-2.5 text-left transition-colors ${
                selectedFile.name === file.name 
                  ? 'bg-indigo-50 text-indigo-900 border-r-2 border-indigo-600' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title={file.name}
            >
              {file.type === 'code' ? <Code2 size={16} className={selectedFile.name === file.name ? 'text-indigo-600' : 'text-gray-400'} /> : 
               file.type === 'report' ? <FileText size={16} className={selectedFile.name === file.name ? 'text-indigo-600' : 'text-gray-400'} /> : 
               <FileJson size={16} className={selectedFile.name === file.name ? 'text-indigo-600' : 'text-gray-400'} />}
              {!isSidebarCollapsed && <span className="text-sm font-medium truncate">{file.name}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-4 py-3 border-b border-gray-200/80 flex items-center gap-2 bg-white">
          {selectedFile.type === 'code' ? <Code2 size={16} className="text-indigo-600" /> : 
           selectedFile.type === 'report' ? <FileText size={16} className="text-emerald-600" /> : 
           <FileJson size={16} className="text-amber-600" />}
          <span className="text-sm font-bold text-gray-900">{selectedFile.name}</span>
          <span className="text-xs text-gray-400 ml-2 truncate">{selectedFile.path}</span>
        </div>
        <div className="flex-1 overflow-y-auto bg-[#1E1E1E] text-gray-300 font-mono text-sm p-6">
          <pre className="whitespace-pre-wrap"><code>{selectedFile.content}</code></pre>
        </div>
      </div>
    </div>
  );
};

type WorkflowTool = 'analysis' | 'quality' | 'summary' | 'generator' | 'visualizer' | 'branches' | 'integration';
type ReportTone = 'neutral' | 'positive' | 'warning' | 'danger';
type IntegrationStatus = 'idle' | 'integrating' | 'passed' | 'failed';

interface ReportMetric {
  label: string;
  value: string;
  tone?: ReportTone;
}

interface ReportEntry {
  id: string;
  tool: WorkflowTool;
  label: string;
  generatedAt: string;
  status: string;
  tone: ReportTone;
  source: string;
  summary: string;
  highlights: string[];
  metrics: ReportMetric[];
  snippetTitle?: string;
  snippet?: string;
}

interface ModuleReportProfile {
  static: {
    tone: ReportTone;
    status: string;
    alarms: string;
    warnings: string;
    summary: string;
    engineerBrief: string;
    evidence: string;
    recommendations: string[];
    snippet: string;
  };
  unit: {
    quality: {
      tone: ReportTone;
      status: string;
      totalSignals: string;
      health: string;
      issues: string;
      summary: string;
      highlights: string[];
      snippet: string;
    };
    qualityRisk: {
      tone: ReportTone;
      status: string;
      summary: string;
      highlights: string[];
      snippet: string;
    };
    summary: {
      tone: ReportTone;
      status: string;
      summary: string;
      highlights: string[];
      snippet: string;
    };
    generator: {
      tone: ReportTone;
      status: string;
      summary: string;
      highlights: string[];
      snippet: string;
    };
    branches: {
      tone: ReportTone;
      status: string;
      summary: string;
      highlights: string[];
      snippet: string;
    };
    visualizer: {
      tone: ReportTone;
      status: string;
      summary: string;
      highlights: string[];
      snippet: string;
    };
  };
  integration: {
    tone: ReportTone;
    status: string;
    summary: string;
    highlights: string[];
    snippet: string;
  };
}

const AUTOMATION_LINKS = `Trigger Workflow:
https://unifyapps-poc.sdp.i.mercedes-benz.com/p/0/automations/69b80530d141de032238970c/preview

Check Workflow:
https://unifyapps-poc.sdp.i.mercedes-benz.com/p/0/automations/69ba81efd141de032245b9b2/preview`;

const MODULE_REPORT_LIBRARY: Record<string, ModuleReportProfile> = {
  MonEmmBatTm: {
    static: {
      tone: 'positive',
      status: 'No alarms',
      alarms: '0',
      warnings: '0',
      summary: 'Astree and the AI review both land clean: the battery safe-state module is structurally stable and ready for a controlled move into unit testing.',
      engineerBrief: 'Keep the review lightweight here. The main watchpoint is traceability around the delay parameter and the safe-state flag, not code correctness.',
      evidence: 'Reviewers mostly need fast confidence: source evidence, the safe-state output path, and confirmation that no hidden warnings were generated.',
      recommendations: [
        'Approve after verifying the safe-state requirement mapping.',
        'Carry the delay parameter into Tessy boundary coverage.'
      ],
      snippet: 'Static Code Analysis for Repository: MonEmmBatTm\nThe analysis found no warnings, errors, or suggestions for improvement in the code.'
    },
    unit: {
      quality: {
        tone: 'positive',
        status: 'Low risk',
        totalSignals: '8',
        health: '90.5%',
        issues: '1',
        summary: 'Coverage is strong overall, with one parameter needing broader boundary variation before sign-off.',
        highlights: [
          'Signals analyzed: 7 of 8.',
          'High-risk area: MonEmmBatTm_TDlySafeSt_P only exercised at its nominal value.',
          'Critical error flags have full nominal coverage.'
        ],
        snippet: 'Quality Index: 90.5%\nHigh Risk Areas: MonEmmBatTm_TDlySafeSt_P has single-value, min, max, and low-variation issues.'
      },
      qualityRisk: {
        tone: 'warning',
        status: 'Boundary gap',
        summary: 'The risk is narrow but important: the delay parameter has not been challenged at its extremes, so the logic is not fully evidenced.',
        highlights: [
          'Test MonEmmBatTm_TDlySafeSt_P at min 0 and max 5.1.',
          'Keep safe-state request behavior visible for each boundary run.'
        ],
        snippet: 'Suggested follow-up: test MonEmmBatTm_TDlySafeSt_P at minimum (0) and maximum (5.1) values.'
      },
      summary: {
        tone: 'warning',
        status: 'Traceability warning',
        summary: 'The generated summary is useful, but it surfaces a requirement-link mismatch that should be front-and-center for reviewers.',
        highlights: [
          'Potential wrong linking of requirement id to the test case: PV_EMM-87779.',
          'The modeled behavior appears to align with PV_EMM-92895 instead.'
        ],
        snippet: 'Warning: Potential wrong linking of requirement id to the test case: PV_EMM-87779.'
      },
      generator: {
        tone: 'neutral',
        status: 'Cases ready',
        summary: 'Generated cases focus on the three behaviors that matter most here: delay memory, switch handoff, and the safe-state output.',
        highlights: [
          'Case 5 covers X_SMonEmmBatTm17_memoryDelayLength.',
          'Case 6 covers SMonEmmBatTm17_switchR2.',
          'Case 7 covers MonEmmBatTm_FlgSafeStReq.'
        ],
        snippet: 'Generated set: Test Case 5 memoryDelayLength, Test Case 6 switchR2, Test Case 7 safe-state request.'
      },
      branches: {
        tone: 'warning',
        status: '1 branch pending',
        summary: 'Only one uncovered branch remains, and it is in the exact delay-memory path reviewers already care about.',
        highlights: [
          'Branch sits in the decrement path for X_SMonEmmBatTm17_memoryR.',
          'Dependencies trace back to the delay parameter and memory initialization.'
        ],
        snippet: `if (X_SMonEmmBatTm17_memoryDelayLength) {
  X_SMonEmmBatTm17_memoryR = (uint8) (SMonEmmBatTm17_switchR2 - ((uint8) 1));
} else {
  X_SMonEmmBatTm17_memoryR = SMonEmmBatTm17_switchR2;
}`
      },
      visualizer: {
        tone: 'neutral',
        status: 'Flow mapped',
        summary: 'The module is easy to reason about because the signal chain is compact and traceable from inputs to safe-state output.',
        highlights: [
          'Inputs: battery critical error, invalid flag, no-error flag, and delay parameter.',
          'Output: MonEmmBatTm_FlgSafeStReq.'
        ],
        snippet: 'MonEmmBatTm_TDlySafeSt_P + critical error flags -> delay gate -> MonEmmBatTm_FlgSafeStReq'
      }
    },
    integration: {
      tone: 'neutral',
      status: 'Automation ready',
      summary: 'Integration for this module is mostly an orchestration concern now: trigger the shared pipeline and verify the cross-tool handoff stays clean.',
      highlights: [
        'Use the UnifyApps trigger flow to start Astree + Tessy automation.',
        'Use the check flow to poll status and validate handoff sequencing.'
      ],
      snippet: AUTOMATION_LINKS
    }
  },
  DcpChassis: {
    static: {
      tone: 'danger',
      status: '12 alarms',
      alarms: '12',
      warnings: '12',
      summary: 'This module needs an engineer-in-the-loop review. The static findings are concentrated in calibration and physical range mismatches, not random noise.',
      engineerBrief: 'Hold approval until the range-constraint alarms are triaged. The risk is broad enough that a quick pass would be irresponsible.',
      evidence: 'The strongest evidence trail is around wheel speed, steering angle, yaw rate, and torque limit signals where the Astree alarms cluster.',
      recommendations: [
        'Review calibration limits before approving to the next stage.',
        'Focus on DcpChassis_VVehEsp, TqWhlSumEcoAssiReq, and AgStrw first.'
      ],
      snippet: 'Static Code Analysis for Repository: DcpChassis\n12 range-constraint alarms across calibration and physical limits.'
    },
    unit: {
      quality: {
        tone: 'warning',
        status: 'Medium risk',
        totalSignals: '502',
        health: '70.1%',
        issues: '282',
        summary: 'This is a wide coverage surface with meaningful gaps. The right call is to keep quality visible beside the evidence, not bury it in a modal.',
        highlights: [
          '401 analyzed signals, 101 skipped.',
          'Global maximum coverage is only 35.2%.',
          'Multiple chassis signals still have unresolved issue clusters.'
        ],
        snippet: 'Health Score: 70.1%\nHigh Risk Areas: Awd_TqSecyAxle, DcpChassis_AXSnsrRaw_P, Esp_NWhlTarAxleFrnt.'
      },
      qualityRisk: {
        tone: 'danger',
        status: 'Needs attention',
        summary: 'The dominant risk pattern is incomplete maximum-value coverage on wheel-speed and axle-limit signals.',
        highlights: [
          'Min not tested: 137.',
          'Max not tested: 260.',
          'Start with wheel speed and axle-limit calibrations.'
        ],
        snippet: 'Maximum value mismatch warnings persist for NWhlRr, NWhlRl, NWhlFr, NWhlFl, NMaxLimAxleRear, and NMaxLimAxleFrnt.'
      },
      summary: {
        tone: 'neutral',
        status: 'Coverage brief',
        summary: 'The unit summary emphasizes deactivation logic and signal-boundary validation, which makes it a better review artifact than the raw run log alone.',
        highlights: [
          'Project: AUTOSAR Test DcpChassis.',
          'Boundary-heavy focus on AXSnsrRaw, AYSnsrRaw, AgNSteer, and TqBrkAssc.'
        ],
        snippet: 'Unit Test Coverage Summary for Branch: DcpChassis'
      },
      generator: {
        tone: 'neutral',
        status: 'Cases generated',
        summary: 'Generated test cases concentrate on the high-signal branches: absolute value thresholding and diff polarity handling.',
        highlights: [
          'Case 5 validates SDtrTqshRbs25_Abs <= 2 patterns in the template set.',
          'Case 6 validates TRUE/FALSE handling for diff sign behavior.'
        ],
        snippet: 'Recommended generated set keeps branch logic explicit and boundary-oriented for review.'
      },
      branches: {
        tone: 'warning',
        status: '10 branches pending',
        summary: 'The uncovered branch list is large enough to warrant its own contextual report inside the workflow page.',
        highlights: [
          'Clusters around RateYawTar, wheel angle, ESP state, and torque requests.',
          'Use the list as a targeted backlog, not a generic warning.'
        ],
        snippet: 'Uncovered branches include DcpChassis_PercTpRAxleEstmt, DcpChassis_StEsp, DcpChassis_StDrgTqReq, and DcpChassis_RateYawTar.'
      },
      visualizer: {
        tone: 'neutral',
        status: 'Evidence mapped',
        summary: 'The visualizer view should help reviewers navigate the broad signal surface quickly rather than force them into multiple standalone screens.',
        highlights: [
          'Focus paths: AXSnsrRaw, AYSnsrRaw, AgNSteer, and TqBrkAssc.',
          'Keep line-of-sight between evidence and the active quality report.'
        ],
        snippet: 'Highlighted evidence paths: sensor raw values -> steering angle -> braking assistance outputs.'
      }
    },
    integration: {
      tone: 'warning',
      status: 'Gate carefully',
      summary: 'Integration should stay gated until the range-constraint warnings and weak unit coverage areas are explicitly addressed.',
      highlights: [
        'Do not treat medium-risk quality as equivalent to integration readiness.',
        'Use the shared automation flow only after calibration fixes are queued.'
      ],
      snippet: AUTOMATION_LINKS
    }
  },
  DtrTqshRbs: {
    static: {
      tone: 'warning',
      status: 'Overflow risk',
      alarms: '1 critical pattern',
      warnings: '1 overflow family',
      summary: 'Static analysis is mostly focused on a low-pass-filter overflow path. The issue is localized enough for targeted remediation.',
      engineerBrief: 'Keep the review concentrated on saturation and integer-width decisions in the torque shaping filter.',
      evidence: 'The most useful evidence is the arithmetic expression and the surrounding saturation strategy, not a generic file-by-file walk.',
      recommendations: [
        'Add saturation before the integer addition.',
        'Consider 64-bit arithmetic for the intermediate sum.'
      ],
      snippet: '(sint64)SDtrTqshRbs27_inertia + (SDtrTqshRbs26_RescalerInput / ((sint32) 200))'
    },
    unit: {
      quality: {
        tone: 'positive',
        status: 'Low risk',
        totalSignals: '14',
        health: '86.8%',
        issues: '6',
        summary: 'Coverage is solid enough to keep moving, but not clean enough to hide the remaining gaps.',
        highlights: [
          'Maximum coverage is weaker than minimum coverage.',
          'Torque request shaping paths are the main residual focus.'
        ],
        snippet: 'Quality Index: 86.8%\nHigh Risk Areas: DtrTqshRbsAcvn_StTqshIni and DtrTqshRbs_TqInReqMonDly.'
      },
      qualityRisk: {
        tone: 'warning',
        status: 'Targeted follow-up',
        summary: 'The remaining issues are concentrated enough that a follow-up pass can be narrow and measurable.',
        highlights: [
          'Max not tested: 4.',
          'Scaling not tested: 2.'
        ],
        snippet: 'Primary follow-up target: expand max-value and scaling coverage on torque shaping signals.'
      },
      summary: {
        tone: 'neutral',
        status: 'Behavior brief',
        summary: 'The test summary explains the dynamic filtering behavior clearly, which makes it a better artifact for reviewers than a raw spreadsheet.',
        highlights: [
          'Validates ramp behavior toward the filtered torque request.',
          'Shows the delayed torque request state explicitly.'
        ],
        snippet: 'DtrTqshRbs_TqReqFil ramps toward the input value over multiple execution steps.'
      },
      generator: {
        tone: 'neutral',
        status: 'Branch cases ready',
        summary: 'Generated cases are already aligned with the two branch predicates that matter most to reviewers.',
        highlights: [
          'Case 5 covers SDtrTqshRbs25_Abs <= 2.',
          'Case 6 covers SDtrTqshRbs25_Diff >= 0.'
        ],
        snippet: 'Generated coverage template uses TRUE/FALSE scenarios for both ABS and DIFF branch families.'
      },
      branches: {
        tone: 'warning',
        status: '2 branches pending',
        summary: 'The uncovered branches live inside the torque-read phase logic, so they should stay visible in the same place reviewers inspect the summary.',
        highlights: [
          'Both branches trace into DtrTqshRbs_TqrdPha1F.',
          'They are more useful as a follow-up checklist than as a separate route.'
        ],
        snippet: 'Uncovered branches map to Logic/DtrTqshRbs_Enable/DtrTqshRbs_Tq/DtrTqshRbs_TqrdPha1/DtrTqshRbs_TqrdPha1F'
      },
      visualizer: {
        tone: 'neutral',
        status: 'Signal path ready',
        summary: 'The evidence view should center the LPF, the delayed-request state, and the filtered torque output in one compact surface.',
        highlights: [
          'Inputs: delayed flag, phase duration, enable flag, initial request.',
          'Output: DtrTqshRbs_TqReqFil.'
        ],
        snippet: 'Core evidence path: delayed torque request inputs -> LPF -> filtered torque output.'
      }
    },
    integration: {
      tone: 'neutral',
      status: 'Ready with guardrails',
      summary: 'Integration is reasonable after the overflow mitigation is clear, but the runtime arithmetic decision should remain documented in handoff notes.',
      highlights: [
        'Carry the LPF saturation decision into integration notes.',
        'Use the shared automation flow for validation and status checks.'
      ],
      snippet: AUTOMATION_LINKS
    }
  },
  SrsVReqVmsl: {
    static: {
      tone: 'warning',
      status: '5 warnings',
      alarms: '5',
      warnings: '5',
      summary: 'The static profile is mixed: some warnings are likely code-generation artifacts, but the arithmetic overflow findings are real review items.',
      engineerBrief: 'Separate unreachable-code artifacts from actionable overflow issues so reviewers do not overreact to the raw warning count.',
      evidence: 'The most important evidence is the two overflow expressions and the library-block logic that creates the unreachable code paths.',
      recommendations: [
        'Document code-generation artifacts explicitly.',
        'Use wider arithmetic or saturation for the forward/reverse limiter math.'
      ],
      snippet: 'Warnings include unreachable code in Difference Limiter and arithmetic overflow in MinMax4/delayY calculations.'
    },
    unit: {
      quality: {
        tone: 'warning',
        status: 'Medium risk',
        totalSignals: '135',
        health: '76.5%',
        issues: '38',
        summary: 'This module has workable coverage, but enough signal-quality gaps that the right-hand report rail should make them impossible to miss.',
        highlights: [
          'Analyzed signals: 79.',
          'Parameters with issues include SrsVReqVmsl_VVehMaxAcvScr_P and SrsVReqVmsl_VVehMaxScr2_P.'
        ],
        snippet: 'Risk Level: MEDIUM (Health Score: 76.5%)'
      },
      qualityRisk: {
        tone: 'warning',
        status: 'Range gaps',
        summary: 'Risk is driven by incomplete min/max coverage and scaling coverage across speed-limit parameters.',
        highlights: [
          'Min not tested: 20.',
          'Max not tested: 26.',
          'Scaling not tested: 23.'
        ],
        snippet: 'Coverage follow-up should prioritize forward and reverse speed-limit parameters with low max-tested percentages.'
      },
      summary: {
        tone: 'neutral',
        status: 'Scenario brief',
        summary: 'The sample summary centers on reverse speed limiting under kickdown and AMG mode, which is exactly the kind of scenario-specific explanation engineers need.',
        highlights: [
          'Focus case: reverse limit coordination.',
          'Forward speed limit remains unaffected in the highlighted scenario.'
        ],
        snippet: 'Summary for Test Case 4.5 of SrsVReqVmsl'
      },
      generator: {
        tone: 'neutral',
        status: 'Cases generated',
        summary: 'Generated unit cases cover the limiter, delay logic, and rescaler dependencies in a way that maps well to the static warning profile.',
        highlights: [
          'Targets rescaler behavior and delayY interactions.',
          'Keeps the forward/reverse limiter math visible.'
        ],
        snippet: 'The generated unit test cases for the branch "SrsVReqVmsl" have been successfully generated.'
      },
      branches: {
        tone: 'warning',
        status: '3 branches pending',
        summary: 'The uncovered branches concentrate in the forward and reverse limiter delay paths, making them ideal candidates for an inline follow-up view.',
        highlights: [
          'Reverse DifferenceLimiter delayY path remains uncovered.',
          'Forward limiter Div1 and delayY paths also need evidence.'
        ],
        snippet: 'Uncovered branches map to Logic/SrsVReqVmsl_Rvs/DifferenceLimiter/delayY and Logic/SrsVReqVmsl_Fwd/...'
      },
      visualizer: {
        tone: 'neutral',
        status: 'Flow ready',
        summary: 'The right UI for this module is a compact evidence view that keeps limiter math, delay states, and speed outputs visible together.',
        highlights: [
          'Keep reverse and forward limiter paths side-by-side.',
          'Surface switchMax and delayY as first-class evidence nodes.'
        ],
        snippet: 'Key nodes: SSrsVReqVmsl88_switchMax, X_SSrsVReqVmsl79_delayY, reverse and forward speed limits.'
      }
    },
    integration: {
      tone: 'warning',
      status: 'Proceed carefully',
      summary: 'Integration should stay conscious of the overflow fixes and limiter coverage gaps so the workflow does not present false confidence.',
      highlights: [
        'Capture limiter overflow decisions in the handoff brief.',
        'Use the shared automation links after unit follow-ups are queued.'
      ],
      snippet: AUTOMATION_LINKS
    }
  }
};

const STAGE_LABELS = ['Static Analysis', 'Unit Testing', 'Integration'];

const getToolLabel = (tool: WorkflowTool) => {
  switch (tool) {
    case 'analysis':
      return 'Default Analysis';
    case 'quality':
      return 'Quality Report';
    case 'summary':
      return 'Summariser';
    case 'generator':
      return 'Test Generator';
    case 'visualizer':
      return 'Visualiser';
    case 'branches':
      return 'Uncovered Branches';
    case 'integration':
      return 'Integration Notes';
    default:
      return 'Report';
  }
};

const getToolIcon = (tool: WorkflowTool, className = 'w-4 h-4') => {
  switch (tool) {
    case 'analysis':
      return <ShieldCheck className={className} />;
    case 'quality':
      return <BarChart2 className={className} />;
    case 'summary':
      return <MessageSquare className={className} />;
    case 'generator':
      return <Bot className={className} />;
    case 'visualizer':
      return <Eye className={className} />;
    case 'branches':
      return <GitBranch className={className} />;
    case 'integration':
      return <Layers className={className} />;
    default:
      return <FileText className={className} />;
  }
};

const getToneClasses = (tone: ReportTone) => {
  switch (tone) {
    case 'positive':
      return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    case 'warning':
      return 'bg-amber-50 text-amber-700 border-amber-100';
    case 'danger':
      return 'bg-red-50 text-red-700 border-red-100';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

const getMetricToneClasses = (tone: ReportTone = 'neutral') => {
  switch (tone) {
    case 'positive':
      return 'bg-emerald-50 border-emerald-100 text-emerald-800';
    case 'warning':
      return 'bg-amber-50 border-amber-100 text-amber-800';
    case 'danger':
      return 'bg-red-50 border-red-100 text-red-800';
    default:
      return 'bg-slate-50 border-slate-200 text-slate-800';
  }
};

const buildStaticReports = (featureName: string, astreeReport: string): ReportEntry[] => {
  const profile = MODULE_REPORT_LIBRARY[featureName] || MODULE_REPORT_LIBRARY.MonEmmBatTm;

  return [
    {
      id: 'static-latest',
      tool: 'analysis',
      label: 'Latest Astree run',
      generatedAt: 'Current workflow run',
      status: profile.static.status,
      tone: profile.static.tone,
      source: 'Astree + AI review',
      summary: profile.static.summary,
      highlights: profile.static.recommendations,
      metrics: [
        { label: 'Alarms', value: profile.static.alarms, tone: profile.static.tone },
        { label: 'Warnings', value: profile.static.warnings, tone: profile.static.tone },
        { label: 'Stage', value: 'Static', tone: 'neutral' },
        { label: 'Owner', value: featureName, tone: 'neutral' }
      ],
      snippetTitle: 'Latest report extract',
      snippet: astreeReport || profile.static.snippet
    },
    {
      id: 'static-baseline',
      tool: 'analysis',
      label: 'Engineer baseline',
      generatedAt: 'Google Doc reference',
      status: profile.static.status,
      tone: profile.static.tone,
      source: 'Agentic output baseline',
      summary: profile.static.engineerBrief,
      highlights: profile.static.recommendations,
      metrics: [
        { label: 'Alarms', value: profile.static.alarms, tone: profile.static.tone },
        { label: 'Review', value: 'Engineer brief', tone: 'neutral' }
      ],
      snippetTitle: 'Baseline note',
      snippet: profile.static.snippet
    },
    {
      id: 'static-summary',
      tool: 'summary',
      label: 'Engineer brief',
      generatedAt: 'Google Doc reference',
      status: 'Context ready',
      tone: 'neutral',
      source: 'Workflow guidance',
      summary: profile.static.engineerBrief,
      highlights: profile.static.recommendations,
      metrics: [
        { label: 'Focus', value: 'Review context', tone: 'neutral' },
        { label: 'Route', value: 'Inline', tone: 'neutral' }
      ],
      snippetTitle: 'Reviewer note',
      snippet: profile.static.snippet
    },
    {
      id: 'static-visualizer',
      tool: 'visualizer',
      label: 'Evidence trail',
      generatedAt: 'Google Doc reference',
      status: 'Evidence mapped',
      tone: 'neutral',
      source: 'UX review recommendation',
      summary: profile.static.evidence,
      highlights: [
        'Keep the file viewer and report workspace visible together.',
        'Use the 3-dot menu to switch tools without leaving the page.'
      ],
      metrics: [
        { label: 'Layout', value: 'Inline split view', tone: 'neutral' },
        { label: 'Evidence', value: 'Visible', tone: 'positive' }
      ],
      snippetTitle: 'Primary evidence',
      snippet: profile.static.snippet
    }
  ];
};

const buildUnitReports = (featureName: string, unitTestReport: string, coverageScore: number): ReportEntry[] => {
  const profile = MODULE_REPORT_LIBRARY[featureName] || MODULE_REPORT_LIBRARY.MonEmmBatTm;

  return [
    {
      id: 'unit-quality-latest',
      tool: 'quality',
      label: 'Latest Tessy run',
      generatedAt: 'Current workflow run',
      status: profile.unit.quality.status,
      tone: profile.unit.quality.tone,
      source: 'Tessy + agentic quality report',
      summary: profile.unit.quality.summary,
      highlights: profile.unit.quality.highlights,
      metrics: [
        { label: 'Coverage', value: `${coverageScore}%`, tone: coverageScore >= 85 ? 'positive' : 'warning' },
        { label: 'Signals', value: profile.unit.quality.totalSignals, tone: 'neutral' },
        { label: 'Issues', value: profile.unit.quality.issues, tone: profile.unit.quality.tone },
        { label: 'Health', value: profile.unit.quality.health, tone: profile.unit.quality.tone }
      ],
      snippetTitle: 'Latest report extract',
      snippet: unitTestReport || profile.unit.quality.snippet
    },
    {
      id: 'unit-quality-risk',
      tool: 'quality',
      label: 'Risk snapshot',
      generatedAt: 'Google Doc reference',
      status: profile.unit.qualityRisk.status,
      tone: profile.unit.qualityRisk.tone,
      source: 'Signal risk breakdown',
      summary: profile.unit.qualityRisk.summary,
      highlights: profile.unit.qualityRisk.highlights,
      metrics: [
        { label: 'Coverage', value: `${coverageScore}%`, tone: coverageScore >= 85 ? 'positive' : 'warning' },
        { label: 'Priority', value: 'Follow-up', tone: profile.unit.qualityRisk.tone }
      ],
      snippetTitle: 'Risk note',
      snippet: profile.unit.qualityRisk.snippet
    },
    {
      id: 'unit-summary',
      tool: 'summary',
      label: 'Test summary',
      generatedAt: 'Google Doc reference',
      status: profile.unit.summary.status,
      tone: profile.unit.summary.tone,
      source: 'Test case summariser',
      summary: profile.unit.summary.summary,
      highlights: profile.unit.summary.highlights,
      metrics: [
        { label: 'Audience', value: 'Reviewers', tone: 'neutral' },
        { label: 'Format', value: 'Narrative', tone: 'neutral' }
      ],
      snippetTitle: 'Summary extract',
      snippet: profile.unit.summary.snippet
    },
    {
      id: 'unit-generator',
      tool: 'generator',
      label: 'Generated cases',
      generatedAt: 'Google Doc reference',
      status: profile.unit.generator.status,
      tone: profile.unit.generator.tone,
      source: 'Test case generator',
      summary: profile.unit.generator.summary,
      highlights: profile.unit.generator.highlights,
      metrics: [
        { label: 'Mode', value: 'Agentic', tone: 'neutral' },
        { label: 'Focus', value: 'Branch coverage', tone: 'neutral' }
      ],
      snippetTitle: 'Generation note',
      snippet: profile.unit.generator.snippet
    },
    {
      id: 'unit-visualizer',
      tool: 'visualizer',
      label: 'Evidence map',
      generatedAt: 'Google Doc reference',
      status: profile.unit.visualizer.status,
      tone: profile.unit.visualizer.tone,
      source: 'Test case visualiser',
      summary: profile.unit.visualizer.summary,
      highlights: profile.unit.visualizer.highlights,
      metrics: [
        { label: 'Layout', value: 'Right rail', tone: 'neutral' },
        { label: 'Context', value: 'Preserved', tone: 'positive' }
      ],
      snippetTitle: 'Evidence note',
      snippet: profile.unit.visualizer.snippet
    },
    {
      id: 'unit-branches',
      tool: 'branches',
      label: 'Uncovered branches',
      generatedAt: 'Google Doc reference',
      status: profile.unit.branches.status,
      tone: profile.unit.branches.tone,
      source: 'Branch tracking output',
      summary: profile.unit.branches.summary,
      highlights: profile.unit.branches.highlights,
      metrics: [
        { label: 'Backlog', value: 'Targeted', tone: profile.unit.branches.tone },
        { label: 'Review mode', value: 'Inline', tone: 'neutral' }
      ],
      snippetTitle: 'Branch extract',
      snippet: profile.unit.branches.snippet
    }
  ];
};

const buildIntegrationReports = (
  featureName: string,
  integrationReport: string,
  integrationState: IntegrationStatus
): ReportEntry[] => {
  const profile = MODULE_REPORT_LIBRARY[featureName] || MODULE_REPORT_LIBRARY.MonEmmBatTm;
  const currentStatus = integrationState === 'failed' ? 'Failed run' : integrationState === 'passed' ? 'Passed run' : profile.integration.status;
  const currentTone: ReportTone = integrationState === 'failed' ? 'danger' : integrationState === 'passed' ? 'positive' : profile.integration.tone;

  return [
    {
      id: 'integration-current',
      tool: 'integration',
      label: 'Current integration status',
      generatedAt: 'Current workflow run',
      status: currentStatus,
      tone: currentTone,
      source: 'Integration stage output',
      summary: integrationState === 'failed'
        ? 'The current run failed, so the right-hand workspace should stay focused on recovery, not navigation away from the page.'
        : profile.integration.summary,
      highlights: integrationState === 'failed'
        ? [
            'Keep the failure report visible beside the workspace evidence.',
            'Use retry only after the AI recommendation and report history have been reviewed.'
          ]
        : profile.integration.highlights,
      metrics: [
        { label: 'State', value: integrationState === 'failed' ? 'Failed' : integrationState === 'passed' ? 'Passed' : 'Ready', tone: currentTone },
        { label: 'Flow', value: 'Integration', tone: 'neutral' }
      ],
      snippetTitle: 'Latest status',
      snippet: integrationReport || profile.integration.snippet
    },
    {
      id: 'integration-links',
      tool: 'integration',
      label: 'Automation links',
      generatedAt: 'Google Doc reference',
      status: 'Ops reference',
      tone: 'neutral',
      source: 'Astree & Tessy integration',
      summary: 'Keep the trigger and check automation links inside the workflow page so engineers do not leave the review context to find them.',
      highlights: [
        'Trigger the shared workflow from the same review surface.',
        'Use the check flow for monitoring, retries, and follow-up validation.'
      ],
      metrics: [
        { label: 'Links', value: '2', tone: 'neutral' },
        { label: 'Location', value: 'Inline', tone: 'positive' }
      ],
      snippetTitle: 'Automation links',
      snippet: AUTOMATION_LINKS
    },
    {
      id: 'integration-summary',
      tool: 'summary',
      label: 'Handoff brief',
      generatedAt: 'Google Doc reference',
      status: profile.integration.status,
      tone: profile.integration.tone,
      source: 'Workflow handoff note',
      summary: profile.integration.summary,
      highlights: profile.integration.highlights,
      metrics: [
        { label: 'Audience', value: 'Release owner', tone: 'neutral' },
        { label: 'Intent', value: 'Handoff', tone: 'neutral' }
      ],
      snippetTitle: 'Handoff note',
      snippet: profile.integration.snippet
    }
  ];
};

const ReportWorkspace: React.FC<{
  title: string;
  subtitle: string;
  reports: ReportEntry[];
  defaultTool: WorkflowTool;
  analysisReport?: AIAnalysisReport | null;
  analysisTool?: WorkflowTool;
}> = ({ title, subtitle, reports, defaultTool, analysisReport, analysisTool }) => {
  const [selectedTool, setSelectedTool] = useState<WorkflowTool>(defaultTool);
  const [selectedReportId, setSelectedReportId] = useState('');
  const [isToolMenuOpen, setIsToolMenuOpen] = useState(false);

  useEffect(() => {
    setSelectedTool(defaultTool);
    setIsToolMenuOpen(false);
  }, [defaultTool, title]);

  const availableTools = Array.from(new Set(reports.map((report) => report.tool)));
  const reportsForSelectedTool = reports.filter((report) => report.tool === selectedTool);

  useEffect(() => {
    if (!reportsForSelectedTool.some((report) => report.id === selectedReportId)) {
      setSelectedReportId(reportsForSelectedTool[0]?.id || '');
    }
  }, [selectedReportId, reportsForSelectedTool]);

  const selectedReport = reportsForSelectedTool.find((report) => report.id === selectedReportId) || reportsForSelectedTool[0];

  return (
    <div className="panel-card rounded-[26px] flex flex-col h-full overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200/80 flex items-center justify-between gap-4 bg-white/90">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900">{title}</span>
            {selectedReport && (
              <span className={`hidden sm:inline-flex px-2 py-1 rounded-full border text-[11px] font-semibold ${getToneClasses(selectedReport.tone)}`}>
                {selectedReport.status}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500 truncate">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <label className="sr-only" htmlFor={`${title}-report-picker`}>Saved report</label>
          <select
            id={`${title}-report-picker`}
            value={selectedReport?.id || ''}
            onChange={(event) => setSelectedReportId(event.target.value)}
            className="min-w-[190px] px-3 py-2 border border-gray-200/80 rounded-lg bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            {reportsForSelectedTool.map((report) => (
              <option key={report.id} value={report.id}>
                {report.label}
              </option>
            ))}
          </select>
          <div className="relative">
            <button
              onClick={() => setIsToolMenuOpen((open) => !open)}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Switch report tool"
            >
              <MoreVertical size={16} />
            </button>
            {isToolMenuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsToolMenuOpen(false)} />
                <div className="absolute right-0 top-11 z-40 w-56 rounded-xl border border-gray-200/80 bg-white shadow-lg overflow-hidden">
                  <div className="px-3 py-2 border-b border-gray-100/90">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Tools</p>
                  </div>
                  {availableTools.map((tool) => {
                    const count = reports.filter((report) => report.tool === tool).length;
                    const isActive = tool === selectedTool;

                    return (
                      <button
                        key={tool}
                        onClick={() => {
                          setSelectedTool(tool);
                          setSelectedReportId('');
                          setIsToolMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                          isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="flex items-center gap-2 font-medium">
                          {getToolIcon(tool, 'w-4 h-4')}
                          {getToolLabel(tool)}
                        </span>
                        <span className="text-xs text-gray-400">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#F8FAFC] p-3.5 space-y-3.5">
        {selectedReport ? (
          <>
            <div className="rounded-[24px] border border-gray-200/80 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                      {getToolIcon(selectedReport.tool, 'w-4 h-4')}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{selectedReport.label}</h3>
                      <p className="text-sm text-gray-500">{selectedReport.source}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-gray-400">Saved: {selectedReport.generatedAt}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                  Active tool: <span className="font-semibold text-gray-900">{getToolLabel(selectedReport.tool)}</span>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">{selectedReport.summary}</p>
            </div>

            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
              {selectedReport.metrics.map((metric) => (
                <div key={`${selectedReport.id}-${metric.label}`} className={`rounded-xl border px-4 py-3 ${getMetricToneClasses(metric.tone)}`}>
                  <div className="text-xs uppercase tracking-[0.16em] text-current/70 font-semibold">{metric.label}</div>
                  <div className="mt-2 text-lg font-bold">{metric.value}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3.5">
              <div className="rounded-[24px] border border-gray-200/80 bg-white p-4 shadow-sm">
                <h4 className="text-sm font-bold text-gray-900">Review Focus</h4>
                <ul className="mt-4 space-y-3">
                  {selectedReport.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-3 text-sm text-gray-600">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[24px] border border-gray-200/80 bg-white p-4 shadow-sm">
                <h4 className="text-sm font-bold text-gray-900">{selectedReport.snippetTitle || 'Report extract'}</h4>
                <pre className="mt-4 rounded-xl bg-[#101828] text-slate-200 p-4 text-xs leading-6 overflow-x-auto whitespace-pre-wrap font-mono">
                  <code>{selectedReport.snippet || 'No saved extract for this report yet.'}</code>
                </pre>
              </div>
            </div>

            {analysisReport && analysisTool === selectedReport.tool && (
              <div className="rounded-[24px] border border-gray-200/80 bg-white p-4 shadow-sm">
                <AIAnalysisSection report={analysisReport} />
              </div>
            )}
          </>
        ) : (
          <div className="h-full rounded-[24px] border border-dashed border-gray-300 bg-white flex items-center justify-center text-sm text-gray-500">
            No reports available for this tool yet.
          </div>
        )}
      </div>
    </div>
  );
};

export const VCycleWorkflow: React.FC = () => {
  const { featureId } = useParams<{ featureId: string }>();
  const navigate = useNavigate();
  
  // Mock feature data
  const [feature, setFeature] = useState<Feature | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [workflowState, setWorkflowState] = useState<'idle' | 'analyzing_astree' | 'analyzing_ai' | 'review'>('idle');
  const [astreeReport, setAstreeReport] = useState<string>('');
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisReport | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Unit Testing Specific State
  const [unitTestSubStep, setUnitTestSubStep] = useState<'idle' | 'fetching_files' | 'running_tessy' | 'generating_summary' | 'review'>('idle');
  const [unitTestReport, setUnitTestReport] = useState<string>('');
  const [unitTestAIAnalysis, setUnitTestAIAnalysis] = useState<AIAnalysisReport | null>(null);
  const [coverageScore, setCoverageScore] = useState<number>(0);

  // Integration Specific State
  const [integrationState, setIntegrationState] = useState<'idle' | 'integrating' | 'passed' | 'failed'>('idle');
  const [integrationReport, setIntegrationReport] = useState<string>('');
  const [integrationAIAnalysis, setIntegrationAIAnalysis] = useState<AIAnalysisReport | null>(null);

  const staticFiles: FileItem[] = [
    { name: 'acc_logic.c', path: 'src/core/adas/acc_logic.c', type: 'code', content: 'void acc_logic_update(sensor_data_t* p_sensor_data) {\n  // Possible null pointer dereference here\n  if (p_sensor_data->distance < 0.5) {\n    apply_brakes();\n  }\n}' },
    { name: 'acc_math.h', path: 'src/core/adas/acc_math.h', type: 'code', content: '#define PI 3.14159\n\nfloat32 calculate_trajectory(float64 speed, float64 angle) {\n  // Implicit conversion warning\n  return speed * angle * PI;\n}' },
    { name: 'astree_report.log', path: 'reports/static_analysis/astree_report.log', type: 'report', content: astreeReport }
  ];

  const unitTestFiles: FileItem[] = [
    { name: 'test_acc_logic.c', path: 'tests/unit/test_acc_logic.c', type: 'code', content: 'void test_acc_boundary() {\n  sensor_data_t data = { .distance = 0.4 };\n  acc_logic_update(&data);\n  ASSERT_TRUE(brakes_applied);\n}' },
    { name: 'tessy_summary.xml', path: 'reports/unit_tests/tessy_summary.xml', type: 'report', content: unitTestReport }
  ];

  const integrationFiles: FileItem[] = [
    { name: 'can_gateway.c', path: 'src/gateway/can_gateway.c', type: 'code', content: 'void process_can_message(can_msg_t* msg) {\n  uint8_t buffer[256];\n  // Buffer overflow if msg->size > 256\n  memcpy(buffer, msg->data, msg->size);\n}' },
    { name: 'integration_test.log', path: 'reports/integration/integration_test.log', type: 'report', content: integrationReport }
  ];

  useEffect(() => {
    const mockFeatures: Feature[] = [
      { 
        id: '1', 
        name: 'MonEmmBatTm', 
        description: 'Monitors the battery system for critical errors and ensures a "Safe State" is requested if a persistent fault is detected.',
        branchName: 'feat/battery-monitor', 
        repository: 'MonEmmBatTm',
        checks: '6 / 6',
        coverage: '88% / 92%',
        status: FeatureStatus.READY_FOR_STATIC_ANALYSIS, 
        lastUpdated: '2 mins ago' 
      },
      { 
        id: '2', 
        name: 'DcpChassis', 
        description: 'Processes signals related to vehicle dynamics, such as wheel speeds, steering angles, torque requests, and ESP status.',
        branchName: 'feat/chassis-control', 
        repository: 'DcpChassis',
        checks: '4 / 6',
        coverage: '72% / 85%',
        status: FeatureStatus.STATIC_ANALYSIS_FAILED, 
        lastUpdated: '1 hour ago' 
      },
      { 
        id: '3', 
        name: 'DtrTqshRbs', 
        description: 'Torque request processing and robustness.',
        branchName: 'feat/torque-robustness', 
        repository: 'DtrTqshRbs',
        checks: '6 / 6',
        coverage: '95% / 95%',
        status: FeatureStatus.UNIT_TESTING_PASSED, 
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
    ];
    const found = mockFeatures.find(f => f.id === featureId);
    if (found) {
      setFeature(found);
    }
  }, [featureId]);

  const startAnalysis = async (name: string) => {
    setWorkflowState('analyzing_astree');
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let mockAstree = '';
    if (name === 'MonEmmBatTm') {
      mockAstree = `
# Astree Static Analysis Report
**Module:** ${name}
**Tool Version:** 24.04
**Target:** MB.OS Core v3.2

## Summary
The repository contains an auto-generated AUTOSAR software component designed for a Mercedes-Benz vehicle. The module, MonEmmBatTm, monitors the battery system for critical errors and ensures a "Safe State" is requested if a persistent fault is detected.

- **Total Alarms:** 0
- **Errors:** 0
- **Warnings:** 0
- **Safe Operations:** 1420

## Detailed Findings
The analysis found no warnings, errors, or suggestions for improvement in the code.
      `;
    } else if (name === 'DcpChassis') {
      mockAstree = `
# Astree Static Analysis Report
**Module:** ${name}
**Tool Version:** 24.04
**Target:** MB.OS Core v3.2

## Summary
The repository contains an auto-generated AUTOSAR software component for a Mercedes-Benz chassis control system. The module, DcpChassis, processes signals related to vehicle dynamics, such as wheel speeds, steering angles, torque requests, and ESP status.

- **Total Alarms:** 12
- **Errors:** 0
- **Warnings:** 12 (Data range constraints)
- **Safe Operations:** 2150

## Detailed Findings
The analysis identified 12 warnings, all categorized as Alarm (A), indicating potential issues with data range constraints.
1. **ALARM [Range Constraint]:** Maximum physical limit mismatch for DcpChassis_AgStrw at line 10594.
2. **ALARM [Range Constraint]:** Maximum physical limit mismatch for DcpChassis_TqWhlSumEcoAssiReq at line 7600.
      `;
    } else {
      mockAstree = `
# Astree Static Analysis Report
**Module:** ${name}
**Tool Version:** 24.04
**Target:** MB.OS Core v3.2

## Summary
- **Total Alarms:** 3
- **Errors:** 1 (Potential Null Pointer Dereference)
- **Warnings:** 2 (Unused variables, Implicit type conversion)
- **Safe Operations:** 1420

## Detailed Findings
1. **ALARM [Null Pointer]:** Possible dereference of pointer 'p_sensor_data' at line 442 in \`acc_logic.c\`.
2. **WARNING [Type Conversion]:** Implicit conversion from 'float64' to 'float32' at line 128 in \`acc_math.h\`.
3. **WARNING [Unused Variable]:** Variable 'last_error_state' is defined but never used in \`acc_main.c\`.
      `;
    }

    setAstreeReport(mockAstree);
    setWorkflowState('analyzing_ai');
    const analysis = await analyzeStaticCode(name, mockAstree);
    setAiAnalysis(analysis);
    setWorkflowState('review');
    setIsProcessing(false);
  };

  const startUnitTesting = async () => {
    setUnitTestSubStep('fetching_files');
    setIsProcessing(true);
    
    // Step 1: Fetch relevant files
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Step 2: Run Tessy
    setUnitTestSubStep('running_tessy');
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Step 3: Generate Summary
    setUnitTestSubStep('generating_summary');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let mockTessy = '';
    let coverage = 78;

    if (feature?.name === 'MonEmmBatTm') {
      coverage = 92;
      mockTessy = `
# Tessy Unit Test Report
**Module:** ${feature?.name}
**Tool:** Tessy v5.1
**Date:** ${new Date().toLocaleDateString()}

## Test Results
- **Total Test Cases:** 15
- **Passed:** 15
- **Failed:** 0
- **Coverage (C1):** 92%

## Coverage Analysis
- Statement Coverage: 95%
- Branch Coverage: 92%
- MC/DC: 88%

## Technical Summary
All test cases for MonEmmBatTm executed successfully. The module correctly monitors the battery system and triggers the "Safe State" under simulated fault conditions.
      `;
    } else if (feature?.name === 'DtrTqshRbs') {
      coverage = 95;
      mockTessy = `
# Tessy Unit Test Report
**Module:** ${feature?.name}
**Tool:** Tessy v5.1
**Date:** ${new Date().toLocaleDateString()}

## Test Results
- **Total Test Cases:** 21
- **Passed:** 21
- **Failed:** 0
- **Coverage (C1):** 95%

## Coverage Analysis
- Statement Coverage: 98%
- Branch Coverage: 95%
- MC/DC: 90%

## Technical Summary
Test cases for DtrTqshRbs cover saturation logic, delay logic, and final output processing.
- **TC_5:** Testing SDtrTqshRbs25_Abs <= 2 Condition (Passed)
- **TC_6:** Testing SDtrTqshRbs25_Diff >= 0 Condition (Passed)
- **TC_7:** Testing Saturation Logic (Passed)
- **TC_8:** Testing Delay Logic (Passed)
- **TC_9:** Testing Final Output (Passed)
      `;
    } else if (feature?.name === 'DcpChassis') {
      coverage = 72;
      mockTessy = `
# Tessy Unit Test Report
**Module:** ${feature?.name}
**Tool:** Tessy v5.1
**Date:** ${new Date().toLocaleDateString()}

## Test Results
- **Total Test Cases:** 35
- **Passed:** 30
- **Failed:** 5
- **Coverage (C1):** 72%

## Failed Scenarios
1. **TC_DCP_012:** Maximum physical limit mismatch for DcpChassis_AgStrw.
2. **TC_DCP_015:** Maximum physical limit mismatch for DcpChassis_TqWhlSumEcoAssiReq.
3. **TC_DCP_022:** Unexpected behavior during high-speed cornering simulation.
4. **TC_DCP_028:** Torque request processing delay exceeded threshold.
5. **TC_DCP_031:** ESP status signal loss handling failed.

## Coverage Analysis
- Statement Coverage: 75%
- Branch Coverage: 72%
- MC/DC: 60%
      `;
    } else {
      coverage = 78;
      mockTessy = `
# Tessy Unit Test Report
**Module:** ${feature?.name}
**Tool:** Tessy v5.1
**Date:** ${new Date().toLocaleDateString()}

## Test Results
- **Total Test Cases:** 42
- **Passed:** 38
- **Failed:** 4
- **Coverage (C1):** 78%

## Failed Scenarios
1. **TC_ACC_012:** Target distance < 0.5m (Boundary condition failure)
2. **TC_ACC_028:** Sensor timeout during active state
3. **TC_ACC_031:** Invalid checksum in CAN message
4. **TC_ACC_040:** Emergency override during calibration

## Coverage Analysis
- Statement Coverage: 82%
- Branch Coverage: 78%
- MC/DC: 65%
      `;
    }

    setUnitTestReport(mockTessy);
    setCoverageScore(coverage);
    
    // Step 4: AI Analysis of Unit Testing
    setUnitTestSubStep('generating_summary');
    const analysis = await analyzeUnitTesting(feature?.name || '', mockTessy);
    setUnitTestAIAnalysis(analysis);
    
    setUnitTestSubStep('review');
    setIsProcessing(false);
    
  };

  const startIntegration = async (shouldPass: boolean) => {
    setIntegrationState('integrating');
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    if (shouldPass) {
      setIntegrationState('passed');
      setIntegrationReport(`
# Integration Success Report
**Module:** ${feature?.name}
**Status:** PASSED
**Environment:** MB.OS Core v3.2 Stage
**Timestamp:** ${new Date().toLocaleString()}

All integration hooks verified. No regressions detected in core safety modules.
      `);
    } else {
      setIntegrationState('failed');
      let mockFailReport = '';
      if (feature?.name === 'DcpChassis') {
        mockFailReport = `
# Integration Failure Report
**Module:** ${feature?.name}
**Status:** FAILED
**Error Code:** MBOS_INT_ERR_084
**Component:** Chassis_Control_Interface

**Error Details:**
Integration tests failed due to unhandled exceptions when processing wheel speed signals under simulated high-load conditions. The module failed to maintain the required update rate of 10ms.

**Knowledge Base Match:**
Similar issue found in 'feat/esp-v2' (Jan 2026). 
Root cause was an inefficient loop structure in the signal processing task.
        `;
      } else {
        mockFailReport = `
# Integration Failure Report
**Module:** ${feature?.name}
**Status:** FAILED
**Error Code:** MBOS_INT_ERR_042
**Component:** CAN_Gateway_Interface

**Error Details:**
Incompatible message buffer size detected during high-frequency data burst. 
Expected: 256 bytes, Received: 512 bytes.

**Knowledge Base Match:**
Similar issue found in 'feat/radar-v1' (Oct 2025). 
Root cause was an unaligned memory allocation in the gateway driver.
        `;
      }
      setIntegrationReport(mockFailReport);
      const analysis = await analyzeIntegration(feature?.name || '', mockFailReport);
      setIntegrationAIAnalysis(analysis);
    }
    setIsProcessing(false);
  };

  const handleApprove = () => {
    if (currentStep === 0) {
      setCurrentStep(1);
    } else if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      navigate('/');
    }
  };

  const handleReject = () => {
    alert("Analysis Rejected. Please fix the Model & Source Code and retrigger the process.");
    if (currentStep === 0) {
      startAnalysis(feature?.name || '');
    } else {
      startUnitTesting();
    }
  };

  if (!feature) return <div className="p-8 text-center">Loading feature data...</div>;

  const currentStageLabel = STAGE_LABELS[currentStep] || STAGE_LABELS[0];
  const staticWorkspaceReports = buildStaticReports(feature.name, astreeReport);
  const unitWorkspaceReports = buildUnitReports(feature.name, unitTestReport, coverageScore);
  const integrationWorkspaceReports = buildIntegrationReports(feature.name, integrationReport, integrationState);
  const splitViewHeight = 'h-[calc(100vh-280px)] min-h-[620px] max-h-[920px]';
  const isStaticReview = currentStep === 0 && workflowState === 'review';
  const isUnitReview = currentStep === 1 && unitTestSubStep === 'review';
  const isIntegrationReview = currentStep === 2 && integrationState === 'failed';

  return (
    <div className="flex gap-5 max-w-[1680px] mx-auto">
      <div className="flex-1 min-w-0">
        <div className="panel-card rounded-[24px] mb-4 px-4 py-3 flex flex-col gap-3 xl:grid xl:grid-cols-[minmax(0,380px)_minmax(0,1fr)_auto] xl:items-center">
          <div className="flex items-center gap-3 min-w-0">
            <button 
              onClick={() => navigate('/')}
              className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="w-10 h-10 bg-[#2824D6] rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
              {feature.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-bold text-gray-900 tracking-tight">{feature.name}</h1>
                <span className="px-2 py-0.5 bg-orange-50 text-orange-600 border border-orange-100 rounded-full text-xs font-semibold flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  In-Review
                </span>
                <span className="px-2 py-0.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-full text-xs font-semibold">
                  {currentStageLabel}
                </span>
              </div>
              <div className="text-[13px] text-gray-500 font-medium mt-1 truncate">{feature.repository} · {feature.branchName}</div>
            </div>
          </div>

          <div className="min-w-0 xl:px-4">
            <Stepper currentStep={currentStep} />
          </div>

          <div className="flex flex-col gap-2 xl:items-end">
            <div className="hidden xl:flex items-center gap-2 text-xs text-gray-400">
              <span>Dashboard</span>
              <span>/</span>
              <span>{feature.name}</span>
            </div>
            {isStaticReview && (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center xl:justify-end">
                <span className="text-sm font-bold text-gray-900">Review Required</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReject}
                    className="px-4 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <X size={14} /> Reject
                  </button>
                  <button
                    onClick={handleApprove}
                    className="px-4 py-1.5 bg-[#2824D6] hover:bg-indigo-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Check size={14} /> Approve
                  </button>
                </div>
              </div>
            )}
            {isUnitReview && (
              <div className="flex flex-col gap-2 xl:items-end">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-bold text-gray-900">Unit Testing Complete</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.18em]">Coverage</span>
                    <span className={`text-lg font-bold ${coverageScore < 85 ? 'text-amber-600' : 'text-emerald-600'}`}>{coverageScore}%</span>
                    <div className="w-24 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ${coverageScore < 85 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${coverageScore}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReject}
                    className="px-4 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw size={13} /> Reject
                  </button>
                  <button
                    onClick={handleApprove}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Check size={13} /> Approve
                  </button>
                </div>
              </div>
            )}
            {isIntegrationReview && (
              <div className="flex flex-col gap-2 xl:items-end">
                <span className="text-sm font-bold text-gray-900">Integration Failed</span>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setIntegrationState('idle')}
                    className="px-4 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg transition-all flex items-center gap-2"
                  >
                    <RotateCcw size={14} />
                    Retry
                  </button>
                  <button 
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-2"
                  >
                    <AlertCircle size={14} />
                    Flag Issue
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {currentStep === 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {workflowState === 'idle' && (
              <div className="panel-card rounded-[28px] px-6 py-8 sm:px-8 sm:py-10 text-center">
                 <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[22px] flex items-center justify-center mx-auto mb-6 shadow-inner">
                   <ShieldCheck size={40} />
                 </div>
                 <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Static Analysis Stage</h2>
                 <p className="text-gray-500 mt-3 mb-8 max-w-lg mx-auto leading-relaxed">
                   The module is ready for static code analysis. We will run Astree to verify runtime errors and assertion violations.
                 </p>
                 <button 
                   onClick={() => startAnalysis(feature?.name || '')}
                   className="px-8 py-3.5 bg-indigo-800 hover:bg-indigo-900 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 transition-all flex items-center gap-3 mx-auto"
                 >
                   <Play size={20} fill="currentColor" />
                   Start Static Analysis
                 </button>
              </div>
            )}

            {workflowState === 'analyzing_astree' && (
              <div className="panel-card rounded-[28px] px-6 py-8 sm:px-8 sm:py-10 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 bg-indigo-50 rounded-[20px] flex items-center justify-center mb-5">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Running Astree Static Analysis</h3>
                <p className="text-sm text-gray-500 mt-2 max-w-md">
                  Analyzing C code for runtime errors, assertion violations, and data races using MBRDI toolchain...
                </p>
              </div>
            )}

            {workflowState === 'analyzing_ai' && (
              <div className="panel-card rounded-[28px] px-6 py-8 sm:px-8 sm:py-10 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 bg-emerald-50 rounded-[20px] flex items-center justify-center mb-5 relative">
                  <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CheckCircle className="text-emerald-500" size={20} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Astree Complete. Triggering AI Analysis...</h3>
                <p className="text-sm text-gray-500 mt-2 max-w-md">
                  Our Generative AI is now reviewing the findings to provide safety insights and fix recommendations.
                </p>
              </div>
            )}            {workflowState === 'review' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {/* Workspace / Relevant Files */}
                  <div className={`panel-card rounded-[26px] flex flex-col ${splitViewHeight} overflow-hidden`}>
                    <FileViewer files={staticFiles} />
                  </div>

                  <div className={splitViewHeight}>
                    <ReportWorkspace
                    title="Review Workspace"
                    subtitle="Switch between saved reports and contextual tools without leaving the workflow."
                    reports={staticWorkspaceReports}
                    defaultTool="analysis"
                    analysisReport={aiAnalysis}
                    analysisTool="analysis"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {unitTestSubStep === 'idle' && (
              <div className="panel-card rounded-[28px] px-6 py-8 sm:px-8 sm:py-10 text-center">
                 <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[22px] flex items-center justify-center mx-auto mb-6 shadow-inner">
                   <ShieldCheck size={40} />
                 </div>
                 <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Unit Testing Stage</h2>
                 <p className="text-gray-500 mt-3 mb-8 max-w-lg mx-auto leading-relaxed">
                   The static analysis was successful. We will now perform unit testing using the Tessy toolchain to verify component logic.
                 </p>
                 <button 
                   onClick={startUnitTesting}
                   className="px-8 py-3.5 bg-indigo-800 hover:bg-indigo-900 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 transition-all flex items-center gap-3 mx-auto"
                 >
                   <Play size={20} fill="currentColor" />
                   Start Unit Testing Flow
                 </button>
              </div>
            )}

            {(unitTestSubStep === 'fetching_files' || unitTestSubStep === 'running_tessy' || unitTestSubStep === 'generating_summary') && (
              <div className="panel-card rounded-[28px] px-6 py-8 sm:px-8 sm:py-10 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 bg-indigo-50 rounded-[20px] flex items-center justify-center mb-6">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {unitTestSubStep === 'fetching_files' && 'Fetching Relevant Source Files...'}
                  {unitTestSubStep === 'running_tessy' && 'Executing Unit Tests on Tessy...'}
                  {unitTestSubStep === 'generating_summary' && 'Generating Testing Summary...'}
                </h3>
                <div className="w-full max-w-md bg-gray-100 h-1.5 rounded-full mt-6 overflow-hidden">
                  <div className={`h-full bg-indigo-600 transition-all duration-1000 ${
                    unitTestSubStep === 'fetching_files' ? 'w-1/3' : 
                    unitTestSubStep === 'running_tessy' ? 'w-2/3' : 'w-[95%]'
                  }`} />
                </div>
                <p className="text-sm text-gray-500 mt-4 font-medium">
                  {unitTestSubStep === 'fetching_files' && 'Identifying dependencies and test harnesses...'}
                  {unitTestSubStep === 'running_tessy' && 'Running 42 test cases in MB.OS simulation environment...'}
                  {unitTestSubStep === 'generating_summary' && 'Aggregating coverage data and failure reports...'}
                </p>
              </div>
            )}

            {unitTestSubStep === 'review' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {/* Workspace / Relevant Files */}
                  <div className={`panel-card rounded-[26px] flex flex-col ${splitViewHeight} overflow-hidden`}>
                    <FileViewer files={unitTestFiles} />
                  </div>

                  <div className={splitViewHeight}>
                    <ReportWorkspace
                    title="Review Workspace"
                    subtitle="Switch between saved reports and contextual tools without leaving the workflow."
                    reports={unitWorkspaceReports}
                    defaultTool="quality"
                    analysisReport={unitTestAIAnalysis}
                    analysisTool="quality"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {integrationState === 'idle' && (
              <div className="panel-card rounded-[28px] px-6 py-8 sm:px-8 sm:py-10 text-center">
                 <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[22px] flex items-center justify-center mx-auto mb-6 shadow-inner">
                   <Layers size={40} />
                 </div>
                 <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Integration Stage</h2>
                 <p className="text-gray-500 mt-3 mb-8 max-w-lg mx-auto leading-relaxed">
                   The unit tests have passed. We are now ready to integrate this feature into the MB.OS core environment.
                 </p>
                 <div className="flex items-center justify-center gap-4">
                   <button 
                     onClick={() => startIntegration(false)}
                     className="px-7 py-3.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all"
                   >
                     Test Failure Scenario
                   </button>
                   <button 
                     onClick={() => startIntegration(true)}
                     className="px-8 py-3.5 bg-indigo-800 hover:bg-indigo-900 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 transition-all flex items-center gap-3"
                   >
                     <Play size={20} fill="currentColor" />
                     Start Integration
                   </button>
                 </div>
              </div>
            )}

            {integrationState === 'integrating' && (
              <div className="panel-card rounded-[28px] px-6 py-8 sm:px-8 sm:py-10 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 bg-emerald-50 rounded-[20px] flex items-center justify-center mb-6">
                  <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Integrating with MB.OS Core...</h3>
                <div className="w-full max-w-md bg-gray-100 h-1.5 rounded-full mt-6 overflow-hidden">
                  <div className="h-full bg-emerald-600 animate-pulse w-3/4" />
                </div>
                <p className="text-sm text-gray-500 mt-4 font-medium">Verifying interface compatibility and safety constraints...</p>
              </div>
            )}

            {integrationState === 'passed' && (
              <div className="panel-card rounded-[28px] border border-emerald-100 px-6 py-8 sm:px-8 sm:py-10 text-center border-t-4 border-t-emerald-500">
                 <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[22px] flex items-center justify-center mx-auto mb-6 shadow-inner">
                   <CheckCircle size={40} />
                 </div>
                 <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Integration Successful</h2>
                 <p className="text-gray-500 mt-3 mb-8 max-w-lg mx-auto leading-relaxed">
                   The feature has been successfully integrated and verified. It is now ready for deployment to the main branch.
                 </p>
                 <button 
                   onClick={() => navigate('/')}
                   className="px-8 py-3.5 bg-indigo-800 hover:bg-indigo-900 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 transition-all"
                 >
                   Complete & Return to Dashboard
                 </button>
              </div>
            )}

            {integrationState === 'failed' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {/* Workspace / Relevant Files */}
                  <div className={`panel-card rounded-[26px] border border-red-100 flex flex-col ${splitViewHeight} overflow-hidden border-t-4 border-t-red-500`}>
                    <FileViewer files={integrationFiles} />
                  </div>

                  <div className={splitViewHeight}>
                    <ReportWorkspace
                    title="Review Workspace"
                    subtitle="Stay in context while switching between saved reports, handoff notes, and failure guidance."
                    reports={integrationWorkspaceReports}
                    defaultTool="integration"
                    analysisReport={integrationAIAnalysis}
                    analysisTool="integration"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
