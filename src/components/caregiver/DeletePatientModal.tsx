import React from 'react';
import { Trash2, AlertTriangle, X, ShieldAlert, UserPlus, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DeletePatientModal: React.FC = () => {
  const {
    patientToDelete,
    closeDeletePatientModal,
    deletePatient,
    patients,
    sessions,
    reminders,
    aiDecisions,
    openAddPatientModal
  } = useApp();

  if (!patientToDelete) return null;

  const canDelete = patients.length > 1;

  const patientSessionsCount = sessions.filter(
    (s) => s.patientId === patientToDelete.id
  ).length;

  const patientRemindersCount = reminders.filter(
    (r) => r.patientId === patientToDelete.id
  ).length;

  const patientDecisionsCount = aiDecisions.filter(
    (d) => d.patientId === patientToDelete.id
  ).length;

  const handleDeleteConfirm = () => {
    if (!canDelete) return;
    deletePatient(patientToDelete.id);
    closeDeletePatientModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={closeDeletePatientModal}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-patient-title"
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs">
              <Trash2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3
                id="delete-patient-title"
                className="text-xl font-black text-slate-900 tracking-tight"
              >
                Delete Patient ID
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Remove patient profile & telemetry records
              </p>
            </div>
          </div>

          <button
            onClick={closeDeletePatientModal}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Target Patient Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-2xs shrink-0">
                {patientToDelete.avatarEmoji}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-black text-base text-slate-900 truncate">
                  {patientToDelete.name}
                </div>
                <div className="text-xs text-slate-500">
                  {patientToDelete.age} yrs · {patientToDelete.stateNER} · Caregiver: {patientToDelete.caregiverName}
                </div>
              </div>
            </div>

            {/* Explicit Patient ID Display */}
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Target ID
              </span>
              <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md text-[11px] select-all">
                {patientToDelete.id}
              </span>
            </div>
          </div>

          {/* Telemetry to be wiped */}
          <div className="px-3.5 py-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-800">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Data impact on deletion:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-900/90 pl-5">
              Will permanently erase <strong>{patientSessionsCount}</strong> activity session logs,{' '}
              <strong>{patientDecisionsCount}</strong> AI difficulty adaptation records, and{' '}
              <strong>{patientRemindersCount}</strong> reminders.
            </p>
          </div>

          {/* Warning if only 1 patient remains */}
          {!canDelete ? (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-rose-800">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Cannot delete last remaining patient</span>
              </div>
              <p className="text-rose-700 leading-relaxed text-[11px]">
                The application requires at least one registered patient profile for telemetry monitoring. Please register a new patient before deleting <strong>{patientToDelete.name}</strong>.
              </p>
              <button
                type="button"
                onClick={() => {
                  closeDeletePatientModal();
                  openAddPatientModal();
                }}
                className="w-full mt-2 py-2 px-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Register Another Patient First</span>
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to delete patient profile <strong>{patientToDelete.name}</strong> (<code>{patientToDelete.id}</code>)? This action cannot be undone.
            </p>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 pt-3 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
          <button
            type="button"
            id="cancel-delete-patient-btn"
            onClick={closeDeletePatientModal}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          {canDelete && (
            <button
              type="button"
              id="confirm-delete-patient-submit-btn"
              onClick={handleDeleteConfirm}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer active:scale-98"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Patient ID</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
