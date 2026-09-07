import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Volume2,
  Sliders,
  Sparkles,
  Clock,
  ArrowRight,
  Bell,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ElderlyLayout } from '../../components/patient/ElderlyLayout';
import { BrainGraphic3D } from '../../components/common/BrainGraphic3D';

export const PatientHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { activePatient, t, reminders, toggleReminderCompleted, accessibility } = useApp();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning,';
    if (hour < 17) return 'Good afternoon,';
    return 'Good evening,';
  };

  const firstName = activePatient.name.split(' ')[0] || activePatient.name;

  const handleListen = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `${getGreeting()} ${firstName}. A calm start makes room for a good memory. Today's recommended activity is Memory Match at Level ${activePatient.currentDifficultyMemory || 3}. Take your time, one card at a time.`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.85;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const todaysReminders = reminders
    .filter((r) => r.patientId === activePatient.id)
    .slice(0, 3);

  return (
    <ElderlyLayout>
      <div className="space-y-6">
        {/* Top Header: Greeting, First Name + Leaf, and Action Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-sm font-medium text-slate-500">
              {getGreeting()}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                {firstName}
              </h1>
              {/* Botanical Leaf Emblem */}
              <span className="text-3xl sm:text-4xl select-none" role="img" aria-label="leaf">
                🌿
              </span>
            </div>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              A calm start makes room for a good memory.
            </p>
          </div>

          {/* Right Action Controls: Listen & Tune/Accessibility */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              id="patient-listen-audio-btn"
              onClick={handleListen}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold shadow-2xs transition-all cursor-pointer ${
                isSpeaking
                  ? 'bg-emerald-600 text-white border-emerald-700 animate-pulse'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
              }`}
              title="Listen to gentle instructions"
            >
              <Volume2 className={`w-4 h-4 ${isSpeaking ? 'text-white' : 'text-slate-600'}`} />
              <span>{isSpeaking ? 'Listening...' : 'Listen'}</span>
            </button>

            <button
              id="patient-quick-tune-btn"
              onClick={() => navigate('/patient/accessibility')}
              className="p-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-2xs transition-colors cursor-pointer"
              title="Accessibility & Audio Adjustments"
              aria-label="Settings"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Featured Hero Card: TODAY'S ACTIVITY (Memory Match) (Matching Image 2) */}
        <div className="relative rounded-3xl bg-[#184e37] text-white p-7 sm:p-9 shadow-sm overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Subtle Organic Background Watermarks */}
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full border-[28px] border-white/5 pointer-events-none" />
          <div className="absolute right-12 -bottom-20 w-64 h-64 rounded-full border-[20px] border-white/5 pointer-events-none" />

          {/* Left Hero Details */}
          <div className="relative z-10 space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-white/15 text-white backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TODAY'S ACTIVITY</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-2">
              Memory Match
            </h2>

            <p className="text-emerald-100/90 text-sm sm:text-base font-medium leading-relaxed mt-1">
              Find the matching pairs. Take your time — one card at a time.
            </p>

            <div className="flex items-center gap-3 text-xs font-semibold text-emerald-200/90 pt-1">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>About 5 minutes</span>
              </span>
              <span>•</span>
              <span>Level 3</span>
            </div>

            <div className="pt-3">
              <button
                id="home-start-activity-cta"
                onClick={() => navigate('/patient/games/memory-match')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#f4d3b6] hover:bg-[#edd2b1] text-slate-900 font-bold text-sm shadow-xs transition-transform active:scale-98 cursor-pointer"
              >
                <span>Start activity</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Hero Graphic: Translucent rounded container with 3D Pink Brain */}
          <div className="relative z-10 self-center md:self-auto shrink-0">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-white/10 backdrop-blur-xs border border-white/15 flex items-center justify-center p-3 shadow-inner">
              <BrainGraphic3D className="w-28 h-28 sm:w-32 sm:h-32" />
            </div>
          </div>
        </div>

        {/* Bottom Two-Card Grid (Matching Image 2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Card: Reminders */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  TODAY
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">Reminders</h3>
              </div>

              <button
                onClick={() => navigate('/patient/reminders')}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer"
              >
                View all
              </button>
            </div>

            <div className="space-y-3">
              {todaysReminders.length > 0 ? (
                todaysReminders.slice(0, 1).map((rem) => {
                  const isMedicine = rem.category === 'Medicine';

                  return (
                    <div
                      key={rem.id}
                      onClick={() => toggleReminderCompleted(rem.id)}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        rem.completed
                          ? 'bg-slate-50 border-slate-200 opacity-60'
                          : 'bg-white hover:bg-slate-50 border-slate-100 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        {/* Pill Capsule Graphic inside rounded box */}
                        {isMedicine ? (
                          <div className="w-10 h-10 rounded-2xl bg-[#fdf2f2] border border-rose-100 flex items-center justify-center shrink-0">
                            {/* 2-color Pill Capsule Graphic */}
                            <div className="w-3.5 h-5 rounded-full overflow-hidden border border-rose-300 shadow-2xs rotate-45 flex flex-col">
                              <div className="h-1/2 bg-rose-500" />
                              <div className="h-1/2 bg-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-lg shrink-0">
                            {rem.category === 'Meal' ? '🍵' : '🧠'}
                          </div>
                        )}

                        <div>
                          <div
                            className={`text-sm sm:text-base font-bold text-slate-900 ${
                              rem.completed ? 'line-through text-slate-500' : ''
                            }`}
                          >
                            {rem.title}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">{rem.time}</div>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {rem.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Bell className="w-4 h-4 text-slate-400 hover:text-emerald-700" />
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-500">
                  No reminders scheduled for today yet.
                </div>
              )}
            </div>
          </div>

          {/* Right Card: Need a little help? */}
          <div className="bg-[#fcf8f3] rounded-3xl border border-[#efe2d2] p-6 sm:p-7 shadow-2xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center font-bold text-sm">
                ?
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                Need a little help?
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                You can listen to instructions, take a pause, or ask a caregiver for assistance at any time.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#ebd8c4]/60 text-xs">
              <span className="text-slate-500">
                Primary Contact: <strong className="text-slate-800">{activePatient.caregiverName.replace(/\s*\(.*?\)/, '')}</strong>
              </span>
              <button
                onClick={() => navigate('/patient/help')}
                className="font-bold text-[#b85437] hover:underline cursor-pointer"
              >
                Help Guide →
              </button>
            </div>
          </div>
        </div>
      </div>
    </ElderlyLayout>
  );
};
