import React from 'react';
import { Utensils, Compass, Map, Sparkles, Dices, Tag, Bookmark, Sun, Moon, Globe, User } from 'lucide-react';
import { Language, Theme } from '../types';
import { translations } from '../data/translations';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  theme,
  onToggleTheme,
  activeTab,
  onSelectTab,
  savedCount,
}) => {
  const t = translations[lang];

  const navItems = [
    { id: 'explore', label: t.navExplore, icon: Compass },
    { id: 'map', label: lang === 'bn' ? '২ডি ম্যাপ' : '2D Map', icon: Map, badge: 'LIVE' },
    { id: 'wizard', label: t.navWizard, icon: Sparkles, badge: 'AI' },
    { id: 'roulette', label: lang === 'bn' ? 'লটারি ড্র' : 'Lottery Draw', icon: Dices },
    { id: 'offers', label: t.navOffers, icon: Tag },
    { id: 'saved', label: t.navSaved, icon: Bookmark, count: savedCount },
    { id: 'account', label: lang === 'bn' ? 'প্রোফাইল' : 'Profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 dark:bg-zinc-950/90 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Branding */}
          <div 
            onClick={() => onSelectTab('explore')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-rose-600 to-orange-500 p-0.5 shadow-md shadow-rose-600/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white dark:bg-zinc-950 rounded-[14px] flex items-center justify-center">
                <Utensils className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600 dark:text-rose-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                  {lang === 'bn' ? 'কোথায় খাব?' : 'Kothay Khabo'}
                </span>
                <span className="hidden md:inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                  {lang === 'bn' ? 'বাংলাদেশ' : 'BD Dining'}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-medium line-clamp-1">
                {lang === 'bn' ? '২ডি ম্যাপ • দূরত্ব • গুগল ম্যাপস রিভিউ • লাইভ ছাড়' : '2D Map • Google Reviews • Deals • AI'}
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all relative ${
                    isActive
                      ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-rose-600 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                  {typeof item.count === 'number' && item.count > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: BN/EN toggle & Dark/Light toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* BN / EN Toggle */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 hover:border-rose-400 text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
              title="Toggle Bangla / English"
            >
              <Globe className="w-3.5 h-3.5 text-rose-600" />
              <span>{lang === 'bn' ? 'বাংলা' : 'EN'}</span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-normal">
                {lang === 'bn' ? '/ EN' : '/ বাং'}
              </span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 sm:p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 hover:text-rose-600 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-xs cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-700 hover:-rotate-12 transition-transform" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
