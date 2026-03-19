import React, { useState } from 'react';
import { Play, CheckCircle2, AlertCircle, XCircle, Search, Copy, ExternalLink, MessageSquare, Link as LinkIcon, Activity, RefreshCw, ArrowRight } from 'lucide-react';

export const AstreeTool: React.FC = () => {
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Link inputs
  const [htmlLink, setHtmlLink] = useState('');
  const [cCodeLink, setCCodeLink] = useState('');
  const [arxmlLink, setArxmlLink] = useState('');

  const handleAnalyze = () => {
    // Demo mode
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAnalyzed(true);
    }, 2000);
  };

  const handleReset = () => {
    setAnalyzed(false);
    setHtmlLink('');
    setCCodeLink('');
    setArxmlLink('');
  };

  return (
    <div className="h-full flex flex-col">
      {analyzed ? (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
             <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Activity className="text-indigo-600" size={20} />
                Astree Results
             </h2>
             <button 
                onClick={handleReset}
                className="px-4 py-2 bg-[#2824D6] hover:bg-indigo-800 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
             >
                <RefreshCw size={16} />
                Analyze New Files
             </button>
          </div>

          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden relative">
             <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50/50">
                {/* Top Banner */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden text-center p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">Analysis Results</h1>
                    
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 max-w-3xl mx-auto mb-8">
                    <p className="text-gray-600 mb-4 text-sm font-medium">
                        Your analysis report has been saved! You can access it later (with past chat history) by opening the static HTML file:
                    </p>
                    <div className="flex items-center gap-2 justify-center">
                        <code className="bg-white border border-gray-300 px-4 py-2.5 rounded-lg text-sm text-gray-700 w-full max-w-md truncate font-mono shadow-sm">
                        static_report_viewer.html?session_id=89234-23423
                        </code>
                        <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-bold transition-colors whitespace-nowrap shadow-sm">
                        Copy Link
                        </button>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-3 italic uppercase tracking-wider">
                        (Run local web server to view: python -m http.server 8000)
                    </p>
                    </div>

                    {/* Signal Analysis Status Table */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden max-w-4xl mx-auto shadow-sm">
                    <div className="p-4 border-b border-gray-200 bg-white">
                        <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-widest text-left">Signal Analysis Status</h2>
                    </div>
                    <div className="grid grid-cols-4 divide-x divide-gray-100 border-b border-gray-100 bg-gray-50 text-gray-500 text-[11px] font-bold uppercase tracking-wider text-left pl-4">
                        <div className="py-3">Signal Processing</div>
                        <div className="py-3 pl-4">ARXML Source</div>
                        <div className="py-3 pl-4">Signals Detected</div>
                        <div className="py-3 pl-4">Enhanced Analysis</div>
                    </div>
                    <div className="grid grid-cols-4 divide-x divide-gray-200 bg-white text-center text-sm py-5">
                        <div className="flex items-center justify-center gap-2 text-gray-900 font-medium">
                        <CheckCircle2 size={16} className="text-emerald-600" /> Successful
                        </div>
                        <div className="flex flex-col items-center justify-center text-gray-900 font-medium">
                        <div className="flex items-center gap-2"><span className="text-yellow-600">📁</span> User Uploaded</div>
                        </div>
                        <div className="flex items-center justify-center text-gray-900 font-mono font-bold">
                        12
                        </div>
                        <div className="flex flex-col items-center justify-center text-gray-900 font-medium">
                        <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-600" /> Available</div>
                        </div>
                    </div>
                    <div className="p-3 text-xs text-gray-500 text-center border-t border-gray-200 bg-gray-50">
                        Signal analysis enhances warning interpretation by providing signal constraints and ranges.
                    </div>
                    </div>
                </div>

                {/* Quantification Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-8">
                    <h2 className="text-lg font-bold text-gray-900 text-center mb-6 uppercase tracking-wide border-b border-gray-100 pb-4">Quantification of Analysis Results</h2>
                    
                    <div className="overflow-hidden rounded-xl border border-gray-200 max-w-4xl mx-auto shadow-sm">
                    <table className="w-full text-sm text-left">
                        <thead>
                        <tr className="bg-white text-gray-600 text-xs font-semibold border-b border-gray-200">
                            <th className="py-3.5 px-6">Alarm Type</th>
                            <th className="py-3.5 px-6">Classification</th>
                            <th className="py-3.5 px-6 text-center">Total Alarms</th>
                            <th className="py-3.5 px-6 text-center">Low Accuracy</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        <tr className="hover:bg-gray-50">
                            <td className="py-4 px-6 text-gray-900 font-bold">Alarm (R)</td>
                            <td className="py-4 px-6 text-gray-600">Runtime Error (e.g., division by zero)</td>
                            <td className="py-4 px-6 text-center font-mono font-bold text-gray-900">2</td>
                            <td className="py-4 px-6 text-center font-mono text-gray-500">0</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="py-4 px-6 text-gray-900 font-bold">Alarm (A)</td>
                            <td className="py-4 px-6 text-gray-600">Assertion Violation</td>
                            <td className="py-4 px-6 text-center font-mono font-bold text-gray-900">5</td>
                            <td className="py-4 px-6 text-center font-mono text-gray-500">1</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="py-4 px-6 text-gray-900 font-bold">Alarm (B)</td>
                            <td className="py-4 px-6 text-gray-600">Behavior Violation</td>
                            <td className="py-4 px-6 text-center font-mono font-bold text-gray-900">1</td>
                            <td className="py-4 px-6 text-center font-mono text-gray-500">0</td>
                        </tr>
                        </tbody>
                    </table>
                    </div>
                </div>

                {/* Detailed Analysis Item */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-2.5 rounded-lg text-sm font-bold w-full flex items-center gap-2">
                        <XCircle size={16} className="shrink-0" /> Error: Division by zero detected in compute_velocity
                        </div>
                        <button className="ml-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs px-4 py-2.5 rounded-lg font-bold transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm">
                        <MessageSquare size={14} /> Discuss
                        </button>
                    </div>

                    <div className="space-y-6 text-sm text-gray-800">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <span className="font-bold text-xs text-gray-500 uppercase mb-1">Code line number</span>
                                <span className="font-mono text-gray-900 font-bold bg-gray-100 px-2 py-1 rounded inline-block w-fit">142</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-xs text-gray-500 uppercase mb-1">Message</span>
                                <span className="text-gray-900 font-medium">division by zero</span>
                            </div>
                        </div>

                        <div>
                        <div className="font-bold text-xs text-gray-500 uppercase mb-2">Code Snippet</div>
                        <div className="bg-gray-900 text-gray-300 p-4 rounded-lg font-mono text-xs overflow-x-auto border border-gray-800 shadow-inner">
            {`if (time_delta > 0) {
    velocity = distance / time_delta;
} else {
    velocity = distance / 0; // Error here
}`}
                        </div>
                        </div>

                        <div className="space-y-4 pt-2 border-t border-gray-100">
                        <div>
                            <span className="font-bold text-gray-900">Background Analysis:</span>
                            <p className="text-gray-600 mt-1">
                            The variable 'time_delta' can be zero in certain edge cases when the timer interrupt hasn't fired yet.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">Conclusion:</span> 
                            <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-bold uppercase">True Positive</span>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-4 bg-gray-50">
           <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-slate-900 p-8 text-center">
                 <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/10 shadow-lg">
                    <Activity size={36} className="text-white" />
                 </div>
                 <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Ready to Analyze</h2>
                 <p className="text-gray-400 text-sm">Provide links to source files to generate AI-enhanced static analysis.</p>
              </div>
              
              <div className="p-8 space-y-8">
                 <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 block flex items-center gap-2">
                        <LinkIcon size={12} /> HTML Report Link
                    </label>
                    <input 
                        type="text" 
                        value={htmlLink}
                        onChange={(e) => setHtmlLink(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-gray-800"
                        placeholder="Link to Astree HTML report..."
                    />
                 </div>

                 <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 block flex items-center gap-2">
                        <LinkIcon size={12} /> C Source Code Link
                    </label>
                    <input 
                        type="text" 
                        value={cCodeLink}
                        onChange={(e) => setCCodeLink(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-gray-800"
                        placeholder="Link to .c source file..."
                    />
                 </div>

                 <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 block flex items-center gap-2">
                        <LinkIcon size={12} /> ARXML Link (Optional)
                    </label>
                    <input 
                        type="text" 
                        value={arxmlLink}
                        onChange={(e) => setArxmlLink(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-gray-800"
                        placeholder="Link to .arxml definition file..."
                    />
                 </div>

                 <div className="pt-2">
                    <button 
                      onClick={handleAnalyze}
                      disabled={loading}
                      className="w-full py-3.5 bg-[#2824D6] hover:bg-indigo-800 text-white font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 text-[13px]"
                    >
                      {loading ? 'Analyzing...' : (
                        <>
                          Analyze Files <ArrowRight size={16} />
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
