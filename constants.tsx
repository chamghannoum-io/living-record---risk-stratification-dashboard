
import React from 'react';
import { 
  RiskLevel, Patient, RiskFactor, GapType, CareGap, GuardrailType, 
  SafetyAlert, ComplianceStatus, GuidelineType, GuidelineAdherence,
  AbnormalResult, AbnormalCategory, AbnormalResultStatus,
  BehaviorType, BehavioralAnomaly, CareSetting, TransitionType, CareTransition, TransitionRisk,
  ProgramType, EnrollmentStatus, GoalStatus, CareProgram, Milestone, AlertType, EncounterAlert,
  ReferralStatus, ReferralUrgency, AuthStatus, Referral
} from './types';

export const COLORS = {
  background: '#0F1419',
  canvas: '#1A2332',
  card: '#1E2936',
  border: '#2D3A4B',
  critical: '#FF4444',
  high: '#FF8C00',
  moderate: '#FFB800',
  low: '#00FF88',
  cyan: '#00D9FF',
  purple: '#A855F7',
  blue: '#3B82F6'
};

export const HOSPITALS = [
  'All Hospitals',
  'Aramco Hospital',
  'King Abdulaziz Hospital',
  'King Fahad Medical City',
  'Dubai Healthcare City',
  'Sheikh Khalifa Hospital'
];

export const DEPARTMENTS = [
  'All Departments',
  'Emergency',
  'Cardiology',
  'Oncology',
  'Primary Care',
  'Surgery',
  'Imaging',
  'ICU',
  'Outpatient'
];

export const PROVIDER_TYPES = [
  'Physician', 'Nurse', 'Specialist', 'Allied Health', 'Care Coordinator'
];

export const BRANCHES: Record<string, string[]> = {
  'All Hospitals': ['All Branches'],
  'Aramco Hospital': ['Main Branch', 'East Branch', 'Oil Sector Unit'],
  'King Abdulaziz Hospital': ['Main Branch', 'North Wing', 'Emergency Care'],
  'King Fahad Medical City': ['South Campus', 'Main Research Hub'],
  'Dubai Healthcare City': ['Specialty Clinic', 'Main Campus'],
  'Sheikh Khalifa Hospital': ['East Wing', 'Primary Care']
};

export const MEDICATION_CLASSES = [
  'All', 'Anticoagulants', 'Insulin', 'Opioids', 'Chemotherapy', 'Biologics', 'Cardiac Agents'
];

export const SPECIALTIES = [
  'All Specialties', 'Cardiology', 'Endocrinology', 'Oncology', 'Neurology', 'Nephrology', 'Pulmonology', 'Surgery', 'Behavioral Health', 'Gastroenterology', 'Orthopedics'
];

export const PATIENT_NAMES = [
  "Ahmed Hassan", "Fatima Al-Mansoori", "Khalid Bin Saeed", "Mariam Al-Zarooni", 
  "Omar Al-Thani", "Fatima Noor", "Khalid Ibrahim", "Aisha Mohammed", 
  "Hassan Al-Farsi", "Noura Al-Ketbi", "Mohammed Al-Zaabi", "Layla Al-Mazrouei", 
  "Abdullah Al-Dhaheri", "Sara Al-Blooshi", "Rashid Al-Suwaidi", "Zayed Al-Nahyan", 
  "Hessa Al-Falasi", "Saeed Al-Shamsi", "Moza Al-Marri", "Hamad Al-Muhairi", 
  "Shamma Al-Kaabi", "Ali Al-Mansouri", "Latifa Al-Jaber", "Omar Al-Qasimi", 
  "Noor Al-Hamadi", "Tariq Al-Hashemi", "Amna Al-Sayed", "Sultan Al-Otaibi",
  "Basma Al-Rawi", "Yousuf Al-Bader", "Dana Al-Khalidi", "Fahad Al-Saud"
];

export const CONDITIONS = [
  'Heart Failure', 'CKD Stage 4', 'COPD', 'Diabetes Type 2', 'Hypertension', 
  'CAD', 'Asthma', 'Cirrhosis', 'Metastatic Cancer', 'Alzheimer', 'Stroke'
];

export const GAP_DETAILS: Record<GapType, string[]> = {
  [GapType.VACCINE]: ['Pneumococcal missing', 'Influenza Overdue', 'COVID-19 Booster Overdue', 'Tdap Booster Overdue'],
  [GapType.PREVENTIVE]: ['Colonoscopy Overdue', 'Mammogram Overdue', 'Pap Smear Overdue', 'Annual Wellness Visit'],
  [GapType.DIAGNOSTIC]: ['HbA1c Screening Overdue', 'Lipid Panel Overdue', 'Bone Density Scan', 'Echocardiogram Overdue'],
  [GapType.TREATMENT]: ['Statin Therapy Initiation', 'ACE/ARB Optimization', 'Beta-Blocker Titration'],
  [GapType.MONITORING]: ['Blood Pressure Monitoring', 'Glucose Log Review', 'Weight Tracking Missing'],
  [GapType.SCREENING]: ['Depression Screening', 'SDOH Screening', 'Fall Risk Assessment']
};

