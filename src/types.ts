export type Language = 'bn' | 'en';
export type Theme = 'light' | 'dark';

export type BudgetTier = 'street' | 'budget' | 'mid' | 'luxury'; // street (<200৳), budget (200-500৳), mid (500-1200৳), luxury (1200৳+)

export type VibeType = 'rooftop' | 'aesthetic_interior' | 'garden_outdoor' | 'heritage' | 'cozy_cafe' | 'family_dining';

export interface DishItem {
  name: string;
  nameBn?: string;
  priceBDT: number;
  isPopular?: boolean;
  category?: string;
}

export interface OfferItem {
  id: string;
  title: string;
  titleBn?: string;
  platform: 'Foodpanda' | 'bKash' | 'Nagad' | 'Bank Card' | 'In-house' | 'Student';
  discountText: string;
  discountTextBn?: string;
  promoCode?: string;
  validUntil?: string;
}

export interface ReviewSnippet {
  user: string;
  rating: number;
  text: string;
  textBn?: string;
  source: 'Google Maps' | 'Foodpanda' | 'Foodies Community' | 'Verified Guest';
  date?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  nameBn: string;
  area: string;
  areaBn: string;
  city: string;
  cityBn: string;
  address: string;
  addressBn?: string;
  coordinates?: { lat: number; lng: number };
  cuisine: string[];
  cuisineBn?: string[];
  budgetTier: BudgetTier;
  avgPricePerPersonBDT: number;
  rating: number;
  reviewCount: number;
  coverImage: string;
  interiorImages: string[];
  exteriorImages?: string[];
  vibe: VibeType;
  vibeBn: string;
  photogenicScore: number; // 1-10
  photographyHighlights: {
    en: string;
    bn: string;
  };
  popularDishes: DishItem[];
  offers: OfferItem[];
  reviews: ReviewSnippet[];
  googleMapsUrl?: string;
  foodpandaUrl?: string;
  facebookUrl?: string;
  contactNumber?: string;
  openingHours?: string;
  isOwnerVerified?: boolean;
  isLiveScraped?: boolean;
  groundingUrls?: { title: string; uri: string }[];
}

export interface DecisionFilter {
  city: string;
  area: string;
  budgetTier: BudgetTier | 'all';
  maxBudgetBDT?: number;
  vibe: VibeType | 'all';
  cravingDish: string;
  hasOffersOnly: boolean;
  minRating: number;
}
