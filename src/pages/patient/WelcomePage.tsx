import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Sparkles, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VoiceButton } from '../../components/common/VoiceButton';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { activePatient, t, language, accessibility } = useApp();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.goodMorning;
    if (hour < 17) return t.goodAfternoon;
    return t.goodEvening;
  };

  const welcomeMessage = `${getGreeting()}, ${activePatient.name}. ${t.welcome} to CogniCare. Let's do a short activity together today.`;

  return (
    <div
      className={`min-h-[calc(100vh-50px)] flex flex-col items-center justify-center p-6 text-center transition-colors ${
        accessibility.highContrast ? 'bg-black text-yellow-300' : 'bg-gradient-to-b from-emerald-50 to-teal-100/60'
      }`}
    >
      <div className="max-w-md w-full mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Friendly regional welcome icon & badge */}
        <div className="flex flex-col items-center justify-center">
          <div
            className={`w-28 h-28 rounded-3xl flex items-center justify-center text-6xl shadow-xl border-4 ${
              accessibility.highContrast
                ? 'bg-yellow-400 text-black border-white'
                : 'bg-white border-emerald-200 shadow-emerald-700/10'
            }`}
          >
            🙏
          </div>
          <span className="mt-4 px-4 py-1 rounded-full text-sm font-bold tracking-wide uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
            {activePatient.stateNER} • {t.appName}
          </span>
        </div>

        {/* Greeting & Headline */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            {getGreeting()}, <br />
            <span className={accessibility.highContrast ? 'text-white' : 'text-emerald-800'}>
              {activePatient.name}
            </span>
          </h1>
          <p
            className={`text-xl sm:text-2xl font-medium leading-relaxed max-w-sm mx-auto ${
              accessibility.highContrast ? 'text-yellow-200' : 'text-slate-700'
            }`}
          >
            "Let's do a short, gentle activity together."
          </p>
        </div>

        {/* Action Controls: START and LISTEN */}
        <div className="flex flex-col gap-4 pt-2">
          <button
            id="welcome-start-activity-btn"
            onClick={() => navigate('/patient')}
            className={`w-full py-5 px-8 rounded-3xl text-2xl sm:text-3xl font-black shadow-xl transition-all transform active:scale-95 cursor-pointer flex items-center justify-center gap-3 ${
              accessibility.highContrast
                ? 'bg-yellow-400 text-black border-4 border-white hover:bg-yellow-300'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/30'
            }`}
          >
            <Play className="w-8 h-8 fill-current" />
            <span>{t.start.toUpperCase()}</span>
          </button>

          {/* Voice Assistance Button */}
          <VoiceButton
            textToSpeak={welcomeMessage}
            label={t.listen}
            variant="large"
            className="w-full py-4 text-xl"
          />
        </div>

        {/* Calm reassuring note */}
        <div
          className={`flex items-center justify-center gap-2 text-sm font-medium ${
            accessibility.highContrast ? 'text-yellow-300' : 'text-slate-500'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span>Caregiver: {activePatient.caregiverName}</span>
        </div>
      </div>
    </div>
  );
};