const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

export const generateMockReferrals = (count: number): Referral[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `R-${89452 + i}`,
    patientId: `P${10000 + i}`,
    patientName: PATIENT_NAMES[i % PATIENT_NAMES.length],
    patientAge: 40 + Math.floor(Math.random() * 40),
    referringProvider: `Dr. ${getRandom(['Al-Rashid', 'Hassan', 'Kumar', 'Patel'])}`,
    specialty: getRandom(SPECIALTIES.filter(s => s !== 'All Specialties')),
    urgency: getRandom(Object.values(ReferralUrgency)),
    status: getRandom(Object.values(ReferralStatus)),
    authStatus: getRandom(Object.values(AuthStatus)),
    daysOpen: Math.floor(Math.random() * 35),
    scheduledDate: Math.random() > 0.4 ? '2026-02-' + (15 + Math.floor(Math.random() * 10)) : undefined,
    receivingFacility: getRandom(HOSPITALS.filter(h => h !== 'All Hospitals')),
    careCoordinator: getRandom(['Sara Al-Harbi', 'Omar Patel', 'Layla Ahmed', 'Zayed Khan']),
    messageCount: Math.floor(Math.random() * 8),
    readinessScore: Math.floor(60 + Math.random() * 35),
    reason: 'Advanced diagnostic evaluation for persistent clinical symptoms and escalating risk scores.',
    clinicalSummary: 'Patient presents with multiple comorbidities requiring cross-specialty coordination. Documentation complete for baseline, awaiting specialized imaging auth.',
    communications: [
      { id: 'c1', timestamp: '2/15/2026 09:22', from: 'Sara Al-Harbi', message: 'Message sent to insurance for priority pre-auth.' },
      { id: 'c2', timestamp: '2/14/2026 14:10', from: 'Receiving Facility', message: 'Bed availability confirmed for 2/22.' }
    ]
  }));
};

export const generatePatientRiskFactors = (patient: Patient): RiskFactor[] => {
  const factors: RiskFactor[] = [];
  
  if (patient.riskScore > 7) {
    factors.push({
      factor: 'High Composite Risk',
      category: 'Clinical',
      severity: 'Severe',
      clinicalFinding: `Patient risk score is ${patient.riskScore}/10.`,
      impactScore: 2.5,
      trend: patient.trend > 0 ? 'Worsening' : 'Stable',
      recommendedAction: 'Immediate clinical review and care plan escalation.',
      priority: 'Critical',
      status: 'Active'
    });
  }

  if (patient.medicationAdherence < 80) {
    factors.push({
      factor: 'Medication Non-Adherence',
      category: 'Behavioral',
      severity: patient.medicationAdherence < 60 ? 'Severe' : 'Moderate',
      clinicalFinding: `Adherence rate at ${patient.medicationAdherence}%.`,
      impactScore: 1.8,
      trend: 'Stable',
      recommendedAction: 'Pharmacist consultation and adherence support program.',
      priority: 'High',
      status: 'Active'
    });
  }

  return factors;
};

export const generateMockEncounterAlerts = (count: number): EncounterAlert[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `A${8721 + i}`,
    patientId: `P${10000 + i}`,
    patientName: getRandom(PATIENT_NAMES),
    facility: getRandom(HOSPITALS.filter(h => h !== 'All Hospitals')),
    department: getRandom(DEPARTMENTS.filter(d => d !== 'All Departments')),
    type: getRandom(Object.values(AlertType)),
    severity: getRandom(Object.values(RiskLevel)),
    timeSensitive: getRandom(['<24 hrs', '<72 hrs', '<7 days', 'Immediate']),
    resourceImpact: getRandom(['Specialist Slot', 'Bed Shortage', 'Referral Backlog', 'Staffing Load']),
    triggered: `${Math.floor(Math.random() * 24)}h ago`,
    assignedTo: getRandom(['Dr. Hassan', 'Ops Team', 'Care Coord', 'Dr. Al-Rashid']),
    status: getRandom(['Pending', 'Active', 'Escalated']),
    acuityScore: Math.floor(Math.random() * 100),
    triageNotes: 'Urgent follow-up required based on recent diagnostic escalation.'
  }));
};

