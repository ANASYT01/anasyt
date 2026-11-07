/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SupportedCity =
  | 'casablanca'
  | 'rabat'
  | 'marrakech'
  | 'tanger'
  | 'agadir'
  | 'fes'
  | 'meknes'
  | 'oujda'
  | 'kenitra'
  | 'tetouan'
  | 'safi'
  | 'mohammedia'
  | 'eljadida'
  | 'benimellal'
  | 'nador'
  | 'taza'
  | 'khouribga'
  | 'settat'
  | 'berrechid'
  | 'essaouira'
  | 'alhoceima'
  | 'chefchaouen'
  | 'dakhla'
  | 'laayoune'
  | 'taroudant'
  | 'berkane'
  | 'ouarzazate'
  | 'larache'
  | 'guelmim'
  | 'boujdour'
  | 'smara'
  | 'lagouira'
  | 'tarfaya'
  | 'tantan';

export interface CityOption {
  id: SupportedCity;
  name: string;
  country: string;
  flag: string;
  subtitle: string;
  tag?: string;
  lat: number;
  lng: number;
  deliveryTime: string;
  hubName: string;
  address?: string;
}

export const SUPPORTED_CITIES: CityOption[] = [
  { 
    id: 'casablanca', 
    name: 'Casablanca', 
    country: 'Maroc', 
    flag: '🇲🇦', 
    subtitle: 'Grand Casablanca VIP Reserve',
    lat: 33.5731, 
    lng: -7.5898,
    deliveryTime: 'Livraison Express 24h & Meet-up',
    hubName: 'Hub Central Anfa / Gauthier',
    address: 'Point de retrait & livraison VIP Casablanca'
  },
  { 
    id: 'rabat', 
    name: 'Rabat', 
    country: 'Maroc', 
    flag: '🇲🇦', 
    subtitle: 'Capitale VIP Drop & Express',
    lat: 34.0209, 
    lng: -6.8416,
    deliveryTime: 'Livraison 24h & Drop VIP',
    hubName: 'Hub Agdal / Souissi',
    address: 'Point de retrait & livraison VIP Rabat'
  },
  { 
    id: 'marrakech', 
    name: 'Marrakech', 
    country: 'Maroc', 
    flag: '🇲🇦', 
    subtitle: 'Ville Ocre Private Reserve',
    lat: 31.6295, 
    lng: -7.9811,
    deliveryTime: 'Livraison Express 24h Hivernage',
    hubName: 'Hub Guéliz / Hivernage',
    address: 'Point de retrait & livraison VIP Marrakech'
  },
  { 
    id: 'tanger', 
    name: 'Tanger', 
    country: 'Maroc', 
    flag: '🇲🇦', 
    subtitle: 'Détroit Premium Selection',
    lat: 35.7595, 
    lng: -5.8340,
    deliveryTime: 'Livraison Express 24h Malabata',
    hubName: 'Hub Malabata / Centre',
    address: 'Point de retrait & livraison VIP Tanger'
  },
  { 
    id: 'agadir', 
    name: 'Agadir', 
    country: 'Maroc', 
    flag: '🇲🇦', 
    subtitle: 'Souss Coast Reserve',
    lat: 30.4278, 
    lng: -9.5981,
    deliveryTime: 'Expédition Sécurisée 24/48h',
    hubName: 'Hub Baie des Palmiers',
    address: 'Point de retrait & livraison VIP Agadir'
  },
  { 
    id: 'fes', 
    name: 'Fès', 
    country: 'Maroc', 
    flag: '🇲🇦', 
    subtitle: 'Imperial Heritage Selection',
    lat: 34.0331, 
    lng: -5.0003,
    deliveryTime: 'Expédition Sécurisée 24/48h',
    hubName: 'Hub Ville Nouvelle',
    address: 'Point de retrait & livraison VIP Fès'
  },
  {
    id: 'meknes',
    name: 'Meknès',
    country: 'Maroc',
    flag: '🇲🇦',
    subtitle: 'Cité Ismaélienne Premium',
    lat: 33.8938,
    lng: -5.5516,
    deliveryTime: 'Expédition Sécurisée 24/48h',
    hubName: 'Hub Hamria',
    address: 'Point de retrait & livraison VIP Meknès'
  },
  {
    id: 'kenitra',
    name: 'Kénitra',
    country: 'Maroc',
    flag: '🇲🇦',
    subtitle: 'Gharb Coast VIP Reserve',
    lat: 34.2610,
    lng: -6.5802,
    deliveryTime: 'Livraison Express 24h',
    hubName: 'Hub Centre / Mehdia',
    address: 'Point de retrait & livraison VIP Kénitra'
  },
  {
    id: 'tetouan',
    name: 'Tétouan',
    country: 'Maroc',
    flag: '🇲🇦',
    subtitle: 'Colombe Blanche Selection',
    lat: 35.5889,
    lng: -5.3626,
    deliveryTime: 'Livraison Express 24/48h',
    hubName: 'Hub Ensanche / Martil',
    address: 'Point de retrait & livraison VIP Tétouan'
  },
  {
    id: 'oujda',
    name: 'Oujda',
    country: 'Maroc',
    flag: '🇲🇦',
    subtitle: 'Oriental VIP Reserve',
    lat: 34.6867,
    lng: -1.9114,
    deliveryTime: 'Expédition Sécurisée 48h',
    hubName: 'Hub Lazaret / Centre',
    address: 'Point de retrait & livraison VIP Oujda'
  },
  {
    id: 'nador',
    name: 'Nador',
    country: 'Maroc',
    flag: '🇲🇦',
    subtitle: 'Rif Coast Private Club',
    lat: 35.1681,
    lng: -2.9335,
    deliveryTime: 'Expédition Sécurisée 24/48h',
    hubName: 'Hub Marchica',
    address: 'Point de retrait & livraison VIP Nador'
  },
  {
    id: 'mohammedia',
    name: 'Mohammédia',
    country: 'Maroc',
    flag: '🇲🇦',
    subtitle: 'Cité des Fleurs VIP Reserve',
    lat: 33.6866,
    lng: -7.3829,
    deliveryTime: 'Livraison Express 24h & Meet-up',
    hubName: 'Hub Miramar / Kasbah',
    address: 'Point de retrait & livraison VIP Mohammédia'
  },
  {
    id: 'eljadida',
    name: 'El Jadida',
    country: 'Maroc',
    flag: '🇲🇦',
    subtitle: 'Mazagan Elite Selection',
    lat: 33.2316,
    lng: -8.5007,
    deliveryTime: 'Expédition Sécurisée 24/48h',
    hubName: 'Hub Mazagan / Sidi Bouzid',
    address: 'Point de retrait & livraison VIP El Jadida'
  },
  {
    id: 'safi',
    name: 'Safi',
    country: 'Maroc',
    flag: '🇲🇦',
    subtitle: 'Atlantique VIP Selection',
    lat: 32.2994,
    lng: -9.2372,
    deliveryTime: 'Expédition Sécurisée 48h',
    hubName: 'Hub Plateau / Sidi Bouzid',
    address: 'Point de retrait & livraison VIP Safi'
  },
  {
    id: 'benimellal',
    name: 'Béni Mellal',
    country: 'Maroc',
    flag: '🇲🇦',
    subtitle: 'Tadla Atlas Reserve',
    lat: 32.3394,
    lng: -6.3608,
    deliveryTime: 'Expédition Sécurisée 48h',
    hubName: 'Hub Ain Asserdoun',
    address: 'Point de retrait & livraison VIP Béni Mellal'
  },
  {
    id: 'essaouira',
    name: 'Essaouira',
    country: 'Maroc',
    flag: '🇲🇦',
    subtitle: 'Mogador Bohemian VIP',
    lat: 31.5085,
    lng: -9.7595,
    deliveryTime: 'Expédition Sécurisée 48h',
    hubName: 'Hub Medina / Dunes',
    address: 'Point de retrait & livraison VIP Essaouira'
  },
  {
    id: 'chefchaouen',
    name: 'Chefchaouen',
    country: 'Maroc',
    flag: '🇲🇦',
    subtitle: 'Cité Bleue Direct Farmz',
    lat: 35.1688,
    lng: -5.2636,
    deliveryTime: 'Livraison Directe & Drop',
    hubName: 'Hub Rif Central',
    address: 'Point de retrait & livraison VIP Chefchaouen'
  },
  {
    id: 'alhoceima',
    name: 'Al Hoceïma',
    country: 'Maroc',
    flag: '🇲🇦',
    subtitle: 'Baie du Rif Exclusive',
    lat: 35.2472,
    lng: -3.9322,
    deliveryTime: 'Expédition Sécurisée 24/48h',
    hubName: 'Hub Quemado / Cala Bonita',
    address: 'Point de retrait & livraison VIP Al Hoceïma'
  },
  {
    id: 'dakhla',
    name: 'Dakhla',
    country: 'Maroc',
    flag: '🇲🇦',
    subtitle: 'Sahara Lagoon VIP Drop',
    lat: 23.7136,
    lng: -15.9355,
    deliveryTime: 'Expédition Aérienne Sécurisée 48/72h',
    hubName: 'Hub Baie de Dakhla',
    address: 'Point de retrait & livraison VIP Dakhla'
  },
  {
    id: 'laayoune',
    name: 'Laâyoune',
    country: 'Maroc',
    flag: '🇲🇦',
    subtitle: 'Sud Atlantique Selection',
    lat: 27.1536,
    lng: -13.2033,
    deliveryTime: 'Expédition Aérienne Sécurisée 48/72h',
    hubName: 'Hub Al Massira',
    address: 'Point de retrait & livraison VIP Laâyoune'
  },
  {
    id: 'taza',
    name: 'Taza',
    country: 'Maroc',
    flag: '🇲🇦',
    subtitle: 'Porte de l\'Atlas Reserve',
    lat: 34.2139,
    lng: -4.0108,
    deliveryTime: 'Expédition Sécurisée 48h',
    hubName: 'Hub Gare / Centre',
    address: 'Point de retrait & livraison VIP Taza'
  },
  {
    id: 'settat',
    name: 'Settat',
    country: 'Maroc',
    flag: '🇲🇦',
    subtitle: 'Chaouia Central Hub',
    lat: 33.0010,
    lng: -7.6166,
    deliveryTime: 'Livraison Express 24h',
    hubName: 'Hub Chaouia VIP',
    address: 'Point de retrait & livraison VIP Settat'
  },
  {
    id: 'berrechid',
    name: 'Berrechid',
    country: 'Maroc',
    flag: '🇲🇦',
    subtitle: 'Axe Casa-Sud VIP',
    lat: 33.2655,
    lng: -7.5875,
    deliveryTime: 'Livraison Express 24h & Meet-up',
    hubName: 'Hub Berrechid Centre',
    address: 'Point de retrait & livraison VIP Berrechid'
  },
  {
    id: 'khouribga',
    name: 'Khouribga',
    country: 'Maroc',
    flag: '🇲🇦',
    subtitle: 'Phosphate Coast Reserve',
    lat: 32.8811,
    lng: -6.9063,
    deliveryTime: 'Expédition Sécurisée 48h',
    hubName: 'Hub Khouribga VIP',
    address: 'Point de retrait & livraison VIP Khouribga'
  },
  {
    id: 'larache',
    name: 'Larache',
    country: 'Maroc',
    flag: '🇲🇦',
    subtitle: 'Nord Atlantique Drop',
    lat: 35.1932,
    lng: -6.1557,
    deliveryTime: 'Livraison 24/48h',
    hubName: 'Hub Loukkos VIP',
    address: 'Point de retrait & livraison VIP Larache'
  },
  {
    id: 'ouarzazate',
    name: 'Ouarzazate',
    country: 'Maroc',
    flag: '🇲🇦',
    subtitle: 'Porte du Désert VIP',
    lat: 30.9189,
    lng: -6.8934,
    deliveryTime: 'Expédition Sécurisée 48h',
    hubName: 'Hub Atlas Studios',
    address: 'Point de retrait & livraison VIP Ouarzazate'
  },
  {
    id: 'taroudant',
    name: 'Taroudant',
    country: 'Maroc',
    flag: '🇲🇦',
    subtitle: 'Petite Marrakech Selection',
    lat: 30.4703,
    lng: -8.8770,
    deliveryTime: 'Expédition 48h',
    hubName: 'Hub Remparts VIP',
    address: 'Point de retrait & livraison VIP Taroudant'
  },
  {
    id: 'berkane',
    name: 'Berkane',
    country: 'Maroc',
    flag: '🇲🇦',
    subtitle: 'Beni Snassen Reserve',
    lat: 34.9200,
    lng: -2.3200,
    deliveryTime: 'Expédition 48h',
    hubName: 'Hub Berkane / Saïdia',
    address: 'Point de retrait & livraison VIP Berkane'
  },
  {
    id: 'guelmim',
    name: 'Guelmim',
    country: 'Maroc',
    flag: '🇲🇦',
    subtitle: 'Porte du Sahara VIP',
    lat: 28.9870,
    lng: -10.0574,
    deliveryTime: 'Expédition 48/72h',
    hubName: 'Hub Guelmim Sud',
    address: 'Point de retrait & livraison VIP Guelmim'
  },
  {
    id: 'boujdour',
    name: 'Boujdour',
    country: 'Maroc',
    flag: '🇲🇦',
    subtitle: 'Cap Bojador Sahara VIP',
    lat: 26.1264,
    lng: -14.4842,
    deliveryTime: 'Expédition Sécurisée 48/72h',
    hubName: 'Hub Littoral Boujdour',
    address: 'Point de retrait & livraison VIP Boujdour'
  },
  {
    id: 'smara',
    name: 'Es-Semara',
    country: 'Maroc',
    flag: '🇲🇦',
    subtitle: 'Cité Spirituelle du Sahara',
    lat: 26.7384,
    lng: -11.6719,
    deliveryTime: 'Expédition Sécurisée 48/72h',
    hubName: 'Hub Oasis Semara',
    address: 'Point de retrait & livraison VIP Es-Semara'
  },
  {
    id: 'lagouira',
    name: 'Lagouira / Guerguerat',
    country: 'Maroc',
    flag: '🇲🇦',
    subtitle: 'Extrême Sud Sahara Marocain',
    lat: 20.8333,
    lng: -17.0833,
    deliveryTime: 'Expédition Spéciale Sécurisée',
    hubName: 'Hub Guerguerat / Lagouira',
    address: 'Point de retrait & expédition frontière VIP Lagouira'
  },
  {
    id: 'tarfaya',
    name: 'Tarfaya',
    country: 'Maroc',
    flag: '🇲🇦',
    subtitle: 'Cap Juby Côte Atlantique Sud',
    lat: 27.9392,
    lng: -12.9264,
    deliveryTime: 'Expédition Sécurisée 48/72h',
    hubName: 'Hub Cap Juby',
    address: 'Point de retrait VIP Tarfaya'
  },
  {
    id: 'tantan',
    name: 'Tan-Tan',
    country: 'Maroc',
    flag: '🇲🇦',
    subtitle: 'Moussem & Sahara Atlantique',
    lat: 28.4380,
    lng: -11.1032,
    deliveryTime: 'Expédition Sécurisée 48/72h',
    hubName: 'Hub Tan-Tan Plage',
    address: 'Point de retrait VIP Tan-Tan'
  }
];


