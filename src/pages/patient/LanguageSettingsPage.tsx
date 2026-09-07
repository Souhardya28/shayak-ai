import React from 'react';
import { Check, Globe, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ElderlyLayout } from '../../components/patient/ElderlyLayout';
import { Language } from '../../types';
import { VoiceButton } from '../../components/common/VoiceButton';

export const LanguageSettingsPage: React.FC = () => {
  const { language, setLanguage, t, accessibility } = useApp();

  const languages: { code: Language; label: string; native: string; desc: string }[] = [
    {
      code: 'as',
      label: 'Assamese',
      native: 'অসমীয়া',
      desc: 'North Eastern Regional mother tongue with local terminology'
    },
    {
      code: 'hi',
      label: 'Hindi',
      native: 'हिन्दी',
      desc: 'National language option with clear accessible wording'
    },
    {
      code: 'en',
      label: 'English',
      native: 'English',
      desc: 'Standard international healthcare and cognitive terminology'
    }
  ];

  return (
    <ElderlyLayout title="Language / ভাষা / भाषा" subtitle="Select your preferred language for voice and screen text.">
      <div className="space-y-6">
        <div className="space-y-3">
          {languages.map((lang) => {
            const isSelected = language === lang.code;

            return (
              <button
                key={lang.code}
                id={`lang-btn-${lang.code}`}
                onClick={() => setLanguage(lang.code)}
                className={`w-full p-6 rounded-3xl border-3 flex items-center justify-between gap-4 text-left transition-all cursor-pointer transform active:scale-95 ${
                  isSelected
                    ? accessibility.highContrast
                      ? 'bg-yellow-400 text-black border-white'
                      : 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-300'
                    : accessibility.highContrast
                    ? 'bg-neutral-900 border-neutral-700 text-yellow-300 hover:border-yellow-400'
                    : 'bg-white border-slate-200 hover:border-emerald-300 text-slate-800 shadow-xs'
                }`}
              >
                <div>
                  <div className="text-3xl font-black">{lang.native}</div>
                  <div className="text-lg font-bold text-emerald-800">{lang.label}</div>
                  <p className="text-sm text-slate-500 mt-1">{lang.desc}</p>
                </div>

                {isSelected && (
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-teal-900 text-base font-medium flex items-center gap-2">
          <Globe className="w-5 h-5 text-teal-700 shrink-0" />
          <span>UI buttons and voice speech change immediately upon selection.</span>
        </div>
      </div>
    </ElderlyLayout>
  );
};
