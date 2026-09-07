import React, { useState } from 'react';
import { Plus, CheckCircle2, Clock, Trash2, Bell, Sparkles, Volume2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ElderlyLayout } from '../../components/patient/ElderlyLayout';
import { VoiceButton } from '../../components/common/VoiceButton';
import { Modal } from '../../components/common/Modal';
import { ReminderCategory } from '../../types';

export const PatientRemindersPage: React.FC = () => {
  const {
    activePatient,
    t,
    reminders,
    toggleReminderCompleted,
    toggleReminderEnabled,
    addReminder,
    deleteReminder,
    accessibility
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('10:00 AM');
  const [newCategory, setNewCategory] = useState<ReminderCategory>('Medicine');
  const [newRepeat, setNewRepeat] = useState('Daily');

  const patientReminders = reminders.filter(
    (r) => !r.patientId || r.patientId === activePatient.id
  );

  const remindersSpeech = `You have ${patientReminders.length} daily reminders. ${
    patientReminders.length > 0 ? `Next reminder is: ${patientReminders[0].title} at ${patientReminders[0].time}.` : ''
  }`;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addReminder({
      title: newTitle.trim(),
      category: newCategory,
      time: newTime,
      repeat: newRepeat,
      completed: false,
      enabled: true
    });

    setNewTitle('');
    setIsAddModalOpen(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Medicine':
        return '💊';
      case 'Meal':
        return '🍽️';
      case 'Activity':
        return '🧠';
      case 'Appointment':
        return '🩺';
      default:
        return '⏰';
    }
  };

  return (
    <ElderlyLayout title={t.reminders} subtitle="Gentle daily reminders for health, meals, and activities.">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <VoiceButton textToSpeak={remindersSpeech} label={t.listen} variant="secondary" />
          <button
            onClick={() => setIsAddModalOpen(true)}
            className={`py-3 px-5 rounded-2xl font-bold flex items-center gap-2 cursor-pointer shadow-md transition-transform active:scale-95 ${
              accessibility.highContrast
                ? 'bg-yellow-400 text-black border border-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>Add Reminder</span>
          </button>
        </div>

        {/* Reminders List */}
        <div className="space-y-3">
          {patientReminders.map((rem) => (
            <div
              key={rem.id}
              className={`p-5 rounded-3xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                rem.completed
                  ? accessibility.highContrast
                    ? 'border-neutral-800 bg-neutral-950 opacity-60'
                    : 'border-slate-200 bg-slate-50 text-slate-500'
                  : accessibility.highContrast
                  ? 'border-yellow-400 bg-black'
                  : 'border-emerald-200 hover:border-emerald-300 bg-white shadow-sm'
              }`}
            >
              <div
                className="flex items-center gap-4 cursor-pointer flex-1"
                onClick={() => toggleReminderCompleted(rem.id)}
              >
                <div className="text-4xl shrink-0">{getCategoryIcon(rem.category)}</div>
                <div className="space-y-1">
                  <div
                    className={`text-xl sm:text-2xl font-black ${
                      rem.completed ? 'line-through opacity-70' : 'text-slate-900'
                    }`}
                  >
                    {rem.title}
                  </div>
                  <div className="flex items-center gap-2 text-sm sm:text-base font-semibold text-emerald-700">
                    <Clock className="w-4 h-4" />
                    <span>{rem.time}</span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100/70 text-emerald-900 text-xs">
                      {rem.category}
                    </span>
                    <span>•</span>
                    <span>{rem.repeat}</span>
                  </div>
                </div>
              </div>

              {/* Status and Delete Controls */}
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => toggleReminderCompleted(rem.id)}
                  className={`py-2 px-4 rounded-xl font-bold flex items-center gap-2 border-2 cursor-pointer transition-all ${
                    rem.completed
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : accessibility.highContrast
                      ? 'border-yellow-400 text-yellow-300'
                      : 'border-slate-300 text-slate-700 hover:border-emerald-500'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{rem.completed ? 'Completed' : 'Mark Done'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => deleteReminder(rem.id)}
                  className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Delete Reminder"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Reminder Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Reminder"
        maxWidth="md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Reminder Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Afternoon Blood Pressure Tablet"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full p-3.5 rounded-2xl border border-slate-300 text-base focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Time</label>
              <input
                type="text"
                placeholder="e.g. 02:00 PM"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full p-3 rounded-2xl border border-slate-300 text-base focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as ReminderCategory)}
                className="w-full p-3 rounded-2xl border border-slate-300 text-base focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Medicine">💊 Medicine</option>
                <option value="Meal">🍽️ Meal</option>
                <option value="Activity">🧠 Activity</option>
                <option value="Appointment">🩺 Appointment</option>
                <option value="Other">⏰ Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Repeat</label>
            <select
              value={newRepeat}
              onChange={(e) => setNewRepeat(e.target.value)}
              className="w-full p-3 rounded-2xl border border-slate-300 text-base focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="Daily">Daily</option>
              <option value="Mon-Fri">Monday to Friday</option>
              <option value="Weekends">Weekends Only</option>
              <option value="Once">Once Only</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-5 py-2.5 text-base font-medium text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-base font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md cursor-pointer"
            >
              Save Reminder
            </button>
          </div>
        </form>
      </Modal>
    </ElderlyLayout>
  );
};
