import { Reminder } from '../types';

export const INITIAL_MOCK_REMINDERS: Reminder[] = [
  {
    id: 'rem-01',
    patientId: 'patient-ramesh',
    title: 'Morning medicine',
    category: 'Medicine',
    time: '08:00',
    repeat: 'Daily',
    completed: false,
    enabled: true
  },
  {
    id: 'rem-02',
    patientId: 'patient-ramesh',
    title: 'Nutritious Lunch & Lemon Water',
    category: 'Meal',
    time: '01:00 PM',
    repeat: 'Daily',
    completed: true,
    enabled: true
  },
  {
    id: 'rem-03',
    patientId: 'patient-ramesh',
    title: 'Daily Cognitive Activity (CogniCare)',
    category: 'Activity',
    time: '05:00 PM',
    repeat: 'Daily',
    completed: false,
    enabled: true
  },
  {
    id: 'rem-04',
    patientId: 'patient-ramesh',
    title: 'Evening Walk in Courtyard with Anita',
    category: 'Activity',
    time: '06:00 PM',
    repeat: 'Daily',
    completed: false,
    enabled: true
  },
  {
    id: 'rem-05',
    patientId: 'patient-ramesh',
    title: 'Night Multivitamin & Water',
    category: 'Medicine',
    time: '09:00 PM',
    repeat: 'Daily',
    completed: false,
    enabled: true
  }
];