export const generateMockPatients = (count: number): Patient[] => {
  return Array.from({ length: count }, (_, i) => {
    const riskVal = Math.random();
    let riskLevel = RiskLevel.LOW;
    let score = riskVal * 4;

    if (riskVal > 0.85) {
      riskLevel = RiskLevel.CRITICAL;
      score = 8.5 + Math.random() * 1.5;
    } else if (riskVal > 0.65) {
      riskLevel = RiskLevel.HIGH;
      score = 6.5 + Math.random() * 2;
    } else if (riskVal > 0.4) {
      riskLevel = RiskLevel.MODERATE;
      score = 4 + Math.random() * 2.5;
    }

    const age = 18 + Math.floor(Math.random() * 70);
    const gender: Patient['gender'] = Math.random() > 0.5 ? 'Male' : (Math.random() > 0.9 ? 'Non-binary' : 'Female');

    const behavioralAnomalies: BehavioralAnomaly[] = Array.from({ length: Math.floor(Math.random() * 2) }, () => ({
      id: `BA${Math.floor(Math.random() * 10000)}`,
      type: getRandom(Object.values(BehaviorType)),
      severity: getRandom(Object.values(RiskLevel)),
      patternTrend: getRandom(['Declining', 'Stable', 'Rapid Drop']),
      lastContact: `${Math.floor(Math.random() * 14) + 1} days ago`,
      recommendedAction: getRandom(['Schedule pharmacist consult', 'Care coordinator outreach', 'Re-education session', 'Social work referral']),
      status: getRandom(['Pending', 'In Progress', 'Actioned', 'Scheduled']),
      impactScore: parseFloat((Math.random() * 15).toFixed(1)),
      details: 'Patient missed 3 consecutive dosing intervals.'
    }));

    const transitions: CareTransition[] = i < count * 0.3 ? [
      {
        id: `TR${1000 + i}`,
        type: getRandom(Object.values(TransitionType)),
        fromSetting: getRandom(Object.values(CareSetting)),
        toSetting: getRandom(Object.values(CareSetting)),
        status: getRandom(['Scheduled', 'Overdue', 'Complete', 'Missing']),
        dischargeSummaryStatus: getRandom(['Sent', 'Missing', 'Pending']),
        medRecStatus: getRandom(['Complete', 'Incomplete', 'Not Started']),
        followUpDate: `2026-02-${Math.floor(Math.random() * 28) + 1}`,
        riskFlag: getRandom(Object.values(TransitionRisk)),
        coordinationScore: Math.floor(30 + Math.random() * 70)
      }
    ] : [];

    const programType = getRandom(Object.values(ProgramType));
    const milestones: Milestone[] = [
      { id: 'm1', name: 'Initial Assessment', status: 'Completed', completionDate: '2025-10-12', impactScore: 12 },
      { id: 'm2', name: 'Education Session 1', status: 'Completed', completionDate: '2025-11-05', impactScore: 8 },
      { id: 'm3', name: 'Medication Review', status: getRandom(['Completed', 'Pending']), impactScore: 10 },
      { id: 'm4', name: 'Lifestyle Workshop', status: getRandom(['Completed', 'Pending', 'Missed']), impactScore: 15 },
      { id: 'm5', name: 'Follow-up Lab', status: getRandom(['Pending', 'Scheduled']), impactScore: 7 },
    ];

    const carePrograms: CareProgram[] = i < count * 0.6 ? [
      {
        id: `CP${2000 + i}`,
        type: programType,
        enrollmentDate: '2025-10-01',
        status: getRandom(Object.values(EnrollmentStatus)),
        adherencePercent: Math.floor(40 + Math.random() * 60),
        milestones,
        goalStatus: getRandom(Object.values(GoalStatus)),
        participationRate: Math.floor(50 + Math.random() * 50),
        lastInteraction: '2026-02-14'
      }
    ] : [];

    return {
      id: `P${10000 + i}`,
      name: PATIENT_NAMES[i % PATIENT_NAMES.length],
      age,
      gender,
      riskLevel,
      riskScore: parseFloat(score.toFixed(1)),
      primaryConditions: Array.from({ length: 1 + Math.floor(Math.random() * 2) }, () => getRandom(CONDITIONS)),
      comorbiditiesCount: Math.floor(Math.random() * 7),
      lastAssessment: `2026-02-${10 + Math.floor(Math.random() * 10)}`,
      medicationAdherence: Math.floor(40 + Math.random() * 60),
      nextAppointment: `2026-03-${Math.floor(Math.random() * 28) + 1}`,
      careTeam: [`Dr. ${getRandom(['Al-Rashid', 'Kumar', 'Hassan'])}`],
      vulnerabilityFactors: [],
      trend: parseFloat((Math.random() * 2.5 - 1).toFixed(1)),
      activeGaps: [],
      safetyAlerts: [],
      medicationRiskScore: 0,
      overrideFrequency: 0,
      guidelineAdherence: [],
      complianceScore: 0,
      abnormalResults: [],
      behavioralAnomalies,
      engagementScore: Math.floor(30 + Math.random() * 70),
      behavioralRiskTier: getRandom(['Low', 'Moderate', 'High', 'Critical']),
      transitions,
      continuityScore: Math.floor(40 + Math.random() * 50),
      carePrograms
    };
  });
};

export const Icons = {
  Users: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  Alert: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
  ),
  Gauge: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
  ),
  Chart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
  ),
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  ),
  Logout: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
  ),
  Menu: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
  ),
  Analytics: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
  ),
  Shield: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
  Bell: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
  ),
  Activity: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
  ),
  Continuity: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a2 2 0 0 0-2-2l-4 4-4-4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/><path d="M18 9l4 4-4 4"/><path d="M10 13h12"/></svg>
  ),
  Program: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
  ),
  Resource: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>
  ),
  Referral: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/><path d="M17 12H3"/><path d="M21 12h.01"/><rect x="18" y="5" width="4" height="14" rx="1"/></svg>
  )
};
