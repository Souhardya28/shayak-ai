import { AIDecision } from '../types';

export const INITIAL_MOCK_DECISIONS: AIDecision[] = [
  {
    id: 'dec-001',
    sessionId: 'sess-105',
    patientId: 'patient-ramesh',
    game: 'memory-match',
    gameTitle: 'Memory Match',
    previousDifficulty: 2,
    newDifficulty: 3,
    action: 'increase',
    explanation: 'The user showed high accuracy (88%) with prompt response times (3.3s) and zero hints requested. Difficulty adjusted gently from Level 2 to Level 3 to maintain cognitive stimulation.',
    factors: [
      { label: 'Accuracy', value: '88%', status: 'positive' },
      { label: 'Response Time', value: '3.3s', status: 'positive' },
      { label: 'Errors Made', value: 1, status: 'positive' },
      { label: 'Hints Used', value: 0, status: 'positive' }
    ],
    timestamp: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: 'dec-002',
    sessionId: 'sess-106',
    patientId: 'patient-ramesh',
    game: 'sequence-recall',
    gameTitle: 'Sequence Recall',
    previousDifficulty: 2,
    newDifficulty: 2,
    action: 'maintain',
    explanation: 'Performance was balanced with 85% accuracy and moderate response time. Current Level 2 retained to consolidate sequential short-term recall before advancing.',
    factors: [
      { label: 'Accuracy', value: '85%', status: 'positive' },
      { label: 'Response Time', value: '3.5s', status: 'positive' },
      { label: 'Errors Made', value: 2, status: 'neutral' },
      { label: 'Hints Used', value: 0, status: 'positive' }
    ],
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'dec-003',
    sessionId: 'sess-107',
    patientId: 'patient-ramesh',
    game: 'memory-match',
    gameTitle: 'Memory Match',
    previousDifficulty: 3,
    newDifficulty: 3,
    action: 'maintain',
    explanation: 'User performed reliably at Level 3 (92% accuracy). Maintaining Level 3 for consecutive consistency before considering level 4.',
    factors: [
      { label: 'Accuracy', value: '92%', status: 'positive' },
      { label: 'Response Time', value: '2.8s', status: 'positive' },
      { label: 'Errors Made', value: 1, status: 'positive' },
      { label: 'Hints Used', value: 0, status: 'positive' }
    ],
    timestamp: new Date(Date.now() - 1 * 86400000).toISOString()
  }
];
