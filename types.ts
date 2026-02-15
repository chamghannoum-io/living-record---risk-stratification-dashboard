
export enum RiskLevel {
  CRITICAL = 'Critical',
  HIGH = 'High',
  MODERATE = 'Moderate',
  LOW = 'Low'
}

export enum GapType {
  VACCINE = 'Vaccine',
  PREVENTIVE = 'Preventive',
  DIAGNOSTIC = 'Diagnostic',
  TREATMENT = 'Treatment',
  MONITORING = 'Monitoring',
  SCREENING = 'Screening'
}

export enum GuardrailType {
  CONTRAINDICATION = 'Contraindication',
  DRUG_INTERACTION = 'Drug Interaction',
  ALLERGY_ALERT = 'Allergy Alert',
  DOSAGE_LIMIT = 'Dosage Limit',
  HIGH_RIS_MED = 'High-Risk Medication',
  ADVERSE_EVENT = 'Adverse Event'
}

export enum ComplianceStatus {
  COMPLIANT = 'Compliant',
  PARTIAL = 'Partial',
  AT_RISK = 'At Risk',
  NON_COMPLIANT = 'Non-Compliant'
}

export enum GuidelineType {
  PREVENTIVE = 'Preventive',
  DIAGNOSTIC = 'Diagnostic',
  TREATMENT = 'Treatment',
  MONITORING = 'Monitoring',
  SCREENING = 'Screening'
}

export enum AbnormalResultStatus {
  NEW = 'New',
  ACKNOWLEDGED = 'Acknowledged',
  ACTIONED = 'Actioned',
  RESOLVED = 'Resolved'
}

export enum AbnormalCategory {
  LAB = 'Lab',
  IMAGING = 'Imaging',
  VITAL_SIGNS = 'Vital Signs',
  DIAGNOSTICS = 'Diagnostics'
}

export enum BehaviorType {
  NO_SHOW = 'Appointment No-Shows',
  NON_ADHERENCE = 'Medication Non-Adherence',
  REFUSAL = 'Treatment Refusal',
  DEVIATION = 'Care Plan Deviations',
  GAP = 'Follow-Up Gaps',
  DECLINE = 'Engagement Decline'
}

export enum CareSetting {
  INPATIENT = 'Inpatient',
  OUTPATIENT = 'Outpatient',
  EMERGENCY = 'Emergency',
  HOME_CARE = 'Home Care',
  SKILLED_NURSING = 'Skilled Nursing',
  TELEHEALTH = 'Telehealth'
}

export enum TransitionType {
  ADMISSION_DISCHARGE = 'Admission → Discharge',
  PCP_SPECIALIST = 'PCP → Specialist',
  ED_INPATIENT = 'ED → Inpatient',
  INPATIENT_REHAB = 'Inpatient → Rehab',
  CROSS_FACILITY = 'Cross-facility Transfer'
}

export enum TransitionRisk {
  HIGH = 'High',
  MODERATE = 'Moderate',
  LOW = 'Low'
}

export enum ProgramType {
  CHRONIC_DISEASE = 'Chronic Disease Management',
  CARDIAC_REHAB = 'Cardiac Rehab',
  DIABETES_MGMT = 'Diabetes Management',
  ONCOLOGY = 'Oncology Care Pathway',
  POST_DISCHARGE = 'Post-Discharge Program',
  BEHAVIORAL_HEALTH = 'Behavioral Health Program',
  PREVENTIVE = 'Preventive Care Program'
}

export enum EnrollmentStatus {
  ENROLLED = 'Enrolled',
  COMPLETED = 'Completed',
  WITHDRAWN = 'Withdrawn',
  ELIGIBLE = 'Non-enrolled eligible'
}

export enum AdherenceLevel {
  EXCELLENT = 'Excellent',
  GOOD = 'Good',
  MODERATE = 'Moderate',
  POOR = 'Poor'
}

export enum GoalStatus {
  ACHIEVED = 'Achieved',
  ON_TRACK = 'On Track',
  AT_RISK = 'At Risk',
  OFF_TRACK = 'Off Track'
}

export enum AlertType {
  BACKLOG = 'Appointment Backlog',
  CAPACITY = 'Capacity Overload',
  STAFFING = 'Staffing Shortage',
  URGENT_VISIT = 'Urgent Visit Flag',
  COORD_DELAY = 'Care Coordination Delay',
  BED_OCCUPANCY = 'Bed Occupancy Alert',
  SPEC_ACCESS = 'Specialist Access Delay',
  ED_WAIT = 'High ED Wait Time'
}

export enum ReferralStatus {
  PENDING = 'Pending',
  AUTHORIZED = 'Authorized',
  SCHEDULED = 'Scheduled',
  COMPLETED = 'Completed',
  DENIED = 'Denied',
  EXPIRED = 'Expired',
  CANCELLED = 'Cancelled'
}

export enum ReferralUrgency {
  ROUTINE = 'Routine',
  URGENT = 'Urgent (72h)',
  PRIORITY = 'Priority (48h)',
  STAT = 'STAT (24h)'
}

export enum AuthStatus {
  NOT_REQUIRED = 'Not Required',
  PENDING = 'Pending',
  APPROVED = 'Approved',
  DENIED = 'Denied',
  EXPIRED = 'Expired'
}

export interface Milestone {
  id: string;
  name: string;
  status: 'Completed' | 'Pending' | 'Missed' | 'Scheduled';
  completionDate?: string;
  impactScore: number;
}

