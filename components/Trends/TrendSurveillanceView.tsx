
import React, { useMemo } from 'react';
import { FilterState, Patient, RiskLevel, ComplianceStatus } from '../../types';
import { COLORS, Icons, HOSPITALS } from '../../constants';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, BarChart, Bar, Cell
} from 'recharts';

interface TrendSurveillanceViewProps {
  patients: Patient[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

const TrendSurveillanceView: React.FC<TrendSurveillanceViewProps> = ({ patients, filters, setFilters }) => {
  const stats = useMemo(() => {
    const total = patients.length;
    const avgRisk = total ? (patients.reduce((s, p) => s + p.riskScore, 0) / total) : 0;
    const avgAdherence = total ? (patients.reduce((s, p) => s + p.medicationAdherence, 0) / total) : 0;
    const avgEngagement = total ? (patients.reduce((s, p) => s + p.engagementScore, 0) / total) : 0;
    const totalGaps = patients.reduce((s, p) => s + p.activeGaps.length, 0);
    const totalSafety = patients.reduce((s, p) => s + p.safetyAlerts.length, 0);

    return {
      total, avgRisk: avgRisk.toFixed(1), avgAdherence: avgAdherence.toFixed(1),
      avgEngagement: avgEngagement.toFixed(0), totalGaps, totalSafety
    };
  }, [patients]);

  const riskTrend = [
    { month: 'Jul', avg: 5.4, critical: 48, high: 72 },
    { month: 'Aug', avg: 5.6, critical: 52, high: 75 },
    { month: 'Sep', avg: 5.8, critical: 55, high: 78 },
    { month: 'Oct', avg: 6.0, critical: 58, high: 82 },
    { month: 'Nov', avg: 6.2, critical: 62, high: 88 },
    { month: 'Dec', avg: 6.1, critical: 60, high: 85 },
    { month: 'Jan', avg: 6.3, critical: 63, high: 90 },
    { month: 'Feb', avg: parseFloat(stats.avgRisk), critical: patients.filter(p => p.riskLevel === RiskLevel.CRITICAL).length, high: patients.filter(p => p.riskLevel === RiskLevel.HIGH).length },
  ];

  const adherenceTrend = [
    { month: 'Jul', medication: 72.1, engagement: 68, compliance: 78 },
    { month: 'Aug', medication: 71.5, engagement: 66, compliance: 77 },
    { month: 'Sep', medication: 70.8, engagement: 65, compliance: 76 },
    { month: 'Oct', medication: 69.2, engagement: 63, compliance: 74 },
    { month: 'Nov', medication: 68.5, engagement: 62, compliance: 73 },
    { month: 'Dec', medication: 69.1, engagement: 64, compliance: 75 },
    { month: 'Jan', medication: 68.8, engagement: 63, compliance: 74 },
    { month: 'Feb', medication: parseFloat(stats.avgAdherence), engagement: parseInt(stats.avgEngagement), compliance: 75 },
  ];

  const gapEvolution = [
    { month: 'Jul', vaccine: 80, preventive: 120, diagnostic: 90, treatment: 60, monitoring: 50 },
    { month: 'Aug', vaccine: 85, preventive: 125, diagnostic: 95, treatment: 65, monitoring: 55 },
    { month: 'Sep', vaccine: 90, preventive: 130, diagnostic: 100, treatment: 70, monitoring: 58 },
    { month: 'Oct', vaccine: 95, preventive: 140, diagnostic: 105, treatment: 72, monitoring: 62 },
    { month: 'Nov', vaccine: 100, preventive: 145, diagnostic: 110, treatment: 75, monitoring: 65 },
    { month: 'Dec', vaccine: 95, preventive: 140, diagnostic: 105, treatment: 72, monitoring: 60 },
    { month: 'Jan', vaccine: 105, preventive: 150, diagnostic: 115, treatment: 78, monitoring: 68 },
    { month: 'Feb', vaccine: 110, preventive: 155, diagnostic: 118, treatment: 80, monitoring: 70 },
  ];

  const safetyTrend = [
    { month: 'Jul', contraindication: 15, drugInteraction: 25, allergy: 10, dosage: 20 },
    { month: 'Aug', contraindication: 18, drugInteraction: 28, allergy: 12, dosage: 22 },
    { month: 'Sep', contraindication: 20, drugInteraction: 30, allergy: 14, dosage: 25 },
    { month: 'Oct', contraindication: 22, drugInteraction: 35, allergy: 16, dosage: 28 },
    { month: 'Nov', contraindication: 25, drugInteraction: 38, allergy: 18, dosage: 30 },
    { month: 'Dec', contraindication: 23, drugInteraction: 35, allergy: 15, dosage: 28 },
    { month: 'Jan', contraindication: 26, drugInteraction: 40, allergy: 19, dosage: 32 },
    { month: 'Feb', contraindication: 28, drugInteraction: 42, allergy: 20, dosage: 34 },
  ];

  const conditionRiskTrend = useMemo(() => {
    const conditions = ['Heart Failure', 'CKD Stage 4', 'Diabetes Type 2', 'COPD', 'Hypertension'];
    return conditions.map(c => {
      const pts = patients.filter(p => p.primaryConditions.includes(c));
      const avg = pts.length ? pts.reduce((s, p) => s + p.riskScore, 0) / pts.length : 0;
      return { name: c, avgRisk: parseFloat(avg.toFixed(1)), count: pts.length };
    }).sort((a, b) => b.avgRisk - a.avgRisk);
  }, [patients]);

  const predictiveData = [
    { day: 'T-7', actual: 58, predicted: 58 },
    { day: 'T-6', actual: 60, predicted: 59 },
    { day: 'T-5', actual: 62, predicted: 61 },
    { day: 'T-4', actual: 61, predicted: 62 },
    { day: 'T-3', actual: 64, predicted: 63 },
    { day: 'T-2', actual: 63, predicted: 64 },
    { day: 'T-1', actual: 65, predicted: 65 },
    { day: 'Today', actual: 66, predicted: 66 },
    { day: 'T+1', actual: null, predicted: 68 },
    { day: 'T+2', actual: null, predicted: 71 },
    { day: 'T+3', actual: null, predicted: 73 },
    { day: 'T+4', actual: null, predicted: 76 },
    { day: 'T+5', actual: null, predicted: 78 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#00D9FF] flex items-center gap-2">
            <Icons.Chart /> Trend Surveillance Intelligence
          </h1>
          <p className="text-gray-400 text-sm">Longitudinal trend analysis across all population health dimensions</p>
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
            Surveillance Active &bull; 8-month window
          </div>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <TrendKPI title="Population" value={stats.total.toString()} trend="+2.3%" trendUp={true} />
        <TrendKPI title="Avg Risk Score" value={stats.avgRisk} trend="+0.4" trendUp={true} negative />
        <TrendKPI title="Med Adherence" value={`${stats.avgAdherence}%`} trend="-1.8%" trendUp={false} negative />
        <TrendKPI title="Engagement" value={`${stats.avgEngagement}/100`} trend="-3.2%" trendUp={false} negative />
        <TrendKPI title="Active Gaps" value={stats.totalGaps.toString()} trend="+12%" trendUp={true} negative />
        <TrendKPI title="Safety Alerts" value={stats.totalSafety.toString()} trend="+8%" trendUp={true} negative />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChartContainer title="Risk Score Trend" subtitle="Average and high-risk population over 8 months">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={riskTrend}>
              <defs>
                <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.critical} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.critical} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" vertical={false} />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={10} />
              <YAxis stroke="#6B7280" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }} />
              <Area type="monotone" dataKey="critical" stroke={COLORS.critical} fill="url(#riskGrad)" strokeWidth={2} name="Critical Count" />
              <Line type="monotone" dataKey="high" stroke={COLORS.high} strokeWidth={2} name="High Count" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </TrendChartContainer>

