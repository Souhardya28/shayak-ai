import { Language } from '../types';

export interface Translations {
  appName: string;
  appSubtitle: string;
  welcome: string;
  goodMorning: string;
  goodAfternoon: string;
  goodEvening: string;
  startActivity: string;
  start: string;
  listen: string;
  home: string;
  games: string;
  reminders: string;
  progress: string;
  settings: string;
  help: string;
  cognitiveActivity: string;
  memoryMatch: string;
  memoryMatchDesc: string;
  sequenceRecall: string;
  sequenceRecallDesc: string;
  estimatedTime: string;
  todaysReminders: string;
  caregiverDashboard: string;
  patientApp: string;
  switchRole: string;
  score: string;
  accuracy: string;
  responseTime: string;
  difficulty: string;
  level: string;
  aiRecommendation: string;
  continue: string;
  playAgain: string;
  backToHome: string;
  hint: string;
  pause: string;
  resume: string;
  exit: string;
  repeatInstructions: string;
  wellDone: string;
  tryAgain: string;
  matchFound: string;
  rememberOrder: string;
  selectInOrder: string;
  checkAnswer: string;
  whyDifficultyChanged: string;
  offlineStatus: string;
  languageName: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    appName: 'CogniCare NER',
    appSubtitle: 'AI-Assisted Cognitive & Memory Support',
    welcome: 'Welcome',
    goodMorning: 'Good Morning',
    goodAfternoon: 'Good Afternoon',
    goodEvening: 'Good Evening',
    startActivity: 'Start Activity',
    start: 'Start',
    listen: 'Listen',
    home: 'Home',
    games: 'Games',
    reminders: 'Reminders',
    progress: 'Progress',
    settings: 'Settings',
    help: 'Help',
    cognitiveActivity: 'Cognitive Activity',
    memoryMatch: 'Memory Match',
    memoryMatchDesc: 'Find the matching pairs of familiar regional items.',
    sequenceRecall: 'Sequence Recall',
    sequenceRecallDesc: 'Remember the order of items shown on screen.',
    estimatedTime: 'Estimated time: 5 minutes',
    todaysReminders: "Today's Reminders",
    caregiverDashboard: 'Caregiver Dashboard',
    patientApp: 'Patient App',
    switchRole: 'Switch View / Role',
    score: 'Game Score',
    accuracy: 'Accuracy',
    responseTime: 'Response Time',
    difficulty: 'Difficulty',
    level: 'Level',
    aiRecommendation: 'AI Adaptive Recommendation',
    continue: 'Continue',
    playAgain: 'Play Again',
    backToHome: 'Back to Home',
    hint: 'Hint',
    pause: 'Pause',
    resume: 'Resume',
    exit: 'Exit',
    repeatInstructions: 'Repeat Instructions',
    wellDone: 'Well Done! 🎉',
    tryAgain: 'Try Again, take your time.',
    matchFound: 'Great Match! 🌟',
    rememberOrder: 'Look closely and remember the order.',
    selectInOrder: 'Now tap the items in the same sequence.',
    checkAnswer: 'Check My Sequence',
    whyDifficultyChanged: 'Why did difficulty change?',
    offlineStatus: 'Local Storage Ready (Offline-First)',
    languageName: 'English'
  },
  hi: {
    appName: 'कॉग्नीकेयर एनईआर',
    appSubtitle: 'एआई-सहायक संज्ञानात्मक और स्मृति सहायता',
    welcome: 'स्वागत है',
    goodMorning: 'शुभ प्रभात',
    goodAfternoon: 'शुभ दोपहर',
    goodEvening: 'शुभ संध्या',
    startActivity: 'गतिविधि शुरू करें',
    start: 'शुरू करें',
    listen: 'सुनें',
    home: 'होम',
    games: 'खेल',
    reminders: 'अनुस्मारक (याद रखें)',
    progress: 'प्रगति',
    settings: 'सेटिंग्स',
    help: 'मदद',
    cognitiveActivity: 'संज्ञानात्मक गतिविधि',
    memoryMatch: 'स्मृति जोड़ी (मेमोरी मैच)',
    memoryMatchDesc: 'परिचित सांस्कृतिक वस्तुओं के जोड़े खोजें।',
    sequenceRecall: 'क्रम याद रखें (सीक्वेंस रिकॉल)',
    sequenceRecallDesc: 'स्क्रीन पर दिखाई गई वस्तुओं का क्रम याद रखें।',
    estimatedTime: 'अनुमानित समय: ५ मिनट',
    todaysReminders: 'आज के अनुस्मारक',
    caregiverDashboard: 'देखभालकर्ता डैशबोर्ड',
    patientApp: 'मरीज ऐप',
    switchRole: 'भूमिका बदलें',
    score: 'खेल स्कोर',
    accuracy: 'सटीकता (Accuracy)',
    responseTime: 'प्रतिक्रिया समय',
    difficulty: 'कठिनाई स्तर',
    level: 'स्तर',
    aiRecommendation: 'एआई अनुकूलन अनुशंसा',
    continue: 'आगे बढ़ें',
    playAgain: 'पुनः खेलें',
    backToHome: 'होम पर वापस जाएं',
    hint: 'संकेत (Hint)',
    pause: 'रोकें',
    resume: 'जारी रखें',
    exit: 'बाहर निकलें',
    repeatInstructions: 'निर्देश दोहराएं',
    wellDone: 'बहुत बढ़िया! 🎉',
    tryAgain: 'पुनः प्रयास करें, आराम से करें।',
    matchFound: 'सुंदर जोड़ी! 🌟',
    rememberOrder: 'ध्यान से देखें और क्रम याद रखें।',
    selectInOrder: 'अब उसी क्रम में वस्तुओं को चुनें।',
    checkAnswer: 'जांचें',
    whyDifficultyChanged: 'कठिनाई क्यों बदली?',
    offlineStatus: 'लोकल स्टोरेज तैयार (ऑफ़लाइन सक्षम)',
    languageName: 'हिंदी'
  },
  as: {
    appName: 'কগনিকেয়াৰ উত্তৰ-পূৰ্বাঞ্চল',
    appSubtitle: 'এআই-সহায়তাপ্ৰাপ্ত জ্ঞান আৰু স্মৃতি সহায়ক মঞ্চ',
    welcome: 'স্বাগতম',
    goodMorning: 'শুভ প্ৰভাত',
    goodAfternoon: 'শুভ অপৰাহ্ণ',
    goodEvening: 'শুভ সন্ধিয়া',
    startActivity: 'কাৰ্যসূচী আৰম্ভ কৰক',
    start: 'আৰম্ভ কৰক',
    listen: 'শুনক',
    home: 'ঘৰ (Home)',
    games: 'খেলসমূহ',
    reminders: 'সোঁৱৰণী (Reminders)',
    progress: 'অগ্ৰগতি',
    settings: 'ছেটিংছ',
    help: 'সহায়',
    cognitiveActivity: 'স্মৃতি আৰু মনন কাৰ্যসূচী',
    memoryMatch: 'যোৰা মিলোৱা খেল',
    memoryMatchDesc: 'পৰিচিত থলুৱা সামগ্ৰীৰ একে যোৰা বিচাৰি উলিয়াওক।',
    sequenceRecall: 'ক্ৰম মনত ৰখা খেল',
    sequenceRecallDesc: 'পৰ্দাত দেখা বস্তুৰ ধাৰাবাহিক ক্ৰমটো মনত ৰাখক।',
    estimatedTime: 'আনুমানিক সময়: ৫ মিনিট',
    todaysReminders: 'আজিৰ সোঁৱৰণীসমূহ',
    caregiverDashboard: 'সেৱাদানকাৰী ডেচব’ৰ্ড',
    patientApp: 'ৰোগী সেৱা এপ্প',
    switchRole: 'ভূমিকা সলনি কৰক',
    score: 'খেলৰ স্ক’ৰ',
    accuracy: 'শুদ্ধতা (Accuracy)',
    responseTime: 'সঁহাৰিৰ সময়',
    difficulty: 'কাৰ্য্যৰ কঠিনতা',
    level: 'স্তৰ',
    aiRecommendation: 'এআই অভিযোজন পৰামৰ্শ',
    continue: 'আগবাঢ়ক',
    playAgain: 'আকৌ খেলক',
    backToHome: 'ঘৰলৈ উভতি যাওক',
    hint: 'ইঙ্গিত (Hint)',
    pause: 'ৰখাৱক',
    resume: 'পুনৰ আৰম্ভ',
    exit: 'বাহিৰ ওলাওক',
    repeatInstructions: 'নিৰ্দেশনা পুনৰ শুনক',
    wellDone: 'বহুত ভাল হৈছে! 🎉',
    tryAgain: 'আকৌ চেষ্টা কৰক, কোনো খৰখেদা নাই।',
    matchFound: 'চমৎকার যোৰা মিলিছে! 🌟',
    rememberOrder: 'মনোযোগেৰে চাই ক্ৰমটো মনত ৰাখক।',
    selectInOrder: 'এতিয়া একে ক্ৰমত বস্তুবোৰ বাছক।',
    checkAnswer: 'ক্ৰম পৰীক্ষা কৰক',
    whyDifficultyChanged: 'কঠিনতাৰ স্তৰ কিয় সলনি হ’ল?',
    offlineStatus: 'অফলাইন সুৰক্ষিত (স্থানীয় সংৰক্ষণ)',
    languageName: 'অসমীয়া'
  }
};
