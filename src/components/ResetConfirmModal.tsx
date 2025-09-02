import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { BannerType } from '../types/banners';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bannerType: BannerType;
}

const bannerNames = {
  character: 'Limited Character Banner',
  weapon: 'Weapon Banner',
  standard: 'Standard Banner',
  chronicled: 'Chronicled Banner',
};

export function ResetConfirmModal({ isOpen, onClose, onConfirm, bannerType }: ResetConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-sm mx-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="text-red-500" size={20} />
            <h3 className="text-lg font-semibold text-gray-800">Confirm Reset</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          Are you sure you want to reset all data for the <strong>{bannerNames[bannerType]}</strong>?
          This will clear your pity counters, guarantees, and pull history. This action cannot be undone.
        </p>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Reset Data
          </button>
        </div>
      </div>
    </div>
  );
}