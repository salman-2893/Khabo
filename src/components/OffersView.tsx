import React, { useState } from 'react';
import { Tag, Sparkles, Copy, Check, ExternalLink, ArrowRight } from 'lucide-react';
import { Restaurant, Language } from '../types';
import { translations } from '../data/translations';

interface OffersViewProps {
  restaurants: Restaurant[];
  lang: Language;
  onSelectRestaurant: (restaurant: Restaurant) => void;
}

export const OffersView: React.FC<OffersViewProps> = ({
  restaurants,
  lang,
  onSelectRestaurant,
}) => {
  const t = translations[lang];
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Flatten all offers with their associated restaurant
  const allOffers = restaurants.flatMap((r) =>
    (r.offers || []).map((o) => ({
      ...o,
      restaurant: r,
    }))
  );

  const platforms = [
    { id: 'all', bn: 'সকল অফার', en: 'All Offers' },
    { id: 'Foodpanda', bn: 'ফুডপ্যান্ডা ভাউচার', en: 'Foodpanda' },
    { id: 'bKash', bn: 'বিকাশ ক্যাশব্যাক', en: 'bKash' },
    { id: 'Bank Card', bn: 'ব্যাংক কার্ড (AMEX/BRAC)', en: 'Bank Cards' },
    { id: 'Student', bn: 'স্টুডেন্ট ছাড়', en: 'Student' },
    { id: 'In-house', bn: 'রেস্তোরাঁ ইন-হাউস', en: 'In-House' },
  ];

  const filteredOffers = selectedPlatform === 'all'
    ? allOffers
    : allOffers.filter(o => o.platform === selectedPlatform);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-900">
          <Tag className="w-3.5 h-3.5" />
          <span>{lang === 'bn' ? 'চলমান ছাড় ও প্রোমো' : 'Live Deals & Discounts'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white">
          {lang === 'bn' ? 'ফুডপ্যান্ডা, বিকাশ ও ব্যাংক কার্ডের অফার' : 'Foodpanda, bKash & Bank Card Offers'}
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
          {lang === 'bn' 
            ? 'খাবারের বিল বাঁচান! বিভিন্ন রেস্তোরাঁর সক্রিয় ভাউচার কোড, ক্যাশব্যাক ও ছাড় এক জায়গায়।'
            : 'Save on your dining bill! Live voucher codes, card privileges, and seasonal discounts in one place.'}
        </p>
      </div>

      {/* Platform Chips */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {platforms.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedPlatform(p.id)}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              selectedPlatform === p.id
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
            }`}
          >
            {lang === 'bn' ? p.bn : p.en}
          </button>
        ))}
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredOffers.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Badge & Restaurant Name */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  item.platform === 'Foodpanda' ? 'bg-pink-100 text-pink-700 dark:bg-pink-950/70 dark:text-pink-300' :
                  item.platform === 'bKash' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300' :
                  item.platform === 'Bank Card' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300' :
                  'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
                }`}>
                  {item.platform}
                </span>

                <span className="text-xs text-zinc-400 font-medium">
                  {lang === 'bn' ? item.restaurant.areaBn : item.restaurant.area}
                </span>
              </div>

              {/* Offer Title */}
              <h3 className="font-extrabold text-base text-zinc-900 dark:text-white">
                {lang === 'bn' && item.titleBn ? item.titleBn : item.title}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1">
                {lang === 'bn' && item.discountTextBn ? item.discountTextBn : item.discountText}
              </p>

              {/* Restaurant info snippet */}
              <div className="mt-3 p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">
                    {lang === 'bn' ? item.restaurant.nameBn : item.restaurant.name}
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    ৳{item.restaurant.avgPricePerPersonBDT} {t.avgPerPerson}
                  </span>
                </div>

                <button
                  onClick={() => onSelectRestaurant(item.restaurant)}
                  className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                >
                  <span>{lang === 'bn' ? 'রেস্তোরাঁ দেখুন' : 'View Spot'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bottom: Promo code copy & Foodpanda order */}
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
              {item.promoCode ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200">
                    {item.promoCode}
                  </span>
                  <button
                    onClick={() => handleCopy(item.promoCode!)}
                    className="p-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-rose-100 dark:hover:bg-rose-900 text-zinc-600 dark:text-zinc-300 transition-colors"
                    title="Copy code"
                  >
                    {copiedCode === item.promoCode ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ) : (
                <span className="text-xs text-zinc-400 italic">
                  {lang === 'bn' ? 'বিল পরিশোধকালে প্রযোজ্য' : 'Auto-applied on payment'}
                </span>
              )}

              {item.restaurant.foodpandaUrl && (
                <a
                  href={item.restaurant.foodpandaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <span>Foodpanda</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