export function isProductInCity(product: VideoItem, cityId?: SupportedCity | string | null): boolean {
  if (!cityId) return true;
  const target = String(cityId).toLowerCase().trim();

  // Check array of cities first
  if (Array.isArray(product.cities) && product.cities.length > 0) {
    return product.cities.some((c) => String(c).toLowerCase().trim() === target);
  }

  // Check single city
  if (product.city && typeof product.city === 'string' && product.city.trim()) {
    return product.city.toLowerCase().trim() === target;
  }

  // Backwards compatibility: if product has neither cities nor city assigned yet,
  // it is visible across all cities until configured by admin
  return true;
}

export type QuantityOption = '5g' | '10g' | '25g' | '50g' | '100g' | '500g' | '1kg';
export const QUANTITY_OPTIONS: QuantityOption[] = ['5g', '10g', '25g', '50g', '100g'];
export const STANDARD_HASH_QUANTITIES: string[] = ['5G', '10G', '25G', '50G', '100G'];

export interface QuantityPricing {
  '5g'?: number;
  '10g'?: number;
  '25g'?: number;
  '50g'?: number;
  '100g'?: number;
  '500g'?: number;
  '1kg'?: number;
}


export interface VideoItem {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: 'Double Filtré' | 'Frozen Sift' | 'Beldi' | 'Sift Glacé' | string;
  city?: string;
  cities?: string[];
  displayZone?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  isPremium: boolean;
  isFeatured?: boolean;
  rating?: number;
  reviewCount?: number;
  author: string;
  views: number;
  duration?: string;
  pricePerGram?: number;
  additionalPhotos?: string[];
  colors?: { name: string; hex: string; imageUrl: string }[];
  badge?: string;
  status?: string;
  stock?: number;
  wholesalePrice?: number;
  pricing?: QuantityPricing;
}

