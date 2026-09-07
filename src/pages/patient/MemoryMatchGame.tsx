import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, Lightbulb, Pause, Play, Home, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { NER_CULTURAL_ITEMS } from '../../data/nerContent';
import { NERItem } from '../../types';
import { VoiceButton } from '../../components/common/VoiceButton';
import { speakText } from '../../utils/speech';

interface MemoryCardItem {
  instanceId: string;
  itemId: string;
  item: NERItem;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryMatchGame: React.FC = () => {
  const navigate = useNavigate();
  const { activePatient, t, language, accessibility, recordGameSession } = useApp();

  // Difficulty determines pair count
  const currentDifficulty = Math.min(5, Math.max(1, activePatient.currentDifficultyMemory || 2));
  const pairCountMap: Record<number, number> = { 1: 3, 2: 4, 3: 5, 4: 6, 5: 7 };
  const numPairs = pairCountMap[currentDifficulty] || 4;

  const [cards, setCards] = useState<MemoryCardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [matchesCount, setMatchesCount] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [errors, setErrors] = useState<number>(0);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('Tap any card to begin.');

  // Telemetry timing
  const startTimeRef = useRef<number>(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const timerRef = useRef<any>(null);

  // Initialize game cards
  const initializeGame = () => {
    // Select numPairs distinct items from NER_CULTURAL_ITEMS
    const shuffledItems = [...NER_CULTURAL_ITEMS].sort(() => 0.5 - Math.random());
    const selected = shuffledItems.slice(0, numPairs);

    const deck: MemoryCardItem[] = [];
    selected.forEach((item, idx) => {
      deck.push({
        instanceId: `${item.id}-a-${idx}`,
        itemId: item.id,
        item,
        isFlipped: false,
        isMatched: false
      });
      deck.push({
        instanceId: `${item.id}-b-${idx}`,
        itemId: item.id,
        item,
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle deck
    const shuffledDeck = deck.sort(() => 0.5 - Math.random());
    setCards(shuffledDeck);
    setFlippedIndices([]);
    setIsProcessing(false);
    setMatchesCount(0);
    setAttempts(0);
    setErrors(0);
    setHintsUsed(0);
    setElapsedSeconds(0);
    setFeedbackMessage('Tap two cards to find matching regional objects.');
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    initializeGame();
    if (accessibility.voiceGuidance) {
      speakText('Memory Match. Tap two cards to find matching pairs.', language);
    }
  }, [currentDifficulty]);

  // Timer loop
  useEffect(() => {
    if (!isPaused && matchesCount < numPairs) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, matchesCount, numPairs]);

  // Card click handler
  const handleCardClick = (index: number) => {
    if (isPaused || isProcessing) return;
    const card = cards[index];
    if (card.isFlipped || card.isMatched) return;

    // Flip card
    const nextFlipped = [...flippedIndices, index];
    const nextCards = cards.map((c, i) => (i === index ? { ...c, isFlipped: true } : c));
    setCards(nextCards);
    setFlippedIndices(nextFlipped);

    if (nextFlipped.length === 2) {
      setIsProcessing(true);
      setAttempts((prev) => prev + 1);

      const [firstIdx, secondIdx] = nextFlipped;
      const firstCard = nextCards[firstIdx];
      const secondCard = nextCards[secondIdx];

      if (firstCard.itemId === secondCard.itemId) {
        // MATCH FOUND
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isMatched: true, isFlipped: true } : c
            )
          );
          setMatchesCount((prev) => {
            const updated = prev + 1;
            setFeedbackMessage(`${t.matchFound} (${firstCard.item.name})`);
            if (accessibility.voiceGuidance) {
              speakText('Great match! ' + firstCard.item.name, language);
            }

            // Check if game won
            if (updated === numPairs) {
              handleGameCompletion();
            }
            return updated;
          });
          setFlippedIndices([]);
          setIsProcessing(false);
        }, 500);
      } else {
        // NO MATCH
        setErrors((prev) => prev + 1);
        setFeedbackMessage(t.tryAgain);
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedIndices([]);
          setIsProcessing(false);
        }, 1100);
      }
    }
  };

  // Provide a friendly Hint
  const handleHint = () => {
    if (isProcessing || matchesCount >= numPairs) return;
    setHintsUsed((prev) => prev + 1);

    // Find an unmatched pair
    const unmatched = cards.filter((c) => !c.isMatched);
    if (unmatched.length < 2) return;

    const targetItemId = unmatched[0].itemId;
    // Reveal all cards with this itemId for 1.2s
    setCards((prev) =>
      prev.map((c) => (c.itemId === targetItemId && !c.isMatched ? { ...c, isFlipped: true } : c))
    );
    setFeedbackMessage(`Hint: Look at the ${unmatched[0].item.name}!`);
    if (accessibility.voiceGuidance) {
      speakText('Here is a hint for ' + unmatched[0].item.name, language);
    }

    setTimeout(() => {
      setCards((prev) =>
        prev.map((c) =>
          c.itemId === targetItemId && !c.isMatched && !flippedIndices.includes(cards.indexOf(c))
            ? { ...c, isFlipped: false }
            : c
        )
      );
    }, 1300);
  };

  // Completion handler
  const handleGameCompletion = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }

    const totalActions = attempts + 1;
    const finalMatches = numPairs;
    const finalErrors = errors;
    const accuracy = Math.round(
      (finalMatches / Math.max(1, finalMatches + finalErrors)) * 100
    );
    const totalTimeSec = Math.max(3, elapsedSeconds || 8);
    const avgResponseTime = Number((totalTimeSec / Math.max(1, totalActions * 2)).toFixed(1));

    // Transparent calculation
    const baseScore = 50;
    const matchBonus = finalMatches * 10;
    const speedBonus = Math.max(0, 30 - Math.round(avgResponseTime * 4));
    const mistakePenalty = finalErrors * 3;
    const hintPenalty = hintsUsed * 2;
    const calculatedScore = Math.max(35, Math.min(100, baseScore + matchBonus + speedBonus - mistakePenalty - hintPenalty));

    // Record session & trigger AI Adaptive Engine
    const { session, aiDecision } = recordGameSession({
      game: 'memory-match',
      gameTitle: t.memoryMatch,
      score: calculatedScore,
      accuracy,
      responseTime: avgResponseTime,
      errors: finalErrors,
      hints: hintsUsed,
      difficulty: currentDifficulty,
      completed: true
    });

    setTimeout(() => {
      navigate('/patient/results', {
        state: { session, aiDecision }
      });
    }, 1500);
  };

  // Repeat instructions
  const handleRepeatInstructions = () => {
    const text = 'Find matching pairs of regional items. Tap two cards to turn them over. If they match, they stay open.';
    setFeedbackMessage(text);
    speakText(text, language);
  };

  const getCardSizeClass = () => {
    if (numPairs <= 4) return 'h-28 sm:h-36 text-3xl sm:text-5xl';
    if (numPairs <= 6) return 'h-24 sm:h-32 text-2xl sm:text-4xl';
    return 'h-20 sm:h-28 text-xl sm:text-3xl';
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
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-700">
            {t.level} {currentDifficulty} • {numPairs} {t.memoryMatch} Pairs
          </span>
          <div className="text-lg sm:text-xl font-black">
            {matchesCount} / {numPairs} Matched
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`px-3 py-2 rounded-2xl font-bold flex items-center gap-1.5 cursor-pointer ${
              accessibility.highContrast
                ? 'bg-neutral-800 text-yellow-300 border border-yellow-400'
                : 'bg-white text-slate-700 border border-slate-200 shadow-xs'
            }`}
          >
            {isPaused ? <Play className="w-5 h-5 text-emerald-600" /> : <Pause className="w-5 h-5" />}
            <span className="hidden sm:inline">{isPaused ? t.resume : t.pause}</span>
          </button>
        </div>
      </div>

      {/* Reassuring Feedback Banner */}
      <div className="max-w-4xl mx-auto w-full my-3">
        <div
          className={`p-3 sm:p-4 rounded-2xl border text-center font-bold text-base sm:text-lg transition-all ${
            accessibility.highContrast
              ? 'bg-neutral-900 border-yellow-400 text-yellow-300'
              : 'bg-white border-emerald-200 text-emerald-900 shadow-xs'
          }`}
        >
          {feedbackMessage}
        </div>
      </div>

      {/* Main Cards Grid */}
      <div className="max-w-4xl mx-auto w-full flex-1 flex items-center justify-center my-2">
        {isPaused ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-lg space-y-4">
            <Pause className="w-16 h-16 mx-auto text-emerald-600" />
            <h2 className="text-2xl font-bold">Activity Paused</h2>
            <p className="text-slate-600">Take your time. Tap Resume whenever you are ready.</p>
            <button
              onClick={() => setIsPaused(false)}
              className="py-3 px-8 rounded-2xl text-xl font-bold bg-emerald-600 text-white shadow-md cursor-pointer"
            >
              Resume Game
            </button>
          </div>
        ) : (
          <div
            className={`w-full grid gap-3 sm:gap-4 ${
              cards.length <= 6
                ? 'grid-cols-2 sm:grid-cols-3'
                : cards.length <= 8
                ? 'grid-cols-2 sm:grid-cols-4'
                : cards.length <= 10
                ? 'grid-cols-3 sm:grid-cols-5'
                : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-4'
            }`}
          >
            {cards.map((card, idx) => {
              const isOpen = card.isFlipped || card.isMatched;

              return (
                <button
                  key={card.instanceId}
                  id={`memory-card-${idx}`}
                  type="button"
                  onClick={() => handleCardClick(idx)}
                  disabled={isOpen || isProcessing}
                  className={`relative rounded-3xl border-3 flex flex-col items-center justify-center transition-all duration-200 select-none cursor-pointer transform active:scale-95 ${getCardSizeClass()} ${
                    card.isMatched
                      ? accessibility.highContrast
                        ? 'bg-neutral-950 border-yellow-400 text-yellow-300 opacity-90'
                        : 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-xs'
                      : isOpen
                      ? accessibility.highContrast
                        ? 'bg-neutral-900 border-white text-yellow-300'
                        : 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-300'
                      : accessibility.highContrast
                      ? 'bg-yellow-400 border-white text-black hover:bg-yellow-300'
                      : 'bg-emerald-600 hover:bg-emerald-700 border-emerald-700 text-white shadow-md'
                  }`}
                  aria-label={isOpen ? card.item.name : 'Hidden card'}
                >
                  {isOpen ? (
                    <div className="flex flex-col items-center justify-center p-2 text-center animate-in fade-in zoom-in-75 duration-150">
                      <span className="text-3xl sm:text-5xl leading-none">{card.item.emoji}</span>
                      <span className="text-xs sm:text-sm font-extrabold mt-1 truncate max-w-[120px] text-slate-800">
                        {language === 'as' && card.item.nameAssamese
                          ? card.item.nameAssamese
                          : language === 'hi' && card.item.nameHindi
                          ? card.item.nameHindi
                          : card.item.name}
                      </span>
                      {card.isMatched && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute top-2 right-2" />
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-2xl sm:text-4xl opacity-80">🌿</span>
                      <span className="text-xs sm:text-sm font-bold mt-1 tracking-wider uppercase opacity-90">
                        Tap
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Large Bottom Controls Bar */}
      <div className="max-w-4xl mx-auto w-full pt-4 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-3">
        <button
          id="memory-repeat-btn"
          onClick={handleRepeatInstructions}
          className={`py-4 px-4 rounded-2xl text-base sm:text-lg font-bold flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 ${
            accessibility.highContrast
              ? 'bg-neutral-900 border-2 border-yellow-400 text-yellow-300'
              : 'bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-800 shadow-xs'
          }`}
        >
          <Volume2 className="w-6 h-6 text-emerald-600" />
          <span>{t.repeatInstructions}</span>
        </button>

        <button
          id="memory-hint-btn"
          onClick={handleHint}
          disabled={isProcessing || matchesCount >= numPairs}
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
          id="memory-restart-btn"
          onClick={initializeGame}
          className={`col-span-2 sm:col-span-1 py-4 px-4 rounded-2xl text-base sm:text-lg font-bold flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 ${
            accessibility.highContrast
              ? 'bg-neutral-800 text-yellow-300 border border-yellow-400'
              : 'bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700'
          }`}
        >
          <RefreshCw className="w-5 h-5" />
          <span>Restart</span>
        </button>
      </div>
    </div>
  );
};
