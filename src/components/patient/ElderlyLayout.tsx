import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Brain,
  Bell,
  LayoutGrid,
  HelpCircle,
  Sliders,
  Sparkles,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';

interface ElderlyLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  backTo?: string;
  title?: string;
  subtitle?: string;
}

export const ElderlyLayout: React.FC<ElderlyLayoutProps> = ({
  children,
  showBackButton = false,
  backTo,
  title,
  subtitle
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activePatient, accessibility, resetDemoData } = useApp();
  const [showResetModal, setShowResetModal] = useState(false);

  const getFontSizeClass = () => {
    switch (accessibility.fontSize) {
      case 'small':
        return 'text-sm';
      case 'medium':
        return 'text-base';
      case 'extralarge':
        return 'text-xl';
      case 'large':
      default:
        return 'text-base';
    }
  };

  const navItems = [
    { to: '/patient', label: 'Home', icon: Home, exact: true },
    { to: '/patient/games', label: 'Games', icon: Brain },
    { to: '/patient/reminders', label: 'Reminders', icon: Sparkles },
    { to: '/patient/progress', label: 'Progress', icon: LayoutGrid }
  ];

  const handleResetConfirm = () => {
    resetDemoData();
    setShowResetModal(false);
  };

  return (
    <div
      className={`min-h-[calc(100vh-61px)] bg-[#f4f8f5] text-slate-800 ${getFontSizeClass()} transition-colors ${
        accessibility.highContrast ? 'bg-black text-yellow-300' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Left Sidebar (Matching Image 2) */}
          <aside className="w-full md:w-64 lg:w-72 shrink-0 space-y-6">
            {/* Patient App Info Card */}
            <div
              className={`rounded-3xl p-5 border transition-all ${
                accessibility.highContrast
                  ? 'bg-neutral-900 border-yellow-400 text-yellow-300'
                  : 'bg-[#edf6f0] border-[#dceee2]'
              }`}
            >
              <div className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                PATIENT APP
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                {activePatient.name}
              </h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                A gentle space for daily activities.
              </p>
            </div>

            {/* Main Navigation Items */}
            <nav className="space-y-1.5" aria-label="Patient Navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? location.pathname === item.to
                  : location.pathname.startsWith(item.to);

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    id={`nav-patient-${item.label.toLowerCase()}`}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm transition-all cursor-pointer select-none ${
                      isActive
                        ? accessibility.highContrast
                          ? 'bg-yellow-400 text-black shadow-md font-bold'
                          : 'bg-white text-slate-900 font-bold shadow-2xs border border-slate-200/60'
                        : accessibility.highContrast
                        ? 'text-yellow-300 hover:bg-neutral-900 font-medium'
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

            {/* Bottom Actions: Help, Accessibility, Reset Demo */}
            <div className="pt-4 border-t border-slate-200/70 space-y-1">
              <NavLink
                to="/patient/help"
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-900 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`
                }
              >
                <HelpCircle className="w-4 h-4 text-slate-500" />
                <span>Help</span>
              </NavLink>

              <NavLink
                to="/patient/accessibility"
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-900 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`
                }
              >
                <Sliders className="w-4 h-4 text-slate-500" />
                <span>Accessibility</span>
              </NavLink>

              <button
                id="sidebar-patient-reset-btn"
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
            {/* Optional Back Button / Sub-page Title */}
            {showBackButton && (
              <div className="mb-4 flex items-center gap-3">
                <button
                  onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
                  className="px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                {title && <h1 className="text-xl font-bold text-slate-900">{title}</h1>}
              </div>
            )}

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
            This will restore all sessions, patient activity stats, and difficulty levels back to the showcase demonstration state.
          </p>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs flex items-start gap-2">
            <Sparkles className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
            <span>Ready for clean testing with initial values.</span>
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