export function getCleanAuthor(author?: string): string {
  if (!author) return 'FRESH GENETICS 💎';
  const clean = author.trim();
  if (/shelfterps|shelf\s*terps|farm(\s*of\s*friends)?|greenfarmez|elanasser|laanassar|anassar|biscotti|tricom(e|\s*labz)?|lost\s*in\s*(the\s*)?rif|house\s*of\s*rif|hashman/i.test(clean)) {
    return 'FRESH GENETICS 💎';
  }
  return clean || 'FRESH GENETICS 💎';
}

export interface CartItem {
  id: string;
  product: VideoItem;
  selectedSize: string;
  selectedQuantity?: string;
  unitPrice?: number;
  selectedColor: { name: string; hex: string; imageUrl: string };
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phoneNumber: string;
  country: string;
  city: string;
  address: string;
  zipCode: string;
  paymentMethod: 'card' | 'apple_pay' | 'paypal' | 'cod';
  items: {
    productId: string;
    productName?: string;
    title: string;
    price: number;
    totalPrice?: number;
    category: string;
    selectedSize: string;
    selectedQuantity?: string;
    selectedColor: string;
    quantity: number | string;
    packCount?: number;
  }[];
  totalAmount: number;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
  appliedPromoCode?: string;
  telegramId?: string;
  telegramUsername?: string;
}

