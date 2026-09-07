import { Patient } from '../types';

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'patient-ramesh',
    name: 'Ramesh Kumar',
    age: 68,
    location: 'Guwahati, Kamrup Metro',
    stateNER: 'Assam',
    language: 'en',
    caregiverName: 'Anita Kumar',
    avatarEmoji: '👴',
    conditionNote: 'Mild age-related memory lapses; responds warmly to music and cultural crafts.',
    currentDifficultyMemory: 2,
    currentDifficultySequence: 2
  },
  {
    id: 'patient-monalisa',
    name: 'Monalisa Barua',
    age: 72,
    location: 'Jorhat, Tea Garden Outskirts',
    stateNER: 'Assam',
    language: 'en',
    caregiverName: 'Pranjal Barua (Son)',
    avatarEmoji: '👵',
    conditionNote: 'Early-stage cognitive forgetfulness; highly engaged with regional flora and textile patterns.',
    currentDifficultyMemory: 2,
    currentDifficultySequence: 2
  },
  {
    id: 'patient-tenzin',
    name: 'Tenzin Dorjee',
    age: 74,
    location: 'Tawang, High Valley',
    stateNER: 'Arunachal Pradesh',
    language: 'hi',
    caregiverName: 'Dorjee Wangchuk (Nephew)',
    avatarEmoji: '🧓',
    conditionNote: 'Moderate short-term recall challenges; benefits from audio guidance and high-contrast visuals.',
    currentDifficultyMemory: 2,
    currentDifficultySequence: 1
  }
];
