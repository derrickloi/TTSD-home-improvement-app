import React, { useState, useMemo } from 'react';
import { SUBCONTRACTORS } from '../data/mockData';
import { Subcontractor, TradeCategory, PropertyType } from '../types';
import {
  Search,
  CheckCircle2,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  ArrowRight,
  SlidersHorizontal,
  X,
  PhoneCall,
  Calendar,
  Sparkles,
  FileCheck,
  Award,
  Zap,
} from 'lucide-react';

interface TradesmenMatchmakerProps {
  onSelectContractorForProject: (sub: Subcontractor) => void;
  initialTradeFilter?: TradeCategory;
  showWizardModal?: boolean;
  onCloseWizardModal?: () => void;
}

export const TradesmenMatchmaker: React.FC<TradesmenMatchmakerProps> = ({
  onSelectContractorForProject,
  initialTradeFilter = 'all',
  showWizardModal = false,
  onCloseWizardModal,
}) => {
  const [activeCategory, setActiveCategory] = useState<TradeCategory>(initialTradeFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContractor, setSelectedContractor] = useState<Subcontractor | null>(null);
  const [hireSuccessMessage, setHireSuccessMessage] = useState<string | null>(null);
  const [hotlineNotice, setHotlineNotice] = useState<string | null>(null);

  // Wizard state
  const [wizardOpen, setWizardOpen] = useState(showWizardModal);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardProperty, setWizardProperty] = useState<PropertyType>('hdb_4room');
  const [wizardTrades, setWizardTrades] = useState<TradeCategory[]>(['carpentry', 'electrical']);
  const [wizardBudget, setWizardBudget] = useState<'budget' | 'mid' | 'luxury'>('mid');
  const [wizardTimeline, setWizardTimeline] = useState<'immediate' | '1_month' | '3_months'>('1_month');
  const [wizardMatchedResults, setWizardMatchedResults] = useState<{
    subcontractor: Subcontractor;
    matchScore: number;
    reason: string;
  }[]>([]);

  // Filter subcontractors
  const filteredSubcontractors = useMemo(() => {
    return SUBCONTRACTORS.filter((sub) => {
      const matchesCategory =
        activeCategory === 'all' || sub.trade === activeCategory;
      const matchesSearch =
        sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        sub.tradeLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Handle Trade selection in wizard
  const toggleWizardTrade = (trade: TradeCategory) => {
    if (wizardTrades.includes(trade)) {
      setWizardTrades(wizardTrades.filter((t) => t !== trade));
    } else {
      setWizardTrades([...wizardTrades, trade]);
    }
  };

  // Run Matchmaking algorithm
  const executeMatchmaking = () => {
    const scored = SUBCONTRACTORS.map((sub) => {
      let score = 85;
      let reasons: string[] = [];

      // Trade relevance
      if (wizardTrades.includes(sub.trade)) {
        score += 10;
        reasons.push(`Direct specialist in requested ${sub.tradeLabel}`);
      }

      // Experience & rating bonus
      if (sub.rating >= 4.95) {
        score += 3;
        reasons.push('Top 5% rated craftsman (4.95+ stars)');
      }

      // Availability alignment
      if (wizardTimeline === 'immediate' && sub.availableFrom.includes('Today') || sub.availableFrom.includes('Tomorrow')) {
        score += 4;
        reasons.push('Instant availability aligned with your urgent start');
      } else {
        reasons.push(`Slots available: ${sub.availableFrom}`);
      }

      // Verified credentials bonus
      if (sub.verifiedBadges.some((b) => b.includes('BCA') || b.includes('EMA') || b.includes('PUB'))) {
        score += 2;
        reasons.push('Verified regulatory government license validated');
      }

      const finalScore = Math.min(99, score);
      return {
        subcontractor: sub,
        matchScore: finalScore,
        reason: reasons[0] || 'High geographic coverage in your district',
      };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);
    setWizardMatchedResults(scored.slice(0, 3));
    setWizardStep(4);
  };

  const handleBookContractor = (sub: Subcontractor) => {
    onSelectContractorForProject(sub);
    setHireSuccessMessage(`Successfully connected with ${sub.name}! Direct escrow quote requested.`);
    setTimeout(() => {
      setHireSuccessMessage(null);
      setSelectedContractor(null);
    }, 2800);
  };

  return (
    <div className="py-10 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner Alert if direct hire just requested */}
        {hireSuccessMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-center justify-between text-xs sm:text-sm font-semibold">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{hireSuccessMessage}</span>
            </div>
            <button
              onClick={() => setHireSuccessMessage(null)}
              className="text-stone-400 hover:text-stone-600 text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Section Header & Launch Wizard Callout */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Direct Sub-contractor &amp; Master Workman Network</span>
            </div>
            <h1 className="text-3xl font-bold text-stone-900 font-display tracking-tight">
              Verified Master Tradesmen Directory
            </h1>
            <p className="mt-2 text-sm text-stone-600 max-w-2xl leading-relaxed">
              Cut out middleman contractor margins. All tradesmen are independently verified with BCA, EMA, and PUB certifications, with payments held in milestone escrow.
            </p>
          </div>

          <button
            onClick={() => {
              setWizardOpen(true);
              setWizardStep(1);
            }}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Smart Matchmaking Wizard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Category Filter Navigation */}
        <div className="mt-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search trade pros by specialty (e.g., fluted carpentry, concealed copper piping, LEW Grade 7)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="text-xs text-stone-500 whitespace-nowrap font-medium">
              Showing <span className="font-bold text-stone-900">{filteredSubcontractors.length}</span> verified specialists
            </div>
          </div>

          {/* Interactive Trade Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
            {(
              [
                { id: 'all', label: 'All Trades' },
                { id: 'carpentry', label: 'Carpentry & Joinery' },
                { id: 'plumbing', label: 'PUB Plumbing' },
                { id: 'electrical', label: 'EMA Electrical (LEW)' },
                { id: 'masonry_tiling', label: 'Tiling & Masonry' },
                { id: 'painting', label: 'Painting & Skim' },
                { id: 'glass_aluminium', label: 'Glass & Aluminium' },
                { id: 'aircon', label: 'Air-Con Engineering' },
                { id: 'demolition', label: 'Hacking & Haulage' },
                { id: 'waterproofing', label: 'Waterproofing' },
                { id: 'handyman', label: 'Express Handyman' },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-stone-900 text-white shadow-xs font-semibold'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubcontractors.map((sub) => (
            <div
              key={sub.id}
              className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs hover:border-amber-600/60 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header Row: Avatar, Name, Rating */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl ${sub.avatarBg} text-white font-bold text-base flex items-center justify-center shrink-0 shadow-xs`}
                    >
                      {sub.avatarInitial}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                        {sub.name}
                      </h2>
                      <div className="text-xs text-stone-500 font-medium line-clamp-1">
                        {sub.company}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Unboxed Metadata with Typographic Separators */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-stone-500">
                  <div className="flex items-center gap-1 text-amber-700 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span className="tabular-nums font-mono">{sub.rating.toFixed(2)}</span>
                  </div>
                  <span aria-hidden="true">·</span>
                  <span>{sub.reviewsCount} reviews</span>
                  <span aria-hidden="true">·</span>
                  <span>{sub.experienceYears} yrs exp</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-700 font-medium">{sub.completedProjectsCount} jobs done</span>
                </div>

                {/* Specialties */}
                <div className="mt-3 space-y-1">
                  {sub.specialties.slice(0, 2).map((spec, i) => (
                    <div key={i} className="text-xs text-stone-600 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="line-clamp-1">{spec}</span>
                    </div>
                  ))}
                </div>

                {/* Verified Government Badges (clean unboxed text or subtle hairline) */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap gap-1.5">
                  {sub.verifiedBadges.map((badge, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-medium text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-200"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Card Area: Rates & Direct Action */}
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-stone-400">Rate Guideline</div>
                  <div className="text-sm font-extrabold text-stone-900 font-mono tabular-nums">
                    {sub.startingRate}{' '}
                    <span className="text-xs font-normal text-stone-500">{sub.rateUnit}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedContractor(sub)}
                  className="px-3.5 py-2 text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-900 hover:text-white rounded-lg transition-colors"
                >
                  View Profile &amp; Rates
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Profile Drawer / Modal */}
        {selectedContractor && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 border border-stone-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedContractor(null)}
                className="absolute top-5 right-5 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
                aria-label="Close Profile"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl ${selectedContractor.avatarBg} text-white font-extrabold text-xl flex items-center justify-center shrink-0 shadow-md`}
                >
                  {selectedContractor.avatarInitial}
                </div>
                <div>
                  <div className="text-xs text-amber-800 font-semibold uppercase tracking-wider">
                    {selectedContractor.tradeLabel}
                  </div>
                  <h2 className="text-2xl font-bold text-stone-900 font-display">
                    {selectedContractor.name}
                  </h2>
                  <div className="text-xs text-stone-500 font-medium">
                    {selectedContractor.company}
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-xs text-stone-600">
                    <div className="flex items-center text-amber-600 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-1" />
                      <span>{selectedContractor.rating.toFixed(2)}</span>
                    </div>
                    <span>·</span>
                    <span>{selectedContractor.reviewsCount} verified reviews</span>
                    <span>·</span>
                    <span className="text-emerald-700 font-medium">
                      {selectedContractor.warrantyOffered}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio & Credentials */}
              <div className="mt-6 space-y-4 text-xs sm:text-sm">
                <p className="text-stone-600 leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-100">
                  {selectedContractor.bio}
                </p>

                {/* Verified Accreditation */}
                <div>
                  <div className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                    Accreditation &amp; Licenses
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedContractor.verifiedBadges.map((badge, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-semibold">{badge}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transparent Rate Card */}
                <div>
                  <div className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                    Transparent Direct Rate Card
                  </div>
                  <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100">
                    {selectedContractor.rateCard.map((item, i) => (
                      <div
                        key={i}
                        className="p-3 flex items-center justify-between text-xs bg-white hover:bg-stone-50"
                      >
                        <span className="text-stone-800 font-medium">{item.service}</span>
                        <span className="font-mono font-bold text-stone-900 tabular-nums">
                          {item.price}{' '}
                          <span className="text-[11px] font-normal text-stone-500">/{item.unit}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Reviews */}
                <div>
                  <div className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                    Verified Homeowner Feedback
                  </div>
                  <div className="space-y-2">
                    {selectedContractor.reviews.map((rev, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-stone-200 bg-stone-50/60 text-xs space-y-1"
                      >
                        <div className="flex justify-between items-center text-stone-700">
                          <span className="font-bold">{rev.author}</span>
                          <span className="text-stone-400 font-mono text-[11px]">{rev.date}</span>
                        </div>
                        <div className="text-amber-800 font-medium text-[11px]">
                          {rev.projectType}
                        </div>
                        <p className="text-stone-600 italic">"{rev.comment}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hotline in-UI Notice */}
              {hotlineNotice && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                  <PhoneCall className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-semibold">{hotlineNotice}</span>
                    <button
                      onClick={() => setHotlineNotice(null)}
                      className="ml-2 text-stone-500 hover:text-stone-800 underline text-[11px]"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons in Modal */}
              <div className="mt-8 pt-5 border-t border-stone-200 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleBookContractor(selectedContractor)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Hire via SafePay Escrow Protection</span>
                </button>
                <button
                  onClick={() => {
                    setHotlineNotice(`Direct WhatsApp hotline for ${selectedContractor.company}: +65 6789 2200 (Quote ref: HOMESTYLER-${selectedContractor.id})`);
                  }}
                  className="px-4 py-3 border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold rounded-xl transition-colors"
                >
                  Direct Inquiry Hotline
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Smart Matchmaking 4-Step Wizard Modal */}
        {wizardOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 border border-stone-200 shadow-2xl relative">
              <button
                onClick={() => {
                  setWizardOpen(false);
                  if (onCloseWizardModal) onCloseWizardModal();
                }}
                className="absolute top-5 right-5 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Wizard Step Indicator */}
              <div className="flex items-center gap-2 text-xs text-stone-500 mb-4">
                <span>Smart Matchmaker</span>
                <span aria-hidden="true">·</span>
                <span>Step {wizardStep} of 4</span>
              </div>

              {/* Step 1: Property Type */}
              {wizardStep === 1 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-stone-900 font-display">
                    What type of property are you renovating?
                  </h2>
                  <p className="text-xs text-stone-600">
                    Different home typologies require distinct statutory permit filings (e.g. HDB vs MCST vs URA).
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'hdb_3room', label: 'HDB 3-Room Flat' },
                      { id: 'hdb_4room', label: 'HDB 4-Room Flat' },
                      { id: 'hdb_5room', label: 'HDB 5-Room / Executive' },
                      { id: 'condo', label: 'Private Condominium' },
                      { id: 'landed', label: 'Landed Terrace / Semi-D' },
                      { id: 'commercial', label: 'Commercial / Shophouse' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setWizardProperty(p.id as PropertyType)}
                        className={`p-3.5 text-xs font-bold rounded-xl border text-left transition-all ${
                          wizardProperty === p.id
                            ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => setWizardStep(2)}
                      className="flex items-center gap-1.5 px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Trades Needed */}
              {wizardStep === 2 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-stone-900 font-display">
                    Which specialist trades do you require?
                  </h2>
                  <p className="text-xs text-stone-600">
                    Select all that apply. We will match contractors holding the relevant trade licensing.
                  </p>

                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { id: 'carpentry', label: 'Bespoke Carpentry' },
                      { id: 'electrical', label: 'EMA Electrical (LEW)' },
                      { id: 'plumbing', label: 'PUB Sanitary Plumbing' },
                      { id: 'masonry_tiling', label: 'Tiling & Masonry' },
                      { id: 'painting', label: 'Painting & Skim Coat' },
                      { id: 'demolition', label: 'Hacking & Demolition' },
                      { id: 'glass_aluminium', label: 'Glass Shower & Windows' },
                      { id: 'aircon', label: 'Air-Con Commissioning' },
                    ].map((t) => {
                      const isSelected = wizardTrades.includes(t.id as TradeCategory);
                      return (
                        <button
                          key={t.id}
                          onClick={() => toggleWizardTrade(t.id as TradeCategory)}
                          className={`p-3 text-xs font-semibold rounded-lg border text-left flex items-center justify-between transition-all ${
                            isSelected
                              ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold'
                              : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                          }`}
                        >
                          <span>{t.label}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-700" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      onClick={() => setWizardStep(1)}
                      className="px-4 py-2 border border-stone-300 text-stone-700 text-xs rounded-lg hover:bg-stone-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setWizardStep(3)}
                      disabled={wizardTrades.length === 0}
                      className="flex items-center gap-1.5 px-5 py-2.5 bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Budget & Timeline */}
              {wizardStep === 3 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-stone-900 font-display">
                    Project Budget &amp; Target Start Date
                  </h2>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                      Target Budget Range
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'budget', label: '$10k - $30k', sub: 'Partial / Essential' },
                        { id: 'mid', label: '$30k - $60k', sub: 'Standard 4-Rm Turnkey' },
                        { id: 'luxury', label: '$60k - $120k+', sub: 'High-End Architectural' },
                      ].map((b) => (
                        <button
                          key={b.id}
                          onClick={() => setWizardBudget(b.id as any)}
                          className={`p-3 text-left rounded-xl border transition-all ${
                            wizardBudget === b.id
                              ? 'bg-stone-900 text-white border-stone-900'
                              : 'bg-stone-50 border-stone-200 text-stone-700'
                          }`}
                        >
                          <div className="text-xs font-bold">{b.label}</div>
                          <div className="text-[10px] opacity-75 mt-0.5">{b.sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                      When would you like work to commence?
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'immediate', label: 'Urgent / Next 7 Days' },
                        { id: '1_month', label: 'Within 1 Month' },
                        { id: '3_months', label: '2 - 3 Months Later' },
                      ].map((tm) => (
                        <button
                          key={tm.id}
                          onClick={() => setWizardTimeline(tm.id as any)}
                          className={`p-3 text-left text-xs font-semibold rounded-xl border transition-all ${
                            wizardTimeline === tm.id
                              ? 'bg-amber-700 text-white border-amber-700'
                              : 'bg-stone-50 border-stone-200 text-stone-700'
                          }`}
                        >
                          {tm.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      onClick={() => setWizardStep(2)}
                      className="px-4 py-2 border border-stone-300 text-stone-700 text-xs rounded-lg hover:bg-stone-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={executeMatchmaking}
                      className="flex items-center gap-1.5 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Run Smart Compatibility Match</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Algorithmic Match Results */}
              {wizardStep === 4 && (
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold mb-1">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Match Complete</span>
                    </div>
                    <h2 className="text-xl font-bold text-stone-900 font-display">
                      Top Matched Sub-contractors for You
                    </h2>
                    <p className="text-xs text-stone-600">
                      Ranked by trade specialization, verified credentials, and immediate schedule alignment.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {wizardMatchedResults.map(({ subcontractor, matchScore, reason }, idx) => (
                      <div
                        key={subcontractor.id}
                        className="p-4 rounded-xl border border-stone-200 bg-stone-50/80 hover:bg-white hover:border-amber-600 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-lg ${subcontractor.avatarBg} text-white font-bold text-sm flex items-center justify-center shrink-0`}
                            >
                              {subcontractor.avatarInitial}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-stone-900">
                                {subcontractor.name}
                              </div>
                              <div className="text-[11px] text-stone-500 font-medium">
                                {subcontractor.company}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-mono tabular-nums">
                              {matchScore}% Match
                            </span>
                          </div>
                        </div>

                        <div className="mt-2.5 text-xs text-stone-600 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{reason}</span>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-stone-200 flex items-center justify-between text-xs">
                          <div className="text-stone-500 font-mono">
                            From {subcontractor.startingRate} {subcontractor.rateUnit}
                          </div>
                          <button
                            onClick={() => {
                              setWizardOpen(false);
                              setSelectedContractor(subcontractor);
                            }}
                            className="font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1"
                          >
                            <span>Inspect Rate Card</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-between">
                    <button
                      onClick={() => setWizardStep(1)}
                      className="px-4 py-2 border border-stone-300 text-stone-700 text-xs rounded-lg hover:bg-stone-50"
                    >
                      Start Over
                    </button>
                    <button
                      onClick={() => {
                        setWizardOpen(false);
                        if (onCloseWizardModal) onCloseWizardModal();
                      }}
                      className="px-5 py-2 bg-stone-900 text-white text-xs font-bold rounded-lg hover:bg-stone-800"
                    >
                      Browse Full Directory
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
