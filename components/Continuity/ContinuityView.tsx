
import React, { useMemo } from 'react';
import { FilterState, Patient, TransitionRisk, CareSetting, TransitionType } from '../../types';
import { COLORS, Icons, HOSPITALS } from '../../constants';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, BarChart, Bar
} from 'recharts';

interface ContinuityViewProps {
  patients: Patient[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onSelectPatient: (id: string) => void;
}

const ContinuityView: React.FC<ContinuityViewProps> = ({ patients, filters, setFilters, onSelectPatient }) => {
  const allTransitions = useMemo(() => {
    return patients.flatMap(p => p.transitions.map(t => ({ ...t, patientName: p.name, patientId: p.id, patientRisk: p.riskLevel })));
  }, [patients]);

  const filteredTransitions = useMemo(() => {
    return allTransitions.filter(t => {
      if (filters.careSetting !== 'All' && t.toSetting !== filters.careSetting) return false;
      if (filters.transitionType !== 'All' && t.type !== filters.transitionType) return false;
      if (filters.continuityRisk !== 'All' && t.riskFlag !== filters.continuityRisk) return false;
      if (filters.search && !t.patientName.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [allTransitions, filters]);

  const stats = useMemo(() => {
    const highRiskCount = filteredTransitions.filter(t => t.riskFlag === TransitionRisk.HIGH).length;
    const followUpCompliance = 82; // Mock
    const avgScore = (filteredTransitions.reduce((acc, t) => acc + t.coordinationScore, 0) / (filteredTransitions.length || 1) / 10).toFixed(1);
    
    return {
      activeTransitions: filteredTransitions.length,
      highRiskCount,
      highRiskPercent: filteredTransitions.length ? Math.round((highRiskCount / filteredTransitions.length) * 100) : 0,
      followUpCompliance,
      avgScore
    };
  }, [filteredTransitions]);

  const transitionDistribution = [
    { name: 'ED → Inpatient', value: 68, color: COLORS.blue },
    { name: 'Inpatient → Home', value: 112, color: COLORS.low },
    { name: 'Inpatient → Rehab', value: 38, color: COLORS.purple },
    { name: 'PCP → Specialist', value: 30, color: COLORS.cyan },
  ];

  const trendData = [
    { month: 'Sep', summary: 75, medRec: 68, followUp: 80 },
    { month: 'Oct', summary: 78, medRec: 70, followUp: 82 },
    { month: 'Nov', summary: 82, medRec: 75, followUp: 85 },
    { month: 'Dec', summary: 80, medRec: 73, followUp: 83 },
    { month: 'Jan', summary: 85, medRec: 78, followUp: 88 },
    { month: 'Feb', summary: 82, medRec: 76, followUp: 87 },
  ];

  const readmissionData = [
    { type: 'ED → Inpatient', rate: 18 },
    { type: 'Inpatient → Home', rate: 12 },
    { type: 'Inpatient → Rehab', rate: 15 },
    { type: 'PCP → Specialist', rate: 5 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#00D9FF] flex items-center gap-2">
            <Icons.Continuity /> Continuity of Care Analytics
          </h1>
          <p className="text-gray-400 text-sm">Monitoring and optimizing care transitions across settings</p>
        </div>
        <div className="flex space-x-3">
          <select 
            className="bg-[#1E2936] border border-[#2D3A4B] rounded-lg px-3 py-2 text-sm focus:outline-none"
            value={filters.hospital}
            onChange={e => setFilters(prev => ({ ...prev, hospital: e.target.value }))}
          >
            {HOSPITALS.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
          <div className="px-4 py-2 bg-[#1E2936] rounded-lg border border-[#2D3A4B] text-xs flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-[#00D9FF] animate-pulse"></span>
             Live Monitoring Feed
          </div>
        </div>
      </div>

      {/* Cascading Filters */}
      <div className="bg-[#1E2936] p-4 rounded-xl border border-[#2D3A4B] grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Care Setting</label>
          <select 
            className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 text-xs outline-none focus:border-[#00D9FF]"
            value={filters.careSetting}
            onChange={e => setFilters(prev => ({ ...prev, careSetting: e.target.value }))}
          >
            <option>All</option>
            {Object.values(CareSetting).map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Transition Type</label>
          <select 
            className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 text-xs outline-none focus:border-[#00D9FF]"
            value={filters.transitionType}
            onChange={e => setFilters(prev => ({ ...prev, transitionType: e.target.value }))}
          >
            <option>All</option>
            {Object.values(TransitionType).map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Risk Level</label>
          <select 
            className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 text-xs outline-none focus:border-[#00D9FF]"
            value={filters.continuityRisk}
            onChange={e => setFilters(prev => ({ ...prev, continuityRisk: e.target.value }))}
          >
            <option>All</option>
            {Object.values(TransitionRisk).map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div className="space-y-1 lg:col-span-2">
           <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Search</label>
           <input 
            type="text" 
            placeholder="Search patients, providers, episodes..."
            className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 text-xs outline-none focus:border-[#00D9FF]"
            value={filters.search}
            onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
           />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Active Care Transitions" 
          value={stats.activeTransitions.toString()} 
          subtitle="Patients moving between settings"
          icon={<Icons.Continuity />}
          color={COLORS.cyan}
          sparkline
        />
        <MetricCard 
          title="High-Risk Transitions" 
          value={stats.highRiskCount.toString()} 
          subtitle={`${stats.highRiskPercent}% at risk of fragmentation`}
          icon={<Icons.Alert />}
          color={COLORS.critical}
          urgent
        />
        <MetricCard 
          title="30-Day Follow-Up Rate" 
          value={`${stats.followUpCompliance}%`} 
          subtitle="Target compliance: 90%"
          icon={<Icons.Check />}
          color={COLORS.low}
        />
        <MetricCard 
          title="Avg Continuity Score" 
          value={stats.avgScore} 
          subtitle="Scale 0–10 • Coordination quality"
          icon={<Icons.Gauge />}
          color={COLORS.moderate}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Transition Flow Distribution" subtitle="Patient volume by settings transfer path">
           <div className="flex h-full items-center">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={transitionDistribution} innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                    {transitionDistribution.map((d, i) => (
                      <Cell key={`cell-${i}`} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: 'none', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-[25%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <p className="text-2xl font-bold">{stats.activeTransitions}</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold">Volume</p>
              </div>
            </div>
            <div className="w-1/2 space-y-2 pr-4">
              {transitionDistribution.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                    <span className="text-gray-400">{d.name}</span>
                  </div>
                  <span className="font-bold">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartContainer>

        <ChartContainer title="30-Day Readmission by Transition" subtitle="Compares readmission rates vs benchmark">
           <ResponsiveContainer width="100%" height="100%">
              <BarChart data={readmissionData}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" vertical={false} />
                 <XAxis dataKey="type" stroke="#6B7280" fontSize={10} />
                 <YAxis stroke="#6B7280" fontSize={10} label={{ value: 'Rate %', angle: -90, position: 'insideLeft', fill: '#6B7280' }} />
                 <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }} cursor={{ fill: '#252F3E' }} />
                 <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                    {readmissionData.map((d, i) => (
                       <Cell key={`cell-${i}`} fill={d.rate > 15 ? COLORS.critical : d.rate > 10 ? COLORS.moderate : COLORS.low} />
                    ))}
                 </Bar>
              </BarChart>
           </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Handoff Completion Trends" subtitle="Rolling 12-month completion of coordination artifacts">
           <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" vertical={false} />
                 <XAxis dataKey="month" stroke="#6B7280" fontSize={10} />
                 <YAxis stroke="#6B7280" fontSize={10} domain={[60, 100]} />
                 <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }} />
                 <Line type="monotone" dataKey="summary" stroke={COLORS.cyan} strokeWidth={2} name="Discharge Summary" />
                 <Line type="monotone" dataKey="medRec" stroke={COLORS.moderate} strokeWidth={2} name="Med Reconciliation" />
                 <Line type="monotone" dataKey="followUp" stroke={COLORS.low} strokeWidth={2} name="Follow-Up Scheduled" />
              </LineChart>
           </ResponsiveContainer>
        </ChartContainer>

        <div className="bg-[#1E2936] rounded-xl border border-[#2D3A4B] p-6 flex flex-col justify-center text-center space-y-4">
           <div className="mx-auto p-4 bg-purple-950/20 rounded-full border border-purple-900/40 text-purple-400">
              <Icons.Analytics />
           </div>
           <div>
              <h3 className="text-xl font-bold text-white">Fragmentation Alert: Cross-Facility</h3>
              <p className="text-sm text-gray-400 max-w-sm mx-auto">11 patients transferred between facilities without shared discharge documentation. Average handoff delay: 38 hours.</p>
           </div>
           <button className="px-6 py-2 bg-[#A855F7] text-white rounded-lg text-sm font-bold shadow-lg shadow-purple-900/30 hover:scale-105 transition-all">Review Transfer Gaps</button>
        </div>
      </div>

      {/* Registry Table */}
      <div className="bg-[#1E2936] rounded-xl border border-[#2D3A4B] overflow-hidden">
        <div className="p-5 border-b border-[#2D3A4B] bg-[#252F3E20] flex justify-between items-center">
           <h2 className="text-lg font-bold">At-Risk Transitions & Fragmentation Alerts</h2>
           <div className="flex gap-2">
             <button className="text-[10px] font-bold text-[#00D9FF] px-3 py-1.5 bg-[#00D9FF10] border border-[#00D9FF30] rounded uppercase">Export Transition Summary</button>
           </div>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead>
                 <tr className="text-[10px] text-gray-500 border-b border-[#2D3A4B] uppercase tracking-widest font-bold">
                    <th className="px-6 py-4">Patient</th>
                    <th className="px-6 py-4">Transition Path</th>
                    <th className="px-6 py-4 text-center">Score</th>
                    <th className="px-6 py-4">Follow-Up</th>
                    <th className="px-6 py-4">Summary / MedRec</th>
                    <th className="px-6 py-4">Risk Flag</th>
                    <th className="px-6 py-4 text-right">Action</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-[#2D3A4B]">
                 {filteredTransitions.slice(0, 15).map(t => (
                   <tr key={t.id} className="hover:bg-[#252F3E] cursor-pointer group transition-colors" onClick={() => onSelectPatient(t.patientId)}>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold group-hover:text-[#00D9FF] transition-colors">{t.patientName}</p>
                        <p className="text-[10px] text-gray-500 font-mono">ID: {t.patientId} • Risk: {t.patientRisk}</p>
                      </td>
                      <td className="px-6 py-4">
                         <p className="text-xs font-bold text-white">{t.type}</p>
                         <p className="text-[10px] text-gray-500">{t.fromSetting} → {t.toSetting}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <div className={`text-sm font-mono font-bold ${t.coordinationScore < 50 ? 'text-red-400' : 'text-white'}`}>{(t.coordinationScore / 10).toFixed(1)}</div>
                      </td>
                      <td className="px-6 py-4">
                         <span className={`text-[10px] font-medium px-2 py-0.5 rounded uppercase
                           ${t.status === 'Overdue' ? 'bg-red-500/20 text-red-500 pulsing-red' : t.status === 'Complete' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}
                         `}>{t.status}</span>
                         <p className="text-[10px] text-gray-500 mt-1">{t.followUpDate}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`text-[9px] font-bold ${t.dischargeSummaryStatus === 'Missing' ? 'text-red-400' : 'text-gray-400'}`}>Summary: {t.dischargeSummaryStatus}</span>
                          <span className={`text-[9px] font-bold ${t.medRecStatus === 'Incomplete' ? 'text-red-400' : 'text-gray-400'}`}>MedRec: {t.medRecStatus}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase
                           ${t.riskFlag === TransitionRisk.HIGH ? 'bg-red-500/20 text-red-500' : t.riskFlag === TransitionRisk.MODERATE ? 'bg-orange-500/20 text-orange-500' : 'bg-green-500/20 text-green-500'}
                         `}>{t.riskFlag}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button className="text-[10px] font-bold text-[#00D9FF] bg-[#00D9FF10] border border-[#00D9FF30] px-3 py-1.5 rounded hover:bg-[#00D9FF] hover:text-[#0F1419] transition-all">
                            Escalate
                         </button>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ title: string; value: string; subtitle: string; icon: React.ReactNode; color: string; urgent?: boolean; sparkline?: boolean }> = 
({ title, value, subtitle, icon, color, urgent, sparkline }) => (
  <div className={`bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-5 hover:border-[#00D9FF30] transition-colors relative overflow-hidden group ${urgent ? 'pulsing-red border-red-900/40' : ''}`}>
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
      <div className="p-2 bg-[#0F1419] rounded-lg group-hover:scale-110 transition-transform" style={{ color }}>{icon}</div>
    </div>
    <p className="text-[10px] text-gray-400">{subtitle}</p>
    {sparkline && (
      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#00D9FF] to-transparent w-full opacity-30"></div>
    )}
  </div>
);

const ChartContainer: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div className="bg-[#1E2936] rounded-xl border border-[#2D3A4B] p-6 h-[320px] relative flex flex-col">
     <div className="mb-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-xs text-gray-500">{subtitle}</p>
     </div>
     <div className="flex-1 relative">
        {children}
     </div>
  </div>
);

export default ContinuityView;
