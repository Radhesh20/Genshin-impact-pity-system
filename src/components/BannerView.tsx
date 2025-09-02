import React, { useState } from 'react';
import { Plus, RotateCcw } from 'lucide-react';
import { BannerState, BannerType, PullInput } from '../types/banners';
import { PullInputModal } from './PullInputModal';
import { PullHistory } from './PullHistory';
import { ResetConfirmModal } from './ResetConfirmModal';
import { calculateNewPity, getPityDisplayText, getMaxPity } from '../utils/pityLogic';

interface BannerViewProps {
  bannerType: BannerType;
  bannerState: BannerState;
  onUpdateBanner: (newState: BannerState) => void;
}

const bannerNames = {
  character: 'Limited Character Banner',
  weapon: 'Weapon Banner',
  standard: 'Standard Banner',
  chronicled: 'Chronicled Banner',
};

export function BannerView({ bannerType, bannerState, onUpdateBanner }: BannerViewProps) {
  const [pullModalOpen, setPullModalOpen] = useState(false);
  const [pullCount, setPullCount] = useState(1);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const maxPity = getMaxPity(bannerType);
  const guaranteeText = getPityDisplayText(bannerType, bannerState);

  const handlePullSubmit = (pullInput: PullInput, count: number) => {
    const newState = calculateNewPity(bannerState, bannerType, pullInput, count);
    onUpdateBanner(newState);
  };

  const handleReset = () => {
    const resetState: BannerState = {
      pity4: 0,
      pity5: 0,
      isGuaranteed5: false,
      fatePoints: 0,
      chosenItem: undefined,
      pullHistory: [],
      totalPulls: 0,
      totalRadiance: 0,
    };
    onUpdateBanner(resetState);
    setResetModalOpen(false);
  };

  const openPullModal = (count: number) => {
    setPullCount(count);
    setPullModalOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{bannerNames[bannerType]}</h2>
        <p className="text-gray-600">{guaranteeText}</p>
      </div>

      {/* Pity Counters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">5-Star Pity</h3>
          <div className="text-3xl font-bold text-yellow-900">
            {bannerState.pity5} / {maxPity}
          </div>
          <div className="w-full bg-yellow-200 rounded-full h-2 mt-3">
            <div
              className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(bannerState.pity5 / maxPity) * 100}%` }}
            />
          </div>
          {bannerState.pity5 >= maxPity - 10 && (
            <div className="text-xs text-yellow-700 mt-2">
              Soft pity active!
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <h3 className="text-lg font-semibold text-purple-800 mb-2">4-Star Pity</h3>
          <div className="text-3xl font-bold text-purple-900">
            {bannerState.pity4} / 10
          </div>
          <div className="w-full bg-purple-200 rounded-full h-2 mt-3">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(bannerState.pity4 / 10) * 100}%` }}
            />
          </div>
          {bannerState.pity4 >= 9 && (
            <div className="text-xs text-purple-700 mt-2">
              4-star guaranteed next!
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Total Radiance</h3>
          <div className="text-3xl font-bold text-blue-900">
            {bannerState.totalRadiance}
          </div>
          <div className="text-sm text-blue-700 mt-2">
            Radiance used for pulls
          </div>
          <div className="text-xs text-blue-600 mt-1">
            Avg: {bannerState.totalPulls > 0 ? (bannerState.totalRadiance / bannerState.totalPulls).toFixed(1) : '0'} per pull
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-2">Statistics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total Pulls:</span>
            <div className="font-semibold text-gray-800">{bannerState.totalPulls}</div>
          </div>
          <div>
            <span className="text-gray-600">5-Stars:</span>
            <div className="font-semibold text-yellow-600">
              {bannerState.pullHistory.filter(p => p.rarity === 5).length}
            </div>
          </div>
          <div>
            <span className="text-gray-600">4-Stars:</span>
            <div className="font-semibold text-purple-600">
              {bannerState.pullHistory.filter(p => p.rarity === 4).length}
            </div>
          </div>
          <div>
            <span className="text-gray-600">Guaranteed Pulls:</span>
            <div className="font-semibold text-orange-600">
              {bannerState.pullHistory.filter(p => p.isGuaranteed).length}
            </div>
          </div>
        </div>
      </div>

      {/* Special Status */}
      {(bannerType === 'weapon' && bannerState.fatePoints > 0) && (
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200">
          <h4 className="font-semibold text-indigo-800 mb-1">Epitomized Path</h4>
          <p className="text-indigo-700">Fate Points: {bannerState.fatePoints} / 2</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => openPullModal(1)}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add 1 Pull</span>
        </button>
        <button
          onClick={() => openPullModal(10)}
          className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add 10 Pulls</span>
        </button>
        <button
          onClick={() => setResetModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <RotateCcw size={16} />
          <span>Reset</span>
        </button>
      </div>

      {/* Pull History */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Pull History</h3>
        <PullHistory pullHistory={bannerState.pullHistory} />
      </div>

      {/* Modals */}
      <PullInputModal
        isOpen={pullModalOpen}
        onClose={() => setPullModalOpen(false)}
        onSubmit={handlePullSubmit}
        bannerType={bannerType}
        pullCount={pullCount}
      />

      <ResetConfirmModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={handleReset}
        bannerType={bannerType}
      />
    </div>
  );
}