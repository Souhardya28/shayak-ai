import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, Lightbulb, Home, RefreshCw, Eye, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { NER_CULTURAL_ITEMS } from '../../data/nerContent';
import { NERItem } from '../../types';
import { speakText } from '../../utils/speech';

type GamePhase = 'memorize' | 'recall' | 'feedback' | 'completed';

export const SequenceRecallGame: React.FC = () => {
  const navigate = useNavigate();
  const { activePatient, t, language, accessibility, recordGameSession } = useApp();

  const currentDifficulty = Math.min(5, Math.max(1, activePatient.currentDifficultySequence || 2));
  // Sequence length by level
  const lengthMap: Record<number, number> = { 1: 3, 2: 4, 3: 5, 4: 6, 5: 7 };
  const sequenceLength = lengthMap[currentDifficulty] || 3;

  const [phase, setPhase] = useState<GamePhase>('memorize');
  const [targetSequence, setTargetSequence] = useState<NERItem[]>([]);
  const [candidatePool, setCandidatePool] = useState<NERItem[]>([]);
  const [userSelection, setUserSelection] = useState<NERItem[]>([]);
  const [countdown, setCountdown] = useState<number>(5);
  const [errors, setErrors] = useState<number>(0);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Telemetry
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<any>(null);

  // Initialize round
  const startNewRound = () => {
    const shuffled = [...NER_CULTURAL_ITEMS].sort(() => 0.5 - Math.random());
    const seq = shuffled.slice(0, sequenceLength);

    // Candidates include target items + 2 extra distractors
    const extraDistractors = shuffled.slice(sequenceLength, sequenceLength + 2);
    const pool = [...seq, ...extraDistractors].sort(() => 0.5 - Math.random());

    setTargetSequence(seq);
    setCandidatePool(pool);
    setUserSelection([]);
    setIsCorrect(null);
    setCountdown(Math.max(4, sequenceLength * 1.5));
    setPhase('memorize');
    startTimeRef.current = Date.now();

    if (accessibility.voiceGuidance) {
      speakText(`Remember these ${sequenceLength} objects in order.`, language);
    }
  };

  useEffect(() => {
    startNewRound();
  }, [currentDifficulty]);

  // Memorize countdown timer
  useEffect(() => {
    let timer: any = null;
    if (phase === 'memorize') {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setPhase('recall');
            if (accessibility.voiceGuidance) {
              speakText('Now select the objects in the same order.', language);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [phase, language, accessibility.voiceGuidance]);

  // Overall timer
  useEffect(() => {
    if (phase === 'recall') {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  // Handle user tapping a candidate item
  const handleSelectCandidate = (item: NERItem) => {
    if (phase !== 'recall') return;
    if (userSelection.length >= sequenceLength) return;

    const updated = [...userSelection, item];
    setUserSelection(updated);

    // If reached sequence length, evaluate
    if (updated.length === sequenceLength) {
      checkSequence(updated);
    }
  };

  // Deselect from slot
  const handleRemoveFromSelection = (index: number) => {
    if (phase !== 'recall') return;
    setUserSelection((prev) => prev.filter((_, i) => i !== index));
  };

  // Check sequence result
  const checkSequence = (selection: NERItem[]) => {
    const isMatch = selection.every((item, idx) => item.id === targetSequence[idx]?.id);

    if (isMatch) {
      setIsCorrect(true);
      setPhase('completed');
      try {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      } catch {}

      if (accessibility.voiceGuidance) {
        speakText('Well done! You remembered the exact sequence.', language);
      }

      // Calculate score & telemetry
      const totalTime = Math.max(3, elapsedSeconds || 7);
      const avgResponseTime = Number((totalTime / sequenceLength).toFixed(1));
      const accuracy = errors === 0 ? 100 : Math.max(45, Math.round((1 - errors / (errors + 2)) * 100));

      const baseScore = 60;
      const lengthBonus = sequenceLength * 8;
      const speedBonus = Math.max(0, 25 - Math.round(avgResponseTime * 3));
      const errorPenalty = errors * 4;
      const hintPenalty = hintsUsed * 3;
      const finalScore = Math.max(35, Math.min(100, baseScore + lengthBonus + speedBonus - errorPenalty - hintPenalty));

      const { session, aiDecision } = recordGameSession({
        game: 'sequence-recall',
        gameTitle: t.sequenceRecall,
        score: finalScore,
        accuracy,
        responseTime: avgResponseTime,
        errors,
        hints: hintsUsed,
        difficulty: currentDifficulty,
        completed: true
      });

      setTimeout(() => {
        navigate('/patient/results', {
          state: { session, aiDecision }
        });
      }, 1600);
    } else {
      setIsCorrect(false);
      setErrors((prev) => prev + 1);
      if (accessibility.voiceGuidance) {
        speakText('The order was not quite right. Try again, you can do it.', language);
      }
    }
  };

  // Hint: peek at next correct item
  const handleHint = () => {
    if (phase !== 'recall') return;
    setHintsUsed((prev) => prev + 1);
    const nextNeededIdx = userSelection.length;
    if (nextNeededIdx < targetSequence.length) {
      const nextItem = targetSequence[nextNeededIdx];
      speakText(`Hint: The next item is ${nextItem.name}`, language);
    }
  };

  const handleRepeatInstructions = () => {
    const text = 'Sequence Recall. First remember the order shown. Then tap the items below to rebuild the same sequence.';
    speakText(text, language);
  };

  return (
    <div
      className={`min-h-screen flex flex-col p-3 sm:p-6 transition-colors ${
        accessibility.highContrast ? 'bg-black text-yellow-300' : 'bg-emerald-50/40 text-slate-900'
      }`}
    >
      {/* Top Game Bar */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <button
          onClick={() => navigate('/patient/games')}
          className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 font-bold cursor-pointer transition-all active:scale-95 ${
            accessibility.highContrast
              ? 'bg-yellow-400 text-black border border-white'
              : 'bg-white hover:bg-slate-100 text-slate-700 shadow-xs border border-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-base sm:text-lg">{t.exit}</span>
        </button>

        <div className="text-center">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-teal-700">
            {t.level} {currentDifficulty} • {sequenceLength} Objects Sequence
          </span>
          <div className="text-lg sm:text-xl font-black">
            {phase === 'memorize' ? 'Memorize Order' : `${userSelection.length} / ${sequenceLength} Selected`}
          </div>
        </div>

        <button
          onClick={handleRepeatInstructions}
          className={`px-3 py-2 rounded-2xl font-bold flex items-center gap-1.5 cursor-pointer ${
            accessibility.highContrast
              ? 'bg-neutral-800 text-yellow-300 border border-yellow-400'
              : 'bg-white text-slate-700 border border-slate-200 shadow-xs'
          }`}
        >
          <Volume2 className="w-5 h-5 text-emerald-600" />
          <span className="hidden sm:inline">Listen</span>
        </button>
      </div>

      {/* STAGE 1: MEMORIZE PHASE */}
      {phase === 'memorize' && (
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center space-y-6 my-4 animate-in fade-in duration-200">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold bg-teal-100 text-teal-800">
              <Eye className="w-4 h-4" />
              <span>{t.rememberOrder}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">Remember This Sequence:</h2>
            <div className="text-sm sm:text-base font-semibold text-slate-600">
              Hiding in <span className="text-2xl font-black text-teal-700 mx-1">{countdown}</span> seconds
            </div>
          </div>

          {/* Large Visual Sequence Display */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 p-6 bg-white rounded-3xl border-2 border-teal-200 shadow-lg max-w-2xl w-full">
            {targetSequence.map((item, idx) => (
              <React.Fragment key={item.id}>
                <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-teal-50 border-2 border-teal-300 w-24 sm:w-28 text-center">
                  <span className="text-xs font-bold text-teal-800 mb-1">#{idx + 1}</span>
                  <span className="text-4xl sm:text-5xl my-1">{item.emoji}</span>
                  <span className="text-xs font-bold truncate max-w-full text-slate-800">{item.name}</span>
                </div>
                {idx < targetSequence.length - 1 && (
                  <ArrowRight className="w-6 h-6 text-teal-400 shrink-0 hidden sm:block" />
                )}
              </React.Fragment>
            ))}
          </div>

          <button
            onClick={() => setPhase('recall')}
            className="py-3 px-8 rounded-2xl text-lg font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md cursor-pointer transition-transform active:scale-95"
          >
            I'm Ready Now
          </button>
        </div>
      )}

      {/* STAGE 2: RECALL & SUBMIT PHASE */}
      {(phase === 'recall' || phase === 'completed') && (
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col space-y-6 my-3 animate-in fade-in duration-200">
          {/* Target Sequence Slots (Patient taps to fill) */}
          <div className="p-5 sm:p-6 bg-white rounded-3xl border-2 border-teal-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-base sm:text-lg font-bold text-slate-800">
                {t.selectInOrder} ({userSelection.length}/{sequenceLength})
              </span>
              {userSelection.length > 0 && phase === 'recall' && (
                <button
                  onClick={() => setUserSelection([])}
                  className="text-sm font-bold text-rose-600 hover:underline cursor-pointer"
                >
                  Clear Selection
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-3">
              {Array.from({ length: sequenceLength }).map((_, slotIdx) => {
                const selectedItem = userSelection[slotIdx];

                return (
                  <div
                    key={slotIdx}
                    onClick={() => selectedItem && handleRemoveFromSelection(slotIdx)}
                    className={`h-28 rounded-2xl border-2 flex flex-col items-center justify-center p-2 text-center transition-all ${
                      selectedItem
                        ? 'bg-teal-50 border-teal-400 cursor-pointer shadow-xs hover:border-rose-400'
                        : 'border-dashed border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-400 mb-1">Slot {slotIdx + 1}</span>
                    {selectedItem ? (
                      <>
                        <span className="text-3xl sm:text-4xl">{selectedItem.emoji}</span>
                        <span className="text-[11px] font-bold truncate max-w-full mt-1 text-slate-800">
                          {selectedItem.name}
                        </span>
                      </>
                    ) : (
                      <span className="text-xl text-slate-300">?</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Feedback banner if incorrect */}
          {isCorrect === false && (
            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-800 font-bold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                <span>Order was slightly off. Tap Clear or adjust items to try again!</span>
              </div>
              <button
                onClick={() => {
                  setUserSelection([]);
                  setIsCorrect(null);
                }}
                className="px-4 py-1.5 rounded-xl bg-rose-600 text-white text-sm font-bold"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Candidate Pool of Cultural Items */}
          <div className="space-y-2">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Tap items in the correct order:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {candidatePool.map((item) => {
                const isAlreadySelected = userSelection.some((s) => s.id === item.id);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectCandidate(item)}
                    disabled={isAlreadySelected || userSelection.length >= sequenceLength}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all select-none cursor-pointer transform active:scale-95 ${
                      isAlreadySelected
                        ? 'opacity-35 border-slate-200 bg-slate-100'
                        : 'bg-white hover:bg-teal-50 border-teal-200 hover:border-teal-400 shadow-sm'
                    }`}
                  >
                    <span className="text-4xl sm:text-5xl">{item.emoji}</span>
                    <span className="text-sm sm:text-base font-bold text-slate-800 mt-1 truncate max-w-full">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-teal-700 font-medium">{item.category}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Action Controls */}
      <div className="max-w-4xl mx-auto w-full pt-4 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-3">
        <button
          onClick={handleHint}
          disabled={phase !== 'recall' || userSelection.length >= sequenceLength}
          className={`py-4 px-4 rounded-2xl text-base sm:text-lg font-bold flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 disabled:opacity-40 ${
            accessibility.highContrast
              ? 'bg-yellow-400 text-black border-2 border-white'
              : 'bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 text-amber-900 shadow-xs'
          }`}
        >
          <Lightbulb className="w-6 h-6 text-amber-700" />
          <span>{t.hint} ({hintsUsed})</span>
        </button>

        <button
          onClick={startNewRound}
          className={`py-4 px-4 rounded-2xl text-base sm:text-lg font-bold flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 ${
            accessibility.highContrast
              ? 'bg-neutral-800 text-yellow-300 border border-yellow-400'
              : 'bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700'
          }`}
        >
          <RefreshCw className="w-5 h-5" />
          <span>New Sequence</span>
        </button>

        {userSelection.length === sequenceLength && phase === 'recall' && (
          <button
            onClick={() => checkSequence(userSelection)}
            className="col-span-2 sm:col-span-1 py-4 px-6 rounded-2xl text-lg font-black bg-teal-600 hover:bg-teal-700 text-white shadow-lg cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span>Check Order</span>
          </button>
        )}
      </div>
    </div>
  );
};
