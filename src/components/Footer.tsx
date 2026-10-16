import React from 'react';
import { ShieldCheck, ExternalLink, Landmark } from 'lucide-react';

interface FooterProps {
  onNavigateTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-base">
                H
              </div>
              <span className="text-xl font-extrabold text-white font-display tracking-tight">
                Homestyler
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Your One-Stop Shop (OSS) for residential and commercial interior design, A&amp;A structural planning, verified tradesmen matchmaking, milestone escrow protection, and live official registry verification from data.gov.sg and SLA OneMap.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Directly connected to data.gov.sg &amp; OneMap live APIs</span>
            </div>
          </div>

          {/* Quick Links: Services */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Core Services
            </div>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onNavigateTab('gov_registry')}
                  className="hover:text-white transition-colors flex items-center gap-1 text-emerald-400 font-semibold"
                >
                  <Landmark className="w-3 h-3" />
                  <span>Official Gov Registries</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('design_aa')}
                  className="hover:text-white transition-colors"
                >
                  Interior Design Themes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('design_aa')}
                  className="hover:text-white transition-colors"
                >
                  A&amp;A Structural Permits
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('tradesmen')}
                  className="hover:text-white transition-colors"
                >
                  Direct Sub-contractor Match
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('tradesmen')}
                  className="hover:text-white transition-colors"
                >
                  Urgent Home Repairs
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links: Finance & Escrow */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Finance &amp; Protection
            </div>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onNavigateTab('finance_loans')}
                  className="hover:text-white transition-colors"
                >
                  Bank Renovation Loans
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('finance_loans')}
                  className="hover:text-white transition-colors"
                >
                  Homestyler 0% SplitPay Plan
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('escrow_pay')}
                  className="hover:text-white transition-colors"
                >
                  SafePay Milestone Escrow
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('marketplace')}
                  className="hover:text-white transition-colors"
                >
                  Architectural Fixtures Store
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('talk_to_us')}
                  className="hover:text-white transition-colors text-amber-400 font-semibold"
                >
                  Talk to Us &amp; Forum
                </button>
              </li>
            </ul>
          </div>

          {/* Live Government Dataset Links */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Official Live Links
            </div>
            <div className="space-y-2 text-xs text-stone-400">
              <a
                href="https://developers.data.gov.sg/datasets/d_d77de0f78ca589a5c61da7a60fdee6ba/view"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded bg-stone-800/80 border border-stone-800 flex items-center justify-between hover:border-stone-700 hover:text-white transition-colors"
              >
                <span>BOA Register of Architects</span>
                <ExternalLink className="w-3 h-3 text-amber-400 shrink-0" />
              </a>

              <a
                href="https://data.gov.sg/datasets/d_dcda79be4aded5f9e769b8e23ff69b47/view"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded bg-stone-800/80 border border-stone-800 flex items-center justify-between hover:border-stone-700 hover:text-white transition-colors"
              >
                <span>Registered Contractors</span>
                <ExternalLink className="w-3 h-3 text-amber-400 shrink-0" />
              </a>

              <a
                href="https://data.gov.sg/datasets/d_19573c579879be15623f2e1e3854926d/view"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded bg-stone-800/80 border border-stone-800 flex items-center justify-between hover:border-stone-700 hover:text-white transition-colors"
              >
                <span>Licensed Builders</span>
                <ExternalLink className="w-3 h-3 text-amber-400 shrink-0" />
              </a>

              <a
                href="https://www.onemap.gov.sg/api/common/elastic/search?searchVal=178903&returnGeom=Y&getAddrDetails=Y&pageNum=1"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded bg-stone-800/80 border border-stone-800 flex items-center justify-between hover:border-stone-700 hover:text-white transition-colors"
              >
                <span>OneMap Geocoding API</span>
                <ExternalLink className="w-3 h-3 text-emerald-400 shrink-0" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} Homestyler. All rights reserved. Your One-Stop Shop (OSS) to home improvement.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-stone-300 cursor-pointer">Escrow Trust Terms</span>
            <span>·</span>
            <span className="hover:text-stone-300 cursor-pointer">Workmanship Guarantee</span>
            <span>·</span>
            <span className="hover:text-stone-300 cursor-pointer">API Documentation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
