import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Trophy, Utensils, Navigation, RotateCw, 
  MapPin, DollarSign, Camera, Flame, CheckCircle, Crosshair 
} from 'lucide-react';
import { Restaurant, Language } from '../types';
import { translations } from '../data/translations';
import { 
  UserCoordinates, DEFAULT_BANGLADESH_COORDS, 
  calculateDistanceKm, getGoogleMapsRouteUrl, isRestaurantOpenNow 
} from '../utils/geo';

interface FoodieRouletteProps {
  restaurants: Restaurant[];
  lang: Language;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  userCoords: UserCoordinates | null;
}

interface LotteryReelItem {
  icon: string;
  nameEn: string;
  nameBn: string;
}

export const FoodieRoulette: React.FC<FoodieRouletteProps> = ({
  restaurants,
  lang,
  onSelectRestaurant,
  userCoords,
}) => {
  const t = translations[lang];

  // Dynamic Location selection (Not fixed to any city/neighborhood!)
  const [customLocation, setCustomLocation] = useState<string>('My Current Location');
  const [isUsingGps, setIsUsingGps] = useState<boolean>(true);

  // Lottery Reels Data
  const reelDishes: LotteryReelItem[] = [
    { icon: '🍛', nameEn: 'Royal Kacchi Biryani', nameBn: 'শাহী কাচ্চি বিরিয়ানি' },
    { icon: '🥩', nameEn: 'Sizzling Ribeye Steak', nameBn: 'সিজলিং রিবআই স্টেক' },
    { icon: '🍔', nameEn: 'Juicy Naga Beef Burger', nameBn: 'ঝাল নাগা বিফ বার্গার' },
    { icon: '🍲', nameEn: 'Mustard Oil Beef Tehari', nameBn: 'সরিষার তেলের বিফ তেহারি' },
    { icon: '☕', nameEn: 'Artisan Latte & Pastry', nameBn: 'স্পেশালিটি কফি ও পেস্ট্রি' },
    { icon: '🥘', nameEn: '30+ Assorted Vorta Thali', nameBn: '৩০ পদের ভর্তা ও দেশি খানা' },
    { icon: '🍕', nameEn: 'Wood-Fired Pizza & Pasta', nameBn: 'ইতালিয়ান পিৎজা ও পাস্তা' },
    { icon: '🍢', nameEn: 'Smoky Boti Kebab & Paratha', nameBn: 'স্মোকি বটি কাবাব ও পরোটা' },
  ];

  const reelDeals: LotteryReelItem[] = [
    { icon: '🎉', nameEn: 'Foodpanda 20% Voucher', nameBn: 'ফুডপ্যান্ডা ২০% ভাউচার' },
    { icon: '💰', nameEn: 'Street Feast (< ৳200)', nameBn: 'স্ট্রিট ফুড ফেস্ট (< ২০০৳)' },
    { icon: '💳', nameEn: 'bKash Instant Cashback', nameBn: 'বিকাশ ইনস্ট্যান্ট ক্যাশব্যাক' },
    { icon: '👑', nameEn: 'Royal Fine Dine (৳1200+)', nameBn: 'নবাবী ভোজ (১২০০৳+)' },
    { icon: '🏷️', nameEn: 'Student ID 10% Discount', nameBn: 'স্টুডেন্ট স্পেশাল ছাড়' },
    { icon: '✨', nameEn: 'Pocket-Friendly (৳350)', nameBn: 'পকেট ফ্রেন্ডলি (৩৫০৳)' },
  ];

  const reelVibes: LotteryReelItem[] = [
    { icon: '🌅', nameEn: 'Rooftop Sunset Skyline', nameBn: 'রুফটপ সূর্যাস্ত ও স্কাইলাইন' },
    { icon: '📸', nameEn: 'Aesthetic Indoor Portrait Spot', nameBn: 'নান্দনিক অন্দরমহল ও ছবি' },
    { icon: '🌿', nameEn: 'Open Garden Courtyard', nameBn: 'খোলা সবুজ বাগান ও হাওয়া' },
    { icon: '🏰', nameEn: 'Old Dhaka Heritage Adda', nameBn: 'পুরান ঢাকার ঐতিহ্যবাহী আড্ডা' },
    { icon: '🕯️', nameEn: 'Cozy Low-Lit Candlelight', nameBn: 'রোমান্টিক ক্যান্ডেললাইট ভাইব' },
  ];

  // Reel states
  const [reel1Index, setReel1Index] = useState(0);
  const [reel2Index, setReel2Index] = useState(0);
  const [reel3Index, setReel3Index] = useState(0);

  const [isSpinning, setIsSpinning] = useState(false);
  const [winnerRestaurant, setWinnerRestaurant] = useState<Restaurant | null>(null);

  // Audio synthesizer for lottery raffle sounds
  const playSlotTick = (freq: number = 440) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  };

  const playJackpotFanfare = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.3);
      });
    } catch {}
  };

  // Pull Lottery Lever
  const handleDrawLottery = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWinnerRestaurant(null);

    const spinDuration = 3200; // ms
    const startTime = performance.now();

    const interval = setInterval(() => {
      setReel1Index(Math.floor(Math.random() * reelDishes.length));
      setReel2Index(Math.floor(Math.random() * reelDeals.length));
      setReel3Index(Math.floor(Math.random() * reelVibes.length));
      playSlotTick(300 + Math.random() * 300);

      if (performance.now() - startTime > spinDuration) {
        clearInterval(interval);
        finalizeDraw();
      }
    }, 90);
  };

  const finalizeDraw = () => {
    // Pick final indexes
    const final1 = Math.floor(Math.random() * reelDishes.length);
    const final2 = Math.floor(Math.random() * reelDeals.length);
    const final3 = Math.floor(Math.random() * reelVibes.length);

    setReel1Index(final1);
    setReel2Index(final2);
    setReel3Index(final3);

    // Filter candidate restaurants or pick random winner from full pool
    let candidates = restaurants;
    if (customLocation && customLocation !== 'My Current Location') {
      const locMatch = restaurants.filter(
        r => r.area.toLowerCase().includes(customLocation.toLowerCase()) ||
             r.city.toLowerCase().includes(customLocation.toLowerCase())
      );
      if (locMatch.length > 0) candidates = locMatch;
    }

    const randomPick = candidates[Math.floor(Math.random() * candidates.length)] || restaurants[0];
    setWinnerRestaurant(randomPick);
    setIsSpinning(false);
    playJackpotFanfare();
  };

  const coords = userCoords || DEFAULT_BANGLADESH_COORDS;
  const winnerDist = winnerRestaurant
    ? calculateDistanceKm(
        coords.lat,
        coords.lng,
        winnerRestaurant.coordinates?.lat || coords.lat,
        winnerRestaurant.coordinates?.lng || coords.lng
      )
    : 0;

  const winnerOpen = winnerRestaurant ? isRestaurantOpenNow(winnerRestaurant.openingHours) : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-600 dark:text-amber-400 text-xs font-extrabold border border-amber-300 dark:border-amber-800">
          <Flame className="w-3.5 h-3.5 text-orange-500" />
          <span>{lang === 'bn' ? 'ফুডি লটারি ড্র ও জ্যাকপট' : 'Foodie Mystery Lottery'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-zinc-900 dark:text-white">
          {lang === 'bn' ? 'কোথায় খাব? ফুডি লটারি ড্র' : 'Where To Eat? Foodie Lottery Draw'}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
          {lang === 'bn'
            ? 'নির্দিষ্ট কোনো চাকা নয়! খাবার, ছাড় এবং ফটোজেনিক ভাইব নিয়ে এলো ডিজিটাল লটারি স্লট মেশিন। যেকোনো শহর বা জিপিএস লোকেশনে প্রযোজ্য।'
            : 'No fixed names or wheels! Spin the 3-reel lottery drum for craving, deal, and photo vibe across any location.'}
        </p>
      </div>

      {/* Location Picker (Accessible anywhere, not fixed!) */}
      <div className="p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 shrink-0">
            {lang === 'bn' ? 'লোকেশন নির্বাচন (যেকোনো স্থান):' : 'Location Target (Anywhere):'}
          </span>
          <input
            type="text"
            value={customLocation}
            onChange={(e) => {
              setCustomLocation(e.target.value);
              setIsUsingGps(false);
            }}
            placeholder={lang === 'bn' ? 'যেমন: ধানমন্ডি, গুলশান, সিলেট, চট্টগ্রাম, মিরপুর...' : 'e.g. Banani, Sylhet, Mirpur, Cox’s Bazar...'}
            className="flex-1 px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <button
          onClick={() => {
            setCustomLocation('My Current Location');
            setIsUsingGps(true);
          }}
          className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 ${
            isUsingGps
              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-300'
              : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
          }`}
        >
          <Crosshair className="w-3.5 h-3.5 text-rose-600" />
          <span>{lang === 'bn' ? 'আমার লাইভ জিপিএস' : 'Use My GPS'}</span>
        </button>
      </div>

      {/* Lottery Drum / Slot Machine Reels */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 text-white border border-zinc-800 shadow-2xl relative overflow-hidden">
        
        {/* Glowing Ambient Backdrop */}
        <div className="absolute -top-16 -left-16 w-60 h-60 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-60 h-60 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* 3 Reels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          
          {/* Reel 1: Craving / Food */}
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1">
              <Utensils className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? '১. খাবারের পদ' : '1. Dish / Craving'}</span>
            </span>

            <div className={`w-full aspect-16/10 rounded-2xl bg-zinc-800/80 border-2 flex flex-col items-center justify-center p-4 text-center transition-all ${
              isSpinning ? 'border-amber-400 shadow-lg shadow-amber-400/20 animate-pulse' : 'border-zinc-700'
            }`}>
              <span className="text-4xl sm:text-5xl mb-2 transition-transform duration-100">
                {reelDishes[reel1Index].icon}
              </span>
              <span className="font-extrabold text-sm sm:text-base text-white line-clamp-1">
                {lang === 'bn' ? reelDishes[reel1Index].nameBn : reelDishes[reel1Index].nameEn}
              </span>
            </div>
          </div>

          {/* Reel 2: Budget & Deal Jackpot */}
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 mb-2 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? '২. বাজেট ও অফার' : '2. Budget & Deal'}</span>
            </span>

            <div className={`w-full aspect-16/10 rounded-2xl bg-zinc-800/80 border-2 flex flex-col items-center justify-center p-4 text-center transition-all ${
              isSpinning ? 'border-rose-400 shadow-lg shadow-rose-400/20 animate-pulse' : 'border-zinc-700'
            }`}>
              <span className="text-4xl sm:text-5xl mb-2 transition-transform duration-100">
                {reelDeals[reel2Index].icon}
              </span>
              <span className="font-extrabold text-sm sm:text-base text-white line-clamp-1">
                {lang === 'bn' ? reelDeals[reel2Index].nameBn : reelDeals[reel2Index].nameEn}
              </span>
            </div>
          </div>

          {/* Reel 3: Vibe & Photo Spot */}
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 mb-2 flex items-center gap-1">
              <Camera className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? '৩. ফটোজেনিক পরিবেশ' : '3. Photo Atmosphere'}</span>
            </span>

            <div className={`w-full aspect-16/10 rounded-2xl bg-zinc-800/80 border-2 flex flex-col items-center justify-center p-4 text-center transition-all ${
              isSpinning ? 'border-purple-400 shadow-lg shadow-purple-400/20 animate-pulse' : 'border-zinc-700'
            }`}>
              <span className="text-4xl sm:text-5xl mb-2 transition-transform duration-100">
                {reelVibes[reel3Index].icon}
              </span>
              <span className="font-extrabold text-sm sm:text-base text-white line-clamp-1">
                {lang === 'bn' ? reelVibes[reel3Index].nameBn : reelVibes[reel3Index].nameEn}
              </span>
            </div>
          </div>
        </div>

        {/* Spin Lever CTA Button */}
        <div className="mt-8 flex justify-center relative z-10">
          <button
            onClick={handleDrawLottery}
            disabled={isSpinning}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-600 to-orange-500 hover:from-amber-400 hover:to-rose-500 text-white font-black text-base sm:text-lg flex items-center gap-3 shadow-xl shadow-rose-600/40 active:scale-95 transition-all disabled:opacity-60"
          >
            <RotateCw className={`w-6 h-6 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? (lang === 'bn' ? 'লটারি ড্র চলছে...' : 'Rolling Lottery...') : (lang === 'bn' ? 'জ্যাকপট ড্র শুরু করুন!' : 'SPIN LOTTERY JACKPOT!')}</span>
            <Sparkles className="w-5 h-5 text-amber-300" />
          </button>
        </div>
      </div>

      {/* Winner Spotlight Card */}
      {winnerRestaurant && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 text-white shadow-2xl animate-fade-in space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-200 text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-5 h-5 text-amber-300" />
              <span>{lang === 'bn' ? 'আজকের লটারি বিজয়ী রেস্তোরাঁ!' : 'Lottery Winner Chosen Spot!'}</span>
            </div>

            {winnerOpen && (
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-white/20 backdrop-blur-md">
                {lang === 'bn' ? winnerOpen.labelBn : winnerOpen.labelEn}
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-4xl font-black">
                {lang === 'bn' ? winnerRestaurant.nameBn : winnerRestaurant.name}
              </h2>
              <p className="text-sm text-rose-100 font-medium flex items-center gap-2">
                <span>{winnerRestaurant.address}</span>
                <span>•</span>
                <span>{winnerDist} km {lang === 'bn' ? 'দূরে' : 'away'}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={getGoogleMapsRouteUrl(
                  winnerRestaurant.coordinates?.lat || coords.lat,
                  winnerRestaurant.coordinates?.lng || coords.lng,
                  winnerRestaurant.name,
                  userCoords
                )}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-white text-rose-700 font-extrabold text-xs flex items-center gap-1.5 shadow-md hover:bg-zinc-100 transition-colors"
              >
                <Navigation className="w-4 h-4" />
                <span>{lang === 'bn' ? 'ম্যাপস রুট' : 'Live Route'}</span>
              </a>

              <button
                onClick={() => onSelectRestaurant(winnerRestaurant)}
                className="px-4 py-2.5 rounded-xl bg-zinc-950/40 border border-white/30 text-white font-extrabold text-xs hover:bg-zinc-950/60 transition-colors"
              >
                {lang === 'bn' ? 'বিস্তারিত মেনু' : 'Full Spot'}
              </button>
            </div>
          </div>

          {/* Winning Recipe & Photography tip */}
          <div className="pt-3 border-t border-white/20 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-amber-300 shrink-0" />
              <span>
                <strong>{lang === 'bn' ? 'যা অর্ডার করবেন: ' : 'Signature Dish: '}</strong>
                {winnerRestaurant.popularDishes[0]?.name || 'House Special'} (৳{winnerRestaurant.popularDishes[0]?.priceBDT || winnerRestaurant.avgPricePerPersonBDT})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="line-clamp-1">
                <strong>{lang === 'bn' ? 'ফটোস্পট: ' : 'Photo Vibe: '}</strong>
                {lang === 'bn' ? winnerRestaurant.photographyHighlights.bn : winnerRestaurant.photographyHighlights.en}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
