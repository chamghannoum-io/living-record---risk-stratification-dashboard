
import React, { useMemo } from 'react';
import { Patient, RiskLevel, AbnormalResultStatus } from '../../types';
import { Icons, COLORS } from '../../constants';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Cell, LineChart, Line
} from 'recharts';

interface AbnormalResultAnalyzerProps {
  patients: Patient[];
  selectedId: string | null;
  onSelectId: (id: string | null) => void;
}

const AbnormalResultAnalyzer: React.FC<AbnormalResultAnalyzerProps> = ({ patients, selectedId, onSelectId }) => {
  const patient = useMemo(() => patients.find(p => p.id === selectedId), [patients, selectedId]);

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
        <div className="p-8 bg-[#1E2936] rounded-full border border-[#2D3A4B] text-[#00D9FF]">
          <Icons.Bell />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold">Select a Patient</h2>
          <p className="text-gray-400 max-w-sm mx-auto mt-2">Choose a patient to perform deep-dive clinical intelligence on abnormal findings and out-of-range results.</p>
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
    let baseRisk = 4.0;
    const data = [{ name: 'Clinical Baseline', value: baseRisk, type: 'base' }];
    patient.abnormalResults.forEach(r => {
      data.push({ name: r.testName, value: r.impactScore, type: 'result' });
    });
    const total = baseRisk + patient.abnormalResults.reduce((acc, r) => acc + r.impactScore, 0);
    data.push({ name: 'Abnormality Burden', value: total, type: 'total' });
    return data;
  }, [patient]);

  const historicalTrends = [
    { time: 'T-72h', value: 4.5 },
    { time: 'T-48h', value: 4.8 },
    { time: 'T-24h', value: 5.9 },
    { time: 'T-12h', value: 6.8 },
    { time: 'Now', value: 6.8 },
  ];

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
           <button onClick={() => onSelectId(null)} className="p-2 hover:bg-[#1E2936] rounded-lg text-gray-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
           </button>
           <div>
              <h1 className="text-2xl font-bold text-white">Abnormal Result Intelligence Analyzer</h1>
              <p className="text-gray-400 text-sm">Patient: <span className="text-white font-medium">{patient.name}</span> • ID: <span className="font-mono text-[#00D9FF]">{patient.id}</span></p>
           </div>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-[#2D3A4B] rounded-lg text-sm font-semibold hover:bg-[#1E2936]">Clinical History</button>
          <button className="px-4 py-2 bg-[#FF4444] text-white font-bold rounded-lg text-sm shadow-lg shadow-red-900/30 hover:scale-105 transition-all">Escalate Triage</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile */}
        <div className="space-y-6">
          <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-6 relative overflow-hidden">
             <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-full border-2 border-red-500 overflow-hidden shadow-lg shadow-red-900/10">
                   <img src={`https://picsum.photos/seed/${patient.id}/80/80`} alt="" />
                </div>
                <div>
                   <h3 className="text-xl font-bold">{patient.name}</h3>
                   <span className="text-[10px] font-bold uppercase text-red-400 bg-red-400/10 px-2 py-0.5 rounded border border-red-400/20">Critical Alert Active</span>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-[#0F1419] p-3 rounded-lg border border-[#2D3A4B]">
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Active Flags</p>
                   <p className="text-2xl font-bold">{patient.abnormalResults.length}</p>
                </div>
                <div className="bg-[#0F1419] p-3 rounded-lg border border-[#2D3A4B]">
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Burden Score</p>
                   <p className="text-2xl font-bold text-red-400">8.6<span className="text-xs text-gray-500">/10</span></p>
                </div>
             </div>

             <div className="space-y-3">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Critical Finding</p>
                <div className="p-4 bg-red-950/20 border-l-4 border-red-500 rounded-r-lg">
                   <p className="text-xs font-bold text-red-400 mb-1">Hyperkalemia &gt; 6.5 mmol/L</p>
                   <p className="text-[10px] text-gray-400 leading-relaxed">Detected 42 mins ago. Highest priority escalation recommended based on ECG risk patterns.</p>
                </div>
             </div>
          </div>

          <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-6">
             <h4 className="font-bold mb-4 flex items-center gap-2">
                <Icons.Analytics /> Historical Recurrence
             </h4>
             <div className="h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={historicalTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" />
                      <XAxis dataKey="time" stroke="#6B7280" fontSize={10} />
                      <YAxis stroke="#6B7280" fontSize={10} hide />
                      <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }} />
                      <Line type="monotone" dataKey="value" stroke={COLORS.critical} strokeWidth={2} dot={{ r: 4 }} />
                   </LineChart>
                </ResponsiveContainer>
             </div>
             <p className="text-[10px] text-gray-400 mt-4 leading-relaxed">
                Abnormality recurrence cluster detected in last 24h. Probability of clinical instability escalating to 92% if current trend persists.
             </p>
          </div>
        </div>

        {/* Deep Dive */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-6">
             <h3 className="text-lg font-bold mb-2">Abnormality Burden Waterfall</h3>
             <p className="text-xs text-gray-400 mb-8">Visualization of how cumulative abnormal results contribute to acute physiological burden.</p>
             <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={waterfallData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" vertical={false} />
                      <XAxis dataKey="name" stroke="#6B7280" fontSize={10} tickFormatter={v => v.length > 15 ? v.substring(0, 15) + '...' : v} />
                      <YAxis stroke="#6B7280" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }} />
                      <Bar dataKey="value">
                        {waterfallData.map((e, i) => (
                           <Cell key={`cell-${i}`} fill={e.type === 'base' ? '#00D9FF40' : e.type === 'total' ? '#FF4444' : '#FF8C0080'} />
                        ))}
                      </Bar>
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl overflow-hidden">
             <div className="p-5 border-b border-[#2D3A4B] bg-[#252F3E20] flex justify-between items-center">
                <h3 className="font-bold">Patient Specific Flagged Findings</h3>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{patient.abnormalResults.length} Active Abnormalities</span>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-[#0F1419] text-[10px] text-gray-500 uppercase">
                      <tr>
                         <th className="px-6 py-3">Finding</th>
                         <th className="px-6 py-3 text-center">Severity</th>
                         <th className="px-6 py-3">Result / Range</th>
                         <th className="px-6 py-3">Risk Impact</th>
                         <th className="px-6 py-3 text-right">Status</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-[#2D3A4B]">
                      {patient.abnormalResults.map(r => (
                        <tr key={r.id} className="hover:bg-[#252F3E40] transition-colors">
                           <td className="px-6 py-4">
                              <p className="text-sm font-bold text-white">{r.testName}</p>
                              <p className="text-[10px] text-gray-500">{r.category} • {r.timestamp}</p>
                           </td>
                           <td className="px-6 py-4 text-center">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase
                                ${r.severity === RiskLevel.CRITICAL ? 'bg-red-500/20 text-red-500 pulsing-red' : ''}
                                ${r.severity === RiskLevel.HIGH ? 'bg-orange-500/20 text-orange-500' : ''}
                                ${r.severity === RiskLevel.MODERATE ? 'bg-yellow-500/20 text-yellow-500' : ''}
                                ${r.severity === RiskLevel.LOW ? 'bg-green-500/20 text-green-500' : ''}
                              `}>{r.severity}</span>
                           </td>
                           <td className="px-6 py-4 text-center">
                              <p className="text-xs font-mono font-bold text-white">{r.value}</p>
                              <p className="text-[10px] text-gray-500">Ref: {r.normalRange}</p>
                           </td>
                           <td className="px-6 py-4">
                              <span className="text-xs font-mono font-bold text-red-400">+{r.impactScore} pts</span>
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

export default AbnormalResultAnalyzer;
