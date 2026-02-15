
import React, { useMemo } from 'react';
import { Patient, RiskLevel } from '../../types';
import { Icons, COLORS } from '../../constants';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Cell
} from 'recharts';

interface SafetyAnalyzerProps {
  patients: Patient[];
  selectedId: string | null;
  onSelectId: (id: string | null) => void;
}

const SafetyAnalyzer: React.FC<SafetyAnalyzerProps> = ({ patients, selectedId, onSelectId }) => {
  const patient = useMemo(() => patients.find(p => p.id === selectedId), [patients, selectedId]);

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
        <div className="p-8 bg-[#1E2936] rounded-full border border-[#2D3A4B] text-[#00D9FF]">
          <Icons.Shield />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold">Select a Patient</h2>
          <p className="text-gray-400 max-w-sm">Perform deep-dive safety analysis on medications, contraindications, and potential interactions.</p>
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
    let baseRisk = patient.riskScore - patient.safetyAlerts.reduce((s, a) => s + a.riskImpact, 0);
    if (baseRisk < 0) baseRisk = 2.0;
    const data = [{ name: 'Clinical Baseline', value: parseFloat(baseRisk.toFixed(1)), type: 'base' }];
    patient.safetyAlerts.forEach(a => {
      data.push({ name: a.medication, value: a.riskImpact, type: 'alert' });
    });
    data.push({ name: 'Final Safety Risk', value: patient.riskScore, type: 'total' });
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
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                 Safety Guardrail Analyzer
              </h1>
              <p className="text-gray-400 text-sm">Patient: <span className="text-white font-medium">{patient.name}</span> • ID: <span className="font-mono text-[#00D9FF]">{patient.id}</span></p>
           </div>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-[#2D3A4B] rounded-lg text-sm font-semibold hover:bg-[#1E2936]">Override Review</button>
          <button className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg text-sm shadow-lg shadow-red-900/30">Escalate Violation</button>
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
                   <p className="text-[10px] text-gray-500 font-bold uppercase">Med Risk Score</p>
                   <p className="text-2xl font-bold">{patient.medicationRiskScore}<span className="text-xs text-gray-500">/10</span></p>
                </div>
                <div className="bg-[#0F1419] p-3 rounded-lg border border-[#2D3A4B]">
                   <p className="text-[10px] text-gray-500 font-bold uppercase">Overrides</p>
                   <p className="text-2xl font-bold text-orange-400">{patient.overrideFrequency}</p>
                </div>
             </div>

             <div className="space-y-3">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Active Safety Status</p>
                <div className="p-4 bg-red-950/20 border-l-4 border-red-500 rounded-r-lg">
                   <p className="text-xs font-bold text-red-400 mb-1">{patient.safetyAlerts.length} Open Violations</p>
                   <p className="text-[10px] text-gray-400 leading-relaxed">Immediate review required for Warfarin/NSAID interaction detected 3 days ago.</p>
                </div>
             </div>
          </div>

          <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-6">
             <h4 className="font-bold mb-4 flex items-center gap-2">
                <Icons.Analytics /> Clinical Indicators
             </h4>
             <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                   <span className="text-gray-400">Renal Function (eGFR)</span>
                   <span className="font-bold text-red-400">28 (Severely Impaired)</span>
                </div>
                <div className="w-full h-1 bg-[#0F1419] rounded-full">
                   <div className="h-full bg-red-500 w-[28%]"></div>
                </div>
                <div className="flex justify-between items-center text-xs">
                   <span className="text-gray-400">Hepatic Function</span>
                   <span className="font-bold text-green-400">Normal Range</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                   <span className="text-gray-400">Previous Adverse Events</span>
                   <span className="font-bold text-orange-400">1 Documentation</span>
                </div>
             </div>
          </div>
        </div>

        {/* Analysis */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-6">
             <h3 className="text-lg font-bold mb-2">Safety Risk Waterfall</h3>
             <p className="text-xs text-gray-400 mb-8">Visualization of how active alerts compound the patient's baseline clinical risk.</p>
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
             <div className="p-5 border-b border-[#2D3A4B] bg-[#252F3E20]">
                <h3 className="font-bold">Detailed Safety Guardrail Table</h3>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-[#0F1419] text-[10px] text-gray-500 uppercase">
                      <tr>
                         <th className="px-6 py-3">Guardrail</th>
                         <th className="px-6 py-3 text-center">Severity</th>
                         <th className="px-6 py-3">Trigger / Conflict</th>
                         <th className="px-6 py-3">Risk Impact</th>
                         <th className="px-6 py-3 text-right">Recommendation</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-[#2D3A4B]">
                      {patient.safetyAlerts.map(a => (
                        <tr key={a.id} className="hover:bg-[#252F3E40] transition-colors">
                           <td className="px-6 py-4">
                              <p className="text-sm font-bold">{a.medication}</p>
                              <p className="text-[10px] text-gray-500">{a.type}</p>
                           </td>
                           <td className="px-6 py-4 text-center">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase
                                ${a.severity === RiskLevel.CRITICAL ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-500'}
                              `}>{a.severity}</span>
                           </td>
                           <td className="px-6 py-4">
                              <p className="text-xs text-gray-300 italic">{a.conflict}</p>
                           </td>
                           <td className="px-6 py-4">
                              <span className="text-xs font-mono font-bold text-red-400">+{a.riskImpact} pts</span>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <p className="text-[10px] font-bold text-[#00FF88]">{a.recommendation}</p>
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

export default SafetyAnalyzer;
