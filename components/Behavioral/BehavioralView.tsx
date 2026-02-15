
import React, { useMemo } from 'react';
import { FilterState, Patient, RiskLevel, BehaviorType } from '../../types';
import { COLORS, Icons, HOSPITALS } from '../../constants';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, BarChart, Bar
} from 'recharts';

interface BehavioralViewProps {
  patients: Patient[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onSelectPatient: (id: string) => void;
}

const BehavioralView: React.FC<BehavioralViewProps> = ({ patients, filters, setFilters, onSelectPatient }) => {
  const allFlags = useMemo(() => {
    return patients.flatMap(p => p.behavioralAnomalies.map(a => ({ ...a, patientName: p.name, patientId: p.id, clinicalRisk: p.riskLevel, engagementScore: p.engagementScore })));
  }, [patients]);

  const filteredFlags = useMemo(() => {
    return allFlags.filter(f => {
      if (filters.behaviorType !== 'All' && f.type !== filters.behaviorType) return false;
      if (filters.riskLevel !== 'All Levels' && f.severity !== filters.riskLevel) return false;
      if (filters.search && !f.patientName.toLowerCase().includes(filters.search.toLowerCase()) && !f.type.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [allFlags, filters]);

  const stats = useMemo(() => {
    const critical = filteredFlags.filter(f => f.severity === RiskLevel.CRITICAL).length;
    const highRiskEngagement = filteredFlags.filter(f => f.engagementScore < 50).length;
    const avgAdherence = (patients.reduce((sum, p) => sum + p.medicationAdherence, 0) / patients.length).toFixed(1);
    
    return {
      totalFlags: filteredFlags.length,
      highRiskCount: highRiskEngagement,
      highRiskPercent: filteredFlags.length ? Math.round((highRiskEngagement / filteredFlags.length) * 100) : 0,
      medAdherence: avgAdherence,
      followUpGaps: 56 // Mock constant
    };
  }, [filteredFlags, patients]);

  const distributionData = [
    { name: 'No-Shows', value: 72, color: COLORS.critical },
    { name: 'Non-Adherence', value: 89, color: COLORS.high },
    { name: 'Refusal', value: 21, color: COLORS.moderate },
    { name: 'Deviations', value: 18, color: COLORS.cyan },
    { name: 'Gaps', value: 12, color: COLORS.low },
    { name: 'Decline', value: 6, color: '#9333ea' },
  ];

  const trendData = [
    { month: 'Sep', total: 160, noShow: 50, adherence: 70 },
    { month: 'Oct', total: 180, noShow: 55, adherence: 75 },
    { month: 'Nov', total: 200, noShow: 65, adherence: 85 },
    { month: 'Dec', total: 190, noShow: 60, adherence: 80 },
    { month: 'Jan', total: 210, noShow: 68, adherence: 88 },
    { month: 'Feb', total: 218, noShow: 72, adherence: 89 },
  ];

  const drivers = [
    { name: 'Polypharmacy complexity', count: 48 },
    { name: 'Financial barriers', count: 34 },
    { name: 'Transportation issues', count: 27 },
    { name: 'Care fatigue', count: 22 },
    { name: 'Language barriers', count: 19 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#00D9FF] flex items-center gap-2">
            <Icons.Activity /> Behavioral Anomalies Intelligence
          </h1>
          <p className="text-gray-400 text-sm">Identifying deviations in patient engagement and adherence patterns</p>
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
             Real-time Monitoring Active
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#1E2936] p-4 rounded-xl border border-[#2D3A4B] grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Behavior Type</label>
          <select 
            className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 text-xs outline-none focus:border-[#00D9FF]"
            value={filters.behaviorType}
            onChange={e => setFilters(prev => ({ ...prev, behaviorType: e.target.value }))}
          >
            <option>All</option>
            {Object.values(BehaviorType).map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Severity</label>
          <select 
            className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 text-xs outline-none focus:border-[#00D9FF]"
            value={filters.behaviorSeverity}
            onChange={e => setFilters(prev => ({ ...prev, behaviorSeverity: e.target.value }))}
          >
            <option>All Levels</option>
            {Object.values(RiskLevel).map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Time Window</label>
          <select className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 text-xs outline-none focus:border-[#00D9FF]">
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>Last 6 Months</option>
            <option>Last 12 Months</option>
          </select>
        </div>
        <div className="space-y-1 lg:col-span-2">
           <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Search</label>
           <input 
            type="text" 
            placeholder="Search patients, behaviors..."
            className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 text-xs outline-none focus:border-[#00D9FF]"
            value={filters.search}
            onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
           />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Behavioral Alerts" 
          value={stats.totalFlags.toString()} 
          subtitle="Active flags across population"
          icon={<Icons.Activity />}
          color={COLORS.cyan}
          sparkline
        />
        <MetricCard 
          title="High-Risk Engagement" 
          value={stats.highRiskCount.toString()} 
          subtitle={`${stats.highRiskPercent}% at risk of disengagement`}
          icon={<Icons.Alert />}
          color={COLORS.critical}
          urgent
        />
        <MetricCard 
          title="Non-Adherence Rate" 
          value={`${stats.medAdherence}%`} 
          subtitle="Medication compliance avg"
          icon={<Icons.Analytics />}
          color={COLORS.high}
        />
        <MetricCard 
          title="Follow-Up Gaps" 
          value={stats.followUpGaps.toString()} 
          subtitle="Identified care deviations"
          icon={<Icons.Check />}
          color={COLORS.moderate}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Anomaly Distribution" subtitle="Composition of active behavioral flags">
          <div className="flex h-full items-center">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={distributionData} innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                    {distributionData.map((d, i) => (
                      <Cell key={`cell-${i}`} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: 'none', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-[25%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <p className="text-2xl font-bold">{stats.totalFlags}</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold">Total</p>
              </div>
            </div>
            <div className="w-1/2 space-y-2 pr-4">
              {distributionData.map((d) => (
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

        <ChartContainer title="Behavioral Trends" subtitle="Volume of anomalies over last 18 months">
           <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" vertical={false} />
                 <XAxis dataKey="month" stroke="#6B7280" fontSize={10} />
                 <YAxis stroke="#6B7280" fontSize={10} />
                 <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }} />
                 <Line type="monotone" dataKey="total" stroke={COLORS.cyan} strokeWidth={3} dot={{ r: 4 }} name="Total Flags" />
                 <Line type="monotone" dataKey="noShow" stroke={COLORS.critical} strokeWidth={2} name="No-Shows" />
                 <Line type="monotone" dataKey="adherence" stroke={COLORS.high} strokeWidth={2} name="Non-Adherence" />
              </LineChart>
           </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Top Drivers of Escalation" subtitle="Underlying factors contributing to behaviors">
           <ResponsiveContainer width="100%" height="100%">
              <BarChart data={drivers} layout="vertical" margin={{ left: 20 }}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" horizontal={false} />
                 <XAxis type="number" hide />
                 <YAxis dataKey="name" type="category" stroke="#9CA3AF" fontSize={10} width={120} />
                 <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }} cursor={{ fill: '#252F3E' }} />
                 <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {drivers.map((_, i) => (
                       <Cell key={`cell-${i}`} fill={i < 2 ? COLORS.critical : COLORS.high} />
                    ))}
                 </Bar>
              </BarChart>
           </ResponsiveContainer>
        </ChartContainer>

        <div className="bg-[#1E2936] rounded-xl border border-[#2D3A4B] p-6 flex flex-col justify-center text-center space-y-4">
           <div className="mx-auto p-4 bg-red-950/20 rounded-full border border-red-900/40 text-red-400">
              <Icons.Alert />
           </div>
           <div>
              <h3 className="text-xl font-bold text-white">Predictive Disengagement Model</h3>
              <p className="text-sm text-gray-400 max-w-sm mx-auto">AI predicts 32 patients likely to disengage within 60 days. Main drivers: ≥2 missed visits & adherence &lt; 70%.</p>
           </div>
           <button className="px-6 py-2 bg-[#FF4444] text-white rounded-lg text-sm font-bold shadow-lg shadow-red-900/30 hover:scale-105 transition-all">Review Outreach List</button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1E2936] rounded-xl border border-[#2D3A4B] overflow-hidden">
        <div className="p-5 border-b border-[#2D3A4B] bg-[#252F3E20] flex justify-between items-center">
           <h2 className="text-lg font-bold">High Priority Behavioral Flags</h2>
           <button className="text-[10px] font-bold text-[#00D9FF] px-3 py-1.5 bg-[#00D9FF10] border border-[#00D9FF30] rounded uppercase">Export Summary PDF</button>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead>
                 <tr className="text-[10px] text-gray-500 border-b border-[#2D3A4B] uppercase tracking-widest font-bold">
                    <th className="px-6 py-4">Patient</th>
                    <th className="px-6 py-4">Behavior Flag</th>
                    <th className="px-6 py-4 text-center">Severity</th>
                    <th className="px-6 py-4 text-center">Engagement Score</th>
                    <th className="px-6 py-4">Pattern Trend</th>
                    <th className="px-6 py-4">Last Contact</th>
                    <th className="px-6 py-4 text-right">Action</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-[#2D3A4B]">
                 {filteredFlags.slice(0, 15).map(f => (
                   <tr key={f.id} className="hover:bg-[#252F3E] cursor-pointer group transition-colors" onClick={() => onSelectPatient(f.patientId)}>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold group-hover:text-[#00D9FF] transition-colors">{f.patientName}</p>
                        <p className="text-[10px] text-gray-500 font-mono">ID: {f.patientId} • Risk: {f.clinicalRisk}</p>
                      </td>
                      <td className="px-6 py-4">
                         <p className="text-xs font-bold text-white">{f.type}</p>
                         <p className="text-[10px] text-gray-500">{f.details}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase
                           ${f.severity === RiskLevel.CRITICAL ? 'bg-red-500/20 text-red-500 pulsing-red' : ''}
                           ${f.severity === RiskLevel.HIGH ? 'bg-orange-500/20 text-orange-500' : ''}
                           ${f.severity === RiskLevel.MODERATE ? 'bg-yellow-500/20 text-yellow-500' : ''}
                           ${f.severity === RiskLevel.LOW ? 'bg-green-500/20 text-green-500' : ''}
                         `}>{f.severity}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <div className="flex flex-col items-center">
                            <span className={`text-sm font-bold ${f.engagementScore < 50 ? 'text-red-400' : f.engagementScore < 75 ? 'text-yellow-400' : 'text-green-400'}`}>{f.engagementScore}</span>
                            <div className="w-16 h-1 bg-[#0F1419] rounded-full mt-1">
                               <div className={`h-full rounded-full ${f.engagementScore < 50 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${f.engagementScore}%` }}></div>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-1">
                            <span className={`text-[10px] font-bold ${f.patternTrend.includes('Drop') || f.patternTrend === 'Declining' ? 'text-red-400' : 'text-green-400'}`}>{f.patternTrend === 'Rapid Drop' ? '↓↓' : f.patternTrend === 'Declining' ? '↓' : '→'}</span>
                            <span className="text-[10px] text-gray-400 font-medium">{f.patternTrend}</span>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-[10px] text-gray-300 font-medium">{f.lastContact}</td>
                      <td className="px-6 py-4 text-right">
                         <button className="text-[10px] font-bold text-[#00D9FF] bg-[#00D9FF10] border border-[#00D9FF30] px-3 py-1.5 rounded hover:bg-[#00D9FF] hover:text-[#0F1419] transition-all">
                            Triage
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

export default BehavioralView;
