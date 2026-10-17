import React from 'react';
import { Map, SlidersHorizontal, Sparkles, Dices, User } from 'lucide-react';
import { Language } from '../types';

interface BottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  lang: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  lang,
}) => {
  const tabs = [
    {
      id: 'map',
      labelBn: '২ডি ম্যাপ',
      labelEn: '2D Map',
      icon: Map,
      badge: 'LIVE',
    },
    {
      id: 'explore',
      labelBn: 'খাবার ও ফিল্টার',
      labelEn: 'Filter & Eat',
      icon: SlidersHorizontal,
    },
    {
      id: 'wizard',
      labelBn: 'এআই পরামর্শ',
      labelEn: 'AI Suggest',
      icon: Sparkles,
      badge: 'AI',
    },
    {
      id: 'roulette',
      labelBn: 'লটারি ড্র',
      labelEn: 'Lottery',
      icon: Dices,
    },
    {
      id: 'account',
      labelBn: 'প্রোফাইল',
      labelEn: 'Profile',
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-200 dark:border-zinc-800 shadow-2xl transition-colors">
      <div className="max-w-md mx-auto px-3 py-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                onSelectTab(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all relative ${
                isActive
                  ? 'text-rose-600 dark:text-rose-400 font-extrabold scale-105'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-3 text-[8px] font-black px-1 rounded-full bg-rose-600 text-white animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
                {lang === 'bn' ? tab.labelBn : tab.labelEn}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
