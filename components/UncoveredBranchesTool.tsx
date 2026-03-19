import React, { useState } from 'react';
import { GitBranch, AlertCircle, Play, Link as LinkIcon, RefreshCw, ArrowRight, Folder, FileText, Activity, Layers, ArrowDown, Database, CheckCircle2, AlertTriangle, Code2 } from 'lucide-react';

export const UncoveredBranchesTool: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(false);
  const [folderLink, setFolderLink] = useState('');

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setResult(true);
    }, 1500);
  };

  const handleReset = () => {
    setResult(false);
  };

  return (
    <div className="h-full flex flex-col">
      {result ? (
        <div className="flex-1 flex flex-col min-h-0">
           <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
             <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <GitBranch className="text-black" size={20} />
                Branch Analysis Results
             </h2>
             <button 
                onClick={handleReset}
                className="px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded transition-colors flex items-center gap-2"
             >
                <RefreshCw size={16} />
                Analyze New Branch
             </button>
          </div>

          <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-y-auto p-8">
             {/* Report Header */}
            <div className="text-center mb-10 pb-6 border-b border-gray-100">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Branch Coverage Analysis Report</h1>
                <p className="text-gray-500 text-sm">Analysis of Uncovered Branches in C Code</p>
                <div className="mt-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-100">
                        <AlertTriangle size={12} className="mr-1.5" /> Uncovered Branches Detected
                    </span>
                </div>
            </div>

            {/* Overview */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                    <div className="p-2 bg-gray-100 rounded text-gray-700"><FileText size={20} /></div>
                    <h2 className="text-lg font-bold text-gray-900">Analysis Overview</h2>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm">
                    Based on the analysis of the provided C code and coverage data, untested code branches and their corresponding data flow maps have been identified within a single logical unit responsible for handling the plausibility check for <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-800 font-mono text-xs font-semibold">MonEmmBatTm_TDlySafeSt_P</code>.
                </p>
            </div>

            {/* Extracted Code Block */}
            <h2 className="text-xl font-bold text-gray-900 mb-4 pl-4 border-l-4 border-black">Extracted Code Block</h2>
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-50 rounded text-orange-600"><AlertTriangle size={20} /></div>
                        <h2 className="text-lg font-bold text-gray-900">Uncovered Branch Location</h2>
                    </div>
                    <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded border border-orange-100 font-mono">Marker: ****** 0 |</span>
                </div>
                <pre className="bg-gray-900 text-gray-300 p-5 rounded-lg overflow-x-auto font-mono text-sm leading-relaxed border border-gray-800">
{`if (X_SMonEmmBatTm17_memoryDelayLength) {
    X_SMonEmmBatTm17_memoryR = (uint8) (SMonEmmBatTm17_switchR2 - ((uint8) 1));
} else {
    X_SMonEmmBatTm17_memoryR = SMonEmmBatTm17_switchR2;
}`}
                </pre>
            </div>

            {/* Signal Extraction */}
            <h2 className="text-xl font-bold text-gray-900 mb-4 pl-4 border-l-4 border-black">Signal Extraction</h2>
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="p-2 bg-blue-50 rounded text-blue-600"><Activity size={20} /></div>
                    <h2 className="text-lg font-bold text-gray-900">Identified Signals</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Input Signals</h4>
                        <p className="text-sm text-gray-500 italic flex items-center gap-2"><ArrowRight size={14} className="opacity-0"/> None directly found</p>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Output Signals</h4>
                        <p className="text-sm text-gray-500 italic flex items-center gap-2"><ArrowRight size={14} className="opacity-0"/> None directly found</p>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Local / Backward Trackable</h4>
                        <ul className="space-y-3">
                            {['X_SMonEmmBatTm17_memoryDelayLength', 'X_SMonEmmBatTm17_memoryR', 'SMonEmmBatTm17_switchR2'].map(sig => (
                                <li key={sig} className="flex items-start gap-2 text-sm text-gray-700 font-mono font-medium group">
                                    <ArrowRight size={14} className="text-blue-500 mt-1 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                                    <span className="break-all">{sig}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Recursive Backward Tracking */}
            <h2 className="text-xl font-bold text-gray-900 mb-4 pl-4 border-l-4 border-black">Recursive Backward Tracking</h2>
            
            <div className="space-y-4 mb-10">
                {/* Item 1 */}
                <div className="bg-gray-50 rounded-lg p-5 border-l-4 border-blue-500 shadow-sm">
                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2 font-mono">
                         X_SMonEmmBatTm17_memoryDelayLength
                    </h4>
                    <pre className="bg-white border border-gray-200 text-gray-700 p-3 rounded font-mono text-xs overflow-x-auto mb-3">
X_SMonEmmBatTm17_memoryDelayLength = SMonEmmBatTm17_switchR2 &gt; 0;
                    </pre>
                    <div className="pt-3 border-t border-gray-200/50 border-dashed">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Dependencies</div>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-[10px] font-mono border border-blue-100">SMonEmmBatTm17_switchR2</span>
                        </div>
                    </div>
                </div>

                {/* Item 2 */}
                <div className="bg-gray-50 rounded-lg p-5 border-l-4 border-blue-500 shadow-sm">
                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2 font-mono">
                        SMonEmmBatTm17_switchR2
                    </h4>
                    <pre className="bg-white border border-gray-200 text-gray-700 p-3 rounded font-mono text-xs overflow-x-auto mb-3">
{`if (SMonEmmBatTm17_logOpR) {
    SMonEmmBatTm17_switchR2 = Rte_Prm_R_MonEmmBatTm_TDlySafeSt_P_MonEmmBatTm_TDlySafeSt_P();
} else {
    SMonEmmBatTm17_switchR2 = X_SMonEmmBatTm17_memoryR;
}`}
                    </pre>
                    <div className="pt-3 border-t border-gray-200/50 border-dashed">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Dependencies</div>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-[10px] font-mono border border-blue-100">SMonEmmBatTm17_logOpR</span>
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-[10px] font-mono border border-blue-100">Rte_Prm...TDlySafeSt_P...</span>
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-[10px] font-mono border border-blue-100">X_SMonEmmBatTm17_memoryR</span>
                        </div>
                    </div>
                </div>

                 {/* Item 3 */}
                 <div className="bg-gray-50 rounded-lg p-5 border-l-4 border-blue-500 shadow-sm">
                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2 font-mono">
                        SMonEmmBatTm17_logOpR
                    </h4>
                    <pre className="bg-white border border-gray-200 text-gray-700 p-3 rounded font-mono text-xs overflow-x-auto mb-3">
SMonEmmBatTm17_logOpR = X_SMonEmmBatTm20_memorySysInit && X_SMonEmmBatTm17_memoryDelayLength;
                    </pre>
                    <div className="pt-3 border-t border-gray-200/50 border-dashed">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Dependencies</div>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-[10px] font-mono border border-blue-100">X_SMonEmmBatTm20_memorySysInit</span>
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-[10px] font-mono border border-blue-100">X_SMonEmmBatTm17_memoryDelayLength</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="my-10 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

            {/* Forward Tracking */}
            <h2 className="text-xl font-bold text-gray-900 mb-4 pl-4 border-l-4 border-black">Forward Tracking of Output Signals</h2>
            <div className="space-y-4 mb-10">
                <div className="bg-gray-50 rounded-lg p-5 border-l-4 border-emerald-500 shadow-sm">
                    <h4 className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2 font-mono">
                        MonEmmBatTm_FlgSafeStReq (Output)
                    </h4>
                    <pre className="bg-white border border-gray-200 text-gray-700 p-3 rounded font-mono text-xs overflow-x-auto mb-3">
Rte_IWrite_MonEmmBatTm_P_MonEmmBatTm_FlgSafeStReq_MonEmmBatTm_FlgSafeStReq(X_SMonEmmBatTm19_Memory_Y);
                    </pre>
                    <div className="pt-3 border-t border-gray-200/50 border-dashed">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Dependencies</div>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-[10px] font-mono border border-emerald-100">X_SMonEmmBatTm19_Memory_Y</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="my-10 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

            {/* Consolidated Data Flow Map */}
            <h2 className="text-xl font-bold text-gray-900 mb-4 pl-4 border-l-4 border-black">Consolidated Data Flow Map</h2>
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                    <div className="p-2 bg-purple-50 rounded text-purple-600"><Layers size={20} /></div>
                    <h2 className="text-lg font-bold text-gray-900">Signal Flow Visualization</h2>
                </div>
                
                <div className="flex flex-col items-center gap-3 w-full max-w-2xl mx-auto">
                    {/* Top Inputs */}
                    <div className="flex flex-wrap justify-center gap-3 mb-2">
                        {['MonEmmBatTm_TDlySafeSt_P', 'MonEmmInpCfg_FlgBatCritErr', 'MonEmmInpCfg_FlgBatCritErrInvld', 'MonEmmInpCfg_FlgBatCritNoErr'].map((sig, i) => (
                             <div key={i} className="px-3 py-1.5 bg-pink-50 text-pink-700 border border-pink-100 rounded text-xs font-mono font-bold shadow-sm">
                                {sig}
                             </div>
                        ))}
                    </div>

                    <ArrowDown size={20} className="text-gray-300 animate-pulse" />

                    {/* Logic Block 1 */}
                    <div className="w-full bg-blue-50 border border-blue-100 text-blue-900 px-4 py-3 rounded-lg text-center shadow-sm">
                         <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">Logic Operation</div>
                         <code className="text-xs font-mono">SMonEmmBatTm13_Logical_Operator = FlgBatCritErr || FlgBatCritErrInvld</code>
                    </div>

                    <ArrowDown size={20} className="text-gray-300 animate-pulse" />

                    {/* Logic Block 2 */}
                    <div className="w-full bg-blue-50 border border-blue-100 text-blue-900 px-4 py-3 rounded-lg text-center shadow-sm">
                         <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">Switch Logic</div>
                         <code className="text-xs font-mono">SMonEmmBatTm17_switchR2 = TDlySafeSt_P (if logOpR TRUE) else memoryR</code>
                    </div>

                    <ArrowDown size={20} className="text-gray-300 animate-pulse" />

                    {/* Uncovered Block */}
                    <div className="w-full bg-orange-50 border-2 border-orange-200 text-orange-800 px-6 py-4 rounded-lg text-center shadow-md relative">
                         <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded border border-orange-200 uppercase tracking-wider">Uncovered Branch</div>
                         <code className="text-sm font-mono font-bold">⚠ If memoryDelayLength == TRUE → memoryR = switchR2 - 1</code>
                    </div>

                    <ArrowDown size={20} className="text-gray-300 animate-pulse" />

                    {/* Output */}
                    <div className="w-full bg-emerald-50 border border-emerald-100 text-emerald-900 px-4 py-3 rounded-lg text-center shadow-sm">
                        <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-1">Final Output</div>
                        <code className="text-xs font-mono font-bold">MonEmmBatTm_FlgSafeStReq = X_SMonEmmBatTm19_Memory_Y</code>
                    </div>
                </div>
            </div>

            <div className="my-10 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        
            {/* Distinct Branch Paths */}
            <h2 className="text-xl font-bold text-gray-900 mb-4 pl-4 border-l-4 border-black">Distinct Branch Paths</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Path 1 */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3">
                        <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                        Path 1: Delay Length TRUE
                    </h4>
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-3 rounded border border-gray-100">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Condition</div>
                            <div className="font-mono text-xs text-gray-800 font-bold">X_SMonEmmBatTm17_memoryDelayLength == TRUE</div>
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Required Input Signal Ranges</div>
                            <div className="font-mono text-xs text-gray-600 bg-white p-2 rounded border border-gray-200">
                                • MonEmmBatTm_TDlySafeSt_P &gt; 0<br/>
                                • MonEmmInpCfg_FlgBatCritErr == TRUE <strong>OR</strong><br/> &nbsp;&nbsp;MonEmmInpCfg_FlgBatCritErrInvld == TRUE
                            </div>
                        </div>
                    </div>
                </div>

                {/* Path 2 */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3">
                        <span className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                        Path 2: Delay Length FALSE
                    </h4>
                    <div className="space-y-4">
                         <div className="bg-gray-50 p-3 rounded border border-gray-100">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Condition</div>
                            <div className="font-mono text-xs text-gray-800 font-bold">X_SMonEmmBatTm17_memoryDelayLength == FALSE</div>
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Required Input Signal Ranges</div>
                             <div className="font-mono text-xs text-gray-600 bg-white p-2 rounded border border-gray-200">
                                • MonEmmBatTm_TDlySafeSt_P &lt;= 0<br/>
                                • MonEmmInpCfg_FlgBatCritErr == FALSE <strong>AND</strong><br/> &nbsp;&nbsp;MonEmmInpCfg_FlgBatCritErrInvld == FALSE
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Footer */}
            <div className="mt-12 bg-black text-white rounded-lg p-10 text-center shadow-2xl">
                <h3 className="text-2xl font-bold mb-3 flex items-center justify-center gap-3 tracking-tight">
                    <CheckCircle2 size={28} className="text-emerald-400" /> Analysis Complete
                </h3>
                <p className="text-gray-400 text-sm max-w-2xl mx-auto leading-relaxed">
                    This analysis provides the complete backward and forward signal tracing required to generate unit test cases for the uncovered branches.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                     <button className="px-6 py-2 bg-white text-black font-bold rounded hover:bg-gray-100 transition-colors text-sm">Download PDF</button>
                     <button className="px-6 py-2 bg-gray-800 text-white font-bold rounded hover:bg-gray-700 transition-colors text-sm border border-gray-700">Share Report</button>
                </div>
            </div>
            
            <div className="mt-8 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Branch Coverage Analysis Report • Generated for MonEmmBatTm Module
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-4">
           <div className="w-full max-w-xl bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-black p-8 text-center">
                 <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
                    <GitBranch size={36} className="text-white" />
                 </div>
                 <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Ready to Analyze</h2>
                 <p className="text-gray-400 text-sm">Enter the root folder link to track uncovered code branches.</p>
              </div>
              
              <div className="p-8 space-y-8">
                 <div>
                    <label className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 block flex items-center gap-2">
                        <Folder size={14} /> Root Folder Link
                    </label>
                    <input 
                        type="text" 
                        value={folderLink}
                        onChange={(e) => setFolderLink(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="path/to/project/root..."
                    />
                 </div>

                 <div className="bg-gray-50 border border-gray-200 rounded p-4">
                    <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wide">Analysis Scope:</h4>
                    <ul className="text-xs text-gray-600 space-y-2 ml-1 font-medium">
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> C1 test coverage reports</li>
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> FSX documentation files</li>
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> SVG Simulink diagrams</li>
                    </ul>
                 </div>

                 <div className="pt-4">
                    <button 
                      onClick={handleAnalyze}
                      disabled={analyzing}
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow-md transition-all hover:shadow-lg flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
                    >
                       {analyzing ? 'Analyzing...' : (
                           <>
                             Analyze Branches <ArrowRight size={18} />
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
