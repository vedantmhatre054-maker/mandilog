export type UserRole = 'farmer' | 'buyer' | 'transporter' | 'admin';
export type PreferredLanguage = 'mr' | 'hi' | 'en';
export type CropStatus = 'growing' | 'harvest_ready' | 'harvested' | 'cancelled';
export type ListingCategory = 'Vegetables' | 'Fruits' | 'Grains' | 'Pulses' | 'Other';
export type ListingUnit = 'kg' | 'Quintal' | 'Crates' | 'Ton';
export type ListingStatus = 'active' | 'offer_accepted' | 'completed' | 'cancelled';
export type BidStatus = 'pending' | 'accepted' | 'rejected' | 'outbid';
export type DeliveryMethod = 'farmer_delivery' | 'buyer_pickup' | 'transport_arranged' | 'collection_centre';
export type OrderStatus = 'confirmed' | 'ready_for_pickup' | 'dispatched' | 'delivered' | 'completed';
export type SchemeCategory = 'Central Govt' | 'State Govt' | 'Loan' | 'Equipment' | 'Insurance';

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  role: UserRole;
  preferred_language: PreferredLanguage;
  village_district: string;
  avatar_url?: string | null;
}

export interface Farm {
  id: string;
  farmer_id: string;
  farm_name: string;
  location_text: string;
  area_acres: number;
  soil_type: string;
}

export interface FarmCrop {
  id: string;
  farm_id: string;
  farmer_id: string;
  crop_name: string;
  variety: string;
  sowing_date: string;
  expected_harvest_date: string;
  current_stage_days: number;
  total_cycle_days: number;
  area_allocated_acres: number;
  status: CropStatus;
}

export interface Listing {
  id: string;
  farmer_id: string;
  crop_name: string;
  category: ListingCategory;
  quantity: number;
  unit: ListingUnit;
  grade: string;
  pickup_location: string;
  starting_price_per_unit: number;
  min_increment: number;
  highest_bid_per_unit?: number | null;
  highest_bidder_id?: string | null;
  total_bids: number;
  status: ListingStatus;
  auction_end: string;
  image_url?: string | null;
}

export interface Bid {
  id: string;
  listing_id: string;
  buyer_id: string;
  buyer_name: string;
  bid_price_per_unit: number;
  total_bid_amount: number;
  bid_status: BidStatus;
  created_at: string;
}

export interface Order {
  id: string;
  listing_id: string;
  accepted_bid_id: string;
  farmer_id: string;
  buyer_id: string;
  agreed_rate_per_unit: number;
  quantity: number;
  unit: ListingUnit | string;
  total_amount: number;
  delivery_method: DeliveryMethod;
  transport_cost: number;
  order_status: OrderStatus;
  created_at: string;
}

export interface Scheme {
  id: string;
  title: string;
  category: SchemeCategory;
  description: string;
  benefit_amount: string | number;
  eligibility: string;
  official_link: string;
}

export interface MarketPrice {
  id: string;
  market_name: string;
  state: string;
  district: string;
  crop_name: string;
  variety: string;
  price_per_unit: number;
  unit: string;
  distance_from_base_km: number;
  transport_rate_per_km: number;
  spoilage_rate_pct: number;
  source_badge: string;
}

export interface MarketOption {
  marketName: string;
  distanceKm: number;
  pricePerUnit: number;
  unit: string;
  transportRatePerKm: number;
  spoilageRatePercent: number;
}

export interface CalculationResult {
  marketName: string;
  grossRevenue: number;
  transportCost: number;
  spoilageCost: number;
  netProceeds: number;
  isRecommended: boolean;
}

