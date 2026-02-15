
import React, { useMemo } from 'react';
import { FilterState, Patient, RiskLevel, ComplianceStatus, AbnormalResultStatus } from '../../types';
import { COLORS, Icons, HOSPITALS } from '../../constants';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, AreaChart, Area
} from 'recharts';

interface PopulationViewProps {
  patients: Patient[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onNavigate: (tab: string) => void;
}

const PopulationView: React.FC<PopulationViewProps> = ({ patients, filters, setFilters, onNavigate }) => {
  const stats = useMemo(() => {
    const total = patients.length;
    const critical = patients.filter(p => p.riskLevel === RiskLevel.CRITICAL).length;
    const high = patients.filter(p => p.riskLevel === RiskLevel.HIGH).length;
    const avgRisk = total ? (patients.reduce((s, p) => s + p.riskScore, 0) / total).toFixed(1) : '0';
    const totalGaps = patients.reduce((s, p) => s + p.activeGaps.length, 0);
    const totalSafety = patients.reduce((s, p) => s + p.safetyAlerts.length, 0);
    const totalAbnormal = patients.reduce((s, p) => s + p.abnormalResults.length, 0);
    const totalBehavioral = patients.reduce((s, p) => s + p.behavioralAnomalies.length, 0);
    const avgAdherence = total ? (patients.reduce((s, p) => s + p.medicationAdherence, 0) / total).toFixed(1) : '0';
    const avgEngagement = total ? (patients.reduce((s, p) => s + p.engagementScore, 0) / total).toFixed(0) : '0';
    const withTransitions = patients.filter(p => p.transitions.length > 0).length;
    const enrolledPrograms = patients.filter(p => p.carePrograms.length > 0).length;
    const compliantCount = patients.reduce((s, p) => s + p.guidelineAdherence.filter(g => g.status === ComplianceStatus.COMPLIANT).length, 0);
    const totalGuidelines = patients.reduce((s, p) => s + p.guidelineAdherence.length, 0);
    const complianceRate = totalGuidelines ? ((compliantCount / totalGuidelines) * 100).toFixed(1) : '0';
    const criticalAbnormal = patients.reduce((s, p) => s + p.abnormalResults.filter(r => r.severity === RiskLevel.CRITICAL).length, 0);
    const criticalSafety = patients.reduce((s, p) => s + p.safetyAlerts.filter(a => a.severity === RiskLevel.CRITICAL).length, 0);

    return {
      total, critical, high, avgRisk, totalGaps, totalSafety, totalAbnormal, totalBehavioral,
      avgAdherence, avgEngagement, withTransitions, enrolledPrograms, complianceRate,
      criticalAbnormal, criticalSafety
    };
  }, [patients]);

  const riskDistribution = useMemo(() => [
    { name: 'Critical', value: patients.filter(p => p.riskLevel === RiskLevel.CRITICAL).length, color: COLORS.critical },
    { name: 'High', value: patients.filter(p => p.riskLevel === RiskLevel.HIGH).length, color: COLORS.high },
    { name: 'Moderate', value: patients.filter(p => p.riskLevel === RiskLevel.MODERATE).length, color: COLORS.moderate },
    { name: 'Low', value: patients.filter(p => p.riskLevel === RiskLevel.LOW).length, color: COLORS.low },
  ].filter(v => v.value > 0), [patients]);

  const solutionMetrics = useMemo(() => [
    { name: 'Care Gaps', value: stats.totalGaps, color: COLORS.high, tab: 'caregaps' },
    { name: 'Safety Alerts', value: stats.totalSafety, color: COLORS.critical, tab: 'safety' },
    { name: 'Abnormal Results', value: stats.totalAbnormal, color: COLORS.moderate, tab: 'abnormal' },
    { name: 'Behavioral Flags', value: stats.totalBehavioral, color: COLORS.cyan, tab: 'behavioral' },
    { name: 'Guideline Issues', value: patients.reduce((s, p) => s + p.guidelineAdherence.filter(g => g.status !== ComplianceStatus.COMPLIANT).length, 0), color: COLORS.purple, tab: 'guidelines' },
  ], [patients, stats]);

  const trendData = [
    { month: 'Sep', risk: 5.8, gaps: 650, safety: 200, behavioral: 160 },
    { month: 'Oct', risk: 6.0, gaps: 680, safety: 215, behavioral: 180 },
    { month: 'Nov', risk: 6.2, gaps: 710, safety: 240, behavioral: 200 },
    { month: 'Dec', risk: 6.1, gaps: 690, safety: 225, behavioral: 190 },
    { month: 'Jan', risk: 6.3, gaps: 720, safety: 235, behavioral: 210 },
    { month: 'Feb', risk: parseFloat(stats.avgRisk), gaps: stats.totalGaps, safety: stats.totalSafety, behavioral: stats.totalBehavioral },
  ];

  const ageDistribution = useMemo(() => {
    const buckets = [
      { range: '18-30', count: 0 }, { range: '31-45', count: 0 },
      { range: '46-60', count: 0 }, { range: '61-75', count: 0 }, { range: '76+', count: 0 }
    ];
    patients.forEach(p => {
      if (p.age <= 30) buckets[0].count++;
      else if (p.age <= 45) buckets[1].count++;
      else if (p.age <= 60) buckets[2].count++;
      else if (p.age <= 75) buckets[3].count++;
      else buckets[4].count++;
    });
    return buckets;
  }, [patients]);

  const conditionFrequency = useMemo(() => {
    const counts: Record<string, number> = {};
    patients.forEach(p => p.primaryConditions.forEach(c => { counts[c] = (counts[c] || 0) + 1; }));
    return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 8);
  }, [patients]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#00D9FF] flex items-center gap-2">
            <Icons.Users /> Population Health Intelligence
          </h1>
          <p className="text-gray-400 text-sm">Unified overview of all clinical intelligence layers across {stats.total} patients</p>
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
            Real-time Population Monitor
          </div>
        </div>
      </div>

      {/* Top Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <PopMetric title="Total Population" value={stats.total.toString()} color={COLORS.cyan} />
        <PopMetric title="Critical / High Risk" value={`${stats.critical + stats.high}`} color={COLORS.critical} subtitle={`${((stats.critical + stats.high) / stats.total * 100).toFixed(1)}%`} />
        <PopMetric title="Avg Risk Score" value={`${stats.avgRisk}/10`} color={COLORS.high} />
        <PopMetric title="Avg Medication Adherence" value={`${stats.avgAdherence}%`} color={COLORS.moderate} />
        <PopMetric title="Guideline Compliance" value={`${stats.complianceRate}%`} color={COLORS.low} />
        <PopMetric title="Avg Engagement" value={`${stats.avgEngagement}/100`} color={COLORS.purple} />
      </div>

      {/* Solution Alerts Row */}
      <div className="bg-[#1E2936] rounded-xl border border-[#2D3A4B] p-5">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Cross-Solution Alert Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {solutionMetrics.map(m => (
            <button key={m.name} onClick={() => onNavigate(m.tab)} className="bg-[#0F1419] border border-[#2D3A4B] rounded-lg p-4 hover:border-[#00D9FF30] transition-colors text-left group">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{m.name}</p>
              <p className="text-2xl font-bold mt-1" style={{ color: m.color }}>{m.value}</p>
              <p className="text-[10px] text-gray-500 mt-1 group-hover:text-[#00D9FF] transition-colors">View Details &rarr;</p>
            </button>
          ))}
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PopChartContainer title="Risk Distribution" subtitle="Patient stratification across risk levels">
          <div className="flex h-full items-center">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskDistribution} innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                    {riskDistribution.map((d, i) => <Cell key={`cell-${i}`} fill={d.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: 'none', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-[25%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold">Patients</p>
              </div>
            </div>
            <div className="w-1/2 space-y-2 pr-4">
              {riskDistribution.map(d => (
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
        </PopChartContainer>

        <PopChartContainer title="Population Trends" subtitle="Key metrics evolution over 6 months">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" vertical={false} />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={10} />
              <YAxis stroke="#6B7280" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }} />
              <Line type="monotone" dataKey="gaps" stroke={COLORS.high} strokeWidth={2} name="Care Gaps" />
              <Line type="monotone" dataKey="safety" stroke={COLORS.critical} strokeWidth={2} name="Safety Alerts" />
              <Line type="monotone" dataKey="behavioral" stroke={COLORS.cyan} strokeWidth={2} name="Behavioral Flags" />
            </LineChart>
          </ResponsiveContainer>
        </PopChartContainer>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PopChartContainer title="Age Distribution" subtitle="Population breakdown by age group">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ageDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" vertical={false} />
              <XAxis dataKey="range" stroke="#6B7280" fontSize={10} />
              <YAxis stroke="#6B7280" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }} cursor={{ fill: '#252F3E' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {ageDistribution.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={[COLORS.low, COLORS.cyan, COLORS.moderate, COLORS.high, COLORS.critical][i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </PopChartContainer>

        <PopChartContainer title="Top Conditions" subtitle="Most prevalent conditions across population">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={conditionFrequency} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" stroke="#9CA3AF" fontSize={10} width={120} />
              <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }} cursor={{ fill: '#252F3E' }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {conditionFrequency.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={i < 2 ? COLORS.critical : i < 4 ? COLORS.high : COLORS.cyan} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </PopChartContainer>
      </div>

      {/* Critical Alerts Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AlertSummaryCard
          title="Critical Safety Alerts"
          value={stats.criticalSafety}
          description="Require immediate pharmacist review"
          color={COLORS.critical}
          icon={<Icons.Shield />}
          onClick={() => onNavigate('safety')}
        />
        <AlertSummaryCard
          title="Critical Abnormal Results"
          value={stats.criticalAbnormal}
          description="Life-threatening findings detected"
          color={COLORS.high}
          icon={<Icons.Bell />}
          onClick={() => onNavigate('abnormal')}
        />
        <AlertSummaryCard
          title="Active Care Transitions"
          value={stats.withTransitions}
          description="Patients in transition of care"
          color={COLORS.moderate}
          icon={<Icons.Continuity />}
          onClick={() => onNavigate('continuity')}
        />
        <AlertSummaryCard
          title="Program Enrolled"
          value={stats.enrolledPrograms}
          description="Patients in structured programs"
          color={COLORS.low}
          icon={<Icons.Program />}
          onClick={() => onNavigate('program')}
        />
      </div>

      {/* High Risk Patient Preview */}
      <div className="bg-[#1E2936] rounded-xl border border-[#2D3A4B] overflow-hidden">
        <div className="p-5 border-b border-[#2D3A4B] bg-[#252F3E20] flex justify-between items-center">
          <h2 className="text-lg font-bold">Critical & High Risk Patient Overview</h2>
          <button onClick={() => onNavigate('dashboard')} className="text-[10px] font-bold text-[#00D9FF] px-3 py-1.5 bg-[#00D9FF10] border border-[#00D9FF30] rounded uppercase">View Full Risk Stratification</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-gray-500 border-b border-[#2D3A4B] uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4 text-center">Risk</th>
                <th className="px-6 py-4 text-center">Score</th>
                <th className="px-6 py-4 text-center">Gaps</th>
                <th className="px-6 py-4 text-center">Safety</th>
                <th className="px-6 py-4 text-center">Abnormal</th>
                <th className="px-6 py-4 text-center">Behavioral</th>
                <th className="px-6 py-4 text-center">Adherence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D3A4B]">
              {patients
                .filter(p => p.riskLevel === RiskLevel.CRITICAL || p.riskLevel === RiskLevel.HIGH)
                .slice(0, 10)
                .map(p => (
                  <tr key={p.id} className="hover:bg-[#252F3E] transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold">{p.name}</p>
                      <p className="text-[10px] text-gray-500 font-mono">{p.id} &bull; {p.age}y</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase
                        ${p.riskLevel === RiskLevel.CRITICAL ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-500'}
                      `}>{p.riskLevel}</span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-mono font-bold">{p.riskScore}/10</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs font-bold ${p.activeGaps.length > 2 ? 'text-red-400' : 'text-gray-400'}`}>{p.activeGaps.length}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs font-bold ${p.safetyAlerts.length > 2 ? 'text-red-400' : 'text-gray-400'}`}>{p.safetyAlerts.length}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs font-bold ${p.abnormalResults.length > 2 ? 'text-red-400' : 'text-gray-400'}`}>{p.abnormalResults.length}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs font-bold ${p.behavioralAnomalies.length > 1 ? 'text-red-400' : 'text-gray-400'}`}>{p.behavioralAnomalies.length}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className={`text-xs font-bold ${p.medicationAdherence < 60 ? 'text-red-400' : p.medicationAdherence < 80 ? 'text-yellow-400' : 'text-green-400'}`}>{p.medicationAdherence}%</span>
                        <div className="w-12 h-1 bg-[#0F1419] rounded-full mt-1">
                          <div className={`h-full rounded-full ${p.medicationAdherence < 60 ? 'bg-red-500' : p.medicationAdherence < 80 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${p.medicationAdherence}%` }}></div>
                        </div>
                      </div>
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

const PopMetric: React.FC<{ title: string; value: string; color: string; subtitle?: string }> = ({ title, value, color, subtitle }) => (
  <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-4 hover:border-[#00D9FF30] transition-colors">
    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{title}</p>
    <p className="text-2xl font-bold mt-1" style={{ color }}>{value}</p>
    {subtitle && <p className="text-[10px] text-gray-400 mt-1">{subtitle}</p>}
  </div>
);

const PopChartContainer: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
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

const AlertSummaryCard: React.FC<{ title: string; value: number; description: string; color: string; icon: React.ReactNode; onClick: () => void }> = ({ title, value, description, color, icon, onClick }) => (
  <button onClick={onClick} className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-5 hover:border-[#00D9FF30] transition-colors text-left group w-full">
    <div className="flex justify-between items-start mb-3">
      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{title}</p>
      <div className="p-2 bg-[#0F1419] rounded-lg" style={{ color }}>{icon}</div>
    </div>
    <p className="text-3xl font-bold" style={{ color }}>{value}</p>
    <p className="text-[10px] text-gray-400 mt-2 group-hover:text-[#00D9FF] transition-colors">{description} &rarr;</p>
  </button>
);

export default PopulationView;
