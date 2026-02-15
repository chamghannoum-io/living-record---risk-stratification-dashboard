
import React, { useMemo } from 'react';
import { FilterState, Patient, RiskLevel, AbnormalCategory, AbnormalResultStatus } from '../../types';
import { COLORS, Icons, HOSPITALS } from '../../constants';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, BarChart, Bar
} from 'recharts';

interface AbnormalResultsViewProps {
  patients: Patient[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onSelectPatient: (id: string) => void;
}

const AbnormalResultsView: React.FC<AbnormalResultsViewProps> = ({ patients, filters, setFilters, onSelectPatient }) => {
  const allResults = useMemo(() => {
    return patients.flatMap(p => p.abnormalResults.map(r => ({ ...r, patientName: p.name, patientId: p.id, patientAge: p.age })));
  }, [patients]);

  const filteredResults = useMemo(() => {
    return allResults.filter(r => {
      if (filters.abnormalCategory !== 'All' && r.category !== filters.abnormalCategory) return false;
      if (filters.riskLevel !== 'All Levels' && r.severity !== filters.riskLevel) return false;
      if (filters.abnormalStatus !== 'All' && r.status !== filters.abnormalStatus) return false;
      if (filters.search && !r.patientName.toLowerCase().includes(filters.search.toLowerCase()) && !r.testName.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [allResults, filters]);

  const stats = useMemo(() => {
    const critical = filteredResults.filter(r => r.severity === RiskLevel.CRITICAL).length;
    const pending = filteredResults.filter(r => r.status === AbnormalResultStatus.NEW).length;
    return {
      total: filteredResults.length,
      critical,
      pending,
      criticalPercent: filteredResults.length ? ((critical / filteredResults.length) * 100).toFixed(1) : '0',
      avgActionTime: '4.2h'
    };
  }, [filteredResults]);

  const distributionData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredResults.forEach(r => {
      counts[r.severity] = (counts[r.severity] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredResults]);

  const trendData = [
    { time: 'T-5h', Lab: 12, Imaging: 5, Vitals: 8 },
    { time: 'T-4h', Lab: 18, Imaging: 4, Vitals: 12 },
    { time: 'T-3h', Lab: 15, Imaging: 8, Vitals: 10 },
    { time: 'T-2h', Lab: 22, Imaging: 6, Vitals: 15 },
    { time: 'T-1h', Lab: 19, Imaging: 7, Vitals: 11 },
    { time: 'Now', Lab: 21, Imaging: 6, Vitals: 13 },
  ];

  const topCritical = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredResults.filter(r => r.severity === RiskLevel.CRITICAL).forEach(r => {
      counts[r.testName] = (counts[r.testName] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 8);
  }, [filteredResults]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#00D9FF] flex items-center gap-2">
            <Icons.Bell /> Abnormal Results Intelligence
          </h1>
          <p className="text-gray-400 text-sm">Clinical early warning radar for critical and out-of-range findings</p>
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
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             Live Feed Active
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#1E2936] p-4 rounded-xl border border-[#2D3A4B] grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Category</label>
          <select 
            className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 text-xs outline-none focus:border-[#00D9FF]"
            value={filters.abnormalCategory}
            onChange={e => setFilters(prev => ({ ...prev, abnormalCategory: e.target.value }))}
          >
            <option>All</option>
            {Object.values(AbnormalCategory).map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Severity</label>
          <select 
            className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 text-xs outline-none focus:border-[#00D9FF]"
            value={filters.riskLevel}
            onChange={e => setFilters(prev => ({ ...prev, riskLevel: e.target.value }))}
          >
            <option>All Levels</option>
            {Object.values(RiskLevel).map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Status</label>
          <select 
            className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 text-xs outline-none focus:border-[#00D9FF]"
            value={filters.abnormalStatus}
            onChange={e => setFilters(prev => ({ ...prev, abnormalStatus: e.target.value }))}
          >
            <option>All</option>
            {Object.values(AbnormalResultStatus).map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div className="space-y-1 lg:col-span-2">
           <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Search</label>
           <input 
            type="text" 
            placeholder="Search patient or test..."
            className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 text-xs outline-none focus:border-[#00D9FF]"
            value={filters.search}
            onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
           />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Abnormal Results" 
          value={stats.total.toString()} 
          subtitle="Flagged clinical findings"
          icon={<Icons.Analytics />}
          color={COLORS.cyan}
        />
        <MetricCard 
          title="Critical Alerts" 
          value={stats.critical.toString()} 
          subtitle={`${stats.criticalPercent}% require immediate action`}
          icon={<Icons.Alert />}
          color={COLORS.critical}
          urgent
        />
        <MetricCard 
          title="Unacknowledged" 
          value={stats.pending.toString()} 
          subtitle="Pending provider review"
          icon={<Icons.Menu />}
          color={COLORS.high}
        />
        <MetricCard 
          title="Avg Time to Action" 
          value={stats.avgActionTime} 
          subtitle="Target: < 3 hours"
          icon={<Icons.Gauge />}
          color={COLORS.low}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Severity Distribution" subtitle="Composition of flagged findings">
          <div className="flex items-center h-full">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={distributionData} innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                    {distributionData.map((d, i) => (
                      <Cell key={`cell-${i}`} fill={d.name === RiskLevel.CRITICAL ? COLORS.critical : d.name === RiskLevel.HIGH ? COLORS.high : d.name === RiskLevel.MODERATE ? COLORS.moderate : COLORS.low} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: 'none', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-[25%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-[10px] text-gray-500 uppercase">Total</p>
              </div>
            </div>
            <div className="w-1/2 space-y-2 pr-4">
              {distributionData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.name === RiskLevel.CRITICAL ? COLORS.critical : d.name === RiskLevel.HIGH ? COLORS.high : d.name === RiskLevel.MODERATE ? COLORS.moderate : COLORS.low }}></div>
                    <span className="text-gray-400">{d.name}</span>
                  </div>
                  <span className="font-bold">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartContainer>

        <ChartContainer title="Live Volume Trends" subtitle="Real-time volume by clinical category">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" />
              <XAxis dataKey="time" stroke="#6B7280" fontSize={10} />
              <YAxis stroke="#6B7280" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }} />
              <Line type="monotone" dataKey="Lab" stroke={COLORS.cyan} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Vitals" stroke={COLORS.moderate} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Imaging" stroke={COLORS.critical} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Top Critical Findings" subtitle="Most frequent life-threatening abnormalities">
           <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCritical} layout="vertical" margin={{ left: 20 }}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" horizontal={false} />
                 <XAxis type="number" hide />
                 <YAxis dataKey="name" type="category" stroke="#9CA3AF" fontSize={10} width={120} />
                 <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }} cursor={{ fill: '#252F3E' }} />
                 <Bar dataKey="count" fill={COLORS.critical} radius={[0, 4, 4, 0]} />
              </BarChart>
           </ResponsiveContainer>
        </ChartContainer>

        <div className="bg-[#1E2936] rounded-xl border border-[#2D3A4B] p-6 flex flex-col justify-center text-center space-y-4">
           <div className="mx-auto p-4 bg-red-950/20 rounded-full border border-red-900/40 text-red-400">
              <Icons.Alert />
           </div>
           <div>
              <h3 className="text-xl font-bold text-white">Critical Alert: Cluster Detected</h3>
              <p className="text-sm text-gray-400 max-w-sm mx-auto">8 patients in Main Wing exhibit persistent tachycardia + hypotension. High sepsis suspicion protocol recommended.</p>
           </div>
           <button className="px-6 py-2 bg-[#FF4444] text-white rounded-lg text-sm font-bold shadow-lg shadow-red-900/30">Initiate Rapid Response</button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1E2936] rounded-xl border border-[#2D3A4B] overflow-hidden">
        <div className="p-5 border-b border-[#2D3A4B] bg-[#252F3E20] flex justify-between items-center">
           <h2 className="text-lg font-bold">Critical & High Priority Findings</h2>
           <div className="flex gap-2">
             <button className="px-3 py-1.5 border border-[#2D3A4B] rounded text-[10px] font-bold uppercase hover:bg-[#252F3E]">Export Audit Trail</button>
             <button className="px-3 py-1.5 bg-[#00D9FF10] border border-[#00D9FF30] text-[#00D9FF] rounded text-[10px] font-bold uppercase">Acknowledge All</button>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
               <tr className="text-[10px] text-gray-500 border-b border-[#2D3A4B] uppercase tracking-widest font-bold">
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Result Type</th>
                  <th className="px-6 py-4">Test</th>
                  <th className="px-6 py-4 text-center">Value / Range</th>
                  <th className="px-6 py-4 text-center">Severity</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-[#2D3A4B]">
               {filteredResults.slice(0, 15).map(r => (
                 <tr key={r.id} className="hover:bg-[#252F3E] cursor-pointer group transition-colors" onClick={() => onSelectPatient(r.patientId)}>
                    <td className="px-6 py-4">
                       <p className="text-sm font-bold group-hover:text-[#00D9FF] transition-colors">{r.patientName}</p>
                       <p className="text-[10px] text-gray-500 font-mono">ID: {r.patientId} • {r.patientAge}y</p>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{r.category}</span>
                    </td>
                    <td className="px-6 py-4">
                       <p className="text-xs font-bold">{r.testName}</p>
                       <p className="text-[10px] text-gray-500">{r.timestamp}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <p className={`text-sm font-mono font-bold ${r.severity === RiskLevel.CRITICAL ? 'text-red-400' : 'text-white'}`}>{r.value}</p>
                       <p className="text-[10px] text-gray-500">Ref: {r.normalRange}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase
                         ${r.severity === RiskLevel.CRITICAL ? 'bg-red-500/20 text-red-500 pulsing-red' : ''}
                         ${r.severity === RiskLevel.HIGH ? 'bg-orange-500/20 text-orange-500' : ''}
                         ${r.severity === RiskLevel.MODERATE ? 'bg-yellow-500/20 text-yellow-500' : ''}
                         ${r.severity === RiskLevel.LOW ? 'bg-green-500/20 text-green-500' : ''}
                       `}>{r.severity}</span>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${r.status === AbnormalResultStatus.NEW ? 'bg-blue-500' : 'bg-gray-600'}`}></span>
                          <span className="text-[10px] text-gray-300 font-medium">{r.status}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button className="text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded hover:bg-red-500 hover:text-white transition-all">
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

const MetricCard: React.FC<{ title: string; value: string; subtitle: string; icon: React.ReactNode; color: string; urgent?: boolean }> = 
({ title, value, subtitle, icon, color, urgent }) => (
  <div className={`bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-5 hover:border-[#00D9FF30] transition-colors relative overflow-hidden group ${urgent ? 'pulsing-red border-red-900/40' : ''}`}>
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

export default AbnormalResultsView;
