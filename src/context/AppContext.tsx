import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  Patient,
  GameSession,
  AIDecision,
  Reminder,
  Language,
  AccessibilitySettings,
  GameType
} from '../types';
import { MOCK_PATIENTS } from '../data/mockPatients';
import { INITIAL_MOCK_SESSIONS } from '../data/mockSessions';
import { INITIAL_MOCK_DECISIONS } from '../data/mockDecisions';
import { INITIAL_MOCK_REMINDERS } from '../data/mockReminders';
import { TRANSLATIONS, Translations } from '../data/translations';
import { saveData, loadData, STORAGE_KEYS, clearAllCogniCareData } from '../utils/storage';
import { evaluateAdaptiveDifficulty, PerformanceInput } from '../ai/adaptiveDifficulty';

interface AppContextType {
  // Patient
  patients: Patient[];
  activePatient: Patient;
  setActivePatientId: (id: string) => void;
  updateActivePatientDifficulty: (game: GameType, newDiff: number) => void;
  addPatient: (patientData: Omit<Patient, 'id'>, autoActivate?: boolean) => Patient;
  deletePatient: (id: string) => boolean;

  // Add Patient Modal Control
  isAddPatientModalOpen: boolean;
  openAddPatientModal: () => void;
  closeAddPatientModal: () => void;

  // Delete Patient Modal Control
  patientToDelete: Patient | null;
  openDeletePatientModal: (patient: Patient) => void;
  closeDeletePatientModal: () => void;

  // Language & Translation
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;

  // Accessibility
  accessibility: AccessibilitySettings;
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void;

  // Sessions & Telemetry
  sessions: GameSession[];
  recordGameSession: (sessionData: Omit<GameSession, 'id' | 'patientId' | 'timestamp'>) => {
    session: GameSession;
    aiDecision: AIDecision;
  };

  // AI Decisions
  aiDecisions: AIDecision[];

  // Reminders
  reminders: Reminder[];
  toggleReminderCompleted: (id: string) => void;
  toggleReminderEnabled: (id: string) => void;
  addReminder: (rem: Omit<Reminder, 'id' | 'patientId'>) => void;
  deleteReminder: (id: string) => void;

  // Sync simulation
  isSyncing: boolean;
  lastSyncTime: string;
  simulateSync: () => Promise<void>;

  // Demo Control
  resetDemoData: () => void;
}

