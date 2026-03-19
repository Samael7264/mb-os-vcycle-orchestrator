import React from 'react';
import { Clock, FileText, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export const HistoryTool: React.FC = () => {
  const historyItems = [
    { tool: 'Astree Analysis', file: 'Brake_Control_Module.c', time: '10 mins ago', status: 'Issues Found', color: 'text-red-600' },
    { tool: 'Summary Gen', file: 'Powertrain_Spec_v2.xml', time: '2 hours ago', status: 'Completed', color: 'text-emerald-600' },
    { tool: 'Test Generation', file: 'Steering_System.arxml', time: 'Yesterday', status: 'Completed', color: 'text-emerald-600' },
    { tool: 'Quality Report', file: 'ADAS_Coverage_Report.html', time: 'Yesterday', status: 'Warning', color: 'text-orange-500' },
    { tool: 'Visualization', file: 'Battery_Management.log', time: '2 days ago', status: 'Completed', color: 'text-emerald-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-[0px_2px_4px_rgba(0,0,0,0.02)] border border-gray-200 p-6 overflow-hidden">
        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
            <Clock size={20} className="text-indigo-600" />
            Recent Activity
        </h2>
        
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-white text-gray-600 font-semibold text-xs border-b border-gray-200">
                    <tr>
                        <th className="px-4 py-3.5">Tool</th>
                        <th className="px-4 py-3.5">File / Context</th>
                        <th className="px-4 py-3.5">Time</th>
                        <th className="px-4 py-3.5">Status</th>
                        <th className="px-4 py-3.5 text-right w-32">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {historyItems.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                            <td className="px-4 py-4 font-semibold text-gray-900">{item.tool}</td>
                            <td className="px-4 py-4 font-mono text-gray-600 text-xs">{item.file}</td>
                            <td className="px-4 py-4 text-gray-500">{item.time}</td>
                            <td className={`px-4 py-4 font-medium ${item.color} flex items-center gap-1.5`}>
                                {item.status === 'Completed' && <CheckCircle2 size={14} />}
                                {item.status === 'Issues Found' && <AlertTriangle size={14} />}
                                {item.status === 'Warning' && <AlertTriangle size={14} />}
                                {item.status}
                            </td>
                            <td className="px-4 py-4 text-right">
                                <button className="text-blue-600 hover:text-blue-800 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end gap-1 ml-auto">
                                    View Report <ArrowRight size={12} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};
