
import React, { useMemo } from 'react';
import { Patient, RiskLevel, RiskFactor } from '../../types';
import { generatePatientRiskFactors, Icons, COLORS } from '../../constants';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface AnalyzerViewProps {
  patients: Patient[];
  selectedId: string | null;
  onSelectId: (id: string | null) => void;
}

const AnalyzerView: React.FC<AnalyzerViewProps> = ({ patients, selectedId, onSelectId }) => {
  const selectedPatient = useMemo(() => 
    patients.find(p => p.id === selectedId), 
    [patients, selectedId]
  );

  const riskFactors = useMemo(() => 
    selectedPatient ? generatePatientRiskFactors(selectedPatient) : [],
    [selectedPatient]
  );

  // Sample data for historical risk trajectory
  const trajectoryData = [
    { time: 'Aug 25', score: 4.2 },
    { time: 'Sep 25', score: 4.8 },
    { time: 'Oct 25', score: 5.1 },
    { time: 'Nov 25', score: 6.9 },
    { time: 'Dec 25', score: 6.7 },
    { time: 'Jan 26', score: 7.2 },
    { time: 'Feb 26', score: selectedPatient?.riskScore || 0 },
  ];

  if (!selectedId || !selectedPatient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="w-24 h-24 bg-[#1E2936] rounded-full flex items-center justify-center text-gray-500">
          <Icons.Users />
        </div>
        <div>
          <h2 className="text-2xl font-bold">No Patient Selected</h2>
          <p className="text-gray-400 max-w-sm mx-auto mt-2">
            Select a patient from the population dashboard or use the search below to begin a detailed risk stratification analysis.
          </p>
        </div>
        <div className="w-full max-w-md">
          <select 
            className="w-full bg-[#1E2936] border border-[#2D3A4B] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
            onChange={(e) => onSelectId(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>-- Choose a patient --</option>
            {patients.slice(0, 20).map(p => (
              <option key={p.id} value={p.id}>{p.id} - {p.name}</option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex space-x-2 text-xs text-gray-500 mb-2 uppercase tracking-widest font-semibold">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-[#00D9FF]">Risk Stratification Analyzer</span>
          </nav>
          <h1 className="text-3xl font-bold">Risk Profile Analysis</h1>
          <p className="text-gray-400 text-sm">Provider View: Clinical Decision Support</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => onSelectId(null)}
            className="px-4 py-2 border border-[#2D3A4B] rounded-lg text-sm font-semibold hover:bg-[#1E2936] transition-colors"
          >
            Switch Patient
          </button>
          <button className="px-4 py-2 bg-[#FF4444] text-white rounded-lg text-sm font-bold shadow-lg shadow-red-900/20 hover:scale-105 transition-all">
            Escalate Care Plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Patient Snapshot */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-6 relative overflow-hidden">
            <div className="flex items-center space-x-4 mb-6">
              <img src={`https://picsum.photos/seed/${selectedPatient.id}/80/80`} className="w-16 h-16 rounded-full border-2 border-[#2D3A4B]" alt="" />
              <div>
                <h3 className="text-xl font-bold">{selectedPatient.name}</h3>
                <p className="text-sm text-[#00D9FF] font-mono">{selectedPatient.id} • {selectedPatient.gender}</p>
                <p className="text-xs text-gray-400">{selectedPatient.age} years old</p>
              </div>
            </div>

            <div className="space-y-4">
               <div className="p-4 bg-[#0F1419] rounded-lg border-l-4" style={{ borderColor: selectedPatient.riskLevel === RiskLevel.CRITICAL ? COLORS.critical : COLORS.high }}>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Current Risk Profile</p>
                  <div className="flex items-end justify-between mt-1">
                    <span className="text-2xl font-bold">{selectedPatient.riskLevel}</span>
                    <span className="text-3xl font-mono text-[#00D9FF]">{selectedPatient.riskScore}<span className="text-xs text-gray-500 font-normal">/10</span></span>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-3">
                 <div className="p-3 bg-[#0F1419] rounded-lg">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Med Adherence</p>
                    <p className="text-lg font-bold">{selectedPatient.medicationAdherence}%</p>
                 </div>
                 <div className="p-3 bg-[#0F1419] rounded-lg">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Comorbidities</p>
                    <p className="text-lg font-bold">{selectedPatient.comorbiditiesCount}</p>
                 </div>
               </div>

               <div className="space-y-2">
                 <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Primary Conditions</p>
                 <div className="flex flex-wrap gap-2">
                   {selectedPatient.primaryConditions.map(c => (
                     <span key={c} className="px-2 py-1 bg-[#2D3A4B] rounded text-[10px] font-medium text-gray-300">{c}</span>
                   ))}
                 </div>
               </div>
            </div>
          </div>

          <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-6">
            <h4 className="text-sm font-bold mb-4 uppercase tracking-widest text-gray-400">Vulnerability Factors</h4>
            <div className="space-y-3">
              {selectedPatient.vulnerabilityFactors.map((v, i) => (
                <div key={i} className="flex items-start space-x-3 text-xs">
                  <span className="mt-1 text-[#FFB800]">•</span>
                  <span className="text-gray-300 leading-relaxed">{v}</span>
                </div>
              ))}
              {selectedPatient.vulnerabilityFactors.length === 0 && <p className="text-xs text-gray-500 italic">No vulnerability factors documented.</p>}
            </div>
          </div>
        </div>

        {/* Right: Detailed Analysis */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Risk Score Trajectory</h3>
              <div className="flex items-center space-x-2 text-xs">
                <span className="w-3 h-3 rounded-full bg-[#00D9FF]"></span>
                <span className="text-gray-400">Historical Trend</span>
              </div>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trajectoryData}>
                  <defs>
                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.cyan} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={COLORS.cyan} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" />
                  <XAxis dataKey="time" stroke="#6B7280" fontSize={10} />
                  <YAxis stroke="#6B7280" fontSize={10} domain={[0, 10]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }}
                    itemStyle={{ color: '#FFFFFF' }}
                  />
                  <Area type="monotone" dataKey="score" stroke={COLORS.cyan} fillOpacity={1} fill="url(#colorRisk)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 bg-red-950/20 border border-red-900/30 rounded-lg flex items-center space-x-3">
              <span className="text-red-500 font-bold text-lg">!</span>
              <p className="text-xs text-red-200">Risk acceleration detected (+{selectedPatient.trend} points in 30 days). Clinical inflection point identified in Nov 2025.</p>
            </div>
          </div>

          <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl overflow-hidden">
             <div className="p-5 border-b border-[#2D3A4B] flex justify-between items-center bg-[#252F3E20]">
                <h3 className="font-bold">Comprehensive Risk Factor Analysis</h3>
                <button className="text-xs text-[#00D9FF] hover:underline font-semibold">Export CSV</button>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-[#0F1419] text-[10px] text-gray-500 uppercase">
                   <tr>
                     <th className="px-4 py-3">Risk Factor</th>
                     <th className="px-4 py-3">Impact</th>
                     <th className="px-4 py-3">Severity</th>
                     <th className="px-4 py-3">Clinical Finding</th>
                     <th className="px-4 py-3">Recommended Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-[#2D3A4B]">
                   {riskFactors.map((f, i) => (
                     <tr key={i} className="hover:bg-[#252F3E50] transition-colors">
                       <td className="px-4 py-4">
                         <p className="text-sm font-bold text-white">{f.factor}</p>
                         <p className="text-[10px] text-gray-500">{f.category}</p>
                       </td>
                       <td className="px-4 py-4">
                         <span className="text-xs font-mono font-bold text-[#00D9FF]">+{f.impactScore} pts</span>
                       </td>
                       <td className="px-4 py-4">
                         <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase
                           ${f.severity === 'Severe' ? 'bg-[#FF444420] text-[#FF4444]' : 'bg-[#FF8C0020] text-[#FF8C00]'}
                         `}>
                           {f.severity}
                         </span>
                       </td>
                       <td className="px-4 py-4 text-xs text-gray-300 leading-tight">
                         {f.clinicalFinding}
                       </td>
                       <td className="px-4 py-4 text-xs">
                         <p className="font-medium text-[#00FF88]">{f.recommendedAction}</p>
                         <p className="text-[9px] text-gray-500 mt-0.5">Priority: {f.priority}</p>
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

export default AnalyzerView;
