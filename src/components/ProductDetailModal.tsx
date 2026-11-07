/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ShoppingBag, 
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Award,
  ShieldCheck,
  Zap,
  Check,
  Flame
} from 'lucide-react';
import { VideoItem, getPriceForSize, getSizeOptionsForCategory, getCleanAuthor, hasConfiguredQuantityPricing, getAvailableQuantities, getProductPriceForQuantity, getProductGramPrice } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import ExtractionBadge from './ExtractionBadge';


interface ProductDetailModalProps {
  product: VideoItem;
  onClose: () => void;
  onAddToCart: (p: VideoItem, size: string, color: { name: string; hex: string; imageUrl: string }) => void;
  onInstantBuy: (p: VideoItem, size: string, color: { name: string; hex: string; imageUrl: string }) => void;
  triggerHaptic: (style: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error', customMessage?: string) => void;
}

const DEFAULT_COLORS = [
  { name: 'Noir Profond', hex: '#000000', imageUrl: '' },
  { name: 'Or Pur', hex: '#D4AF37', imageUrl: '' },
  { name: 'Ambre Élite', hex: '#9A7B1C', imageUrl: '' }
];

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onInstantBuy,
  triggerHaptic
}: ProductDetailModalProps) {
  const { t } = useLanguage();

  const hasQuantityPricing = useMemo(() => {
    return hasConfiguredQuantityPricing(product);
  }, [product]);

  const sizeOptions = useMemo(() => {
    return getAvailableQuantities(product);
  }, [product]);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const isOutOfStock = useMemo(() => {
    return product.status === 'out_of_stock' || 
           product.stock === 0 || 
           product.badge === 'OUT_OF_STOCK' || 
           product.badge === 'OUT' || 
           product.badge === 'OUT OF STOCK';
  }, [product]);

  useEffect(() => {
    // Automatically select the first available quantity
    const available = getAvailableQuantities(product);
    setSelectedSize(available.length > 0 ? available[0] : null);
  }, [product.id]);

  const computedPrice = useMemo(() => {
    const targetSize = selectedSize || sizeOptions[0];
    if (!targetSize) {
      return product.price;
    }
    return getProductPriceForQuantity(product, targetSize);
  }, [product, selectedSize, sizeOptions]);
  
  const selectedColor = useMemo(() => {
    const list = product.colors && product.colors.length > 0 ? product.colors : DEFAULT_COLORS;
    return list[0] || { name: 'Gold', hex: '#D4AF37', imageUrl: '' };
  }, [product]);

  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [imageError, setImageError] = useState<boolean>(false);
  const [mediaActiveTab, setMediaActiveTab] = useState<'photo' | 'video'>(
    product.videoUrl && product.videoUrl.trim() !== '' ? 'video' : 'photo'
  );

  useEffect(() => {
    setImageError(false);
  }, [activeSlide, product.id, mediaActiveTab]);

  const slides = useMemo(() => {
    const list: string[] = [];
    
    if (product.thumbnailUrl && product.thumbnailUrl.trim() !== '' && !product.thumbnailUrl.includes('/input_file')) {
      list.push(product.thumbnailUrl);
    }
    
    if (selectedColor && selectedColor.imageUrl && selectedColor.imageUrl.trim() !== '' && !list.includes(selectedColor.imageUrl)) {
      list.push(selectedColor.imageUrl);
    }

    if (product.additionalPhotos && product.additionalPhotos.length > 0) {
      product.additionalPhotos.forEach(urlStr => {
        if (urlStr && urlStr.trim() !== '' && !list.includes(urlStr)) {
          list.push(urlStr);
        }
      });
    }
    
    return list;
  }, [product, selectedColor]);

  const handleNextSlide = () => {
    triggerHaptic('light');
    setActiveSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handlePrevSlide = () => {
    triggerHaptic('light');
    setActiveSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/85 backdrop-blur-md overflow-hidden p-0 md:p-4 animate-fade-in"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 220 }}
        className="w-full h-[92vh] md:h-auto md:max-h-[92vh] max-w-2xl bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-white rounded-t-3xl md:rounded-3xl overflow-hidden flex flex-col md:grid md:grid-cols-2 shadow-[0_24px_50px_rgba(0,0,0,0.9)] border border-amber-500/30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON - Top right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-zinc-300 hover:bg-amber-500 hover:text-black transition duration-300 shadow-lg cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* LEFT COLUMN: VISUAL GALLERY AND MEDIA */}
        <div className="relative aspect-[4/4.5] md:aspect-auto md:h-full bg-black overflow-hidden flex flex-col justify-between">
          
          {/* Media tab selector */}
          {product.videoUrl && product.videoUrl.trim() !== '' && (
            <div className="absolute top-4 left-4 z-30 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  triggerHaptic('light');
                  setMediaActiveTab('photo');
                }}
                className={`px-3 py-1 rounded-full text-[9px] font-mono font-black tracking-wider uppercase border transition duration-300 cursor-pointer ${
                  mediaActiveTab === 'photo'
                    ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                    : 'bg-black/80 text-zinc-400 border-white/10 hover:text-white'
                }`}
              >
                📷 Photos ({slides.length})
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  triggerHaptic('light');
                  setMediaActiveTab('video');
                }}
                className={`px-3 py-1 rounded-full text-[9px] font-mono font-black tracking-wider uppercase border transition duration-300 cursor-pointer ${
                  mediaActiveTab === 'video'
                    ? 'bg-amber-400 text-black border-amber-300 font-black shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse'
                    : 'bg-black/80 text-zinc-400 border-white/10 hover:text-white'
                }`}
              >
                🎬 Vidéo HD
              </button>
            </div>
          )}

          {/* Media display */}
          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black">
            {mediaActiveTab === 'video' && product.videoUrl && product.videoUrl.trim() !== '' ? (
              <video
                src={product.videoUrl}
                className="w-full h-full object-contain bg-black"
                controls
                autoPlay
                muted
                playsInline
                loop
                referrerPolicy="no-referrer"
              />
            ) : slides.length > 0 && !imageError ? (
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeSlide}
                  src={slides[activeSlide] || undefined}
                  alt={`${product.title} view`}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full object-contain bg-black"
                  loading="eager"
                  onError={() => {
                    setImageError(true);
                  }}
                />
              </AnimatePresence>
            ) : (
              <div className="w-full h-full bg-zinc-950 flex flex-col justify-center items-center text-center p-6 select-none font-mono">
                <div className="w-12 h-12 rounded-full border border-purple-500/40 flex items-center justify-center bg-black text-purple-300 text-sm font-black mb-2 shadow-lg">
                  FG
                </div>
                <span className="text-[10px] uppercase font-black tracking-widest text-purple-300">
                  FRESH GENETICS 💎
                </span>
                <span className="text-[8px] uppercase text-zinc-400 mt-0.5">
                  BOUTIQUE OFFICIELLE
                </span>
              </div>

            )}
          </div>

          {/* Nav arrows */}
          {slides.length > 1 && (
            <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between items-center pointer-events-none z-10">
              <button
                onClick={handlePrevSlide}
                className="w-8 h-8 rounded-full bg-black/85 shadow border border-white/20 text-white pointer-events-auto flex items-center justify-center hover:bg-amber-400 hover:text-black transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextSlide}
                className="w-8 h-8 rounded-full bg-black/85 shadow border border-white/20 text-white pointer-events-auto flex items-center justify-center hover:bg-amber-400 hover:text-black transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Slide Dots */}
          {slides.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 bg-black/80 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full flex gap-1.5 items-center">
              {slides.map((_, i) => (
                <span 
                  key={i} 
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === activeSlide ? 'bg-amber-400 w-3' : 'bg-zinc-700'}`} 
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: DETAILS & ACTIONS */}
        <div className="p-5 md:p-6 flex flex-col justify-between overflow-y-auto h-full scrollbar-none bg-gradient-to-b from-zinc-950 via-zinc-900 to-black">
          <div className="space-y-4">
            
            {/* Header category badge */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <ExtractionBadge product={product} variant="hero-pill" />
                <span className="text-[10px] font-mono text-zinc-400 tracking-wider uppercase font-bold">
                  • {getCleanAuthor(product.author)}
                </span>
              </div>
              {isOutOfStock && (
                <span className="px-2.5 py-1 rounded-md bg-red-600/90 text-white font-mono text-[9px] font-black uppercase shadow">
                  RUPTURE DE STOCK
                </span>
              )}
            </div>

            {/* Product Title */}
            <div>
              <h1 className="font-sans text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                {product.title}
              </h1>

              {/* Price display & Unit Price per gram */}
              <div className="mt-3 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                    PRIX TOTAL :
                  </span>
                  {/* Gram Price Badge */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-purple-500/15 border border-purple-500/40 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                    <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
                    Prix du gramme : <strong className="text-white">{getProductGramPrice(product)} € / g</strong>
                  </span>
                </div>

                <div className="flex items-baseline gap-2.5">
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={selectedSize || 'base'}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-baseline gap-2"
                    >
                      <span className="text-3xl font-mono font-black tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        {Number(computedPrice).toFixed(2)} €
                      </span>
                      {selectedSize && (
                        <span className="text-xs font-mono font-bold text-purple-400 px-2 py-0.5 rounded-md bg-purple-950/60 border border-purple-800/40">
                          {selectedSize} • {Math.round(computedPrice / (selectedSize === '5G' ? 5 : selectedSize === '10G' ? 10 : selectedSize === '25G' ? 25 : selectedSize === '50G' ? 50 : selectedSize === '100G' ? 100 : 1))}€/g
                        </span>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5 space-y-1">
              <span className="text-[9px] font-mono uppercase text-zinc-400 tracking-wider block">
                CARACTÉRISTIQUES & PROFIL
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                {product.description || 'Extraction de premier choix, arômes intenses et pureté irréprochable.'}
              </p>
            </div>

            {/* User's Exact Quantity Selection Panel (Replicating reference photo) */}
            <div className="relative rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#2D0D35]/85 via-[#1C0926]/90 to-[#2A0E34]/85 border border-purple-500/30 shadow-[0_0_35px_rgba(168,85,247,0.18)] overflow-hidden">
              
              {/* Header: • SÉLECTIONNEZ UNE QUANTITÉ */}
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E879F9] shadow-[0_0_10px_#E879F9]" />
                <span className="text-xs sm:text-[13px] font-sans font-black tracking-[0.25em] text-[#F3E8FF] uppercase">
                  SÉLECTIONNEZ UNE QUANTITÉ
                </span>
              </div>

              {/* Quantities Grid (3 on top row: 5G, 10G, 25G | 2 on bottom row: 50G, 100G) */}
              <div className="grid grid-cols-3 gap-3">
                {sizeOptions.map((sz) => {
                  const isSelected = selectedSize === sz;
                  const optionPrice = getProductPriceForQuantity(product, sz);
                  const formattedPrice = `${Number(optionPrice).toFixed(2)}€`;

                  return (
                    <button
                      key={sz}
                      type="button"
                      disabled={isOutOfStock}
                      onClick={() => {
                        if (isOutOfStock) return;
                        triggerHaptic('medium');
                        setSelectedSize(sz);
                      }}
                      className={`relative rounded-2xl py-3.5 px-2 text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center select-none active:scale-95 ${
                        isOutOfStock
                          ? 'bg-[#180A22]/50 border border-white/5 opacity-40 cursor-not-allowed'
                          : isSelected
                          ? 'bg-[#48165F]/55 border-2 border-[#D946EF] shadow-[0_0_20px_rgba(217,70,239,0.45)]'
                          : 'bg-[#261234]/40 hover:bg-[#321743]/50 border border-purple-400/15 hover:border-purple-400/30'
                      }`}
                    >
                      {/* Weight label (5G, 10G, 25G, 50G, 100G) */}
                      <span className={`text-xs sm:text-sm font-bold tracking-wide uppercase mb-1 transition ${
                        isSelected ? 'text-white' : 'text-purple-200/90'
                      }`}>
                        {sz}
                      </span>

                      {/* Formatted Price (e.g. 80.00€, 160.00€) */}
                      <span className="text-sm sm:text-lg font-black tracking-tight text-white">
                        {formattedPrice}
                      </span>

                      {/* Checkmark badge on selected (White circle with dark check on top-right) */}
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white text-black flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                          <Check className="w-3.5 h-3.5 stroke-[3.5] text-black" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>


            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-white/5 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-[9px] font-mono text-zinc-300 uppercase leading-tight font-medium">
                  Qualité Certifiée
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-white/5 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[9px] font-mono text-zinc-300 uppercase leading-tight font-medium">
                  Envoi Discret 24/48H
                </span>
              </div>
            </div>

          </div>

          {/* ACTION BUTTONS */}
          <div className="space-y-2.5 pt-6">
            {isOutOfStock ? (
              <button
                disabled
                className="w-full py-3.5 rounded-2xl bg-zinc-900 border border-white/10 text-zinc-500 cursor-not-allowed flex items-center justify-center gap-2 font-mono text-xs uppercase font-bold"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>PRODUIT ÉPUISÉ</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    if (!selectedSize) {
                      triggerHaptic('warning');
                      return;
                    }
                    triggerHaptic('success');
                    onAddToCart(product, selectedSize, selectedColor);
                  }}
                  className={`w-full py-3.5 rounded-2xl font-mono text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    selectedSize 
                      ? 'border border-amber-400/50 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                      : 'border border-white/10 bg-zinc-900/50 text-zinc-500'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{selectedSize ? `AJOUTER AU PANIER • ${computedPrice}€` : 'SÉLECTIONNEZ UN FORMAT'}</span>
                </button>

                <button
                  onClick={() => {
                    if (!selectedSize) {
                      triggerHaptic('warning');
                      return;
                    }
                    triggerHaptic('heavy');
                    onInstantBuy(product, selectedSize, selectedColor);
                  }}
                  className={`w-full py-3.5 rounded-2xl font-mono text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                    selectedSize 
                      ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-black hover:opacity-90 shadow-[0_0_20px_rgba(245,158,11,0.4)]' 
                      : 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-white/5'
                  }`}
                >
                  <Zap className="w-4 h-4 fill-black" />
                  <span>ACHAT EXPRESS ⚡</span>
                </button>
              </>
            )}
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}
