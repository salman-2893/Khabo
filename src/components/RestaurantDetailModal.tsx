import React, { useState } from 'react';
import { X, Star, MapPin, Tag, Camera, Navigation, Clock, Phone, Copy, Check, ExternalLink, Bookmark, Sparkles } from 'lucide-react';
import { Restaurant, Language } from '../types';
import { translations } from '../data/translations';

interface RestaurantDetailModalProps {
  restaurant: Restaurant | null;
  lang: Language;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (restaurant: Restaurant) => void;
}

export const RestaurantDetailModal: React.FC<RestaurantDetailModalProps> = ({
  restaurant,
  lang,
  onClose,
  isSaved,
  onToggleSave,
}) => {
  if (!restaurant) return null;

  const t = translations[lang];
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activePhotoTab, setActivePhotoTab] = useState<'all' | 'interior' | 'exterior'>('all');
  const [selectedImage, setSelectedImage] = useState<string>(restaurant.coverImage);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const allPhotos = [
    restaurant.coverImage,
    ...(restaurant.interiorImages || []),
    ...(restaurant.exteriorImages || [])
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="sticky top-0 z-20 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
              {lang === 'bn' ? restaurant.vibeBn : restaurant.vibe.replace('_', ' ').toUpperCase()}
            </span>
            {restaurant.isLiveScraped && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300">
                {t.liveScrapedBadge}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(restaurant)}
              className={`p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 transition-colors ${
                isSaved ? 'bg-rose-600 text-white border-rose-600' : 'text-zinc-600 dark:text-zinc-300 hover:text-rose-600'
              }`}
              title={isSaved ? t.saved : t.save}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content */}
        <div className="p-6 space-y-6">
          
          {/* Header Info */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
                  {lang === 'bn' ? restaurant.nameBn : restaurant.name}
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>
                    {lang === 'bn' && restaurant.addressBn ? restaurant.addressBn : restaurant.address}
                  </span>
                </p>
              </div>

              {/* Rating Box */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
                  <span className="font-extrabold text-lg">{restaurant.rating.toFixed(1)}</span>
                  <span className="text-xs text-zinc-500 font-normal">
                    ({restaurant.reviewCount} {t.reviewsCount})
                  </span>
                </div>

                <div className="px-3 py-1.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300">
                  <div className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500">{t.avgPerPerson}</div>
                  <div className="font-extrabold text-lg">৳{restaurant.avgPricePerPersonBDT}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Gallery & Photography Spot Spotlight */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                  {t.interiorExterior}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  ★ {restaurant.photogenicScore}/10 {t.photogenicScore}
                </span>
              </div>
            </div>

            {/* Main Featured Photo */}
            <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-zinc-950 shadow-inner">
              <img
                src={selectedImage}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-zinc-950/80 backdrop-blur-md text-white text-xs border border-white/10 flex items-start gap-2">
                <Camera className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-amber-300">{lang === 'bn' ? 'ফটো টিপস: ' : 'Photography Tip: '}</strong>
                  {lang === 'bn' ? restaurant.photographyHighlights.bn : restaurant.photographyHighlights.en}
                </p>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {allPhotos.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImage === img
                      ? 'border-rose-600 scale-105 shadow-md'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Active Offers & Discounts */}
          {restaurant.offers && restaurant.offers.length > 0 && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-950/30 dark:to-orange-950/30 border border-rose-200 dark:border-rose-900/60">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold text-sm mb-3">
                <Tag className="w-4 h-4" />
                <span>{t.activeOffers}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {restaurant.offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="p-3 rounded-xl bg-white dark:bg-zinc-800 border border-rose-100 dark:border-zinc-700 flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-200">
                          {offer.platform}
                        </span>
                        <h4 className="font-bold text-xs text-zinc-900 dark:text-white">
                          {lang === 'bn' && offer.titleBn ? offer.titleBn : offer.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                        {lang === 'bn' && offer.discountTextBn ? offer.discountTextBn : offer.discountText}
                      </p>
                    </div>

                    {offer.promoCode && (
                      <button
                        onClick={() => handleCopyCode(offer.promoCode!)}
                        className="px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-700 hover:bg-rose-100 dark:hover:bg-rose-900 text-zinc-700 dark:text-zinc-200 text-xs font-mono font-bold flex items-center gap-1 shrink-0 transition-colors"
                      >
                        {copiedCode === offer.promoCode ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{lang === 'bn' ? 'কপি হয়েছে' : 'Copied'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>{offer.promoCode}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Popular Dishes & Menu with Prices */}
          <div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white mb-3">
              {t.popularDishes}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {restaurant.popularDishes.map((dish, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2">
                    {dish.isPopular && (
                      <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
                    )}
                    <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                      {lang === 'bn' && dish.nameBn ? dish.nameBn : dish.name}
                    </span>
                  </div>
                  <span className="text-sm font-extrabold text-zinc-900 dark:text-white shrink-0">
                    ৳{dish.priceBDT}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white mb-3">
              {lang === 'bn' ? 'ভোজনরসিকদের মতামত (রিভিউ)' : 'Foodie Community Reviews'}
            </h2>
            <div className="space-y-2.5">
              {restaurant.reviews.map((rev, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-zinc-900 dark:text-white">{rev.user}</span>
                    <span className="text-zinc-400 dark:text-zinc-500 font-medium">
                      via {rev.source}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 italic">
                    "{lang === 'bn' && rev.textBn ? rev.textBn : rev.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Grounding URLs if present */}
          {restaurant.groundingUrls && restaurant.groundingUrls.length > 0 && (
            <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs">
              <span className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                {t.sourcesGrounding}
              </span>
              <div className="flex flex-wrap gap-2">
                {restaurant.groundingUrls.map((g, i) => (
                  <a
                    key={i}
                    href={g.uri}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 hover:underline"
                  >
                    <span>{g.title}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Sticky Bottom Actions */}
        <div className="sticky bottom-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            {restaurant.openingHours && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                {restaurant.openingHours}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {restaurant.googleMapsUrl && (
              <a
                href={restaurant.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 text-zinc-800 dark:text-zinc-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Navigation className="w-4 h-4 text-rose-600" />
                <span>{t.viewOnMaps}</span>
              </a>
            )}

            {restaurant.foodpandaUrl && (
              <a
                href={restaurant.foodpandaUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors"
              >
                <span>{t.orderFoodpanda}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
