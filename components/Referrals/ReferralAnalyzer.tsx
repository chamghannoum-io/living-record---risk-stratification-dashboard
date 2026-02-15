
import React, { useMemo } from 'react';
import { Referral, ReferralUrgency, ReferralStatus, AuthStatus } from '../../types';
import { Icons, COLORS, generateMockReferrals } from '../../constants';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Cell, LineChart, Line, ComposedChart, Area
} from 'recharts';

interface ReferralAnalyzerProps {
  selectedReferralId: string | null;
  onBack: () => void;
}

const ReferralAnalyzer: React.FC<ReferralAnalyzerProps> = ({ selectedReferralId, onBack }) => {
  const referrals = useMemo(() => generateMockReferrals(20), []);
  const referral = useMemo(() => referrals.find(r => r.id === selectedReferralId) || referrals[0], [selectedReferralId, referrals]);

  const readinessData = [
    { category: 'Clinical Doc', status: 'Complete', owner: 'Dr. Al-Rashid', due: '-', comp: 100 },
    { category: 'Insurance Forms', status: 'Pending', owner: 'Admin', due: '2/16/2026', comp: 65 },
    { category: 'Facility Confirmation', status: 'Pending', owner: 'Coordinator', due: '2/17/2026', comp: 40 },
    { category: 'Patient Consent', status: 'Complete', owner: 'Patient', due: '-', comp: 100 },
  ];

  const stageTimes = [
    { stage: 'Created', time: '1.2h' },
    { stage: 'Insurance Submit', time: '24.5h' },
    { stage: 'Authorized', time: '12.8h' },
    { stage: 'Scheduled', time: 'Pending' },
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
                 Referral Coordination Analyzer
              </h1>
              <p className="text-gray-400 text-sm">Referral: <span className="text-[#00D9FF] font-mono font-bold">{referral.id}</span> • Patient: <span className="text-white font-medium">{referral.patientName}</span></p>
           </div>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-[#2D3A4B] rounded-lg text-sm font-semibold hover:bg-[#1E2936]">Coordination Logs</button>
          <button className="px-4 py-2 bg-[#00D9FF] text-[#0F1419] font-bold rounded-lg text-sm shadow-lg shadow-cyan-900/30 hover:scale-105 transition-all">Update Workflow</button>
        </div>
      </div>

      {/* Overdue Banner */}
      {referral.daysOpen > 7 && (
        <div className="bg-red-950/20 border border-red-500/50 rounded-xl p-4 flex items-center justify-between text-red-200">
           <div className="flex items-center gap-3">
              <Icons.Alert />
              <span className="text-sm font-bold">Referral overdue by {referral.daysOpen - 7} days – Immediate escalation recommended.</span>
           </div>
           <div className="flex gap-2">
              <button className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold uppercase rounded">Assign Senior Coord</button>
              <button className="px-3 py-1 bg-white/10 text-white text-[10px] font-bold uppercase rounded">Notify Specialist</button>
           </div>
        </div>
      )}

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalyzerMetric title="Referral Status" value={referral.status} detail={referral.urgency} color={COLORS.cyan} />
        <AnalyzerMetric title="Authorization Status" value={referral.authStatus} detail="Expires in 14 days" color={COLORS.high} />
        <AnalyzerMetric title="Facility Target" value={referral.receivingFacility} detail={`Coord: ${referral.careCoordinator}`} color={COLORS.blue} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-6">
             <h3 className="font-bold mb-4 flex items-center gap-2">
                <Icons.Analytics /> Workflow Readiness
             </h3>
             <div className="space-y-4">
                <div>
                   <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-gray-400 uppercase tracking-widest font-bold">Overall Readiness</span>
                      <span className="text-white font-mono font-bold">{referral.readinessScore}%</span>
                   </div>
                   <div className="w-full h-2 bg-[#0F1419] rounded-full overflow-hidden">
                      <div className="h-full bg-[#00D9FF] transition-all duration-1000" style={{ width: `${referral.readinessScore}%` }}></div>
                   </div>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed italic">Readiness score combined from clinical documentation, authorization approvals, and facility acceptance.</p>
             </div>
          </div>

          <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-6">
             <h3 className="font-bold mb-6">Stage Intelligence</h3>
             <div className="space-y-6 relative ml-3">
                <div className="absolute left-0 top-0 bottom-0 w-px bg-[#2D3A4B]"></div>
                {stageTimes.map((s, i) => (
                  <div key={i} className="relative pl-6">
                     <div className={`absolute left-[-4px] top-1.5 w-2 h-2 rounded-full 
                        ${s.time === 'Pending' ? 'bg-gray-600' : 'bg-[#00D9FF]'}
                     `}></div>
                     <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{s.stage}</p>
                     <p className="text-xs font-medium text-gray-200">Processing Time: <span className="text-[#00D9FF]">{s.time}</span></p>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Breakdown & Logs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl overflow-hidden">
             <div className="p-5 border-b border-[#2D3A4B] bg-[#252F3E20]">
                <h3 className="font-bold">Coordination Breakdown Matrix</h3>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-[#0F1419] text-[10px] text-gray-500 uppercase">
                      <tr>
                         <th className="px-6 py-3">Category</th>
                         <th className="px-6 py-3">Status</th>
                         <th className="px-6 py-3">Owner</th>
                         <th className="px-6 py-3 text-center">Due Date</th>
                         <th className="px-6 py-3 text-right">Completion</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-[#2D3A4B]">
                      {readinessData.map((row, i) => (
                        <tr key={i} className="hover:bg-[#252F3E40] transition-colors">
                           <td className="px-6 py-4">
                              <p className="text-xs font-bold text-white">{row.category}</p>
                           </td>
                           <td className="px-6 py-4">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase
                                ${row.status === 'Complete' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}
                              `}>{row.status}</span>
                           </td>
                           <td className="px-6 py-4 text-xs text-gray-400">{row.owner}</td>
                           <td className="px-6 py-4 text-xs font-mono text-center">{row.due}</td>
                           <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <span className="text-[10px] font-mono font-bold text-gray-300">{row.comp}%</span>
                                <div className="w-12 h-1 bg-[#0F1419] rounded-full overflow-hidden">
                                   <div className="h-full bg-[#00FF88]" style={{ width: `${row.comp}%` }}></div>
                                </div>
                              </div>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>

          <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-6">
             <h3 className="font-bold mb-6 flex items-center gap-2">
                <Icons.Referral /> Communication Log
             </h3>
             <div className="space-y-4">
                {referral.communications.map(msg => (
                  <div key={msg.id} className="p-4 bg-[#0F1419] border border-[#2D3A4B] rounded-lg group hover:border-gray-500 transition-colors">
                     <div className="flex justify-between mb-2">
                        <span className="text-[10px] font-bold text-[#00D9FF]">{msg.from}</span>
                        <span className="text-[9px] text-gray-500 font-mono italic">{msg.timestamp}</span>
                     </div>
                     <p className="text-xs text-gray-300 leading-relaxed">{msg.message}</p>
                  </div>
                ))}
                <div className="relative">
                   <textarea 
                     placeholder="Type a coordination update..."
                     className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded-lg p-3 text-xs outline-none focus:border-[#00D9FF] min-h-[80px]"
                   />
                   <button className="absolute bottom-3 right-3 text-[10px] font-bold text-[#00D9FF] uppercase tracking-widest">Send Log Update</button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AnalyzerMetric: React.FC<{ title: string; value: string; detail: string; color: string }> = ({ title, value, detail, color }) => (
  <div className="bg-[#1E2936] border border-[#2D3A4B] p-5 rounded-xl border-l-4" style={{ borderColor: color }}>
     <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{title}</p>
     <p className="text-xl font-bold text-white mt-1">{value}</p>
     <p className="text-[10px] text-gray-400 mt-1">{detail}</p>
  </div>
);

export default ReferralAnalyzer;
