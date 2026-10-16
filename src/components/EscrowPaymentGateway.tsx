import React, { useState } from 'react';
import { EscrowMilestone } from '../types';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  CreditCard,
  Building,
  FileCheck,
  ArrowRight,
  Eye,
  Camera,
  Download,
  Info,
} from 'lucide-react';

interface EscrowPaymentGatewayProps {
  milestones: EscrowMilestone[];
  onReleaseMilestone: (milestoneId: number) => void;
  onDepositFunds: (milestoneId: number, amount: number) => void;
}

export const EscrowPaymentGateway: React.FC<EscrowPaymentGatewayProps> = ({
  milestones,
  onReleaseMilestone,
  onDepositFunds,
}) => {
  const [selectedMilestone, setSelectedMilestone] = useState<EscrowMilestone>(
    milestones.find((m) => m.status === 'action_required') || milestones[1]
  );
  const [paymentGatewayOpen, setPaymentGatewayOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'paynow' | 'card' | 'fast'>('paynow');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [releaseSuccessNotice, setReleaseSuccessNotice] = useState<string | null>(null);

  const totalProjectSum = milestones.reduce((sum, m) => sum + m.amount, 0);
  const totalPaidSum = milestones
    .filter((m) => m.status === 'paid')
    .reduce((sum, m) => sum + m.amount, 0);
  const inEscrowSum = milestones
    .filter((m) => m.status === 'in_escrow' || m.status === 'action_required')
    .reduce((sum, m) => sum + m.amount, 0);

  const handleApproveAndRelease = (m: EscrowMilestone) => {
    onReleaseMilestone(m.id);
    setReleaseSuccessNotice(
      `Milestone #${m.id} (${m.title}) approved! SGD $${m.amount.toLocaleString()} has been released from TTSD Escrow to the verified contractor.`
    );
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // safe fallback
    }
    setTimeout(() => {
      setReleaseSuccessNotice(null);
    }, 4500);
  };

  const handleSimulateDeposit = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentGatewayOpen(false);
      onDepositFunds(selectedMilestone.id, selectedMilestone.amount);
      setReleaseSuccessNotice(
        `Payment of SGD $${selectedMilestone.amount.toLocaleString()} successfully deposited into TTSD Protected Escrow Vault!`
      );
      try {
        confetti({
          particleCount: 40,
          spread: 50,
        });
      } catch (e) {}
    }, 1500);
  };

  return (
    <div className="py-10 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Release Success Banner */}
        {releaseSuccessNotice && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 flex items-center justify-between text-xs sm:text-sm font-semibold shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{releaseSuccessNotice}</span>
            </div>
            <button
              onClick={() => setReleaseSuccessNotice(null)}
              className="text-stone-400 hover:text-stone-600 text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>TTSD SafePay Protected Escrow Vault</span>
            </div>
            <h1 className="text-3xl font-bold text-stone-900 font-display tracking-tight">
              Milestone Escrow &amp; Payment Gateway
            </h1>
            <p className="mt-2 text-sm text-stone-600 max-w-2xl leading-relaxed">
              Your money is safe. Funds are held securely in an independent MAS-regulated escrow trust and disbursed only after you inspect and digitally sign off on completed work.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setPaymentGatewayOpen(true)}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs whitespace-nowrap shrink-0"
            >
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>Deposit to Escrow Vault</span>
            </button>
          </div>
        </div>

        {/* Financial Escrow Snapshot */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="text-xs font-medium text-stone-500">Total Project Value</div>
            <div className="text-2xl font-extrabold text-stone-900 font-mono mt-1 tabular-nums">
              ${totalProjectSum.toLocaleString()} SGD
            </div>
            <div className="text-[11px] text-stone-400 mt-1">Across 5 Progressive Milestones</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="text-xs font-medium text-emerald-700">Released to Contractors</div>
            <div className="text-2xl font-extrabold text-emerald-800 font-mono mt-1 tabular-nums">
              ${totalPaidSum.toLocaleString()} SGD
            </div>
            <div className="text-[11px] text-stone-400 mt-1">
              Verified by Homeowner Inspection
            </div>
          </div>

          <div className="bg-stone-900 text-white p-5 rounded-2xl border border-stone-800 shadow-xs flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                Currently Protected in Escrow
              </div>
              <div className="text-2xl font-extrabold text-white font-mono mt-1 tabular-nums">
                ${inEscrowSum.toLocaleString()} SGD
              </div>
            </div>
            <div className="text-[11px] text-stone-400 flex items-center gap-1.5 mt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Locked until your explicit approval</span>
            </div>
          </div>
        </div>

        {/* Milestone Schedule Grid */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Milestones List */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-lg font-bold text-stone-900 font-display mb-2">
              Progressive Payment Milestones
            </h2>

            {milestones.map((m) => {
              const isSelected = selectedMilestone.id === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMilestone(m)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-amber-600 shadow-md ring-1 ring-amber-600'
                      : 'bg-white/80 border-stone-200 hover:border-stone-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          m.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : m.status === 'action_required'
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : m.status === 'in_escrow'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {m.id}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                            {m.stage} ({m.percentage}%)
                          </span>
                          {m.status === 'paid' && (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              Disbursed
                            </span>
                          )}
                          {m.status === 'action_required' && (
                            <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                              Inspection Ready
                            </span>
                          )}
                          {m.status === 'in_escrow' && (
                            <span className="text-[10px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              Funded in Vault
                            </span>
                          )}
                          {m.status === 'upcoming' && (
                            <span className="text-[10px] text-stone-400 font-mono">
                              Pending Prior Stage
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-stone-900 mt-1">
                          {m.title}
                        </h3>

                        <p className="text-xs text-stone-600 mt-1 line-clamp-1">
                          {m.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-base font-extrabold text-stone-900 font-mono tabular-nums">
                        ${m.amount.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-stone-400 font-mono">SGD</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Selected Milestone Inspection & Release Action */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
            <div className="space-y-5">
              <div className="pb-4 border-b border-stone-100">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>Inspection &amp; Release Station</span>
                  <span className="font-mono text-amber-800">{selectedMilestone.stage}</span>
                </div>
                <h3 className="text-xl font-bold text-stone-900 font-display mt-1">
                  {selectedMilestone.title}
                </h3>
                <div className="text-2xl font-extrabold text-stone-900 font-mono mt-1 tabular-nums">
                  ${selectedMilestone.amount.toLocaleString()} SGD{' '}
                  <span className="text-xs text-stone-400 font-normal">
                    ({selectedMilestone.percentage}% of project)
                  </span>
                </div>
              </div>

              {/* Scope Checklist */}
              <div>
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                  Deliverable Inspection Checklist
                </h4>
                <div className="space-y-2">
                  {selectedMilestone.deliverables.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Uploaded Site Inspection Proofs */}
              {selectedMilestone.inspectionEvidence && selectedMilestone.inspectionEvidence.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                    Contractor Submitted Site Proof
                  </h4>
                  <div className="space-y-2">
                    {selectedMilestone.inspectionEvidence.map((ev, i) => (
                      <div
                        key={i}
                        className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Camera className="w-4 h-4 text-stone-500" />
                          <span className="font-medium text-stone-800">{ev.label}</span>
                        </div>
                        <span className="text-[11px] text-stone-400 font-mono">{ev.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons based on status */}
            <div className="mt-8 pt-5 border-t border-stone-100">
              {selectedMilestone.status === 'action_required' && (
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>
                      The contractor has completed this milestone and uploaded inspection proof. Click below to release payment from escrow.
                    </span>
                  </div>
                  <button
                    onClick={() => handleApproveAndRelease(selectedMilestone)}
                    className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Approve &amp; Release ${selectedMilestone.amount.toLocaleString()} SGD</span>
                  </button>
                </div>
              )}

              {selectedMilestone.status === 'paid' && (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-1">
                  <div className="text-xs font-bold text-emerald-900">Payment Released &amp; Settled</div>
                  <div className="text-[11px] text-emerald-700 font-mono">
                    {selectedMilestone.payoutDate || 'Settled with verified contractor receipt'}
                  </div>
                </div>
              )}

              {selectedMilestone.status === 'in_escrow' && (
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-center space-y-1">
                  <div className="text-xs font-bold text-blue-900">Protected in SafePay Vault</div>
                  <div className="text-[11px] text-blue-700">
                    Awaiting contractor installation completion &amp; site evidence upload.
                  </div>
                </div>
              )}

              {selectedMilestone.status === 'upcoming' && (
                <button
                  onClick={() => setPaymentGatewayOpen(true)}
                  className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  Pre-Fund Milestone into Escrow Vault
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Payment Gateway Deposit Modal */}
        {paymentGatewayOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 border border-stone-200 shadow-2xl relative">
              <button
                onClick={() => setPaymentGatewayOpen(false)}
                className="absolute top-5 right-5 p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>TTSD SafePay Gateway</span>
              </div>

              <h2 className="text-xl font-bold text-stone-900 font-display">
                Deposit to Protected Escrow
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                Amount: <span className="font-bold text-stone-900 font-mono">${selectedMilestone.amount.toLocaleString()} SGD</span> for {selectedMilestone.stage}.
              </p>

              {/* Payment Method Selector */}
              <div className="mt-5 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSelectedPaymentMethod('paynow')}
                    className={`p-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                      selectedPaymentMethod === 'paynow'
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-stone-700'
                    }`}
                  >
                    PayNow QR
                  </button>
                  <button
                    onClick={() => setSelectedPaymentMethod('card')}
                    className={`p-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                      selectedPaymentMethod === 'card'
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-stone-700'
                    }`}
                  >
                    Credit / Debit
                  </button>
                  <button
                    onClick={() => setSelectedPaymentMethod('fast')}
                    className={`p-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                      selectedPaymentMethod === 'fast'
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-stone-700'
                    }`}
                  >
                    FAST Bank
                  </button>
                </div>

                {/* Method Specific Display */}
                {selectedPaymentMethod === 'paynow' && (
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-center space-y-2">
                    <div className="w-36 h-36 bg-white border border-stone-300 rounded-lg mx-auto flex items-center justify-center p-2 shadow-xs">
                      {/* Realistic SVG PayNow QR */}
                      <div className="w-full h-full bg-stone-900 flex flex-col items-center justify-center text-white text-[10px] p-2 text-center rounded">
                        <QrCode className="w-16 h-16 text-amber-400 mb-1" />
                        <span className="font-mono font-bold">UEN: 202619882K</span>
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-stone-900">Scan with DBS PayLah!, OCBC, or UOB TMRW</div>
                    <div className="text-[11px] text-stone-500 font-mono">Ref: TTSD-ESCROW-{selectedMilestone.id}</div>
                  </div>
                )}

                {selectedPaymentMethod === 'card' && (
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3 text-xs">
                    <div>
                      <label className="block text-stone-600 mb-1">Card Number</label>
                      <input
                        type="text"
                        placeholder="•••• •••• •••• 4242"
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg font-mono"
                        defaultValue="4111 8899 2201 4242"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-stone-600 mb-1">Expiry</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg font-mono"
                          defaultValue="10/28"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-600 mb-1">CVC</label>
                        <input
                          type="text"
                          placeholder="CVC"
                          className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg font-mono"
                          defaultValue="789"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === 'fast' && (
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Bank Name:</span>
                      <span className="font-bold text-stone-900">DBS Bank Ltd</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Account Name:</span>
                      <span className="font-bold text-stone-900">TTSD Escrow Trust Nominees</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Account Number:</span>
                      <span className="font-mono font-bold text-stone-900">003-902188-2</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <button
                  onClick={handleSimulateDeposit}
                  disabled={isProcessingPayment}
                  className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  {isProcessingPayment ? (
                    <span>Securing Deposit in Escrow...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Deposit ${selectedMilestone.amount.toLocaleString()} SGD to Escrow</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
