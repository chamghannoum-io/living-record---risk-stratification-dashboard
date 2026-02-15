
import React, { useState, useMemo } from 'react';
import { 
  RiskLevel, 
  Patient, 
  FilterState,
  ComplianceStatus
} from './types';
import { 
  generateMockPatients, 
  HOSPITALS, 
  Icons 
} from './constants';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import DashboardView from './components/Dashboard/DashboardView';
import AnalyzerView from './components/Analyzer/AnalyzerView';
import CareGapsView from './components/CareGaps/CareGapsView';
import CareGapAnalyzer from './components/CareGaps/CareGapAnalyzer';
import SafetyView from './components/Safety/SafetyView';
import SafetyAnalyzer from './components/Safety/SafetyAnalyzer';
import GuidelinesView from './components/Guidelines/GuidelinesView';
import GuidelineAnalyzer from './components/Guidelines/GuidelineAnalyzer';
import AbnormalResultsView from './components/AbnormalResults/AbnormalResultsView';
import AbnormalResultAnalyzer from './components/AbnormalResults/AbnormalResultAnalyzer';
import BehavioralView from './components/Behavioral/BehavioralView';
import BehavioralAnalyzer from './components/Behavioral/BehavioralAnalyzer';
import ContinuityView from './components/Continuity/ContinuityView';
import ContinuityAnalyzer from './components/Continuity/ContinuityAnalyzer';
import ProgramAdherenceView from './components/Programs/ProgramAdherenceView';
import ProgramAnalyzer from './components/Programs/ProgramAnalyzer';
import EncounterView from './components/Encounter/EncounterView';
import EncounterAnalyzer from './components/Encounter/EncounterAnalyzer';
import ReferralView from './components/Referrals/ReferralView';
import ReferralAnalyzer from './components/Referrals/ReferralAnalyzer';

