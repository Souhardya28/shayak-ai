import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  ChevronDown,
  RefreshCw,
  CheckCircle2,
  ArrowUpRight,
  Clock,
  Brain,
  Bell,
  Check,
  UserPlus,
  Play,
  Sparkles,
  Trash2,
  Users
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { CaregiverLayout } from '../../components/caregiver/CaregiverLayout';

export const CaregiverDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    activePatient,
    patients,
    setActivePatientId,
    openAddPatientModal,
    openDeletePatientModal,
    sessions,
    isSyncing,
    lastSyncTime,
    simulateSync
  } = useApp();

  const [showPatientDropdown, setShowPatientDropdown] = useState(false);

  // Filter sessions specifically for the active patient
  const patientSessions = sessions.filter((s) => s.patientId === activePatient.id);

  // Real computed metrics for active patient
  const totalCompleted = patientSessions.length;
  const avgAccuracy =
    totalCompleted > 0
      ? Math.round(patientSessions.reduce((sum, s) => sum + s.accuracy, 0) / totalCompleted)
      : 0;
  const avgResponseTime =
    totalCompleted > 0
      ? (patientSessions.reduce((sum, s) => sum + s.responseTime, 0) / totalCompleted).toFixed(1)
      : '0.0';
  const currentDifficulty = activePatient.currentDifficultyMemory || 1;

  // Initials for avatar circle (e.g. RK for Ramesh Kumar)
  const initials = activePatient.name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'P';

  // Dynamic Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Last Activity Date calculation for active patient
  let lastActivityText = 'No activity yet';
  if (totalCompleted > 0) {
    const sortedByTime = [...patientSessions].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    const latest = sortedByTime[0];
    const dateStr = new Date(latest.timestamp).toLocaleDateString([], {
      day: 'numeric',
      month: 'short'
    });
    const timeStr = new Date(latest.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
    lastActivityText = `${dateStr}, ${timeStr}`;
  }

  // 7 Session performance data (chronological) for active patient
  const chronologicalSessions = [...patientSessions]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .slice(-7);

  const chartData = chronologicalSessions.map((s, idx) => ({
    session: `Session ${idx + 1}`,
    accuracy: s.accuracy,
    date: new Date(s.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })
  }));

  return (
    <CaregiverLayout>
      <div className="space-y-6">
        {/* Workspace Header: Eyebrow, Greeting, Subtitle, and Top-Right Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 text-emerald-700" />
              <span>Caregiver workspace</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mt-1">
              {getGreeting()}
            </h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1">
              A clear view of support, without clinical assumptions.
            </p>
          </div>

          {/* Right Controls: Patient Dropdown & Simulate Sync */}
          <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
            {/* Patient Selector Dropdown */}
            <div className="relative">
              <button
                id="caregiver-patient-select-pill"
                onClick={() => setShowPatientDropdown(!showPatientDropdown)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs transition-colors cursor-pointer"
              >
                <span>{activePatient.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showPatientDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowPatientDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-2 py-2.5 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Select Patient
                    </div>
                    <div className="space-y-1 mt-1 max-h-56 overflow-y-auto">
                      {patients.map((p) => {
                        const pCount = sessions.filter((s) => s.patientId === p.id).length;
                        return (
                          <div
                            key={p.id}
                            onClick={() => {
                              setActivePatientId(p.id);
                              setShowPatientDropdown(false);
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
                                  setShowPatientDropdown(false);
                                  openDeletePatientModal(p);
                                }}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-t border-slate-100 mt-2 pt-2 space-y-1">
                      <button
                        onClick={() => {
                          setShowPatientDropdown(false);
                          openAddPatientModal();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>+ Add Patient</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowPatientDropdown(false);
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

            {/* Simulate Sync Pill */}
            <button
              id="caregiver-simulate-sync-pill"
              onClick={simulateSync}
              disabled={isSyncing}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-700' : 'text-slate-600'}`}
              />
              <span>{isSyncing ? 'Syncing...' : 'Simulate sync'}</span>
            </button>
          </div>
        </div>

        {/* Sync Status Pill Strip (Matching Screenshot 1) */}
        <div className="bg-white rounded-full border border-slate-200/80 px-5 py-2.5 flex items-center justify-between shadow-2xs text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>Local data · last synchronized {lastSyncTime}</span>
          </div>
          <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            DEMO SIMULATION
          </div>
        </div>

        {/* Selected Patient Banner Card (Matching Screenshot 1) */}
        <div className="bg-[#edf6f0] rounded-3xl p-5 sm:p-6 border border-[#dceee2] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-4">
            {/* Avatar Circle */}
            <div className="w-14 h-14 rounded-full bg-[#184e37] text-white flex items-center justify-center font-black text-xl shadow-xs shrink-0 select-none">
              {initials}
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                SELECTED PATIENT
              </div>
              <h2 className="text-2xl font-black text-slate-900 leading-tight mt-0.5">
                {activePatient.name}
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Age {activePatient.age} · Caregiver {activePatient.caregiverName.replace(/\s*\(.*?\)/, '')} · Preferred language English
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl px-5 py-2.5 border border-slate-200/60 shadow-2xs text-center self-start sm:self-auto">
            <div className="text-[11px] font-medium text-slate-400">
              Last activity
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
              {lastActivityText}
            </div>
          </div>
        </div>

        {/* 4 Metric Stat Cards (Matching Screenshot 1) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* 1. Games Completed */}
          <div className="bg-white rounded-3xl border border-slate-100 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                GAMES COMPLETED
              </span>
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-4xl font-black text-slate-900 tracking-tight">
                {totalCompleted}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Across recent sessions
              </div>
            </div>
          </div>

          {/* 2. Average Accuracy */}
          <div className="bg-white rounded-3xl border border-slate-100 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                AVERAGE ACCURACY
              </span>
              <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-4xl font-black text-slate-900 tracking-tight">
                {avgAccuracy}%
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Gameplay performance
              </div>
            </div>
          </div>

          {/* 3. Average Response */}
          <div className="bg-white rounded-3xl border border-slate-100 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                AVERAGE RESPONSE
              </span>
              <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-4xl font-black text-slate-900 tracking-tight">
                {avgResponseTime}s
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Per interaction
              </div>
            </div>
          </div>

          {/* 4. Current Difficulty */}
          <div className="bg-white rounded-3xl border border-slate-100 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                CURRENT DIFFICULTY
              </span>
              <div className="w-8 h-8 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center">
                <Brain className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-4xl font-black text-slate-900 tracking-tight">
                Level {currentDifficulty}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Adapts from performance
              </div>
            </div>
          </div>
        </div>

        {/* Lower Row: Performance Chart & Support Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Chart Card (2 Columns) */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-2xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  THE LAST {chartData.length > 0 ? chartData.length : 7} SESSIONS
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  Cognitive activity performance
                </h3>
              </div>

              <span className="px-3 py-1 rounded-full bg-[#f2f8f4] text-[#184e37] text-xs font-bold border border-[#d6e7dc]">
                Non-medical view
              </span>
            </div>

            {chartData.length > 0 ? (
              <div className="h-64 sm:h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="session"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: '#94a3b8' }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      ticks={[0, 50, 100]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: '#94a3b8' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#184e37',
                        borderRadius: '1rem',
                        border: 'none',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: 600
                      }}
                      formatter={(val: any) => [`${val}% accuracy`, 'Accuracy']}
                    />
                    <Line
                      type="monotone"
                      dataKey="accuracy"
                      stroke="#184e37"
                      strokeWidth={3}
                      dot={{ fill: '#184e37', r: 4, strokeWidth: 2, stroke: '#ffffff' }}
                      activeDot={{ r: 6, fill: '#c8602b' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 sm:h-72 w-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-[#f8faf8] p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 text-xl">
                  🌱
                </div>
                <h4 className="text-base font-bold text-slate-800">
                  No sessions recorded yet for {activePatient.name}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  When {activePatient.name} plays cognitive games in the Patient App, live accuracy trends and progression telemetry will appear here.
                </p>
                <button
                  id="caregiver-launch-first-game-btn"
                  onClick={() => navigate('/patient/games/memory-match')}
                  className="mt-4 px-4 py-2 rounded-full bg-[#184e37] hover:bg-[#133f2c] text-white text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Launch First Activity</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Card: Support Notes */}
          <div className="lg:col-span-1 bg-[#fcf8f3] rounded-3xl border border-[#efe2d2] p-6 sm:p-7 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-9 h-9 rounded-full bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>

              <h3 className="text-xl font-extrabold text-slate-900">
                Support notes
              </h3>

              {totalCompleted > 0 ? (
                <ul className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span>
                      {totalCompleted} activity(ies) completed for {activePatient.name} with consistent tracking.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span>
                      Average accuracy is {avgAccuracy}% with an average response time of {avgResponseTime}s.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span>
                      AI Adaptive Engine is actively calibrated to Level {currentDifficulty} based on recent telemetry.
                    </span>
                  </li>
                </ul>
              ) : (
                <ul className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span>
                      New patient profile registered for {activePatient.name}.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span>
                      Baseline memory difficulty initialized at Level {currentDifficulty}.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span>
                      Interactive sessions in the Patient App will automatically update this summary.
                    </span>
                  </li>
                </ul>
              )}
            </div>

            <div className="pt-3 border-t border-[#ebd8c4]/70 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                {totalCompleted > 0 ? 'Status: Active Routine' : 'Status: Ready to Begin'}
              </span>
              <button
                onClick={() => navigate('/caregiver/ai-decisions')}
                className="font-bold text-[#b85437] hover:underline cursor-pointer"
              >
                Inspect AI Logs →
              </button>
            </div>
          </div>
        </div>
      </div>
    </CaregiverLayout>
  );
};
