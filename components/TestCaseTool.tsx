import React, { useState } from 'react';
import { MessageSquare, Settings, Link as LinkIcon, Send, RefreshCw, ArrowRight, Code2, Download, Table, FileSpreadsheet } from 'lucide-react';

// Data derived from the provided screenshot
const TEST_CASES_DATA = [
  { id: 'tc1.1', tdly: '1', critErr: '1', critErrInvld: '0', critNoErr: '1', output: '1' },
  { id: 'tc1.2', tdly: '2', critErr: '1', critErrInvld: '0', critNoErr: '1', output: '1' },
  { id: 'tc1.3', tdly: '0', critErr: '0', critErrInvld: '0', critNoErr: '0', output: '0' },
  { id: 'tc1.4', tdly: '1', critErr: '0', critErrInvld: '1', critNoErr: '0', output: '1' },
  { id: 'tc1.5', tdly: '0', critErr: '1', critErrInvld: '1', critNoErr: '0', output: '1' },
  { id: 'tc2.1', tdly: '0', critErr: '0', critErrInvld: '0', critNoErr: '0', output: '0' },
  { id: 'tc2.2', tdly: '1', critErr: '0', critErrInvld: '0', critNoErr: '1', output: '1' },
  { id: 'tc2.3', tdly: '2', critErr: '1', critErrInvld: '0', critNoErr: '1', output: '1' },
  { id: 'tc2.4', tdly: '0', critErr: '1', critErrInvld: '1', critNoErr: '0', output: '1' },
  { id: 'tc2.5', tdly: '1', critErr: '0', critErrInvld: '1', critNoErr: '0', output: '1' },
  { id: 'tc3.1', tdly: '1', critErr: '1', critErrInvld: '0', critNoErr: '1', output: '1' },
  { id: 'tc3.2', tdly: '2', critErr: '1', critErrInvld: '0', critNoErr: '1', output: '1' },
  { id: 'tc3.3', tdly: '0', critErr: '0', critErrInvld: '0', critNoErr: '0', output: '0' },
  { id: 'tc3.4', tdly: '1', critErr: '0', critErrInvld: '1', critNoErr: '0', output: '1' },
  { id: 'tc3.5', tdly: '0', critErr: '1', critErrInvld: '1', critNoErr: '0', output: '1' },
];

export const TestCaseTool: React.FC = () => {
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testCaseLink, setTestCaseLink] = useState('');

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        setGenerated(true);
    }, 1500);
  };

  const handleReset = () => {
    setGenerated(false);
  };

  return (
    <div className="h-full flex flex-col">
      {generated ? (
        <div className="flex-1 flex flex-col min-h-0">
           <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
             <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FileSpreadsheet className="text-black" size={20} />
                Generated Test Cases
             </h2>
             <div className="flex gap-3">
                 <button 
                    onClick={() => {}} 
                    className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded transition-colors flex items-center gap-2"
                 >
                    <Download size={16} />
                    Download Excel
                 </button>
                 <button 
                    onClick={handleReset}
                    className="px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded transition-colors flex items-center gap-2"
                 >
                    <RefreshCw size={16} />
                    Regenerate
                 </button>
             </div>
          </div>

          <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            {/* Toolbar-like area */}
            <div className="bg-gray-50 border-b border-gray-200 p-2 flex items-center gap-4 text-xs text-gray-600">
               <div className="flex items-center gap-1 font-medium px-2 py-1 bg-white border border-gray-200 rounded">
                 <Table size={14} /> Sheet 1
               </div>
               <div className="h-4 w-px bg-gray-300"></div>
               <div>15 Rows</div>
               <div>6 Columns</div>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar">
               <table className="w-full text-sm border-collapse">
                 <thead className="bg-[#003366] text-white sticky top-0 z-10">
                   <tr>
                     <th className="px-4 py-3 text-left font-semibold border-r border-blue-800 whitespace-nowrap w-24">Test Step Id</th>
                     <th className="px-4 py-3 text-left font-semibold border-r border-blue-800 whitespace-nowrap">MonEmmBatTmTDlySafeStP</th>
                     <th className="px-4 py-3 text-left font-semibold border-r border-blue-800 whitespace-nowrap">MonEmmInpCfg_FlgBatCritErr</th>
                     <th className="px-4 py-3 text-left font-semibold border-r border-blue-800 whitespace-nowrap">MonEmmInpCfg_FlgBatCritErrInvld</th>
                     <th className="px-4 py-3 text-left font-semibold border-r border-blue-800 whitespace-nowrap">MonEmmInpCfg_FlgBatCritNoErr</th>
                     <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Expected Output: MonEmmBatTm_FlgSafeStReq</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-200">
                   {TEST_CASES_DATA.map((row, idx) => (
                     <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                       <td className="px-4 py-2 border-r border-gray-200 font-medium text-gray-900">{row.id}</td>
                       <td className="px-4 py-2 border-r border-gray-200 text-gray-700">{row.tdly}</td>
                       <td className="px-4 py-2 border-r border-gray-200 text-gray-700">{row.critErr}</td>
                       <td className="px-4 py-2 border-r border-gray-200 text-gray-700">{row.critErrInvld}</td>
                       <td className="px-4 py-2 border-r border-gray-200 text-gray-700">{row.critNoErr}</td>
                       <td className="px-4 py-2 text-gray-700">{row.output}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
            
            <div className="p-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
               <span>Generated from ARXML and C1 Coverage Reports</span>
               <span>Confidence Score: 98.5%</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-4">
           <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-black p-8 text-center">
                 <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
                    <Code2 size={36} className="text-white" />
                 </div>
                 <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Ready to Generate</h2>
                 <p className="text-gray-400 text-sm">Configure parameters to generate unit and integration test cases.</p>
              </div>
              
              <div className="p-8 space-y-8">
                 <div className="grid grid-cols-2 gap-8">
                    <div>
                        <label className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 block flex items-center gap-2">
                           <Settings size={14} /> Generation Mode
                        </label>
                        <div className="space-y-3">
                             <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer group">
                                <input type="radio" name="gmode" defaultChecked className="text-black focus:ring-black"/> 
                                <span className="group-hover:text-black transition-colors">Mode 1 (Standard)</span>
                             </label>
                             <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer group">
                                <input type="radio" name="gmode" className="text-black focus:ring-black"/> 
                                <span className="group-hover:text-black transition-colors">Mode 2 (Extended)</span>
                             </label>
                        </div>
                    </div>
                    <div>
                         <label className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 block">Starting Test Case #</label>
                         <input type="number" defaultValue={1} className="w-full px-4 py-2.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50" />
                    </div>
                 </div>

                 <div>
                    <label className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 block flex items-center gap-2">
                        <LinkIcon size={14} /> Existing Test Cases (Optional)
                    </label>
                    <input 
                        type="text" 
                        value={testCaseLink}
                        onChange={(e) => setTestCaseLink(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="Link to existing .xls/.xlsx file..."
                    />
                 </div>

                 <div className="pt-4">
                    <button 
                      onClick={handleStart}
                      disabled={loading}
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow-md transition-all hover:shadow-lg flex items-center justify-center gap-2 uppercase tracking-wider text-sm disabled:opacity-70"
                    >
                      {loading ? 'Processing...' : (
                        <>
                           Generate Test Cases <ArrowRight size={18} />
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
