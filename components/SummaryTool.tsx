import React, { useState } from 'react';
import { FileText, Loader2, Settings, Link as LinkIcon, RefreshCw, ArrowRight, AlertTriangle, Pin, Search, Check, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

// Mock Data matching the wireframe
const MOCK_SUMMARY_DATA = {
  testCaseId: "3",
  associatedSpecsCount: 1,
  testStepsCount: 9,
  warning: "Potential wrong linking of requirement id to the test case: PV_EMM-87779",
  associatedSpecs: ["PV_EMM-87779"],
  generalSummary: "This test case validates the status monitoring logic for the DCDC converter's interlock signal (MonEmmRxDcdc_StIntrlc01). It verifies that an incoming integer state is correctly interpreted as an 'Error' or 'Invalid' condition by comparing it against configurable bitmasks (MonEmmInpCfg_MaskIntrlcErrDcdc01_P and MonEmmInpCfg_MaskIntrlcInvldDcdc01_P). The test also confirms the functionality of an external override flag (MonEmmRxDcdc_FlgStIntrlc01Invld) that can force an invalid output status. The analysis suggests a potential traceability issue, as the test logic aligns with specification PV_EMM-92895 shown in the model, not the linked ID PV_EMM-87779.",
  steps: [
    {
      id: "3.1",
      description: "Verifies that input state '0' is correctly identified as an 'Invalid' condition based on the configuration of MonEmmInpCfg_MaskIntrlcInvldDcdc01_P.",
      completed: true
    },
    {
      id: "3.2",
      description: "Verifies that input state '1' is correctly identified as an 'Error' condition based on the configuration of MonEmmInpCfg_MaskIntrlcErrDcdc01_P.",
      completed: true
    },
    {
      id: "3.6",
      description: "Tests an alternative mask configuration where all error states are disabled (MaskIntrlcErrDcdc01_P =0) and all states are considered invalid (MaskIntrlcInvldDcdc01_P =255).",
      completed: true
    },
    {
      id: "3.7",
      description: "Tests a boundary condition where an input state is configured to be both an 'Error' and 'Invalid' state simultaneously by setting both mask parameters to 255.",
      completed: true
    },
    {
      id: "3.8",
      description: "Validates the override logic by setting the MonEmmRxDcdc_FlgStIntrlc01Invld input flag, forcing the output to be 'Invalid' regardless of the mask parameters.",
      completed: true
    },
    {
      id: "3.9",
      description: "Confirms the persistence of the invalid override logic from the previous step, ensuring the OR-logic for the invalid flag functions correctly.",
      completed: true
    }
  ],
  conclusion: "The test case systematically covers the bitmasking logic for various input states and parameter configurations, including nominal, error, invalid, and combined conditions. It also successfully validates the external invalid override functionality."
};

export const SummaryTool: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [analysisMode, setAnalysisMode] = useState('with-req');
  const [testCaseIds, setTestCaseIds] = useState('1, 2, 3');
  
  // Link inputs
  const [xmlLink, setXmlLink] = useState('');
  const [excelLink, setExcelLink] = useState('');
  const [arxmlLink, setArxmlLink] = useState('');

  // Step expansion state
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({
    "3.1": true, "3.2": true, "3.6": true, "3.7": true, "3.8": true, "3.9": true
  });

  const toggleStep = (id: string) => {
    setExpandedSteps(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setShowResult(false);
    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
      setShowResult(true);
    }, 2000);
  };

  const handleReset = () => {
    setShowResult(false);
  };

  return (
    <div className="h-full flex flex-col bg-[#F7F8FA]">
      {showResult ? (
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
            
            {/* Header Metrics */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 grid grid-cols-3 gap-8">
              <div>
                <div className="text-sm text-gray-500 mb-1">Test Case ID</div>
                <div className="text-4xl font-light text-gray-900">{MOCK_SUMMARY_DATA.testCaseId}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Associated Specs</div>
                <div className="text-4xl font-light text-gray-900">{MOCK_SUMMARY_DATA.associatedSpecsCount}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Test Steps</div>
                <div className="text-4xl font-light text-gray-900">{MOCK_SUMMARY_DATA.testStepsCount}</div>
              </div>
            </div>

            {/* Warning Banner */}
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 flex items-center gap-3 text-yellow-800 text-sm">
              <AlertTriangle size={16} className="text-yellow-600 flex-shrink-0" />
              <span className="font-medium">Warning:</span> {MOCK_SUMMARY_DATA.warning}
            </div>

            {/* Associated Specifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Pin className="text-pink-500" size={20} />
                Associated Specifications
              </h3>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex flex-wrap gap-2">
                  {MOCK_SUMMARY_DATA.associatedSpecs.map((spec, idx) => (
                    <span key={idx} className="text-blue-700 font-medium text-sm">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* General Summary */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FileText className="text-orange-500" size={20} />
                General Summary
              </h3>
              <div className="bg-emerald-50 rounded-lg p-6 border border-emerald-100 text-emerald-900 leading-relaxed text-sm">
                {MOCK_SUMMARY_DATA.generalSummary}
              </div>
            </div>

            {/* Test Steps Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Search className="text-blue-500" size={20} />
                Test Steps Details
              </h3>
              <div className="space-y-4">
                {MOCK_SUMMARY_DATA.steps.map((step) => (
                  <div key={step.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <button 
                      onClick={() => toggleStep(step.id)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 border-b border-gray-100 hover:bg-gray-100 transition-colors"
                    >
                      <span className="font-semibold text-gray-900 text-sm">Step {step.id}</span>
                      {expandedSteps[step.id] ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
                    </button>
                    
                    {expandedSteps[step.id] && (
                      <div className="p-6 space-y-4">
                        <div>
                          <div className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Description:</div>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {step.description.split(/(`.*?`)/).map((part, i) => 
                              part.startsWith('`') && part.endsWith('`') ? 
                                <code key={i} className="bg-gray-100 text-pink-600 px-1 py-0.5 rounded font-mono text-xs">{part.slice(1, -1)}</code> : 
                                <span key={i}>{part}</span>
                            )}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Check size={14} className="text-gray-900" />
                            Step Completed
                          </div>
                          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-full rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Conclusion */}
            <div className="space-y-4 pb-12">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <div className="bg-emerald-500 rounded text-white p-0.5">
                  <Check size={16} />
                </div>
                Conclusion
              </h3>
              <div className="bg-emerald-50 rounded-lg p-6 border border-emerald-100 text-emerald-900 leading-relaxed text-sm">
                {MOCK_SUMMARY_DATA.conclusion}
              </div>
            </div>

            <div className="flex justify-center pb-8">
               <button 
                  onClick={handleReset}
                  className="px-6 py-3 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shadow-lg"
               >
                  <RefreshCw size={16} />
                  Analyze Another Case
               </button>
            </div>

          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-4">
           <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-black p-8 text-center relative overflow-hidden">
                 <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
                    <FileText size={36} className="text-white" />
                 </div>
                 <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Ready to Analyze</h2>
                 <p className="text-gray-400 text-sm">Configure analysis parameters and provide file links to generate a summary.</p>
              </div>
              
              <div className="p-8 space-y-8">
                 {/* Configuration Section */}
                 <div className="grid grid-cols-2 gap-8">
                    <div>
                        <label className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 block flex items-center gap-2">
                           <Settings size={14} /> Analysis Mode
                        </label>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer group">
                                <input type="radio" name="mode" className="text-black focus:ring-black" checked={analysisMode === 'with-req'} onChange={() => setAnalysisMode('with-req')} />
                                <span className="group-hover:text-black transition-colors">With Requirements</span>
                            </label>
                            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer group">
                                <input type="radio" name="mode" className="text-black focus:ring-black" checked={analysisMode === 'without-req'} onChange={() => setAnalysisMode('without-req')} />
                                <span className="group-hover:text-black transition-colors">Without Requirements</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 block">Test Case Numbers</label>
                        <input 
                          type="text" 
                          value={testCaseIds}
                          onChange={(e) => setTestCaseIds(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                          placeholder="e.g. 1, 2, 3"
                        />
                    </div>
                 </div>

                 {/* Links Section */}
                 <div>
                    <label className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 block flex items-center gap-2">
                        <LinkIcon size={14} /> Resource Links
                    </label>
                    <div className="space-y-4">
                        <input 
                            type="text" 
                            value={xmlLink}
                            onChange={(e) => setXmlLink(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="Paste XML Test Report URL..."
                        />
                        <input 
                            type="text" 
                            value={excelLink}
                            onChange={(e) => setExcelLink(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="Paste Excel Requirements URL..."
                        />
                        <input 
                            type="text" 
                            value={arxmlLink}
                            onChange={(e) => setArxmlLink(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="Paste ARXML File URL..."
                        />
                    </div>
                 </div>

                 <div className="pt-4">
                    <button 
                      onClick={handleGenerate}
                      disabled={loading}
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow-md transition-all hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
                    >
                      {loading ? <Loader2 size={20} className="animate-spin" /> : (
                          <>
                            Generate Summary <ArrowRight size={18} />
                          </>
                      )}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
