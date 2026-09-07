import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  HeartHandshake,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RoleSelectorPage: React.FC = () => {
  const navigate = useNavigate();
  const { activePatient } = useApp();

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#fbfcfb] flex flex-col justify-center relative overflow-hidden py-8 sm:py-12 lg:py-16">
      {/* Background Soft Radiant Gradient Orbs */}
      <div className="absolute top-1/4 -right-16 sm:right-10 w-[420px] sm:w-[500px] h-[420px] sm:h-[500px] rounded-full bg-emerald-200/40 blur-[100px] pointer-events-none -z-0" />
      <div className="absolute -bottom-20 left-10 w-[350px] h-[350px] rounded-full bg-emerald-100/30 blur-[90px] pointer-events-none -z-0" />

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center relative z-10">
        {/* Left Column: Hero Content */}
        <section className="lg:col-span-7 flex flex-col items-start space-y-6 sm:space-y-7 animate-in fade-in duration-300">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-[#eaf4ed] text-[#1c543c] border border-[#d6e9dc]">
            <Sparkles className="w-3.5 h-3.5 text-[#1c543c]" />
            <span>A GENTLE DAILY RHYTHM</span>
          </div>

          {/* Display Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.4rem] font-black tracking-tight leading-[0.95] text-[#184e37]">
            <span className="block">Support for</span>
            <span className="block text-[#c8602b]">memory.</span>
            <span className="block">Made</span>
            <span className="block">human.</span>
          </h1>

          {/* Subtitle Description */}
          <p className="text-slate-600 text-base sm:text-lg lg:text-[1.125rem] leading-relaxed max-w-lg font-normal">
            AI-assisted cognitive activities and memory support designed for everyday moments, with caregivers close by.
          </p>

          {/* Call to Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3.5 sm:gap-4">
            <button
              id="open-patient-app-btn"
              onClick={() => navigate('/patient')}
              className="bg-[#184e37] hover:bg-[#123d2b] text-white px-7 py-3.5 rounded-full font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-xs hover:shadow-md transition-all cursor-pointer group active:scale-98"
            >
              <span>Open patient app</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="open-caregiver-dashboard-btn"
              onClick={() => navigate('/caregiver')}
              className="bg-white hover:bg-slate-50 border border-slate-200/90 text-[#184e37] px-6 py-3.5 rounded-full font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-98"
            >
              <HeartHandshake className="w-4 h-4 text-[#184e37]" />
              <span>Caregiver dashboard</span>
            </button>
          </div>
        </section>

        {/* Right Column: Floating Interactive Mockup Card */}
        <section className="lg:col-span-5 relative flex flex-col items-center lg:items-end justify-center animate-in fade-in zoom-in-95 duration-400">
          <div className="w-full max-w-[420px] space-y-3.5 sm:space-y-4">
            {/* Dashboard Mockup Card */}
            <div className="w-full bg-white rounded-[2.25rem] p-6 sm:p-7 shadow-[0_20px_50px_rgba(24,78,55,0.08)] border border-slate-100 space-y-5">
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase block">
                    TODAY, TOGETHER
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    Good morning, {activePatient?.name || 'Ramesh'}
                  </h2>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#f8ede3] flex items-center justify-center text-lg text-emerald-800 shrink-0">
                  🌿
                </div>
              </div>

              {/* Next Activity Card */}
              <div
                onClick={() => navigate('/patient/games/memory-match')}
                className="bg-[#ecf6ef] border border-[#dceee2] rounded-3xl p-5 space-y-3.5 cursor-pointer hover:border-emerald-300 transition-colors group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
                    🧠
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.14em] text-emerald-800 uppercase block">
                      NEXT ACTIVITY
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      Memory Match
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Find a few familiar objects, one pair at a time.
                </p>

                {/* Progress Track */}
                <div>
                  <div className="w-full h-2 rounded-full bg-white/90 overflow-hidden">
                    <div className="h-full w-2/5 bg-[#184e37] rounded-full" />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 text-right block mt-1.5">
                    5 minutes
                  </span>
                </div>
              </div>

              {/* Bottom 3 Pills (Medicine, Lunch, Activity) */}
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => navigate('/patient/reminders')}
                  className="bg-[#fef7ee] border border-[#f8ebd7] rounded-2xl p-3 flex flex-col items-center justify-center gap-1.5 hover:bg-[#faeedd] transition-colors cursor-pointer text-center"
                >
                  <span className="text-xl">💊</span>
                  <span className="text-xs font-bold text-slate-800">Medicine</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/patient/reminders')}
                  className="bg-[#f0f5fa] border border-[#e2edf7] rounded-2xl p-3 flex flex-col items-center justify-center gap-1.5 hover:bg-[#e7f0f8] transition-colors cursor-pointer text-center"
                >
                  <span className="text-xl">🍽️</span>
                  <span className="text-xs font-bold text-slate-800">Lunch</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/patient/games')}
                  className="bg-[#faf0f5] border border-[#f5e1ec] rounded-2xl p-3 flex flex-col items-center justify-center gap-1.5 hover:bg-[#f5e6ef] transition-colors cursor-pointer text-center"
                >
                  <span className="text-xl">🧠</span>
                  <span className="text-xs font-bold text-slate-800">Activity</span>
                </button>
              </div>
            </div>

            {/* "Private by design / Works with local data" positioned UNDER this dashboard */}
            <div className="flex items-center justify-start pl-1 sm:pl-2">
              <div className="inline-flex items-center gap-3 bg-white/95 backdrop-blur-xs rounded-2xl p-3 px-3.5 shadow-sm border border-slate-200/80">
                <div className="w-9 h-9 rounded-xl bg-[#ecf6ef] border border-[#dceee2] text-[#184e37] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="text-left pr-2">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    Private by design
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Works with local data
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
