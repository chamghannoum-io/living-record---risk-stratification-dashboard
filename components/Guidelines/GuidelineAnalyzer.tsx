
import React, { useMemo } from 'react';
import { Patient, ComplianceStatus } from '../../types';
import { Icons, COLORS } from '../../constants';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

interface GuidelineAnalyzerProps {
  patients: Patient[];
  selectedId: string | null;
  onSelectId: (id: string | null) => void;
}

const GuidelineAnalyzer: React.FC<GuidelineAnalyzerProps> = ({ patients, selectedId, onSelectId }) => {
  const patient = useMemo(() => patients.find(p => p.id === selectedId), [patients, selectedId]);

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
        <div className="p-8 bg-[#1E2936] rounded-full border border-[#2D3A4B] text-[#00D9FF]">
          <Icons.Analytics />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold">Select a Patient</h2>
          <p className="text-gray-400 max-w-sm mx-auto mt-2">Evaluate and monitor adherence to evidence-based clinical standards of care for specific patient profiles.</p>
        </div>
        <select 
          className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
          onChange={(e) => onSelectId(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>-- Choose Patient --</option>
          {patients.slice(0, 20).map(p => <option key={p.id} value={p.id}>{p.id} - {p.name}</option>)}
        </select>
      </div>
    );
  }

  const scoreData = [
    { name: 'Adherence', value: patient.complianceScore },
    { name: 'Gap', value: 100 - patient.complianceScore },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
           <button onClick={() => onSelectId(null)} className="p-2 hover:bg-[#1E2936] rounded-lg text-gray-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
           </button>
           <div>
              <h1 className="text-2xl font-bold text-white">Guideline Compliance Analyzer</h1>
              <p className="text-gray-400 text-sm">Patient Profile: <span className="text-white font-medium">{patient.name}</span> • ID: <span className="font-mono text-[#00D9FF]">{patient.id}</span></p>
           </div>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-[#2D3A4B] rounded-lg text-sm font-semibold hover:bg-[#1E2936]">Clinical Audit Export</button>
          <button className="px-4 py-2 bg-[#00D9FF] text-[#0F1419] font-bold rounded-lg text-sm shadow-lg shadow-cyan-900/20">Acknowledge Deviation</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Adherence Snapshot */}
        <div className="space-y-6">
          <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-6 relative overflow-hidden">
             <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-full border-2 border-[#2D3A4B] overflow-hidden">
                   <img src={`https://picsum.photos/seed/${patient.id}/80/80`} alt="" />
                </div>
                <div>
                   <h3 className="text-xl font-bold">{patient.name}</h3>
                   <span className="text-[10px] font-bold uppercase text-[#00D9FF]">Audit Grade: A-</span>
                </div>
             </div>

             <div className="flex items-center justify-center h-[180px] mb-6 relative">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <Pie data={scoreData} innerRadius={60} outerRadius={75} startAngle={90} endAngle={450} paddingAngle={0} dataKey="value">
                        <Cell fill={COLORS.cyan} />
                        <Cell fill="#0F1419" />
                      </Pie>
                   </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                   <p className="text-3xl font-bold">{patient.complianceScore}%</p>
                   <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Compliant</p>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-[#0F1419] p-3 rounded-lg border border-[#2D3A4B]">
                   <p className="text-[10px] text-gray-500 font-bold uppercase">Protocols</p>
                   <p className="text-xl font-bold">{patient.guidelineAdherence.length}</p>
                </div>
                <div className="bg-[#0F1419] p-3 rounded-lg border border-[#2D3A4B]">
                   <p className="text-[10px] text-gray-500 font-bold uppercase">Deviations</p>
                   <p className="text-xl font-bold text-red-400">{patient.guidelineAdherence.filter(a => a.status === ComplianceStatus.NON_COMPLIANT).length}</p>
                </div>
             </div>

             <div className="p-4 bg-orange-950/20 border-l-4 border-orange-500 rounded-r-lg">
                <p className="text-xs font-bold text-orange-400 mb-1">Corrective Priority</p>
                <p className="text-[10px] text-gray-400 leading-relaxed">HbA1c monitoring documentation missing from January labs. Projected risk of audit failure: High.</p>
             </div>
          </div>

          <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-6">
             <h4 className="font-bold mb-4 flex items-center gap-2">
                <Icons.Analytics /> Guideline Adherence Timeline
             </h4>
             <div className="space-y-6 relative ml-2">
                <div className="absolute left-0 top-0 bottom-0 w-px bg-[#2D3A4B]"></div>
                {[
                  { date: 'Feb 12', label: 'Lipid Panel Review', status: 'compliant' },
                  { date: 'Feb 05', label: 'HbA1c Lab Order', status: 'missed' },
                  { date: 'Jan 28', label: 'Annual Wellness Visit', status: 'compliant' },
                ].map((item, i) => (
                  <div key={i} className="relative pl-6">
                     <div className={`absolute left-[-4px] top-1.5 w-2 h-2 rounded-full 
                        ${item.status === 'compliant' ? 'bg-[#00FF88]' : 'bg-[#FF4444]'}
                     `}></div>
                     <p className="text-[10px] text-gray-500 font-bold uppercase">{item.date}</p>
                     <p className="text-xs font-medium text-gray-200">{item.label}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Breakdown Table */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl overflow-hidden">
              <div className="p-5 border-b border-[#2D3A4B] bg-[#252F3E20] flex justify-between items-center">
                 <h3 className="font-bold">Comprehensive Guideline Adherence Matrix</h3>
                 <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{patient.guidelineAdherence.length} Active Protocols</span>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-[#0F1419] text-[10px] text-gray-500 uppercase">
                       <tr>
                          <th className="px-6 py-3">Protocol / Guideline</th>
                          <th className="px-6 py-3 text-center">Status</th>
                          <th className="px-6 py-3">Risk Impact</th>
                          <th className="px-6 py-3">Evidence Source</th>
                          <th className="px-6 py-3 text-right">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2D3A4B]">
                       {patient.guidelineAdherence.map(a => (
                         <tr key={a.id} className="hover:bg-[#252F3E40] transition-colors">
                            <td className="px-6 py-4">
                               <p className="text-sm font-bold text-white">{a.protocol}</p>
                               <p className="text-[10px] text-gray-500">{a.category}</p>
                            </td>
                            <td className="px-6 py-4 text-center">
                               <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase
                                 ${a.status === ComplianceStatus.COMPLIANT ? 'bg-green-500/20 text-green-500' : ''}
                                 ${a.status === ComplianceStatus.NON_COMPLIANT ? 'bg-red-500/20 text-red-500' : ''}
                                 ${a.status === ComplianceStatus.AT_RISK ? 'bg-orange-500/20 text-orange-500' : ''}
                                 ${a.status === ComplianceStatus.PARTIAL ? 'bg-yellow-500/20 text-yellow-500' : ''}
                               `}>{a.status}</span>
                            </td>
                            <td className="px-6 py-4">
                               <p className="text-xs text-gray-300 leading-tight">{a.riskOfNonAdherence}</p>
                            </td>
                            <td className="px-6 py-4 text-xs font-medium text-[#00D9FF] italic">
                               {a.evidenceSource}
                            </td>
                            <td className="px-6 py-4 text-right">
                               <button className="text-[10px] font-bold text-gray-400 hover:text-white transition-colors">Documentation</button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-6">
                 <h4 className="text-sm font-bold mb-4 uppercase text-gray-500">Compliance Risk Projection</h4>
                 <div className="space-y-4">
                    <p className="text-xs text-gray-400 leading-relaxed">
                       If no action is taken regarding the metabolic monitoring deviations, the patient's audit compliance score is projected to drop to <span className="text-red-400 font-bold">68%</span> within 60 days.
                    </p>
                    <div className="p-3 bg-red-950/20 border border-red-900/40 rounded-lg">
                       <p className="text-xs font-bold text-red-400">92% Deviation Probability</p>
                    </div>
                 </div>
              </div>
              <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-6 flex flex-col justify-center">
                 <h4 className="text-sm font-bold mb-4 uppercase text-gray-500">Corrective Recommendation</h4>
                 <p className="text-xs font-medium text-[#00FF88] mb-4">
                    Initiate corrective protocol review and manual audit of external laboratory documentation for HbA1c values.
                 </p>
                 <button className="w-full py-2 bg-[#00FF8810] border border-[#00FF8830] text-[#00FF88] rounded text-[10px] font-bold uppercase hover:bg-[#00FF88] hover:text-[#0F1419] transition-all">
                    Commit Correction
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default GuidelineAnalyzer;
