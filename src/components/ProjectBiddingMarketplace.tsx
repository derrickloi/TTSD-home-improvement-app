import React, { useState } from 'react';
import {
  Users,
  TrendingUp,
  FileText,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  BadgePercent,
  Plus,
  Send,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Filter,
  DollarSign,
  X,
} from 'lucide-react';

export interface RenovationLead {
  id: string;
  title: string;
  propertyType: string;
  scopeSummary: string;
  budgetRange: string;
  location: string;
  postalDistrict: string;
  targetTimeline: string;
  bidsCount: number;
  homeownerName: string;
  postedDate: string;
  status: 'open_for_bidding' | 'reviewing_bids' | 'awarded';
  trades: string[];
}

const INITIAL_PROJECT_LEADS: RenovationLead[] = [
  {
    id: 'LEAD-SG-101',
    title: '4-Room BTO Full Scandinavian Joinery & M&E Overhaul',
    propertyType: 'HDB 4-Room BTO (93 sqm)',
    scopeSummary: 'Full-height master bedroom wardrobe (14ft), custom kitchen island with quartz countertop, living feature wall, and full electrical repiping with LEW endorsement.',
    budgetRange: '$48,000 - $58,000',
    location: 'Bidadari Park Drive',
    postalDistrict: 'D13 (Macpherson / Potong Pasir)',
    targetTimeline: 'Commencing next month',
    bidsCount: 8,
    homeownerName: 'Marcus T. (Verified Homeowner)',
    postedDate: '2 days ago',
    status: 'open_for_bidding',
    trades: ['Carpentry', 'Electrical', 'Plumbing', 'Painting'],
  },
  {
    id: 'LEAD-SG-102',
    title: '2-Storey Landed Inter-Terrace A&A Structural Loft Extension',
    propertyType: 'Landed Terrace (2,400 sqft built-up)',
    scopeSummary: 'Addition of mezzanine steel-beam loft, structural staircase relocation with PE endorsement, balcony waterproofing, and replacement of all sliding acoustic glass doors.',
    budgetRange: '$120,000 - $160,000',
    location: 'Telok Kurau Road',
    postalDistrict: 'D15 (East Coast / Marine Parade)',
    targetTimeline: 'Commencing in 6 weeks',
    bidsCount: 6,
    homeownerName: 'Dr. Raymond Chen',
    postedDate: '3 days ago',
    status: 'open_for_bidding',
    trades: ['A&A Structural', 'General Builder GB1', 'Demolition', 'Glass & Aluminium'],
  },
  {
    id: 'LEAD-SG-103',
    title: 'Condo Master Bath 72-Hour Waterproofing & Large Format Tiling',
    propertyType: 'Condominium (Ardmore Park)',
    scopeSummary: 'Hack existing wall and floor tiles, 3-coat polymer waterproofing membrane with mandatory 72-hour ponding test, and 1200x600 porcelain slab cladding with concealed Grohe thermostatic mixers.',
    budgetRange: '$24,000 - $32,000',
    location: 'Ardmore Park',
    postalDistrict: 'D10 (Tanglin / Holland)',
    targetTimeline: 'Immediate / Next 10 days',
    bidsCount: 7,
    homeownerName: 'Valerie S.',
    postedDate: 'Yesterday',
    status: 'open_for_bidding',
    trades: ['Tiling & Masonry', 'Plumbing', 'Waterproofing'],
  },
  {
    id: 'LEAD-SG-104',
    title: 'Commercial Shophouse Change-of-Use & 3-Phase Electrical Upgrade',
    propertyType: 'Conservation Shophouse (2nd Floor)',
    scopeSummary: 'Full rewiring with 3-phase 63A distribution board upgrade, emergency fire exit doors, acoustic ceiling panels, and ADA-compliant unisex toilet sanitary overhaul.',
    budgetRange: '$65,000 - $85,000',
    location: 'Amoy Street',
    postalDistrict: 'D01 (Raffles Place / Cecil)',
    targetTimeline: 'Commencing within 3 weeks',
    bidsCount: 5,
    homeownerName: 'Urban Coffee Co.',
    postedDate: '4 days ago',
    status: 'open_for_bidding',
    trades: ['Electrical (LEW Grade 7)', 'Commercial Builder', 'Carpentry'],
  },
];

