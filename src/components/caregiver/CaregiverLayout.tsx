import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutGrid,
  Sparkles,
  Bell,
  Users,
  History,
  HelpCircle,
  ChevronRight,
  Brain
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';

interface CaregiverLayoutProps {
  children: React.ReactNode;
}

export const CaregiverLayout: React.FC<CaregiverLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { activePatient, resetDemoData } = useApp();
  const [showResetModal, setShowResetModal] = useState(false);

  const navItems = [
    { to: '/caregiver', label: 'Overview', icon: LayoutGrid, exact: true },
    { to: '/caregiver/ai-decisions', label: 'AI decisions', icon: Sparkles },
    { to: '/caregiver/reminders', label: 'Reminders', icon: Brain }
  ];

  const handleResetConfirm = () => {
    resetDemoData();
    setShowResetModal(false);
  };

  return (
    <div className="min-h-[calc(100vh-61px)] bg-[#f4f8f5] text-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Left Caregiver Sidebar (Matching Image 1) */}
          <aside className="w-full md:w-64 lg:w-72 shrink-0 space-y-6">
            {/* Care Team Card */}
            <div className="bg-[#edf6f0] rounded-3xl p-5 border border-[#dceee2]">
              <div className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                CARE TEAM
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                {activePatient.name}
              </h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Understand patterns, support with confidence.
              </p>
            </div>

            {/* Caregiver Navigation List */}
            <nav className="space-y-1.5" aria-label="Caregiver Navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? location.pathname === item.to
                  : location.pathname.startsWith(item.to);

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    id={`nav-caregiver-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm transition-all cursor-pointer select-none ${
                      isActive
                        ? 'bg-white text-slate-900 font-bold shadow-2xs border border-slate-200/60'
                        : 'text-slate-600 font-medium hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 shrink-0 text-slate-600" strokeWidth={isActive ? 2.5 : 2} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        isActive ? 'text-slate-400 translate-x-0.5' : 'text-slate-300'
                      }`}
                    />
                  </NavLink>
                );
              })}
            </nav>

            {/* Bottom Actions: Help & Reset Demo Data */}
            <div className="pt-4 border-t border-slate-200/70 space-y-1">
              <NavLink
                to="/patient/help"
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white/50 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-slate-500" />
                <span>Help</span>
              </NavLink>

              <button
                id="sidebar-caregiver-reset-btn"
                onClick={() => setShowResetModal(true)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium text-[#c8602b] hover:text-[#a54a1c] hover:bg-[#faeeea]/70 transition-colors cursor-pointer text-left"
              >
                <Sparkles className="w-4 h-4 text-[#c8602b] shrink-0" />
                <span>Reset demo data</span>
              </button>
            </div>
          </aside>

          {/* Right Main Content Area */}
          <main className="flex-1 w-full min-w-0">
            {children}
          </main>
        </div>
      </div>

      {/* Demo Reset Confirmation Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset Demo Data"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-slate-600 text-sm">
            This will reset all session telemetry, patient activity metrics, and AI decision adaptation logs to initial showcase values.
          </p>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs flex items-start gap-2">
            <Sparkles className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
            <span>Ready for a clean presentation run.</span>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setShowResetModal(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleResetConfirm}
              className="px-4 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm cursor-pointer"
            >
              Reset Data
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
