import React, { useState } from 'react';
import { Brain, ArrowRight, CheckCircle2, AlertTriangle, Sparkles, Filter, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CaregiverLayout } from '../../components/caregiver/CaregiverLayout';
import { ADAPTIVE_THRESHOLDS } from '../../ai/adaptiveDifficulty';

export const CaregiverAIDecisionsPage: React.FC = () => {
  const { activePatient, aiDecisions } = useApp();
  const [filterAction, setFilterAction] = useState<string>('all');

  const patientDecisions = aiDecisions.filter((d) => d.patientId === activePatient.id);
  const filteredDecisions = patientDecisions.filter((d) => {
    if (filterAction === 'all') return true;
    return d.action === filterAction;
  });

  return (
    <CaregiverLayout
      title="Explainable AI Adaptive Difficulty Log"
      subtitle="Transparent rule-based telemetry audit explaining every automated difficulty modification."
    >
      <div className="space-y-6">
        {/* Rule Engine Transparency Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <h3 className="text-lg font-bold text-slate-900">Configured Decision Thresholds</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            The platform executes a deterministic, rule-based adaptive engine that continuously balances
            cognitive engagement against frustration.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
              <span className="font-bold text-emerald-900 block text-sm">
                Increase Difficulty (+1)
              </span>
              <ul className="mt-1 space-y-0.5 text-emerald-800 list-disc list-inside">
                <li>Accuracy &ge; {ADAPTIVE_THRESHOLDS.HIGH_ACCURACY}%</li>
                <li>Response Time &le; {ADAPTIVE_THRESHOLDS.FAST_RESPONSE_TIME}s</li>
                <li>Mistakes &le; {ADAPTIVE_THRESHOLDS.MAX_ERRORS_FOR_INCREASE}</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs">
              <span className="font-bold text-blue-900 block text-sm">
                Maintain Level (&plusmn;0)
              </span>
              <ul className="mt-1 space-y-0.5 text-blue-800 list-disc list-inside">
                <li>Balanced accuracy (60% - 84%)</li>
                <li>Normal pacing and steady recall</li>
                <li>Consolidating memory comfort</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs">
              <span className="font-bold text-amber-900 block text-sm">
                Decrease Difficulty (-1)
              </span>
              <ul className="mt-1 space-y-0.5 text-amber-800 list-disc list-inside">
                <li>Accuracy &lt; {ADAPTIVE_THRESHOLDS.LOW_ACCURACY}%</li>
                <li>Repeated errors &ge; {ADAPTIVE_THRESHOLDS.HIGH_ERRORS}</li>
                <li>Reduces friction & maintains confidence</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Audit Filter */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-500 uppercase">Filter Action:</span>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="bg-white rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 border border-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">All Actions ({patientDecisions.length})</option>
              <option value="increase">Level Increases</option>
              <option value="maintain">Level Maintained</option>
              <option value="decrease">Level Decreases</option>
            </select>
          </div>
        </div>

        {/* Decisions Timeline List */}
        <div className="space-y-4">
          {filteredDecisions.length > 0 ? (
            filteredDecisions.map((decision) => {
              const formattedDate = new Date(decision.timestamp).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });
              const formattedTime = new Date(decision.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={decision.id}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-lg">
                        {decision.game === 'memory-match' ? '🧠' : '🔢'}
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-black text-slate-900">
                          {decision.gameTitle}
                        </h4>
                        <span className="text-xs text-slate-400">
                          {formattedDate} at {formattedTime}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                          decision.action === 'increase'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : decision.action === 'decrease'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-blue-100 text-blue-800 border border-blue-300'
                        }`}
                      >
                        {decision.action === 'increase'
                          ? 'Increased Difficulty ↗'
                          : decision.action === 'decrease'
                          ? 'Decreased Difficulty ↘'
                          : 'Maintained Level ➔'}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                        Level {decision.previousDifficulty} → Level {decision.newDifficulty}
                      </span>
                    </div>
                  </div>

                  {/* Explanation text */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="text-xs font-bold uppercase text-slate-500 mb-1">
                      Human-Readable Rationale:
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                      "{decision.explanation}"
                    </p>
                  </div>

                  {/* Factor Cards */}
                  <div>
                    <div className="text-xs font-bold uppercase text-slate-400 mb-1.5">
                      Evaluated Factors:
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {decision.factors.map((factor, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl border border-slate-200 bg-white text-xs"
                        >
                          <span className="text-slate-500 block">{factor.label}</span>
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
              );
            })
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-xl">
                🧠
              </div>
              <h4 className="font-bold text-slate-800 text-base">
                No AI Adaptive Decisions Logged Yet for {activePatient.name}
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                The explainable AI engine evaluates performance after each completed game session in the Patient App to calibrate difficulty.
              </p>
            </div>
          )}
        </div>
      </div>
    </CaregiverLayout>
  );
};