export interface SectionTitle {
  id: string;
  text: string;
  category: string;
  size: 'S' | 'M' | 'L' | 'XL';
  color: string;
  enabled: boolean;
  order: number;
}

export interface MarqueeItem {
  id: string;
  text: string;
  active: boolean;
  order: number;
}

export interface MarqueeConfig {
  enabled: boolean;
  speed: 'slow' | 'medium' | 'fast';
  items: MarqueeItem[];
}

export const DEFAULT_MARQUEE_CONFIG: MarqueeConfig = {
  enabled: true,
  speed: 'medium',
  items: [
    { id: 'm1', text: '💎 FRESH GENETICS 💎 — SÉLECTION OFFICIELLE 💎', active: true, order: 1 },
    { id: 'm2', text: '🌐 MAES INTERNATIONAL — SÉLECTIONS D\'ÉLITE & EXTRACTIONS VIP 🌐', active: true, order: 2 },
    { id: 'm3', text: '🇲🇦 CASABLANCA • 🇲🇦 RABAT • 🇲🇦 MARRAKECH • 🇲🇦 TANGER • 🇲🇦 AGADIR • 🇲🇦 FÈS', active: true, order: 3 },
    { id: 'm4', text: '🚀 EXPÉDITION & RETRAIT SÉCURISÉ 24H/48H PARTOUT AU MAROC', active: true, order: 4 },
    { id: 'm5', text: '👑 ESPACE VIP : OFFRES RÉSERVÉES & CATALOGUE EXCLUSIF', active: true, order: 5 },
  ],
};

