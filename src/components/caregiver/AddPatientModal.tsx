import React, { useState } from 'react';
import { UserPlus, Sparkles, Check, Heart, MapPin, Globe, Brain, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Language, Patient } from '../../types';

interface PresetPatient {
  label: string;
  name: string;
  age: number;
  stateNER: string;
  location: string;
  language: Language;
  caregiverName: string;
  avatarEmoji: string;
  conditionNote: string;
  memoryDiff: number;
  sequenceDiff: number;
}

const REGIONAL_PRESETS: PresetPatient[] = [
  {
    label: 'Assam: Biren Gogoi',
    name: 'Biren Gogoi',
    age: 71,
    stateNER: 'Assam',
    location: 'Sivasagar, Historic Valley',
    language: 'as',
    caregiverName: 'Mridula Gogoi (Daughter)',
    avatarEmoji: '👴',
    conditionNote: 'Early age memory lapses; responds warmly to Assamese Bihu folk songs and brassware crafts.',
    memoryDiff: 2,
    sequenceDiff: 1
  },
  {
    label: 'Nagaland: Imlongba Ao',
    name: 'Imlongba Ao',
    age: 75,
    stateNER: 'Nagaland',
    location: 'Mokokchung, Hills District',
    language: 'en',
    caregiverName: 'Sentila Ao (Granddaughter)',
    avatarEmoji: '🧓',
    conditionNote: 'Mild cognitive fatigue; benefits from short sequential recall exercises with regional hornbill motifs.',
    memoryDiff: 2,
    sequenceDiff: 2
  },
  {
    label: 'Sikkim: Rinchen Lhamo',
    name: 'Rinchen Lhamo',
    age: 69,
    stateNER: 'Sikkim',
    location: 'Gangtok, Ridge View',
    language: 'hi',
    caregiverName: 'Tashi Bhutia (Son)',
    avatarEmoji: '👵',
    conditionNote: 'Short-term memory difficulties; enjoys visual patterns inspired by orchid flora and monastic bells.',
    memoryDiff: 3,
    sequenceDiff: 2
  },
  {
    label: 'Meghalaya: Mary Kharbhih',
    name: 'Mary Kharbhih',
    age: 73,
    stateNER: 'Meghalaya',
    location: 'Shillong, East Khasi Hills',
    language: 'en',
    caregiverName: 'Daphinda Kharbhih (Niece)',
    avatarEmoji: '👩‍🦳',
    conditionNote: 'Gentle forgetfulness; active listener who responds well to spoken audio reminders and nature crafts.',
    memoryDiff: 2,
    sequenceDiff: 1
  }
];

const NER_STATES = [
  'Assam',
  'Arunachal Pradesh',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Sikkim',
  'Tripura'
];

const AVATAR_OPTIONS = ['👴', '👵', '🧓', '🧑‍🦳', '👩‍🦳', '👨‍🦳', '🌸', '🌿'];

