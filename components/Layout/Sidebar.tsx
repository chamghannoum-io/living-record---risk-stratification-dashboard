
import React from 'react';
import { Icons } from '../../constants';

interface SidebarProps {
  activeTab: 'population' | 'caregaps' | 'dashboard' | 'safety' | 'guidelines' | 'abnormal' | 'behavioral' | 'continuity' | 'program' | 'encounter' | 'referral' | 'trends';
  setActiveTab: (tab: 'population' | 'caregaps' | 'dashboard' | 'safety' | 'guidelines' | 'abnormal' | 'behavioral' | 'continuity' | 'program' | 'encounter' | 'referral' | 'trends') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'population', label: 'Population Dashboard', icon: <Icons.Users /> },
    { id: 'caregaps', label: 'Care Gaps', icon: <Icons.Check /> },
    { id: 'dashboard', label: 'Risk Stratification', icon: <Icons.Gauge /> },
    { id: 'guidelines', label: 'Guideline Adherence', icon: <Icons.Analytics /> },
    { id: 'abnormal', label: 'Abnormal Results', icon: <Icons.Bell /> },
    { id: 'behavioral', label: 'Behavioral Anomalies', icon: <Icons.Activity /> },
    { id: 'continuity', label: 'Continuity of Care', icon: <Icons.Continuity /> },
    { id: 'program', label: 'Care Program Adherence', icon: <Icons.Program /> },
    { id: 'encounter', label: 'Encounter & Resourcing', icon: <Icons.Resource /> },
    { id: 'referral', label: 'Referral & Coordination', icon: <Icons.Referral /> },
    { id: 'safety', label: 'Safety Guardrails', icon: <Icons.Shield /> },
    { id: 'trends', label: 'Trend Surveillance', icon: <Icons.Chart /> },
  ];

  return (
    <aside className="w-64 bg-[#1A2332] border-r border-[#2D3A4B] flex flex-col hidden lg:flex">
      <div className="p-6 flex items-center space-x-3">
        <div className="w-10 h-10 bg-[#00D9FF] rounded-lg flex items-center justify-center">
          <span className="text-[#0F1419] font-bold text-xl">LR</span>
        </div>
        <span className="text-xl font-bold tracking-tight">Living Record</span>
      </div>

      <nav className="flex-1 px-4 mt-4 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 mb-1 group
              ${activeTab === item.id 
                ? 'bg-[#00D9FF15] text-[#00D9FF] border-l-[3px] border-[#00D9FF]' 
                : 'text-gray-400 hover:bg-[#252F3E] hover:text-white border-l-[3px] border-transparent'
              }`}
          >
            <span className={activeTab === item.id ? 'text-[#00D9FF]' : 'text-gray-500 group-hover:text-white'}>
              {item.icon}
            </span>
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-[#2D3A4B]">
        <div className="flex items-center space-x-3 px-4 py-2">
          <img src="https://picsum.photos/40/40" className="w-10 h-10 rounded-full border border-[#2D3A4B]" alt="Provider" />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate">Dr. Ahmed Al-Rashid</p>
            <p className="text-xs text-gray-400">Cardiologist</p>
          </div>
          <button className="text-gray-400 hover:text-white">
            <Icons.Logout />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
