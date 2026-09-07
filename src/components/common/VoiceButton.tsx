import React, { useState } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { speakText, stopSpeaking, isSpeechSupported } from '../../utils/speech';
import { useApp } from '../../context/AppContext';

interface VoiceButtonProps {
  textToSpeak: string;
  label?: string;
  variant?: 'primary' | 'secondary' | 'subtle' | 'large';
  className?: string;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  textToSpeak,
  label,
  variant = 'secondary',
  className = ''
}) => {
  const { language, t } = useApp();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const supported = isSpeechSupported();

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!supported) return;

    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakText(textToSpeak, language, () => {
        setIsSpeaking(false);
      });
    }
  };

  if (!supported) {
    return null;
  }

  const baseStyle =
    'inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition-all select-none cursor-pointer active:scale-95';

  const variantStyles = {
    primary:
      'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-700/20 px-5 py-3 text-lg font-semibold',
    secondary:
      'bg-teal-50 hover:bg-teal-100 text-teal-900 border-2 border-teal-300 px-4 py-2.5 text-base font-medium',
    subtle:
      'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-3 py-1.5 text-sm',
    large:
      'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 px-6 py-4 text-xl font-bold min-h-[56px]'
  };

  return (
    <button
      id={`voice-btn-${label ? label.replace(/\s+/g, '-').toLowerCase() : 'listen'}`}
      type="button"
      onClick={handleSpeak}
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
      title={isSpeaking ? 'Stop speaking' : 'Listen with voice'}
      aria-label={label || t.listen}
    >
      {isSpeaking ? (
        <VolumeX className="w-6 h-6 animate-pulse text-amber-300" />
      ) : (
        <Volume2 className="w-6 h-6 text-current" />
      )}
      <span>{label || t.listen}</span>
    </button>
  );
};
