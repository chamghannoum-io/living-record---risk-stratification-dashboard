
import React, { useMemo } from 'react';
import { Patient, RiskLevel, TransitionRisk } from '../../types';
import { Icons, COLORS } from '../../constants';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Cell, LineChart, Line, ComposedChart, Area
} from 'recharts';

interface ContinuityAnalyzerProps {
  patients: Patient[];
  selectedId: string | null;
  onSelectId: (id: string | null) => void;
}

const ContinuityAnalyzer: React.FC<ContinuityAnalyzerProps> = ({ patients, selectedId, onSelectId }) => {
  const patient = useMemo(() => patients.find(p => p.id === selectedId), [patients, selectedId]);

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
        <div className="p-8 bg-[#1E2936] rounded-full border border-[#2D3A4B] text-[#00D9FF]">
          <Icons.Continuity />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold">Select a Patient</h2>
          <p className="text-gray-400 max-w-sm mx-auto mt-2">Perform deep-dive clinical intelligence on care transitions, readmission probability, and coordination artifacts.</p>
        </div>
        <select 
          className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
          onChange={(e) => onSelectId(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>-- Choose Patient --</option>
          {patients.slice(0, 15).map(p => <option key={p.id} value={p.id}>{p.id} - {p.name}</option>)}
        </select>
      </div>
    );
  }

  const waterfallData = [
    { name: 'Baseline Fragmentation', value: 3.2, type: 'base' },
    { name: 'Missing Summary', value: 1.2, type: 'factor' },
    { name: 'Follow-up Delay', value: 1.5, type: 'factor' },
    { name: 'MedRec Incomplete', value: 0.8, type: 'factor' },
    { name: 'Facility Transfer', value: 1.1, type: 'factor' },
    { name: 'Final Continuity Score', value: patient.continuityScore / 10, type: 'total' },
  ];

  const coordinationEvents = [
    { event: 'Discharge Summary Sent', status: 'Complete', timestamp: '2/14/2026 09:22', provider: 'Dr. Kumar', delay: '0h' },
    { event: 'Medication Reconciliation', status: 'Incomplete', timestamp: '2/15/2026 10:03', provider: 'Nurse Emma', delay: '24h' },
    { event: 'Follow-up Scheduled', status: 'Complete', timestamp: '2/14/2026 14:15', provider: 'Admin Sarah', delay: '5h' },
    { event: 'PCP Note Exchange', status: 'Pending', timestamp: '-', provider: 'Dr. Al-Rashid', delay: '48h+' },
  ];

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
           <button onClick={() => onSelectId(null)} className="p-2 hover:bg-[#1E2936] rounded-lg text-gray-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
           </button>
           <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                 Continuity of Care Analyzer
              </h1>
              <p className="text-gray-400 text-sm">Patient: <span className="text-white font-medium">{patient.name}</span> • ID: <span className="font-mono text-[#00D9FF]">{patient.id}</span></p>
           </div>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-[#2D3A4B] rounded-lg text-sm font-semibold hover:bg-[#1E2936]">Coordination Logs</button>
          <button className="px-4 py-2 bg-[#A855F7] text-white font-bold rounded-lg text-sm shadow-lg shadow-purple-900/30 hover:scale-105 transition-all">Resolve Coordination Gaps</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Snapshot */}
        <div className="space-y-6">
          <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-6 relative overflow-hidden">
             <div className="flex items-center space-x-4 mb-6">
                <div className={`w-16 h-16 rounded-full border-2 overflow-hidden ${patient.continuityScore < 50 ? 'border-red-500 shadow-red-900/10' : 'border-[#00D9FF]'}`}>
                   <img src={`https://picsum.photos/seed/${patient.id}/80/80`} alt="" />
                </div>
                <div>
                   <h3 className="text-xl font-bold">{patient.name}</h3>
                   <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border 
                     ${patient.continuityScore < 50 ? 'text-red-400 bg-red-400/10 border-red-400/20' : 'text-[#00D9FF] bg-[#00D9FF10] border-[#00D9FF20]'}
                   `}>{patient.continuityScore < 50 ? 'High Fragmentation' : 'Coordinated Episode'}</span>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-[#0F1419] p-3 rounded-lg border border-[#2D3A4B]">
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Cont. Score</p>
                   <p className="text-2xl font-bold">{(patient.continuityScore / 10).toFixed(1)}<span className="text-xs text-gray-500">/10</span></p>
                </div>
                <div className="bg-[#0F1419] p-3 rounded-lg border border-[#2D3A4B]">
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Readmit Prob.</p>
                   <p className={`text-2xl font-bold ${patient.riskLevel === RiskLevel.CRITICAL ? 'text-red-500' : 'text-orange-400'}`}>24%</p>
                </div>
             </div>

             <div className="space-y-3">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Care Timeline Status</p>
                <div className="flex items-center gap-2">
                   <div className="flex-1 h-1.5 bg-[#0F1419] rounded-full overflow-hidden flex gap-1">
                      <div className="h-full bg-green-500 w-[40%]"></div>
                      <div className="h-full bg-yellow-500 w-[20%]"></div>
                      <div className="h-full bg-red-500 w-[40%]"></div>
                   </div>
                </div>
                <div className="flex justify-between text-[9px] text-gray-500 font-bold uppercase">
                   <span>Admission</span>
                   <span>Discharge</span>
                   <span>Follow-up</span>
                </div>
             </div>
          </div>

          <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-6">
             <h4 className="font-bold mb-4 flex items-center gap-2">
                <Icons.Analytics /> Coordination Indicators
             </h4>
             <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                   <span className="text-gray-400">Medication Reconciliation</span>
                   <span className="font-bold text-red-400">Incomplete</span>
                </div>
                <div className="w-full h-1 bg-[#0F1419] rounded-full overflow-hidden">
                   <div className="h-full bg-red-500 w-[30%]"></div>
                </div>
                <div className="flex justify-between items-center text-xs">
                   <span className="text-gray-400">Discharge Summary Completion</span>
                   <span className="font-bold text-green-400">Complete (Sent)</span>
                </div>
                <div className="w-full h-1 bg-[#0F1419] rounded-full overflow-hidden">
                   <div className="h-full bg-green-500 w-full"></div>
                </div>
                <div className="flex justify-between items-center text-xs">
                   <span className="text-gray-400">Avg Care Team Response</span>
                   <span className="font-bold text-orange-400">38 Hours</span>
                </div>
             </div>
          </div>
        </div>

        {/* Deep Dive Analyzer */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-6">
             <h3 className="text-lg font-bold mb-2">Continuity Risk Contribution</h3>
             <p className="text-xs text-gray-400 mb-8">Visualization of how coordination gaps compound the patient's fragmentation score.</p>
             <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={waterfallData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" horizontal={false} />
                      <XAxis type="number" stroke="#6B7280" fontSize={10} domain={[0, 10]} />
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
                <h3 className="font-bold">Coordination Events Registry</h3>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{coordinationEvents.length} Recent Episodes</span>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-[#0F1419] text-[10px] text-gray-500 uppercase">
                      <tr>
                         <th className="px-6 py-3">Event</th>
                         <th className="px-6 py-3">Status</th>
                         <th className="px-6 py-3">Timestamp</th>
                         <th className="px-6 py-3">Responsible</th>
                         <th className="px-6 py-3 text-right">Action</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-[#2D3A4B]">
                      {coordinationEvents.map((ev, i) => (
                        <tr key={i} className="hover:bg-[#252F3E40] transition-colors">
                           <td className="px-6 py-4">
                              <p className="text-sm font-bold text-white">{ev.event}</p>
                           </td>
                           <td className="px-6 py-4">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase
                                ${ev.status === 'Complete' ? 'bg-green-500/20 text-green-500' : ev.status === 'Incomplete' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'}
                              `}>{ev.status}</span>
                           </td>
                           <td className="px-6 py-4 text-xs font-mono text-gray-400">{ev.timestamp}</td>
                           <td className="px-6 py-4 text-xs font-medium text-gray-300">{ev.provider}</td>
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

export default ContinuityAnalyzer;
