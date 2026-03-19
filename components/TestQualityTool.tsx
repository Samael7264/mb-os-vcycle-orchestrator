import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, FileText, Activity, AlertCircle, RefreshCw, Link as LinkIcon, ArrowRight } from 'lucide-react';
import { QualityReportData, RiskLevel } from '../types';

export const TestQualityTool: React.FC = () => {
  const [analyzed, setAnalyzed] = useState(false);
  const [reportLink, setReportLink] = useState('');
  const [reportData, setReportData] = useState<QualityReportData | null>(null);

  const mockReportData: QualityReportData = {
    summary: {
      totalTests: 100,
      coverage: 100,
      mutationScore: 90.5,
      riskLevel: RiskLevel.MEDIUM,
      totalSignals: 8,
      analyzedSignals: 7,
      issuesDetected: 3,
    },
    details: [
      { file: 'MonEmmBatTm_FlgFcnAcv_P', type: 'P', status: 'Pass', min: 0.0, max: 1.0, scale: 1.0, coverage: 100, mutationScore: 0, risk: RiskLevel.LOW, recommendation: '' },
      { file: 'MonEmmBatTm_TDlySafeSt_P', type: 'P', status: 'Issues', min: 0.0, max: 5.1, scale: 0.02, coverage: 0, mutationScore: 0, risk: RiskLevel.HIGH, recommendation: '' },
      { file: 'MonEmmBatTm_TqReqEcoAssi_P', type: 'P', status: 'Pass', min: -500.0, max: 500.0, scale: 0.1, coverage: 100, mutationScore: 0, risk: RiskLevel.LOW, recommendation: '' }
    ]
  };

  const handleReset = () => {
    setAnalyzed(false);
    setReportData(null);
  };

  const handleGenerate = () => {
    setReportData(mockReportData);
    setAnalyzed(true);
  };

  const metrics = reportData ? [
    { label: 'Total Signals', value: reportData.summary.totalSignals, color: 'bg-black border-gray-800' },
    { label: 'Analyzed Signals', value: reportData.summary.analyzedSignals, color: 'bg-black border-gray-800' },
    { label: 'Variation Score', value: `${reportData.summary.mutationScore}%`, color: 'bg-black border-gray-800', textColor: 'text-emerald-400' },
    { label: 'Issues Detected', value: reportData.summary.issuesDetected, color: 'bg-red-900/20 border-red-900', textColor: 'text-red-500' },
  ] : [];

  return (
    <div className="h-full flex flex-col">
      {analyzed && reportData ? (
        <div className="flex-1 flex flex-col min-h-0 space-y-6">
           <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
             <div>
               <h1 className="text-xl font-bold text-gray-900">Test Quality Report</h1>
               <p className="text-sm text-gray-500">Comprehensive analysis of test coverage and quality metrics</p>
             </div>
             <div className="flex gap-3">
               <button 
                 onClick={handleReset}
                 className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
               >
                 <RefreshCw size={16} /> Generate Next Report
               </button>
               <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
                 Export Data
               </button>
             </div>
          </div>

          <div className="space-y-6 overflow-y-auto pr-2 pb-6">
            {/* Quick Stats Row */}
            <div className="grid grid-cols-3 gap-6">
               <div className="bg-black rounded-lg p-5 border border-gray-800 shadow-lg">
                 <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">ARXML Signals Parsed</div>
                 <div className="text-3xl font-bold text-white">{reportData.summary.analyzedSignals}</div>
               </div>
               <div className="bg-black rounded-lg p-5 border border-gray-800 shadow-lg">
                 <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">COMPU Methods Found</div>
                 <div className="text-3xl font-bold text-white">3</div>
               </div>
               <div className="bg-black rounded-lg p-5 border border-gray-800 shadow-lg">
                 <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">XML Signals Found</div>
                 <div className="text-3xl font-bold text-white">{reportData.summary.totalSignals}</div>
               </div>
            </div>

            {/* Alert Banner */}
            {reportData.summary.issuesDetected > 0 && (
              <div className="bg-red-600 rounded-lg p-4 text-white shadow-md flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 font-bold text-lg">
                    <AlertTriangle size={24} />
                    {reportData.summary.issuesDetected} Issues Detected
                  </div>
                  <div className="flex gap-4 mt-2 text-sm text-red-100 font-medium">
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-white"></span> 1 Single Value</span>
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-200"></span> 1 Min Missing</span>
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-200"></span> 1 Max Missing</span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-white text-red-700 hover:bg-gray-100 rounded text-sm font-bold transition-colors">
                  View Details
                </button>
              </div>
            )}

            {/* Overall Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {metrics.map((m, i) => (
                <div key={i} className={`${m.color} border rounded-lg p-6 text-white shadow-sm flex flex-col items-center justify-center text-center h-32`}>
                  <div className={`text-3xl font-bold mb-1 ${m.textColor || 'text-white'}`}>{m.value}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{m.label}</div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Table */}
              <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                 <h3 className="text-gray-900 font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                   <FileText size={18} /> Summary by Interface Type
                 </h3>
                 <div className="overflow-x-auto">
                   <table className="w-full text-sm text-left text-gray-600">
                     <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                       <tr>
                         <th className="px-4 py-3 font-semibold">Type</th>
                         <th className="px-4 py-3 text-right font-semibold">Total</th>
                         <th className="px-4 py-3 text-right font-semibold">Min Tested</th>
                         <th className="px-4 py-3 text-right font-semibold">Coverage %</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                       {['Local', 'Parameter', 'Receiver', 'Sender'].map((type, i) => (
                         <tr key={type} className="hover:bg-gray-50 transition-colors">
                           <td className="px-4 py-3 font-medium text-gray-900">{type}</td>
                           <td className="px-4 py-3 text-right">{i + 1}</td>
                           <td className="px-4 py-3 text-right">{i + 1}</td>
                           <td className="px-4 py-3 text-right text-emerald-600 font-bold">{100 - (i * 10)}%</td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
              </div>

              {/* Bar Chart Simulation */}
              <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                 <h3 className="text-gray-900 font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                   <Activity size={18} /> Testing Coverage by Interface Type
                 </h3>
                 <div className="h-48 flex items-end justify-between gap-4 px-2 border-b border-gray-100 pb-2">
                   {['Local', 'Param', 'Receiver', 'Sender'].map((label, i) => (
                     <div key={label} className="flex flex-col items-center gap-2 flex-1">
                       <div className="w-full bg-gray-100 rounded-t flex items-end relative h-32 group">
                          <div className="w-1/3 bg-gray-900 h-[80%] absolute left-0 bottom-0"></div>
                          <div className="w-1/3 bg-blue-600 h-[60%] absolute left-1/3 bottom-0"></div>
                          <div className="w-1/3 bg-sky-400 h-[100%] absolute right-0 bottom-0"></div>
                       </div>
                       <span className="text-xs text-gray-500 font-medium">{label}</span>
                     </div>
                   ))}
                 </div>
                 <div className="flex justify-end gap-4 mt-4">
                   <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium"><span className="w-2 h-2 bg-gray-900 rounded-full"></span> Total</div>
                   <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium"><span className="w-2 h-2 bg-blue-600 rounded-full"></span> Min Tested</div>
                   <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium"><span className="w-2 h-2 bg-sky-400 rounded-full"></span> Max Tested</div>
                 </div>
              </div>
            </div>

            {/* Detailed Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                 <h3 className="text-gray-900 font-bold text-sm uppercase tracking-wide">Detailed Quality Analysis</h3>
              </div>
              <div className="p-4 overflow-x-auto">
                 <div className="flex gap-4 mb-4 text-xs font-medium">
                   <span className="bg-gray-100 px-2 py-1 rounded text-gray-600 border border-gray-200">All Signals ({reportData.summary.analyzedSignals})</span>
                   <span className="bg-red-50 text-red-600 px-2 py-1 rounded border border-red-100">Single Value Issues (1)</span>
                   <span className="bg-red-50 text-red-600 px-2 py-1 rounded border border-red-100">Boundary Issues (2)</span>
                 </div>
                 <table className="w-full text-xs text-left text-gray-600">
                   <thead className="text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                     <tr>
                       <th className="px-4 py-3 font-semibold">Signal</th>
                       <th className="px-4 py-3 font-semibold">Type</th>
                       <th className="px-4 py-3 font-semibold">Status</th>
                       <th className="px-4 py-3 font-semibold">Min</th>
                       <th className="px-4 py-3 font-semibold">Max</th>
                       <th className="px-4 py-3 font-semibold">Scale</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                     {reportData.details.map((row, idx) => (
                       <tr key={idx} className="hover:bg-gray-50 transition-colors">
                         <td className="px-4 py-3 text-gray-900 font-mono font-medium">{row.file}</td>
                         <td className="px-4 py-3">{row.type}</td>
                         <td className="px-4 py-3">
                           {row.status === 'Pass' ? (
                             <span className="text-emerald-600 flex items-center gap-1 font-bold"><CheckCircle size={12}/> Pass</span>
                           ) : (
                             <span className="text-red-600 flex items-center gap-1 font-bold"><AlertCircle size={12}/> Issues</span>
                           )}
                         </td>
                         <td className="px-4 py-3 font-mono">
                           {row.min?.toFixed(3)} <span className={row.status === 'Pass' ? 'text-emerald-600' : 'text-red-500'}>
                             {row.status === 'Pass' ? '✓' : '✗'}
                           </span>
                         </td>
                         <td className="px-4 py-3 font-mono">
                           {row.max?.toFixed(3)} <span className={row.status === 'Pass' ? 'text-emerald-600' : 'text-red-500'}>
                             {row.status === 'Pass' ? '✓' : '✗'}
                           </span>
                         </td>
                         <td className="px-4 py-3 font-mono">{row.scale?.toFixed(4)}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
         <div className="flex-1 flex items-center justify-center p-4">
           <div className="w-full max-w-xl bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-black p-8 text-center">
                 <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
                    <ShieldCheck size={36} className="text-white" />
                 </div>
                 <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Ready to Analyze</h2>
                 <p className="text-gray-400 text-sm">Provide report link to identify signal issues and boundary gaps.</p>
              </div>
              
              <div className="p-8 space-y-8">
                 <div>
                    <label className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 block flex items-center gap-2">
                        <LinkIcon size={14} /> Test Report Link
                    </label>
                    <input 
                        type="text" 
                        value={reportLink}
                        onChange={(e) => setReportLink(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="https://ci-artifacts.corp.net/builds/report.xml..."
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded border border-gray-200 text-center hover:bg-white hover:shadow-sm transition-all">
                        <div className="text-xs font-bold text-gray-800 uppercase tracking-wide">Single Value Analysis</div>
                        <p className="text-[10px] text-gray-500 mt-2 font-medium">Detects insufficient variation</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded border border-gray-200 text-center hover:bg-white hover:shadow-sm transition-all">
                        <div className="text-xs font-bold text-gray-800 uppercase tracking-wide">Boundary Coverage</div>
                        <p className="text-[10px] text-gray-500 mt-2 font-medium">Verifies min/max ranges</p>
                    </div>
                 </div>

                 <div className="pt-4">
                    <button 
                      onClick={handleGenerate}
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow-md transition-all hover:shadow-lg flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
                    >
                      Generate Quality Report <ArrowRight size={18} />
                    </button>
                 </div>
              </div>
           </div>
         </div>
      )}
    </div>
  );
};
