
import React, { useMemo } from 'react';
import { FilterState, Patient, ReferralStatus, ReferralUrgency, AuthStatus, Referral } from '../../types';
import { COLORS, Icons, HOSPITALS, SPECIALTIES, generateMockReferrals } from '../../constants';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, BarChart, Bar
} from 'recharts';

interface ReferralViewProps {
  patients: Patient[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onSelectReferral: (id: string) => void;
}

const ReferralView: React.FC<ReferralViewProps> = ({ patients, filters, setFilters, onSelectReferral }) => {
  const referrals = useMemo(() => generateMockReferrals(1284), []);

  const filteredReferrals = useMemo(() => {
    return referrals.filter(r => {
      if (filters.hospital !== 'All Hospitals' && r.receivingFacility !== filters.hospital) return false;
      if (filters.referralStatus !== 'All' && r.status !== filters.referralStatus) return false;
      if (filters.referralUrgency !== 'All' && r.urgency !== filters.referralUrgency) return false;
      if (filters.referralSpecialty !== 'All Specialties' && r.specialty !== filters.referralSpecialty) return false;
      if (filters.search && !r.patientName.toLowerCase().includes(filters.search.toLowerCase()) && !r.id.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [referrals, filters]);

  const stats = useMemo(() => {
    const total = filteredReferrals.length;
    const pendingAuth = filteredReferrals.filter(r => r.authStatus === AuthStatus.PENDING).length;
    const urgent = filteredReferrals.filter(r => r.urgency === ReferralUrgency.URGENT || r.urgency === ReferralUrgency.STAT).length;
    const completed = filteredReferrals.filter(r => r.status === ReferralStatus.COMPLETED).length;
    const completionRate = total ? Math.round((completed / total) * 100) : 0;

    return { total, pendingAuth, urgent, completionRate };
  }, [filteredReferrals]);

  const statusDistribution = [
    { name: 'Pending', value: 24, color: COLORS.high },
    { name: 'Authorized', value: 32, color: COLORS.cyan },
    { name: 'Scheduled', value: 21, color: COLORS.blue },
    { name: 'Completed', value: 15, color: COLORS.low },
    { name: 'Denied', value: 5, color: COLORS.critical },
    { name: 'Expired', value: 3, color: '#6B7280' },
  ];

  const trendData = [
    { month: 'Sep', created: 320, auth: 280, sched: 240, compl: 210 },
    { month: 'Oct', created: 350, auth: 310, sched: 270, compl: 235 },
    { month: 'Nov', created: 410, auth: 360, sched: 320, compl: 280 },
    { month: 'Dec', created: 380, auth: 330, sched: 290, compl: 250 },
    { month: 'Jan', created: 430, auth: 380, sched: 340, compl: 300 },
    { month: 'Feb', created: 450, auth: 395, sched: 355, compl: 312 },
  ];

  const specialtyDemand = [
    { name: 'Cardiology', count: 242 },
    { name: 'Endocrinology', count: 198 },
    { name: 'Oncology', count: 167 },
    { name: 'Neurology', count: 143 },
    { name: 'Nephrology', count: 121 },
    { name: 'Pulmonology', count: 94 },
    { name: 'Surgery', count: 88 },
    { name: 'Behavioral Health', count: 72 },
    { name: 'Gastro', count: 69 },
    { name: 'Ortho', count: 54 },
  ];

  const agingData = [
    { range: '0-2d', count: 320 },
    { range: '3-5d', count: 280 },
    { range: '6-10d', count: 210 },
    { range: '11-20d', count: 150 },
    { range: '21-30d', count: 90 },
    { range: '30d+', count: 45 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#00D9FF] flex items-center gap-2">
            <Icons.Referral /> Referral & Care Coordination Analytics
          </h1>
          <p className="text-gray-400 text-sm">Optimizing specialist access and authorization lifecycles</p>
        </div>
        <div className="flex space-x-3">
          <div className="px-4 py-2 bg-[#1E2936] rounded-lg border border-[#2D3A4B] text-xs flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-[#00D9FF] animate-pulse"></span>
             Live Coordination Pipeline • Updated 10:11 PM
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#1E2936] p-4 rounded-xl border border-[#2D3A4B] space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
           <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Hospital</label>
              <select 
                className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 text-xs outline-none focus:border-[#00D9FF]"
                value={filters.hospital}
                onChange={e => setFilters(prev => ({ ...prev, hospital: e.target.value }))}
              >
                {HOSPITALS.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
           </div>
           <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Status</label>
              <select 
                className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 text-xs outline-none focus:border-[#00D9FF]"
                value={filters.referralStatus}
                onChange={e => setFilters(prev => ({ ...prev, referralStatus: e.target.value }))}
              >
                <option value="All">All Statuses</option>
                {Object.values(ReferralStatus).map(v => <option key={v} value={v}>{v}</option>)}
              </select>
           </div>
           <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Urgency</label>
              <select 
                className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded px-3 py-1.5 text-xs outline-none focus:border-[#00D9FF]"
                value={filters.referralUrgency}
                onChange={e => setFilters(prev => ({ ...prev, referralUrgency: e.target.value }))}
              >
                <option value="All">All Urgency</option>
                {Object.values(ReferralUrgency).map(v => <option key={v} value={v}>{v}</option>)}
              </select>
           </div>
           <div className="space-y-1 lg:col-span-2">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Search</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><Icons.Search /></span>
                <input 
                  type="text" 
                  placeholder="Search patients, referral IDs, specialists... (⌘K)"
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
        <ReferralMetricCard 
          title="Total Active Referrals" 
          value={stats.total.toLocaleString()} 
          subtitle="Open referrals in coordination pipeline"
          icon={<Icons.Referral />}
          color={COLORS.cyan}
          sparkline
        />
        <ReferralMetricCard 
          title="Pending Authorization" 
          value={stats.pendingAuth.toString()} 
          subtitle="Avg processing time: 3.2 days"
          icon={<Icons.Analytics />}
          color={COLORS.high}
          bg="bg-gradient-to-br from-[#FF8C0015] to-transparent"
        />
        <ReferralMetricCard 
          title="Urgent Referrals (24-72h)" 
          value={stats.urgent.toString()} 
          subtitle="12 overdue • Escalation active"
          icon={<Icons.Alert />}
          color={COLORS.critical}
          urgent={stats.urgent > 50}
        />
        <ReferralMetricCard 
          title="Referral Completion Rate" 
          value={`${stats.completionRate}%`} 
          subtitle="Target: 85% • ↓ 4% from Q3"
          icon={<Icons.Check />}
          color={COLORS.low}
          gaugeValue={stats.completionRate}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CoordChartWrapper title="Referral Status Distribution" subtitle="Composition of active referral lifecycle stages">
          <div className="h-full flex items-center">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusDistribution} innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                    {statusDistribution.map((d, i) => (
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
              {statusDistribution.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                    <span>{d.name}</span>
                  </div>
                  <span className="font-bold text-white">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </CoordChartWrapper>

        <CoordChartWrapper title="Referral Lifecycle Timeline" subtitle="Created vs Authorized vs Completed (18mo)">
           <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" vertical={false} />
                 <XAxis dataKey="month" stroke="#6B7280" fontSize={10} />
                 <YAxis stroke="#6B7280" fontSize={10} />
                 <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }} />
                 <Line type="monotone" dataKey="created" stroke={COLORS.cyan} strokeWidth={2} name="Created" dot={false} />
                 <Line type="monotone" dataKey="auth" stroke={COLORS.high} strokeWidth={2} name="Authorized" dot={false} />
                 <Line type="monotone" dataKey="sched" stroke={COLORS.blue} strokeWidth={2} name="Scheduled" dot={false} />
                 <Line type="monotone" dataKey="compl" stroke={COLORS.low} strokeWidth={2} name="Completed" dot={false} />
              </LineChart>
           </ResponsiveContainer>
        </CoordChartWrapper>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CoordChartWrapper title="Top 10 Specialist Demand" subtitle="Highest referral volumes by specialty">
           <ResponsiveContainer width="100%" height="100%">
              <BarChart data={specialtyDemand} layout="vertical" margin={{ left: 20 }}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" horizontal={false} />
                 <XAxis type="number" hide />
                 <YAxis dataKey="name" type="category" stroke="#9CA3AF" fontSize={10} width={100} />
                 <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }} cursor={{ fill: '#252F3E' }} />
                 <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {specialtyDemand.map((d, i) => (
                       <Cell key={`cell-${i}`} fill={d.count > 150 ? COLORS.critical : COLORS.cyan} />
                    ))}
                 </Bar>
              </BarChart>
           </ResponsiveContainer>
        </CoordChartWrapper>

        <CoordChartWrapper title="Referral Aging Distribution" subtitle="Pipeline volume by days since creation">
           <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agingData}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" vertical={false} />
                 <XAxis dataKey="range" stroke="#6B7280" fontSize={10} />
                 <YAxis stroke="#6B7280" fontSize={10} />
                 <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }} cursor={{ fill: '#252F3E' }} />
                 <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {agingData.map((d, i) => (
                       <Cell key={`cell-${i}`} fill={i < 2 ? COLORS.low : i < 4 ? COLORS.high : COLORS.critical} />
                    ))}
                 </Bar>
              </BarChart>
           </ResponsiveContainer>
        </CoordChartWrapper>
      </div>

      {/* Table Section */}
      <div className="bg-[#1E2936] rounded-xl border border-[#2D3A4B] overflow-hidden">
        <div className="p-5 border-b border-[#2D3A4B] bg-[#252F3E20] flex justify-between items-center">
           <h2 className="text-lg font-bold">Active Referral Coordination</h2>
           <div className="flex gap-2">
             <button className="px-3 py-1.5 border border-[#2D3A4B] rounded text-[10px] font-bold uppercase hover:bg-[#252F3E]">Export CSV</button>
             <button className="px-3 py-1.5 bg-[#00D9FF10] border border-[#00D9FF30] text-[#00D9FF] rounded text-[10px] font-bold uppercase">Escalate Bulk</button>
           </div>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead>
                 <tr className="text-[10px] text-gray-500 border-b border-[#2D3A4B] uppercase tracking-widest font-bold">
                    <th className="px-6 py-4">Referral ID</th>
                    <th className="px-6 py-4">Patient</th>
                    <th className="px-6 py-4">Specialty / Provider</th>
                    <th className="px-6 py-4 text-center">Urgency</th>
                    <th className="px-6 py-4">Status / Auth</th>
                    <th className="px-6 py-4 text-center">Days Open</th>
                    <th className="px-6 py-4 text-right">Action</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-[#2D3A4B]">
                 {filteredReferrals.slice(0, 15).map(r => (
                   <tr key={r.id} className="hover:bg-[#252F3E] cursor-pointer group transition-colors" onClick={() => onSelectReferral(r.id)}>
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono text-[#00D9FF] font-bold">{r.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold group-hover:text-[#00D9FF] transition-colors">{r.patientName}</p>
                        <p className="text-[10px] text-gray-500 font-mono">ID: {r.patientId} • {r.patientAge}y</p>
                      </td>
                      <td className="px-6 py-4">
                         <p className="text-xs font-bold text-white">{r.specialty}</p>
                         <p className="text-[10px] text-gray-500">{r.referringProvider}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase
                           ${r.urgency === ReferralUrgency.STAT ? 'bg-red-500/20 text-red-500 pulsing-red' : ''}
                           ${r.urgency === ReferralUrgency.URGENT ? 'bg-orange-500/20 text-orange-500' : ''}
                           ${r.urgency === ReferralUrgency.PRIORITY ? 'bg-yellow-500/20 text-yellow-500' : ''}
                           ${r.urgency === ReferralUrgency.ROUTINE ? 'bg-green-500/20 text-green-500' : ''}
                         `}>{r.urgency}</span>
                      </td>
                      <td className="px-6 py-4">
                         <p className="text-xs font-semibold">{r.status}</p>
                         <p className="text-[9px] text-gray-500 font-bold uppercase">Auth: {r.authStatus}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <span className={`text-xs font-mono font-bold
                           ${r.daysOpen > 20 ? 'text-red-500' : r.daysOpen > 10 ? 'text-orange-500' : 'text-green-500'}
                         `}>{r.daysOpen}d</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button className="text-[10px] font-bold text-[#00D9FF] bg-[#00D9FF10] border border-[#00D9FF30] px-3 py-1.5 rounded hover:bg-[#00D9FF] hover:text-[#0F1419] transition-all">
                            Coordinate
                         </button>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>

      {/* Intelligence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
         <CoordInsight title="Bottleneck Detected" content="Insurance Authorization Delays" metric="112 delayed >5d" color={COLORS.critical} />
         <CoordInsight title="High-Risk Transfer" content="ICU / Oncology Coordination" metric="28 complex pending" color={COLORS.high} />
         <CoordInsight title="Capacity Alert" content="Neurology Utilization at 92%" metric="Wait time +18%" color={COLORS.moderate} />
         <CoordInsight title="Communication Gap" content="Facility Confirmations Missing" metric="17 referrals pending" color={COLORS.cyan} />
         <CoordInsight title="Auth Expiration" content="Approvals Expiring < 72h" metric="21 cases at risk" color={COLORS.high} />
      </div>
    </div>
  );
};

const ReferralMetricCard: React.FC<{ title: string; value: string; subtitle: string; icon: React.ReactNode; color: string; urgent?: boolean; sparkline?: boolean; gaugeValue?: number; bg?: string }> = 
({ title, value, subtitle, icon, color, urgent, sparkline, gaugeValue, bg = 'bg-[#1E2936]' }) => (
  <div className={`${bg} border border-[#2D3A4B] rounded-xl p-5 hover:border-[#00D9FF30] transition-colors relative overflow-hidden group ${urgent ? 'pulsing-red border-red-900/40' : ''}`}>
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
    {gaugeValue !== undefined && (
      <div className="absolute bottom-0 left-0 w-full h-1 bg-[#0F1419]">
        <div className="h-full transition-all duration-1000" style={{ width: `${gaugeValue}%`, backgroundColor: color }}></div>
      </div>
    )}
  </div>
);

const CoordChartWrapper: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
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

const CoordInsight: React.FC<{ title: string; content: string; metric: string; color: string }> = ({ title, content, metric, color }) => (
  <div className="bg-[#1E2936] border border-[#2D3A4B] p-4 rounded-xl flex flex-col justify-between group hover:border-gray-500 transition-colors">
     <div>
        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">{title}</p>
        <p className="text-xs font-bold text-white mt-1 group-hover:text-[#00D9FF] transition-colors">{content}</p>
     </div>
     <div className="mt-3 flex items-center justify-between">
        <span className="text-[10px] font-mono font-bold" style={{ color }}>{metric}</span>
        <button className="text-[10px] text-gray-500 hover:text-white"><Icons.Referral /></button>
     </div>
  </div>
);

export default ReferralView;
