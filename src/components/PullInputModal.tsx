import React, { useState } from 'react';
import { X } from 'lucide-react';
import { BannerType, PullInput } from '../types/banners';

interface PullInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (pullInput: PullInput, pullCount: number) => void;
  bannerType: BannerType;
  pullCount: number;
}

export function PullInputModal({ isOpen, onClose, onSubmit, bannerType, pullCount }: PullInputModalProps) {
  const [rarity, setRarity] = useState<3 | 4 | 5>(3);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isChosenItem, setIsChosenItem] = useState(false);
  const [isGuaranteed, setIsGuaranteed] = useState(false);
  const [radianceUsed, setRadianceUsed] = useState<number>(0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ 
      rarity, 
      isFeatured, 
      isChosenItem, 
      isGuaranteed,
      radianceUsed: radianceUsed > 0 ? radianceUsed : undefined 
    }, pullCount);
    onClose();
    setRarity(3);
    setIsFeatured(false);
    setIsChosenItem(false);
    setIsGuaranteed(false);
    setRadianceUsed(0);
  };

  const showFeaturedOption = (rarity === 4 || rarity === 5) && bannerType !== 'standard';
  const showChosenOption = rarity === 5 && (bannerType === 'weapon' || bannerType === 'chronicled');
  const showGuaranteedOption = rarity === 5;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-sm mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Add {pullCount} Pull{pullCount > 1 ? 's' : ''}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Radiance Used (optional):
            </label>
            <input
              type="number"
              min="0"
              value={radianceUsed}
              onChange={(e) => setRadianceUsed(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter radiance amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Highest Rarity Obtained:
            </label>
            <div className="space-y-2">
              {[3, 4, 5].map((rarityOption) => (
                <label key={rarityOption} className="flex items-center">
                  <input
                    type="radio"
                    name="rarity"
                    value={rarityOption}
                    checked={rarity === rarityOption}
                    onChange={(e) => setRarity(Number(e.target.value) as 3 | 4 | 5)}
                    className="mr-2"
                  />
                  <span className={`font-medium ${
                    rarityOption === 5 ? 'text-yellow-600' : 
                    rarityOption === 4 ? 'text-purple-600' : 'text-blue-600'
                  }`}>
                    {rarityOption}-Star
                  </span>
                </label>
              ))}
            </div>
          </div>

          {showFeaturedOption && (
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">
                  {rarity === 5 ? 'Was it a featured item?' : 'Was it a featured 4-star?'}
                </span>
              </label>
            </div>
          )}

          {showGuaranteedOption && (
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isGuaranteed}
                  onChange={(e) => setIsGuaranteed(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">
                  Was this a guaranteed 5-star? (e.g., from radiance, pity, or previous guarantee)
                </span>
              </label>
            </div>
          )}

          {showChosenOption && (
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isChosenItem}
                  onChange={(e) => setIsChosenItem(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">
                  {bannerType === 'weapon' 
                    ? 'Was it your Epitomized Path weapon?' 
                    : 'Was it your Chronicled Path item?'}
                </span>
              </label>
            </div>
          )}

          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Pull{pullCount > 1 ? 's' : ''}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}