import React, { useState } from 'react';
import { Search, MapPin, SlidersHorizontal, Sparkles, X, Tag, Camera, RotateCcw } from 'lucide-react';
import { BudgetTier, VibeType, Language } from '../types';
import { translations } from '../data/translations';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  selectedArea: string;
  onAreaChange: (area: string) => void;
  selectedBudget: BudgetTier | 'all';
  onBudgetChange: (b: BudgetTier | 'all') => void;
  selectedVibe: VibeType | 'all';
  onVibeChange: (v: VibeType | 'all') => void;
  hasOffersOnly: boolean;
  onToggleOffersOnly: () => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  onResetFilters: () => void;
  onTriggerLiveSearch: () => void;
  isLiveLoading: boolean;
  lang: Language;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCity,
  onCityChange,
  selectedArea,
  onAreaChange,
  selectedBudget,
  onBudgetChange,
  selectedVibe,
  onVibeChange,
  hasOffersOnly,
  onToggleOffersOnly,
  sortBy,
  onSortByChange,
  onResetFilters,
  onTriggerLiveSearch,
  isLiveLoading,
  lang,
}) => {
  const t = translations[lang];
  const [showFilters, setShowFilters] = useState(false);

  // Popular Bangladeshi Foodie Areas
  const areas = [
    { id: 'all', en: 'All Areas', bn: 'সব এলাকা' },
    { id: 'Dhanmondi', en: 'Dhanmondi', bn: 'ধানমন্ডি' },
    { id: 'Gulshan', en: 'Gulshan', bn: 'গুলশান' },
    { id: 'Banani', en: 'Banani', bn: 'বনানী' },
    { id: 'Uttara', en: 'Uttara', bn: 'উত্তরা' },
    { id: 'Old Dhaka', en: 'Old Dhaka (Puran)', bn: 'পুরান ঢাকা' },
    { id: 'Mirpur', en: 'Mirpur', bn: 'মিরপুর' },
    { id: 'Khilgaon', en: 'Khilgaon', bn: 'খিলগাঁও' },
    { id: 'Bailey Road', en: 'Bailey Road', bn: 'বেইলি রোড' },
    { id: 'Chattogram', en: 'Chattogram (GEC)', bn: 'চট্টগ্রাম' },
    { id: 'Sylhet', en: 'Sylhet (Zindabazar)', bn: 'সিলেট' },
  ];

  const budgetOptions: { id: BudgetTier | 'all'; labelEn: string; labelBn: string }[] = [
    { id: 'all', labelEn: 'All Budgets', labelBn: 'সকল বাজেট' },
    { id: 'street', labelEn: '< ৳200 (Street/Budget)', labelBn: '< ২০০৳ (স্ট্রিট/বাজেট)' },
    { id: 'budget', labelEn: '৳200 - ৳500 (Economy)', labelBn: '২০০৳ - ৫০০৳ (পকেট ফ্রেন্ডলি)' },
    { id: 'mid', labelEn: '৳500 - ৳1200 (Mid-range)', labelBn: '৫০০৳ - ১২০০৳ (মিড রেঞ্জ)' },
    { id: 'luxury', labelEn: '৳1200+ (Fine Dine/Buffet)', labelBn: '১২০০৳+ (লাক্সারি/বুফে)' },
  ];

  const vibeOptions: { id: VibeType | 'all'; labelEn: string; labelBn: string }[] = [
    { id: 'all', labelEn: 'All Vibes', labelBn: 'সব পরিবেশ' },
    { id: 'rooftop', labelEn: 'Rooftop & Sunset', labelBn: 'রুফটপ ও সূর্যাস্ত' },
    { id: 'aesthetic_interior', labelEn: 'Aesthetic Interior', labelBn: 'নান্দনিক অন্দরমহল' },
    { id: 'garden_outdoor', labelEn: 'Garden & Outdoor', labelBn: 'সবুজ বাগান ও খোলা বাতাস' },
    { id: 'heritage', labelEn: 'Heritage / Old Dhaka', labelBn: 'পুরান ঢাকা ও ঐতিহ্য' },
    { id: 'cozy_cafe', labelEn: 'Cozy Cafe / Adda', labelBn: 'ক্যাফে ও আড্ডা' },
  ];

  const activeFiltersCount = 
    (selectedArea !== 'all' ? 1 : 0) +
    (selectedBudget !== 'all' ? 1 : 0) +
    (selectedVibe !== 'all' ? 1 : 0) +
    (hasOffersOnly ? 1 : 0);

  return (
    <div className="space-y-3 mb-8">
      {/* Search Input Bar + Live Grab Button */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onTriggerLiveSearch();
            }}
            placeholder={t.searchPlaceholder}
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm sm:text-base text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Live Search (Google Maps & Foodpanda) Button */}
        <button
          onClick={onTriggerLiveSearch}
          disabled={isLiveLoading}
          className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 active:scale-98 transition-all shrink-0 disabled:opacity-75"
          title="Scrape and synthesize real-time data from Google Maps and Foodpanda"
        >
          <Sparkles className={`w-4 h-4 ${isLiveLoading ? 'animate-spin' : ''}`} />
          <span>{isLiveLoading ? t.fetchingLive : t.liveSearchBtn}</span>
        </button>

        {/* Toggle Filters Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3.5 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shrink-0 ${
            showFilters || activeFiltersCount > 0
              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800'
              : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>{lang === 'bn' ? 'ফিল্টার' : 'Filters'}</span>
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[11px] font-bold flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Quick Area Filter Chips (Horizontal Scrollable) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <MapPin className="w-4 h-4 text-zinc-400 shrink-0 ml-1" />
        {areas.map((area) => {
          const isSelected = selectedArea === area.id || (area.id === 'all' && selectedArea === 'all');
          return (
            <button
              key={area.id}
              onClick={() => onAreaChange(area.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs scale-102'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200/80 dark:border-zinc-800'
              }`}
            >
              {lang === 'bn' ? area.bn : area.en}
            </button>
          );
        })}
      </div>

      {/* Expanded Filter Panel */}
      {showFilters && (
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md animate-fade-in space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Budget Range */}
            <div>
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block mb-1.5">
                {t.filterBudget}
              </label>
              <select
                value={selectedBudget}
                onChange={(e) => onBudgetChange(e.target.value as BudgetTier | 'all')}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {budgetOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {lang === 'bn' ? opt.labelBn : opt.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Vibe & Photography */}
            <div>
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block mb-1.5">
                {t.filterVibe}
              </label>
              <select
                value={selectedVibe}
                onChange={(e) => onVibeChange(e.target.value as VibeType | 'all')}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {vibeOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {lang === 'bn' ? opt.labelBn : opt.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block mb-1.5">
                {t.sortBy}
              </label>
              <select
                value={sortBy}
                onChange={(e) => onSortByChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="photogenic">{t.sortPhotogenic}</option>
                <option value="rating">{t.sortRating}</option>
                <option value="price_asc">{t.sortPriceAsc}</option>
                <option value="price_desc">{t.sortPriceDesc}</option>
              </select>
            </div>

            {/* Offers Only Checkbox & Reset */}
            <div className="flex flex-col justify-end gap-2">
              <label 
                onClick={onToggleOffersOnly}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 cursor-pointer text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:border-rose-400"
              >
                <input
                  type="checkbox"
                  checked={hasOffersOnly}
                  onChange={onToggleOffersOnly}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <Tag className="w-3.5 h-3.5 text-rose-500" />
                <span>{t.filterOffersOnly}</span>
              </label>
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
              <button
                onClick={onResetFilters}
                className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{lang === 'bn' ? 'সকল ফিল্টার মুছুন' : 'Reset all filters'}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
