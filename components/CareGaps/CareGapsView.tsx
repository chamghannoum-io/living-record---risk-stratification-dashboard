
import React, { useMemo } from 'react';
import { FilterState, Patient, GapType, RiskLevel } from '../../types';
import { COLORS, Icons, HOSPITALS, BRANCHES } from '../../constants';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, BarChart, Bar
} from 'recharts';

interface CareGapsViewProps {
  patients: Patient[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onSelectPatient: (id: string) => void;
}

const CareGapsView: React.FC<CareGapsViewProps> = ({ patients, filters, setFilters, onSelectPatient }) => {
  // Aggregate data for Care Gaps
  const patientsWithGaps = useMemo(() => patients.filter(p => p.activeGaps.length > 0), [patients]);
  
  const filteredGapsData = useMemo(() => {
    return patients.filter(p => {
      if (filters.gapType !== 'All' && !p.activeGaps.some(g => g.type === filters.gapType)) return false;
      if (filters.riskLevel !== 'All Levels' && p.riskLevel !== filters.riskLevel) return false;
      return true;
    });
  }, [patients, filters]);

  const stats = useMemo(() => {
    const critical = filteredGapsData.reduce((acc, p) => acc + p.activeGaps.filter(g => g.priority === 'Critical' || g.daysOverdue > 90).length, 0);
    const totalGaps = filteredGapsData.reduce((acc, p) => acc + p.activeGaps.length, 0);
    
    // Find most common gap
    const counts: Record<string, number> = {};
    filteredGapsData.forEach(p => p.activeGaps.forEach(g => {
      counts[g.type] = (counts[g.type] || 0) + 1;
    }));
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const commonGap = sorted.length > 0 ? sorted[0] : ['None', 0];

    return {
      totalPatients: filteredGapsData.length,
      criticalGaps: critical,
      mostCommon: commonGap[0],
      totalGapsCount: totalGaps,
      avgResolution: 34 // mock
    };
  }, [filteredGapsData]);

  const typeDistribution = useMemo(() => {
    const dist: Record<string, number> = {};
    filteredGapsData.forEach(p => p.activeGaps.forEach(g => {
      dist[g.type] = (dist[g.type] || 0) + 1;
    }));
    return Object.entries(dist).map(([name, value]) => ({ name, value }));
  }, [filteredGapsData]);

  const trendData = [
    { month: 'Sep', total: 650, critical: 120 },
    { month: 'Oct', total: 680, critical: 135 },
    { month: 'Nov', total: 710, critical: 150 },
    { month: 'Dec', total: 690, critical: 140 },
    { month: 'Jan', total: 720, critical: 155 },
    { month: 'Feb', total: stats.totalGapsCount, critical: stats.criticalGaps },
  ];

  const topOverdue = [
    { name: 'Colonoscopy Overdue', count: 42, color: COLORS.critical },
    { name: 'HbA1c Screening', count: 60, color: COLORS.high },
    { name: 'Pneumococcal Vaccine', count: 41, color: COLORS.moderate },
    { name: 'Mammogram Overdue', count: 36, color: COLORS.high },
    { name: 'Depression Screening', count: 28, color: COLORS.low },
  ].sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#00D9FF]">Care Gaps Detection</h1>
          <p className="text-gray-400 text-sm">Identifying unmet clinical needs across population segments</p>
        </div>
        <div className="flex space-x-3">
          <select 
            className="bg-[#1E2936] border border-[#2D3A4B] rounded-lg px-3 py-2 text-sm focus:outline-none"
            value={filters.hospital}
            onChange={e => setFilters(prev => ({ ...prev, hospital: e.target.value }))}
          >
            {HOSPITALS.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
          <button className="bg-[#1E2936] border border-[#2D3A4B] rounded-lg px-4 py-2 text-sm font-semibold flex items-center space-x-2">
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Dynamic Filters */}
      <div className="bg-[#1E2936] p-4 rounded-xl border border-[#2D3A4B] grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Gap Type</label>
          <select 
            className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 text-xs focus:border-[#00D9FF] outline-none"
            value={filters.gapType}
            onChange={e => setFilters(prev => ({ ...prev, gapType: e.target.value }))}
          >
            <option>All</option>
            {Object.values(GapType).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Risk Level</label>
          <select 
            className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 text-xs focus:border-[#00D9FF] outline-none"
            value={filters.riskLevel}
            onChange={e => setFilters(prev => ({ ...prev, riskLevel: e.target.value }))}
          >
            <option>All Levels</option>
            {Object.values(RiskLevel).map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Age Range</label>
          <select 
            className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 text-xs focus:border-[#00D9FF] outline-none"
            value={filters.ageRange}
            onChange={e => setFilters(prev => ({ ...prev, ageRange: e.target.value }))}
          >
            <option>All Ages</option>
            <option>0–18</option>
            <option>19–40</option>
            <option>41–65</option>
            <option>65+</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Time Overdue</label>
          <select className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 text-xs focus:border-[#00D9FF] outline-none">
            <option>All</option>
            <option>&lt; 3 months</option>
            <option>3–6 months</option>
            <option>6–12 months</option>
            <option>1 year+</option>
          </select>
        </div>
        <div className="flex items-end">
          <button 
            onClick={() => setFilters(prev => ({ ...prev, gapType: 'All', riskLevel: 'All Levels', ageRange: 'All Ages' }))}
            className="w-full text-[#00D9FF] text-xs font-semibold hover:underline bg-[#00D9FF05] py-1.5 border border-[#00D9FF30] rounded"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GapMetricCard 
          title="Patients with Gaps" 
          value={stats.totalPatients.toString()} 
          subtitle="Unmet care needs identified"
          icon={<Icons.Users />}
          color={COLORS.cyan}
        />
        <GapMetricCard 
          title="Critical Gaps" 
          value={stats.criticalGaps.toString()} 
          subtitle="Requiring immediate action"
          icon={<Icons.Alert />}
          color={COLORS.critical}
          urgent
        />
        <GapMetricCard 
          title="Most Common Type" 
          value={stats.mostCommon} 
          subtitle={`${typeDistribution.find(t => t.name === stats.mostCommon)?.value || 0} active gaps`}
          icon={<Icons.Check />}
          color={COLORS.moderate}
        />
        <GapMetricCard 
          title="Avg Resolution Time" 
          value={`${stats.avgResolution}d`} 
          subtitle="Target: 21 days"
          icon={<Icons.Analytics />}
          color={COLORS.low}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GapChartContainer title="Gap Type Distribution" subtitle="Composition of total active gaps">
          <div className="flex h-full items-center">
            <div className="w-1/2 h-full">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={typeDistribution} innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                      {typeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={[COLORS.cyan, COLORS.high, COLORS.moderate, COLORS.low, COLORS.critical][index % 5]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: 'none', borderRadius: '8px' }} />
                  </PieChart>
               </ResponsiveContainer>
               <div className="absolute top-1/2 left-[25%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <p className="text-2xl font-bold">{stats.totalGapsCount}</p>
                  <p className="text-[10px] text-gray-500 uppercase">Total Gaps</p>
               </div>
            </div>
            <div className="w-1/2 space-y-2 pr-4">
              {typeDistribution.map((t, i) => (
                <div key={t.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: [COLORS.cyan, COLORS.high, COLORS.moderate, COLORS.low, COLORS.critical][i % 5] }}></div>
                    <span className="text-gray-400">{t.name}</span>
                  </div>
                  <span className="font-bold">{t.value}</span>
                </div>
              ))}
            </div>
          </div>
        </GapChartContainer>

        <GapChartContainer title="Care Gap Evolution" subtitle="Total vs Critical gaps over 6 months">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={10} />
              <YAxis stroke="#6B7280" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }} />
              <Line type="monotone" dataKey="total" stroke={COLORS.cyan} strokeWidth={3} dot={{ r: 4 }} name="Total Gaps" />
              <Line type="monotone" dataKey="critical" stroke={COLORS.critical} strokeWidth={2} strokeDasharray="5 5" dot={false} name="Critical Gaps" />
            </LineChart>
          </ResponsiveContainer>
        </GapChartContainer>
      </div>

      {/* Operational Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GapChartContainer title="Top 10 Overdue Interventions" subtitle="Interventions with highest volume of delays">
           <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topOverdue} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#9CA3AF" fontSize={10} width={120} />
                <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }} cursor={{ fill: '#252F3E' }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {topOverdue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
           </ResponsiveContainer>
        </GapChartContainer>

        <div className="bg-[#1E2936] rounded-xl border border-[#2D3A4B] p-6 flex flex-col justify-center items-center text-center space-y-4">
           <div className="p-4 bg-red-950/20 rounded-full border border-red-900/40">
              <Icons.Alert />
           </div>
           <div>
              <h3 className="text-xl font-bold">Priority Resolution Alert</h3>
              <p className="text-gray-400 text-sm max-w-xs mx-auto">Metabolic monitoring gaps in Diabetic patients over 65 have increased by 18% this quarter.</p>
           </div>
           <button className="px-6 py-2 bg-[#FF4444] hover:bg-red-500 transition-colors text-white text-sm font-bold rounded-lg shadow-lg shadow-red-900/30">
              Initiate Outreach Campaign
           </button>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-[#1E2936] rounded-xl border border-[#2D3A4B] overflow-hidden">
        <div className="p-5 border-b border-[#2D3A4B] flex justify-between items-center bg-[#252F3E20]">
           <h2 className="text-lg font-bold">Active Care Gap Registry</h2>
           <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <Icons.Search />
              </span>
              <input 
                type="text" 
                placeholder="Search by ID, name, gap..."
                className="bg-[#0F1419] border border-[#2D3A4B] rounded-lg py-1.5 pl-10 pr-4 text-xs focus:outline-none focus:border-[#00D9FF] w-64"
                value={filters.search}
                onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-gray-500 border-b border-[#2D3A4B] uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4 text-center">Risk</th>
                <th className="px-6 py-4">Primary Gap</th>
                <th className="px-6 py-4 text-center">Days Overdue</th>
                <th className="px-6 py-4">Clinical Impact</th>
                <th className="px-6 py-4">Assigned</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D3A4B]">
              {filteredGapsData.slice(0, 10).map((p) => {
                const primaryGap = p.activeGaps[0];
                if (!primaryGap) return null;
                return (
                  <tr key={p.id} className="hover:bg-[#252F3E] transition-colors cursor-pointer group" onClick={() => onSelectPatient(p.id)}>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-white group-hover:text-[#00D9FF] transition-colors">{p.name}</p>
                      <p className="text-[10px] text-gray-500 font-mono">{p.id} • {p.age}y</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase
                         ${p.riskLevel === RiskLevel.CRITICAL ? 'bg-[#FF444420] text-[#FF4444]' : ''}
                         ${p.riskLevel === RiskLevel.HIGH ? 'bg-[#FF8C0020] text-[#FF8C00]' : ''}
                         ${p.riskLevel === RiskLevel.MODERATE ? 'bg-[#FFB80020] text-[#FFB800]' : ''}
                         ${p.riskLevel === RiskLevel.LOW ? 'bg-[#00FF8820] text-[#00FF88]' : ''}
                       `}>{p.riskLevel}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-semibold">{primaryGap.detail}</p>
                      <p className="text-[10px] text-gray-400">{primaryGap.type}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs font-mono font-bold ${primaryGap.daysOverdue > 365 ? 'text-red-500' : 'text-gray-300'}`}>
                        {primaryGap.daysOverdue}d
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-medium
                        ${primaryGap.clinicalImpact === 'High' ? 'text-red-400' : primaryGap.clinicalImpact === 'Medium' ? 'text-yellow-400' : 'text-green-400'}
                      `}>
                        {primaryGap.clinicalImpact} Urgency
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-300">{primaryGap.assignedTo}</td>
                    <td className="px-6 py-4 text-right">
                       <button className="text-[10px] font-bold text-[#00D9FF] bg-[#00D9FF10] border border-[#00D9FF30] px-3 py-1.5 rounded hover:bg-[#00D9FF] hover:text-[#0F1419] transition-all">
                          Resolve
                       </button>
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

const GapMetricCard: React.FC<{ title: string; value: string; subtitle: string; icon: React.ReactNode; color: string; urgent?: boolean }> = 
({ title, value, subtitle, icon, color, urgent }) => (
  <div className={`bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-5 hover:border-[#00D9FF50] transition-colors relative overflow-hidden group ${urgent ? 'pulsing-red' : ''}`}>
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <div className="p-2 bg-[#0F1419] rounded-lg group-hover:scale-110 transition-transform" style={{ color }}>{icon}</div>
    </div>
    <p className="text-[10px] text-gray-400">{subtitle}</p>
    <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-[#00D9FF] to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
  </div>
);

const GapChartContainer: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div className="bg-[#1E2936] rounded-xl border border-[#2D3A4B] p-6 h-[320px] relative overflow-hidden flex flex-col">
     <div className="mb-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-xs text-gray-500">{subtitle}</p>
     </div>
     <div className="flex-1 relative">
        {children}
     </div>
  </div>
);

export default CareGapsView;
