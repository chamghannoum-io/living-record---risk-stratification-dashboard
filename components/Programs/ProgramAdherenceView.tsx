
import React, { useMemo } from 'react';
import { FilterState, Patient, ProgramType, EnrollmentStatus, AdherenceLevel, GoalStatus } from '../../types';
import { COLORS, Icons, HOSPITALS } from '../../constants';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, BarChart, Bar
} from 'recharts';

interface ProgramAdherenceViewProps {
  patients: Patient[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onSelectPatient: (id: string) => void;
}

const ProgramAdherenceView: React.FC<ProgramAdherenceViewProps> = ({ patients, filters, setFilters, onSelectPatient }) => {
  const enrolledData = useMemo(() => {
    return patients.flatMap(p => p.carePrograms.map(prog => ({ ...prog, patientName: p.name, patientId: p.id, patientRisk: p.riskLevel, careTeam: p.careTeam })));
  }, [patients]);

  const filteredData = useMemo(() => {
    return enrolledData.filter(d => {
      if (filters.programType !== 'All Programs' && d.type !== filters.programType) return false;
      if (filters.enrollmentStatus !== 'All' && d.status !== filters.enrollmentStatus) return false;
      if (filters.goalAchievement !== 'All' && d.goalStatus !== filters.goalAchievement) return false;
      if (filters.search && !d.patientName.toLowerCase().includes(filters.search.toLowerCase()) && !d.type.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [enrolledData, filters]);

  const stats = useMemo(() => {
    const total = filteredData.length;
    const completed = filteredData.filter(d => d.status === EnrollmentStatus.COMPLETED).length;
    const completionRate = total ? ((completed / total) * 100).toFixed(1) : '0';
    const atRisk = filteredData.filter(d => d.goalStatus === GoalStatus.AT_RISK || d.adherencePercent < 50).length;
    const avgAdherence = (filteredData.reduce((acc, d) => acc + d.adherencePercent, 0) / (total || 1)).toFixed(0);

    return { total, completionRate, avgAdherence, atRisk };
  }, [filteredData]);

  const adherenceDistribution = [
    { name: 'Excellent', value: 28, color: COLORS.low },
    { name: 'Good', value: 34, color: COLORS.cyan },
    { name: 'Moderate', value: 22, color: COLORS.moderate },
    { name: 'Poor', value: 16, color: COLORS.critical },
  ];

  const enrollmentTrends = [
    { month: 'Sep', total: 580, completed: 410, withdrawn: 40 },
    { month: 'Oct', total: 605, completed: 430, withdrawn: 45 },
    { month: 'Nov', total: 620, completed: 450, withdrawn: 38 },
    { month: 'Dec', total: 615, completed: 445, withdrawn: 42 },
    { month: 'Jan', total: 635, completed: 462, withdrawn: 35 },
    { month: 'Feb', total: 642, completed: 470, withdrawn: 32 },
  ];

  const milestones = [
    { name: 'Initial Assessment', rate: 95 },
    { name: 'Education Session 1', rate: 87 },
    { name: 'Medication Review', rate: 81 },
    { name: 'Lifestyle Workshop', rate: 74 },
    { name: 'Follow-up Lab', rate: 69 },
    { name: 'Exercise Compliance', rate: 65 },
    { name: 'Behavioral Therapy', rate: 61 },
    { name: 'Final Review', rate: 72 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#00D9FF] flex items-center gap-2">
            <Icons.Program /> Care Program Adherence Analytics
          </h1>
          <p className="text-gray-400 text-sm">Evaluating participation and protocol compliance across structured care programs</p>
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
             Live Real-time Updates
          </div>
        </div>
      </div>

      {/* Program Filters */}
      <div className="bg-[#1E2936] p-4 rounded-xl border border-[#2D3A4B] space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
           <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Program Type</label>
              <select 
                className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 text-xs outline-none focus:border-[#00D9FF]"
                value={filters.programType}
                onChange={e => setFilters(prev => ({ ...prev, programType: e.target.value }))}
              >
                <option>All Programs</option>
                {Object.values(ProgramType).map(v => <option key={v}>{v}</option>)}
              </select>
           </div>
           <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Enrollment</label>
              <select 
                className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 text-xs outline-none focus:border-[#00D9FF]"
                value={filters.enrollmentStatus}
                onChange={e => setFilters(prev => ({ ...prev, enrollmentStatus: e.target.value }))}
              >
                <option>All</option>
                {Object.values(EnrollmentStatus).map(v => <option key={v}>{v}</option>)}
              </select>
           </div>
           <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Goal Status</label>
              <select 
                className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 text-xs outline-none focus:border-[#00D9FF]"
                value={filters.goalAchievement}
                onChange={e => setFilters(prev => ({ ...prev, goalAchievement: e.target.value }))}
              >
                <option>All</option>
                {Object.values(GoalStatus).map(v => <option key={v}>{v}</option>)}
              </select>
           </div>
           <div className="space-y-1 lg:col-span-2">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Search</label>
              <input 
                type="text" 
                placeholder="Search patients or programs..."
                className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 text-xs outline-none focus:border-[#00D9FF]"
                value={filters.search}
                onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
           </div>
           <div className="flex items-end">
              <button 
                onClick={() => setFilters(prev => ({ ...prev, programType: 'All Programs', enrollmentStatus: 'All', goalAchievement: 'All', search: '' }))}
                className="w-full py-1.5 border border-[#00D9FF30] text-[#00D9FF] text-xs font-bold rounded hover:bg-[#00D9FF10]"
              >
                Clear Filters
              </button>
           </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ProgramMetricCard 
          title="Total Enrolled Patients" 
          value={stats.total.toString()} 
          subtitle="Active across all programs"
          icon={<Icons.Program />}
          color={COLORS.cyan}
          sparkline
        />
        <ProgramMetricCard 
          title="Program Completion" 
          value={`${stats.completionRate}%`} 
          subtitle="Full protocol compliance"
          icon={<Icons.Check />}
          color={COLORS.low}
        />
        <ProgramMetricCard 
          title="Avg Adherence Score" 
          value={`${stats.avgAdherence}/100`} 
          subtitle="Population performance"
          icon={<Icons.Gauge />}
          color={COLORS.moderate}
          gaugeValue={parseInt(stats.avgAdherence)}
        />
        <ProgramMetricCard 
          title="At Risk of Dropout" 
          value={stats.atRisk.toString()} 
          subtitle={`${((stats.atRisk/stats.total)*100).toFixed(1)}% of participants`}
          icon={<Icons.Alert />}
          color={COLORS.critical}
          urgent
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgramChartContainer title="Adherence Distribution" subtitle="Participation tiers across enrolled population">
           <div className="flex h-full items-center">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={adherenceDistribution} innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                    {adherenceDistribution.map((d, i) => (
                      <Cell key={`cell-${i}`} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: 'none', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-[25%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold">Total</p>
              </div>
            </div>
            <div className="w-1/2 space-y-2 pr-4">
              {adherenceDistribution.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                    <span className="text-gray-400">{d.name}</span>
                  </div>
                  <span className="font-bold">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </ProgramChartContainer>

        <ProgramChartContainer title="Program Enrollment Trends" subtitle="Rolling 18-month participation status">
           <ResponsiveContainer width="100%" height="100%">
              <LineChart data={enrollmentTrends}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" vertical={false} />
                 <XAxis dataKey="month" stroke="#6B7280" fontSize={10} />
                 <YAxis stroke="#6B7280" fontSize={10} />
                 <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }} />
                 <Line type="monotone" dataKey="total" stroke={COLORS.cyan} strokeWidth={3} name="Enrolled" dot={{ r: 4 }} />
                 <Line type="monotone" dataKey="completed" stroke={COLORS.low} strokeWidth={2} name="Completed" dot={false} />
                 <Line type="monotone" dataKey="withdrawn" stroke={COLORS.critical} strokeWidth={2} name="Withdrawn" dot={false} />
              </LineChart>
           </ResponsiveContainer>
        </ProgramChartContainer>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgramChartContainer title="Milestone Completion Rates" subtitle="Execution performance across program steps">
           <ResponsiveContainer width="100%" height="100%">
              <BarChart data={milestones} layout="vertical" margin={{ left: 20 }}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" horizontal={false} />
                 <XAxis type="number" hide domain={[0, 100]} />
                 <YAxis dataKey="name" type="category" stroke="#9CA3AF" fontSize={10} width={120} />
                 <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }} cursor={{ fill: '#252F3E' }} />
                 <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
                    {milestones.map((d, i) => (
                       <Cell key={`cell-${i}`} fill={d.rate > 80 ? COLORS.low : d.rate > 70 ? COLORS.cyan : COLORS.moderate} />
                    ))}
                 </Bar>
              </BarChart>
           </ResponsiveContainer>
        </ProgramChartContainer>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <InsightCard 
              title="Highest Performing" 
              subtitle="Cardiac Rehab" 
              metric="84% Completion" 
              description="Avg adherence: 88/100" 
              color={COLORS.low} 
           />
           <InsightCard 
              title="Most At-Risk" 
              subtitle="Diabetes Lifestyle" 
              metric="19% Dropout Risk" 
              description="Driven by poor session attendance" 
              color={COLORS.critical} 
           />
           <InsightCard 
              title="Engagement Factor" 
              subtitle="Digital App Usage" 
              metric="24% Lift" 
              description="Higher completion in daily users" 
              color={COLORS.cyan} 
           />
           <div className="bg-[#1E2936] rounded-xl border border-[#2D3A4B] p-5 flex flex-col justify-center text-center space-y-2">
              <h4 className="text-xs font-bold text-gray-500 uppercase">Goal achievement</h4>
              <div className="flex justify-center items-end gap-2">
                <span className="text-2xl font-bold">312</span>
                <span className="text-xs text-green-400 mb-1">Achieved</span>
              </div>
              <p className="text-[10px] text-gray-400">46 patients currently off-track</p>
           </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1E2936] rounded-xl border border-[#2D3A4B] overflow-hidden">
        <div className="p-5 border-b border-[#2D3A4B] bg-[#252F3E20] flex justify-between items-center">
           <h2 className="text-lg font-bold">Program Adherence Details</h2>
           <button className="text-[10px] font-bold text-[#00D9FF] px-3 py-1.5 bg-[#00D9FF10] border border-[#00D9FF30] rounded uppercase">Export SME Report</button>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead>
                 <tr className="text-[10px] text-gray-500 border-b border-[#2D3A4B] uppercase tracking-widest font-bold">
                    <th className="px-6 py-4">Patient</th>
                    <th className="px-6 py-4">Program</th>
                    <th className="px-6 py-4 text-center">Adherence</th>
                    <th className="px-6 py-4">Milestones</th>
                    <th className="px-6 py-4">Goal Status</th>
                    <th className="px-6 py-4">Participation</th>
                    <th className="px-6 py-4 text-right">Action</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-[#2D3A4B]">
                 {filteredData.slice(0, 15).map(d => (
                   <tr key={d.id} className="hover:bg-[#252F3E] cursor-pointer group transition-colors" onClick={() => onSelectPatient(d.patientId)}>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold group-hover:text-[#00D9FF] transition-colors">{d.patientName}</p>
                        <p className="text-[10px] text-gray-500 font-mono">ID: {d.patientId} • Risk: {d.patientRisk}</p>
                      </td>
                      <td className="px-6 py-4">
                         <p className="text-xs font-bold text-white">{d.type}</p>
                         <p className="text-[10px] text-gray-500">Enrolled: {d.enrollmentDate}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <div className="flex flex-col items-center">
                            <span className={`text-sm font-bold ${d.adherencePercent > 85 ? 'text-green-400' : d.adherencePercent > 70 ? 'text-yellow-400' : 'text-red-400'}`}>{d.adherencePercent}%</span>
                            <div className="w-16 h-1 bg-[#0F1419] rounded-full mt-1">
                               <div className={`h-full rounded-full ${d.adherencePercent > 85 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${d.adherencePercent}%` }}></div>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                         <p className="text-xs font-medium text-gray-300">{d.milestones.filter(m => m.status === 'Completed').length} / {d.milestones.length} Completed</p>
                      </td>
                      <td className="px-6 py-4">
                         <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase
                           ${d.goalStatus === GoalStatus.ACHIEVED ? 'bg-green-500/20 text-green-500' : d.goalStatus === GoalStatus.ON_TRACK ? 'bg-blue-500/20 text-blue-500' : 'bg-red-500/20 text-red-500'}
                         `}>{d.goalStatus}</span>
                      </td>
                      <td className="px-6 py-4">
                         <p className="text-[10px] font-mono text-gray-400">{d.participationRate}% participation</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button className="text-[10px] font-bold text-[#00D9FF] bg-[#00D9FF10] border border-[#00D9FF30] px-3 py-1.5 rounded hover:bg-[#00D9FF] hover:text-[#0F1419] transition-all">
                            Intervene
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

const ProgramMetricCard: React.FC<{ title: string; value: string; subtitle: string; icon: React.ReactNode; color: string; urgent?: boolean; sparkline?: boolean; gaugeValue?: number }> = 
({ title, value, subtitle, icon, color, urgent, sparkline, gaugeValue }) => (
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

const InsightCard: React.FC<{ title: string; subtitle: string; metric: string; description: string; color: string }> = ({ title, subtitle, metric, description, color }) => (
  <div className="bg-[#1E2936] rounded-xl border border-[#2D3A4B] p-5 flex flex-col justify-between border-l-4" style={{ borderColor: color }}>
     <div>
        <h4 className="text-[10px] font-bold text-gray-500 uppercase">{title}</h4>
        <h3 className="text-sm font-bold text-white mt-1">{subtitle}</h3>
     </div>
     <div className="mt-3">
        <p className="text-xl font-bold" style={{ color }}>{metric}</p>
        <p className="text-[10px] text-gray-400">{description}</p>
     </div>
  </div>
);

const ProgramChartContainer: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
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

export default ProgramAdherenceView;
