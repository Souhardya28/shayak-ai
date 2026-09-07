import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Award, CheckCircle2, ArrowRight, RotateCcw, Home, Sparkles, Brain, Clock, HelpCircle, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GameSession, AIDecision } from '../../types';
import { VoiceButton } from '../../components/common/VoiceButton';
import { speakText } from '../../utils/speech';

export const GameResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language, accessibility, activePatient, sessions, aiDecisions } = useApp();

  // Retrieve state from navigation or fallback to latest session & decision
  const stateSession = location.state?.session as GameSession | undefined;
  const stateDecision = location.state?.aiDecision as AIDecision | undefined;

  const session = stateSession || sessions[0];
  const aiDecision = stateDecision || aiDecisions[0];

  const resultSpeech = `${t.wellDone}. Your game score is ${session?.score || 85}. Accuracy was ${session?.accuracy || 90}%. The AI adaptive recommendation is: ${aiDecision?.action === 'increase' ? 'Ready for a slightly harder challenge' : aiDecision?.action === 'decrease' ? 'Adjusting to a gentler pace' : 'Maintaining your steady comfortable level'}.`;

  useEffect(() => {
    if (accessibility.voiceGuidance) {
      speakText(resultSpeech, language);
    }
  }, []);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <p className="text-lg text-slate-600">No recent game activity found.</p>
          <button
            onClick={() => navigate('/patient/games')}
            className="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-bold"
          >
            Start a Game
          </button>
        </div>
      </div>
    );
  }

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'increase':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'decrease':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'maintain':
      default:
        return 'bg-blue-100 text-blue-900 border-blue-300';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'increase':
        return 'Challenge Level Gently Increased ↗';
      case 'decrease':
        return 'Adapted to a Gentler Pace ↘';
      case 'maintain':
      default:
        return 'Optimal Comfort Level Maintained ➔';
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 transition-colors ${
        accessibility.highContrast ? 'bg-black text-yellow-300' : 'bg-emerald-50/50 text-slate-900'
      }`}
    >
      <div className="max-w-xl w-full mx-auto space-y-6 my-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Celebration Card */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border-2 text-center shadow-xl space-y-4 ${
            accessibility.highContrast
              ? 'bg-neutral-900 border-yellow-400 text-yellow-300'
              : 'bg-white border-emerald-100'
          }`}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl text-5xl bg-emerald-100 text-emerald-800 shadow-xs mb-1">
            🎉
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{t.wellDone}</h1>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            Completed: <strong>{session.gameTitle}</strong>
          </p>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-xs font-bold uppercase text-emerald-700">{t.score}</span>
              <div className="text-3xl font-black text-emerald-900 mt-0.5">{session.score}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-center">
              <span className="text-xs font-bold uppercase text-teal-700">{t.accuracy}</span>
              <div className="text-3xl font-black text-teal-900 mt-0.5">{session.accuracy}%</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-center">
              <span className="text-xs font-bold uppercase text-blue-700">{t.responseTime}</span>
              <div className="text-3xl font-black text-blue-900 mt-0.5">{session.responseTime}s</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-center">
              <span className="text-xs font-bold uppercase text-purple-700">{t.difficulty}</span>
              <div className="text-3xl font-black text-purple-900 mt-0.5">{t.level} {session.difficulty}</div>
            </div>
          </div>

          <VoiceButton
            textToSpeak={resultSpeech}
            label={t.listen}
            variant="secondary"
            className="w-full py-3"
          />
        </div>

        {/* AI Recommendation & Transparent Explanation Box */}
        {aiDecision && (
          <div
            className={`p-6 rounded-3xl border-2 space-y-4 shadow-sm ${
              accessibility.highContrast
                ? 'bg-neutral-900 border-yellow-400 text-yellow-300'
                : 'bg-white border-teal-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-teal-700" />
                <span className="text-sm font-bold uppercase tracking-wider text-teal-800">
                  {t.aiRecommendation}
                </span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getActionBadgeColor(
                  aiDecision.action
                )}`}
              >
                {getActionLabel(aiDecision.action)}
              </span>
            </div>

            {/* Level Transition Pill */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 font-bold text-slate-800 text-base">
              <span>Previous: Level {aiDecision.previousDifficulty}</span>
              <ArrowRight className="w-5 h-5 text-slate-400" />
              <span className="text-emerald-700">Next Activity: Level {aiDecision.newDifficulty}</span>
            </div>

            {/* Explainable Factor Breakdown */}
            <div className="space-y-2 pt-1">
              <div className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{t.whyDifficultyChanged}</span>
              </div>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed bg-teal-50/60 p-3.5 rounded-2xl border border-teal-100">
                "{aiDecision.explanation}"
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {aiDecision.factors.map((factor, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl border bg-white flex flex-col text-xs font-semibold"
                  >
                    <span className="text-slate-500">{factor.label}</span>
                    <span
                      className={`text-sm font-black mt-0.5 ${
                        factor.status === 'positive'
                          ? 'text-emerald-700'
                          : factor.status === 'attention'
                          ? 'text-amber-700'
                          : 'text-slate-700'
                      }`}
                    >
                      {factor.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <button
            id="result-continue-btn"
            onClick={() => navigate('/patient')}
            className={`flex-1 py-4 px-6 rounded-2xl text-xl font-black shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${
              accessibility.highContrast
                ? 'bg-yellow-400 text-black border-2 border-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/25'
            }`}
          >
            <Home className="w-6 h-6" />
            <span>{t.continue.toUpperCase()}</span>
          </button>

          <button
            onClick={() =>
              navigate(
                session.game === 'memory-match'
                  ? '/patient/games/memory-match'
                  : '/patient/games/sequence-recall'
              )
            }
            className="py-4 px-6 rounded-2xl text-lg font-bold bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>{t.playAgain}</span>
          </button>
        </div>

        {/* Medical Boundary Disclaimer Notice */}
        <p className="text-center text-xs text-slate-500 max-w-md mx-auto pt-2">
          * Non-diagnostic cognitive engagement activity. Game scores reflect interaction performance
          and are not medical or clinical evaluations.
        </p>
      </div>
    </div>
  );
};
