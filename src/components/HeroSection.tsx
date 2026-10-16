import React, { useState } from 'react';
import {
  ShieldCheck,
  Compass,
  Hammer,
  BadgeDollarSign,
  ArrowRight,
  Sparkles,
  Zap,
  Building2,
  Lock,
  Landmark,
} from 'lucide-react';

interface HeroSectionProps {
  onNavigateTab: (tab: string) => void;
  onOpenMatchmaker: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigateTab,
  onOpenMatchmaker,
}) => {
  const [quickService, setQuickService] = useState<'subcon' | 'id' | 'loan' | 'gov'>('subcon');

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-stone-100/80 via-stone-50 to-white pt-8 pb-16 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Upper Editorial Kicker & Notice */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 text-xs font-medium text-stone-600">
            <span className="font-semibold text-stone-900">Homestyler Platform</span>
            <span aria-hidden="true">·</span>
            <span>Live data.gov.sg Registries</span>
            <span aria-hidden="true">·</span>
            <span>OneMap SLA Geolocation</span>
            <span aria-hidden="true">·</span>
            <span>Escrow Payment Vault</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-stone-900">BOA &amp; BCA Aligned</span>
            <span className="text-stone-400">|</span>
            <span className="text-stone-500">$0 Homeowner Escrow Fees</span>
          </div>
        </div>

        {/* 2-Column Split Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left Column: Value Prop & Intent Launchpad */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.15] text-balance font-display">
              Homestyler: Your One-Stop Shop to Interior Design, Verified Trades &amp; Renovation Finance
            </h1>

            <p className="mt-5 text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl">
              Eliminate renovation middleman markups and contractor ghosting. Homestyler directly connects you with vetted master carpenters, plumbers, and electricians—backed by live data.gov.sg government registries, milestone escrow payments, and instant bank renovation loan matching.
            </p>

            {/* Quick Service Intent Tabs */}
            <div className="mt-8 p-1.5 bg-stone-200/70 rounded-xl max-w-xl">
              <div className="grid grid-cols-4 gap-1">
                <button
                  onClick={() => setQuickService('subcon')}
                  className={`px-2.5 py-2 text-xs font-semibold rounded-lg transition-all text-center whitespace-nowrap ${
                    quickService === 'subcon'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Direct Sub-con
                </button>
                <button
                  onClick={() => setQuickService('gov')}
                  className={`px-2.5 py-2 text-xs font-semibold rounded-lg transition-all text-center whitespace-nowrap ${
                    quickService === 'gov'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Gov Registry
                </button>
                <button
                  onClick={() => setQuickService('id')}
                  className={`px-2.5 py-2 text-xs font-semibold rounded-lg transition-all text-center whitespace-nowrap ${
                    quickService === 'id'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Design &amp; A&amp;A
                </button>
                <button
                  onClick={() => setQuickService('loan')}
                  className={`px-2.5 py-2 text-xs font-semibold rounded-lg transition-all text-center whitespace-nowrap ${
                    quickService === 'loan'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Reno Loans
                </button>
              </div>
            </div>

            {/* Dynamic Intent Action Box */}
            <div className="mt-4 p-5 bg-white border border-stone-200 rounded-xl shadow-xs max-w-xl">
              {quickService === 'subcon' && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-bold text-stone-900">Direct Master Craftsmen &amp; Sub-contractors</h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Hire directly without ID markups: Carpenters, EMA electricians, PUB plumbers.
                    </p>
                  </div>
                  <button
                    onClick={onOpenMatchmaker}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-lg transition-colors shadow-xs whitespace-nowrap shrink-0"
                  >
                    <span>Match Tradesmen</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {quickService === 'gov' && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-bold text-stone-900">Live data.gov.sg &amp; OneMap Search</h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Verify BOA registered architects, BCA licensed builders &amp; SLA coordinates.
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigateTab('gov_registry')}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors shadow-xs whitespace-nowrap shrink-0"
                  >
                    <span>Verify Records</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {quickService === 'id' && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-bold text-stone-900">Interior Design Styles &amp; A&amp;A Permits</h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Explore Japandi, Quiet Luxury palettes, and BCA load-bearing wall guidelines.
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigateTab('design_aa')}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg transition-colors shadow-xs whitespace-nowrap shrink-0"
                  >
                    <span>Explore Design</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {quickService === 'loan' && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-bold text-stone-900">Compare 6 Bank Renovation Loans</h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Rates from 2.68% p.a. DBS, Maybank, OCBC, CIMB + 0% in-house installment plan.
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigateTab('finance_loans')}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-lg transition-colors shadow-xs whitespace-nowrap shrink-0"
                  >
                    <span>Calculate Rates</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Architectural Visual Anchor & Live Escrow Snapshot */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 p-6 text-white shadow-xl border border-stone-800 min-h-[380px] flex flex-col justify-between">
              {/* Subtle background ambient graphic */}
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#d2b48c_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Upper Header in Visual Anchor */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-xs font-semibold tracking-wider uppercase text-amber-300">
                    Homestyler SafePay Protected
                  </span>
                </div>
                <div className="text-xs text-stone-400 font-mono">
                  HS-SG-88912
                </div>
              </div>

              {/* Middle Showcase: Architectural Concept Card */}
              <div className="relative z-10 my-4 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-amber-200 font-medium">Active Turnkey Project</div>
                    <div className="text-lg font-bold text-white font-display mt-0.5">
                      Park Colonial 4-Room Scandinavian
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-stone-300">Escrow Sum</div>
                    <div className="text-base font-extrabold text-white font-mono tabular-nums">
                      $58,000 SGD
                    </div>
                  </div>
                </div>

                {/* Milestone Progress Bar */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-300">
                    <span>Milestone 2: Hacking &amp; Wet Works</span>
                    <span className="font-semibold text-amber-300">50% Completed</span>
                  </div>
                  <div className="w-full bg-stone-700/60 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-500 to-amber-300 h-2 rounded-full w-1/2 transition-all duration-500" />
                  </div>
                  <div className="text-[11px] text-stone-400 flex items-center gap-1.5 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Funds held in MAS-regulated trust until inspection sign-off</span>
                  </div>
                </div>
              </div>

              {/* Lower Quick Action Badges */}
              <div className="relative z-10 grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => onNavigateTab('gov_registry')}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white transition-colors"
                >
                  <Landmark className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verify Registries</span>
                </button>
                <button
                  onClick={() => onNavigateTab('escrow_pay')}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-amber-600/90 hover:bg-amber-600 text-xs font-semibold text-white transition-colors"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>SafePay Vault</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column KPI Trust Strip Below Hero Split */}
        <div className="mt-12 pt-8 border-t border-stone-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-stone-800">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-mono tabular-nums">
                data.gov.sg
              </div>
              <div className="text-xs font-semibold text-stone-900 mt-1">Live Gov Registries</div>
              <div className="text-xs text-stone-500 mt-0.5">BOA Architects, BCA Contractors &amp; Builders</div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-mono tabular-nums">
                OneMap SLA
              </div>
              <div className="text-xs font-semibold text-stone-900 mt-1">Instant Geocoding</div>
              <div className="text-xs text-stone-500 mt-0.5">Official Singapore address &amp; coords lookup</div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-mono tabular-nums">
                $0.00 Fee
              </div>
              <div className="text-xs font-semibold text-stone-900 mt-1">Homeowner Escrow</div>
              <div className="text-xs text-stone-500 mt-0.5">Progressive payment protection free</div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-mono tabular-nums">
                6 Banks
              </div>
              <div className="text-xs font-semibold text-stone-900 mt-1">Loan Marketplace</div>
              <div className="text-xs text-stone-500 mt-0.5">Instant comparison &amp; 0% split-pay</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
