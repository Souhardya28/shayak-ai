import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { DemoModeBanner } from './components/common/DemoModeBanner';

// Common pages
import { RoleSelectorPage } from './pages/common/RoleSelectorPage';

// Patient pages
import { WelcomePage } from './pages/patient/WelcomePage';
import { PatientHomePage } from './pages/patient/PatientHomePage';
import { GamesMenuPage } from './pages/patient/GamesMenuPage';
import { MemoryMatchGame } from './pages/patient/MemoryMatchGame';
import { SequenceRecallGame } from './pages/patient/SequenceRecallGame';
import { GameResultPage } from './pages/patient/GameResultPage';
import { PatientProgressPage } from './pages/patient/PatientProgressPage';
import { PatientRemindersPage } from './pages/patient/PatientRemindersPage';
import { LanguageSettingsPage } from './pages/patient/LanguageSettingsPage';
import { AccessibilitySettingsPage } from './pages/patient/AccessibilitySettingsPage';
import { HelpPage } from './pages/patient/HelpPage';

// Caregiver pages
import { CaregiverDashboardPage } from './pages/caregiver/CaregiverDashboardPage';
import { CaregiverPatientsPage } from './pages/caregiver/CaregiverPatientsPage';
import { CaregiverSessionsPage } from './pages/caregiver/CaregiverSessionsPage';
import { CaregiverAIDecisionsPage } from './pages/caregiver/CaregiverAIDecisionsPage';
import { CaregiverRemindersPage } from './pages/caregiver/CaregiverRemindersPage';
import { AddPatientModal } from './components/caregiver/AddPatientModal';
import { DeletePatientModal } from './components/caregiver/DeletePatientModal';

export function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-emerald-200 selection:text-emerald-900">
          {/* Top Persistent Demo Control Banner */}
          <DemoModeBanner />

          {/* Global Modals */}
          <AddPatientModal />
          <DeletePatientModal />

          {/* Application Routing */}
          <div className="flex-1">
            <Routes>
              {/* Landing Demo Role Selector */}
              <Route path="/" element={<RoleSelectorPage />} />

              {/* Patient Flow */}
              <Route path="/welcome" element={<WelcomePage />} />
              <Route path="/patient" element={<PatientHomePage />} />
              <Route path="/patient/games" element={<GamesMenuPage />} />
              <Route path="/patient/games/memory-match" element={<MemoryMatchGame />} />
              <Route path="/patient/games/sequence-recall" element={<SequenceRecallGame />} />
              <Route path="/patient/results" element={<GameResultPage />} />
              <Route path="/patient/progress" element={<PatientProgressPage />} />
              <Route path="/patient/reminders" element={<PatientRemindersPage />} />
              <Route path="/patient/language" element={<LanguageSettingsPage />} />
              <Route path="/patient/accessibility" element={<AccessibilitySettingsPage />} />
              <Route path="/settings/accessibility" element={<AccessibilitySettingsPage />} />
              <Route path="/patient/help" element={<HelpPage />} />

              {/* Caregiver Flow */}
              <Route path="/caregiver" element={<CaregiverDashboardPage />} />
              <Route path="/caregiver/patients" element={<CaregiverPatientsPage />} />
              <Route path="/caregiver/sessions" element={<CaregiverSessionsPage />} />
              <Route path="/caregiver/ai-decisions" element={<CaregiverAIDecisionsPage />} />
              <Route path="/caregiver/reminders" element={<CaregiverRemindersPage />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