export interface CareProgram {
  id: string;
  type: ProgramType;
  enrollmentDate: string;
  status: EnrollmentStatus;
  adherencePercent: number;
  milestones: Milestone[];
  goalStatus: GoalStatus;
  participationRate: number;
  lastInteraction: string;
}

export interface ReferralCommunication {
  id: string;
  timestamp: string;
  from: string;
  message: string;
}

export interface Referral {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  referringProvider: string;
  specialty: string;
  urgency: ReferralUrgency;
  status: ReferralStatus;
  authStatus: AuthStatus;
  daysOpen: number;
  scheduledDate?: string;
  receivingFacility: string;
  careCoordinator: string;
  messageCount: number;
  readinessScore: number;
  reason: string;
  clinicalSummary: string;
  communications: ReferralCommunication[];
}

export interface CareTransition {
  id: string;
  type: TransitionType;
  fromSetting: CareSetting;
  toSetting: CareSetting;
  status: 'Scheduled' | 'Overdue' | 'Complete' | 'Missing';
  dischargeSummaryStatus: 'Sent' | 'Missing' | 'Pending';
  medRecStatus: 'Complete' | 'Incomplete' | 'Not Started';
  followUpDate: string;
  riskFlag: TransitionRisk;
  coordinationScore: number;
}

export interface BehavioralAnomaly {
  id: string;
  type: BehaviorType;
  severity: RiskLevel;
  patternTrend: 'Declining' | 'Stable' | 'Improving' | 'Rapid Drop';
  lastContact: string;
  recommendedAction: string;
  status: 'Pending' | 'In Progress' | 'Actioned' | 'Scheduled';
  impactScore: number;
  details: string;
}

export interface AbnormalResult {
  id: string;
  category: AbnormalCategory;
  testName: string;
  value: string;
  normalRange: string;
  severity: RiskLevel;
  timestamp: string;
  status: AbnormalResultStatus;
  assignedTo: string;
  trend: 'up' | 'down' | 'stable';
  clinicalConflict?: string;
  impactScore: number;
}

export interface EncounterAlert {
  id: string;
  patientId: string;
  patientName: string;
  facility: string;
  department: string;
  type: AlertType;
  severity: RiskLevel;
  timeSensitive: string;
  resourceImpact: string;
  triggered: string;
  assignedTo: string;
  status: 'Pending' | 'Active' | 'Resolved' | 'Escalated';
  acuityScore: number;
  triageNotes: string;
}

export interface GuidelineAdherence {
  id: string;
  protocol: string;
  category: GuidelineType;
  status: ComplianceStatus;
  deviationType?: string;
  dueDate: string;
  daysOverdue: number;
  impactLevel: 'High' | 'Moderate' | 'Low';
  requiredAction: string;
  actualAction?: string;
  evidenceSource: string;
  riskOfNonAdherence: string;
}

export interface SafetyAlert {
  id: string;
  type: GuardrailType;
  severity: RiskLevel;
  medication: string;
  conflict: string;
  detectedOn: string;
  provider: string;
  riskImpact: number;
  status: 'Active' | 'Resolved' | 'Overridden';
  recommendation: string;
}

export interface CareGap {
  id: string;
  type: GapType;
  detail: string;
  daysOverdue: number;
  clinicalImpact: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Resolved';
  assignedTo: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  lastCompletedDate?: string;
  riskImpactScore: number;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Non-binary';
  riskLevel: RiskLevel;
  riskScore: number;
  primaryConditions: string[];
  comorbiditiesCount: number;
  lastAssessment: string;
  medicationAdherence: number;
  nextAppointment: string;
  careTeam: string[];
  vulnerabilityFactors: string[];
  trend: number;
  activeGaps: CareGap[];
  safetyAlerts: SafetyAlert[];
  medicationRiskScore: number;
  overrideFrequency: number;
  guidelineAdherence: GuidelineAdherence[];
  complianceScore: number;
  abnormalResults: AbnormalResult[];
  behavioralAnomalies: BehavioralAnomaly[];
  engagementScore: number;
  behavioralRiskTier: 'Low' | 'Moderate' | 'High' | 'Critical';
  transitions: CareTransition[];
  continuityScore: number;
  carePrograms: CareProgram[];
}

export interface FilterState {
  hospital: string;
  branch: string;
  gender: string;
  ageRange: string;
  riskLevel: string;
  conditionType: string;
  gapType: string;
  timeOverdue: string;
  guardrailType: string;
  medicationClass: string;
  specialty: string;
  complianceStatus: string;
  guidelineType: string;
  abnormalCategory: string;
  abnormalStatus: string;
  behaviorType: string;
  behaviorSeverity: string;
  careSetting: string;
  transitionType: string;
  continuityRisk: string;
  programType: string;
  enrollmentStatus: string;
  adherenceLevel: string;
  timeInProgram: string;
  goalAchievement: string;
  alertType: string;
  department: string;
  providerType: string;
  timeWindow: string;
  referralStatus: string;
  referralUrgency: string;
  referralSpecialty: string;
  referralAuth: string;
  search: string;
}

export interface RiskFactor {
  factor: string;
  category: string;
  severity: 'Severe' | 'Moderate' | 'Mild';
  clinicalFinding: string;
  impactScore: number;
  trend: 'Worsening' | 'Stable' | 'Improving';
  recommendedAction: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Routine';
  status: string;
}
