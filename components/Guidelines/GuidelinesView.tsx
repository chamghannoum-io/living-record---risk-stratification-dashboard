
import React, { useMemo } from 'react';
import { FilterState, Patient, ComplianceStatus, GuidelineType } from '../../types';
import { COLORS, Icons, HOSPITALS, SPECIALTIES } from '../../constants';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, BarChart, Bar
} from 'recharts';

interface GuidelinesViewProps {
  patients: Patient[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onSelectPatient: (id: string) => void;
}

const GuidelinesView: React.FC<GuidelinesViewProps> = ({ patients, filters, setFilters, onSelectPatient }) => {
  const filteredData = useMemo(() => {
    return patients.filter(p => {
      if (filters.complianceStatus !== 'All Statuses' && !p.guidelineAdherence.some(a => a.status === filters.complianceStatus)) return false;
      if (filters.specialty !== 'All Specialties' && filters.specialty !== 'All Specialties') return true; // Mock behavior
      return true;
    });
  }, [patients, filters]);

  const stats = useMemo(() => {
    const totalCases = filteredData.reduce((acc, p) => acc + p.guidelineAdherence.length, 0);
    const compliantCases = filteredData.reduce((acc, p) => acc + p.guidelineAdherence.filter(a => a.status === ComplianceStatus.COMPLIANT).length, 0);
    const nonCompliant = filteredData.filter(p => p.guidelineAdherence.some(a => a.status === ComplianceStatus.NON_COMPLIANT)).length;
    const atRisk = filteredData.filter(p => p.guidelineAdherence.some(a => a.status === ComplianceStatus.AT_RISK)).length;
    const rate = totalCases ? ((compliantCases / totalCases) * 100).toFixed(1) : '0';

    return { totalCases, compliantRate: rate, nonCompliant, atRisk, qualityScore: 91 };
  }, [filteredData]);

  const distributionData = [
    { name: 'Fully Compliant', value: 65, color: COLORS.low },
    { name: 'Partial', value: 20, color: COLORS.moderate },
    { name: 'At Risk', value: 10, color: COLORS.high },
    { name: 'Non-Compliant', value: 5, color: COLORS.critical },
  ];

  const trendData = [
    { month: 'Sep', overall: 82.1, prev: 85.2, treat: 79.1 },
    { month: 'Oct', overall: 83.4, prev: 86.1, treat: 80.5 },
    { month: 'Nov', overall: 85.2, prev: 88.4, treat: 82.3 },
    { month: 'Dec', overall: 84.8, prev: 87.9, treat: 81.9 },
    { month: 'Jan', overall: 86.3, prev: 89.1, treat: 83.5 },
    { month: 'Feb', overall: 87.4, prev: 91.0, treat: 85.2 },
  ];

  const topViolations = [
    { name: 'Diabetes A1c Monitoring', count: 34 },
    { name: 'Post-MI Beta Blocker', count: 21 },
    { name: 'Colon Cancer Screening', count: 18 },
    { name: 'CHF Med Optimization', count: 15 },
    { name: 'Annual Wellness Visit', count: 12 },
  ].sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#00D9FF]">Guideline Compliance Analytics</h1>
          <p className="text-gray-400 text-sm">Monitoring adherence to evidence-based clinical standards</p>
        </div>
        <div className="flex space-x-3">
          <select 
            className="bg-[#1E2936] border border-[#2D3A4B] rounded-lg px-3 py-2 text-sm focus:outline-none"
            value={filters.hospital}
            onChange={e => setFilters(prev => ({ ...prev, hospital: e.target.value }))}
          >
            {HOSPITALS.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
          <button className="bg-[#1E2936] border border-[#2D3A4B] rounded-lg px-4 py-2 text-sm font-semibold hover:bg-[#252F3E] transition-colors">
            Audit Documentation
          </button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="bg-[#1E2936] p-4 rounded-xl border border-[#2D3A4B] grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Specialty</label>
          <select 
            className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 text-xs focus:border-[#00D9FF] outline-none"
            value={filters.specialty}
            onChange={e => setFilters(prev => ({ ...prev, specialty: e.target.value }))}
          >
            {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Compliance Status</label>
          <select 
            className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 text-xs focus:border-[#00D9FF] outline-none"
            value={filters.complianceStatus}
            onChange={e => setFilters(prev => ({ ...prev, complianceStatus: e.target.value }))}
          >
            <option>All Statuses</option>
            {Object.values(ComplianceStatus).map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Guideline Type</label>
          <select 
            className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 text-xs focus:border-[#00D9FF] outline-none"
            value={filters.guidelineType}
            onChange={e => setFilters(prev => ({ ...prev, guidelineType: e.target.value }))}
          >
            <option>All Types</option>
            {Object.values(GuidelineType).map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div className="space-y-1 lg:col-span-2">
           <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Patient / Protocol Search</label>
           <input 
            type="text" 
            placeholder="Search by ID, name, or guideline..."
            className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 text-xs focus:border-[#00D9FF] outline-none"
            value={filters.search}
            onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
           />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ComplianceMetricCard 
          title="Compliance Rate" 
          value={`${stats.compliantRate}%`} 
          subtitle="Overall adherence to protocols"
          icon={<Icons.Analytics />}
          color={COLORS.low}
          sparkline
        />
        <ComplianceMetricCard 
          title="Non-Compliant Cases" 
          value={stats.nonCompliant.toString()} 
          subtitle="Urgent standard of care gaps"
          icon={<Icons.Alert />}
          color={COLORS.critical}
          urgent
        />
        <ComplianceMetricCard 
          title="At-Risk Compliance" 
          value={stats.atRisk.toString()} 
          subtitle="Trending toward non-compliance"
          icon={<Icons.Gauge />}
          color={COLORS.high}
        />
        <ComplianceMetricCard 
          title="Quality Performance" 
          value={`${stats.qualityScore}/100`} 
          subtitle="Composite clinical score"
          icon={<Icons.Chart />}
          color={COLORS.cyan}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GuidelinesChartContainer title="Adherence Distribution" subtitle="Composition of active cases across status levels">
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
                  <p className="text-2xl font-bold">856</p>
                  <p className="text-[10px] text-gray-500 uppercase">Cases</p>
               </div>
            </div>
            <div className="w-1/2 space-y-2 pr-4">
              {distributionData.map((d) => (
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
        </GuidelinesChartContainer>

        <GuidelinesChartContainer title="Compliance Trends Over Time" subtitle="Rolling adherence trends by standard type">
           <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={10} />
                <YAxis stroke="#6B7280" fontSize={10} domain={[60, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }} />
                <Line type="monotone" dataKey="overall" stroke={COLORS.cyan} strokeWidth={3} dot={{ r: 4 }} name="Overall" />
                <Line type="monotone" dataKey="prev" stroke={COLORS.low} strokeWidth={2} name="Preventive" />
                <Line type="monotone" dataKey="treat" stroke={COLORS.moderate} strokeWidth={2} name="Treatment" />
              </LineChart>
           </ResponsiveContainer>
        </GuidelinesChartContainer>
      </div>

      {/* Operational Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <GuidelinesChartContainer title="Top 10 Non-Compliant Protocols" subtitle="Guidelines with highest deviation volume">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={topViolations} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#9CA3AF" fontSize={10} width={120} />
                  <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }} cursor={{ fill: '#252F3E' }} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {topViolations.map((_, i) => (
                       <Cell key={`cell-${i}`} fill={i < 2 ? COLORS.critical : COLORS.high} />
                    ))}
                  </Bar>
               </BarChart>
            </ResponsiveContainer>
         </GuidelinesChartContainer>

         <div className="bg-[#1E2936] rounded-xl border border-[#2D3A4B] p-6 flex flex-col justify-center text-center space-y-4">
            <div className="mx-auto p-4 bg-cyan-950/20 rounded-full border border-cyan-900/40 text-[#00D9FF]">
               <Icons.Analytics />
            </div>
            <div>
               <h3 className="text-xl font-bold">Protocol Alert: Diabetes Monitoring</h3>
               <p className="text-sm text-gray-400 max-w-sm mx-auto">42 cases identified with HbA1c monitoring deviations. Audit risk exposure detected in 18 cases.</p>
            </div>
            <button className="px-6 py-2 bg-[#00D9FF] text-[#0F1419] rounded-lg text-sm font-bold shadow-lg shadow-cyan-900/30">Review Audit Log</button>
         </div>
      </div>

      {/* Registry Table */}
      <div className="bg-[#1E2936] rounded-xl border border-[#2D3A4B] overflow-hidden">
        <div className="p-5 border-b border-[#2D3A4B] bg-[#252F3E20] flex justify-between items-center">
           <h2 className="text-lg font-bold">Non-Compliant & At-Risk Registry</h2>
           <div className="flex space-x-2">
             <button className="text-[10px] font-bold px-3 py-1.5 border border-[#2D3A4B] rounded hover:bg-[#252F3E]">Export PDF</button>
             <button className="text-[10px] font-bold px-3 py-1.5 bg-[#00D9FF10] border border-[#00D9FF30] text-[#00D9FF] rounded">Audit All</button>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
               <tr className="text-[10px] text-gray-500 border-b border-[#2D3A4B] uppercase tracking-widest font-bold">
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Guideline / Protocol</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4">Deviation</th>
                  <th className="px-6 py-4 text-center">Impact</th>
                  <th className="px-6 py-4 text-right">Action</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-[#2D3A4B]">
               {filteredData.slice(0, 15).map(p => {
                 const firstIssue = p.guidelineAdherence.find(a => a.status !== ComplianceStatus.COMPLIANT);
                 if (!firstIssue) return null;
                 return (
                   <tr key={p.id} className="hover:bg-[#252F3E] cursor-pointer group transition-colors" onClick={() => onSelectPatient(p.id)}>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold">{p.name}</p>
                        <p className="text-[10px] text-gray-500 font-mono">ID: {p.id} • Dr. {p.careTeam[0].split(' ').pop()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-semibold">{firstIssue.protocol}</p>
                        <p className="text-[10px] text-gray-500">{firstIssue.category}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase
                           ${firstIssue.status === ComplianceStatus.NON_COMPLIANT ? 'bg-red-500/20 text-red-500' : ''}
                           ${firstIssue.status === ComplianceStatus.AT_RISK ? 'bg-orange-500/20 text-orange-500' : ''}
                           ${firstIssue.status === ComplianceStatus.PARTIAL ? 'bg-yellow-500/20 text-yellow-500' : ''}
                         `}>{firstIssue.status}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {firstIssue.deviationType}
                      </td>
                      <td className="px-6 py-4 text-center">
                         <span className={`text-[10px] font-medium
                           ${firstIssue.impactLevel === 'High' ? 'text-red-400' : firstIssue.impactLevel === 'Moderate' ? 'text-orange-400' : 'text-yellow-400'}
                         `}>{firstIssue.impactLevel}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button className="text-[10px] font-bold text-[#00D9FF] hover:underline">Correct</button>
                      </td>
                   </tr>
                 );
               })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ComplianceMetricCard: React.FC<{ title: string; value: string; subtitle: string; icon: React.ReactNode; color: string; urgent?: boolean; sparkline?: boolean }> = 
({ title, value, subtitle, icon, color, urgent, sparkline }) => (
  <div className={`bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-5 hover:border-[#00D9FF30] transition-colors relative overflow-hidden group ${urgent ? 'pulsing-red' : ''}`}>
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
      <div className="p-2 bg-[#0F1419] rounded-lg" style={{ color }}>{icon}</div>
    </div>
    <p className="text-[10px] text-gray-400">{subtitle}</p>
    {sparkline && (
      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#00D9FF] to-transparent w-full opacity-30"></div>
    )}
  </div>
);

const GuidelinesChartContainer: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
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

export default GuidelinesView;
