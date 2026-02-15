
import React, { useMemo } from 'react';
import { FilterState, Patient, RiskLevel, GuardrailType } from '../../types';
import { COLORS, Icons, HOSPITALS, MEDICATION_CLASSES } from '../../constants';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, BarChart, Bar
} from 'recharts';

interface SafetyViewProps {
  patients: Patient[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onSelectPatient: (id: string) => void;
}

const SafetyView: React.FC<SafetyViewProps> = ({ patients, filters, setFilters, onSelectPatient }) => {
  const filteredData = useMemo(() => {
    return patients.filter(p => {
      if (filters.riskLevel !== 'All Levels' && p.riskLevel !== filters.riskLevel) return false;
      if (filters.guardrailType !== 'All' && !p.safetyAlerts.some(a => a.type === filters.guardrailType)) return false;
      return true;
    });
  }, [patients, filters]);

  const stats = useMemo(() => {
    let totalAlerts = 0;
    let critical = 0;
    let high = 0;
    let contra = 0;
    let drugInt = 0;
    
    filteredData.forEach(p => {
      p.safetyAlerts.forEach(a => {
        totalAlerts++;
        if (a.severity === RiskLevel.CRITICAL) critical++;
        if (a.severity === RiskLevel.HIGH) high++;
        if (a.type === GuardrailType.CONTRAINDICATION) contra++;
        if (a.type === GuardrailType.DRUG_INTERACTION) drugInt++;
      });
    });

    return { totalAlerts, critical, high, contra, drugInt };
  }, [filteredData]);

  const distributionData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredData.forEach(p => p.safetyAlerts.forEach(a => {
      counts[a.type] = (counts[a.type] || 0) + 1;
    }));
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  const trendData = [
    { month: 'Sep', crit: 30, high: 60, mod: 110 },
    { month: 'Oct', crit: 35, high: 65, mod: 115 },
    { month: 'Nov', crit: 45, high: 75, mod: 130 },
    { month: 'Dec', crit: 40, high: 70, mod: 125 },
    { month: 'Jan', crit: 42, high: 72, mod: 128 },
    { month: 'Feb', crit: stats.critical, high: stats.high, mod: 174 },
  ];

  const medicationClassData = [
    { name: 'Anticoagulants', count: 62 },
    { name: 'Insulin', count: 48 },
    { name: 'Opioids', count: 36 },
    { name: 'Chemotherapy', count: 29 },
    { name: 'Cardiac Glycosides', count: 18 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#00D9FF] flex items-center gap-2">
            <Icons.Shield /> Safety Guardrails Analytics
          </h1>
          <p className="text-gray-400 text-sm">Mission-critical safety monitoring and proactive risk prevention</p>
        </div>
        <div className="flex space-x-3">
          <select 
            className="bg-[#1E2936] border border-[#2D3A4B] rounded-lg px-3 py-2 text-sm focus:outline-none"
            value={filters.hospital}
            onChange={e => setFilters(prev => ({ ...prev, hospital: e.target.value }))}
          >
            {HOSPITALS.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
          <button className="bg-[#1E2936] border border-[#2D3A4B] rounded-lg px-4 py-2 text-sm font-semibold">
            Real-time Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#1E2936] p-4 rounded-xl border border-[#2D3A4B] grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] text-gray-500 font-bold uppercase">Severity</label>
          <select 
            className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 text-xs outline-none"
            value={filters.riskLevel}
            onChange={e => setFilters(prev => ({ ...prev, riskLevel: e.target.value }))}
          >
            <option>All Levels</option>
            {Object.values(RiskLevel).map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-gray-500 font-bold uppercase">Guardrail Type</label>
          <select 
            className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 text-xs outline-none"
            value={filters.guardrailType}
            onChange={e => setFilters(prev => ({ ...prev, guardrailType: e.target.value }))}
          >
            <option>All</option>
            {Object.values(GuardrailType).map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-gray-500 font-bold uppercase">Med Class</label>
          <select 
            className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 text-xs outline-none"
            value={filters.medicationClass}
            onChange={e => setFilters(prev => ({ ...prev, medicationClass: e.target.value }))}
          >
            {MEDICATION_CLASSES.map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div className="space-y-1 lg:col-span-2">
           <label className="text-[10px] text-gray-500 font-bold uppercase">Patient Search</label>
           <input 
            type="text" 
            placeholder="Search alerts..."
            className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 text-xs focus:border-[#00D9FF] outline-none"
            value={filters.search}
            onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
           />
        </div>
        <div className="flex items-end">
          <button 
            onClick={() => setFilters(prev => ({ ...prev, guardrailType: 'All', riskLevel: 'All Levels', medicationClass: 'All', search: '' }))}
            className="w-full text-xs font-bold py-1.5 text-[#00D9FF] hover:bg-[#00D9FF10] rounded border border-[#00D9FF30]"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SafetyCard 
          title="Active Safety Alerts" 
          value={stats.totalAlerts.toString()} 
          subtitle={`${stats.critical} Critical Alerts`}
          icon={<Icons.Shield />}
          color={COLORS.cyan}
          pulse={stats.critical > 0}
        />
        <SafetyCard 
          title="Contraindications" 
          value={stats.contra.toString()} 
          subtitle="Severe therapy conflicts"
          icon={<Icons.Alert />}
          color={COLORS.critical}
        />
        <SafetyCard 
          title="Drug Interactions" 
          value={stats.drugInt.toString()} 
          subtitle="Potential interactions"
          icon={<Icons.Chart />}
          color={COLORS.high}
        />
        <SafetyCard 
          title="High-Risk Meds" 
          value="184" 
          subtitle="Patients on high-alert meds"
          icon={<Icons.Users />}
          color={COLORS.moderate}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SafetyChartContainer title="Alert Distribution by Type" subtitle="Current safety violations breakdown">
          <div className="flex h-full items-center">
            <div className="w-1/2 h-full">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={distributionData} innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                      {distributionData.map((_, i) => (
                        <Cell key={`cell-${i}`} fill={[COLORS.cyan, COLORS.high, COLORS.moderate, COLORS.low, COLORS.critical][i % 5]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: 'none', borderRadius: '8px' }} />
                  </PieChart>
               </ResponsiveContainer>
               <div className="absolute top-1/2 left-[25%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <p className="text-2xl font-bold">{stats.totalAlerts}</p>
                  <p className="text-[10px] text-gray-500 uppercase">Alerts</p>
               </div>
            </div>
            <div className="w-1/2 space-y-2">
               {distributionData.map((d, i) => (
                 <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: [COLORS.cyan, COLORS.high, COLORS.moderate, COLORS.low, COLORS.critical][i % 5] }}></div>
                       <span className="text-gray-400">{d.name}</span>
                    </div>
                    <span className="font-bold">{d.value}</span>
                 </div>
               ))}
            </div>
          </div>
        </SafetyChartContainer>

        <SafetyChartContainer title="Safety Alert Trends" subtitle="Rolling severity trends over time">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={10} />
              <YAxis stroke="#6B7280" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }} />
              <Line type="monotone" dataKey="crit" stroke={COLORS.critical} strokeWidth={2} name="Critical" />
              <Line type="monotone" dataKey="high" stroke={COLORS.high} strokeWidth={2} name="High" />
              <Line type="monotone" dataKey="mod" stroke={COLORS.moderate} strokeWidth={2} name="Moderate" />
            </LineChart>
          </ResponsiveContainer>
        </SafetyChartContainer>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SafetyChartContainer title="Top High-Risk Medication Classes" subtitle="Classes with highest violation frequency">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={medicationClassData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" stroke="#9CA3AF" fontSize={10} width={100} />
              <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }} cursor={{ fill: '#252F3E' }} />
              <Bar dataKey="count" fill={COLORS.cyan} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SafetyChartContainer>

        <div className="bg-[#1E2936] rounded-xl border border-[#2D3A4B] p-6 flex flex-col justify-center text-center space-y-4">
           <div className="mx-auto p-4 bg-orange-950/20 rounded-full border border-orange-900/40 text-orange-400">
              <Icons.Analytics />
           </div>
           <div>
              <h3 className="text-xl font-bold text-white">Clinical Override Pattern</h3>
              <p className="text-sm text-gray-400 max-w-sm mx-auto">13 providers have overridden high-risk alerts more than 3 times this week. Renal-adjusted dosing gaps detected in 29 patients.</p>
           </div>
           <button className="px-6 py-2 bg-[#FF8C00] text-white rounded-lg text-sm font-bold shadow-lg shadow-orange-900/30">Review Overrides</button>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-[#1E2936] rounded-xl border border-[#2D3A4B] overflow-hidden">
        <div className="p-5 border-b border-[#2D3A4B] flex justify-between items-center bg-[#252F3E20]">
           <h2 className="text-lg font-bold">Active Safety Violations</h2>
           <button className="text-xs font-bold text-[#00D9FF] px-3 py-1.5 bg-[#00D9FF10] border border-[#00D9FF30] rounded">Export CSV</button>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead>
                 <tr className="text-[10px] text-gray-500 border-b border-[#2D3A4B] uppercase tracking-widest font-bold">
                    <th className="px-6 py-4">Patient</th>
                    <th className="px-6 py-4">Medication</th>
                    <th className="px-6 py-4">Guardrail</th>
                    <th className="px-6 py-4 text-center">Severity</th>
                    <th className="px-6 py-4">Clinical Conflict</th>
                    <th className="px-6 py-4 text-right">Action</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-[#2D3A4B]">
                 {filteredData.slice(0, 10).map(p => p.safetyAlerts.map(a => (
                   <tr key={a.id} className="hover:bg-[#252F3E] cursor-pointer group" onClick={() => onSelectPatient(p.id)}>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold">{p.name}</p>
                        <p className="text-[10px] text-gray-500 font-mono">{p.id} • {p.age}y</p>
                      </td>
                      <td className="px-6 py-4">
                         <p className="text-xs font-semibold">{a.medication}</p>
                      </td>
                      <td className="px-6 py-4">
                         <p className="text-xs text-gray-300">{a.type}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase
                           ${a.severity === RiskLevel.CRITICAL ? 'bg-red-500/20 text-red-500 pulsing-red' : ''}
                           ${a.severity === RiskLevel.HIGH ? 'bg-orange-500/20 text-orange-500' : ''}
                           ${a.severity === RiskLevel.MODERATE ? 'bg-yellow-500/20 text-yellow-500' : ''}
                           ${a.severity === RiskLevel.LOW ? 'bg-green-500/20 text-green-500' : ''}
                         `}>{a.severity}</span>
                      </td>
                      <td className="px-6 py-4">
                         <p className="text-xs text-gray-400 italic max-w-xs">{a.conflict}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button className="text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded hover:bg-red-500 hover:text-white">
                            Resolve
                         </button>
                      </td>
                   </tr>
                 )))}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

const SafetyCard: React.FC<{ title: string; value: string; subtitle: string; icon: React.ReactNode; color: string; pulse?: boolean }> = 
({ title, value, subtitle, icon, color, pulse }) => (
  <div className={`bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-5 hover:border-[#00D9FF30] transition-colors relative overflow-hidden group ${pulse ? 'pulsing-red' : ''}`}>
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
      <div className="p-2 bg-[#0F1419] rounded-lg group-hover:scale-110 transition-transform" style={{ color }}>{icon}</div>
    </div>
    <p className="text-[10px] text-gray-400">{subtitle}</p>
    <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-[#00D9FF] to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
  </div>
);

const SafetyChartContainer: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
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

export default SafetyView;
