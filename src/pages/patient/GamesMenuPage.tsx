import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Brain, ListOrdered, Clock, Star, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ElderlyLayout } from '../../components/patient/ElderlyLayout';
import { VoiceButton } from '../../components/common/VoiceButton';

export const GamesMenuPage: React.FC = () => {
  const navigate = useNavigate();
  const { activePatient, t, accessibility } = useApp();

  const gamesSpeech = `Here are today's activities. First game is Memory Match, find the matching regional pairs at Level ${activePatient.currentDifficultyMemory}. Second game is Sequence Recall, remember the sequence of regional objects at Level ${activePatient.currentDifficultySequence}.`;

  return (
    <ElderlyLayout title={t.games} subtitle="Choose a calm activity to stimulate your mind.">
      <div className="space-y-6">
        <div className="flex justify-end">
          <VoiceButton
            textToSpeak={gamesSpeech}
            label={t.listen}
            variant="secondary"
          />
        </div>

        {/* Game 1: Memory Match */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border-2 transition-all ${
            accessibility.highContrast
              ? 'bg-neutral-900 border-yellow-400 text-yellow-300'
              : 'bg-white border-emerald-200 hover:border-emerald-300 shadow-md hover:shadow-lg'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4 sm:gap-6">
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center text-4xl sm:text-5xl shrink-0 shadow-sm ${
                  accessibility.highContrast ? 'bg-yellow-400 text-black' : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                🧠
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-800">
                    {t.level} {activePatient.currentDifficultyMemory}
                  </span>
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> 3-5 mins
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black">{t.memoryMatch}</h2>
                <p
                  className={`text-base sm:text-lg max-w-md ${
                    accessibility.highContrast ? 'text-yellow-200' : 'text-slate-600'
                  }`}
                >
                  {t.memoryMatchDesc} Culturally familiar items from {activePatient.stateNER}.
                </p>
              </div>
            </div>

            <button
              id="start-memory-match-btn"
              onClick={() => navigate('/patient/games/memory-match')}
              className={`py-5 px-8 rounded-2xl text-xl sm:text-2xl font-black shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-3 shrink-0 ${
                accessibility.highContrast
                  ? 'bg-yellow-400 text-black border-2 border-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/25'
              }`}
            >
              <Play className="w-7 h-7 fill-current" />
              <span>{t.start.toUpperCase()}</span>
            </button>
          </div>
        </div>

        {/* Game 2: Sequence Recall */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border-2 transition-all ${
            accessibility.highContrast
              ? 'bg-neutral-900 border-yellow-400 text-yellow-300'
              : 'bg-white border-teal-200 hover:border-teal-300 shadow-md hover:shadow-lg'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4 sm:gap-6">
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center text-4xl sm:text-5xl shrink-0 shadow-sm ${
                  accessibility.highContrast ? 'bg-yellow-400 text-black' : 'bg-teal-100 text-teal-800'
                }`}
              >
                🔢
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-teal-100 text-teal-800">
                    {t.level} {activePatient.currentDifficultySequence}
                  </span>
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> 3-4 mins
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black">{t.sequenceRecall}</h2>
                <p
                  className={`text-base sm:text-lg max-w-md ${
                    accessibility.highContrast ? 'text-yellow-200' : 'text-slate-600'
                  }`}
                >
                  {t.sequenceRecallDesc} Watch the sequence, then tap them in the exact order.
                </p>
              </div>
            </div>

            <button
              id="start-sequence-recall-btn"
              onClick={() => navigate('/patient/games/sequence-recall')}
              className={`py-5 px-8 rounded-2xl text-xl sm:text-2xl font-black shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-3 shrink-0 ${
                accessibility.highContrast
                  ? 'bg-yellow-400 text-black border-2 border-white'
                  : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-700/25'
              }`}
            >
              <Play className="w-7 h-7 fill-current" />
              <span>{t.start.toUpperCase()}</span>
            </button>
          </div>
        </div>

        {/* Reassuring note */}
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center text-emerald-900 text-base font-medium">
          🌱 Activities adjust automatically to your comfort level. No rush or time penalties.
        </div>
      </div>
    </ElderlyLayout>
  );
};
