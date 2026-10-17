import React, { useState } from 'react';
import { 
  User, ShieldCheck, Building2, Github, Download, Copy, Check, 
  Smartphone, FileCode, PlusCircle, Bookmark, Sparkles, ExternalLink 
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
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedWorkflow, setCopiedWorkflow] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('kothay_khabo_username', userName);
    localStorage.setItem('kothay_khabo_role', userRole);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleDownloadDatabase = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(restaurants, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = 'kothay-khabo-database.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleCopyDatabaseJson = () => {
    navigator.clipboard.writeText(JSON.stringify(restaurants, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);
  };

  const workflowYamlContent = `name: Build Android APK (Kothay Khabo)
on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install && npm run build
      - uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: '17'
      - uses: android-actions/setup-android@v3
      - run: |
          npm install @capacitor/core @capacitor/cli @capacitor/android
          npx cap add android || true
          npx cap sync android
      - working-directory: android
        run: |
          chmod +x gradlew
          ./gradlew assembleDebug
      - uses: actions/upload-artifact@v4
        with:
          name: Kothay-Khabo-Debug-APK
          path: android/app/build/outputs/apk/debug/app-debug.apk`;

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
              {restaurants.length} {lang === 'bn' ? 'টি রেস্তোরাঁর ডেটাবেস • ' : 'restaurants in database • '} 
              <button 
                onClick={() => onSelectTab('saved')} 
                className="text-rose-600 hover:underline font-bold"
              >
                {savedCount} {lang === 'bn' ? 'টি সংরক্ষিত' : 'saved spots'}
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
            <span>{lang === 'bn' ? 'রেস্তোরাঁ যোগ' : 'Add Spot'}</span>
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

      {/* GitHub APK Builder Work Files Spotlight */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 text-white border border-zinc-800 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-6 h-6 text-rose-500" />
            <h2 className="text-lg sm:text-xl font-black">
              {lang === 'bn' ? 'গিটহাব থেকে সরাসরি অ্যান্ড্রয়েড APK তৈরি করুন' : 'Build Free Android APK via GitHub Actions'}
            </h2>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            {lang === 'bn' ? '১০০% ফ্রি' : '100% Free'}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          {lang === 'bn'
            ? 'আপনার অনুরোধ অনুযায়ী গিটহাবে পুশ করলেই স্বয়ংক্রিয়ভাবে অ্যান্ড্রয়েড APK বিল্ড করার সম্পূর্ণ ওয়ার্কফ্লো কনফিগারেশন যোগ করা হয়েছে (`.github/workflows/build-apk.yml` এবং `capacitor.config.json`)।'
            : 'As requested, complete GitHub Actions configuration files have been added (`.github/workflows/build-apk.yml` and `capacitor.config.json`) so your repository automatically compiles ready-to-install Android APKs for free!'}
        </p>

        {/* Steps to Build APK */}
        <div className="p-4 rounded-2xl bg-zinc-800/80 border border-zinc-700/80 space-y-2 text-xs">
          <span className="font-extrabold text-amber-300 block">
            {lang === 'bn' ? 'কীভাবে APK ডাউনলোড করবেন:' : 'How to get your Android APK:'}
          </span>
          <ol className="list-decimal list-inside space-y-1.5 text-zinc-300 font-medium">
            <li>{lang === 'bn' ? 'এই কোডটি আপনার গিটহাব রিপোজিটরিতে পুশ করুন।' : 'Push this code repository to your GitHub account.'}</li>
            <li>{lang === 'bn' ? 'গিটহাবের "Actions" ট্যাবে যান — বিল্ড প্রক্রিয়া স্বয়ংক্রিয়ভাবে চালু হবে।' : 'Go to the "Actions" tab in your GitHub repo — the build starts automatically.'}</li>
            <li>{lang === 'bn' ? 'বিল্ড শেষ হলে Artifacts সেকশন থেকে "Kothay-Khabo-Debug-APK" সরাসরি মোবাইলে ডাউনলোড করুন!' : 'Download the ready "Kothay-Khabo-Debug-APK" directly to your Android device!'}</li>
          </ol>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              navigator.clipboard.writeText(workflowYamlContent);
              setCopiedWorkflow(true);
              setTimeout(() => setCopiedWorkflow(false), 2500);
            }}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold flex items-center gap-2 transition-colors"
          >
            {copiedWorkflow ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'bn' ? 'ওয়ার্কফ্লো কপি হয়েছে!' : 'Workflow Copied!'}</span>
              </>
            ) : (
              <>
                <FileCode className="w-4 h-4" />
                <span>{lang === 'bn' ? 'গিটহাব ওয়ার্কফ্লো YAML কপি' : 'Copy build-apk.yml'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* GitHub Free Data Export & Backup Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-black text-lg">
          <Github className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />
          <span>{lang === 'bn' ? 'ফ্রি ডেটা ব্যাকআপ ও গিটহাব সিঙ্ক' : 'Free Database Backup & GitHub Sync'}</span>
        </div>

        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {lang === 'bn'
            ? 'এই অ্যাপটি কোনো ব্যয়বহুল পেইড ডেটাবেস ছাড়াই কাজ করার জন্য ডিজাইন করা হয়েছে। আপনি যেকোনো সময় সম্পূর্ণ রেস্তোরাঁ ও অফার ডেটাবেস JSON আকারে ডাউনলোড করে গিটহাব গিস্ট বা রিপোতে ফ্রি রাখতে পারেন।'
            : 'Zero heavy database needed. Download or copy the clean JSON database anytime to host freely on GitHub Gist or your repository.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleDownloadDatabase}
            className="flex-1 py-3 px-4 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 dark:hover:bg-white/90 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>{lang === 'bn' ? 'রেস্তোরাঁ ডেটা JSON ডাউনলোড' : 'Download Database JSON'}</span>
          </button>

          <button
            onClick={handleCopyDatabaseJson}
            className="py-3 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 text-zinc-800 dark:text-zinc-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            {copiedJson ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{t.copiedJson}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>{lang === 'bn' ? 'JSON ক্লিপবোর্ডে কপি' : 'Copy JSON to Clipboard'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
