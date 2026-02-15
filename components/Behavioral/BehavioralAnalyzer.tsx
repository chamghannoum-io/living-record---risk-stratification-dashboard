
import React, { useMemo } from 'react';
import { Patient, RiskLevel } from '../../types';
import { Icons, COLORS } from '../../constants';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

interface BehavioralAnalyzerProps {
  patients: Patient[];
  selectedId: string | null;
  onSelectId: (id: string | null) => void;
}

const BehavioralAnalyzer: React.FC<BehavioralAnalyzerProps> = ({ patients, selectedId, onSelectId }) => {
  const patient = useMemo(() => patients.find(p => p.id === selectedId), [patients, selectedId]);

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
        <div className="p-8 bg-[#1E2936] rounded-full border border-[#2D3A4B] text-[#00D9FF]">
          <Icons.Activity />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold">Select a Patient</h2>
          <p className="text-gray-400 max-w-sm mx-auto mt-2">Perform deep-dive analysis on patient engagement, adherence, and behavioral anomalies.</p>
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
    { name: 'Baseline', value: 78, type: 'base' },
    { name: 'Missed Visits', value: -12, type: 'factor' },
    { name: 'Non-Adherence', value: -9, type: 'factor' },
    { name: 'No Portal Activity', value: -7, type: 'factor' },
    { name: 'Social Barrier', value: -8, type: 'factor' },
    { name: 'Engagement Score', value: patient.engagementScore, type: 'total' },
  ];

  const timelineData = [
    { month: 'Mar', adherence: 85, visits: 2, portal: 10 },
    { month: 'Apr', adherence: 88, visits: 3, portal: 12 },
    { month: 'May', adherence: 80, visits: 1, portal: 5 },
    { month: 'Jun', adherence: 75, visits: 0, portal: 2 },
    { month: 'Jul', adherence: 65, visits: 0, portal: 0 },
    { month: 'Aug', adherence: patient.medicationAdherence, visits: 0, portal: 0 },
  ];

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
           <button onClick={() => onSelectId(null)} className="p-2 hover:bg-[#1E2936] rounded-lg text-gray-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
           </button>
           <div>
              <h1 className="text-2xl font-bold text-white">Behavioral Pattern Analyzer</h1>
              <p className="text-gray-400 text-sm">Patient: <span className="text-white font-medium">{patient.name}</span> • ID: <span className="font-mono text-[#00D9FF]">{patient.id}</span></p>
           </div>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-[#2D3A4B] rounded-lg text-sm font-semibold hover:bg-[#1E2936]">Engagement History</button>
          <button className="px-4 py-2 bg-[#FF8C00] text-white font-bold rounded-lg text-sm shadow-lg shadow-orange-900/30 hover:scale-105 transition-all">Initiate Outreach</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile */}
        <div className="space-y-6">
          <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-6 relative overflow-hidden">
             <div className="flex items-center space-x-4 mb-6">
                <div className={`w-16 h-16 rounded-full border-2 overflow-hidden ${patient.engagementScore < 50 ? 'border-red-500 shadow-red-900/10' : 'border-[#00D9FF]'}`}>
                   <img src={`https://picsum.photos/seed/${patient.id}/80/80`} alt="" />
                </div>
                <div>
                   <h3 className="text-xl font-bold">{patient.name}</h3>
                   <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border 
                     ${patient.engagementScore < 50 ? 'text-red-400 bg-red-400/10 border-red-400/20' : 'text-green-400 bg-green-400/10 border-green-400/20'}
                   `}>{patient.engagementScore < 50 ? 'Critical Disengagement' : 'Stable Engagement'}</span>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-[#0F1419] p-3 rounded-lg border border-[#2D3A4B]">
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Eng. Score</p>
                   <p className="text-2xl font-bold">{patient.engagementScore}<span className="text-xs text-gray-500">/100</span></p>
                </div>
                <div className="bg-[#0F1419] p-3 rounded-lg border border-[#2D3A4B]">
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Risk Tier</p>
                   <p className={`text-2xl font-bold ${patient.behavioralRiskTier === 'Critical' ? 'text-red-500' : 'text-orange-400'}`}>{patient.behavioralRiskTier}</p>
                </div>
             </div>

             <div className="space-y-3">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Intervention Priority</p>
                <div className={`p-4 rounded-r-lg border-l-4 ${patient.engagementScore < 50 ? 'bg-red-950/20 border-red-500' : 'bg-orange-950/20 border-orange-500'}`}>
                   <p className={`text-xs font-bold mb-1 ${patient.engagementScore < 50 ? 'text-red-400' : 'text-orange-400'}`}>Urgent Action Recommended</p>
                   <p className="text-[10px] text-gray-400 leading-relaxed">Declining adherence detected over 3 months. Last successful interaction was 14 days ago via SMS.</p>
                </div>
             </div>
          </div>

          <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-6">
             <h4 className="font-bold mb-4 flex items-center gap-2">
                <Icons.Analytics /> Engagement Indicators
             </h4>
             <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                   <span className="text-gray-400">Portal Logins (30d)</span>
                   <span className="font-bold text-red-400">0 Logins</span>
                </div>
                <div className="w-full h-1 bg-[#0F1419] rounded-full overflow-hidden">
                   <div className="h-full bg-red-500 w-0"></div>
                </div>
                <div className="flex justify-between items-center text-xs">
                   <span className="text-gray-400">Medication Adherence</span>
                   <span className={`font-bold ${patient.medicationAdherence < 70 ? 'text-red-400' : 'text-yellow-400'}`}>{patient.medicationAdherence}%</span>
                </div>
                <div className="w-full h-1 bg-[#0F1419] rounded-full overflow-hidden">
                   <div className="h-full bg-[#00FF88]" style={{ width: `${patient.medicationAdherence}%` }}></div>
                </div>
                <div className="flex justify-between items-center text-xs">
                   <span className="text-gray-400">Inbound Msg Frequency</span>
                   <span className="font-bold text-gray-400">None detected</span>
                </div>
             </div>
          </div>
        </div>

        {/* Deep Dive */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-6">
             <h3 className="text-lg font-bold mb-2">Behavioral Timeline (12 Months)</h3>
             <p className="text-xs text-gray-400 mb-8">Longitudinal view of adherence, visit attendance, and digital engagement signals.</p>
             <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={timelineData}>
                      <defs>
                        <linearGradient id="colorAdh" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.cyan} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={COLORS.cyan} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" vertical={false} />
                      <XAxis dataKey="month" stroke="#6B7280" fontSize={10} />
                      <YAxis stroke="#6B7280" fontSize={10} domain={[0, 100]} />
                      <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }} />
                      <Area type="monotone" dataKey="adherence" stroke={COLORS.cyan} strokeWidth={3} fill="url(#colorAdh)" name="Adherence %" />
                      <Line type="stepAfter" dataKey="portal" stroke={COLORS.low} strokeWidth={2} name="Portal Activity" dot={false} />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-6">
                <h3 className="text-sm font-bold mb-4 uppercase text-gray-500">Risk Contribution waterfall</h3>
                <div className="h-[200px]">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={waterfallData} layout="vertical">
                         <XAxis type="number" hide domain={[-20, 100]} />
                         <YAxis dataKey="name" type="category" stroke="#9CA3AF" fontSize={9} width={80} />
                         <Tooltip cursor={{ fill: '#252F3E' }} />
                         <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                            {waterfallData.map((e, i) => (
                               <Cell key={`cell-${i}`} fill={e.type === 'base' ? '#00D9FF40' : e.type === 'total' ? '#FF4444' : '#FF8C0080'} />
                            ))}
                         </Bar>
                      </BarChart>
                   </ResponsiveContainer>
                </div>
             </div>

             <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-6 flex flex-col justify-center">
                <h4 className="text-sm font-bold mb-4 uppercase text-gray-500">Recommended Smart Action</h4>
                <p className="text-xs font-medium text-[#00FF88] mb-4">
                   Activate "Automated Pharmacist Outreach" and prioritize transportation voucher generation for the next scheduled clinic visit.
                </p>
                <div className="space-y-2">
                   <button className="w-full py-2 bg-[#00FF8810] border border-[#00FF8830] text-[#00FF88] rounded text-[10px] font-bold uppercase hover:bg-[#00FF88] hover:text-[#0F1419] transition-all">
                      Deploy SMS Campaign
                   </button>
                   <button className="w-full py-2 bg-[#2D3A4B] text-gray-300 rounded text-[10px] font-bold uppercase hover:bg-gray-700 transition-all">
                      Update Care Plan
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BehavioralAnalyzer;