export const AddPatientModal: React.FC = () => {
  const { isAddPatientModalOpen, closeAddPatientModal, addPatient } = useApp();

  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(70);
  const [stateNER, setStateNER] = useState('Assam');
  const [location, setLocation] = useState('Kamrup Metro, Guwahati');
  const [language, setLanguage] = useState<Language>('as');
  const [caregiverName, setCaregiverName] = useState('');
  const [avatarEmoji, setAvatarEmoji] = useState('👴');
  const [conditionNote, setConditionNote] = useState('');
  const [memoryDiff, setMemoryDiff] = useState<number>(2);
  const [sequenceDiff, setSequenceDiff] = useState<number>(1);
  const [autoActivate, setAutoActivate] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const applyPreset = (preset: PresetPatient) => {
    setName(preset.name);
    setAge(preset.age);
    setStateNER(preset.stateNER);
    setLocation(preset.location);
    setLanguage(preset.language);
    setCaregiverName(preset.caregiverName);
    setAvatarEmoji(preset.avatarEmoji);
    setConditionNote(preset.conditionNote);
    setMemoryDiff(preset.memoryDiff);
    setSequenceDiff(preset.sequenceDiff);
  };

  const resetForm = () => {
    setName('');
    setAge(70);
    setStateNER('Assam');
    setLocation('');
    setLanguage('as');
    setCaregiverName('');
    setAvatarEmoji('👴');
    setConditionNote('');
    setMemoryDiff(2);
    setSequenceDiff(1);
    setSuccessMessage(null);
  };

  const handleClose = () => {
    resetForm();
    closeAddPatientModal();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPatient = addPatient(
      {
        name: name.trim(),
        age: Number(age) || 70,
        stateNER,
        location: location.trim() || `${stateNER} Region`,
        language,
        caregiverName: caregiverName.trim() || 'Primary Caregiver',
        avatarEmoji,
        conditionNote:
          conditionNote.trim() ||
          'Mild cognitive memory support and daily routine adherence.',
        currentDifficultyMemory: memoryDiff,
        currentDifficultySequence: sequenceDiff
      },
      autoActivate
    );

    setSuccessMessage(`Patient profile for "${newPatient.name}" has been registered successfully!`);

    setTimeout(() => {
      handleClose();
    }, 1200);
  };

  return (
    <Modal
      isOpen={isAddPatientModalOpen}
      onClose={handleClose}
      title="Register New Patient Profile"
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Success Alert */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-3 animate-in fade-in">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-5 h-5 stroke-[3]" />
            </div>
            <div>
              <div className="font-bold text-base">{successMessage}</div>
              <p className="text-xs text-emerald-700">
                Patient directory updated and starter reminders initialized.
              </p>
            </div>
          </div>
        )}

        {/* Quick Regional Presets */}
        <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 space-y-2">
          <div className="flex items-center gap-2 text-teal-900 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Quick Regional Patient Presets (1-Click Fill)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {REGIONAL_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(preset)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-teal-100 text-teal-900 border border-teal-200 text-xs font-semibold shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>{preset.avatarEmoji}</span>
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar & Name */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                Profile Icon
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {AVATAR_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setAvatarEmoji(emoji)}
                    className={`w-9 h-9 text-lg rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                      avatarEmoji === emoji
                        ? 'bg-teal-100 border-teal-500 scale-105 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                Patient Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Biren Gogoi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-1">
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                Age (Years) *
              </label>
              <input
                type="number"
                min={45}
                max={110}
                required
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Region & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                North Eastern Region (NER) State *
              </label>
              <select
                value={stateNER}
                onChange={(e) => setStateNER(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white cursor-pointer"
              >
                {NER_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                District / Town / Village
              </label>
              <input
                type="text"
                placeholder="e.g. Sivasagar, Upper Assam"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Language & Primary Caregiver */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                Preferred Interface Language *
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white cursor-pointer"
              >
                <option value="as">অসমীয়া (Assamese - Regional)</option>
                <option value="hi">हिन्दी (Hindi - National)</option>
                <option value="en">English (Standard)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                Primary Caregiver Contact &amp; Relation
              </label>
              <input
                type="text"
                placeholder="e.g. Mridula Gogoi (Daughter)"
                value={caregiverName}
                onChange={(e) => setCaregiverName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Baseline Adaptive Levels */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
              <Brain className="w-4 h-4 text-purple-600" />
              <span>Initial Adaptive Difficulty Levels (Configurable)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Memory Match Starting Level:
                </label>
                <select
                  value={memoryDiff}
                  onChange={(e) => setMemoryDiff(Number(e.target.value))}
                  className="w-full p-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                >
                  <option value={1}>Level 1 - Gentle (2 card pairs)</option>
                  <option value={2}>Level 2 - Standard (3 card pairs)</option>
                  <option value={3}>Level 3 - Intermediate (4 card pairs)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Sequence Recall Starting Level:
                </label>
                <select
                  value={sequenceDiff}
                  onChange={(e) => setSequenceDiff(Number(e.target.value))}
                  className="w-full p-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                >
                  <option value={1}>Level 1 - Short (3 item sequence)</option>
                  <option value={2}>Level 2 - Standard (4 item sequence)</option>
                  <option value={3}>Level 3 - Advanced (5 item sequence)</option>
                </select>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              * The AI Adaptive Engine will automatically adjust these levels after each completed session based on accuracy and interaction response time.
            </p>
          </div>

          {/* Care & Condition Notes */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
              Caregiver Observation &amp; Cognitive Profile Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Mild short-term forgetfulness; enjoys tea garden memories and handloom crafts; needs spoken reminders."
              value={conditionNote}
              onChange={(e) => setConditionNote(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs leading-relaxed focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Auto-activate toggle */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="auto-activate-check"
              checked={autoActivate}
              onChange={(e) => setAutoActivate(e.target.checked)}
              className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
            />
            <label
              htmlFor="auto-activate-check"
              className="text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer select-none"
            >
              Set as active patient immediately across Patient App and Caregiver Dashboard
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Patient</span>
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
