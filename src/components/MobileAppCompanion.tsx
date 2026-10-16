import React, { useState } from 'react';
import { Subcontractor, EscrowMilestone, MarketplaceItem } from '../types';
import { SUBCONTRACTORS, MARKETPLACE_PRODUCTS } from '../data/mockData';
import {
  Home,
  Users,
  BadgeDollarSign,
  ShieldCheck,
  ShoppingBag,
  Bell,
  Camera,
  CheckCircle2,
  PhoneCall,
  Clock,
  Sparkles,
  ArrowRight,
  Sliders,
  ChevronRight,
  Wrench,
  Lock,
  Plus,
  Monitor,
} from 'lucide-react';

interface MobileAppCompanionProps {
  onSwitchToWeb: () => void;
  milestones: EscrowMilestone[];
  onReleaseMilestone: (id: number) => void;
}

export const MobileAppCompanion: React.FC<MobileAppCompanionProps> = ({
  onSwitchToWeb,
  milestones,
  onReleaseMilestone,
}) => {
  const [appTab, setAppTab] = useState<'today' | 'match' | 'escrow' | 'finance' | 'store'>('today');
  const [urgentHandymanDispatched, setUrgentHandymanDispatched] = useState(false);
  const [selectedSub, setSelectedSub] = useState<Subcontractor | null>(null);

  const activeMilestone =
    milestones.find((m) => m.status === 'action_required') || milestones[1];

  const handleDispatchHandyman = () => {
    setUrgentHandymanDispatched(true);
    setTimeout(() => {
      setUrgentHandymanDispatched(false);
    }, 4000);
  };

  return (
    <div className="py-8 bg-stone-900 min-h-screen flex flex-col items-center justify-center px-4">
      {/* Top Banner to switch back to Web Portal */}
      <div className="max-w-md w-full mb-4 flex items-center justify-between text-xs text-stone-300">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white">Homestyler Native Mobile App View</span>
        </div>
        <button
          onClick={onSwitchToWeb}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold transition-colors border border-stone-700"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Switch to Web Portal</span>
        </button>
      </div>

      {/* Smartphone Device Frame */}
      <div className="relative w-full max-w-[400px] h-[820px] bg-stone-950 rounded-[48px] p-3 shadow-2xl border-4 border-stone-800 flex flex-col justify-between overflow-hidden">
        {/* Dynamic Island / Top Bezel */}
        <div className="relative z-30 pt-2 px-6 flex items-center justify-between text-white text-[11px] font-semibold">
          <span>9:41</span>
          <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-stone-900 mr-2" />
            <div className="w-2 h-2 rounded-full bg-blue-900/40" />
          </div>
          <div className="flex items-center gap-1.5">
            <span>5G</span>
            <div className="w-5 h-2.5 border border-white/60 rounded-xs p-0.5">
              <div className="w-full h-full bg-emerald-400 rounded-2xs" />
            </div>
          </div>
        </div>

        {/* App Screen Container */}
        <div className="flex-1 bg-stone-100 rounded-[36px] overflow-y-auto mt-2 mb-1 flex flex-col justify-between shadow-inner">
          {/* App Top Bar */}
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 py-3 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-stone-900 text-amber-400 font-bold flex items-center justify-center text-xs">
                H
              </div>
              <span className="font-extrabold text-sm text-stone-900 font-display">
                Homestyler
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                Live Reno Active
              </div>
            </div>
          </div>

          {/* Urgent Dispatch Alert if clicked */}
          {urgentHandymanDispatched && (
            <div className="mx-4 mt-3 p-3 bg-emerald-600 text-white rounded-xl text-xs flex items-center gap-2 shadow-md">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                Express Handyman Ah Meng dispatched! ETA: 22 mins to your address.
              </span>
            </div>
          )}

          {/* App Content Body */}
          <div className="p-4 flex-1 space-y-4">
            {/* Tab 1: Today / Project Command Center */}
            {appTab === 'today' && (
              <div className="space-y-4">
                {/* Active Job Card */}
                <div className="p-4 rounded-2xl bg-stone-900 text-white shadow-md space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">
                      Current Active Project
                    </span>
                    <span className="text-stone-400 font-mono text-[11px]">Day 14 of 45</span>
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-white font-display">
                      4-Room BTO Turnkey Renovation
                    </h2>
                    <p className="text-xs text-stone-300">
                      Bidadari Park Drive · Master Carpentry &amp; LEW Rewiring
                    </p>
                  </div>

                  {/* Milestone Action Alert in Mobile */}
                  <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-amber-200">
                        {activeMilestone.stage}
                      </span>
                      <span className="text-emerald-400 font-bold font-mono">
                        ${activeMilestone.amount.toLocaleString()} SGD
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-300 line-clamp-1">
                      {activeMilestone.title}
                    </div>

                    <button
                      onClick={() => setAppTab('escrow')}
                      className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Review Inspection Photos</span>
                    </button>
                  </div>
                </div>

                {/* 2-Hour Urgent Emergency Repair Quick Dispatch */}
                <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
                        <Wrench className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900">
                          Urgent 2-Hour Repair Dispatch
                        </div>
                        <div className="text-[10px] text-stone-500">
                          Pipe leaks, blackout trip, lockouts
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleDispatchHandyman}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-xs"
                    >
                      Dispatch Now
                    </button>
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setAppTab('match')}
                    className="p-3 bg-white rounded-xl border border-stone-200 text-left hover:border-amber-600 transition-colors shadow-xs"
                  >
                    <Users className="w-4 h-4 text-amber-700 mb-1" />
                    <div className="text-xs font-bold text-stone-900">Hire Craftsmen</div>
                    <div className="text-[10px] text-stone-500">BCA/PUB certified</div>
                  </button>

                  <button
                    onClick={() => setAppTab('finance')}
                    className="p-3 bg-white rounded-xl border border-stone-200 text-left hover:border-amber-600 transition-colors shadow-xs"
                  >
                    <BadgeDollarSign className="w-4 h-4 text-emerald-700 mb-1" />
                    <div className="text-xs font-bold text-stone-900">Reno Loans</div>
                    <div className="text-[10px] text-stone-500">From 2.68% p.a.</div>
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Match Subcontractors */}
            {appTab === 'match' && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Verified Master Workmen
                </div>

                {SUBCONTRACTORS.slice(0, 4).map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-lg ${sub.avatarBg} text-white font-bold text-xs flex items-center justify-center`}
                        >
                          {sub.avatarInitial}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-stone-900">{sub.name}</div>
                          <div className="text-[10px] text-stone-500">{sub.tradeLabel}</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-amber-700">
                        ★ {sub.rating.toFixed(2)}
                      </span>
                    </div>

                    <div className="text-[11px] text-stone-600 flex justify-between pt-1 border-t border-stone-100">
                      <span>Rate: {sub.startingRate} {sub.rateUnit}</span>
                      <span className="text-emerald-700 font-medium">BCA Verified</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: SafePay Escrow */}
            {appTab === 'escrow' && (
              <div className="space-y-4">
                <div className="p-4 bg-stone-900 text-white rounded-2xl shadow-sm space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                    SafePay Escrow Vault
                  </div>
                  <div className="text-xl font-bold font-mono tabular-nums">
                    $40,600 SGD Locked
                  </div>
                  <div className="text-[11px] text-stone-400">
                    Disbursed strictly when you review site evidence.
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="text-xs font-bold text-stone-800">
                    Active Inspection Sign-off
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-amber-300 shadow-xs space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs font-bold text-stone-900">
                          {activeMilestone.title}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          72-Hr Waterproofing &amp; Hacking Sign-off
                        </div>
                      </div>
                      <span className="text-xs font-bold font-mono text-stone-900">
                        ${activeMilestone.amount.toLocaleString()}
                      </span>
                    </div>

                    <div className="p-2.5 bg-stone-50 rounded-lg text-[11px] text-stone-600 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Waterproofing 72-hr ponding test video verified</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>NEA debris disposal permit verified</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onReleaseMilestone(activeMilestone.id)}
                      className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                    >
                      Approve &amp; Release Milestone Funds
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Finance / Reno Loans */}
            {appTab === 'finance' && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Top Reno Loan Comparison
                </div>

                <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-stone-900 text-xs">DBS Green Reno Loan</span>
                    <span className="text-xs font-bold font-mono text-emerald-700">2.68% p.a.</span>
                  </div>
                  <p className="text-[11px] text-stone-600">
                    Lowest green rate for energy-efficient homes &amp; appliances.
                  </p>
                  <div className="text-xs font-mono font-bold text-stone-900 pt-1">
                    Est. $842 / mo for $30k (3 Years)
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-stone-900 text-xs">Maybank RenoLoan Premier</span>
                    <span className="text-xs font-bold font-mono text-amber-800">2.88% p.a.</span>
                  </div>
                  <p className="text-[11px] text-stone-600">
                    Complimentary 1-year home insurance + progressive contractor drawdown.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 shadow-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-emerald-950 text-xs">TTSD 0% SplitPay Direct</span>
                    <span className="text-xs font-bold font-mono text-emerald-800">0.0% p.a.</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    12 equal installments directly tied to milestone sign-offs.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 5: Fixtures Store */}
            {appTab === 'store' && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Fixtures &amp; Wholesale Materials
                </div>

                {MARKETPLACE_PRODUCTS.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-white rounded-xl border border-stone-200 shadow-xs flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${p.colorScheme} flex items-center justify-center text-white shrink-0`}
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900 line-clamp-1">{p.name}</div>
                        <div className="text-[10px] text-stone-500 font-mono">
                          ${p.price.toLocaleString()} SGD
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => alert(`Added ${p.name} to mobile bag!`)}
                      className="p-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 text-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom App Navigation Dock */}
          <div className="bg-white/95 backdrop-blur-md border-t border-stone-200 px-3 py-2 flex items-center justify-around">
            <button
              onClick={() => setAppTab('today')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
                appTab === 'today' ? 'text-amber-800 font-bold' : 'text-stone-400'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Project</span>
            </button>
            <button
              onClick={() => setAppTab('match')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
                appTab === 'match' ? 'text-amber-800 font-bold' : 'text-stone-400'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Trades</span>
            </button>
            <button
              onClick={() => setAppTab('escrow')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
                appTab === 'escrow' ? 'text-amber-800 font-bold' : 'text-stone-400'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Escrow</span>
            </button>
            <button
              onClick={() => setAppTab('finance')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
                appTab === 'finance' ? 'text-amber-800 font-bold' : 'text-stone-400'
              }`}
            >
              <BadgeDollarSign className="w-4 h-4" />
              <span>Loans</span>
            </button>
            <button
              onClick={() => setAppTab('store')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
                appTab === 'store' ? 'text-amber-800 font-bold' : 'text-stone-400'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shop</span>
            </button>
          </div>
        </div>

        {/* Home Indicator Bar */}
        <div className="w-32 h-1 bg-white/40 rounded-full mx-auto my-1" />
      </div>
    </div>
  );
};