type AppTab = 'population' | 'caregaps' | 'dashboard' | 'safety' | 'guidelines' | 'abnormal' | 'behavioral' | 'continuity' | 'program' | 'encounter' | 'referral' | 'trends' | 'analyzer' | 'gap-analyzer' | 'safety-analyzer' | 'guideline-analyzer' | 'abnormal-analyzer' | 'behavior-analyzer' | 'continuity-analyzer' | 'program-analyzer' | 'encounter-analyzer' | 'referral-analyzer';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('referral');
  const [patients] = useState<Patient[]>(() => generateMockPatients(400));
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [selectedReferralId, setSelectedReferralId] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<FilterState>({
    hospital: 'All Hospitals',
    branch: 'All Branches',
    gender: 'All Genders',
    ageRange: 'All Ages',
    riskLevel: 'All Levels',
    conditionType: 'All Conditions',
    gapType: 'All',
    timeOverdue: 'All',
    guardrailType: 'All',
    medicationClass: 'All',
    specialty: 'All Specialties',
    complianceStatus: 'All Statuses',
    guidelineType: 'All Types',
    abnormalCategory: 'All',
    abnormalStatus: 'All',
    behaviorType: 'All',
    behaviorSeverity: 'All Levels',
    careSetting: 'All',
    transitionType: 'All',
    continuityRisk: 'All',
    programType: 'All Programs',
    enrollmentStatus: 'All',
    adherenceLevel: 'All',
    timeInProgram: 'All',
    goalAchievement: 'All',
    alertType: 'All',
    department: 'All Departments',
    providerType: 'All',
    timeWindow: 'Last 30 Days',
    referralStatus: 'All',
    referralUrgency: 'All',
    referralSpecialty: 'All Specialties',
    referralAuth: 'All',
    search: ''
  });

  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      const riskMatch = filters.riskLevel === 'All Levels' || p.riskLevel === filters.riskLevel;
      const searchMatch = !filters.search || 
        p.name.toLowerCase().includes(filters.search.toLowerCase()) || 
        p.id.toLowerCase().includes(filters.search.toLowerCase());

      return riskMatch && searchMatch;
    });
  }, [patients, filters]);

  const handleSelectPatient = (id: string, view: AppTab = 'analyzer') => {
    setSelectedPatientId(id);
    setActiveTab(view);
  };

  const handleSelectAlert = (id: string) => {
    setSelectedAlertId(id);
    setActiveTab('encounter-analyzer');
  };

  const handleSelectReferral = (id: string) => {
    setSelectedReferralId(id);
    setActiveTab('referral-analyzer');
  };

  return (
    <div className="flex min-h-screen bg-[#0F1419] text-white">
      <Sidebar activeTab={activeTab as any} setActiveTab={setActiveTab as any} />
      
      <main className="flex-1 flex flex-col min-w-0">
        <Header />
        
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {activeTab === 'dashboard' && (
            <DashboardView 
              stats={{ total: filteredPatients.length, highRiskCount: 0, highRiskPercent: '0', avgScore: '0', complexNeeds: 0 }}
              filters={filters}
              setFilters={setFilters}
              patients={filteredPatients}
              onSelectPatient={(id) => handleSelectPatient(id, 'analyzer')}
            />
          )}
          {activeTab === 'caregaps' && (
            <CareGapsView 
              patients={patients}
              filters={filters}
              setFilters={setFilters}
              onSelectPatient={(id) => handleSelectPatient(id, 'gap-analyzer')}
            />
          )}
          {activeTab === 'safety' && (
            <SafetyView 
              patients={patients}
              filters={filters}
              setFilters={setFilters}
              onSelectPatient={(id) => handleSelectPatient(id, 'safety-analyzer')}
            />
          )}
          {activeTab === 'guidelines' && (
            <GuidelinesView 
              patients={patients}
              filters={filters}
              setFilters={setFilters}
              onSelectPatient={(id) => handleSelectPatient(id, 'guideline-analyzer')}
            />
          )}
          {activeTab === 'abnormal' && (
            <AbnormalResultsView 
              patients={patients}
              filters={filters}
              setFilters={setFilters}
              onSelectPatient={(id) => handleSelectPatient(id, 'abnormal-analyzer')}
            />
          )}
          {activeTab === 'behavioral' && (
            <BehavioralView 
              patients={patients}
              filters={filters}
              setFilters={setFilters}
              onSelectPatient={(id) => handleSelectPatient(id, 'behavior-analyzer')}
            />
          )}
          {activeTab === 'continuity' && (
            <ContinuityView 
              patients={patients}
              filters={filters}
              setFilters={setFilters}
              onSelectPatient={(id) => handleSelectPatient(id, 'continuity-analyzer')}
            />
          )}
          {activeTab === 'program' && (
            <ProgramAdherenceView 
              patients={patients}
              filters={filters}
              setFilters={setFilters}
              onSelectPatient={(id) => handleSelectPatient(id, 'program-analyzer')}
            />
          )}
          {activeTab === 'encounter' && (
            <EncounterView 
              filters={filters}
              setFilters={setFilters}
              onSelectAlert={handleSelectAlert}
            />
          )}
          {activeTab === 'referral' && (
            <ReferralView 
              filters={filters}
              setFilters={setFilters}
              onSelectReferral={handleSelectReferral}
            />
          )}
          {activeTab === 'analyzer' && (
            <AnalyzerView 
              patients={patients}
              selectedId={selectedPatientId}
              onSelectId={setSelectedPatientId}
            />
          )}
          {activeTab === 'gap-analyzer' && (
            <CareGapAnalyzer 
              patients={patients}
              selectedId={selectedPatientId}
              onSelectId={(id) => {
                setSelectedPatientId(id);
                if (!id) setActiveTab('caregaps');
              }}
            />
          )}
          {activeTab === 'safety-analyzer' && (
            <SafetyAnalyzer 
              patients={patients}
              selectedId={selectedPatientId}
              onSelectId={(id) => {
                setSelectedPatientId(id);
                if (!id) setActiveTab('safety');
              }}
            />
          )}
          {activeTab === 'guideline-analyzer' && (
            <GuidelineAnalyzer 
              patients={patients}
              selectedId={selectedPatientId}
              onSelectId={(id) => {
                setSelectedPatientId(id);
                if (!id) setActiveTab('guidelines');
              }}
            />
          )}
          {activeTab === 'abnormal-analyzer' && (
            <AbnormalResultAnalyzer 
              patients={patients}
              selectedId={selectedPatientId}
              onSelectId={(id) => {
                setSelectedPatientId(id);
                if (!id) setActiveTab('abnormal');
              }}
            />
          )}
          {activeTab === 'behavior-analyzer' && (
            <BehavioralAnalyzer 
              patients={patients}
              selectedId={selectedPatientId}
              onSelectId={(id) => {
                setSelectedPatientId(id);
                if (!id) setActiveTab('behavioral');
              }}
            />
          )}
          {activeTab === 'continuity-analyzer' && (
            <ContinuityAnalyzer 
              patients={patients}
              selectedId={selectedPatientId}
              onSelectId={(id) => {
                setSelectedPatientId(id);
                if (!id) setActiveTab('continuity');
              }}
            />
          )}
          {activeTab === 'program-analyzer' && (
            <ProgramAnalyzer 
              patients={patients}
              selectedId={selectedPatientId}
              onSelectId={(id) => {
                setSelectedPatientId(id);
                if (!id) setActiveTab('program');
              }}
            />
          )}
          {activeTab === 'encounter-analyzer' && (
            <EncounterAnalyzer 
              selectedAlertId={selectedAlertId}
              onBack={() => setActiveTab('encounter')}
            />
          )}
          {activeTab === 'referral-analyzer' && (
            <ReferralAnalyzer 
              selectedReferralId={selectedReferralId}
              onBack={() => setActiveTab('referral')}
            />
          )}
          {['population', 'trends'].includes(activeTab) && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-12 bg-[#1E2936] rounded-2xl border border-[#2D3A4B]">
                <h2 className="text-2xl font-bold mb-2">Module under development</h2>
                <p className="text-gray-400">The "{activeTab}" intelligence layer is being processed.</p>
                <button onClick={() => setActiveTab('dashboard')} className="mt-6 px-4 py-2 bg-[#00D9FF] text-[#0F1419] font-bold rounded-lg">Return to Risk Stratification</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
