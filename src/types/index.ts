export type Language = 'en' | 'hi' | 'as';

export type FontSizeSetting = 'small' | 'medium' | 'large' | 'extralarge';

export interface AccessibilitySettings {
  fontSize: FontSizeSetting;
  highContrast: boolean;
  voiceGuidance: boolean;
  reduceAnimation: boolean;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  location: string;
  stateNER: string;
  language: Language;
  caregiverName: string;
  avatarEmoji: string;
  conditionNote: string;
  currentDifficultyMemory: number;
  currentDifficultySequence: number;
}

export type GameType = 'memory-match' | 'sequence-recall';

export interface GameSession {
  id: string;
  patientId: string;
  game: GameType;
  gameTitle: string;
  score: number;
  accuracy: number; // percentage (0-100)
  responseTime: number; // in seconds
  errors: number;
  hints: number;
  difficulty: number; // level 1-5
  completed: boolean;
  timestamp: string; // ISO string
}

export type AIAction = 'increase' | 'maintain' | 'decrease';

export interface AIDecisionFactor {
  label: string;
  value: string | number;
  status: 'positive' | 'neutral' | 'attention';
}

export interface AIDecision {
  id: string;
  sessionId?: string;
  patientId: string;
  game: GameType;
  gameTitle: string;
  previousDifficulty: number;
  newDifficulty: number;
  action: AIAction;
  explanation: string;
  factors: AIDecisionFactor[];
  timestamp: string; // ISO string
}

export type ReminderCategory = 'Medicine' | 'Meal' | 'Activity' | 'Appointment' | 'Other';

export interface Reminder {
  id: string;
  patientId: string;
  title: string;
  category: ReminderCategory;
  time: string; // e.g., "08:00 AM" or "13:00"
  repeat: string; // e.g., "Daily", "Mon-Fri", "Once"
  completed: boolean;
  enabled: boolean;
}

export interface NERItem {
  id: string;
  name: string;
  nameAssamese?: string;
  nameHindi?: string;
  category: 'Craft' | 'Flora/Fauna' | 'Culture' | 'Food' | 'Textile';
  emoji: string;
  description: string;
  originState: string;
}
