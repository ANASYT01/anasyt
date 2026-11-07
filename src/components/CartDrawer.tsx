/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  ShieldCheck, 
  MapPin, 
  Phone, 
  User, 
  Truck, 
  Mail, 
  MapPinned, 
  Copy, 
  Check, 
  Send,
  Package,
  Lock,
  Building2,
  Tag,
  Plus,
  Minus,
  ArrowRight,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { CartItem, Order, getPriceForSize } from '../types';
import { createOrder, validatePromoCode } from '../db';
import { useLanguage } from '../i18n/LanguageContext';

interface CartDrawerProps {
  cart: CartItem[];
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onClose: () => void;
  onCheckoutSuccess: (method: string, amount: number, itemTitles: string[]) => void;
  triggerHaptic: (style: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error', customMessage?: string) => void;
  telegramId?: string;
  telegramUsername?: string;
}

export default function CartDrawer({
  cart,
  onRemoveItem,
  onClearCart,
  onClose,
  onCheckoutSuccess,
  triggerHaptic,
  telegramId,
  telegramUsername
}: CartDrawerProps) {
  const { t } = useLanguage();
  
  // Step navigation: 'cart' -> 'shipping' -> 'success'
  const [step, setStep] = useState<'cart' | 'shipping' | 'success'>('cart');
  
  // Delivery Method Selection (PIRATE 69 modern cards)
  const [deliveryMethod, setDeliveryMethod] = useState<'home' | 'relais' | 'locker'>('home');

  // Customer Shipping Information
  const [customerName, setCustomerName] = useState<string>('');
  const [emailAddress, setEmailAddress] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [country, setCountry] = useState<string>('Maroc');
  const [city, setCity] = useState<string>('Casablanca');
  const [zipCode, setZipCode] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [deliveryNotes, setDeliveryNotes] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'disposition'>('crypto');

  // Promo code states
  const [promoCodeInput, setPromoCodeInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<any | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState<boolean>(false);
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const [validationError, setValidationError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Prepopulate customer details from Telegram WebApp
  useEffect(() => {
    try {
      const tg = (window as any).Telegram?.WebApp;
      if (tg?.initDataUnsafe?.user) {
        const user = tg.initDataUnsafe.user;
        const nameVal = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username || `VIP_${user.id}`;
        setCustomerName(nameVal);
        setEmailAddress(user.username ? `@${user.username}` : `client_${user.id}@telegram.org`);
      } else {
        setCustomerName('Client VIP');
        setEmailAddress('client@reserve-privee.vip');
      }
    } catch {
      setCustomerName('Client VIP');
      setEmailAddress('client@reserve-privee.vip');
    }
  }, []);

  // Calculate pricing total
  const pricingTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [cart]);

  // Calculate discount amount
  const discountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo.type === 'percent') {
      return Math.round((pricingTotal * appliedPromo.value) / 100);
    } else {
      return Math.min(appliedPromo.value, pricingTotal);
    }
  }, [appliedPromo, pricingTotal]);

  const finalTotalToPay = useMemo(() => {
    return Math.max(0, pricingTotal - discountAmount);
  }, [pricingTotal, discountAmount]);

  const handleApplyPromoCode = async () => {
    if (!promoCodeInput.trim()) return;
    setIsApplyingPromo(true);
    setPromoMessage(null);
    triggerHaptic('light');

    try {
      const formatted = promoCodeInput.trim().toUpperCase();
      const res = await validatePromoCode(formatted, pricingTotal, telegramId);
      if (res.valid) {
        setAppliedPromo({
          code: res.code || formatted,
          type: res.type,
          value: res.value
        });
        setPromoMessage({ text: `Code ${res.code || formatted} validé (-${res.type === 'percent' ? `${res.value}%` : `${res.value}€`})`, isError: false });
        triggerHaptic('success');
      } else {
        setAppliedPromo(null);
        setPromoMessage({ text: res.error || 'Code promo invalide', isError: true });
        triggerHaptic('error');
      }
    } catch {
      setPromoMessage({ text: 'Erreur de vérification du code', isError: true });
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    triggerHaptic('medium');
    setStep('shipping');
  };

  const handleConfirmOrder = async () => {
    if (!customerName.trim()) {
      setValidationError('Veuillez renseigner votre nom / pseudo.');
      triggerHaptic('error');
      return;
    }
    if (!phoneNumber.trim() && !emailAddress.trim()) {
      setValidationError('Veuillez renseigner un moyen de contact (Telegram ou Téléphone).');
      triggerHaptic('error');
      return;
    }
    if (!address.trim() && deliveryMethod === 'home') {
      setValidationError('Veuillez indiquer votre adresse de livraison.');
      triggerHaptic('error');
      return;
    }
    if (!city.trim()) {
      setValidationError('Veuillez indiquer la ville.');
      triggerHaptic('error');
      return;
    }

    setValidationError('');
    setIsSubmitting(true);
    triggerHaptic('heavy');

    const methodLabels: Record<string, string> = {
      home: 'Livraison Domicile Discrète',
      relais: 'Point Relais Express',
      locker: 'Locker 24/7 Consigne'
    };

    const newOrder: Order = {
      id: `SHELF-${Date.now().toString().slice(-6)}`,
      customerName: customerName.trim(),
      email: emailAddress.trim(),
      phoneNumber: phoneNumber.trim() || 'Non renseigné',
      country: country.trim(),
      city: city.trim(),
      address: `${methodLabels[deliveryMethod] || 'Livraison'} : ${address.trim() || city.trim()} ${deliveryNotes ? `(${deliveryNotes})` : ''}`,
      zipCode: zipCode.trim() || '00000',
      paymentMethod: paymentMethod === 'crypto' ? 'card' : 'cod',
      items: cart.map(item => {
        const unitPrice = item.unitPrice || (item.totalPrice / (item.quantity || 1));
        const selectedQty = item.selectedQuantity || item.selectedSize;
        return {
          productId: item.product.id,
          productName: item.product.title,
          title: item.product.title,
          price: unitPrice,
          totalPrice: item.totalPrice,
          category: item.product.category,
          selectedSize: selectedQty,
          selectedQuantity: selectedQty,
          quantity: selectedQty,
          packCount: item.quantity,
          selectedColor: item.selectedColor.name
        };
      }),
      totalAmount: finalTotalToPay,
      date: new Date().toISOString(),
      status: 'pending',
      appliedPromoCode: appliedPromo?.code,
      telegramId: telegramId || 'web_user',
      telegramUsername: telegramUsername || customerName
    };

    try {
      await createOrder(newOrder);
      setCreatedOrder(newOrder);
      setStep('success');
      triggerHaptic('success');
      onCheckoutSuccess(paymentMethod, finalTotalToPay, cart.map(c => c.product.title));
    } catch {
      // In case of network glitch, fallback cleanly
      setCreatedOrder(newOrder);
      setStep('success');
      triggerHaptic('success');
      onCheckoutSuccess(paymentMethod, finalTotalToPay, cart.map(c => c.product.title));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyOrderSummary = () => {
    if (!createdOrder) return;
    triggerHaptic('light');
    const itemsList = createdOrder.items.map(i => {
      const qtyLabel = i.selectedQuantity || i.selectedSize || i.quantity;
      const count = i.packCount || 1;
      return `• ${i.title} (${qtyLabel}) ${count > 1 ? `x${count} ` : ''}= ${i.totalPrice || (i.price * count)}€`;
    }).join('\n');
    const text = `🛍️ COMMANDE FRESH GENETICS 💎\nID: #${createdOrder.id}\nClient: ${createdOrder.customerName}\nContact: ${createdOrder.phoneNumber || createdOrder.email}\nLivraison: ${createdOrder.address}\n\nArticles:\n${itemsList}\n\nTotal: ${createdOrder.totalAmount}€\nStatut: En attente de validation`;

    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end select-none">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => {
          triggerHaptic('light');
          onClose();
        }}
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Drawer Container */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="relative w-full max-w-lg h-full bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-white border-l border-amber-500/30 flex flex-col justify-between shadow-[0_0_50px_rgba(0,0,0,0.95)] z-10 overflow-hidden"
      >
        {/* TOP DRAWER HEADER */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/50 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            {step === 'shipping' && (
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setStep('cart');
                }}
                className="p-1.5 rounded-full bg-zinc-800 text-zinc-300 hover:text-white transition cursor-pointer"
                title="Retour au panier"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <ShoppingBag className="w-4 h-4" />
            </div>

            <div>
              <h2 className="font-mono text-sm font-black tracking-wider uppercase text-white flex items-center gap-1.5">
                {step === 'cart' && 'MON PANIER'}
                {step === 'shipping' && 'LIVRAISON & COMMANDE'}
                {step === 'success' && 'COMMANDE CONFIRMÉE'}
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              </h2>
              <span className="text-[10px] font-mono text-zinc-400">
                FRESH GENETICS 💎 • SÉLECTION OFFICIELLE
              </span>

            </div>
          </div>

          <div className="flex items-center gap-2">
            {step === 'cart' && cart.length > 0 && (
              <button
                onClick={() => {
                  triggerHaptic('medium');
                  onClearCart();
                }}
                className="text-[10px] font-mono text-red-400 hover:text-red-300 px-2 py-1 rounded bg-red-950/40 border border-red-500/20 transition cursor-pointer"
              >
                Vider
              </button>
            )}

            <button
              onClick={() => {
                triggerHaptic('light');
                onClose();
              }}
              className="p-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* DRAWER BODY: STEP CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 no-scrollbar">
          
          {/* STEP 1: CART ITEMS LIST */}
          {step === 'cart' && (
            <>
              {cart.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto text-zinc-500">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-mono text-base font-black uppercase text-white">
                      Votre panier est vide
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono">
                      Découvrez nos extractions et ajoutes vos sélections.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      triggerHaptic('light');
                      onClose();
                    }}
                    className="px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                  >
                    Explorer la réserve
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-2xl bg-zinc-900/90 border border-white/10 flex items-center justify-between gap-3 shadow-md"
                    >
                      {/* Thumbnail */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-black shrink-0 border border-white/10">
                        <img
                          src={item.product.thumbnailUrl || item.product.imageUrl || '/the_hashman_shop_welcome.jpg'}

                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <h4 className="font-sans font-bold text-xs text-white truncate">
                          {item.product.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                          <span className="px-1.5 py-0.5 rounded bg-black/60 border border-amber-400/30 text-amber-300 font-bold">
                            {item.selectedQuantity || item.selectedSize}
                          </span>
                          <span>{item.product.category}</span>
                        </div>
                        <div className="text-xs font-mono font-black text-amber-300">
                          {item.totalPrice} €
                          {item.quantity > 1 && (
                            <span className="text-[9px] text-zinc-400 font-normal ml-1">
                              ({item.unitPrice || Math.round(item.totalPrice / item.quantity)} € / u)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity & Delete */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            triggerHaptic('light');
                            onRemoveItem(item.id);
                          }}
                          className="p-2 rounded-xl bg-red-950/40 text-red-400 hover:bg-red-900/60 border border-red-500/20 transition cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}

                  {/* PROMO CODE SECTION */}
                  <div className="pt-2">
                    <div className="p-3 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-amber-300 font-bold">
                        <Tag className="w-3 h-3 text-amber-400" />
                        <span>Code Promo & Remise VIP</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={promoCodeInput}
                          onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                          placeholder="EX: VIP2026, SHELF10..."
                          className="flex-1 px-3 py-2 rounded-xl bg-black border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-amber-400 placeholder:text-zinc-600 uppercase"
                        />
                        <button
                          onClick={handleApplyPromoCode}
                          disabled={isApplyingPromo || !promoCodeInput.trim()}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-mono font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                        >
                          {isApplyingPromo ? '...' : 'Appliquer'}
                        </button>
                      </div>

                      {promoMessage && (
                        <p className={`text-[10px] font-mono ${promoMessage.isError ? 'text-red-400' : 'text-emerald-400'}`}>
                          {promoMessage.text}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* SUMMARY BREAKDOWN */}
                  <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2 font-mono text-xs">
                    <div className="flex justify-between text-zinc-400">
                      <span>Sous-total</span>
                      <span>{pricingTotal} €</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-400 font-bold">
                        <span>Réduction ({appliedPromo?.code})</span>
                        <span>-{discountAmount} €</span>
                      </div>
                    )}

                    <div className="flex justify-between text-zinc-400">
                      <span>Livraison Express Discrète</span>
                      <span className="text-emerald-400 font-bold">OFFERTE 🎁</span>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-black text-white">
                      <span>Total à régler</span>
                      <span className="text-amber-300 text-base">{finalTotalToPay} €</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* STEP 2: SHIPPING & CHECKOUT FORM */}
          {step === 'shipping' && (
            <div className="space-y-4">
              
              {/* Delivery method selector cards (PIRATE 69 style) */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-bold block">
                  1. MODE DE LIVRAISON SÉCURISÉ :
                </label>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setDeliveryMethod('home');
                    }}
                    className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                      deliveryMethod === 'home'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                        : 'bg-zinc-900/80 border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span className="text-[10px] font-mono font-bold uppercase leading-tight">
                      Domicile
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setDeliveryMethod('relais');
                    }}
                    className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                      deliveryMethod === 'relais'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                        : 'bg-zinc-900/80 border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span className="text-[10px] font-mono font-bold uppercase leading-tight">
                      Point Relais
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setDeliveryMethod('locker');
                    }}
                    className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                      deliveryMethod === 'locker'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                        : 'bg-zinc-900/80 border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    <span className="text-[10px] font-mono font-bold uppercase leading-tight">
                      Locker 24/7
                    </span>
                  </button>
                </div>
              </div>

              {/* Customer Contact & Address Form */}
              <div className="space-y-3 p-4 rounded-2xl bg-zinc-900/70 border border-white/10">
                <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-bold block">
                  2. COORDONNÉES DE RÉCEPTION :
                </label>

                <div className="space-y-2 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase block mb-1">Nom complet ou Pseudo :</span>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Votre prénom / pseudo"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-black border border-white/15 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase block mb-1">Téléphone (WhatsApp/Signal) :</span>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="text"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+33 6..."
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-black border border-white/15 text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase block mb-1">Contact Telegram / Email :</span>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="text"
                          value={emailAddress}
                          onChange={(e) => setEmailAddress(e.target.value)}
                          placeholder="@username"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-black border border-white/15 text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase block mb-1">Ville :</span>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Ex: Casablanca, Rabat, Marrakech..."
                        className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase block mb-1">Code Postal :</span>
                      <input
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        placeholder="20000"
                        className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase block mb-1">
                      {deliveryMethod === 'home' ? 'Adresse de livraison :' : deliveryMethod === 'relais' ? 'Nom ou Adresse du Point Relais :' : 'Identifiant / Adresse du Locker :'}
                    </span>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                      <textarea
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder={deliveryMethod === 'home' ? "Numéro, Rue, Bâtiment, Code d'accès..." : "Nom du relais ou adresse du casier"}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-black border border-white/15 text-white focus:outline-none focus:border-amber-400 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment / Finalization Method Selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-bold block">
                  3. MODE DE RÈGLEMENT & FINALISATION :
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setPaymentMethod('crypto');
                    }}
                    className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                      paymentMethod === 'crypto'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                        : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-[10px] font-mono font-bold uppercase">Crypto USDT / BTC</span>
                    <span className="text-[8px] font-mono text-zinc-400">100% Anonyme & Rapide</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setPaymentMethod('disposition');
                    }}
                    className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                      paymentMethod === 'disposition'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                        : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <MapPinned className="w-4 h-4 text-amber-400" />
                    <span className="text-[10px] font-mono font-bold uppercase">Mise à disposition</span>
                    <span className="text-[8px] font-mono text-zinc-400">Règlement en direct</span>
                  </button>
                </div>

                {/* Notice that payments are finalized in private */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-left">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5 text-[9.5px] font-mono text-zinc-300 leading-tight">
                    <p className="font-bold text-amber-300 uppercase">Paiement sécurisé en privé</p>
                    <p className="text-zinc-400">
                      Les règlements ne s'effectuent pas sur la mini-application. Après validation, vous serez directement redirigé vers le contact privé Telegram pour finaliser votre paiement en toute discrétion.
                    </p>
                  </div>
                </div>
              </div>

              {validationError && (
                <p className="text-xs font-mono text-red-400 bg-red-950/40 p-2.5 rounded-xl border border-red-500/30">
                  {validationError}
                </p>
              )}
            </div>
          )}

          {/* STEP 3: ORDER SUCCESS RECEIPT */}
          {step === 'success' && createdOrder && (
            <div className="py-6 text-center space-y-4 font-mono">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-black uppercase text-white">
                  COMMANDE VALIDÉE
                </h3>
                <p className="text-xs text-zinc-400">
                  Numéro de suivi : <span className="text-amber-300 font-bold">#{createdOrder.id}</span>
                </p>
              </div>

              {/* Private Payment Finalization Box */}
              <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-left space-y-2 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>RÈGLEMENT & FINALISATION EN PRIVÉ</span>
                </div>
                <p className="text-[10px] text-zinc-300 leading-relaxed font-sans">
                  Pour garantir votre discrétion 0-Log, les paiements s'effectuent exclusivement en privé. Cliquez ci-dessous pour transmettre votre commande et régler avec nos contacts officiels.
                </p>
              </div>

              {/* Summary Card */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 text-left space-y-2 text-xs">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-zinc-400">Client :</span>
                  <span className="font-bold text-white">{createdOrder.customerName}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-zinc-400">Mode choisi :</span>
                  <span className="font-bold text-amber-300">
                    {paymentMethod === 'crypto' ? 'Crypto (USDT/BTC)' : 'Mise à disposition'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-zinc-400">Destination :</span>
                  <span className="font-bold text-white truncate max-w-[200px]">{createdOrder.city}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-zinc-400">Total :</span>
                  <span className="font-black text-amber-300 text-sm">{createdOrder.totalAmount} €</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleCopyOrderSummary();
                    triggerHaptic('heavy');
                    const orderText = encodeURIComponent(
                      `🛍️ COMMANDE FRESH GENETICS 💎\n` +
                      `Numéro: #${createdOrder.id}\n` +

                      `Client: ${createdOrder.customerName}\n` +
                      `Contact: ${createdOrder.phoneNumber || createdOrder.email}\n` +
                      `Mode: ${paymentMethod === 'crypto' ? 'Crypto USDT/BTC' : 'Mise à disposition'}\n` +
                      `Total: ${createdOrder.totalAmount}€\n\n` +
                      `Bonjour, voici ma commande #${createdOrder.id} transmise pour finalisation du paiement.`
                    );
                    try {
                      window.open(`https://t.me/yoru47?text=${orderText}`, '_blank');
                    } catch (_) {}

                  }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:opacity-95 text-black font-black text-xs uppercase flex items-center justify-center gap-2 transition cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.4)] active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>Finaliser la commande sur Telegram</span>
                </button>

                <button
                  onClick={handleCopyOrderSummary}
                  className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase flex items-center justify-center gap-2 transition cursor-pointer border border-white/10"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
                  <span>{copied ? 'Détails copiés !' : 'Copier le récapitulatif'}</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* BOTTOM ACTION BAR */}
        {cart.length > 0 && step !== 'success' && (
          <div className="p-4 sm:p-5 border-t border-white/10 bg-black/80 backdrop-blur-md space-y-2">
            {step === 'cart' ? (
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-black font-mono font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:opacity-95 active:scale-95 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>PASSER À LA LIVRAISON • {finalTotalToPay} €</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleConfirmOrder}
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-black font-mono font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:opacity-95 active:scale-95 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'ENVOI EN COURS...' : `VALIDER LA COMMANDE • ${finalTotalToPay} €`}</span>
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
