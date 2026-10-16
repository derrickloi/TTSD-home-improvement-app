import React from 'react';
import { Smartphone, Monitor, ShoppingBag, FolderKanban, Landmark } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  viewMode: 'web' | 'mobile_app';
  setViewMode: (mode: 'web' | 'mobile_app') => void;
  cartCount: number;
  openCart: () => void;
  openDashboard: () => void;
  onStartProject: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode,
  cartCount,
  openCart,
  openDashboard,
  onStartProject,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Zone 1: Single text element wordmark for Homestyler */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('overview')}
              className="group flex items-center gap-2.5 text-left focus-visible:outline-2 focus-visible:outline-amber-600 rounded"
            >
              <div className="w-9 h-9 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center font-bold tracking-tight text-lg shadow-xs group-hover:bg-stone-800 transition-colors">
                H
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-stone-900 font-display leading-tight">
                  Homestyler
                </span>
                <span className="text-[10px] text-stone-500 font-medium tracking-wide">
                  One-Stop Shop to Home Improvement
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4-5 Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600">
            <button
              onClick={() => setActiveTab('design_aa')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                activeTab === 'design_aa'
                  ? 'text-amber-800 font-semibold border-b-2 border-amber-700'
                  : 'hover:text-stone-950'
              }`}
            >
              Design &amp; A&amp;A
            </button>
            <button
              onClick={() => setActiveTab('tradesmen')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                activeTab === 'tradesmen'
                  ? 'text-amber-800 font-semibold border-b-2 border-amber-700'
                  : 'hover:text-stone-950'
              }`}
            >
              Sub-contractor Match
            </button>
            <button
              onClick={() => setActiveTab('gov_registry')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1 ${
                activeTab === 'gov_registry'
                  ? 'text-amber-800 font-semibold border-b-2 border-amber-700'
                  : 'hover:text-stone-950'
              }`}
            >
              <Landmark className="w-3.5 h-3.5 text-emerald-600" />
              <span>Gov Registry</span>
            </button>
            <button
              onClick={() => setActiveTab('finance_loans')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                activeTab === 'finance_loans'
                  ? 'text-amber-800 font-semibold border-b-2 border-amber-700'
                  : 'hover:text-stone-950'
              }`}
            >
              Finance &amp; Loans
            </button>
            <button
              onClick={() => setActiveTab('escrow_pay')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                activeTab === 'escrow_pay'
                  ? 'text-amber-800 font-semibold border-b-2 border-amber-700'
                  : 'hover:text-stone-950'
              }`}
            >
              SafePay Escrow
            </button>
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                activeTab === 'marketplace'
                  ? 'text-amber-800 font-semibold border-b-2 border-amber-700'
                  : 'hover:text-stone-950'
              }`}
            >
              Fixtures &amp; Store
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action + Utility controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* View Mode Toggle: Web Portal / Mobile App Companion */}
            <div className="hidden sm:flex items-center p-0.5 bg-stone-100 rounded-lg border border-stone-200">
              <button
                onClick={() => setViewMode('web')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                  viewMode === 'web'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
                title="Desktop Web Portal"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Web Portal</span>
              </button>
              <button
                onClick={() => setViewMode('mobile_app')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                  viewMode === 'mobile_app'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
                title="Mobile App Companion Shell"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>App Mode</span>
              </button>
            </div>

            {/* Active Project Dashboard Trigger */}
            <button
              onClick={openDashboard}
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors relative"
              title="My Renovation Tracker"
              aria-label="Active Project Tracker"
            >
              <FolderKanban className="w-4 h-4" />
            </button>

            {/* Cart Trigger */}
            <button
              onClick={openCart}
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors relative"
              title="Marketplace Cart"
              aria-label="Marketplace Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onStartProject}
              className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors shadow-xs whitespace-nowrap shrink-0"
            >
              Start Reno Project
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
