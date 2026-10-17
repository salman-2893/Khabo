/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, Compass, MapPin, Tag, Camera, Utensils, 
  ExternalLink, Bookmark, AlertCircle, ArrowUpRight, Flame, Map
} from 'lucide-react';
import { Restaurant, Language, Theme, BudgetTier, VibeType } from './types';
import { INITIAL_RESTAURANTS } from './data/restaurants';
import { translations } from './data/translations';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { FilterBar } from './components/FilterBar';
import { RestaurantCard } from './components/RestaurantCard';
import { RestaurantDetailModal } from './components/RestaurantDetailModal';
import { DecisionWizard } from './components/DecisionWizard';
import { FoodieRoulette } from './components/FoodieRoulette';
import { LiveMapView } from './components/LiveMapView';
import { OffersView } from './components/OffersView';
import { OwnerModal } from './components/OwnerModal';
import { AccountView } from './components/AccountView';
import { UserCoordinates, DEFAULT_BANGLADESH_COORDS } from './utils/geo';

export default function App() {
  // Localization: Bangla default with EN toggle
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('kothay_khabo_lang');
    return (saved === 'en' || saved === 'bn') ? saved : 'bn';
  });

  // Dark/Light Theme: check localStorage or system
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('kothay_khabo_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Apply dark mode reliably to both html and body
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem('kothay_khabo_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleToggleLang = () => {
    setLang(prev => {
      const next = prev === 'bn' ? 'en' : 'bn';
      localStorage.setItem('kothay_khabo_lang', next);
      return next;
    });
  };

  const t = translations[lang];

  // Navigation tabs: 'map' | 'explore' | 'wizard' | 'roulette' | 'offers' | 'saved' | 'account'
  const [activeTab, setActiveTab] = useState<string>('explore');
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState<boolean>(false);

  // User Geolocation Coordinates
  const [userCoords, setUserCoords] = useState<UserCoordinates | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            areaName: 'Current Location',
          });
        },
        () => {
          // Default to Dhaka if permission denied
          setUserCoords(DEFAULT_BANGLADESH_COORDS);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setUserCoords(DEFAULT_BANGLADESH_COORDS);
    }
  }, []);

  // Restaurant dataset
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  // Saved Bookmarks
  const [savedIds, setSavedIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('kothay_khabo_saved');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const handleToggleSave = (restaurant: Restaurant) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(restaurant.id)) {
        next.delete(restaurant.id);
      } else {
        next.add(restaurant.id);
      }
      localStorage.setItem('kothay_khabo_saved', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedBudget, setSelectedBudget] = useState<BudgetTier | 'all'>('all');
  const [selectedVibe, setSelectedVibe] = useState<VibeType | 'all'>('all');
  const [hasOffersOnly, setHasOffersOnly] = useState(false);
  const [sortBy, setSortBy] = useState('photogenic');

  // Live Scraper / Search State
  const [isLiveLoading, setIsLiveLoading] = useState(false);
  const [liveInfoBanner, setLiveInfoBanner] = useState<{ count: number; sources: any[] } | null>(null);

  // Fetch initial restaurants from server on mount
  useEffect(() => {
    fetch('/api/restaurants')
      .then(res => res.json())
      .then(data => {
        if (data.restaurants && Array.isArray(data.restaurants) && data.restaurants.length > 0) {
          setRestaurants(data.restaurants);
        }
      })
      .catch(err => {
        console.warn('Using local seed restaurants:', err);
      });
  }, []);

  // Trigger Live on-the-go Search with Gemini 3.8 Flash & Google Search grounding
  const handleTriggerLiveSearch = async () => {
    setIsLiveLoading(true);
    setLiveInfoBanner(null);

    const query = searchQuery.trim() || 
      `${selectedArea !== 'all' ? selectedArea : 'Dhaka'} popular food restaurants with offers and aesthetic photos Bangladesh`;

    try {
      const res = await fetch('/api/restaurants/live-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          area: selectedArea !== 'all' ? selectedArea : undefined,
          city: selectedCity !== 'all' ? selectedCity : undefined,
          budgetTier: selectedBudget !== 'all' ? selectedBudget : undefined,
          language: lang,
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.restaurants) && data.restaurants.length > 0) {
        const newIds = new Set(data.restaurants.map((r: Restaurant) => r.id));
        setRestaurants(prev => [...data.restaurants, ...prev.filter(r => !newIds.has(r.id))]);
        setLiveInfoBanner({
          count: data.restaurants.length,
          sources: data.groundingUrls || [],
        });
      }
    } catch (err) {
      console.error('Live search failed:', err);
    } finally {
      setIsLiveLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCity('all');
    setSelectedArea('all');
    setSelectedBudget('all');
    setSelectedVibe('all');
    setHasOffersOnly(false);
    setSortBy('photogenic');
  };

  // Quick Craving Tags for Dhaka Foodies
  const quickCravings = [
    { labelBn: 'কাচ্চি বিরিয়ানি', labelEn: 'Kacchi Biryani', query: 'Kacchi' },
    { labelBn: 'সরিষার তেহারি', labelEn: 'Mustard Tehari', query: 'Tehari' },
    { labelBn: 'রুফটপ সূর্যাস্ত', labelEn: 'Rooftop Sunset', query: 'Rooftop' },
    { labelBn: 'জুসি বার্গার', labelEn: 'Juicy Burgers', query: 'Burger' },
    { labelBn: 'নান্দনিক ক্যাফে', labelEn: 'Aesthetic Cafe', query: 'Coffee' },
    { labelBn: 'সিলেটি ভর্তা', labelEn: 'Sylheti Vorta', query: 'Vorta' },
    { labelBn: 'স্টেক ও গ্রিল', labelEn: 'Steak & Grill', query: 'Steak' },
  ];

  // Filtered & Sorted Restaurants
  const filteredRestaurants = useMemo(() => {
    let list = activeTab === 'saved'
      ? restaurants.filter(r => savedIds.has(r.id))
      : [...restaurants];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.nameBn.toLowerCase().includes(q) ||
        r.area.toLowerCase().includes(q) ||
        r.areaBn.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        r.cuisine.some(c => c.toLowerCase().includes(q)) ||
        r.popularDishes.some(d => d.name.toLowerCase().includes(q) || (d.nameBn && d.nameBn.toLowerCase().includes(q)))
      );
    }

    if (selectedArea !== 'all') {
      const a = selectedArea.toLowerCase();
      list = list.filter(r =>
        r.area.toLowerCase().includes(a) ||
        r.city.toLowerCase().includes(a)
      );
    }

    if (selectedBudget !== 'all') {
      list = list.filter(r => r.budgetTier === selectedBudget);
    }

    if (selectedVibe !== 'all') {
      list = list.filter(r => r.vibe === selectedVibe);
    }

    if (hasOffersOnly) {
      list = list.filter(r => r.offers && r.offers.length > 0);
    }

    list.sort((a, b) => {
      if (sortBy === 'photogenic') {
        return b.photogenicScore - a.photogenicScore;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'price_asc') {
        return a.avgPricePerPersonBDT - b.avgPricePerPersonBDT;
      }
      if (sortBy === 'price_desc') {
        return b.avgPricePerPersonBDT - a.avgPricePerPersonBDT;
      }
      return 0;
    });

    return list;
  }, [restaurants, activeTab, savedIds, searchQuery, selectedArea, selectedBudget, selectedVibe, hasOffersOnly, sortBy]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-300">
      
      {/* Top Navbar */}
      <Navbar
        lang={lang}
        onToggleLang={handleToggleLang}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'add') {
            setIsOwnerModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        savedCount={savedIds.size}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* TAB 1: LIVE MAP (Interactive Leaflet Map with Real Distance & Open Status) */}
        {activeTab === 'map' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
                  <Map className="w-6 h-6 text-rose-600" />
                  <span>{lang === 'bn' ? 'লাইভ রেস্তোরাঁ ম্যাপ ও রুট' : 'Live Restaurant Map & Route'}</span>
                </h1>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {lang === 'bn' 
                    ? 'আপনার অবস্থান থেকে দূরত্ব, এখন খোলা আছে কিনা এবং গুগল ম্যাপস ডিরেকশন দেখুন।' 
                    : 'Check distance from your location, real-time open status, and Google Maps directions.'}
                </p>
              </div>
            </div>

            <LiveMapView
              restaurants={restaurants}
              lang={lang}
              onSelectRestaurant={setSelectedRestaurant}
              userCoords={userCoords}
              onUpdateUserCoords={setUserCoords}
            />
          </div>
        )}

        {/* TAB 2: EXPLORE & FILTER VIEW */}
        {activeTab === 'explore' && (
          <div className="space-y-6 pb-16">
            
            {/* Hero Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-rose-900 via-zinc-900 to-amber-950 text-white p-6 sm:p-10 shadow-2xl border border-white/10">
              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30 backdrop-blur-md">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span>{lang === 'bn' ? 'বাংলাদেশের রেস্তোরাঁ ও ফুড গাইড' : 'Live Bangladesh Food & Dining Guide'}</span>
                </div>

                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                  {lang === 'bn' ? (
                    <>আজকে দুপুরে বা রাতে <span className="bg-gradient-to-r from-amber-300 via-rose-400 to-orange-400 bg-clip-text text-transparent">কোথায় খাবেন?</span></>
                  ) : (
                    <>Decide <span className="bg-gradient-to-r from-amber-300 via-rose-400 to-orange-400 bg-clip-text text-transparent">Where to Eat</span> in Bangladesh</>
                  )}
                </h1>

                <p className="text-sm sm:text-base text-zinc-300 font-medium">
                  {lang === 'bn' 
                    ? 'বাজেট, কাছাকাছি এলাকা, খাবারের পদ, ইনস্টাগ্রাম ফটোজেনিক ভিউ এবং ফুডপ্যান্ডা/ব্যাংকের লাইভ ছাড় দেখে সিদ্ধান্ত নিন সহজেই।'
                    : 'Discover spots by budget, neighborhood proximity, photo aesthetics, dish cravings, and verified deals.'}
                </p>

                {/* Quick Craving Tags */}
                <div className="pt-2 flex flex-wrap gap-2">
                  {quickCravings.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setSearchQuery(c.query)}
                      className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-semibold text-zinc-200 border border-white/10 transition-colors"
                    >
                      {lang === 'bn' ? c.labelBn : c.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Decorative Subtle Ambient Glow */}
              <div className="absolute right-0 bottom-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute left-1/2 top-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* Filter & Live Search Bar */}
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCity={selectedCity}
              onCityChange={setSelectedCity}
              selectedArea={selectedArea}
              onAreaChange={setSelectedArea}
              selectedBudget={selectedBudget}
              onBudgetChange={setSelectedBudget}
              selectedVibe={selectedVibe}
              onVibeChange={setSelectedVibe}
              hasOffersOnly={hasOffersOnly}
              onToggleOffersOnly={() => setHasOffersOnly(!hasOffersOnly)}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              onResetFilters={handleResetFilters}
              onTriggerLiveSearch={handleTriggerLiveSearch}
              isLiveLoading={isLiveLoading}
              lang={lang}
            />

            {/* Live Search Discovery Banner */}
            {liveInfoBanner && (
              <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>
                    {lang === 'bn'
                      ? `গুগল ম্যাপস ও ফুডপ্যান্ডা থেকে সরাসরি ${liveInfoBanner.count}টি নতুন রেস্তোরাঁ ও লাইভ অফার সংগৃহীত হয়েছে!`
                      : `Successfully fetched and synthesized ${liveInfoBanner.count} live spots from Google Maps & Foodpanda!`}
                  </span>
                </div>

                {liveInfoBanner.sources.length > 0 && (
                  <div className="flex items-center gap-2 font-semibold">
                    <span>{t.sourcesGrounding}</span>
                    {liveInfoBanner.sources.slice(0, 2).map((s, idx) => (
                      <a
                        key={idx}
                        href={s.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-0.5"
                      >
                        <span>{s.title}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Section Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white">
                  {lang === 'bn' ? 'রেস্তোরাঁ ও খাবার স্থানসমূহ' : 'Featured Restaurants & Hangouts'}
                </h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  {filteredRestaurants.length}
                </span>
              </div>
            </div>

            {/* Restaurant Cards Grid */}
            {filteredRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    lang={lang}
                    onSelect={setSelectedRestaurant}
                    isSaved={savedIds.has(restaurant.id)}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
                <AlertCircle className="w-10 h-10 text-zinc-400 mx-auto" />
                <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
                  {t.emptyResults}
                </h3>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold hover:bg-zinc-200"
                  >
                    {lang === 'bn' ? 'ফিল্টার রিসেট' : 'Reset Filters'}
                  </button>
                  <button
                    onClick={handleTriggerLiveSearch}
                    className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
                  >
                    {t.liveSearchBtn}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DECISION WIZARD (AI Suggestion) */}
        {activeTab === 'wizard' && (
          <DecisionWizard
            restaurants={restaurants}
            lang={lang}
            onSelectRestaurant={setSelectedRestaurant}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
          />
        )}

        {/* TAB 4: FOODIE ROULETTE (Dynamic Lottery Machine) */}
        {activeTab === 'roulette' && (
          <FoodieRoulette
            restaurants={restaurants}
            lang={lang}
            onSelectRestaurant={setSelectedRestaurant}
            userCoords={userCoords}
          />
        )}

        {/* TAB 5: OFFERS & DEALS */}
        {activeTab === 'offers' && (
          <OffersView
            restaurants={restaurants}
            lang={lang}
            onSelectRestaurant={setSelectedRestaurant}
          />
        )}

        {/* TAB 6: ACCOUNT & APK BUILDER */}
        {activeTab === 'account' && (
          <AccountView
            lang={lang}
            restaurants={restaurants}
            savedCount={savedIds.size}
            onOpenAddModal={() => setIsOwnerModalOpen(true)}
            onSelectTab={setActiveTab}
          />
        )}

        {/* TAB 7: SAVED SPOTS */}
        {activeTab === 'saved' && (
          <div className="space-y-6 pb-16">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Bookmark className="w-6 h-6 text-rose-600 fill-current" />
                  <span>{t.navSaved}</span>
                </h1>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  {lang === 'bn' 
                    ? 'আপনার পছন্দের এবং পরবর্তীতে যাওয়ার জন্য সংরক্ষিত রেস্তোরাঁসমূহ'
                    : 'Your saved favorite restaurants bookmarked for your next food tour'}
                </p>
              </div>

              <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                {filteredRestaurants.length} {lang === 'bn' ? 'টি স্থান' : 'places'}
              </span>
            </div>

            {filteredRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    lang={lang}
                    onSelect={setSelectedRestaurant}
                    isSaved={true}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
                <Bookmark className="w-8 h-8 text-zinc-400 mx-auto" />
                <p className="text-sm text-zinc-500 font-medium">
                  {lang === 'bn' 
                    ? 'এখনো কোনো রেস্তোরাঁ সংরক্ষণ করেননি। যেকোনো রেস্তোরাঁ কার্ডের বুকমার্ক আইকনে ক্লিক করে সংরক্ষণ করুন।' 
                    : 'No saved restaurants yet. Click the bookmark icon on any restaurant card to save it here.'}
                </p>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
                >
                  {lang === 'bn' ? 'খাবার খুঁজুন' : 'Explore Spots'}
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Persistent Docked Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        lang={lang}
      />

      {/* Restaurant Detail Modal */}
      <RestaurantDetailModal
        restaurant={selectedRestaurant}
        lang={lang}
        onClose={() => setSelectedRestaurant(null)}
        isSaved={selectedRestaurant ? savedIds.has(selectedRestaurant.id) : false}
        onToggleSave={handleToggleSave}
      />

      {/* Owner / Community Add Modal */}
      <OwnerModal
        isOpen={isOwnerModalOpen}
        onClose={() => setIsOwnerModalOpen(false)}
        lang={lang}
        onRestaurantAdded={(newSpot) => {
          setRestaurants(prev => [newSpot, ...prev]);
        }}
        allRestaurants={restaurants}
      />
    </div>
  );
}
