import React from 'react';
import { Sparkles, Zap, Snowflake, Leaf, Flame, Droplet, Layers } from 'lucide-react';
import { VideoItem } from '../types';

export type ExtractionType =
  | 'STATIC'
  | 'WPFF'
  | 'FROZEN'
  | 'DRY_SIFT'
  | 'MOUSSE'
  | 'BELDIA'
  | 'ROSIN'
  | 'CALI'
  | 'GENERIC';

export interface ExtractionInfo {
  type: ExtractionType;
  label: string;
  badgeLabel: string;
  badgeGradient: string;
  badgeText: string;
  pillBorder: string;
  pillBg: string;
  glowShadow: string;
  accentColor: string;
  iconName: string;
}

export function getExtractionInfo(product: Partial<VideoItem>): ExtractionInfo {
  const cat = (product.category || '').toLowerCase();
  const title = (product.title || '').toLowerCase();
  const desc = (product.description || '').toLowerCase();
  const combined = `${cat} ${title} ${desc}`;

  // 1. STATIC SIFT
  if (combined.includes('static') || combined.includes('statique')) {
    return {
      type: 'STATIC',
      label: 'STATIC SIFT',
      badgeLabel: '⚡ STATIC',
      badgeGradient: 'from-amber-400 via-yellow-300 to-amber-500 text-black border-yellow-200',
      badgeText: 'text-amber-300',
      pillBorder: 'border-amber-400/50',
      pillBg: 'bg-amber-500/15 text-amber-300',
      glowShadow: 'shadow-[0_0_12px_rgba(245,158,11,0.35)]',
      accentColor: '#F59E0B',
      iconName: 'zap'
    };
  }

  // 2. WPFF (Whole Plant Fresh Frozen)
  if (combined.includes('wpff') || combined.includes('wppf') || combined.includes('fresh frozen') || combined.includes('fresh-frozen')) {
    return {
      type: 'WPFF',
      label: 'WPFF (FRESH FROZEN)',
      badgeLabel: '❄️ WPFF',
      badgeGradient: 'from-cyan-400 via-teal-300 to-cyan-500 text-black border-cyan-200',
      badgeText: 'text-cyan-300',
      pillBorder: 'border-cyan-400/50',
      pillBg: 'bg-cyan-500/15 text-cyan-300',
      glowShadow: 'shadow-[0_0_12px_rgba(6,182,212,0.35)]',
      accentColor: '#06B6D4',
      iconName: 'snowflake'
    };
  }

  // 3. FROZEN SIFT (Non-WPFF)
  if (combined.includes('frozen') || combined.includes('glacé') || combined.includes('glace')) {
    return {
      type: 'FROZEN',
      label: 'FROZEN SIFT',
      badgeLabel: '🧊 FROZEN SIFT',
      badgeGradient: 'from-sky-400 via-blue-300 to-sky-500 text-black border-sky-200',
      badgeText: 'text-sky-300',
      pillBorder: 'border-sky-400/50',
      pillBg: 'bg-sky-500/15 text-sky-300',
      glowShadow: 'shadow-[0_0_12px_rgba(14,165,233,0.35)]',
      accentColor: '#0EA5E9',
      iconName: 'snowflake'
    };
  }

  // 4. DRY SIFT (90u / Filtré)
  if (combined.includes('dry') || combined.includes('90u') || combined.includes('120u') || combined.includes('filtré') || combined.includes('filtre') || combined.includes('double')) {
    return {
      type: 'DRY_SIFT',
      label: 'DRY SIFT 90u',
      badgeLabel: '✨ DRY SIFT',
      badgeGradient: 'from-yellow-400 via-amber-300 to-yellow-500 text-black border-yellow-200',
      badgeText: 'text-yellow-300',
      pillBorder: 'border-yellow-400/50',
      pillBg: 'bg-yellow-500/15 text-yellow-300',
      glowShadow: 'shadow-[0_0_12px_rgba(234,179,8,0.35)]',
      accentColor: '#EAB308',
      iconName: 'sparkles'
    };
  }

  // 5. LA MOUSSE
  if (combined.includes('mousse')) {
    return {
      type: 'MOUSSE',
      label: 'LA MOUSSE',
      badgeLabel: '🍃 LA MOUSSE',
      badgeGradient: 'from-emerald-400 via-green-300 to-emerald-500 text-black border-emerald-200',
      badgeText: 'text-emerald-300',
      pillBorder: 'border-emerald-400/50',
      pillBg: 'bg-emerald-500/15 text-emerald-300',
      glowShadow: 'shadow-[0_0_12px_rgba(16,185,129,0.35)]',
      accentColor: '#10B981',
      iconName: 'leaf'
    };
  }

  // 6. BELDIA
  if (combined.includes('beld')) {
    return {
      type: 'BELDIA',
      label: 'BELDIA MAROC',
      badgeLabel: '🇲🇦 BELDIA',
      badgeGradient: 'from-orange-400 via-amber-400 to-orange-500 text-black border-orange-200',
      badgeText: 'text-orange-300',
      pillBorder: 'border-orange-400/50',
      pillBg: 'bg-orange-500/15 text-orange-300',
      glowShadow: 'shadow-[0_0_12px_rgba(249,115,22,0.35)]',
      accentColor: '#F97316',
      iconName: 'flame'
    };
  }

  // 7. ROSIN
  if (combined.includes('rosin')) {
    return {
      type: 'ROSIN',
      label: 'LIVE ROSIN',
      badgeLabel: '🍯 LIVE ROSIN',
      badgeGradient: 'from-purple-400 via-pink-300 to-purple-500 text-black border-purple-200',
      badgeText: 'text-purple-300',
      pillBorder: 'border-purple-400/50',
      pillBg: 'bg-purple-500/15 text-purple-300',
      glowShadow: 'shadow-[0_0_12px_rgba(168,85,247,0.35)]',
      accentColor: '#A855F7',
      iconName: 'droplet'
    };
  }

  // 8. CALI / WEED / FLEURS
  if (combined.includes('weed') || combined.includes('cali') || combined.includes('fleur') || combined.includes('flower')) {
    return {
      type: 'CALI',
      label: 'CALI WEED',
      badgeLabel: '🌿 CALI WEED',
      badgeGradient: 'from-lime-400 via-emerald-300 to-lime-500 text-black border-lime-200',
      badgeText: 'text-lime-300',
      pillBorder: 'border-lime-400/50',
      pillBg: 'bg-lime-500/15 text-lime-300',
      glowShadow: 'shadow-[0_0_12px_rgba(132,204,22,0.35)]',
      accentColor: '#84CC16',
      iconName: 'leaf'
    };
  }

  // 9. DEFAULT / GENERIC CATEGORY
  const catUpper = (product.category || 'RÉSERVE').toUpperCase();
  return {
    type: 'GENERIC',
    label: catUpper,
    badgeLabel: `💎 ${catUpper}`,
    badgeGradient: 'from-amber-400 via-yellow-300 to-amber-500 text-black border-amber-200',
    badgeText: 'text-amber-300',
    pillBorder: 'border-amber-400/40',
    pillBg: 'bg-amber-500/15 text-amber-300',
    glowShadow: 'shadow-[0_0_10px_rgba(245,158,11,0.25)]',
    accentColor: '#F59E0B',
    iconName: 'sparkles'
  };
}

