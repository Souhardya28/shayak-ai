import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  User,
  Sparkles,
  ChevronDown,
  Globe,
  RotateCcw,
  Check,
  UserPlus,
  Trash2,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Language } from '../../types';
import { Modal } from './Modal';

export const DemoModeBanner: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    activePatient,
    patients,
    setActivePatientId,
    openAddPatientModal,
    openDeletePatientModal,
    language,
    setLanguage,
    resetDemoData
  } = useApp();

  const [showResetModal, setShowResetModal] = useState(false);
  const [showPatientMenu, setShowPatientMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const isCaregiverView = location.pathname.startsWith('/caregiver');
  const isLandingPage = location.pathname === '/';

  const handleReset = () => {
    resetDemoData();
    setShowResetModal(false);
  };

  if (isLandingPage) {
    return (
      <header className="w-full bg-[#fbfcfb] text-slate-800 border-b border-transparent">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-5 sm:py-6 flex items-center justify-between gap-3">
          {/* Brand Logo & Title */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-full bg-[#184e37] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 fill-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17 3C10.5 3 6 7.5 6 14C6 14.5 6 15 6.1 15.5C4.5 16.5 3.3 18.2 3.1 20.3C3 20.7 3.3 21 3.7 21H4.1C6.2 20.8 7.9 19.6 8.9 18C9.4 18.1 9.9 18.1 10.4 18.1C16.9 18.1 21.4 13.6 21.4 7.1C21.4 4.8 19.5 3 17 3ZM16.8 6.5C14.2 6.5 12 8.7 12 11.3C12 11.9 11.5 12.4 10.9 12.4C10.3 12.4 9.8 11.9 9.8 11.3C9.8 7.5 12.9 4.4 16.7 4.4C17.3 4.4 17.8 4.9 17.8 5.5C17.7 6 17.3 6.5 16.8 6.5Z" />
              </svg>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center font-black text-lg sm:text-xl tracking-tight leading-none">
                <span className="text-[#184e37]">SHAYAK</span>
                <span className="text-[#c8602b] font-black">—AI</span>
              </div>
              <span className="text-[9.5px] sm:text-[10px] font-bold tracking-[0.18em] text-slate-400 uppercase mt-0.5">
                COGNITIVE &amp; MEMORY SUPPORT
              </span>
            </div>
          </div>

          {/* Right: Demo mode · local data pill */}
          <div className="relative">
            <button
              id="landing-demo-mode-pill"
              onClick={() => setShowPatientMenu(!showPatientMenu)}
              className="px-4 py-1.5 rounded-full border border-slate-200/90 bg-white/90 hover:bg-white text-xs font-medium text-slate-500 hover:text-slate-800 shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
              title="Demo mode · local data (Click to switch patient)"
            >
              <span>Demo mode · local data</span>
            </button>

            {/* Patient Selector Dropdown if user clicks demo pill */}
            {showPatientMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowPatientMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-2 py-2.5 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Patient Profile
                  </div>
                  <div className="space-y-1 mt-1 max-h-60 overflow-y-auto">
                    {patients.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setActivePatientId(p.id);
                          setShowPatientMenu(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                          p.id === activePatient.id
                            ? 'bg-emerald-50 text-emerald-900 font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="shrink-0">{p.avatarEmoji}</span>
                          <div className="min-w-0 flex-1">
                            <div className="truncate">{p.name}</div>
                            <div className="text-[10px] text-slate-400 font-normal truncate">
                              {p.stateNER} · <span className="font-mono text-[9.5px]">{p.id}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 ml-1">
                          {p.id === activePatient.id && (
                            <Check className="w-4 h-4 text-emerald-600" />
                          )}
                          <button
                            type="button"
                            title={`Delete Patient ID (${p.id})`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowPatientMenu(false);
                              openDeletePatientModal(p);
                            }}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 mt-2 pt-2 space-y-1">
                    <button
                      onClick={() => {
                        setShowPatientMenu(false);
                        openAddPatientModal();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>+ Register New Patient</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowPatientMenu(false);
                        navigate('/caregiver/patients');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>Manage &amp; Delete IDs</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#f4f8f5]/95 backdrop-blur-md border-b border-[#e2ede5] text-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          {/* Brand Logo & Title */}
          <div
            onClick={() => navigate(isCaregiverView ? '/caregiver' : '/patient')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            {/* Green circular emblem with curved leaf icon */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#184e37] flex items-center justify-center text-white shadow-2xs group-hover:scale-105 transition-transform shrink-0">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 fill-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17 3C10.5 3 6 7.5 6 14C6 14.5 6 15 6.1 15.5C4.5 16.5 3.3 18.2 3.1 20.3C3 20.7 3.3 21 3.7 21H4.1C6.2 20.8 7.9 19.6 8.9 18C9.4 18.1 9.9 18.1 10.4 18.1C16.9 18.1 21.4 13.6 21.4 7.1C21.4 4.8 19.5 3 17 3ZM16.8 6.5C14.2 6.5 12 8.7 12 11.3C12 11.9 11.5 12.4 10.9 12.4C10.3 12.4 9.8 11.9 9.8 11.3C9.8 7.5 12.9 4.4 16.7 4.4C17.3 4.4 17.8 4.9 17.8 5.5C17.7 6 17.3 6.5 16.8 6.5Z" />
              </svg>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center font-black text-lg sm:text-xl tracking-tight text-slate-900 leading-none">
                <span>SHAYAK</span>
                <span className="text-[#c8602b] font-black">—AI</span>
              </div>
              <span className="text-[9.5px] sm:text-[10px] font-bold tracking-[0.16em] text-slate-400 uppercase mt-0.5">
                COGNITIVE &amp; MEMORY SUPPORT
              </span>
            </div>
          </div>

          {/* Right Controls: Status Pill & View Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Status Pill with interactive Patient Dropdown */}
            <div className="relative">
              <button
                id="header-patient-status-btn"
                onClick={() => setShowPatientMenu(!showPatientMenu)}
                className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600 shadow-2xs transition-colors cursor-pointer"
                title="Active Patient (Click to switch)"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="truncate max-w-[140px] sm:max-w-[200px]">
                  Local data · {activePatient.name}
                </span>
              </button>

              {/* Patient Selector Dropdown Menu */}
              {showPatientMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowPatientMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-2 py-2.5 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Switch Patient Profile
                    </div>
                    <div className="space-y-1 mt-1 max-h-60 overflow-y-auto">
                      {patients.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            setActivePatientId(p.id);
                            setShowPatientMenu(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                            p.id === activePatient.id
                              ? 'bg-emerald-50 text-emerald-900 font-bold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <span className="shrink-0">{p.avatarEmoji}</span>
                            <div className="min-w-0 flex-1">
                              <div className="truncate">{p.name}</div>
                              <div className="text-[10px] text-slate-400 font-normal truncate">
                                {p.stateNER} · <span className="font-mono text-[9.5px]">{p.id}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0 ml-1">
                            {p.id === activePatient.id && (
                              <Check className="w-4 h-4 text-emerald-600" />
                            )}
                            <button
                              type="button"
                              title={`Delete Patient ID (${p.id})`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowPatientMenu(false);
                                openDeletePatientModal(p);
                              }}
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 mt-2 pt-2 space-y-1">
                      <button
                        onClick={() => {
                          setShowPatientMenu(false);
                          openAddPatientModal();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>+ Register New Patient</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowPatientMenu(false);
                          navigate('/caregiver/patients');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>Manage &amp; Delete IDs</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Role Switcher Pill Button */}
            {isCaregiverView ? (
              <button
                id="header-switch-to-patient-btn"
                onClick={() => navigate('/patient')}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 shadow-2xs transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-slate-600" />
                <span>Patient app</span>
              </button>
            ) : (
              <button
                id="header-switch-to-caregiver-btn"
                onClick={() => navigate('/caregiver')}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 shadow-2xs transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-slate-600" />
                <span>Caregiver view</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Demo Reset Confirmation Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset Demo Data"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-slate-600 text-sm">
            This will reset all cognitive telemetry, session history, daily reminders, and adaptive difficulty logs back to the initial baseline showcase state.
          </p>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs flex items-start gap-2">
            <Sparkles className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
            <span>Recommended before starting a fresh demonstration session.</span>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setShowResetModal(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm cursor-pointer"
            >
              Reset Data
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
