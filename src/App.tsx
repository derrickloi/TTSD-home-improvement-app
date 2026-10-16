import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { DesignAndAAPlanner } from './components/DesignAndAAPlanner';
import { TradesmenMatchmaker } from './components/TradesmenMatchmaker';
import { FinanceAndLoansMarketplace } from './components/FinanceAndLoansMarketplace';
import { EscrowPaymentGateway } from './components/EscrowPaymentGateway';
import { MarketplaceStore } from './components/MarketplaceStore';
import { MobileAppCompanion } from './components/MobileAppCompanion';
import { ProjectDashboardModal } from './components/ProjectDashboardModal';
import { GovRegistryAndGeoSearch } from './components/GovRegistryAndGeoSearch';
import { ProjectBiddingMarketplace } from './components/ProjectBiddingMarketplace';
import { Footer } from './components/Footer';
import {
  INITIAL_ESCROW_MILESTONES,
  SUBCONTRACTORS,
  MARKETPLACE_PRODUCTS,
} from './data/mockData';
import {
  CartItem,
  EscrowMilestone,
  MarketplaceItem,
  Subcontractor,
} from './types';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Smartphone,
  FolderKanban,
  Wrench,
  Percent,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [viewMode, setViewMode] = useState<'web' | 'mobile_app'>('web');

  // Active Project & Escrow state
  const [milestones, setMilestones] = useState<EscrowMilestone[]>(INITIAL_ESCROW_MILESTONES);
  const [hiredContractors, setHiredContractors] = useState<Subcontractor[]>([
    SUBCONTRACTORS[0], // Master Tan Kah Wah (Carpentry)
    SUBCONTRACTORS[2], // Vincent Ng (LEW Electrical)
  ]);

  // Shopping Cart state
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: MARKETPLACE_PRODUCTS[0], // Hansgrohe Raindance
      quantity: 1,
      withInstallation: true,
    },
    {
      product: MARKETPLACE_PRODUCTS[1], // Yale Smart Lock
      quantity: 1,
      withInstallation: true,
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState<boolean>(false);
  const [showMatchmakerWizard, setShowMatchmakerWizard] = useState<boolean>(false);

  // Cart operations
  const handleAddToCart = (product: MarketplaceItem, withInstallation: boolean) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1, withInstallation }
            : item
        );
      }
      return [...prev, { product, quantity: 1, withInstallation }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Milestone Escrow Release
  const handleReleaseMilestone = (milestoneId: number) => {
    setMilestones((prev) => {
      return prev.map((m) => {
        if (m.id === milestoneId) {
          return {
            ...m,
            status: 'paid',
            payoutDate: `${new Date().toISOString().split('T')[0]} (Released to Contractor)`,
          };
        }
        // Unlock next milestone if upcoming
        if (m.id === milestoneId + 1 && m.status === 'in_escrow') {
          return {
            ...m,
            status: 'action_required',
          };
        }
        return m;
      });
    });
  };

  // Deposit funds into milestone escrow
  const handleDepositFunds = (milestoneId: number, amount: number) => {
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === milestoneId ? { ...m, status: 'in_escrow' } : m
      )
    );
  };

  // Hire contractor
  const handleSelectContractorForProject = (sub: Subcontractor) => {
    if (!hiredContractors.some((c) => c.id === sub.id)) {
      setHiredContractors([...hiredContractors, sub]);
    }
  };

  // If user selected mobile app mode:
  if (viewMode === 'mobile_app') {
    return (
      <MobileAppCompanion
        onSwitchToWeb={() => setViewMode('web')}
        milestones={milestones}
        onReleaseMilestone={handleReleaseMilestone}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      {/* Top Navigation Bar adhering to Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
        cartCount={cart.reduce((c, i) => c + i.quantity, 0)}
        openCart={() => setIsCartOpen(true)}
        openDashboard={() => setIsDashboardOpen(true)}
        onStartProject={() => {
          setActiveTab('tradesmen');
          setShowMatchmakerWizard(true);
        }}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {activeTab === 'overview' && (
          <div>
            <HeroSection
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenMatchmaker={() => {
                setActiveTab('tradesmen');
                setShowMatchmakerWizard(true);
              }}
            />

            {/* Hub Section 1: Direct Trade Matchmaking Spotlight */}
            <section className="py-16 bg-white border-b border-stone-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-amber-800 mb-2">
                      Verified Direct Trade Contractors
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display">
                      Meet Highly Rated, BCA-Certified Craftsmen
                    </h2>
                    <p className="mt-2 text-sm text-stone-600 max-w-xl">
                      Direct transparent rate cards. No inflated markups, backed by a 30-day escrow retention sum guarantee.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('tradesmen')}
                    className="flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 py-2"
                  >
                    <span>Browse All 1,200+ Workmen</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {SUBCONTRACTORS.slice(0, 3).map((sub) => (
                    <div
                      key={sub.id}
                      className="p-6 rounded-2xl border border-stone-200 bg-stone-50/60 hover:bg-white hover:border-amber-600/60 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-11 h-11 rounded-xl ${sub.avatarBg} text-white font-bold text-sm flex items-center justify-center`}
                            >
                              {sub.avatarInitial}
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-stone-900">{sub.name}</h3>
                              <div className="text-xs text-stone-500">{sub.tradeLabel}</div>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-bold text-amber-700">
                            ★ {sub.rating.toFixed(2)}
                          </span>
                        </div>

                        <div className="mt-4 text-xs text-stone-600 line-clamp-2">
                          {sub.bio}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-1">
                          {sub.verifiedBadges.slice(0, 2).map((b, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-medium bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200"
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between">
                        <div className="text-xs font-mono font-bold text-stone-900">
                          {sub.startingRate} {sub.rateUnit}
                        </div>
                        <button
                          onClick={() => {
                            setActiveTab('tradesmen');
                          }}
                          className="px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800"
                        >
                          View Rate Card
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Hub Section 2: Renovation Financing & Escrow Assurance */}
            <section className="py-16 bg-stone-50 border-b border-stone-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-6 space-y-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                      Fintech Escrow &amp; Bank Loans
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display">
                      Protect Your Life Savings with SafePay Escrow &amp; Compare 6 Reno Loans
                    </h2>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      Never pay 50% upfront. TTSD locks your funds in an MAS-regulated trust account. Payments are only released milestone-by-milestone after you review photo inspection proof. Need financing? Access pre-approved bank loans from 2.68% p.a.
                    </p>

                    <div className="space-y-2 pt-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>100% Free Escrow Protection for Homeowners</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Pre-Approved Loans with DBS, Maybank, OCBC &amp; CIMB</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>30-Day Defect Retention Sum Guarantee</span>
                      </div>
                    </div>

                    <div className="pt-4 flex flex-wrap gap-3">
                      <button
                        onClick={() => setActiveTab('finance_loans')}
                        className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                      >
                        Compare Bank Loans
                      </button>
                      <button
                        onClick={() => setActiveTab('escrow_pay')}
                        className="px-5 py-2.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 text-xs font-bold rounded-xl transition-colors"
                      >
                        Explore Escrow Vault
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-6">
                    <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-stone-900 uppercase">
                          Progressive Escrow Release Flow
                        </span>
                        <span className="text-emerald-700 font-mono font-semibold">
                          MAS Regulated Trust
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center">
                          <span className="text-stone-700">10% Milestone 1: Site Possession &amp; Drawings</span>
                          <span className="font-mono font-bold text-emerald-700">Released</span>
                        </div>
                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 flex justify-between items-center">
                          <span className="text-amber-950 font-bold">
                            40% Milestone 2: Hacking &amp; 72-Hr Waterproofing
                          </span>
                          <span className="font-mono font-bold text-amber-900">Sign-off Ready</span>
                        </div>
                        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center opacity-75">
                          <span className="text-stone-600">30% Milestone 3: Bespoke Carpentry &amp; Fixtures</span>
                          <span className="font-mono text-stone-500">In Escrow</span>
                        </div>
                        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center opacity-60">
                          <span className="text-stone-600">15% Milestone 4: Skim, Paint &amp; Final Rectification</span>
                          <span className="font-mono text-stone-400">Upcoming</span>
                        </div>
                        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center opacity-60">
                          <span className="text-stone-600">5% Milestone 5: 30-Day Defect Warranty Retention</span>
                          <span className="font-mono text-stone-400">Retention</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Tab: Project Bidding Exchange & Sales Leads */}
        {activeTab === 'bids_leads' && (
          <ProjectBiddingMarketplace />
        )}

        {/* Tab 2: Design & A&A Suite */}
        {activeTab === 'design_aa' && (
          <DesignAndAAPlanner
            onScopeConfigured={(scope) => {
              setActiveTab('tradesmen');
              setShowMatchmakerWizard(true);
            }}
            onOpenMatchmaker={() => {
              setActiveTab('tradesmen');
              setShowMatchmakerWizard(true);
            }}
          />
        )}

        {/* Tab 3: Tradesmen Matchmaker */}
        {activeTab === 'tradesmen' && (
          <TradesmenMatchmaker
            onSelectContractorForProject={handleSelectContractorForProject}
            showWizardModal={showMatchmakerWizard}
            onCloseWizardModal={() => setShowMatchmakerWizard(false)}
          />
        )}

        {/* Tab: Official Gov Registries & OneMap SLA Search */}
        {activeTab === 'gov_registry' && (
          <GovRegistryAndGeoSearch />
        )}

        {/* Tab 4: Finance & Loans Marketplace */}
        {activeTab === 'finance_loans' && (
          <FinanceAndLoansMarketplace
            onApplyForLoan={(loan, amount, tenure) => {
              setActiveTab('escrow_pay');
            }}
          />
        )}

        {/* Tab 5: Escrow Payment Gateway */}
        {activeTab === 'escrow_pay' && (
          <EscrowPaymentGateway
            milestones={milestones}
            onReleaseMilestone={handleReleaseMilestone}
            onDepositFunds={handleDepositFunds}
          />
        )}

        {/* Tab 6: Fixtures Store */}
        {activeTab === 'marketplace' && (
          <MarketplaceStore
            cart={cart}
            onAddToCart={handleAddToCart}
            onUpdateCartQuantity={handleUpdateCartQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            onClearCart={handleClearCart}
            isCartOpen={isCartOpen}
            setIsCartOpen={setIsCartOpen}
          />
        )}
      </main>

      {/* Slide-over cart if opened from Header */}
      {isCartOpen && activeTab !== 'marketplace' && (
        <MarketplaceStore
          cart={cart}
          onAddToCart={handleAddToCart}
          onUpdateCartQuantity={handleUpdateCartQuantity}
          onRemoveFromCart={handleRemoveFromCart}
          onClearCart={handleClearCart}
          isCartOpen={isCartOpen}
          setIsCartOpen={setIsCartOpen}
        />
      )}

      {/* Active Renovation Project Dashboard Modal */}
      <ProjectDashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        milestones={milestones}
        hiredContractors={hiredContractors}
        onOpenEscrow={() => {
          setActiveTab('escrow_pay');
        }}
      />

      {/* Authoritative Footer */}
      <Footer onNavigateTab={(tab) => setActiveTab(tab)} />
    </div>
  );
}
