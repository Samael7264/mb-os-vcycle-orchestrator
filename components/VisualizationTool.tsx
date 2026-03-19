import React, { useState } from 'react';
import { Folder, BarChart2, CheckSquare, Camera, ZoomIn, ZoomOut, RefreshCw, Link as LinkIcon, ArrowRight } from 'lucide-react';

export const VisualizationTool: React.FC = () => {
  const [visualized, setVisualized] = useState(false);
  const [folderLink, setFolderLink] = useState('');

  // Mock chart data points
  const points = [10, 45, 30, 60, 55, 80, 75, 90, 20, 40];

  const handleGenerate = () => {
    setVisualized(true);
  };

  const handleReset = () => {
    setVisualized(false);
  };

  return (
    <div className="h-full flex flex-col">
      {visualized ? (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
             <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <BarChart2 className="text-black" size={20} />
                Visualization Dashboard
             </h2>
             <button 
                onClick={handleReset}
                className="px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded transition-colors flex items-center gap-2"
             >
                <RefreshCw size={16} />
                Generate Next Visualization
             </button>
          </div>

          <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden relative">
            <div className="h-12 border-b border-gray-200 flex items-center justify-between px-4 bg-gray-50">
               <h3 className="font-semibold text-gray-800 text-sm">Test Case Visualization</h3>
               <div className="flex items-center gap-2">
                 <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600" title="Zoom In"><ZoomIn size={16} /></button>
                 <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600" title="Zoom Out"><ZoomOut size={16} /></button>
                 <div className="h-4 w-px bg-gray-300 mx-1"></div>
                 <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600" title="Export PNG"><Camera size={16} /></button>
               </div>
            </div>

            <div className="flex-1 p-6 flex flex-col bg-gray-900 text-white">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="px-3 py-1 bg-blue-900/50 border border-blue-700 text-blue-400 rounded text-xs font-mono">2 Test Cases Found</div>
                   <div className="text-sm font-mono text-gray-400">TC1 (8 signals), TC2 (8 signals)</div>
                </div>
              </div>

              <div className="flex-1 bg-black rounded border border-gray-800 p-6 relative">
                <h4 className="text-xs font-semibold text-gray-400 mb-6 uppercase tracking-wider">Signal: MonEmmBatTm_FlgFcnAcv_P</h4>
                
                {/* Fake Line Chart */}
                <div className="h-64 w-full flex items-end justify-between px-4 relative border-l border-b border-gray-700">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                     <div className="w-full h-px bg-gray-600"></div>
                     <div className="w-full h-px bg-gray-600"></div>
                     <div className="w-full h-px bg-gray-600"></div>
                     <div className="w-full h-px bg-gray-600"></div>
                     <div className="w-full h-px bg-gray-600"></div>
                  </div>

                  {/* Data Points */}
                  {points.map((h, i) => (
                    <div key={i} className="relative group w-full flex items-end justify-center h-full">
                       <div 
                        className="w-2 bg-blue-500 rounded-t-sm transition-all duration-500 hover:bg-blue-400" 
                        style={{ height: `${h}%` }}
                       ></div>
                       {/* Tooltip */}
                       <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white text-black text-[10px] px-2 py-1 rounded font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
                         Val: {h}
                       </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500 font-mono px-4">
                   <span>Step 1</span>
                   <span>Step 10</span>
                </div>
              </div>

              {/* Legend / Controls */}
              <div className="mt-4 grid grid-cols-4 gap-4">
                 {['Inputs (3)', 'Outputs (1)', 'Parameters (2)', 'Local (2)'].map((label, i) => (
                   <div key={i} className="bg-gray-800 border border-gray-700 p-3 rounded text-xs">
                     <div className="font-semibold text-gray-300 mb-2">{label}</div>
                     <div className="flex items-center gap-2 mb-1">
                       <input type="checkbox" defaultChecked className="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500" />
                       <span className="text-gray-400 truncate font-mono">Signal_Name_{i}</span>
                     </div>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
         <div className="flex-1 flex items-center justify-center p-4">
           <div className="w-full max-w-xl bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-black p-8 text-center">
                 <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
                    <BarChart2 size={36} className="text-white" />
                 </div>
                 <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Ready to Visualize</h2>
                 <p className="text-gray-400 text-sm">Enter the module folder path to generate interactive signal plots.</p>
              </div>
              
              <div className="p-8 space-y-8">
                 <div>
                    <label className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 block flex items-center gap-2">
                        <Folder size={14} /> Module Folder Link
                    </label>
                    <input 
                        type="text" 
                        value={folderLink}
                        onChange={(e) => setFolderLink(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://repo.corp.net/project/module_alpha..."
                    />
                 </div>

                 <div className="bg-blue-50 border border-blue-100 rounded p-4">
                    <h4 className="text-xs font-bold text-blue-900 mb-2 flex items-center gap-2">
                      <CheckSquare size={12} /> Expected Contents:
                    </h4>
                    <ul className="text-xs text-blue-800 space-y-1 ml-1 font-medium">
                      <li>• XML Test Report</li>
                      <li>• ARXML Definitions</li>
                      <li>• SVG Diagram Files</li>
                    </ul>
                 </div>

                 <div className="pt-4">
                    <button 
                      onClick={handleGenerate}
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow-md transition-all hover:shadow-lg flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
                    >
                      Generate Visualization <ArrowRight size={18} />
                    </button>
                 </div>
              </div>
           </div>
         </div>
      )}
    </div>
  );
};
