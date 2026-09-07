import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Flame, Calendar, CheckCircle2, TrendingUp, Sparkles, Brain, Play } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { ElderlyLayout } from '../../components/patient/ElderlyLayout';
import { VoiceButton } from '../../components/common/VoiceButton';

export const PatientProgressPage: React.FC = () => {
  const navigate = useNavigate();
  const { activePatient, t, sessions, accessibility } = useApp();

  // Filter patient's sessions
  const patientSessions = sessions.filter((s) => s.patientId === activePatient.id);
  const totalGames = patientSessions.length;
  const avgAccuracy =
    totalGames > 0
      ? Math.round(patientSessions.reduce((acc, s) => acc + s.accuracy, 0) / totalGames)
      : 0;

  // Real Day Streak computation based on active patient sessions
  const uniqueDays = new Set(patientSessions.map((s) => new Date(s.timestamp).toDateString())).size;
  const streakDisplay = `${uniqueDays} Day${uniqueDays === 1 ? '' : 's'}`;

  // Chart data: last 7 sessions
  const recentSeven = [...patientSessions].slice(0, 7).reverse();
  const chartData = recentSeven.map((s, idx) => {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const date = new Date(s.timestamp);
    const dayLabel = dayNames[date.getDay() === 0 ? 6 : date.getDay() - 1] || `Day ${idx + 1}`;
    return {
      name: dayLabel,
      accuracy: s.accuracy,
      score: s.score,
      game: s.gameTitle
    };
  });

  const progressSpeech =
    totalGames > 0
      ? `Here is your activity progress for this week, ${activePatient.name}. You have completed ${totalGames} cognitive activities with an average accuracy of ${avgAccuracy}%. Keep up the wonderful daily routine!`
      : `Welcome, ${activePatient.name}. You have not completed any activities yet. Try starting with Memory Match to begin your daily journey!`;

  return (
    <ElderlyLayout title={t.progress} subtitle="Your joyful daily cognitive engagement summary.">
      <div className="space-y-6">
        <div className="flex justify-end">
          <VoiceButton
            textToSpeak={progressSpeech}
            label={t.listen}
            variant="secondary"
          />
        </div>

        {/* Weekly Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div
            className={`p-5 rounded-3xl border-2 text-center ${
              accessibility.highContrast
                ? 'bg-neutral-900 border-yellow-400 text-yellow-300'
                : 'bg-white border-emerald-100 shadow-sm'
            }`}
          >
            <div className="text-3xl mb-1">🎮</div>
            <span className="text-xs sm:text-sm font-bold uppercase text-slate-500">Activities</span>
            <div className="text-3xl sm:text-4xl font-black text-emerald-800 mt-1">{totalGames}</div>
          </div>

          <div
            className={`p-5 rounded-3xl border-2 text-center ${
              accessibility.highContrast
                ? 'bg-neutral-900 border-yellow-400 text-yellow-300'
                : 'bg-white border-emerald-100 shadow-sm'
            }`}
          >
            <div className="text-3xl mb-1">🎯</div>
            <span className="text-xs sm:text-sm font-bold uppercase text-slate-500">{t.accuracy}</span>
            <div className="text-3xl sm:text-4xl font-black text-teal-800 mt-1">
              {totalGames > 0 ? `${avgAccuracy}%` : '0%'}
            </div>
          </div>

          <div
            className={`p-5 rounded-3xl border-2 text-center ${
              accessibility.highContrast
                ? 'bg-neutral-900 border-yellow-400 text-yellow-300'
                : 'bg-white border-emerald-100 shadow-sm'
            }`}
          >
            <div className="text-3xl mb-1">🔥</div>
            <span className="text-xs sm:text-sm font-bold uppercase text-slate-500">Day Streak</span>
            <div className="text-3xl sm:text-4xl font-black text-amber-800 mt-1">{streakDisplay}</div>
          </div>

          <div
            className={`p-5 rounded-3xl border-2 text-center ${
              accessibility.highContrast
                ? 'bg-neutral-900 border-yellow-400 text-yellow-300'
                : 'bg-white border-emerald-100 shadow-sm'
            }`}
          >
            <div className="text-3xl mb-1">⭐</div>
            <span className="text-xs sm:text-sm font-bold uppercase text-slate-500">Current Level</span>
            <div className="text-3xl sm:text-4xl font-black text-purple-800 mt-1">
              L{activePatient.currentDifficultyMemory || 1}
            </div>
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div
          className={`p-6 rounded-3xl border-2 space-y-4 ${
            accessibility.highContrast
              ? 'bg-neutral-900 border-yellow-400 text-yellow-300'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl sm:text-2xl font-bold">Weekly Performance Trend</h2>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
              Daily Accuracy %
            </span>
          </div>

          {chartData.length > 0 ? (
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 13, fontWeight: 600 }} stroke="#64748B" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#64748B" />
                  <Tooltip
                    formatter={(value: any) => [`${value}%`, 'Accuracy']}
                    contentStyle={{
                      borderRadius: '16px',
                      borderColor: '#CBD5E1',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Bar dataKey="accuracy" fill="#059669" radius={[10, 10, 0, 0]} barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center text-center p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <span className="text-3xl mb-2">🌿</span>
              <p className="font-bold text-slate-700 text-sm">No activity recorded for this week yet</p>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Completing a game will show your daily accuracy bar and progress here.
              </p>
              <button
                onClick={() => navigate('/patient/games/memory-match')}
                className="mt-3 px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Play Memory Match →
              </button>
            </div>
          )}
        </div>

        {/* Recent Completed Activities List */}
        <div
          className={`p-6 rounded-3xl border-2 space-y-4 ${
            accessibility.highContrast
              ? 'bg-neutral-900 border-yellow-400 text-yellow-300'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <h2 className="text-xl sm:text-2xl font-bold">Recent Completed Activities</h2>

          {patientSessions.length > 0 ? (
            <div className="space-y-3">
              {patientSessions.slice(0, 4).map((s) => (
                <div
                  key={s.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{s.game === 'memory-match' ? '🧠' : '🔢'}</span>
                    <div>
                      <div className="text-base sm:text-lg font-bold text-slate-900">{s.gameTitle}</div>
                      <div className="text-xs sm:text-sm text-slate-500 font-medium">
                        Level {s.difficulty} • Score {s.score}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-black text-emerald-700">{s.accuracy}%</div>
                    <div className="text-xs text-slate-400 font-medium">{s.responseTime}s avg</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
              No games completed yet. Start your first activity to see your recent scores and response times here!
            </div>
          )}
        </div>

        {/* Positive Reassurance Message */}
        <div className="p-4 rounded-2xl bg-emerald-100/60 border border-emerald-300 text-emerald-950 text-base font-medium flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>
            {totalGames > 0
              ? 'Wonderful consistency! Exercising memory with familiar regional items brings calm and mental sharpness.'
              : `Welcome to CogniCare, ${activePatient.name}! Take your time and enjoy gentle, pressure-free activities.`}
          </span>
        </div>
      </div>
    </ElderlyLayout>
  );
};
