import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Heart,
  ArrowRight,
  ShoppingBag,
  Flame,
  ChevronDown,
  Play,
  ShieldCheck,
  Check,
  TrendingUp,
  Search
} from 'lucide-react';
import { VideoItem, BrandingSettings, getCleanAuthor, SupportedCity, isProductInCity, getProductDisplayPrice } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import ProductCardMedia from './ProductCardMedia';
import ExtractionBadge from './ExtractionBadge';
import CitySelector from './CitySelector';
import CityMenu from './CityMenu';

interface HomeViewProps {
  branding: BrandingSettings | null;
  tgUser?: any;
  products: VideoItem[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  favorites?: string[];
  onToggleFavorite?: (id: string) => void;
  onSelectProduct: (p: VideoItem) => void;
  onQuickAddToCart?: (p: VideoItem) => void;
  onNavigateTab: (tab: 'catalog' | 'categories' | 'contact' | 'info' | 'reviews' | 'profile' | 'favorites') => void;
  triggerHaptic: (style: 'light' | 'medium' | 'heavy') => void;
  showToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
  selectedCity: SupportedCity | null;
  onSelectCity: (city: SupportedCity) => void;
  onClearCity: () => void;
}

interface CategoryTab {
  id: string;
  label: string;
  query: string;
  icon?: any;
  emoji?: string;
}

const DEFAULT_HERO_VISUAL = '/the_hashman_shop_welcome.jpg';
const FALLBACK_LOGO = '/logo.png';


export default function HomeView({
  branding,
  tgUser,
  products,
  selectedCategory,
  setSelectedCategory,
  favorites = [],
  onToggleFavorite,
  onSelectProduct,
  onQuickAddToCart,
  onNavigateTab,
  triggerHaptic,
  showToast,
  selectedCity,
  onSelectCity,
  onClearCity
}: HomeViewProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract Telegram user first name dynamically
  const userFirstName = useMemo(() => {
    if (tgUser?.first_name && tgUser.first_name.trim()) {
      return tgUser.first_name.trim();
    }
    if (tgUser?.username && tgUser.username.trim()) {
      return tgUser.username.trim();
    }
    return 'VIP';
  }, [tgUser]);

  const userInitial = (userFirstName || 'Y').charAt(0).toUpperCase();

  // Determine Hero image source
  const heroImageUrl = useMemo(() => {
    return (
      branding?.homepageHeroBgUrl ||
      branding?.introBgUrl ||
      branding?.launchScreenUrl ||
      DEFAULT_HERO_VISUAL
    );
  }, [branding]);

  // Products list for display: all products directly available by default ("comme au début simple")
  const displayProducts = useMemo(() => {
    if (!products) return [];
    if (!selectedCity) return products;
    const filtered = products.filter((p) => isProductInCity(p, selectedCity));
    return filtered.length > 0 ? filtered : products;
  }, [products, selectedCity]);

  // Luxury Category Tabs with refined icons/emojis (based on inventory)
  const categoryTabs = useMemo<CategoryTab[]>(() => {
    const baseTabs: CategoryTab[] = [
      { id: 'all', label: 'TOUS', query: 'Tous', icon: Sparkles },
      { id: 'frozensift', label: 'FRESH FROZEN', query: 'Frozen', emoji: '🧊' },
      { id: 'wppf', label: 'WPPF', query: 'WPFF', emoji: '🧈' },
      { id: 'static', label: 'STATIC', query: 'Static', emoji: '🧤' },
      { id: 'drysift', label: 'DRYSIFT 90U', query: 'Dry Sift', emoji: '🍯' },
      { id: 'beldia', label: 'BELDIA', query: 'Beldia', emoji: '🇲🇦' },
      { id: 'mousse', label: 'LA MOUSSE', query: 'La Mousse', emoji: '🫧' }
    ];

    const knownIds = new Set(['all', 'drysift', 'frozensift', 'static', 'wppf', 'beldia', 'mousse']);

    (displayProducts || []).forEach((p) => {
      if (p.category && p.category.trim()) {
        const cTrim = p.category.trim();
        const cLower = cTrim.toLowerCase();
        
        const isKnown =
          cLower.includes('mousse') ||
          cLower.includes('dry') ||
          cLower.includes('sift') ||
          cLower.includes('frozen') ||
          cLower.includes('fresh') ||
          cLower.includes('wppf') ||
          cLower.includes('wpff') ||
          cLower.includes('static') ||
          cLower.includes('beld') ||
          cLower.includes('rabat') ||
          cLower.includes('meet up');

        if (!isKnown && !knownIds.has(cLower)) {
          knownIds.add(cLower);
          baseTabs.push({
            id: cLower,
            label: cTrim.toUpperCase(),
            query: cTrim,
            emoji: '🏷️'
          });
        }
      }
    });

    return baseTabs;
  }, [displayProducts]);

  // Filter products by selected category and search query
  const filteredProducts = useMemo(() => {
    if (!displayProducts) return [];
    const sel = (selectedCategory || 'Tous').toLowerCase().trim();
    const query = searchQuery.toLowerCase().trim();

    return displayProducts.filter((p) => {
      const cat = (p.category || '').toLowerCase().trim();

      // Category matching logic
      let matchesCat = false;
      if (sel === 'tous' || sel === 'all' || !sel) {
        matchesCat = true;
      } else if (sel === 'la mousse' || sel === 'mousse' || sel.includes('mousse')) {
        matchesCat = cat.includes('mousse');
      } else if (sel === 'dry sift' || sel.includes('dry') || sel.includes('90u')) {
        matchesCat = cat.includes('dry') || cat.includes('sift');
      } else if (sel === 'frozen' || sel.includes('frozen') || sel.includes('fresh')) {
        matchesCat = cat.includes('frozen') || cat.includes('fresh');
      } else if (sel === 'wpff' || sel.includes('wpff') || sel.includes('wppf')) {
        matchesCat = cat.includes('wpff') || cat.includes('wppf');
      } else if (sel === 'static' || sel.includes('static')) {
        matchesCat = cat.includes('static');
      } else if (sel === 'beldia' || sel.includes('beld')) {
        matchesCat = cat.includes('beld');
      } else {
        matchesCat = cat.includes(sel) || sel.includes(cat);
      }

      // Search matching logic
      const matchesSearch =
        !query ||
        (p.title || '').toLowerCase().includes(query) ||
        (p.description || '').toLowerCase().includes(query) ||
        (p.category || '').toLowerCase().includes(query);

      return matchesCat && matchesSearch;
    });
  }, [displayProducts, selectedCategory, searchQuery]);

  const activeTabId = useMemo(() => {
    const sel = (selectedCategory || 'Tous').toLowerCase().trim();
    if (sel === 'tous' || sel === 'all') return 'all';
    if (sel.includes('mousse')) return 'mousse';
    if (sel.includes('dry') || sel.includes('90u')) return 'drysift';
    if (sel.includes('frozen') || sel.includes('fresh')) return 'frozensift';
    if (sel.includes('wpff') || sel.includes('wppf')) return 'wppf';
    if (sel.includes('static')) return 'static';
    if (sel.includes('beld')) return 'beldia';
    return sel;
  }, [selectedCategory]);

  const scrollToCatalog = () => {
    triggerHaptic('medium');
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-4 pb-28 pt-1 px-3 sm:px-4 max-w-2xl mx-auto" id="home-view">
      
      {/* 1. HERO BANNER - PURE PHOTO (PIRATE 69 LUXURY BENCHMARK) */}
      <div className="relative w-full overflow-hidden rounded-3xl border border-amber-500/30 bg-black shadow-[0_12px_45px_rgba(0,0,0,0.85)]">
        <div className="relative aspect-[16/10] sm:aspect-[16/8] w-full overflow-hidden flex items-center justify-center bg-black">
          <img
            src={heroImageUrl}
            alt="FRESH GENETICS 💎"

            className="w-full h-full object-cover object-center"
            loading="eager"
            onError={(e) => {
              if ((e.currentTarget as HTMLImageElement).src !== FALLBACK_LOGO) {
                (e.currentTarget as HTMLImageElement).src = FALLBACK_LOGO;
              }
            }}
          />
        </div>
      </div>

      {/* 2. USER WELCOME CARD (BIENVENUE TELEGRAM) */}
      <motion.div 
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-black border border-white/10 shadow-lg flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          {/* Avatar initial circle */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border border-amber-400 flex items-center justify-center font-mono font-black text-black text-base shadow-[0_0_12px_rgba(245,158,11,0.4)]">
            {userInitial}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold tracking-wider">
                BIENVENUE
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-white">
              {userFirstName}
            </h3>
          </div>
        </div>

        {/* Quick VIP Rank Chip */}
        <div 
          onClick={() => onNavigateTab('profile')}
          className="flex flex-col items-end cursor-pointer group"
        >
          <span className="text-[9px] font-mono text-zinc-400 group-hover:text-amber-300 transition">
            STATUT MEMBRE
          </span>
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[10px] font-mono font-black uppercase">
            VIP ELITE 💎
          </span>
        </div>
      </motion.div>

      {/* 3. DIRECT CATALOG VIEW — SIMPLE & SANS BLOCAGE AU PREMIER */}
      <div className="space-y-4">
        {/* Category Tabs (Horizontal smooth slider) */}
        <div className="relative -mx-3 sm:-mx-4 px-3 sm:px-4 pt-1" id="catalog-section">
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar scroll-smooth">
              {categoryTabs.map((tab) => {
                const Icon = tab.icon;
                const isSelected =
                  tab.id === 'all'
                    ? selectedCategory === 'Tous' || selectedCategory === 'All' || !selectedCategory
                    : activeTabId === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      triggerHaptic('medium');
                      setSelectedCategory(tab.query);
                    }}
                    className={`relative flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-mono text-xs font-black tracking-wider uppercase whitespace-nowrap transition-all duration-300 cursor-pointer shrink-0 border ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500/25 via-yellow-500/20 to-amber-600/25 text-[#f3e8c8] border-[#e5c158]/80 shadow-[0_0_18px_rgba(229,193,88,0.3)] ring-1 ring-[#e5c158]/40'
                        : 'bg-zinc-900/80 hover:bg-zinc-800/90 text-zinc-400 hover:text-zinc-200 border-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    {Icon ? (
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#f3e8c8] animate-pulse' : 'text-zinc-400'}`} />
                    ) : tab.emoji ? (
                      <span className="text-xs">{tab.emoji}</span>
                    ) : null}

                    <span>{tab.label}</span>

                    {isSelected && (
                      <motion.div
                        layoutId="activeCategoryIndicator"
                        className="absolute inset-0 rounded-xl border border-[#e5c158]/80 pointer-events-none"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Catalogue Titre & Compteur */}
          <div className="pt-2 pb-1 flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <h2 className="text-sm sm:text-base font-black tracking-wider uppercase bg-gradient-to-r from-[#f8f5ee] via-[#e5c158] to-[#d4af37] bg-clip-text text-transparent drop-shadow-[0_1px_8px_rgba(229,193,88,0.25)]">
                {selectedCategory === 'Tous' || !selectedCategory ? 'TOUS LES PRODUITS' : selectedCategory.toUpperCase()}
              </h2>

              <div className="h-3 w-px bg-white/15" />

              <span className="text-[11px] font-mono text-zinc-400 font-medium tracking-tight">
                {filteredProducts.length} référence{filteredProducts.length > 1 ? 's' : ''}
              </span>
            </div>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[11px] font-mono text-amber-300/90 hover:text-amber-200 hover:underline transition"
              >
                Effacer
              </button>
            )}
          </div>

      {/* 5. GRILLE DE PRODUITS LUXE (2 PAR LIGNE SUR MOBILE) */}
      {filteredProducts.length === 0 ? (
        <div className="py-14 text-center space-y-3 bg-zinc-950/70 rounded-2xl sm:rounded-3xl border border-dashed border-white/10 px-4 backdrop-blur-xl">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <p className="text-sm font-black font-sans uppercase tracking-wider text-white">
            Aucun produit dans cette catégorie
          </p>
          <p className="text-xs text-zinc-400 font-mono">
            Sélectionnez une autre catégorie ou réinitialisez le filtre.
          </p>
          <button
            onClick={() => {
              triggerHaptic('light');
              setSelectedCategory('Tous');
              setSearchQuery('');
            }}
            className="mt-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition"
          >
            Voir tout le catalogue
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
          {filteredProducts.map((product) => {
            const isFav = favorites.includes(product.id);
            const isOutOfStock =
              product.status === 'out_of_stock' ||
              product.stock === 0 ||
              product.badge === 'OUT_OF_STOCK' ||
              product.badge === 'OUT';

            const hasVideo = Boolean(product.videoUrl && product.videoUrl.trim() !== '');

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-gradient-to-b from-zinc-900/95 via-zinc-950/90 to-black border border-white/10 hover:border-amber-500/40 transition-all duration-300 overflow-hidden shadow-[0_8px_25px_rgba(0,0,0,0.6)] cursor-pointer"
                onClick={() => {
                  triggerHaptic('light');
                  onSelectProduct(product);
                }}
              >
                {/* Media Container with 1:1 square ratio */}
                <div className="relative aspect-square w-full overflow-hidden bg-black">
                  <ProductCardMedia
                    product={product}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Top Overlay Badges */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
                    
                    {/* Category / Extraction Badge */}
                    <div className="flex items-center gap-1">
                      <ExtractionBadge product={product} variant="media-overlay" />

                      {isOutOfStock ? (
                        <span className="px-2 py-0.5 rounded-lg bg-red-600/95 backdrop-blur-md text-white font-mono text-[8px] sm:text-[9px] font-black uppercase border border-red-400 shadow">
                          ÉPUISÉ
                        </span>
                      ) : (
                        product.badge &&
                        product.badge !== 'IN_STOCK' &&
                        product.badge !== 'NONE' && (
                          <span className="px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-md text-amber-300 font-mono text-[8px] sm:text-[9px] font-black uppercase border border-amber-400/40 shadow">
                            {product.badge}
                          </span>
                        )
                      )}
                    </div>

                    {/* Favorite Toggle Button */}
                    {onToggleFavorite && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerHaptic('light');
                          onToggleFavorite(product.id);
                        }}
                        className="pointer-events-auto p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:text-red-400 hover:scale-110 active:scale-90 transition cursor-pointer"
                        title="Favori"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                      </button>
                    )}
                  </div>

                  {/* Video Indicator */}
                  {hasVideo && (
                    <div className="absolute bottom-2 left-2 z-10 pointer-events-none flex items-center gap-1 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-md border border-amber-500/30 text-[8px] font-mono font-bold text-amber-300 shadow">
                      <Play className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      <span>VIDÉO</span>
                    </div>
                  )}
                </div>

                {/* Card Content Information */}
                <div className="p-3 sm:p-4 flex flex-col justify-between flex-1 space-y-2">
                  <div className="space-y-1.5">
                    {/* Extraction Method Tag */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <ExtractionBadge product={product} variant="card-tag" />
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-tight truncate max-w-[140px]">
                        • {getCleanAuthor(product.author)}
                      </span>
                    </div>

                    <h3 className="font-sans font-black text-xs sm:text-sm text-white line-clamp-1 group-hover:text-amber-300 transition">
                      {product.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-zinc-400 line-clamp-1 font-sans">
                      {product.description || 'Extraction artisanale exclusive.'}
                    </p>
                  </div>

                  {/* Price & Quick Add Button */}
                  <div className="pt-1 flex items-center justify-between border-t border-white/[0.08]">
                    {(() => {
                      const display = getProductDisplayPrice(product);
                      return (
                        <div className="flex flex-col">
                          <span className="text-[9px] font-mono text-zinc-400 uppercase">
                            {display.label ? display.label : 'À partir de'}
                          </span>
                          <span className="text-xs sm:text-sm font-mono font-black text-amber-300">
                            {display.price} {product.currency || '€'}
                          </span>
                        </div>
                      );
                    })()}

                    {/* Quick Add To Cart Button */}
                    {onQuickAddToCart && !isOutOfStock && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerHaptic('medium');
                          onQuickAddToCart(product);
                          if (showToast) {
                            showToast(`"${product.title}" ajouté au panier !`, 'success');
                          }
                        }}
                        className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-black transition shadow-[0_0_10px_rgba(245,158,11,0.3)] cursor-pointer"
                        title="Ajouter au panier"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Bottom Switch City Action */}
      {selectedCity && (
        <div className="pt-6 pb-2 text-center">
          <button
            onClick={() => {
              triggerHaptic('medium');
              onClearCity();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 hover:border-amber-400/40 text-xs font-mono text-zinc-300 hover:text-white transition cursor-pointer"
          >
            <span>← Changer de ville (Actuel : {selectedCity.toUpperCase()})</span>
          </button>
        </div>
      )}
    </div>
  </div>
  );
}
