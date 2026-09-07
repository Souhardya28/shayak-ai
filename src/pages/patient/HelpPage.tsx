import React from 'react';
import { HelpCircle, Brain, Bell, Volume2, Home, Lightbulb } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ElderlyLayout } from '../../components/patient/ElderlyLayout';
import { VoiceButton } from '../../components/common/VoiceButton';

export const HelpPage: React.FC = () => {
  const { t, accessibility } = useApp();

  const helpSpeech = 'Welcome to CogniCare Help. Tap Memory Match to find matching pairs. Tap Sequence Recall to remember the sequence of items. Tap the speaker button anytime to hear instructions spoken out loud. Tap Home to return to the main screen.';

  const helpTopics = [
    {
      icon: '🧠',
      title: 'How to Play Memory Match',
      desc: 'Tap two cards to flip them over. If both cards have the same regional item, they stay open. Find all pairs to finish.'
    },
    {
      icon: '🔢',
      title: 'How to Play Sequence Recall',
      desc: 'Watch the regional items shown on screen. After they hide, tap the items in the same exact sequence order.'
    },
    {
      icon: '🔊',
      title: 'How to Listen with Voice',
      desc: 'Whenever you see the green Listen button with a speaker icon, tap it and the app will read instructions aloud.'
    },
    {
      icon: '💊',
      title: 'How to Use Reminders',
      desc: 'Check the Reminders tab to see your daily medicine, meals, and cognitive activities. Tap any item to mark it complete.'
    },
    {
      icon: '🏠',
      title: 'How to Return Home',
      desc: 'Tap the Home button at the bottom left anytime to return back to the main greeting screen.'
    }
  ];

  return (
    <ElderlyLayout title={t.help} subtitle="Simple step-by-step guides for all activities.">
      <div className="space-y-6">
        <div className="flex justify-end">
          <VoiceButton textToSpeak={helpSpeech} label="Listen to All Help" variant="secondary" />
        </div>

        <div className="space-y-4">
          {helpTopics.map((topic, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-3xl border-2 flex items-start gap-4 transition-all ${
                accessibility.highContrast
                  ? 'bg-neutral-900 border-yellow-400 text-yellow-300'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="text-4xl shrink-0">{topic.icon}</div>
              <div className="space-y-1 flex-1">
                <h2 className="text-xl sm:text-2xl font-black">{topic.title}</h2>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">{topic.desc}</p>
              </div>
              <VoiceButton
                textToSpeak={`${topic.title}. ${topic.desc}`}
                label=""
                variant="subtle"
                className="p-3"
              />
            </div>
          ))}
        </div>
      </div>
    </ElderlyLayout>
  );
};
