export type PropertyType =
  | 'hdb_3room'
  | 'hdb_4room'
  | 'hdb_5room'
  | 'condo'
  | 'landed'
  | 'commercial';

export type TradeCategory =
  | 'all'
  | 'carpentry'
  | 'plumbing'
  | 'electrical'
  | 'masonry_tiling'
  | 'painting'
  | 'glass_aluminium'
  | 'aircon'
  | 'demolition'
  | 'waterproofing'
  | 'handyman';

export interface RateCardItem {
  service: string;
  price: string;
  unit: string;
  note?: string;
}

export interface ReviewItem {
  author: string;
  rating: number;
  date: string;
  comment: string;
  projectType: string;
}

export interface Subcontractor {
  id: string;
  name: string;
  company: string;
  trade: TradeCategory;
  tradeLabel: string;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  startingRate: string;
  rateUnit: string;
  verifiedBadges: string[];
  avatarInitial: string;
  avatarBg: string;
  location: string;
  availableFrom: string;
  specialties: string[];
  bio: string;
  completedProjectsCount: number;
  warrantyOffered: string;
  rateCard: RateCardItem[];
  reviews: ReviewItem[];
  featured?: boolean;
}

export interface InteriorDesignStyle {
  id: string;
  name: string;
  tagline: string;
  description: string;
  estimatedSqftCost: string;
  avgFullRenoCost: string;
  keyMaterials: string[];
  idealFor: string;
  features: string[];
  palette: { name: string; hex: string }[];
  accentColor: string;
}

export interface LoanProduct {
  id: string;
  bank: string;
  name: string;
  interestRate: number; // e.g. 2.88
  eir: number; // e.g. 5.12
  maxTenureYears: number;
  maxQuantum: number;
  minAnnualIncome: number;
  processingFee: string;
  perks: string[];
  badge?: string;
  accent: string;
}

export interface EscrowMilestone {
  id: number;
  stage: string;
  title: string;
  percentage: number;
  amount: number;
  status: 'paid' | 'in_escrow' | 'action_required' | 'upcoming';
  description: string;
  deliverables: string[];
  inspectionEvidence: { label: string; verified: boolean; date: string }[];
  payoutDate?: string;
}

export interface MarketplaceItem {
  id: string;
  name: string;
  category: 'fixtures' | 'smart_home' | 'surfaces' | 'lighting' | 'cabinetry' | 'packages';
  categoryLabel: string;
  price: number;
  originalPrice: number;
  brand: string;
  rating: number;
  reviewsCount: number;
  specs: string[];
  installationFee: number;
  warranty: string;
  stock: number;
  badge?: string;
  iconType: string;
  colorScheme: string;
}

export interface CartItem {
  product: MarketplaceItem;
  quantity: number;
  withInstallation: boolean;
}

export interface MatchmakingAnswer {
  propertyType: PropertyType;
  sqft: number;
  projectScope: 'full_reno' | 'aa_structural' | 'partial_kitchen_bath' | 'repair_maintenance';
  tradesNeeded: TradeCategory[];
  budgetTier: 'budget' | 'mid' | 'luxury';
  timeline: 'immediate' | '1_month' | '3_months';
  postcode: string;
}
