import React, { useState } from 'react';
import { History, Filter, Search, Download, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CaregiverLayout } from '../../components/caregiver/CaregiverLayout';

export const CaregiverSessionsPage: React.FC = () => {
  const { activePatient, sessions } = useApp();
  const [selectedGameFilter, setSelectedGameFilter] = useState<string>('all');

  const patientSessions = sessions.filter((s) => s.patientId === activePatient.id);
  const filteredSessions = patientSessions.filter((s) => {
    if (selectedGameFilter === 'all') return true;
    return s.game === selectedGameFilter;
  });

  return (
    <CaregiverLayout
      title="Session Logs & Gameplay Telemetry"
      subtitle={`Granular records of cognitive activities completed by ${activePatient.name}.`}
    >
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-500 uppercase">Filter Activity:</span>
            <select
              value={selectedGameFilter}
              onChange={(e) => setSelectedGameFilter(e.target.value)}
              className="bg-slate-100 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 border border-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">All Activities ({patientSessions.length})</option>
              <option value="memory-match">Memory Match Only</option>
              <option value="sequence-recall">Sequence Recall Only</option>
            </select>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing {filteredSessions.length} recorded session(s)
          </div>
        </div>

        {/* Telemetry Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase text-xs font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Activity</th>
                <th className="py-3.5 px-4">Difficulty</th>
                <th className="py-3.5 px-4">Score</th>
                <th className="py-3.5 px-4">Accuracy</th>
                <th className="py-3.5 px-4">Response Time</th>
                <th className="py-3.5 px-4">Mistakes</th>
                <th className="py-3.5 px-4">Hints</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSessions.length > 0 ? (
                filteredSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-xs font-medium text-slate-500">
                      {new Date(session.timestamp).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric'
                      })}{' '}
                      •{' '}
                      {new Date(session.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <span>{session.game === 'memory-match' ? '🧠' : '🔢'}</span>
                      <span>{session.gameTitle}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-700">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-xs">
                        Level {session.difficulty}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900">{session.score}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-black ${
                          session.accuracy >= 85
                            ? 'text-emerald-700'
                            : session.accuracy >= 65
                            ? 'text-teal-700'
                            : 'text-amber-700'
                        }`}
                      >
                        {session.accuracy}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium">{session.responseTime}s</td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">{session.errors}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">{session.hints}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl">
                        🎮
                      </div>
                      <p className="font-bold text-slate-700">
                        No session logs recorded yet for {activePatient.name}
                      </p>
                      <p className="text-xs text-slate-400 max-w-sm">
                        Activities completed in the Patient App will be recorded here with live accuracy, response time, and mistake counts.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </CaregiverLayout>
  );
};
