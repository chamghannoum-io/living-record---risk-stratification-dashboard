
import React, { useMemo } from 'react';
import { RiskLevel, AlertType, EncounterAlert } from '../../types';
import { Icons, COLORS, generateMockEncounterAlerts } from '../../constants';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Cell, LineChart, Line, ComposedChart, Area
} from 'recharts';

interface EncounterAnalyzerProps {
  selectedAlertId: string | null;
  onBack: () => void;
}

const EncounterAnalyzer: React.FC<EncounterAnalyzerProps> = ({ selectedAlertId, onBack }) => {
  const alerts = useMemo(() => generateMockEncounterAlerts(20), []);
  const alert = useMemo(() => alerts.find(a => a.id === selectedAlertId) || alerts[0], [selectedAlertId, alerts]);

  const waterfallData = [
    { name: 'Baseline Capacity', value: 72, type: 'base' },
    { name: 'Surge Volume', value: 15, type: 'surge' },
    { name: 'Staff Absence', value: 8, type: 'staff' },
    { name: 'Final Load %', value: 95, type: 'total' },
  ];

  const timelineData = [
    { stage: 'Referral', status: 'Completed', timestamp: '2/12 09:00', delay: '0h' },
    { stage: 'Scheduling', status: 'Completed', timestamp: '2/12 11:30', delay: '2.5h' },
    { stage: 'Visit Initiation', status: 'Delayed', timestamp: '2/13 14:00', delay: '24h+' },
    { stage: 'Post-Enc Detail', status: 'Pending', timestamp: '-', delay: '-' },
  ];

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
           <button onClick={onBack} className="p-2 hover:bg-[#1E2936] rounded-lg text-gray-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
           </button>
           <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                 Operational Encounter Analyzer
              </h1>
              <p className="text-gray-400 text-sm">Alert: <span className="text-[#A855F7] font-mono font-bold">{alert.id}</span> • Patient: <span className="text-white font-medium">{alert.patientName}</span></p>
           </div>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-[#2D3A4B] rounded-lg text-sm font-semibold hover:bg-[#1E2936]">Download Logs</button>
          <button className="px-4 py-2 bg-[#A855F7] text-white font-bold rounded-lg text-sm shadow-lg shadow-purple-900/30 hover:scale-105 transition-all">Coordinate Resource</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Snapshot */}
        <div className="space-y-6">
          <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-6 relative overflow-hidden">
             <div className="flex items-center space-x-4 mb-6">
                <div className={`w-16 h-16 rounded-full border-2 overflow-hidden ${alert.severity === RiskLevel.CRITICAL ? 'border-red-500' : 'border-[#A855F7]'}`}>
                   <img src={`https://picsum.photos/seed/${alert.patientId}/80/80`} alt="" />
                </div>
                <div>
                   <h3 className="text-xl font-bold">{alert.patientName}</h3>
                   <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border 
                     ${alert.severity === RiskLevel.CRITICAL ? 'text-red-400 bg-red-400/10 border-red-400/20' : 'text-[#A855F7] bg-[#A855F710] border-[#A855F720]'}
                   `}>{alert.severity} Severity Alert</span>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-[#0F1419] p-3 rounded-lg border border-[#2D3A4B]">
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Acuity Score</p>
                   <p className="text-2xl font-bold">{alert.acuityScore}<span className="text-xs text-gray-500">/100</span></p>
                </div>
                <div className="bg-[#0F1419] p-3 rounded-lg border border-[#2D3A4B]">
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Risk Index</p>
                   <p className={`text-2xl font-bold ${alert.acuityScore > 80 ? 'text-red-500' : 'text-orange-400'}`}>High</p>
                </div>
             </div>

             <div className="space-y-3">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Capacity Threshold</p>
                <div className="flex items-center gap-2">
                   <div className="flex-1 h-1.5 bg-[#0F1419] rounded-full overflow-hidden flex">
                      <div className="h-full bg-red-500 w-[94%]"></div>
                   </div>
                   <span className="text-[10px] font-mono text-red-400">94%</span>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed text-center">Departmental ceiling risk active.</p>
             </div>
          </div>

          <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-6">
             <h4 className="font-bold mb-4 flex items-center gap-2 text-[#A855F7]">
                <Icons.Resource /> Resource Impact Analysis
             </h4>
             <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                   <span className="text-gray-400">Resource Required</span>
                   <span className="font-bold text-white">{alert.resourceImpact}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                   <span className="text-gray-400">Availability Window</span>
                   <span className="font-bold text-red-400">{alert.timeSensitive}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                   <span className="text-gray-400">Handoff Delay</span>
                   <span className="font-bold text-orange-400">24.2 Hours</span>
                </div>
                <div className="w-full h-1 bg-[#0F1419] rounded-full overflow-hidden">
                   <div className="h-full bg-orange-500 w-[75%]"></div>
                </div>
             </div>
          </div>
        </div>

        {/* Deep Dive Analyzer */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-6">
             <h3 className="text-lg font-bold mb-2">Capacity Overload Decomposition</h3>
             <p className="text-xs text-gray-400 mb-8">Visualization of how operational variables compound the unit's final overload percentage.</p>
             <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={waterfallData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" horizontal={false} />
                      <XAxis type="number" stroke="#6B7280" fontSize={10} domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" stroke="#9CA3AF" fontSize={9} width={100} />
                      <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }} cursor={{ fill: '#252F3E' }} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {waterfallData.map((e, i) => (
                           <Cell key={`cell-${i}`} fill={e.type === 'base' ? '#00D9FF40' : e.type === 'total' ? '#FF4444' : '#A855F780'} />
                        ))}
                      </Bar>
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl overflow-hidden">
             <div className="p-5 border-b border-[#2D3A4B] bg-[#252F3E20] flex justify-between items-center">
                <h3 className="font-bold">Encounter Lifecycle Timeline</h3>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Real-time Coordination Tracking</span>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-[#0F1419] text-[10px] text-gray-500 uppercase">
                      <tr>
                         <th className="px-6 py-3">Stage</th>
                         <th className="px-6 py-3">Status</th>
                         <th className="px-6 py-3">Timestamp</th>
                         <th className="px-6 py-3">Delay</th>
                         <th className="px-6 py-3 text-right">Action Needed</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-[#2D3A4B]">
                      {timelineData.map((ev, i) => (
                        <tr key={i} className="hover:bg-[#252F3E40] transition-colors">
                           <td className="px-6 py-4">
                              <p className="text-sm font-bold text-white">{ev.stage}</p>
                           </td>
                           <td className="px-6 py-4">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase
                                ${ev.status === 'Completed' ? 'bg-green-500/20 text-green-500' : ev.status === 'Delayed' ? 'bg-red-500/20 text-red-500' : 'bg-gray-500/20 text-gray-400'}
                              `}>{ev.status}</span>
                           </td>
                           <td className="px-6 py-4 text-xs font-mono text-gray-400">{ev.timestamp}</td>
                           <td className="px-6 py-4 text-xs font-medium text-gray-300">
                             <span className={ev.delay !== '-' && ev.delay !== '0h' ? 'text-orange-400' : ''}>{ev.delay}</span>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <button className="text-[10px] font-bold text-[#00D9FF] hover:underline uppercase tracking-widest">Acknowledge</button>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EncounterAnalyzer;
