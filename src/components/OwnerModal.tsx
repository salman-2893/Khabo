import React, { useState } from 'react';
import { PlusCircle, Building2, Check, Sparkles, X, ShieldCheck, Tag } from 'lucide-react';
import { Restaurant, Language } from '../types';
import { translations } from '../data/translations';

interface OwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onRestaurantAdded: (restaurant: Restaurant) => void;
  allRestaurants: Restaurant[];
}

export const OwnerModal: React.FC<OwnerModalProps> = ({
  isOpen,
  onClose,
  lang,
  onRestaurantAdded,
  allRestaurants,
}) => {
  if (!isOpen) return null;

  const t = translations[lang];

  // Form State
  const [role, setRole] = useState<'owner' | 'foodie'>('owner');
  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [area, setArea] = useState('Dhanmondi');
  const [city, setCity] = useState('Dhaka');
  const [address, setAddress] = useState('');
  const [avgPrice, setAvgPrice] = useState(450);
  const [budgetTier, setBudgetTier] = useState<'street' | 'budget' | 'mid' | 'luxury'>('mid');
  const [vibe, setVibe] = useState<'rooftop' | 'aesthetic_interior' | 'garden_outdoor' | 'heritage' | 'cozy_cafe'>('aesthetic_interior');
  const [photogenicScore, setPhotogenicScore] = useState(9.0);
  const [photoNotesEn, setPhotoNotesEn] = useState('');
  const [photoNotesBn, setPhotoNotesBn] = useState('');
  const [dishesText, setDishesText] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [offerTitle, setOfferTitle] = useState('');
  const [offerCode, setOfferCode] = useState('');
  const [offerPlatform, setOfferPlatform] = useState<'Foodpanda' | 'bKash' | 'Bank Card' | 'In-house'>('Foodpanda');
  const [mapsUrl, setMapsUrl] = useState('');
  const [foodpandaUrl, setFoodpandaUrl] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);

    const dishes = dishesText
      ? dishesText.split(',').map((d) => ({
          name: d.trim(),
          priceBDT: Math.round(avgPrice * 0.8),
          isPopular: true,
        }))
      : [{ name: 'Chef Special', priceBDT: avgPrice, isPopular: true }];

    const offers = offerTitle
      ? [
          {
            id: `offer-${Date.now()}`,
            title: offerTitle,
            titleBn: offerTitle,
            platform: offerPlatform,
            discountText: 'Special promotional discount',
            discountTextBn: 'বিশেষ ডিসকাউন্ট অফার',
            promoCode: offerCode.trim() || undefined,
          },
        ]
      : [];

    const newSpot: Partial<Restaurant> = {
      name,
      nameBn: nameBn.trim() || name,
      area,
      areaBn: area,
      city,
      cityBn: city === 'Dhaka' ? 'ঢাকা' : city === 'Chattogram' ? 'চট্টগ্রাম' : 'সিলেট',
      address: address.trim() || `${area}, ${city}`,
      avgPricePerPersonBDT: Number(avgPrice),
      budgetTier,
      vibe,
      vibeBn: vibe === 'rooftop' ? 'রুফটপ ভিউ' : vibe === 'garden_outdoor' ? 'বাগান ও খোলা বাতাস' : 'নান্দনিক অন্দরমহল',
      photogenicScore: Number(photogenicScore),
      photographyHighlights: {
        en: photoNotesEn.trim() || 'Aesthetic interior lighting and photogenic presentation.',
        bn: photoNotesBn.trim() || 'সুন্দর ফটোস্পট ও নান্দনিক পরিবেশ।',
      },
      popularDishes: dishes,
      offers,
      coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&auto=format&fit=crop&q=80',
      googleMapsUrl: mapsUrl.trim() || `https://maps.google.com/?q=${encodeURIComponent(name + ' ' + area)}`,
      foodpandaUrl: foodpandaUrl.trim() || undefined,
      isOwnerVerified: role === 'owner',
    };

    try {
      const res = await fetch('/api/community/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newSpot, role }),
      });
      const data = await res.json();
      if (data.restaurant) {
        onRestaurantAdded(data.restaurant);
        setSuccessMsg(true);
        setTimeout(() => {
          setSuccessMsg(false);
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="sticky top-0 z-10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-rose-600" />
              <span>{t.ownerTitle}</span>
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {t.ownerSubtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Role Picker */}
              <div>
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block mb-1">
                  {t.fieldRole}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('owner')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      role === 'owner'
                        ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-500'
                        : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-rose-600" />
                    <span>{t.roleOwner}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('foodie')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      role === 'foodie'
                        ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-500'
                        : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>{t.roleFoodie}</span>
                  </button>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                    {t.fieldRestName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sultan's Dine"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                    {t.fieldRestNameBn}
                  </label>
                  <input
                    type="text"
                    value={nameBn}
                    onChange={(e) => setNameBn(e.target.value)}
                    placeholder="যেমন: সুলতান'স ডাইন"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Area & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                    {t.fieldArea} *
                  </label>
                  <input
                    type="text"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Banani, Dhanmondi, Lalbagh"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                    {t.fieldCity}
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="Dhaka">Dhaka (ঢাকা)</option>
                    <option value="Chattogram">Chattogram (চট্টগ্রাম)</option>
                    <option value="Sylhet">Sylhet (সিলেট)</option>
                    <option value="Cox's Bazar">Cox's Bazar (কক্সবাজার)</option>
                  </select>
                </div>
              </div>

              {/* Budget & Avg Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                    {t.fieldAvgCost}
                  </label>
                  <input
                    type="number"
                    value={avgPrice}
                    onChange={(e) => setAvgPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                    {t.fieldVibe}
                  </label>
                  <select
                    value={vibe}
                    onChange={(e) => setVibe(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="rooftop">{t.vibeRooftop}</option>
                    <option value="aesthetic_interior">{t.vibeAestheticInterior}</option>
                    <option value="garden_outdoor">{t.vibeGardenOutdoor}</option>
                    <option value="heritage">{t.vibeHeritage}</option>
                    <option value="cozy_cafe">{t.vibeCozyCafe}</option>
                  </select>
                </div>
              </div>

              {/* Photography Highlights */}
              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                  {t.fieldPhotoNotes}
                </label>
                <input
                  type="text"
                  value={photoNotesEn}
                  onChange={(e) => setPhotoNotesEn(e.target.value)}
                  placeholder="e.g. Sunset view over Hatirjheel, best natural lighting at Table 5"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* Signature Dishes */}
              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                  {t.fieldDishes}
                </label>
                <input
                  type="text"
                  value={dishesText}
                  onChange={(e) => setDishesText(e.target.value)}
                  placeholder="e.g. Mutton Kacchi, Borhani, Jali Kabab"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* Active Offer / Voucher */}
              <div className="p-3 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 space-y-2">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'চলমান কোনো অফার বা ভাউচার থাকলে যুক্ত করুন' : 'Active Offer / Promo (Optional)'}</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={offerTitle}
                    onChange={(e) => setOfferTitle(e.target.value)}
                    placeholder="e.g. 20% Off Dine-in"
                    className="sm:col-span-2 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <input
                    type="text"
                    value={offerCode}
                    onChange={(e) => setOfferCode(e.target.value)}
                    placeholder="Code (e.g. DINE20)"
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300"
                >
                  {t.close}
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-md transition-colors disabled:opacity-75"
                >
                  {isSubmitting ? (lang === 'bn' ? 'সংরক্ষণ হচ্ছে...' : 'Saving...') : (lang === 'bn' ? 'যুক্ত করুন' : 'Submit Profile')}
                </button>
              </div>

              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{t.submitSuccess}</span>
                </div>
              )}
            </form>
        </div>
      </div>
    </div>
  );
};
