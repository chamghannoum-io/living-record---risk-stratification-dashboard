
import React from 'react';
import { FilterState, Patient, RiskLevel } from '../../types';
import { COLORS, Icons, HOSPITALS, BRANCHES } from '../../constants';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

interface DashboardViewProps {
  stats: {
    total: number;
    highRiskCount: number;
    highRiskPercent: string;
    avgScore: string;
    complexNeeds: number;
  };
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  patients: Patient[];
  onSelectPatient: (id: string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ stats, filters, setFilters, patients, onSelectPatient }) => {
  // Chart Data Preparation
  const riskDistribution = [
    { name: 'Critical', value: patients.filter(p => p.riskLevel === RiskLevel.CRITICAL).length, color: COLORS.critical },
    { name: 'High', value: patients.filter(p => p.riskLevel === RiskLevel.HIGH).length, color: COLORS.high },
    { name: 'Moderate', value: patients.filter(p => p.riskLevel === RiskLevel.MODERATE).length, color: COLORS.moderate },
    { name: 'Low', value: patients.filter(p => p.riskLevel === RiskLevel.LOW).length, color: COLORS.low },
  ].filter(v => v.value > 0);

  const trendData = [
    { month: 'Sep', overall: 5.8, high: 7.2 },
    { month: 'Oct', overall: 6.0, high: 7.5 },
    { month: 'Nov', overall: 6.2, high: 8.0 },
    { month: 'Dec', overall: 6.1, high: 7.8 },
    { month: 'Jan', overall: 6.3, high: 7.9 },
    { month: 'Feb', overall: 6.2, high: 8.1 },
  ];

  const conditionFrequency = [
    { name: 'Heart Failure', count: 45 },
    { name: 'CKD Stage 4', count: 32 },
    { name: 'Diabetes Type 2', count: 28 },
    { name: 'Hypertension', count: 25 },
    { name: 'COPD', count: 18 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Risk Stratification Analytics</h1>
          <p className="text-gray-400 text-sm">Real-time population health risk assessment</p>
        </div>
        <div className="flex space-x-3">
          <select 
            className="bg-[#1E2936] border border-[#2D3A4B] rounded-lg px-3 py-2 text-sm focus:outline-none"
            value={filters.hospital}
            onChange={e => setFilters(prev => ({ ...prev, hospital: e.target.value }))}
          >
            {HOSPITALS.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
          <select 
            className="bg-[#1E2936] border border-[#2D3A4B] rounded-lg px-3 py-2 text-sm focus:outline-none"
            value={filters.branch}
            onChange={e => setFilters(prev => ({ ...prev, branch: e.target.value }))}
          >
            {BRANCHES[filters.hospital]?.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-[#1E2936] p-4 rounded-xl border border-[#2D3A4B] flex flex-wrap gap-4 items-center">
        <div className="space-y-1">
          <label className="text-xs text-gray-500 font-medium">Risk Level</label>
          <select 
            className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 text-xs"
            value={filters.riskLevel}
            onChange={e => setFilters(prev => ({ ...prev, riskLevel: e.target.value }))}
          >
            <option>All Levels</option>
            <option>{RiskLevel.CRITICAL}</option>
            <option>{RiskLevel.HIGH}</option>
            <option>{RiskLevel.MODERATE}</option>
            <option>{RiskLevel.LOW}</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-500 font-medium">Age Range</label>
          <select 
            className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 text-xs"
            value={filters.ageRange}
            onChange={e => setFilters(prev => ({ ...prev, ageRange: e.target.value }))}
          >
            <option>All Ages</option>
            <option>0-18 years</option>
            <option>19-40 years</option>
            <option>41-65 years</option>
            <option>65+ years</option>
          </select>
        </div>
        <button
          onClick={() => setFilters(prev => ({
            ...prev,
            hospital: 'All Hospitals', branch: 'All Branches', gender: 'All Genders',
            ageRange: 'All Ages', riskLevel: 'All Levels', conditionType: 'All Conditions', search: ''
          }))}
          className="ml-auto text-[#00D9FF] text-xs font-semibold hover:underline"
        >
          Clear All Filters
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Stratified" 
          value={stats.total.toString()} 
          subtitle="Patients with risk scores"
          icon={<Icons.Users />}
          color={COLORS.cyan}
        />
        <MetricCard 
          title="High-Risk Patients" 
          value={stats.highRiskCount.toString()} 
          subtitle={`${stats.highRiskPercent}% requiring attention`}
          icon={<Icons.Alert />}
          color={COLORS.critical}
          bg="bg-[#FF444415]"
        />
        <MetricCard 
          title="Avg Risk Score" 
          value={stats.avgScore} 
          subtitle="Population risk level"
          icon={<Icons.Gauge />}
          color={COLORS.moderate}
        />
        <MetricCard 
          title="3+ Comorbidities" 
          value={stats.complexNeeds.toString()} 
          subtitle="Complex care needs"
          icon={<Icons.Chart />}
          color={COLORS.high}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Risk Distribution by Level" subtitle="Current status of stratified population">
          <div className="flex items-center h-full">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }}
                    itemStyle={{ color: '#FFFFFF' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/4 -translate-y-1/2 text-center pointer-events-none" style={{ width: '160px' }}>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Total</p>
              </div>
            </div>
            <div className="w-1/2 space-y-3 px-4">
              {riskDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-400">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartContainer>

        <ChartContainer title="Risk Score Trends" subtitle="Rolling 6-month average profile">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} domain={[0, 10]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }}
                itemStyle={{ color: '#FFFFFF' }}
              />
              <Line type="monotone" dataKey="overall" stroke={COLORS.cyan} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="high" stroke={COLORS.critical} strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Patients Table */}
      <div className="bg-[#1E2936] rounded-xl border border-[#2D3A4B] overflow-hidden">
        <div className="p-5 border-b border-[#2D3A4B] flex justify-between items-center">
          <h2 className="text-lg font-bold">High-Risk Patient Details</h2>
          <div className="relative">
             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
               <Icons.Search />
             </span>
             <input 
              type="text" 
              placeholder="Search patients..."
              className="bg-[#0F1419] border border-[#2D3A4B] rounded-lg py-1.5 pl-10 pr-4 text-sm focus:outline-none"
              value={filters.search}
              onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
             />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-[#2D3A4B] uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Patient ID</th>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold text-center">Risk Level</th>
                <th className="px-6 py-4 font-semibold text-center">Score</th>
                <th className="px-6 py-4 font-semibold">Primary Conditions</th>
                <th className="px-6 py-4 font-semibold text-center">Medication</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D3A4B]">
              {patients.slice(0, 10).map((p) => (
                <tr key={p.id} className="hover:bg-[#252F3E] transition-colors group cursor-pointer" onClick={() => onSelectPatient(p.id)}>
                  <td className="px-6 py-4 text-xs font-mono text-[#00D9FF]">{p.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.age}y • {p.gender}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
                      ${p.riskLevel === RiskLevel.CRITICAL ? 'bg-[#FF444420] text-[#FF4444] pulsing-red' : ''}
                      ${p.riskLevel === RiskLevel.HIGH ? 'bg-[#FF8C0020] text-[#FF8C00]' : ''}
                      ${p.riskLevel === RiskLevel.MODERATE ? 'bg-[#FFB80020] text-[#FFB800]' : ''}
                      ${p.riskLevel === RiskLevel.LOW ? 'bg-[#00FF8820] text-[#00FF88]' : ''}
                    `}>
                      {p.riskLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-mono font-bold">{p.riskScore}/10</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-gray-300 max-w-[200px] truncate">{p.primaryConditions.join(', ')}</p>
                    <p className="text-[10px] text-gray-500">{p.comorbiditiesCount} comorbidities</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-24 h-1.5 bg-[#0F1419] rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${p.medicationAdherence > 85 ? 'bg-green-500' : p.medicationAdherence > 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${p.medicationAdherence}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 block">{p.medicationAdherence}% Adherence</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs font-bold text-[#00D9FF] hover:text-white transition-colors bg-[#00D9FF10] hover:bg-[#00D9FF] px-3 py-1.5 rounded border border-[#00D9FF30]">
                      Escalate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-[#2D3A4B] flex items-center justify-between text-xs text-gray-400">
          <span>Showing 1 to 10 of {patients.length} risk assessments</span>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-[#0F1419] rounded disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 bg-[#0F1419] border border-[#00D9FF] text-white rounded">1</button>
            <button className="px-3 py-1 bg-[#0F1419] rounded">2</button>
            <button className="px-3 py-1 bg-[#0F1419] rounded">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const MetricCard: React.FC<{ title: string; value: string; subtitle: string; icon: React.ReactNode; color: string; bg?: string }> = 
({ title, value, subtitle, icon, color, bg = 'bg-[#1E2936]' }) => (
  <div className={`${bg} border border-[#2D3A4B] rounded-xl p-5 hover:translate-y-[-2px] transition-transform duration-200 group relative overflow-hidden`}>
    <div className="flex justify-between items-start">
      <div className="space-y-1">
        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <div className="p-2.5 rounded-lg bg-[#0F1419] group-hover:bg-[#252F3E] transition-colors" style={{ color }}>
        {icon}
      </div>
    </div>
    <p className="mt-4 text-xs text-gray-500">{subtitle}</p>
    <div className="absolute bottom-0 left-0 h-1 transition-all duration-300 w-0 group-hover:w-full" style={{ backgroundColor: color }}></div>
  </div>
);

const ChartContainer: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div className="bg-[#1E2936] rounded-xl border border-[#2D3A4B] p-6 flex flex-col min-h-[350px] relative overflow-hidden">
    <div className="mb-6">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-gray-400 text-sm">{subtitle}</p>
    </div>
    <div className="flex-1 relative">
      {children}
    </div>
  </div>
);

export default DashboardView;