export interface BrandingSettings {
  appDisabled?: boolean;
  introBgUrl: string;
  mainBgUrl?: string;
  launchScreenUrl: string;
  homepageHeroBgUrl: string;
  logoUrl: string;
  bgLogoUrl?: string;
  introVideoUrl?: string;
  introStatusLine: string;
  sectionTitles?: SectionTitle[];
  marqueeConfig?: MarqueeConfig;
  customAppUrl?: string;
  adminPassword?: string;
  instagramUrl?: string;
  instagramUrl2?: string;
  telegramChannelUrl?: string;
  telegramSupportUrl?: string;
  signalUrl?: string;
  whatsappUrl?: string;
  promoMessageText?: string;
  promoButtonText?: string;
  promoButtonText2?: string;
  promoImageUrl?: string;
  bgAudioUrl?: string;
  introMusicTitle?: string;
}

export interface WhitelistItem {
  id: string;
  value: string;
  type: 'ID' | 'Username';
  notes?: string;
}

export interface PendingApproval {
  id: string;
  telegramId: string;
  username: string;
  firstName?: string;
  lastName?: string;
  date: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export function getProductGramPrice(product: VideoItem): number {
  if (typeof product.pricePerGram === 'number' && product.pricePerGram > 0) {
    return product.pricePerGram;
  }
  if (product.pricing && typeof product.pricing['5g'] === 'number' && product.pricing['5g'] > 0) {
    return Math.round((product.pricing['5g'] / 5) * 100) / 100;
  }
  if (product.pricing && typeof product.pricing['10g'] === 'number' && product.pricing['10g'] > 0) {
    return Math.round((product.pricing['10g'] / 10) * 100) / 100;
  }
  if (product.pricing && typeof product.pricing['100g'] === 'number' && product.pricing['100g'] > 0) {
    return Math.round((product.pricing['100g'] / 100) * 100) / 100;
  }
  const base = typeof product.price === 'number' ? product.price : (Number(product.price) || 12);
  if (base <= 30) return base;
  if (base <= 350) return Math.round((base / 10) * 10) / 10;
  return Math.round((base / 100) * 10) / 10;
}

export function getSizeOptionsForCategory(category?: string): string[] {
  const cat = (category || '').trim().toLowerCase();
  if (cat.includes('accessoire') || cat.includes('accessories')) {
    return ['1 unité', '2 unités', '3 unités', '5 unités', '10 unités'];
  }
  return ['5G', '10G', '25G', '50G', '100G'];
}

export function getDefaultSizeForProduct(product: VideoItem): string {
  const options = getSizeOptionsForCategory(product.category);
  return options[0] || '5G';
}

export function hasConfiguredQuantityPricing(product: VideoItem): boolean {
  if (typeof product.pricePerGram === 'number' && product.pricePerGram > 0) return true;
  if (!product.pricing || typeof product.pricing !== 'object') return false;
  return QUANTITY_OPTIONS.some((qty) => {
    const p = product.pricing?.[qty];
    return typeof p === 'number' && !isNaN(p) && p > 0;
  });
}

export function getAvailableQuantities(product: VideoItem): string[] {
  const cat = (product.category || '').trim().toLowerCase();
  if (cat.includes('accessoire') || cat.includes('accessories')) {
    return ['1 unité', '2 unités', '3 unités', '5 unités', '10 unités'];
  }
  return ['5G', '10G', '25G', '50G', '100G'];
}

export function getProductPriceForQuantity(product: VideoItem, quantity?: string | null): number {
  const gramPrice = getProductGramPrice(product);
  if (!quantity) {
    return Math.round(5 * gramPrice);
  }

  const clean = quantity.toUpperCase().replace(/\s+/g, '');
  const lowerKey = quantity.toLowerCase().replace(/\s+/g, '') as QuantityOption;

  // 1. Manuel override dans product.pricing si saisi
  if (product.pricing && typeof product.pricing === 'object') {
    if (product.pricing[lowerKey] !== undefined && typeof product.pricing[lowerKey] === 'number') {
      return product.pricing[lowerKey]!;
    }
  }

  // 2. Calcul direct et automatique : Quantité (en grammes) * Prix du gramme
  if (clean === '5G' || clean === '5') return Math.round(5 * gramPrice);
  if (clean === '10G' || clean === '10') return Math.round(10 * gramPrice);
  if (clean === '25G' || clean === '25') return Math.round(25 * gramPrice);
  if (clean === '50G' || clean === '50') return Math.round(50 * gramPrice);
  if (clean === '100G' || clean === '100') return Math.round(100 * gramPrice);

  // Unités accessoires
  if (clean.includes('UNITÉ') || clean.includes('UNITE')) {
    const qtyNum = parseInt(clean, 10) || 1;
    return Math.round(qtyNum * (product.price || 15));
  }

  return typeof product.price === 'number' ? product.price : (Number(product.price) || 0);
}

export function getProductDisplayPrice(product: VideoItem): { price: number; label?: string } {
  const gramPrice = getProductGramPrice(product);
  const start10g = Math.round(10 * gramPrice);
  return { price: start10g, label: `dès 10G (${gramPrice}€/g)` };
}

export function getPriceForSize(basePrice: number, _size?: string, _category?: string): number {
  return typeof basePrice === 'number' ? basePrice : (Number(basePrice) || 0);
}


export interface Reward {
  id: string;
  title: string;
  description: string;
  minOrders: number;
  isActive: boolean;
  promoCode?: string;
}

export interface PromoCode {
  id: string;
  code: string;
  type: 'fixed' | 'percent';
  value: number;
  maxUses?: number;
  timesUsed?: number;
  expiredAt?: string; // YYYY-MM-DD
  isActive: boolean;
}

export interface VipLevelConfig {
  name: string;
  minOrders: number;
  points: number;
  icon: string;
  badgeClass: string;
}

export const VIP_LEVELS: VipLevelConfig[] = [
  { name: 'Member', minOrders: 0, points: 0, icon: '🥉', badgeClass: 'from-orange-950/40 to-red-950/50 border-amber-700/60 text-amber-500' },
  { name: 'Silver', minOrders: 10, points: 10000, icon: '🥈', badgeClass: 'from-zinc-800/40 to-zinc-950/50 border-zinc-400 text-zinc-300' },
  { name: 'Gold', minOrders: 20, points: 20000, icon: '🥇', badgeClass: 'from-amber-950/40 to-yellow-950/50 border-amber-500 text-amber-200' },
  { name: 'Elite', minOrders: 30, points: 30000, icon: '💎', badgeClass: 'from-purple-900/40 to-indigo-950/50 border-purple-500 text-purple-200' }
];

export interface ReviewItem {
  id: string;
  telegramId: string;
  telegramUsername: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
  vipLevel?: string;
  verifiedPurchase: boolean;
  productCategory?: string;
}

export interface UserProfile {
  id: string;
  telegramId: string;
  telegramUsername: string;
  pseudo: string;
  dateJoined: string;
  totalOrders: number;
  totalSpent: number;
  points: number;
  level: string;
  unlockedRewards?: string[];
}
