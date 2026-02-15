
import React, { useMemo } from 'react';
import { FilterState, RiskLevel, AlertType, EncounterAlert } from '../../types';
import { COLORS, Icons, HOSPITALS, DEPARTMENTS, PROVIDER_TYPES, generateMockEncounterAlerts } from '../../constants';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, AreaChart, Area
} from 'recharts';

interface EncounterViewProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onSelectAlert: (id: string) => void;
}

const EncounterView: React.FC<EncounterViewProps> = ({ filters, setFilters, onSelectAlert }) => {
  const alerts = useMemo(() => generateMockEncounterAlerts(142), []);

  const filteredAlerts = useMemo(() => {
    return alerts.filter(a => {
      if (filters.hospital !== 'All Hospitals' && a.facility !== filters.hospital) return false;
      if (filters.department !== 'All Departments' && a.department !== filters.department) return false;
      if (filters.alertType !== 'All' && a.type !== filters.alertType) return false;
      if (filters.search && !a.patientName.toLowerCase().includes(filters.search.toLowerCase()) && !a.id.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [alerts, filters]);

  const stats = useMemo(() => {
    const activeCount = filteredAlerts.length;
    const critical = filteredAlerts.filter(a => a.severity === RiskLevel.CRITICAL).length;
    const urgentVisits = filteredAlerts.filter(a => a.type === AlertType.URGENT_VISIT).length;
    
    return {
      activeCount,
      critical,
      urgentVisits,
      utilization: 82
    };
  }, [filteredAlerts]);

  const heatmapData = useMemo(() => {
    const deps = DEPARTMENTS.filter(d => d !== 'All Departments');
    const facs = HOSPITALS.filter(f => f !== 'All Hospitals').slice(0, 4);
    
    return facs.map(f => ({
      facility: f,
      ...deps.reduce((acc, d) => ({ ...acc, [d]: Math.floor(Math.random() * 100) }), {})
    }));
  }, []);

  const alertTrendData = [
    { month: 'Sep', total: 60, capacity: 20, urgent: 15, staffing: 10, coord: 15 },
    { month: 'Oct', total: 65, capacity: 25, urgent: 18, staffing: 12, coord: 10 },
    { month: 'Nov', total: 85, capacity: 35, urgent: 25, staffing: 15, coord: 10 },
    { month: 'Dec', total: 75, capacity: 30, urgent: 20, staffing: 10, coord: 15 },
    { month: 'Jan', total: 90, capacity: 40, urgent: 28, staffing: 12, coord: 10 },
    { month: 'Feb', total: 87, capacity: 31, urgent: 22, staffing: 18, coord: 16 },
  ];

  const backlogData = [
    { name: 'Cardiology', backlog: 41, change: 12 },
    { name: 'Neurology', backlog: 33, change: 8 },
    { name: 'Endocrinology', backlog: 28, change: -5 },
    { name: 'Orthopedics', backlog: 25, change: 4 },
    { name: 'Oncology', backlog: 21, change: 2 },
    { name: 'Pulmonology', backlog: 19, change: -2 },
  ];

  const demandForecastData = [
    { day: 'T-3', census: 78, forecast: 78 },
    { day: 'T-2', census: 82, forecast: 82 },
    { day: 'T-1', census: 85, forecast: 85 },
    { day: 'Today', census: 82, forecast: 82 },
    { day: 'T+1', census: null, forecast: 86, low: 82, high: 90 },
    { day: 'T+2', census: null, forecast: 92, low: 88, high: 96 },
    { day: 'T+3', census: null, forecast: 95, low: 90, high: 100 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#00D9FF] flex items-center gap-2">
            <span className="p-1.5 bg-[#A855F720] text-[#A855F7] rounded-lg"><Icons.Resource /></span>
            Encounter & Resourcing Intelligence
          </h1>
          <p className="text-gray-400 text-sm">Operational Alert Monitoring & Capacity Optimization</p>
        </div>
        <div className="flex space-x-3">
          <div className="px-4 py-2 bg-[#1E2936] rounded-lg border border-[#2D3A4B] text-xs flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-[#00D9FF] animate-pulse"></span>
             Live System Status • Updated 10:11 PM
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#1E2936] p-4 rounded-xl border border-[#2D3A4B] space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
           <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Facility</label>
              <select 
                className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 text-xs outline-none focus:border-[#00D9FF]"
                value={filters.hospital}
                onChange={e => setFilters(prev => ({ ...prev, hospital: e.target.value }))}
              >
                {HOSPITALS.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
           </div>
           <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Department</label>
              <select 
                className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 text-xs outline-none focus:border-[#00D9FF]"
                value={filters.department}
                onChange={e => setFilters(prev => ({ ...prev, department: e.target.value }))}
              >
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
           </div>
           <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Alert Type</label>
              <select 
                className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 text-xs outline-none focus:border-[#00D9FF]"
                value={filters.alertType}
                onChange={e => setFilters(prev => ({ ...prev, alertType: e.target.value }))}
              >
                <option value="All">All Alerts</option>
                {Object.values(AlertType).map(v => <option key={v} value={v}>{v}</option>)}
              </select>
           </div>
           <div className="space-y-1 lg:col-span-2">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Search</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><Icons.Search /></span>
                <input 
                  type="text" 
                  placeholder="Search patients, alerts, resources... (⌘K)"
                  className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 pl-10 text-xs outline-none focus:border-[#00D9FF]"
                  value={filters.search}
                  onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
           </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <OpsMetricCard 
          title="Active Operational Alerts" 
          value={stats.activeCount.toString()} 
          subtitle={`${stats.critical} Critical • 18 Staffing Gaps`}
          icon={<Icons.Resource />}
          color={COLORS.purple}
          sparkline
        />
        <OpsMetricCard 
          title="Capacity Utilization" 
          value={`${stats.utilization}%`} 
          subtitle="ICU: 94% 🔴 • ED: 88% 🟠"
          icon={<Icons.Gauge />}
          color={COLORS.high}
          gaugeValue={stats.utilization}
        />
        <OpsMetricCard 
          title="Urgent Visit Requirements" 
          value={stats.urgentVisits.toString()} 
          subtitle="12 require booking < 24 hrs"
          icon={<Icons.Alert />}
          color={COLORS.critical}
          urgent={stats.urgentVisits > 20}
        />
        <OpsMetricCard 
          title="Resource Bottlenecks" 
          value="Cardiology" 
          subtitle="Avg wait: 14.3 days • +23% load"
          icon={<Icons.Analytics />}
          color={COLORS.cyan}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWrapper title="Facility Utilization Heatmap" subtitle="Facilities × Departments occupancy intensity">
          <div className="h-full flex flex-col pt-2">
            <div className="flex-1 grid grid-cols-9 gap-1 mb-1">
              <div className="col-span-1"></div>
              {DEPARTMENTS.filter(d => d !== 'All Departments').map(d => (
                <div key={d} className="text-[8px] text-gray-500 font-bold uppercase truncate text-center">{d}</div>
              ))}
            </div>
            {heatmapData.map(row => (
              <div key={row.facility} className="grid grid-cols-9 gap-1 h-8 items-center">
                <div className="text-[9px] text-gray-400 font-bold truncate pr-2">{row.facility}</div>
                {DEPARTMENTS.filter(d => d !== 'All Departments').map(d => {
                  const val = row[d] as number;
                  const color = val > 90 ? COLORS.critical : val > 80 ? COLORS.high : val > 60 ? COLORS.moderate : COLORS.low;
                  return (
                    <div 
                      key={d} 
                      className="h-full rounded-sm opacity-80 hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center text-[8px] font-bold text-black"
                      style={{ backgroundColor: color }}
                      title={`${row.facility} - ${d}: ${val}%`}
                    >
                      {val}%
                    </div>
                  );
                })}
              </div>
            ))}
            <div className="mt-4 flex items-center justify-center gap-4">
               {[
                 { label: '0-60%', color: COLORS.low },
                 { label: '60-80%', color: COLORS.moderate },
                 { label: '80-90%', color: COLORS.high },
                 { label: '90%+', color: COLORS.critical }
               ].map(l => (
                 <div key={l.label} className="flex items-center gap-1.5 text-[9px] text-gray-500 font-bold uppercase">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: l.color }}></div>
                    {l.label}
                 </div>
               ))}
            </div>
          </div>
        </ChartWrapper>

        <ChartWrapper title="Alert Trends Over Time" subtitle="Volume of operational signals by type (18mo)">
           <ResponsiveContainer width="100%" height="100%">
              <LineChart data={alertTrendData}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" vertical={false} />
                 <XAxis dataKey="month" stroke="#6B7280" fontSize={10} />
                 <YAxis stroke="#6B7280" fontSize={10} />
                 <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }} />
                 <Line type="monotone" dataKey="total" stroke={COLORS.cyan} strokeWidth={3} name="Total Alerts" dot={{ r: 4 }} />
                 <Line type="monotone" dataKey="capacity" stroke={COLORS.high} strokeWidth={2} name="Capacity" dot={false} />
                 <Line type="monotone" dataKey="urgent" stroke={COLORS.critical} strokeWidth={2} name="Urgent" dot={false} />
                 <Line type="monotone" dataKey="staffing" stroke={COLORS.purple} strokeWidth={2} name="Staffing" dot={false} />
              </LineChart>
           </ResponsiveContainer>
        </ChartWrapper>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWrapper title="Appointment Backlog Distribution" subtitle="Top 10 specialties by referral volume">
           <ResponsiveContainer width="100%" height="100%">
              <BarChart data={backlogData} layout="vertical" margin={{ left: 20 }}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" horizontal={false} />
                 <XAxis type="number" hide />
                 <YAxis dataKey="name" type="category" stroke="#9CA3AF" fontSize={10} width={100} />
                 <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }} cursor={{ fill: '#252F3E' }} />
                 <Bar dataKey="backlog" radius={[0, 4, 4, 0]}>
                    {backlogData.map((d, i) => (
                       <Cell key={`cell-${i}`} fill={d.backlog > 30 ? COLORS.critical : COLORS.high} />
                    ))}
                 </Bar>
              </BarChart>
           </ResponsiveContainer>
        </ChartWrapper>

        <ChartWrapper title="Bed & Visit Demand Forecast" subtitle="Predictive census modeling with confidence bands">
           <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={demandForecastData}>
                 <defs>
                    <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor={COLORS.purple} stopOpacity={0.3}/>
                       <stop offset="95%" stopColor={COLORS.purple} stopOpacity={0}/>
                    </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" vertical={false} />
                 <XAxis dataKey="day" stroke="#6B7280" fontSize={10} />
                 <YAxis stroke="#6B7280" fontSize={10} domain={[60, 110]} />
                 <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }} />
                 <Area type="monotone" dataKey="forecast" stroke={COLORS.purple} strokeWidth={2} fill="url(#colorForecast)" name="Predicted Demand" />
                 <Line type="monotone" dataKey="census" stroke={COLORS.cyan} strokeWidth={3} name="Actual Census" />
                 <Area type="monotone" dataKey="high" stroke="transparent" fill={COLORS.purple} fillOpacity={0.1} />
              </AreaChart>
           </ResponsiveContainer>
        </ChartWrapper>
      </div>

      {/* Table */}
      <div className="bg-[#1E2936] rounded-xl border border-[#2D3A4B] overflow-hidden">
        <div className="p-5 border-b border-[#2D3A4B] bg-[#252F3E20] flex justify-between items-center">
           <h2 className="text-lg font-bold">Live Encounter & Resource Alerts</h2>
           <div className="flex gap-2">
             <button className="text-[10px] font-bold text-[#00D9FF] px-3 py-1.5 bg-[#00D9FF10] border border-[#00D9FF30] rounded uppercase">Export Ops PDF</button>
             <button className="text-[10px] font-bold text-white px-3 py-1.5 bg-[#A855F7] rounded uppercase shadow-lg shadow-purple-900/20">Bulk Triage</button>
           </div>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead>
                 <tr className="text-[10px] text-gray-500 border-b border-[#2D3A4B] uppercase tracking-widest font-bold">
                    <th className="px-6 py-4">Alert ID</th>
                    <th className="px-6 py-4">Patient</th>
                    <th className="px-6 py-4">Facility / Unit</th>
                    <th className="px-6 py-4">Alert Type</th>
                    <th className="px-6 py-4 text-center">Severity</th>
                    <th className="px-6 py-4">Time Sensitive</th>
                    <th className="px-6 py-4 text-right">Action</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-[#2D3A4B]">
                 {filteredAlerts.slice(0, 15).map(a => (
                   <tr key={a.id} className="hover:bg-[#252F3E] cursor-pointer group transition-colors" onClick={() => onSelectAlert(a.id)}>
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono text-[#A855F7] font-bold">{a.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold group-hover:text-[#00D9FF] transition-colors">{a.patientName}</p>
                        <p className="text-[10px] text-gray-500 font-mono">ID: {a.patientId}</p>
                      </td>
                      <td className="px-6 py-4">
                         <p className="text-xs font-bold text-white">{a.facility}</p>
                         <p className="text-[10px] text-gray-500">{a.department}</p>
                      </td>
                      <td className="px-6 py-4">
                         <p className="text-xs font-semibold">{a.type}</p>
                         <p className="text-[10px] text-gray-400 truncate max-w-[150px]">{a.resourceImpact}</p>
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
                         <div className="flex items-center gap-1.5">
                            <span className={`text-[10px] font-bold ${a.timeSensitive.includes('<24') ? 'text-red-400' : 'text-gray-400'}`}>{a.timeSensitive}</span>
                            <span className="text-[9px] text-gray-500 italic">({a.triggered})</span>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button className="text-[10px] font-bold text-[#00D9FF] bg-[#00D9FF10] border border-[#00D9FF30] px-3 py-1.5 rounded hover:bg-[#00D9FF] hover:text-[#0F1419] transition-all">
                            Resolve
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

const OpsMetricCard: React.FC<{ title: string; value: string; subtitle: string; icon: React.ReactNode; color: string; urgent?: boolean; sparkline?: boolean; gaugeValue?: number }> = 
({ title, value, subtitle, icon, color, urgent, sparkline, gaugeValue }) => (
  <div className={`bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-5 hover:border-[#A855F730] transition-colors relative overflow-hidden group ${urgent ? 'pulsing-red border-red-900/40' : ''}`}>
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
      <div className="p-2 bg-[#0F1419] rounded-lg group-hover:scale-110 transition-transform" style={{ color }}>{icon}</div>
    </div>
    <p className="text-[10px] text-gray-400">{subtitle}</p>
    {sparkline && (
      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#A855F7] to-transparent w-full opacity-30"></div>
    )}
    {gaugeValue !== undefined && (
      <div className="absolute bottom-0 left-0 w-full h-1 bg-[#0F1419]">
        <div className="h-full transition-all duration-1000" style={{ width: `${gaugeValue}%`, backgroundColor: color }}></div>
      </div>
    )}
  </div>
);

const ChartWrapper: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
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

export default EncounterView;
