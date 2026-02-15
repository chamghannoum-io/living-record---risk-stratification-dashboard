
import React, { useMemo } from 'react';
import { Patient, RiskLevel } from '../../types';
import { Icons, COLORS } from '../../constants';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ComposedChart, Line, Cell
} from 'recharts';

interface CareGapAnalyzerProps {
  patients: Patient[];
  selectedId: string | null;
  onSelectId: (id: string | null) => void;
}

const CareGapAnalyzer: React.FC<CareGapAnalyzerProps> = ({ patients, selectedId, onSelectId }) => {
  const patient = useMemo(() => patients.find(p => p.id === selectedId), [patients, selectedId]);

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
        <div className="p-8 bg-[#1E2936] rounded-full border border-[#2D3A4B]">
          <Icons.Users />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold">Select a Patient</h2>
          <p className="text-gray-400 max-w-sm">Choose a patient to perform deep-dive care gap intelligence and intervention planning.</p>
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

  const waterfallData = useMemo(() => {
    let currentScore = patient.riskScore - patient.activeGaps.reduce((sum, g) => sum + g.riskImpactScore, 0);
    const data = [{ name: 'Baseline', score: parseFloat(currentScore.toFixed(1)), type: 'base' }];
    
    patient.activeGaps.forEach(g => {
      currentScore += g.riskImpactScore;
      data.push({ name: g.detail, score: g.riskImpactScore, type: 'gap' });
    });
    
    data.push({ name: 'Current Total', score: patient.riskScore, type: 'total' });
    return data;
  }, [patient]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
           <button onClick={() => onSelectId(null)} className="p-2 hover:bg-[#1E2936] rounded-lg text-gray-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
           </button>
           <div>
              <h1 className="text-2xl font-bold">Care Gap Intelligence Analyzer</h1>
              <p className="text-gray-400 text-sm">Patient: <span className="text-white font-medium">{patient.name}</span> • ID: <span className="font-mono text-[#00D9FF]">{patient.id}</span></p>
           </div>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-[#2D3A4B] rounded-lg text-sm hover:bg-[#1E2936] transition-colors font-semibold">Generate Clinical Report</button>
          <button className="px-4 py-2 bg-[#00D9FF] text-[#0F1419] font-bold rounded-lg text-sm shadow-lg shadow-cyan-900/20 hover:scale-105 transition-all">Commit Intervention</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-6 relative overflow-hidden">
             <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-full border-2 border-[#00D9FF] overflow-hidden">
                  <img src={`https://picsum.photos/seed/${patient.id}/80/80`} alt="" />
                </div>
                <div>
                   <h3 className="text-xl font-bold">{patient.name}</h3>
                   <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded
                     ${patient.riskLevel === RiskLevel.CRITICAL ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-500'}
                   `}>{patient.riskLevel} Risk</span>
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-[#0F1419] p-3 rounded-lg border border-[#2D3A4B]">
                   <p className="text-[10px] text-gray-500 font-bold uppercase">Active Gaps</p>
                   <p className="text-2xl font-bold">{patient.activeGaps.length}</p>
                </div>
                <div className="bg-[#0F1419] p-3 rounded-lg border border-[#2D3A4B]">
                   <p className="text-[10px] text-gray-500 font-bold uppercase">Urgency Score</p>
                   <p className="text-2xl font-bold text-[#00D9FF]">8.2<span className="text-xs text-gray-500">/10</span></p>
                </div>
             </div>

             <div className="space-y-2">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Intervention Priority</p>
                <div className="p-4 bg-red-950/20 border-l-4 border-red-500 rounded-r-lg">
                   <p className="text-xs font-bold text-red-400 mb-1">High Urgency</p>
                   <p className="text-[10px] text-gray-400 leading-relaxed">Address overdue colonoscopy and HbA1c screening within 14 days to mitigate rising risk trajectory.</p>
                </div>
             </div>
          </div>

          <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-6">
             <h4 className="font-bold mb-4 flex items-center space-x-2">
                <Icons.Alert />
                <span>Guideline Adherence Timeline</span>
             </h4>
             <div className="space-y-6 relative ml-2">
                <div className="absolute left-0 top-0 bottom-0 w-px bg-[#2D3A4B]"></div>
                {[
                  { date: 'Oct 2025', event: 'Last Completed Wellness Visit', status: 'compliant' },
                  { date: 'Nov 2025', event: 'HbA1c Lab Order Cancelled', status: 'gap' },
                  { date: 'Dec 2025', event: 'Statin Therapy Recalculation', status: 'compliant' },
                  { date: 'Jan 2026', event: 'Colonoscopy Overdue (+1yr)', status: 'critical' },
                ].map((item, i) => (
                  <div key={i} className="relative pl-6">
                     <div className={`absolute left-[-4px] top-1.5 w-2 h-2 rounded-full 
                        ${item.status === 'compliant' ? 'bg-[#00FF88]' : item.status === 'gap' ? 'bg-[#FFB800]' : 'bg-[#FF4444]'}
                     `}></div>
                     <p className="text-[10px] text-gray-500 font-bold uppercase">{item.date}</p>
                     <p className="text-xs font-medium text-gray-200">{item.event}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Deep Dive Analyzer */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-6">
             <h3 className="text-lg font-bold mb-6">Gap Decomposition Waterfall</h3>
             <p className="text-xs text-gray-400 mb-8">Visualization of how each unmet care gap contributes to the overall risk score increase.</p>
             <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={waterfallData} margin={{ top: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" vertical={false} />
                      <XAxis dataKey="name" stroke="#6B7280" fontSize={10} tickFormatter={(v) => v.length > 15 ? v.substring(0, 15) + '...' : v} />
                      <YAxis stroke="#6B7280" fontSize={10} />
                      <Tooltip 
                         contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B', borderRadius: '8px' }}
                         itemStyle={{ color: '#00D9FF' }}
                      />
                      <Bar dataKey="score">
                        {waterfallData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.type === 'base' ? '#00D9FF40' : entry.type === 'total' ? '#00D9FF' : '#FF444490'} />
                        ))}
                      </Bar>
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl overflow-hidden">
             <div className="p-5 border-b border-[#2D3A4B] flex justify-between items-center bg-[#252F3E20]">
                <h3 className="font-bold">Active Interventions Needed</h3>
                <span className="text-[10px] font-bold text-gray-500 uppercase">{patient.activeGaps.length} Action Items</span>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-[#0F1419] text-[10px] text-gray-500 uppercase">
                      <tr>
                        <th className="px-6 py-3">Gap Detail</th>
                        <th className="px-6 py-3">Risk Impact</th>
                        <th className="px-6 py-3">Overdue</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Action</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-[#2D3A4B]">
                      {patient.activeGaps.map((gap, i) => (
                        <tr key={i} className="hover:bg-[#252F3E40] transition-colors">
                           <td className="px-6 py-4">
                              <p className="text-sm font-bold">{gap.detail}</p>
                              <p className="text-[10px] text-gray-500">{gap.type}</p>
                           </td>
                           <td className="px-6 py-4">
                              <span className="text-xs font-mono font-bold text-red-400">+{gap.riskImpactScore} pts</span>
                           </td>
                           <td className="px-6 py-4 text-xs font-mono">
                              {gap.daysOverdue} days
                           </td>
                           <td className="px-6 py-4">
                              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">{gap.status}</span>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <button className="text-[10px] font-bold text-[#00FF88] hover:underline">Mark Resolved</button>
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

export default CareGapAnalyzer;
