import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { BannerView } from './components/BannerView';
import { useLocalStorage } from './hooks/useLocalStorage';
import { BannerData, BannerType } from './types/banners';

const initialBannerData: BannerData = {
  character: {
    pity4: 0,
    pity5: 0,
    isGuaranteed5: false,
    fatePoints: 0,
    pullHistory: [],
    totalPulls: 0,
  },
  weapon: {
    pity4: 0,
    pity5: 0,
    isGuaranteed5: false,
    fatePoints: 0,
    pullHistory: [],
    totalPulls: 0,
  },
  standard: {
    pity4: 0,
    pity5: 0,
    isGuaranteed5: false,
    fatePoints: 0,
    pullHistory: [],
    totalPulls: 0,
  },
  chronicled: {
    pity4: 0,
    pity5: 0,
    isGuaranteed5: false,
    fatePoints: 0,
    pullHistory: [],
    totalPulls: 0,
  },
};

const tabs = [
  { id: 'character' as BannerType, label: 'Limited Character' },
  { id: 'weapon' as BannerType, label: 'Weapon Banner' },
  { id: 'standard' as BannerType, label: 'Standard Banner' },
  { id: 'chronicled' as BannerType, label: 'Chronicled Banner' },
];

function App() {
  const [bannerData, setBannerData] = useLocalStorage<BannerData>('genshin-pity-data', initialBannerData);
  const [activeTab, setActiveTab] = useState<BannerType>('character');

  const updateBanner = (bannerType: BannerType, newState: any) => {
    setBannerData(prev => ({
      ...prev,
      [bannerType]: newState,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg">
              <Star className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Genshin Pity Tracker</h1>
              <p className="text-slate-300 text-sm">Track your gacha pity across all banners</p>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex space-x-1 bg-slate-800/50 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 rounded-md transition-all duration-200 font-medium ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 pb-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20">
          <BannerView
            bannerType={activeTab}
            bannerState={bannerData[activeTab]}
            onUpdateBanner={(newState) => updateBanner(activeTab, newState)}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-slate-400 text-sm">
        <p>Genshin Impact Pity Tracker • Keep track of your wishes and guarantees</p>
      </footer>
    </div>
  );
}

export default App;