const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  fontSize: 'large',
  highContrast: false,
  voiceGuidance: true,
  reduceAnimation: false
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Patients
  const [patients, setPatients] = useState<Patient[]>(() => {
    return loadData<Patient[]>(STORAGE_KEYS.PATIENTS, MOCK_PATIENTS);
  });

  const [activePatientId, setActivePatientIdState] = useState<string>(() => {
    return loadData<string>(STORAGE_KEYS.ACTIVE_PATIENT_ID, 'patient-ramesh');
  });

  const activePatient = useMemo(() => {
    return patients.find((p) => p.id === activePatientId) || patients[0] || MOCK_PATIENTS[0];
  }, [patients, activePatientId]);

  // Language
  const [language, setLanguageState] = useState<Language>(() => {
    return loadData<Language>(STORAGE_KEYS.LANGUAGE, activePatient?.language || 'en');
  });

  // Accessibility
  const [accessibility, setAccessibilityState] = useState<AccessibilitySettings>(() => {
    return loadData<AccessibilitySettings>(STORAGE_KEYS.ACCESSIBILITY, DEFAULT_ACCESSIBILITY);
  });

  // Sessions
  const [sessions, setSessions] = useState<GameSession[]>(() => {
    return loadData<GameSession[]>(STORAGE_KEYS.SESSIONS, INITIAL_MOCK_SESSIONS);
  });

  // AI Decisions
  const [aiDecisions, setAiDecisions] = useState<AIDecision[]>(() => {
    return loadData<AIDecision[]>(STORAGE_KEYS.AI_DECISIONS, INITIAL_MOCK_DECISIONS);
  });

  // Reminders
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    return loadData<Reminder[]>(STORAGE_KEYS.REMINDERS, INITIAL_MOCK_REMINDERS);
  });

  // Add Patient modal state
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState<boolean>(false);
  const openAddPatientModal = () => setIsAddPatientModalOpen(true);
  const closeAddPatientModal = () => setIsAddPatientModalOpen(false);

  // Delete Patient modal state
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const openDeletePatientModal = (patient: Patient) => setPatientToDelete(patient);
  const closeDeletePatientModal = () => setPatientToDelete(null);

  // Sync state
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => {
    return loadData<string>(STORAGE_KEYS.LAST_SYNC, 'Today, 5:35 PM');
  });

  // Sync helpers
  const setActivePatientId = (id: string) => {
    setActivePatientIdState(id);
    saveData(STORAGE_KEYS.ACTIVE_PATIENT_ID, id);
    const target = patients.find((p) => p.id === id);
    if (target && target.language) {
      setLanguage(target.language);
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    saveData(STORAGE_KEYS.LANGUAGE, lang);
  };

  const updateAccessibility = (newSettings: Partial<AccessibilitySettings>) => {
    setAccessibilityState((prev) => {
      const updated = { ...prev, ...newSettings };
      saveData(STORAGE_KEYS.ACCESSIBILITY, updated);
      return updated;
    });
  };

  const updateActivePatientDifficulty = (game: GameType, newDiff: number) => {
    setPatients((prev) => {
      const updated = prev.map((p) => {
        if (p.id === activePatient.id) {
          return {
            ...p,
            currentDifficultyMemory: game === 'memory-match' ? newDiff : p.currentDifficultyMemory,
            currentDifficultySequence: game === 'sequence-recall' ? newDiff : p.currentDifficultySequence
          };
        }
        return p;
      });
      saveData(STORAGE_KEYS.PATIENTS, updated);
      return updated;
    });
  };

  const addPatient = (
    patientData: Omit<Patient, 'id'>,
    autoActivate: boolean = true
  ): Patient => {
    const newId = `patient-${Date.now()}`;
    const newPatient: Patient = {
      ...patientData,
      id: newId,
      currentDifficultyMemory: patientData.currentDifficultyMemory || 2,
      currentDifficultySequence: patientData.currentDifficultySequence || 1
    };

    const updatedPatients = [...patients, newPatient];
    setPatients(updatedPatients);
    saveData(STORAGE_KEYS.PATIENTS, updatedPatients);

    // Provide default starter care schedule for the newly added patient
    const starterReminders: Reminder[] = [
      {
        id: `rem-${Date.now()}-1`,
        patientId: newId,
        title: 'Morning Medication & Warm Water',
        category: 'Medicine',
        time: '08:30 AM',
        repeat: 'Daily',
        completed: false,
        enabled: true
      },
      {
        id: `rem-${Date.now()}-2`,
        patientId: newId,
        title: 'Afternoon Assam Tea & Hydration',
        category: 'Meal',
        time: '04:00 PM',
        repeat: 'Daily',
        completed: false,
        enabled: true
      },
      {
        id: `rem-${Date.now()}-3`,
        patientId: newId,
        title: 'Evening Memory Match Game Practice',
        category: 'Activity',
        time: '06:00 PM',
        repeat: 'Daily',
        completed: false,
        enabled: true
      }
    ];

    setReminders((prev) => {
      const updated = [...starterReminders, ...prev];
      saveData(STORAGE_KEYS.REMINDERS, updated);
      return updated;
    });

    if (autoActivate) {
      setActivePatientId(newId);
    }

    return newPatient;
  };

  const deletePatient = (id: string): boolean => {
    if (patients.length <= 1) return false;

    const updatedPatients = patients.filter((p) => p.id !== id);
    setPatients(updatedPatients);
    saveData(STORAGE_KEYS.PATIENTS, updatedPatients);

    // Clean up all sessions, reminders, and AI decisions for this deleted patient
    const updatedSessions = sessions.filter((s) => s.patientId !== id);
    setSessions(updatedSessions);
    saveData(STORAGE_KEYS.SESSIONS, updatedSessions);

    const updatedReminders = reminders.filter((r) => r.patientId !== id);
    setReminders(updatedReminders);
    saveData(STORAGE_KEYS.REMINDERS, updatedReminders);

    const updatedDecisions = aiDecisions.filter((d) => d.patientId !== id);
    setAiDecisions(updatedDecisions);
    saveData(STORAGE_KEYS.AI_DECISIONS, updatedDecisions);

    if (activePatientId === id) {
      const fallback = updatedPatients[0];
      setActivePatientId(fallback.id);
    }

    if (patientToDelete?.id === id) {
      setPatientToDelete(null);
    }

    return true;
  };

  const recordGameSession = (sessionData: Omit<GameSession, 'id' | 'patientId' | 'timestamp'>) => {
    const newSession: GameSession = {
      ...sessionData,
      id: `sess-${Date.now()}`,
      patientId: activePatient.id,
      timestamp: new Date().toISOString()
    };

    // Calculate previous consecutive successes
    const pastForThisGame = sessions.filter(
      (s) => s.patientId === activePatient.id && s.game === sessionData.game
    );
    let consecutiveSuccesses = 1;
    if (pastForThisGame.length > 0 && pastForThisGame[0].accuracy >= 80) {
      consecutiveSuccesses = 2;
    }

    // Run AI Adaptive Difficulty Engine
    const evalInput: PerformanceInput = {
      patientId: activePatient.id,
      game: sessionData.game,
      gameTitle: sessionData.gameTitle,
      accuracy: sessionData.accuracy,
      responseTime: sessionData.responseTime,
      errors: sessionData.errors,
      hints: sessionData.hints,
      previousDifficulty: sessionData.difficulty,
      consecutiveSuccesses
    };

    const aiDecision = evaluateAdaptiveDifficulty(evalInput);
    aiDecision.sessionId = newSession.id;

    // Save session
    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    saveData(STORAGE_KEYS.SESSIONS, updatedSessions);

    // Save AI Decision
    const updatedDecisions = [aiDecision, ...aiDecisions];
    setAiDecisions(updatedDecisions);
    saveData(STORAGE_KEYS.AI_DECISIONS, updatedDecisions);

    // Update patient's stored difficulty
    updateActivePatientDifficulty(sessionData.game, aiDecision.newDifficulty);

    return { session: newSession, aiDecision };
  };

  // Reminders handlers
  const toggleReminderCompleted = (id: string) => {
    setReminders((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r));
      saveData(STORAGE_KEYS.REMINDERS, updated);
      return updated;
    });
  };

  const toggleReminderEnabled = (id: string) => {
    setReminders((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r));
      saveData(STORAGE_KEYS.REMINDERS, updated);
      return updated;
    });
  };

  const addReminder = (rem: Omit<Reminder, 'id' | 'patientId'>) => {
    const newRem: Reminder = {
      ...rem,
      id: `rem-${Date.now()}`,
      patientId: activePatient.id
    };
    setReminders((prev) => {
      const updated = [newRem, ...prev];
      saveData(STORAGE_KEYS.REMINDERS, updated);
      return updated;
    });
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      saveData(STORAGE_KEYS.REMINDERS, updated);
      return updated;
    });
  };

  // Simulated Sync
  const simulateSync = async () => {
    setIsSyncing(true);
    await new Promise((resolve) => setTimeout(resolve, 1400));
    const nowStr = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(new Date());
    const syncText = `Today, ${nowStr}`;
    setLastSyncTime(syncText);
    saveData(STORAGE_KEYS.LAST_SYNC, syncText);
    setIsSyncing(false);
  };

  // Reset Demo Data
  const resetDemoData = () => {
    clearAllCogniCareData();
    setPatients(MOCK_PATIENTS);
    setActivePatientIdState('patient-ramesh');
    setSessions(INITIAL_MOCK_SESSIONS);
    setAiDecisions(INITIAL_MOCK_DECISIONS);
    setReminders(INITIAL_MOCK_REMINDERS);
    setLanguageState('as');
    setAccessibilityState(DEFAULT_ACCESSIBILITY);
    setLastSyncTime('Today, 5:35 PM');
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <AppContext.Provider
      value={{
        patients,
        activePatient,
        setActivePatientId,
        updateActivePatientDifficulty,
        addPatient,
        deletePatient,
        isAddPatientModalOpen,
        openAddPatientModal,
        closeAddPatientModal,
        patientToDelete,
        openDeletePatientModal,
        closeDeletePatientModal,
        language,
        setLanguage,
        t,
        accessibility,
        updateAccessibility,
        sessions,
        recordGameSession,
        aiDecisions,
        reminders,
        toggleReminderCompleted,
        toggleReminderEnabled,
        addReminder,
        deleteReminder,
        isSyncing,
        lastSyncTime,
        simulateSync,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
