import React from 'react';
import { Type, Eye, Volume2, Sparkles, Sliders, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ElderlyLayout } from '../../components/patient/ElderlyLayout';
import { FontSizeSetting } from '../../types';

export const AccessibilitySettingsPage: React.FC = () => {
  const { accessibility, updateAccessibility, t } = useApp();

  const fontOptions: { id: FontSizeSetting; label: string; sample: string }[] = [
    { id: 'small', label: 'Small', sample: '16px' },
    { id: 'medium', label: 'Medium', sample: '18px' },
    { id: 'large', label: 'Large (Elderly Default)', sample: '20px' },
    { id: 'extralarge', label: 'Extra Large', sample: '24px' }
  ];

  return (
    <ElderlyLayout
      title="Accessibility Settings"
      subtitle="Tailor fonts, contrast, and voice assistance for ease of use."
      showBackButton
      backTo="/patient"
    >
      <div className="space-y-6">
        {/* Font Size Selector */}
        <div
          className={`p-6 rounded-3xl border-2 space-y-4 ${
            accessibility.highContrast
              ? 'bg-neutral-900 border-yellow-400 text-yellow-300'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Type className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl sm:text-2xl font-bold">Text & Font Size</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fontOptions.map((opt) => {
              const isSelected = accessibility.fontSize === opt.id;
              return (
                <button
                  key={opt.id}
                  id={`font-size-${opt.id}`}
                  onClick={() => updateAccessibility({ fontSize: opt.id })}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-300 font-black text-emerald-950'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50 font-medium text-slate-700'
                  }`}
                >
                  <div>
                    <div className="text-lg">{opt.label}</div>
                    <span className="text-xs text-slate-500">Sample size: {opt.sample}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-6 h-6 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* High Contrast Toggle */}
        <div
          className={`p-6 rounded-3xl border-2 flex items-center justify-between gap-4 ${
            accessibility.highContrast
              ? 'bg-neutral-900 border-yellow-400 text-yellow-300'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Eye className="w-6 h-6 text-emerald-600" />
              <h2 className="text-xl sm:text-2xl font-bold">High Contrast Mode</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600">
              Yellow on deep black background for low-vision and cataract conditions.
            </p>
          </div>

          <button
            id="toggle-high-contrast-btn"
            onClick={() => updateAccessibility({ highContrast: !accessibility.highContrast })}
            className={`px-6 py-3 rounded-2xl font-black text-lg border-2 cursor-pointer transition-all ${
              accessibility.highContrast
                ? 'bg-yellow-400 text-black border-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
            }`}
          >
            {accessibility.highContrast ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Voice Guidance Toggle */}
        <div
          className={`p-6 rounded-3xl border-2 flex items-center justify-between gap-4 ${
            accessibility.highContrast
              ? 'bg-neutral-900 border-yellow-400 text-yellow-300'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Volume2 className="w-6 h-6 text-emerald-600" />
              <h2 className="text-xl sm:text-2xl font-bold">Voice Guidance Audio</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600">
              Automatically reads game instructions and results out loud.
            </p>
          </div>

          <button
            id="toggle-voice-guidance-btn"
            onClick={() => updateAccessibility({ voiceGuidance: !accessibility.voiceGuidance })}
            className={`px-6 py-3 rounded-2xl font-black text-lg border-2 cursor-pointer transition-all ${
              accessibility.voiceGuidance
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
            }`}
          >
            {accessibility.voiceGuidance ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Reduce Animation Toggle */}
        <div
          className={`p-6 rounded-3xl border-2 flex items-center justify-between gap-4 ${
            accessibility.highContrast
              ? 'bg-neutral-900 border-yellow-400 text-yellow-300'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-emerald-600" />
              <h2 className="text-xl sm:text-2xl font-bold">Reduce Motion</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600">
              Suppresses rapid card rotations and intense animations.
            </p>
          </div>

          <button
            id="toggle-reduce-animation-btn"
            onClick={() => updateAccessibility({ reduceAnimation: !accessibility.reduceAnimation })}
            className={`px-6 py-3 rounded-2xl font-black text-lg border-2 cursor-pointer transition-all ${
              accessibility.reduceAnimation
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
            }`}
          >
            {accessibility.reduceAnimation ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
    </ElderlyLayout>
  );
};
