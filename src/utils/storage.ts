export const STORAGE_KEYS = {
  PATIENTS: 'cognicare_patients',
  ACTIVE_PATIENT_ID: 'cognicare_active_patient_id',
  SESSIONS: 'cognicare_sessions',
  AI_DECISIONS: 'cognicare_ai_decisions',
  REMINDERS: 'cognicare_reminders',
  LANGUAGE: 'cognicare_language',
  ACCESSIBILITY: 'cognicare_accessibility',
  LAST_SYNC: 'cognicare_last_sync'
} as const;

export function saveData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to save to localStorage key "${key}":`, error);
  }
}

export function loadData<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`Failed to parse localStorage key "${key}", using fallback:`, error);
    return fallback;
  }
}

export function removeData(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove localStorage key "${key}":`, error);
  }
}

export function clearAllCogniCareData(): void {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Failed to clear CogniCare data from localStorage:', error);
  }
}
