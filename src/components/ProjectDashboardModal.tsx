import React from 'react';
import { EscrowMilestone, Subcontractor } from '../types';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  User,
  X,
  Calendar,
  Building2,
  Download,
} from 'lucide-react';

interface ProjectDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestones: EscrowMilestone[];
  hiredContractors: Subcontractor[];
  onOpenEscrow: () => void;
}

export const ProjectDashboardModal: React.FC<ProjectDashboardModalProps> = ({
  isOpen,
  onClose,
  milestones,
  hiredContractors,
  onOpenEscrow,
}) => {
  if (!isOpen) return null;

  const completedCount = milestones.filter((m) => m.status === 'paid').length;
  const progressPct = Math.round((completedCount / milestones.length) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 border border-stone-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-stone-400 hover:text-stone-700 rounded-lg"
          aria-label="Close Dashboard"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-2">
          <FolderKanban className="w-4 h-4 text-amber-700" />
          <span>My Home Renovation Workspace</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
          <div>
            <h2 className="text-2xl font-bold text-stone-900 font-display">
              Park Colonial · 4-Room Scandinavian
            </h2>
            <div className="text-xs text-stone-500 mt-0.5">
              Project Reference: <span className="font-mono font-bold text-stone-700">HOMESTYLER-SG-88912</span> · Permit #HDB-RN-88219
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              In Progress · {progressPct}% Complete
            </span>
          </div>
        </div>

        {/* Milestone Bar */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-xs text-stone-600 font-medium">
            <span>Overall Site Milestone Progress</span>
            <span className="font-mono">{completedCount} of {milestones.length} Milestones Cleared</span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-amber-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Active Contractors on Site */}
        <div className="mt-8 space-y-3">
          <div className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            Assigned Verified Trade Specialists
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {hiredContractors.map((c) => (
              <div
                key={c.id}
                className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-lg ${c.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0`}
                  >
                    {c.avatarInitial}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">{c.name}</div>
                    <div className="text-[11px] text-stone-500">{c.tradeLabel}</div>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-emerald-700 font-semibold">
                  SafePay Protected
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statutory Permits & Reports */}
        <div className="mt-8 space-y-3">
          <div className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            Approved Permits &amp; Inspection Reports
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-stone-500" />
                <span className="font-semibold text-stone-800">
                  Approved Renovation Permit (HDB / MCST)
                </span>
              </div>
              <span className="text-[11px] text-emerald-700 font-bold">Approved &amp; Active</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-stone-500" />
                <span className="font-semibold text-stone-800">
                  72-Hour Waterproofing Ponding Test Report &amp; Thermal Video
                </span>
              </div>
              <span className="text-[11px] text-amber-800 font-bold">Passed Inspection</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-stone-500" />
                <span className="font-semibold text-stone-800">
                  EMA Single Line Diagram (SLD) LEW Sign-off
                </span>
              </div>
              <span className="text-[11px] text-emerald-700 font-bold">Verified Grade 7</span>
            </div>
          </div>
        </div>

        {/* Footer with Escrow Trigger */}
        <div className="mt-8 pt-5 border-t border-stone-200 flex items-center justify-between">
          <div className="text-xs text-stone-500">
            Escrow Trust: <span className="font-bold text-stone-800">DBS Bank Nominees</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenEscrow();
            }}
            className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Manage SafePay Escrow
          </button>
        </div>
      </div>
    </div>
  );
};