export const ProjectBiddingMarketplace: React.FC = () => {
  const [userView, setUserView] = useState<'homeowner' | 'contractor'>('contractor');
  const [leads, setLeads] = useState<RenovationLead[]>(INITIAL_PROJECT_LEADS);
  const [selectedTradeFilter, setSelectedTradeFilter] = useState<string>('all');
  const [showPostModal, setShowPostModal] = useState(false);
  const [biddingOnLead, setBiddingOnLead] = useState<RenovationLead | null>(null);

  // Homeowner new post form state
  const [newTitle, setNewTitle] = useState('');
  const [newPropertyType, setNewPropertyType] = useState('HDB 4-Room');
  const [newScope, setNewScope] = useState('');
  const [newBudget, setNewBudget] = useState('$35,000 - $50,000');
  const [newLocation, setNewLocation] = useState('');

  // Contractor bid form state
  const [bidAmount, setBidAmount] = useState('');
  const [bidWeeks, setBidWeeks] = useState('6 weeks');
  const [bidNote, setBidNote] = useState('');
  const [bidSubmittedMessage, setBidSubmittedMessage] = useState<string | null>(null);

  const filteredLeads = leads.filter((lead) => {
    if (selectedTradeFilter === 'all') return true;
    return lead.trades.some((t) => t.toLowerCase().includes(selectedTradeFilter.toLowerCase()));
  });

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newLeadItem: RenovationLead = {
      id: `LEAD-SG-${Math.floor(100 + Math.random() * 900)}`,
      title: newTitle,
      propertyType: newPropertyType,
      scopeSummary: newScope || 'Comprehensive turnkey renovation and bespoke finishes.',
      budgetRange: newBudget,
      location: newLocation || 'Singapore',
      postalDistrict: 'Central Region',
      targetTimeline: 'Flexible / Next month',
      bidsCount: 0,
      homeownerName: 'You (Verified Homeowner)',
      postedDate: 'Just now',
      status: 'open_for_bidding',
      trades: ['Carpentry', 'Electrical', 'Painting'],
    };

    setLeads([newLeadItem, ...leads]);
    setShowPostModal(false);
    setNewTitle('');
    setNewScope('');
    setNewLocation('');
    setBidSubmittedMessage('Your project has been posted for free! Accredited contractors have been notified.');
    setTimeout(() => setBidSubmittedMessage(null), 4000);
  };

  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!biddingOnLead) return;

    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === biddingOnLead.id ? { ...lead, bidsCount: lead.bidsCount + 1 } : lead
      )
    );

    setBidSubmittedMessage(
      `Bid of $${bidAmount} SGD successfully submitted on ${biddingOnLead.title}. The homeowner has received your quote.`
    );
    setBiddingOnLead(null);
    setBidAmount('');
    setBidNote('');
    setTimeout(() => setBidSubmittedMessage(null), 4000);
  };

  return (
    <div className="py-10 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Banner */}
        {bidSubmittedMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 flex items-center justify-between text-xs sm:text-sm font-semibold shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{bidSubmittedMessage}</span>
            </div>
            <button
              onClick={() => setBidSubmittedMessage(null)}
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
              <Briefcase className="w-4 h-4 text-amber-700" />
              <span>Project Bidding Exchange &amp; Qualified Sales Leads</span>
            </div>
            <h1 className="text-3xl font-bold text-stone-900 font-display tracking-tight">
              Direct Project Bidding &amp; Sales Leads Hub
            </h1>
            <p className="mt-2 text-sm text-stone-600 max-w-2xl leading-relaxed">
              100% Free for homeowners to post and engage directly with verified tradesmen. Contractors and Interior Designers bid on active sales leads and only pay a success commission upon awarded milestone payouts.
            </p>
          </div>

          {/* Persona Switcher Toggle */}
          <div className="flex items-center p-1 bg-stone-200/80 rounded-xl shrink-0">
            <button
              onClick={() => setUserView('contractor')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                userView === 'contractor'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Contractor / ID View
            </button>
            <button
              onClick={() => setUserView('homeowner')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                userView === 'homeowner'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Homeowner View
            </button>
          </div>
        </div>

        {/* Leading Financial Health Indicators Bar */}
        <div className="mt-8 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Leading Financial Health Indicators
              </span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Platform Health: 100% On-Target
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-5">
            {/* Indicator 1: Homeowner users > 1000 */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-500">Homeowner Users</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                  Target &gt;1,000 Met
                </span>
              </div>
              <div className="text-3xl font-extrabold text-stone-900 font-mono tabular-nums">
                1,420
              </div>
              <p className="text-[11px] text-stone-500">
                Active registered homeowners with live project requests across Singapore.
              </p>
            </div>

            {/* Indicator 2: At least 5 bids per month */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-500">Monthly Bid Velocity</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                  Target &ge;5 Met
                </span>
              </div>
              <div className="text-3xl font-extrabold text-stone-900 font-mono tabular-nums">
                7.4 <span className="text-xs font-normal text-stone-500">bids / project / mo</span>
              </div>
              <p className="text-[11px] text-stone-500">
                High contractor competition ensures fair pricing and fast quote turnaround.
              </p>
            </div>

            {/* Indicator 3: Commercial Model */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-500">Commission Pricing Model</span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">
                  Pay-for-Performance
                </span>
              </div>
              <div className="text-2xl font-extrabold text-amber-900 font-display">
                Free for Owners · 3.5% Commission
              </div>
              <p className="text-[11px] text-stone-500">
                Contractors only pay commission upon winning the project and receiving escrow disbursements.
              </p>
            </div>
          </div>
        </div>

        {/* Action Header: Post New Lead (Free) or Search Leads */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 text-xs">
            <span className="text-stone-500 font-semibold mr-1">Filter Trades:</span>
            {[
              { id: 'all', label: 'All Projects' },
              { id: 'carpentry', label: 'Carpentry' },
              { id: 'electrical', label: 'Electrical / LEW' },
              { id: 'structural', label: 'A&A Structural' },
              { id: 'tiling', label: 'Tiling & Baths' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedTradeFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap ${
                  selectedTradeFilter === f.id
                    ? 'bg-stone-900 text-white border-stone-900 font-semibold shadow-xs'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowPostModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Reno Project ($0 Free)</span>
          </button>
        </div>

        {/* Project Leads Bidding Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs hover:border-amber-600/60 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Upper Meta */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <span className="font-semibold text-amber-800">{lead.propertyType}</span>
                      <span>·</span>
                      <span className="font-mono">{lead.postedDate}</span>
                    </div>
                    <h3 className="text-base font-bold text-stone-900 font-display mt-1">
                      {lead.title}
                    </h3>
                  </div>

                  <span className="text-xs font-bold font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 shrink-0">
                    {lead.bidsCount} Bids Active
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3.5 rounded-xl border border-stone-100">
                  {lead.scopeSummary}
                </p>

                {/* Scope Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {lead.trades.map((t, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-medium text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Details Strip */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                  <div>
                    <span className="text-stone-400 block">Location:</span>
                    <span className="font-semibold text-stone-800 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-500" />
                      <span>{lead.location}</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-stone-400 block">Homeowner Budget:</span>
                    <span className="font-mono font-bold text-stone-900 mt-0.5 block">
                      {lead.budgetRange}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                <div className="text-[11px] text-stone-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Escrow SafePay Protected</span>
                </div>

                <button
                  onClick={() => setBiddingOnLead(lead)}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  <span>Submit Contractor Bid</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Homeowner Post New Project ($0 Free) */}
        {showPostModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 border border-stone-200 shadow-2xl relative">
              <button
                onClick={() => setShowPostModal(false)}
                className="absolute top-5 right-5 p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>100% Free Homeowner Project Submission</span>
              </div>

              <h2 className="text-xl font-bold text-stone-900 font-display">
                Post Your Renovation Project
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                Zero fees for homeowners. Verified BCA and EMA licensed contractors will review your scope and submit itemized bids.
              </p>

              <form onSubmit={handleCreateLead} className="mt-5 space-y-4 text-xs">
                <div>
                  <label className="font-bold text-stone-700 uppercase tracking-wider block mb-1">
                    Project Headline
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5-Room Resale Full Kitchen & Master Bath Renovation"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 uppercase tracking-wider block mb-1">
                      Property Type
                    </label>
                    <select
                      value={newPropertyType}
                      onChange={(e) => setNewPropertyType(e.target.value)}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                    >
                      <option value="HDB 3-Room">HDB 3-Room Flat</option>
                      <option value="HDB 4-Room">HDB 4-Room Flat</option>
                      <option value="HDB 5-Room">HDB 5-Room / Executive</option>
                      <option value="Private Condo">Private Condominium</option>
                      <option value="Landed Terrace">Landed Terrace / Semi-D</option>
                      <option value="Commercial">Commercial / Shophouse</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 uppercase tracking-wider block mb-1">
                      Estimated Budget
                    </label>
                    <select
                      value={newBudget}
                      onChange={(e) => setNewBudget(e.target.value)}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                    >
                      <option value="$15,000 - $30,000">$15,000 - $30,000 (Essential)</option>
                      <option value="$35,000 - $55,000">$35,000 - $55,000 (Standard)</option>
                      <option value="$60,000 - $90,000">$60,000 - $90,000 (Extensive)</option>
                      <option value="$100,000+">$100,000+ (High-End A&amp;A)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-700 uppercase tracking-wider block mb-1">
                    Property Location / Estate
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Punggol Field / Clementi Ave 3"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 uppercase tracking-wider block mb-1">
                    Scope of Work Summary
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe specific requirements (e.g. wall hacking, 80ft carpentry, PUB piping reroute, 72-hr waterproofing test)..."
                    value={newScope}
                    onChange={(e) => setNewScope(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl transition-colors shadow-xs"
                  >
                    Post Project ($0 Free)
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Contractor Submit Bid */}
        {biddingOnLead && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 border border-stone-200 shadow-2xl relative">
              <button
                onClick={() => setBiddingOnLead(null)}
                className="absolute top-5 right-5 p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-2">
                <Briefcase className="w-4 h-4 text-amber-700" />
                <span>Submit Contractor / ID Proposal</span>
              </div>

              <h2 className="text-xl font-bold text-stone-900 font-display">
                Bid on: {biddingOnLead.title}
              </h2>
              <div className="text-xs text-stone-500 mt-1">
                Owner Budget: <span className="font-bold font-mono text-stone-800">{biddingOnLead.budgetRange}</span> · Location: {biddingOnLead.location}
              </div>

              {/* Commission disclosure */}
              <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <BadgePercent className="w-4 h-4 text-amber-800" />
                  <span>Commission Model: 3.5% Success Fee</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  Zero upfront cost to bid. You only pay a 3.5% commission when the homeowner accepts your bid and funds are released via SafePay milestone escrow.
                </p>
              </div>

              <form onSubmit={handleSubmitBid} className="mt-5 space-y-4 text-xs">
                <div>
                  <label className="font-bold text-stone-700 uppercase tracking-wider block mb-1">
                    Your Proposed Quotation (SGD)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 52000"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 uppercase tracking-wider block mb-1">
                    Estimated Project Completion Duration
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 - 6 weeks"
                    value={bidWeeks}
                    onChange={(e) => setBidWeeks(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 uppercase tracking-wider block mb-1">
                    Proposal Note &amp; Verified Licensing Details
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Include your BCA/EMA licensing number, Blum hardware guarantee, and 72-hr waterproofing test commitment..."
                    value={bidNote}
                    onChange={(e) => setBidNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4 text-amber-400" />
                    <span>Submit Binding Bid to Homeowner</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
