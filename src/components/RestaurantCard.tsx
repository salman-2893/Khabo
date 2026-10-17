import React from 'react';
import { Star, MapPin, Tag, Camera, Bookmark, ExternalLink, Sparkles, Navigation } from 'lucide-react';
import { Restaurant, Language } from '../types';
import { translations } from '../data/translations';

interface RestaurantCardProps {
  restaurant: Restaurant;
  lang: Language;
  onSelect: (restaurant: Restaurant) => void;
  isSaved: boolean;
  onToggleSave: (restaurant: Restaurant) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  lang,
  onSelect,
  isSaved,
  onToggleSave,
}) => {
  const t = translations[lang];

  // Helper for budget tier label
  const getBudgetLabel = () => {
    switch (restaurant.budgetTier) {
      case 'street': return t.budgetStreet;
      case 'budget': return t.budgetEconomy;
      case 'mid': return t.budgetMid;
      case 'luxury': return t.budgetLuxury;
      default: return '';
    }
  };

  const getVibeIconColor = () => {
    switch (restaurant.vibe) {
      case 'rooftop': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'aesthetic_interior': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'garden_outdoor': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'heritage': return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      default: return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    }
  };

  return (
    <div className="group rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:border-rose-400/50 dark:hover:border-rose-500/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Cover Image & Badges */}
      <div className="relative aspect-16/10 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Photogenic Score Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/10 shadow-sm pointer-events-auto">
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span>{restaurant.photogenicScore.toFixed(1)}/10</span>
            <span className="text-[10px] text-zinc-300 hidden sm:inline font-medium">
              {lang === 'bn' ? 'ফটোস্পট' : 'Photo'}
            </span>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(restaurant);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all pointer-events-auto shadow-md ${
              isSaved
                ? 'bg-rose-600 text-white'
                : 'bg-zinc-950/70 text-zinc-200 hover:bg-zinc-900 hover:text-white'
            }`}
            title={isSaved ? t.saved : t.save}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Live on-the-go scraped badge or Owner verified */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {restaurant.isLiveScraped && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/90 text-white backdrop-blur-md shadow-xs">
                <Sparkles className="w-3 h-3" />
                {t.liveScrapedBadge}
              </span>
            )}
            {restaurant.isOwnerVerified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/90 text-white backdrop-blur-md shadow-xs">
                ✓ {t.verifiedOwner}
              </span>
            )}
          </div>

          {/* Vibe Badge */}
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border backdrop-blur-md bg-zinc-950/60 text-white border-white/20`}>
            {lang === 'bn' ? restaurant.vibeBn : restaurant.vibe.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Rating */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 
                onClick={() => onSelect(restaurant)}
                className="font-bold text-lg text-zinc-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors cursor-pointer line-clamp-1"
              >
                {lang === 'bn' ? restaurant.nameBn : restaurant.name}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>{lang === 'bn' ? restaurant.areaBn : restaurant.area}, {lang === 'bn' ? restaurant.cityBn : restaurant.city}</span>
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 font-bold text-xs shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{restaurant.rating.toFixed(1)}</span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-normal">
                ({restaurant.reviewCount > 999 ? `${(restaurant.reviewCount / 1000).toFixed(1)}k` : restaurant.reviewCount})
              </span>
            </div>
          </div>

          {/* Photography Highlight quote */}
          <div className="p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 mb-3">
            <div className="flex items-start gap-2">
              <Camera className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0 mt-0.5" />
              <p className="text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2 italic">
                "{lang === 'bn' ? restaurant.photographyHighlights.bn : restaurant.photographyHighlights.en}"
              </p>
            </div>
          </div>

          {/* Popular Dishes */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {restaurant.popularDishes.slice(0, 3).map((dish, i) => (
              <span
                key={i}
                className="text-[11px] px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium"
              >
                {lang === 'bn' && dish.nameBn ? dish.nameBn : dish.name}
                <span className="text-zinc-400 dark:text-zinc-500 ml-1">৳{dish.priceBDT}</span>
              </span>
            ))}
          </div>

          {/* Active Offers Ribbon if available */}
          {restaurant.offers && restaurant.offers.length > 0 && (
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-semibold mb-3">
              <Tag className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span className="line-clamp-1">
                {lang === 'bn' && restaurant.offers[0].titleBn ? restaurant.offers[0].titleBn : restaurant.offers[0].title}
              </span>
            </div>
          )}
        </div>

        {/* Footer: Price per person & CTA buttons */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block font-semibold">
              {t.avgPerPerson}
            </span>
            <span className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">
              ৳{restaurant.avgPricePerPersonBDT}
            </span>
            <span className="text-[10px] text-zinc-500 ml-1">
              ({getBudgetLabel().split(' ')[0]})
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {restaurant.googleMapsUrl && (
              <a
                href={restaurant.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-rose-400 text-zinc-600 dark:text-zinc-300 hover:text-rose-600 text-xs transition-colors"
                title={t.viewOnMaps}
                onClick={(e) => e.stopPropagation()}
              >
                <Navigation className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              onClick={() => onSelect(restaurant)}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold hover:bg-rose-600 dark:hover:bg-rose-500 dark:hover:text-white transition-colors"
            >
              {lang === 'bn' ? 'বিস্তারিত দেখুন' : 'Explore Spot'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
