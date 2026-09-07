import { AIDecision, AIDecisionFactor, AIAction, GameType } from '../types';

export interface PerformanceInput {
  patientId: string;
  game: GameType;
  gameTitle: string;
  accuracy: number; // 0 - 100
  responseTime: number; // in seconds
  errors: number;
  hints: number;
  completionRate?: number; // 0 - 100
  previousDifficulty: number; // 1 - 5
  consecutiveSuccesses?: number;
}

// Configurable rule thresholds
export const ADAPTIVE_THRESHOLDS = {
  MIN_DIFFICULTY: 1,
  MAX_DIFFICULTY: 5,
  // Criteria for increasing difficulty:
  HIGH_ACCURACY: 85, // >= 85%
  FAST_RESPONSE_TIME: 4.0, // <= 4.0s per move
  MAX_ERRORS_FOR_INCREASE: 2,
  MAX_HINTS_FOR_INCREASE: 1,
  REQUIRED_CONSECUTIVE_SUCCESS: 1,

  // Criteria for decreasing difficulty:
  LOW_ACCURACY: 60, // < 60%
  HIGH_ERRORS: 4, // >= 4 mistakes
  SLOW_RESPONSE_TIME: 7.5, // > 7.5s per move
  EXCESSIVE_HINTS: 3 // >= 3 hints
};

export function evaluateAdaptiveDifficulty(input: PerformanceInput): AIDecision {
  const {
    patientId,
    game,
    gameTitle,
    accuracy,
    responseTime,
    errors,
    hints,
    previousDifficulty,
    consecutiveSuccesses = 1
  } = input;

  let action: AIAction = 'maintain';
  let newDifficulty = previousDifficulty;
  let explanation = '';
  const factors: AIDecisionFactor[] = [];

  // Evaluate Accuracy Factor
  if (accuracy >= ADAPTIVE_THRESHOLDS.HIGH_ACCURACY) {
    factors.push({
      label: 'Accuracy',
      value: `${Math.round(accuracy)}%`,
      status: 'positive'
    });
  } else if (accuracy < ADAPTIVE_THRESHOLDS.LOW_ACCURACY) {
    factors.push({
      label: 'Accuracy',
      value: `${Math.round(accuracy)}%`,
      status: 'attention'
    });
  } else {
    factors.push({
      label: 'Accuracy',
      value: `${Math.round(accuracy)}%`,
      status: 'neutral'
    });
  }

  // Evaluate Response Time Factor
  if (responseTime <= ADAPTIVE_THRESHOLDS.FAST_RESPONSE_TIME) {
    factors.push({
      label: 'Response Time',
      value: `${responseTime.toFixed(1)}s`,
      status: 'positive'
    });
  } else if (responseTime > ADAPTIVE_THRESHOLDS.SLOW_RESPONSE_TIME) {
    factors.push({
      label: 'Response Time',
      value: `${responseTime.toFixed(1)}s`,
      status: 'attention'
    });
  } else {
    factors.push({
      label: 'Response Time',
      value: `${responseTime.toFixed(1)}s`,
      status: 'neutral'
    });
  }

  // Evaluate Errors Factor
  factors.push({
    label: 'Errors Made',
    value: errors,
    status: errors <= ADAPTIVE_THRESHOLDS.MAX_ERRORS_FOR_INCREASE ? 'positive' : errors >= ADAPTIVE_THRESHOLDS.HIGH_ERRORS ? 'attention' : 'neutral'
  });

  // Evaluate Hints Factor
  factors.push({
    label: 'Hints Used',
    value: hints,
    status: hints <= ADAPTIVE_THRESHOLDS.MAX_HINTS_FOR_INCREASE ? 'positive' : 'neutral'
  });

  // RULE LOGIC
  const canIncrease =
    accuracy >= ADAPTIVE_THRESHOLDS.HIGH_ACCURACY &&
    responseTime <= ADAPTIVE_THRESHOLDS.FAST_RESPONSE_TIME &&
    errors <= ADAPTIVE_THRESHOLDS.MAX_ERRORS_FOR_INCREASE &&
    hints <= ADAPTIVE_THRESHOLDS.MAX_HINTS_FOR_INCREASE &&
    consecutiveSuccesses >= ADAPTIVE_THRESHOLDS.REQUIRED_CONSECUTIVE_SUCCESS;

  const shouldDecrease =
    accuracy < ADAPTIVE_THRESHOLDS.LOW_ACCURACY ||
    errors >= ADAPTIVE_THRESHOLDS.HIGH_ERRORS ||
    (hints >= ADAPTIVE_THRESHOLDS.EXCESSIVE_HINTS && responseTime > ADAPTIVE_THRESHOLDS.SLOW_RESPONSE_TIME);

  if (canIncrease && previousDifficulty < ADAPTIVE_THRESHOLDS.MAX_DIFFICULTY) {
    action = 'increase';
    newDifficulty = previousDifficulty + 1;
    explanation = `The user demonstrated high accuracy (${Math.round(accuracy)}%) with prompt responses (${responseTime.toFixed(1)}s) and minimal assistance. To maintain cognitive engagement without frustration, the challenge level is gently advanced from Level ${previousDifficulty} to Level ${newDifficulty}.`;
  } else if (shouldDecrease && previousDifficulty > ADAPTIVE_THRESHOLDS.MIN_DIFFICULTY) {
    action = 'decrease';
    newDifficulty = previousDifficulty - 1;
    explanation = `The activity presented noticeable cognitive friction with ${errors} errors and ${Math.round(accuracy)}% accuracy. The platform adapts to reduce difficulty from Level ${previousDifficulty} to Level ${newDifficulty} to preserve confidence and maintain a calm, positive experience.`;
  } else {
    action = 'maintain';
    newDifficulty = previousDifficulty;
    if (previousDifficulty === ADAPTIVE_THRESHOLDS.MAX_DIFFICULTY && canIncrease) {
      explanation = `Excellent performance! The user has achieved mastery at the maximum difficulty (Level ${previousDifficulty}). The activity level remains steady to reinforce positive cognitive memory.`;
    } else if (previousDifficulty === ADAPTIVE_THRESHOLDS.MIN_DIFFICULTY && shouldDecrease) {
      explanation = `The user is at the gentlest entry level (Level 1). Retaining this baseline allows the user to practice familiar cultural objects comfortably with extra visual and audio guidance.`;
    } else {
      explanation = `Performance is steady and balanced (${Math.round(accuracy)}% accuracy, ${responseTime.toFixed(1)}s response time). The current difficulty (Level ${previousDifficulty}) is optimal for ongoing cognitive stimulation.`;
    }
  }

  return {
    id: `ai-dec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    patientId,
    game,
    gameTitle,
    previousDifficulty,
    newDifficulty,
    action,
    explanation,
    factors,
    timestamp: new Date().toISOString()
  };
}