interface ExtractionBadgeProps {
  product: Partial<VideoItem>;
  variant?: 'media-overlay' | 'card-tag' | 'hero-pill' | 'compact';
  className?: string;
}

export default function ExtractionBadge({
  product,
  variant = 'media-overlay',
  className = ''
}: ExtractionBadgeProps) {
  const info = getExtractionInfo(product);

  if (variant === 'media-overlay') {
    return (
      <div
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-gradient-to-r ${info.badgeGradient} border font-mono font-black text-[9px] sm:text-[10px] tracking-wider uppercase backdrop-blur-md ${info.glowShadow} ${className}`}
      >
        <span>{info.badgeLabel}</span>
      </div>
    );
  }

  if (variant === 'card-tag') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md ${info.pillBg} border ${info.pillBorder} font-mono font-bold text-[9px] sm:text-[10px] uppercase tracking-wider ${className}`}
      >
        {info.iconName === 'zap' && <Zap className="w-2.5 h-2.5 fill-current" />}
        {info.iconName === 'snowflake' && <Snowflake className="w-2.5 h-2.5" />}
        {info.iconName === 'leaf' && <Leaf className="w-2.5 h-2.5" />}
        {info.iconName === 'flame' && <Flame className="w-2.5 h-2.5" />}
        {info.iconName === 'droplet' && <Droplet className="w-2.5 h-2.5" />}
        {info.iconName === 'sparkles' && <Sparkles className="w-2.5 h-2.5" />}
        <span>{info.label}</span>
      </div>
    );
  }

  if (variant === 'hero-pill') {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full ${info.pillBg} border ${info.pillBorder} font-mono font-black text-xs uppercase tracking-widest ${info.glowShadow} ${className}`}
      >
        {info.iconName === 'zap' && <Zap className="w-3.5 h-3.5 fill-current text-amber-400" />}
        {info.iconName === 'snowflake' && <Snowflake className="w-3.5 h-3.5 text-cyan-400" />}
        {info.iconName === 'leaf' && <Leaf className="w-3.5 h-3.5 text-emerald-400" />}
        {info.iconName === 'flame' && <Flame className="w-3.5 h-3.5 text-orange-400" />}
        {info.iconName === 'droplet' && <Droplet className="w-3.5 h-3.5 text-purple-400" />}
        {info.iconName === 'sparkles' && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
        <span>{info.label}</span>
      </div>
    );
  }

  // Compact
  return (
    <span
      className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${info.pillBg} border ${info.pillBorder} ${className}`}
    >
      {info.badgeLabel}
    </span>
  );
}
