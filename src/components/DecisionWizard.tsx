import React, { useState } from 'react';
import { Sparkles, MapPin, DollarSign, Utensils, Camera, Users, ArrowRight, RotateCcw, CheckCircle, ExternalLink } from 'lucide-react';
import { Restaurant, Language } from '../types';
import { translations } from '../data/translations';
import { RestaurantCard } from './RestaurantCard';

interface DecisionWizardProps {
  restaurants: Restaurant[];
  lang: Language;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  savedIds: Set<string>;
  onToggleSave: (restaurant: Restaurant) => void;
}

export const DecisionWizard: React.FC<DecisionWizardProps> = ({
  restaurants,
  lang,
  onSelectRestaurant,
  savedIds,
  onToggleSave,
}) => {
  const t = translations[lang];

  // Wizard state
  const [selectedArea, setSelectedArea] = useState<string>('Dhanmondi');
  const [budgetBDT, setBudgetBDT] = useState<number>(500);
  const [craving, setCraving] = useState<string>('Kacchi Biryani');
  const [vibe, setVibe] = useState<string>('aesthetic_interior');
  const [companion, setCompanion] = useState<string>('Friends Adda');

  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [aiGroundingUrls, setAiGroundingUrls] = useState<any[]>([]);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [matchedResults, setMatchedResults] = useState<Restaurant[] | null>(null);

  const areas = [
    { id: 'Dhanmondi', bn: 'ধানমন্ডি', en: 'Dhanmondi' },
    { id: 'Gulshan', bn: 'গুলশান', en: 'Gulshan' },
    { id: 'Banani', bn: 'বনানী', en: 'Banani' },
    { id: 'Old Dhaka', bn: 'পুরান ঢাকা', en: 'Old Dhaka' },
    { id: 'Uttara', bn: 'উত্তরা', en: 'Uttara' },
    { id: 'Mirpur', bn: 'মিরপুর', en: 'Mirpur' },
    { id: 'Chattogram', bn: 'চট্টগ্রাম', en: 'Chattogram' },
    { id: 'Sylhet', bn: 'সিলেট', en: 'Sylhet' },
  ];

  const cravingOptions = [
    { id: 'Kacchi Biryani', bn: 'কাচ্চি বিরিয়ানি ও বোরহানি', en: 'Kacchi Biryani & Borhani' },
    { id: 'Mustard Tehari', bn: 'সরিষার তেলের বিফ তেহারি', en: 'Mustard Oil Beef Tehari' },
    { id: 'Burger', bn: 'জুসি বিফ / নাগা বার্গার', en: 'Juicy Beef / Naga Burger' },
    { id: 'Steak', bn: 'প্রিমিয়াম স্টেক ও কন্টিনেন্টাল', en: 'Premium Steak & Continental' },
    { id: 'Coffee & Dessert', bn: 'স্পেশালিটি কফি ও পেস্ট্রি', en: 'Specialty Coffee & Desserts' },
    { id: 'Traditional Vorta', bn: 'দেশি খানা ও নানা পদের ভর্তা', en: 'Deshi Khana & 30+ Vortas' },
    { id: 'BBQ & Kebab', bn: 'চিকেন শিক কাবাব ও নান', en: 'BBQ, Boti Kebab & Naan' },
    { id: 'Pasta & Pizza', bn: 'ইতালিয়ান পিৎজা ও পাস্তা', en: 'Italian Thin Pizza & Pasta' },
  ];

  const vibeOptions = [
    { id: 'aesthetic_interior', bn: 'নান্দনিক অন্দরমহল (ইনস্টাগ্রাম ফটো)', en: 'Aesthetic Interior (Portraits)' },
    { id: 'rooftop', bn: 'রুফটপ ভিউ ও সূর্যাস্তের আলো', en: 'Rooftop Sunset & Skyline' },
    { id: 'garden_outdoor', bn: 'সবুজ বাগান ও খোলা বাতাস', en: 'Green Garden & Open Air' },
    { id: 'heritage', bn: 'পুরান ঢাকার ঐতিহ্যবাহী আড্ডা', en: 'Historic Old Dhaka Nostalgia' },
    { id: 'cozy_cafe', bn: 'শান্ত নিরিবিলি ক্যাফে', en: 'Calm & Cozy Cafe' },
  ];

  const companionOptions = [
    { id: 'Friends Adda', bn: 'বন্ধুদের জমজমাট আড্ডা', en: 'Friends Adda & Hangout' },
    { id: 'Romantic Date', bn: 'রোমান্টিক ডিনার / ডেট', en: 'Romantic Date Night' },
    { id: 'Family Dinner', bn: 'পারিবারিক ভোজ', en: 'Family Feast' },
    { id: 'Solo Peace', bn: 'একা শান্ত সময় বা কাজ', en: 'Solo Chill / Work' },
  ];

  const handleRunMatch = async () => {
    // Local match score
    const matches = restaurants.filter((r) => {
      // Area match if matching or 'all'
      const matchesArea = r.area.toLowerCase().includes(selectedArea.toLowerCase()) ||
                          r.city.toLowerCase().includes(selectedArea.toLowerCase());
      // Budget within 35% margin
      const matchesBudget = r.avgPricePerPersonBDT <= budgetBDT * 1.35;
      return matchesArea || matchesBudget;
    }).sort((a, b) => {
      // Prioritize photogenic score and rating
      return (b.photogenicScore + b.rating) - (a.photogenicScore + a.rating);
    });

    setMatchedResults(matches.slice(0, 3));

    // Also call server AI recommendation for real-time tailored advice
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/restaurants/ai-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: 'Dhaka',
          area: selectedArea,
          budgetBDT,
          cravingDish: craving,
          vibePriority: vibe,
          companion,
          language: lang,
        }),
      });
      const data = await res.json();
      if (data.recommendation) {
        setAiAdvice(data.recommendation);
        setAiGroundingUrls(data.groundingUrls || []);
      }
    } catch (err) {
      console.error('AI advise error:', err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleReset = () => {
    setMatchedResults(null);
    setAiAdvice(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Wizard Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-900">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lang === 'bn' ? 'স্মার্ট সিদ্ধান্ত সহকারী' : 'Smart Dining Wizard'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white">
          {t.wizardTitle}
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          {t.wizardSubtitle}
        </p>
      </div>

      {/* Decision Form Container */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-8">
        
        {/* Step 1: Area */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white">
            <MapPin className="w-4 h-4 text-rose-500" />
            <span>{t.wizardStep1}</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {areas.map((a) => {
              const active = selectedArea === a.id;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setSelectedArea(a.id)}
                  className={`p-3 rounded-2xl text-xs sm:text-sm font-bold text-left border transition-all ${
                    active
                      ? 'bg-rose-600 text-white border-rose-600 shadow-md scale-102'
                      : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
                  }`}
                >
                  {lang === 'bn' ? a.bn : a.en}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Budget Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span>{t.wizardStep2}</span>
            </label>
            <span className="text-base font-extrabold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-3 py-1 rounded-xl border border-rose-200 dark:border-rose-900">
              ~৳{budgetBDT} {lang === 'bn' ? '/ জনপ্রতি' : '/ person'}
            </span>
          </div>

          <input
            type="range"
            min="100"
            max="2500"
            step="50"
            value={budgetBDT}
            onChange={(e) => setBudgetBDT(Number(e.target.value))}
            className="w-full accent-rose-600 cursor-pointer"
          />

          <div className="flex justify-between text-[11px] text-zinc-400 font-semibold">
            <span>৳100 (স্ট্রিট / ফুচকা)</span>
            <span>৳500 (কাচ্চি / বার্গার)</span>
            <span>৳1200 (ক্যাফে / ফাইন ডাইন)</span>
            <span>৳2500+ (প্রিমিয়াম স্টেক/বুফে)</span>
          </div>
        </div>

        {/* Step 3: Craving Dish */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white">
            <Utensils className="w-4 h-4 text-orange-500" />
            <span>{t.wizardStep3}</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {cravingOptions.map((c) => {
              const active = craving === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCraving(c.id)}
                  className={`p-3 rounded-2xl text-xs sm:text-sm font-bold text-left border flex items-center justify-between transition-all ${
                    active
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-500 shadow-xs'
                      : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
                  }`}
                >
                  <span>{lang === 'bn' ? c.bn : c.en}</span>
                  {active && <CheckCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 4: Photography & Atmosphere Priority */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white">
            <Camera className="w-4 h-4 text-purple-500" />
            <span>{t.wizardStep4}</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {vibeOptions.map((v) => {
              const active = vibe === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVibe(v.id)}
                  className={`p-3 rounded-2xl text-xs sm:text-sm font-bold text-left border flex items-center justify-between transition-all ${
                    active
                      ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-500 shadow-xs'
                      : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
                  }`}
                >
                  <span>{lang === 'bn' ? v.bn : v.en}</span>
                  {active && <CheckCircle className="w-4 h-4 text-purple-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 5: Companion */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white">
            <Users className="w-4 h-4 text-sky-500" />
            <span>{lang === 'bn' ? '৫. কার সাথে যাচ্ছেন?' : '5. Who are you dining with?'}</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {companionOptions.map((cp) => {
              const active = companion === cp.id;
              return (
                <button
                  key={cp.id}
                  type="button"
                  onClick={() => setCompanion(cp.id)}
                  className={`p-3 rounded-2xl text-xs font-bold text-center border transition-all ${
                    active
                      ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                      : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
                  }`}
                >
                  {lang === 'bn' ? cp.bn : cp.en}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleRunMatch}
            disabled={isLoadingAi}
            className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-rose-600/25 active:scale-98 transition-all disabled:opacity-75"
          >
            <Sparkles className={`w-5 h-5 ${isLoadingAi ? 'animate-spin' : ''}`} />
            <span>{isLoadingAi ? t.wizardAiThinking : t.wizardSubmit}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {matchedResults && (
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-4 rounded-2xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{lang === 'bn' ? 'পুনরায় শুরু করুন' : 'Reset'}</span>
            </button>
          )}
        </div>
      </div>

      {/* AI Food Connoisseur Rationale Box */}
      {aiAdvice && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 border border-rose-200 dark:border-rose-900/60 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-base">
            <Sparkles className="w-5 h-5" />
            <span>{lang === 'bn' ? 'কোথায় খাব এআই এর খাদ্য রসিক পরামর্শ' : 'Kothay Khabo AI Connoisseur Recommendation'}</span>
          </div>

          <div className="prose dark:prose-invert prose-sm max-w-none text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-line font-medium">
            {aiAdvice}
          </div>

          {aiGroundingUrls.length > 0 && (
            <div className="pt-3 border-t border-rose-200/60 dark:border-zinc-700 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-zinc-600 dark:text-zinc-400">{t.sourcesGrounding}</span>
              {aiGroundingUrls.map((g, i) => (
                <a
                  key={i}
                  href={g.uri}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 hover:underline"
                >
                  <span>{g.title || 'Source'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Matched Curated Cards */}
      {matchedResults && matchedResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white">
              {lang === 'bn' ? 'আপনার জন্য সেরা নির্বাচিত স্পটসমূহ' : 'Top Matched Dining Spots For You'}
            </h2>
            <span className="text-xs font-bold text-rose-600">
              {matchedResults.length} {lang === 'bn' ? 'টি মিলেছে' : 'matches'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchedResults.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                lang={lang}
                onSelect={onSelectRestaurant}
                isSaved={savedIds.has(restaurant.id)}
                onToggleSave={onToggleSave}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
