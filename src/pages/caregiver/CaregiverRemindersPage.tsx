import React, { useState } from 'react';
import { Plus, Clock, Trash2, CheckCircle2, XCircle, Bell, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CaregiverLayout } from '../../components/caregiver/CaregiverLayout';
import { Modal } from '../../components/common/Modal';
import { ReminderCategory } from '../../types';

export const CaregiverRemindersPage: React.FC = () => {
  const {
    activePatient,
    reminders,
    addReminder,
    deleteReminder,
    toggleReminderCompleted,
    toggleReminderEnabled
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('08:00 AM');
  const [category, setCategory] = useState<ReminderCategory>('Medicine');
  const [repeat, setRepeat] = useState('Daily');

  const patientReminders = reminders.filter(
    (r) => !r.patientId || r.patientId === activePatient.id
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addReminder({
      title: title.trim(),
      category,
      time,
      repeat,
      completed: false,
      enabled: true
    });

    setTitle('');
    setIsModalOpen(false);
  };

  return (
    <CaregiverLayout
      title="Daily Care Schedule & Reminders"
      subtitle={`Configure medical adherence, nutrition, and cognitive activity alerts for ${activePatient.name}.`}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-slate-700">
              Total Active Reminders: {patientReminders.filter((r) => r.enabled).length}
            </span>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-xl font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Schedule New Alert</span>
          </button>
        </div>

        {/* Reminders Management Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase text-xs font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Title & Details</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Scheduled Time</th>
                <th className="py-3.5 px-4">Frequency</th>
                <th className="py-3.5 px-4">Today's Status</th>
                <th className="py-3.5 px-4">Enabled</th>
                <th className="py-3.5 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patientReminders.map((rem) => (
                <tr key={rem.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{rem.title}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                      {rem.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-teal-800">{rem.time}</td>
                  <td className="py-3.5 px-4 text-xs text-slate-500 font-medium">{rem.repeat}</td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => toggleReminderCompleted(rem.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors flex items-center gap-1 ${
                        rem.completed
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{rem.completed ? 'Completed' : 'Pending'}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => toggleReminderEnabled(rem.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                        rem.enabled ? 'bg-teal-50 text-teal-700' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {rem.enabled ? 'Active' : 'Paused'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => deleteReminder(rem.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete reminder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Reminder Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Schedule Reminder"
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
              Reminder Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Afternoon Hydration & Herbal Tea"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Time
              </label>
              <input
                type="text"
                placeholder="e.g. 03:00 PM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ReminderCategory)}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="Medicine">Medicine</option>
                <option value="Meal">Meal</option>
                <option value="Activity">Activity</option>
                <option value="Appointment">Appointment</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
              Repeat Frequency
            </label>
            <select
              value={repeat}
              onChange={(e) => setRepeat(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              <option value="Daily">Daily</option>
              <option value="Mon-Fri">Monday to Friday</option>
              <option value="Weekends">Weekends Only</option>
              <option value="Once">Once</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs cursor-pointer"
            >
              Save Alert
            </button>
          </div>
        </form>
      </Modal>
    </CaregiverLayout>
  );
};
