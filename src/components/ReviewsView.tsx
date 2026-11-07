import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquarePlus, CheckCircle2, ShieldAlert, X, Send, Award, Sparkles } from 'lucide-react';
import { ReviewItem, Order } from '../types';
import { submitReview } from '../db';

interface ReviewsViewProps {
  reviews: ReviewItem[];
  userOrders: Order[];
  tgUser: any;
  onRefreshReviews: () => void;
  triggerHaptic: (style: 'light' | 'medium' | 'heavy' | 'success' | 'error') => void;
  showToast: (msg: string) => void;
}

export default function ReviewsView({
  reviews,
  userOrders,
  tgUser,
  onRefreshReviews,
  triggerHaptic,
  showToast
}: ReviewsViewProps) {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showNotEligibleModal, setShowNotEligibleModal] = useState<boolean>(false);

  // Form State
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [category, setCategory] = useState<string>('Frozen Sift');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Calculate Average Rating
  const totalCount = reviews.length;
  const avgRating = totalCount > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / totalCount).toFixed(1)
    : '5.0';

  const completedOrders = userOrders.filter((o) => o.status === 'completed');
  const isEligibleToReview = completedOrders.length > 0;

  const handleOpenAddReview = () => {
    triggerHaptic('medium');
    if (!isEligibleToReview) {
      triggerHaptic('error');
      setShowNotEligibleModal(true);
    } else {
      setShowAddModal(true);
    }
  };

  const handleSubmitReview = async () => {
    if (!comment.trim()) {
      showToast('Veuillez rédiger un commentaire');
      return;
    }

    setIsSubmitting(true);
    triggerHaptic('heavy');

    const authorName = [tgUser?.first_name, tgUser?.last_name].filter(Boolean).join(' ') || tgUser?.username || 'Client Vérifié';

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      telegramId: tgUser?.id ? String(tgUser.id) : 'unknown',
      telegramUsername: tgUser?.username || '',
      authorName,
      rating,
      comment: comment.trim(),
      date: new Date().toISOString().split('T')[0],
      verifiedPurchase: true,
      productCategory: category,
      vipLevel: 'VIP Elite'
    };

    try {
      await submitReview(newRev);
      triggerHaptic('success');
      showToast('Votre avis a été publié avec succès !');
      setShowAddModal(false);
      setComment('');
      onRefreshReviews();
    } catch {
      showToast('Erreur lors de la publication');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 pb-28 pt-1 px-3 sm:px-4 max-w-2xl mx-auto" id="reviews-view">
      
      {/* 1. HEADER BANNER */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black p-5 sm:p-6 text-center space-y-2 shadow-[0_10px_35px_rgba(0,0,0,0.85)]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono uppercase tracking-widest font-bold">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>EXPÉRIENCES & RETOURS CLIENTS</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-black font-sans tracking-tight text-white uppercase">
          AVIS CLIENTS <span className="text-amber-400">VÉRIFIÉS</span>
        </h1>

        {/* Global Rating Score */}
        <div className="pt-2 flex items-center justify-center gap-3 font-mono">
          <div className="text-3xl font-black text-amber-300">
            {avgRating}
          </div>
          <div className="text-left">
            <div className="flex text-amber-400 text-sm">
              {'★★★★★'}
            </div>
            <span className="text-[10px] text-zinc-400 uppercase">
              Basé sur {totalCount} retours réels
            </span>
          </div>
        </div>

        <div className="pt-3">
          <button
            onClick={handleOpenAddReview}
            className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition cursor-pointer inline-flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Déposer un avis vérifié</span>
          </button>
        </div>
      </div>

      {/* 2. REVIEWS LIST */}
      <div className="space-y-3">
        {reviews.map((rev) => (
          <motion.div
            key={rev.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-zinc-950 border border-white/10 space-y-2.5 shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center font-mono font-bold text-amber-300 text-xs">
                  {rev.authorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-sans font-bold text-xs text-white">
                      {rev.authorName}
                    </h4>
                    {rev.verifiedPurchase && (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[8px] font-mono font-bold uppercase">
                        Vérifié
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] font-mono text-zinc-500">
                    {rev.date}
                  </span>
                </div>
              </div>

              <div className="flex text-amber-400 text-xs">
                {"★".repeat(Math.min(5, Math.max(1, rev.rating || 5)))}
              </div>
            </div>

            <p className="text-xs text-zinc-300 font-sans leading-relaxed">
              "{rev.comment}"
            </p>

            {rev.productCategory && (
              <div className="text-[9px] font-mono text-amber-300/80 uppercase">
                🏷️ Produit : {rev.productCategory}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* MODAL: ADD REVIEW */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md p-6 rounded-3xl bg-zinc-950 border border-amber-500/40 shadow-2xl z-10 space-y-4 text-white font-mono"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-black uppercase text-amber-300">
                  Déposer un avis
                </h3>
                <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Star rating selector */}
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-400 uppercase">Note :</span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl ${rating >= star ? 'text-amber-400' : 'text-zinc-700'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-400 uppercase">Catégorie testée :</span>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400"
                  placeholder="Ex: Frozen Sift, Drysift 90u..."
                />
              </div>

              {/* Comment text */}
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-400 uppercase">Votre avis :</span>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                  placeholder="Partagez vos impressions sur la texture, les terpènes, la livraison..."
                />
              </div>

              <button
                onClick={handleSubmitReview}
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase transition cursor-pointer"
              >
                {isSubmitting ? 'Publication...' : 'Publier mon avis'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: NOT ELIGIBLE */}
      <AnimatePresence>
        {showNotEligibleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotEligibleModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm p-6 rounded-3xl bg-zinc-950 border border-red-500/30 shadow-2xl z-10 space-y-4 text-center text-white"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
                <ShieldAlert className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h3 className="font-mono text-sm font-black uppercase text-white">
                  Avis réservé aux clients
                </h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Pour garantir l'authenticité de nos avis, seuls les membres ayant au moins une commande validée et livrée peuvent déposer un témoignage.
                </p>
              </div>

              <button
                onClick={() => setShowNotEligibleModal(false)}
                className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs uppercase font-bold transition"
              >
                Compris
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
