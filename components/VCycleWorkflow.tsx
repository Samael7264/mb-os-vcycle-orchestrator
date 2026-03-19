import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, Circle, Clock, AlertCircle, ChevronRight, Play, Check, X, 
  ArrowLeft, ArrowRight, Loader2, Layers, Bot, Send, Activity, ShieldCheck, Github, 
  MessageSquare, GitBranch, BarChart2, RotateCcw, ChevronDown, User, FileText, MoreVertical,
  Code2, FileJson, FolderOpen, Eye
} from 'lucide-react';
import Markdown from 'react-markdown';
import { analyzeStaticCode, analyzeUnitTesting, analyzeIntegration, AIAnalysisReport } from '../services/geminiService';
import { Feature, FeatureStatus } from './Dashboard';
import { TestQualityTool } from './TestQualityTool';
import { SummaryTool } from './SummaryTool';
import { TestCaseTool } from './TestCaseTool';
import { UncoveredBranchesTool } from './UncoveredBranchesTool';

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
    <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6 w-full">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className={`flex items-center gap-2 ${index > currentStep ? 'opacity-50' : ''}`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold transition-all ${
              index < currentStep 
                ? 'bg-[#2824D6] text-white' 
                : index === currentStep 
                  ? 'bg-transparent border-2 border-[#2824D6] text-[#2824D6] ring-2 ring-[#2824D6]/20' 
                  : 'bg-gray-100 text-gray-400 border-2 border-transparent'
            }`}>
              {index < currentStep ? <Check size={12} strokeWidth={3} /> : <span className={`w-2 h-2 rounded-full ${index === currentStep ? 'bg-[#2824D6]' : 'bg-transparent'}`} />}
            </div>
            <span className={`text-sm font-semibold tracking-wide ${index === currentStep ? 'text-[#2824D6]' : 'text-gray-700'}`}>
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className="flex items-center justify-center px-2">
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

  return (
    <div className="flex h-full bg-white">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 flex flex-col bg-gray-50/50">
        <div className="p-4 border-b border-gray-200 flex items-center gap-2">
          <FolderOpen size={16} className="text-gray-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Workspace</span>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {files.map((file, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedFile(file)}
              className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors ${
                selectedFile.name === file.name 
                  ? 'bg-indigo-50 text-indigo-900 border-r-2 border-indigo-600' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {file.type === 'code' ? <Code2 size={16} className={selectedFile.name === file.name ? 'text-indigo-600' : 'text-gray-400'} /> : 
               file.type === 'report' ? <FileText size={16} className={selectedFile.name === file.name ? 'text-indigo-600' : 'text-gray-400'} /> : 
               <FileJson size={16} className={selectedFile.name === file.name ? 'text-indigo-600' : 'text-gray-400'} />}
              <span className="text-sm font-medium truncate">{file.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-4 border-b border-gray-200 flex items-center gap-2 bg-white">
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
  const [activeTool, setActiveTool] = useState<'quality' | 'summary' | 'testgen' | 'branches' | null>(null);

  // Unit Testing Specific State
  const [unitTestSubStep, setUnitTestSubStep] = useState<'idle' | 'fetching_files' | 'running_tessy' | 'generating_summary' | 'review'>('idle');
  const [unitTestReport, setUnitTestReport] = useState<string>('');
  const [unitTestAIAnalysis, setUnitTestAIAnalysis] = useState<AIAnalysisReport | null>(null);
  const [coverageScore, setCoverageScore] = useState<number>(0);
  const [showIntermediateTools, setShowIntermediateTools] = useState(false);

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
    
    // Intelligently show intermediate tools if coverage is low
    if (coverage < 85) {
      setShowIntermediateTools(true);
    } else {
      setShowIntermediateTools(false);
    }
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

  return (
    <div className="flex gap-8 max-w-[1600px] mx-auto">
      <div className="flex-1 min-w-0">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="w-10 h-10 bg-[#2824D6] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
              {feature.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">{feature.name}</h1>
                <span className="px-2 py-0.5 bg-orange-50 text-orange-600 border border-orange-100 rounded text-xs font-semibold flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  In-Review
                </span>
              </div>
              <div className="text-[13px] text-gray-500 font-medium mt-0.5">{feature.repository} · {feature.branchName}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2 shadow-sm">
              <Eye size={16} />
              Compare
            </button>
          </div>
        </div>

        <Stepper currentStep={currentStep} />

        {currentStep === 0 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {workflowState === 'idle' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
                 <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                   <ShieldCheck size={40} />
                 </div>
                 <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Static Analysis Stage</h2>
                 <p className="text-gray-500 mt-3 mb-10 max-w-lg mx-auto leading-relaxed">
                   The module is ready for static code analysis. We will run Astree to verify runtime errors and assertion violations.
                 </p>
                 <button 
                   onClick={() => startAnalysis(feature?.name || '')}
                   className="px-10 py-4 bg-indigo-800 hover:bg-indigo-900 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 transition-all flex items-center gap-3 mx-auto"
                 >
                   <Play size={20} fill="currentColor" />
                   Start Static Analysis
                 </button>
              </div>
            )}

            {workflowState === 'analyzing_astree' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-16 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Running Astree Static Analysis</h3>
                <p className="text-sm text-gray-500 mt-2 max-w-md">
                  Analyzing C code for runtime errors, assertion violations, and data races using MBRDI toolchain...
                </p>
              </div>
            )}

            {workflowState === 'analyzing_ai' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-16 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 relative">
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
              <div className="space-y-6">
                {/* Slim Action Bar */}
                <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-sm font-bold text-gray-900">Review Required</span>
                    <span className="ml-2 text-xs text-gray-400">Decide if this feature proceeds to Unit Testing.</span>
                  </div>
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

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {/* Workspace / Relevant Files */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-[600px] overflow-hidden">
                    <FileViewer files={staticFiles} />
                  </div>

                  {/* AI Analysis — tools in header dropdown */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-[600px] overflow-hidden">
                    <div className="p-3 bg-white border-b border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900">AI Safety Investigation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase">Gemini 3.1 Pro</span>
                        {/* Tools 3-dot menu */}
                        <div className="relative">
                          <button
                            id="static-tools-btn"
                            onClick={() => setActiveTool(activeTool === null ? 'quality' : null)}
                            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Open a report"
                          >
                            <MoreVertical size={15} />
                          </button>
                          {activeTool && (
                            <>
                              <div className="fixed inset-0 z-30" onClick={() => setActiveTool(null)} />
                              <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-40 overflow-hidden">
                                <div className="px-3 py-2 border-b border-gray-100">
                                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">Reports</p>
                                </div>
                                <button onClick={() => setActiveTool('quality')} className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
                                  <BarChart2 size={13} className="text-indigo-500" /> Code Quality Report
                                </button>
                                <button onClick={() => setActiveTool('summary')} className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
                                  <MessageSquare size={13} className="text-indigo-500" /> Code Explainer
                                </button>
                                <button onClick={() => setActiveTool('summary')} className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
                                  <FileText size={13} className="text-indigo-500" /> Code Summariser
                                </button>
                                <button onClick={() => setActiveTool('testgen')} className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
                                  <Eye size={13} className="text-indigo-500" /> Code Visualiser
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-white">
                      {aiAnalysis && <AIAnalysisSection report={aiAnalysis} />}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {unitTestSubStep === 'idle' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
                 <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                   <ShieldCheck size={40} />
                 </div>
                 <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Unit Testing Stage</h2>
                 <p className="text-gray-500 mt-3 mb-10 max-w-lg mx-auto leading-relaxed">
                   The static analysis was successful. We will now perform unit testing using the Tessy toolchain to verify component logic.
                 </p>
                 <button 
                   onClick={startUnitTesting}
                   className="px-10 py-4 bg-indigo-800 hover:bg-indigo-900 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 transition-all flex items-center gap-3 mx-auto"
                 >
                   <Play size={20} fill="currentColor" />
                   Start Unit Testing Flow
                 </button>
              </div>
            )}

            {(unitTestSubStep === 'fetching_files' || unitTestSubStep === 'running_tessy' || unitTestSubStep === 'generating_summary') && (
              <div className="bg-white rounded-2xl border border-gray-100 p-16 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-8">
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
              <div className="space-y-6">
                {/* Slim Action Header */}
                <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div>
                        <span className="text-sm font-bold text-gray-900">Unit Testing Complete</span>
                        <span className="ml-2 text-xs text-gray-400">Review coverage before proceeding.</span>
                      </div>
                      <div className="hidden sm:block w-px h-8 bg-gray-200"></div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Coverage</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-lg font-bold ${coverageScore < 85 ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {coverageScore}%
                          </span>
                          <div className="w-24 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-1000 ${coverageScore < 85 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              style={{ width: `${coverageScore}%` }}
                            />
                          </div>
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
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {/* Workspace / Relevant Files */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-[600px] overflow-hidden">
                    <FileViewer files={unitTestFiles} />
                  </div>

                  {/* AI Analysis — tools 3-dot in header */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-[600px] overflow-hidden">
                    <div className="p-3 bg-white border-b border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bot size={13} className="text-indigo-600" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900">AI Testing Analysis</span>
                      </div>
                      {/* Tools 3-dot */}
                      <div className="relative">
                        <button
                          onClick={() => setActiveTool(activeTool === null ? 'quality' : null)}
                          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Open a tool"
                        >
                          <MoreVertical size={15} />
                        </button>
                        {activeTool && (
                          <>
                            <div className="fixed inset-0 z-30" onClick={() => setActiveTool(null)} />
                            <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-40 overflow-hidden">
                              <div className="px-3 py-2 border-b border-gray-100">
                                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">Tools</p>
                              </div>
                              <button onClick={() => setActiveTool('quality')} className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
                                <BarChart2 size={13} className="text-indigo-500" /> Quality Report
                              </button>
                              <button onClick={() => setActiveTool('branches')} className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
                                <GitBranch size={13} className="text-indigo-500" /> Uncovered Branches
                              </button>
                              <button onClick={() => setActiveTool('testgen')} className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
                                <Eye size={13} className="text-indigo-500" /> Test Case Visualiser
                              </button>
                              <button onClick={() => setActiveTool('summary')} className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
                                <FileText size={13} className="text-indigo-500" /> TC Summariser
                              </button>
                              <button onClick={() => setActiveTool('testgen')} className="w-full text-left px-4 py-2.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 flex items-center gap-2.5">
                                <Bot size={13} className="text-indigo-600" /> Generate Tests
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-white">
                      {unitTestAIAnalysis && <AIAnalysisSection report={unitTestAIAnalysis} />}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {integrationState === 'idle' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
                 <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                   <Layers size={40} />
                 </div>
                 <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Integration Stage</h2>
                 <p className="text-gray-500 mt-3 mb-10 max-w-lg mx-auto leading-relaxed">
                   The unit tests have passed. We are now ready to integrate this feature into the MB.OS core environment.
                 </p>
                 <div className="flex items-center justify-center gap-4">
                   <button 
                     onClick={() => startIntegration(false)}
                     className="px-8 py-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all"
                   >
                     Test Failure Scenario
                   </button>
                   <button 
                     onClick={() => startIntegration(true)}
                     className="px-10 py-4 bg-indigo-800 hover:bg-indigo-900 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 transition-all flex items-center gap-3"
                   >
                     <Play size={20} fill="currentColor" />
                     Start Integration
                   </button>
                 </div>
              </div>
            )}

            {integrationState === 'integrating' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-16 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-8">
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
              <div className="bg-white rounded-2xl border border-emerald-100 p-16 text-center shadow-sm border-t-4 border-t-emerald-500">
                 <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                   <CheckCircle size={40} />
                 </div>
                 <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Integration Successful</h2>
                 <p className="text-gray-500 mt-3 mb-10 max-w-lg mx-auto leading-relaxed">
                   The feature has been successfully integrated and verified. It is now ready for deployment to the main branch.
                 </p>
                 <button 
                   onClick={() => navigate('/')}
                   className="px-10 py-4 bg-indigo-800 hover:bg-indigo-900 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 transition-all"
                 >
                   Complete & Return to Dashboard
                 </button>
              </div>
            )}

            {integrationState === 'failed' && (
              <div className="space-y-6">
                {/* Top Action Bar */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center justify-between shadow-sm">
                  <div>
                    <h4 className="font-bold text-gray-900">Integration Failed</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Review the AI recommendations below and decide how to proceed.</p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setIntegrationState('idle')}
                      className="px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-bold rounded-xl transition-all flex items-center gap-2"
                    >
                      <RotateCcw size={18} />
                      Retry Integration
                    </button>
                    <button 
                      className="px-8 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-red-500/20 flex items-center gap-2"
                    >
                      <AlertCircle size={18} />
                      Flag Critical Issue
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {/* Workspace / Relevant Files */}
                  <div className="bg-white rounded-2xl border border-red-100 shadow-sm flex flex-col h-[600px] overflow-hidden border-t-4 border-t-red-500">
                    <FileViewer files={integrationFiles} />
                  </div>

                  {/* AI Analysis */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col h-[600px] overflow-hidden">
                    <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bot size={14} className="text-indigo-600" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900">AI Fix Recommendation</span>
                      </div>
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-white">
                      {integrationAIAnalysis && <AIAnalysisSection report={integrationAIAnalysis} />}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tool Modal Overlay */}
      {activeTool && (
        <div className="fixed inset-0 z-50 flex flex-col bg-gray-900/50 backdrop-blur-sm p-8 animate-in fade-in duration-200">
          <div className="bg-[#F7F8FA] flex-1 rounded-2xl shadow-2xl flex flex-col overflow-hidden relative max-w-[1600px] w-full mx-auto ring-1 ring-white/20">
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Bot size={18} />
                 </div>
                 <h3 className="font-bold text-gray-900 text-lg">MB.OS Agent Tool</h3>
               </div>
               <button 
                onClick={() => setActiveTool(null)}
                className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-900 rounded-xl transition-colors"
                aria-label="Close Tool"
               >
                <X size={20} />
               </button>
            </div>
            <div className="flex-1 overflow-y-auto w-full mx-auto py-8">
              {activeTool === 'quality' && <TestQualityTool />}
              {activeTool === 'summary' && <SummaryTool />}
              {activeTool === 'testgen' && <TestCaseTool />}
              {activeTool === 'branches' && <UncoveredBranchesTool />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
