import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserPlus,
  CheckCircle2,
  Brain,
  MapPin,
  Globe,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  HeartHandshake,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CaregiverLayout } from '../../components/caregiver/CaregiverLayout';

export const CaregiverPatientsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    patients,
    activePatient,
    setActivePatientId,
    openAddPatientModal,
    openDeletePatientModal,
    sessions
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('all');

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.caregiverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = stateFilter === 'all' || p.stateNER === stateFilter;
    return matchesSearch && matchesState;
  });

  const nerStates = Array.from(new Set(patients.map((p) => p.stateNER)));

  return (
    <CaregiverLayout
      title="Patients Directory & Cognitive Profiles"
      subtitle="Manage enrolled elderly individuals, observe starting baseline difficulties, and switch active telemetry monitoring."
    >
      <div className="space-y-6">
        {/* Top Summary Bar & Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xl shadow-xs">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900">
                  {patients.length} Registered Patients
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  North Eastern Region
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Active telemetry session currently monitoring: <strong>{activePatient.name}</strong> ({activePatient.stateNER})
              </p>
            </div>
          </div>

          <button
            id="add-patient-main-btn"
            onClick={openAddPatientModal}
            className="px-5 py-3 rounded-2xl font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all self-start sm:self-auto hover:shadow-md active:scale-98"
          >
            <UserPlus className="w-5 h-5 stroke-[2.5]" />
            <span>Add New Patient</span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by patient name, location, or caregiver..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-2xl border border-slate-200 shadow-2xs text-xs font-bold text-slate-700">
            <Filter className="w-4 h-4 text-slate-400" />
            <span>State:</span>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="all">All States ({patients.length})</option>
              {nerStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Patient Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPatients.map((patient) => {
            const isActive = patient.id === activePatient.id;
            const patientSessions = sessions.filter((s) => s.patientId === patient.id);

            return (
              <div
                key={patient.id}
                className={`bg-white rounded-3xl border-2 transition-all p-6 flex flex-col justify-between gap-4 relative shadow-xs ${
                  isActive
                    ? 'border-teal-500 ring-2 ring-teal-200/80 bg-teal-50/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Active Indicator Badge */}
                {isActive && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-teal-600 text-white shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                      Active Monitored
                    </span>
                  </div>
                )}

                <div className="space-y-3">
                  {/* Avatar & Header */}
                  <div className="flex items-start gap-3.5 pr-28">
                    <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-3xl shadow-2xs shrink-0">
                      {patient.avatarEmoji}
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-900 leading-tight">
                        {patient.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {patient.age} yrs
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {patient.stateNER}
                        </span>
                        <span className="text-[10.5px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/80 select-all">
                          ID: {patient.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Location & Language */}
                  <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{patient.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        Language:{' '}
                        <strong>
                          {patient.language === 'as'
                            ? 'অসমীয়া (Assamese)'
                            : patient.language === 'hi'
                            ? 'हिन्दी (Hindi)'
                            : 'English'}
                        </strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HeartHandshake className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        Caregiver: <strong className="text-slate-800">{patient.caregiverName}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Care / Condition Note */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 line-clamp-2">
                    "{patient.conditionNote}"
                  </div>

                  {/* Adaptive Cognitive Difficulties */}
                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                    <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-950">
                      <span className="text-[10px] text-purple-700 uppercase font-bold block">
                        Memory Match
                      </span>
                      <span className="text-sm font-black">
                        Level {patient.currentDifficultyMemory || 2}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-950">
                      <span className="text-[10px] text-blue-700 uppercase font-bold block">
                        Sequence Recall
                      </span>
                      <span className="text-sm font-black">
                        Level {patient.currentDifficultySequence || 1}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Bottom Bar */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-1">
                    {!isActive ? (
                      <button
                        id={`select-patient-${patient.id}`}
                        onClick={() => setActivePatientId(patient.id)}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 border border-slate-200 transition-colors cursor-pointer flex-1"
                      >
                        Set as Active
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate('/patient')}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1 flex-1"
                      >
                        <span>Launch App</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Delete Patient ID button */}
                  <button
                    id={`delete-patient-${patient.id}`}
                    onClick={() => openDeletePatientModal(patient)}
                    title={`Delete Patient Profile (ID: ${patient.id})`}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete ID</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty Search State */}
        {filteredPatients.length === 0 && (
          <div className="text-center p-12 bg-white rounded-3xl border border-slate-200 space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="text-lg font-bold text-slate-800">No matching patient profiles found</h4>
            <p className="text-sm text-slate-500">
              Try adjusting your search criteria or register a new patient profile.
            </p>
            <button
              onClick={openAddPatientModal}
              className="mt-2 px-4 py-2 bg-teal-600 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Add New Patient
            </button>
          </div>
        )}
      </div>
    </CaregiverLayout>
  );
};
