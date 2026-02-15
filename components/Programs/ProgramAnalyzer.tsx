
import React, { useMemo } from 'react';
import { Patient, GoalStatus, EnrollmentStatus } from '../../types';
import { Icons, COLORS } from '../../constants';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

interface ProgramAnalyzerProps {
  patients: Patient[];
  selectedId: string | null;
  onSelectId: (id: string | null) => void;
}

const ProgramAnalyzer: React.FC<ProgramAnalyzerProps> = ({ patients, selectedId, onSelectId }) => {
  const patient = useMemo(() => patients.find(p => p.id === selectedId), [patients, selectedId]);
  const activeProgram = patient?.carePrograms[0];

  if (!patient || !activeProgram) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
        <div className="p-8 bg-[#1E2936] rounded-full border border-[#2D3A4B] text-[#00D9FF]">
          <Icons.Program />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold">Select an Enrolled Patient</h2>
          <p className="text-gray-400 max-w-sm mx-auto mt-2">Choose a patient enrolled in a care program to perform deep-dive participation and milestone analysis.</p>
        </div>
        <select 
          className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
          onChange={(e) => onSelectId(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>-- Choose Patient --</option>
          {patients.filter(p => p.carePrograms.length > 0).slice(0, 20).map(p => <option key={p.id} value={p.id}>{p.id} - {p.name}</option>)}
        </select>
      </div>
    );
  }

  const adherenceTimeline = [
    { month: 'Oct', adherence: 80, goal: 85 },
    { month: 'Nov', adherence: 88, goal: 85 },
    { month: 'Dec', adherence: 82, goal: 85 },
    { month: 'Jan', adherence: 75, goal: 85 },
    { month: 'Feb', adherence: activeProgram.adherencePercent, goal: 85 },
  ];

  const dropoutProjection = [
    { day: 0, prob: 5 },
    { day: 30, prob: 12 },
    { day: 60, prob: activeProgram.adherencePercent < 60 ? 35 : 18 },
    { day: 90, prob: activeProgram.adherencePercent < 60 ? 55 : 22 },
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
                 Care Program Adherence Analyzer
              </h1>
              <p className="text-gray-400 text-sm">Patient: <span className="text-white font-medium">{patient.name}</span> • Program: <span className="text-[#00D9FF] font-semibold">{activeProgram.type}</span></p>
           </div>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-[#2D3A4B] rounded-lg text-sm font-semibold hover:bg-[#1E2936]">Progression History</button>
          <button className="px-4 py-2 bg-[#00D9FF] text-[#0F1419] font-bold rounded-lg text-sm shadow-lg shadow-cyan-900/30 hover:scale-105 transition-all">Adjust Care Plan</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile snapshot */}
        <div className="space-y-6">
          <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-6 relative overflow-hidden">
             <div className="flex items-center space-x-4 mb-6">
                <div className={`w-16 h-16 rounded-full border-2 overflow-hidden ${activeProgram.adherencePercent < 60 ? 'border-red-500 shadow-red-900/10' : 'border-[#00D9FF]'}`}>
                   <img src={`https://picsum.photos/seed/${patient.id}/80/80`} alt="" />
                </div>
                <div>
                   <h3 className="text-xl font-bold">{patient.name}</h3>
                   <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border 
                     ${activeProgram.goalStatus === GoalStatus.ACHIEVED ? 'text-green-400 bg-green-400/10 border-green-400/20' : activeProgram.goalStatus === GoalStatus.AT_RISK ? 'text-red-400 bg-red-400/10 border-red-400/20' : 'text-blue-400 bg-blue-400/10 border-blue-400/20'}
                   `}>{activeProgram.goalStatus} Goal</span>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-[#0F1419] p-3 rounded-lg border border-[#2D3A4B]">
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Adherence</p>
                   <p className="text-2xl font-bold">{activeProgram.adherencePercent}<span className="text-xs text-gray-500">/100</span></p>
                </div>
                <div className="bg-[#0F1419] p-3 rounded-lg border border-[#2D3A4B]">
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Dropout risk</p>
                   <p className={`text-2xl font-bold ${activeProgram.adherencePercent < 60 ? 'text-red-500' : 'text-green-400'}`}>{activeProgram.adherencePercent < 60 ? 'High' : 'Low'}</p>
                </div>
             </div>

             <div className="space-y-3">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Milestone Progression</p>
                <div className="flex items-center gap-2">
                   <div className="flex-1 h-2 bg-[#0F1419] rounded-full overflow-hidden flex gap-1">
                      {activeProgram.milestones.map((m, i) => (
                         <div key={i} className={`h-full flex-1 ${m.status === 'Completed' ? 'bg-green-500' : m.status === 'Missed' ? 'bg-red-500' : 'bg-gray-700'}`}></div>
                      ))}
                   </div>
                </div>
                <div className="flex justify-between text-[9px] text-gray-500 font-bold uppercase">
                   <span>{activeProgram.milestones.filter(m => m.status === 'Completed').length} Complete</span>
                   <span>{activeProgram.milestones.length} Total</span>
                </div>
             </div>
          </div>

          <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-6">
             <h4 className="font-bold mb-4 flex items-center gap-2">
                <Icons.Analytics /> Predictive Dropout Projection
             </h4>
             <div className="h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={dropoutProjection}>
                      <defs>
                        <linearGradient id="colorProb" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.critical} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={COLORS.critical} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" stroke="#6B7280" fontSize={10} label={{ value: 'Days Ahead', position: 'insideBottom', offset: -5, fill: '#6B7280', fontSize: 10 }} />
                      <YAxis stroke="#6B7280" fontSize={10} label={{ value: 'Prob %', angle: -90, position: 'insideLeft', fill: '#6B7280', fontSize: 10 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }} />
                      <Area type="monotone" dataKey="prob" stroke={COLORS.critical} strokeWidth={2} fill="url(#colorProb)" name="Dropout Prob %" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
             <p className="text-[10px] text-gray-400 mt-4 leading-relaxed">
                If adherence remains at {activeProgram.adherencePercent}%, probability of program withdrawal increases to 55% within 90 days.
             </p>
          </div>
        </div>

        {/* Adherence Deep Dive */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-6">
             <h3 className="text-lg font-bold mb-6">Historical Adherence Timeline</h3>
             <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={adherenceTimeline}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" vertical={false} />
                      <XAxis dataKey="month" stroke="#6B7280" fontSize={10} />
                      <YAxis stroke="#6B7280" fontSize={10} domain={[0, 100]} />
                      <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }} />
                      <Line type="monotone" dataKey="adherence" stroke={COLORS.cyan} strokeWidth={3} dot={{ r: 4 }} name="Adherence %" />
                      <Line type="monotone" dataKey="goal" stroke={COLORS.low} strokeWidth={2} strokeDasharray="5 5" dot={false} name="Program Goal" />
                   </LineChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl overflow-hidden">
             <div className="p-5 border-b border-[#2D3A4B] bg-[#252F3E20] flex justify-between items-center">
                <h3 className="font-bold">Adherence Component Breakdown</h3>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{activeProgram.milestones.length} Participation Areas</span>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-[#0F1419] text-[10px] text-gray-500 uppercase">
                      <tr>
                         <th className="px-6 py-3">Component</th>
                         <th className="px-6 py-3">Category</th>
                         <th className="px-6 py-3">Status</th>
                         <th className="px-6 py-3">Participation</th>
                         <th className="px-6 py-3 text-right">Impact</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-[#2D3A4B]">
                      {activeProgram.milestones.map((m, i) => (
                        <tr key={m.id} className="hover:bg-[#252F3E40] transition-colors">
                           <td className="px-6 py-4">
                              <p className="text-sm font-bold text-white">{m.name}</p>
                           </td>
                           <td className="px-6 py-4 text-xs text-gray-400">Milestone</td>
                           <td className="px-6 py-4">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase
                                ${m.status === 'Completed' ? 'bg-green-500/20 text-green-500' : m.status === 'Missed' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'}
                              `}>{m.status}</span>
                           </td>
                           <td className="px-6 py-4 text-xs font-mono text-gray-300">{m.status === 'Completed' ? '100%' : m.status === 'Missed' ? '0%' : '50%'}</td>
                           <td className="px-6 py-4 text-right">
                              <span className={`text-[10px] font-bold ${m.status === 'Completed' ? 'text-green-400' : 'text-red-400'}`}>
                                 {m.status === 'Completed' ? `+${m.impactScore}` : `-${m.impactScore}`} pts
                              </span>
                           </td>
                        </tr>
                      ))}
                      <tr className="hover:bg-[#252F3E40] transition-colors">
                         <td className="px-6 py-4">
                            <p className="text-sm font-bold text-white">Medication Logging</p>
                         </td>
                         <td className="px-6 py-4 text-xs text-gray-400">Engagement</td>
                         <td className="px-6 py-4">
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded uppercase bg-yellow-500/20 text-yellow-500">Inconsistent</span>
                         </td>
                         <td className="px-6 py-4 text-xs font-mono text-gray-300">65%</td>
                         <td className="px-6 py-4 text-right">
                            <span className="text-[10px] font-bold text-red-400">-6 pts</span>
                         </td>
                      </tr>
                   </tbody>
                </table>
             </div>
          </div>

          <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-6 flex flex-col md:flex-row gap-6">
             <div className="flex-1">
                <h4 className="text-sm font-bold mb-4 uppercase text-gray-500">What-if Adherence Scenario</h4>
                <div className="p-4 bg-[#0F1419] rounded-lg border border-[#2D3A4B]">
                   <p className="text-xs text-gray-400 leading-relaxed">
                      If session attendance improves to <span className="text-[#00FF88] font-bold">90%</span>, the projected program completion probability increases from 45% to <span className="text-[#00FF88] font-bold">94%</span>.
                   </p>
                </div>
             </div>
             <div className="md:w-1/3 flex flex-col justify-center">
                <button className="w-full py-2 bg-[#00FF8810] border border-[#00FF8830] text-[#00FF88] rounded text-[10px] font-bold uppercase hover:bg-[#00FF88] hover:text-[#0F1419] transition-all">
                   Deploy Engagement Prompt
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramAnalyzer;