        <TrendChartContainer title="Adherence & Engagement Trends" subtitle="Medication adherence, engagement, and compliance">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={adherenceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" vertical={false} />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={10} />
              <YAxis stroke="#6B7280" fontSize={10} domain={[50, 90]} />
              <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }} />
              <Line type="monotone" dataKey="medication" stroke={COLORS.cyan} strokeWidth={3} name="Medication Adherence %" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="engagement" stroke={COLORS.purple} strokeWidth={2} name="Engagement Score" dot={false} />
              <Line type="monotone" dataKey="compliance" stroke={COLORS.low} strokeWidth={2} name="Guideline Compliance %" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </TrendChartContainer>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChartContainer title="Care Gap Evolution by Type" subtitle="Gap volumes by category across 8 months">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={gapEvolution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" vertical={false} />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={10} />
              <YAxis stroke="#6B7280" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }} />
              <Area type="monotone" dataKey="preventive" stackId="1" stroke={COLORS.cyan} fill={COLORS.cyan} fillOpacity={0.3} name="Preventive" />
              <Area type="monotone" dataKey="diagnostic" stackId="1" stroke={COLORS.high} fill={COLORS.high} fillOpacity={0.3} name="Diagnostic" />
              <Area type="monotone" dataKey="vaccine" stackId="1" stroke={COLORS.low} fill={COLORS.low} fillOpacity={0.3} name="Vaccine" />
              <Area type="monotone" dataKey="treatment" stackId="1" stroke={COLORS.moderate} fill={COLORS.moderate} fillOpacity={0.3} name="Treatment" />
              <Area type="monotone" dataKey="monitoring" stackId="1" stroke={COLORS.purple} fill={COLORS.purple} fillOpacity={0.3} name="Monitoring" />
            </AreaChart>
          </ResponsiveContainer>
        </TrendChartContainer>

        <TrendChartContainer title="Safety Alert Trends by Type" subtitle="Alert volumes by guardrail category">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={safetyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" vertical={false} />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={10} />
              <YAxis stroke="#6B7280" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }} />
              <Line type="monotone" dataKey="drugInteraction" stroke={COLORS.critical} strokeWidth={2} name="Drug Interaction" />
              <Line type="monotone" dataKey="dosage" stroke={COLORS.high} strokeWidth={2} name="Dosage Limit" />
              <Line type="monotone" dataKey="contraindication" stroke={COLORS.cyan} strokeWidth={2} name="Contraindication" />
              <Line type="monotone" dataKey="allergy" stroke={COLORS.moderate} strokeWidth={2} name="Allergy Alert" />
            </LineChart>
          </ResponsiveContainer>
        </TrendChartContainer>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChartContainer title="Condition-Specific Risk Analysis" subtitle="Average risk score by primary condition">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={conditionRiskTrend} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" horizontal={false} />
              <XAxis type="number" stroke="#6B7280" fontSize={10} domain={[0, 10]} />
              <YAxis dataKey="name" type="category" stroke="#9CA3AF" fontSize={10} width={120} />
              <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }} cursor={{ fill: '#252F3E' }} />
              <Bar dataKey="avgRisk" radius={[0, 4, 4, 0]} name="Avg Risk">
                {conditionRiskTrend.map((d, i) => (
                  <Cell key={`cell-${i}`} fill={d.avgRisk > 6 ? COLORS.critical : d.avgRisk > 4 ? COLORS.high : COLORS.moderate} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </TrendChartContainer>

        <TrendChartContainer title="Predictive Risk Forecast" subtitle="AI-modeled risk trajectory with 5-day forecast">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={predictiveData}>
              <defs>
                <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.purple} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.purple} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3A4B" vertical={false} />
              <XAxis dataKey="day" stroke="#6B7280" fontSize={10} />
              <YAxis stroke="#6B7280" fontSize={10} domain={[50, 85]} />
              <Tooltip contentStyle={{ backgroundColor: '#1E2936', border: '1px solid #2D3A4B' }} />
              <Area type="monotone" dataKey="predicted" stroke={COLORS.purple} fill="url(#predGrad)" strokeWidth={2} strokeDasharray="5 5" name="Predicted" />
              <Line type="monotone" dataKey="actual" stroke={COLORS.cyan} strokeWidth={3} name="Actual" dot={{ r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </TrendChartContainer>
      </div>

      {/* Alert Banner */}
      <div className="bg-[#1E2936] rounded-xl border border-red-900/40 p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="p-4 bg-red-950/20 rounded-full border border-red-900/40 text-red-400 shrink-0">
          <Icons.Alert />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold">Surveillance Alert: Risk Escalation Detected</h3>
          <p className="text-sm text-gray-400 mt-1">Population average risk score has increased by 0.4 points over the last 8 months. Medication adherence is trending downward (-1.8%). Predictive models indicate continued deterioration without intervention.</p>
        </div>
        <button className="px-6 py-2 bg-[#FF4444] text-white rounded-lg text-sm font-bold shadow-lg shadow-red-900/30 shrink-0 hover:scale-105 transition-transform">
          Generate Intervention Report
        </button>
      </div>
    </div>
  );
};

const TrendKPI: React.FC<{ title: string; value: string; trend: string; trendUp: boolean; negative?: boolean }> = ({ title, value, trend, trendUp, negative }) => {
  const isGood = negative ? !trendUp : trendUp;
  return (
    <div className="bg-[#1E2936] border border-[#2D3A4B] rounded-xl p-4 hover:border-[#00D9FF30] transition-colors">
      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      <p className={`text-[10px] font-bold mt-1 ${isGood ? 'text-green-400' : 'text-red-400'}`}>
        {trendUp ? '\u2191' : '\u2193'} {trend}
      </p>
    </div>
  );
};

const TrendChartContainer: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
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

export default TrendSurveillanceView;
