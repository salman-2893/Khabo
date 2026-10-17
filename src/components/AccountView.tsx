import React, { useState } from 'react';
import { 
  User, ShieldCheck, Building2, Heart, PlusCircle, 
  Bookmark, Check, Utensils, Star, MapPin, Tag, Sparkles 
} from 'lucide-react';
import { Restaurant, Language } from '../types';
import { translations } from '../data/translations';

interface AccountViewProps {
  lang: Language;
  restaurants: Restaurant[];
  savedCount: number;
  onOpenAddModal: () => void;
  onSelectTab: (tab: string) => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  lang,
  restaurants,
  savedCount,
  onOpenAddModal,
  onSelectTab,
}) => {
  const t = translations[lang];

  // User Profile State (persisted in localStorage)
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('kothay_khabo_username') || 'Bangladeshi Foodie';
  });
  const [userRole, setUserRole] = useState<'foodie' | 'owner'>(() => {
    return (localStorage.getItem('kothay_khabo_role') as any) || 'foodie';
  });
  const [favoriteCuisines, setFavoriteCuisines] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('kothay_khabo_fav_cuisines');
      return stored ? JSON.parse(stored) : ['Kacchi Biryani', 'Mustard Tehari', 'Naga Burgers'];
    } catch {
      return ['Kacchi Biryani', 'Mustard Tehari', 'Naga Burgers'];
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const availableCuisines = [
    { id: 'Kacchi Biryani', bn: 'কাচ্চি বিরিয়ানি', en: 'Kacchi Biryani' },
    { id: 'Mustard Tehari', bn: 'সরিষার তেহারি', en: 'Mustard Tehari' },
    { id: 'Naga Burgers', bn: 'নাগা বার্গার', en: 'Naga Burgers' },
    { id: 'Rooftop Cafes', bn: 'রুফটপ ক্যাফে ও আড্ডা', en: 'Rooftop Cafes' },
    { id: 'Deshi Vorta', bn: 'দেশি খানা ও ভর্তা', en: 'Deshi Vorta' },
    { id: 'Steaks & BBQ', bn: 'স্টেক ও কাবাব', en: 'Steaks & BBQ' },
    { id: 'Italian Pizza', bn: 'ইতালিয়ান পিৎজা', en: 'Italian Pizza' },
    { id: 'Fuchka & Cha', bn: 'ফুচকা ও স্পেশাল চা', en: 'Fuchka & Cha' },
  ];

  const handleToggleCuisine = (cId: string) => {
    setFavoriteCuisines((prev) => {
      const updated = prev.includes(cId)
        ? prev.filter((item) => item !== cId)
        : [...prev, cId];
      localStorage.setItem('kothay_khabo_fav_cuisines', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('kothay_khabo_username', userName);
    localStorage.setItem('kothay_khabo_role', userRole);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      
      {/* Account Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 via-orange-600 to-amber-500 p-0.5 shadow-lg">
            <div className="w-full h-full bg-white dark:bg-zinc-950 rounded-[14px] flex items-center justify-center">
              {userRole === 'owner' ? (
                <Building2 className="w-8 h-8 text-rose-600" />
              ) : (
                <User className="w-8 h-8 text-rose-600" />
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
                {userName}
              </h1>
              {userRole === 'owner' ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 flex items-center gap-1 border border-emerald-300 dark:border-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'রেস্তোরাঁ মালিক' : 'Owner Account'}</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300">
                  {lang === 'bn' ? 'ভোজনরসিক ফুডি' : 'Community Foodie'}
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              {restaurants.length} {lang === 'bn' ? 'টি রেস্তোরাঁ ডিরেক্টরিতে সক্রিয় • ' : 'restaurants in directory • '} 
              <button 
                onClick={() => onSelectTab('saved')} 
                className="text-rose-600 hover:underline font-bold"
              >
                {savedCount} {lang === 'bn' ? 'টি বুকমার্ক করা' : 'saved spots'}
              </button>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 text-zinc-800 dark:text-zinc-200 text-xs font-bold transition-colors"
          >
            {isEditing ? (lang === 'bn' ? 'বাতিল' : 'Cancel') : (lang === 'bn' ? 'প্রোফাইল পরিবর্তন' : 'Edit Profile')}
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{lang === 'bn' ? 'রেস্তোরাঁ যোগ করুন' : 'Add Restaurant'}</span>
          </button>
        </div>
      </div>

      {/* Profile Edit Form */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-4 animate-fade-in">
          <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white">
            {lang === 'bn' ? 'আপনার অ্যাকাউন্ট বিবরণ' : 'Your Account Details'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300 block mb-1">
                {lang === 'bn' ? 'আপনার নাম / প্রদর্শন নাম' : 'Display Name'}
              </label>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300 block mb-1">
                {lang === 'bn' ? 'অ্যাকাউন্টের ধরন' : 'Account Type'}
              </label>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="foodie">{lang === 'bn' ? 'সাধারণ ভোজনরসিক (Foodie)' : 'Community Foodie'}</option>
                <option value="owner">{lang === 'bn' ? 'রেস্তোরাঁর মালিক / স্টাফ (Owner)' : 'Restaurant Owner / Staff'}</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-md"
            >
              {lang === 'bn' ? 'সংরক্ষণ করুন' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}

      {savedSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{lang === 'bn' ? 'প্রোফাইল সফলভাবে আপডেট হয়েছে!' : 'Profile updated successfully!'}</span>
        </div>
      )}

      {/* Favorite Food Cravings */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-extrabold text-base">
          <Utensils className="w-5 h-5 text-rose-600" />
          <span>{lang === 'bn' ? 'আপনার প্রিয় খাবার ও ক্যাটাগরি' : 'My Preferred Cravings & Cuisines'}</span>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {lang === 'bn' 
            ? 'পছন্দের ক্যাটাগরিগুলো নির্বাচন করে রাখুন যাতে দ্রুত রেস্তোরাঁ ও ডিসিশন নিতে সুবিধা হয়।'
            : 'Select your favorite food types to customize your decision results.'}
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {availableCuisines.map((c) => {
            const isSelected = favoriteCuisines.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => handleToggleCuisine(c.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300'
                }`}
              >
                {lang === 'bn' ? c.bn : c.en}
                {isSelected && <span className="ml-1.5">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Owner Verification & Update Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-50 to-orange-50 dark:from-zinc-900 dark:to-zinc-900 border border-rose-200 dark:border-zinc-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-extrabold text-base">
          <Building2 className="w-5 h-5" />
          <span>{lang === 'bn' ? 'রেস্তোরাঁর মালিকদের ভেরিফিকেশন ও তথ্য আপডেট' : 'Restaurant Owner Portal'}</span>
        </div>
        <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
          {lang === 'bn'
            ? 'আপনি কি কোনো রেস্তোরাঁর মালিক বা প্রতিনিধি? আপনার মেনুর দাম, স্পেশাল খাবার, ফটোস্পটের বর্ণনা অথবা ফুডপ্যান্ডা/ব্যাংকের নতুন ডিসকাউন্ট অফার যুক্ত করুন যাতে ভোজনরসিকরা তা সরাসরি দেখতে পায়।'
            : 'Are you a restaurant owner or manager? Keep your menu prices, signature dishes, photogenic highlights, and active promotions updated for local diners.'}
        </p>

        <div className="pt-2">
          <button
            onClick={onOpenAddModal}
            className="px-5 py-2.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold text-xs hover:bg-rose-600 dark:hover:bg-rose-600 dark:hover:text-white transition-colors shadow-md flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{lang === 'bn' ? 'রেস্তোরাঁর তথ্য ও অফার আপডেট করুন' : 'Submit / Update Profile & Deals'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
