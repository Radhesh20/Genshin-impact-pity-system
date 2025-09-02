import React from 'react';
import { PullResult } from '../types/banners';

interface PullHistoryProps {
  pullHistory: PullResult[];
}

export function PullHistory({ pullHistory }: PullHistoryProps) {
  const sortedHistory = [...pullHistory].sort((a, b) => b.timestamp - a.timestamp);

  if (pullHistory.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
        No pulls recorded yet
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
      <div className="p-3 border-b border-gray-200 bg-gray-50 font-medium text-gray-700">
        Pull History ({pullHistory.length} total)
      </div>
      <div className="divide-y divide-gray-100">
        {sortedHistory.map((pull) => (
          <div key={pull.id} className="p-3 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">#{pull.pullNumber}</span>
              <span className={`font-semibold ${
                pull.rarity === 5 ? 'text-yellow-600' : 
                pull.rarity === 4 ? 'text-purple-600' : 'text-blue-600'
              }`}>
                {pull.rarity}★
              </span>
              {pull.isFeatured && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  Featured
                </span>
              )}
              {pull.isChosenItem && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Chosen
                </span>
              )}
            </div>
            <span className="text-xs text-gray-400">
              {new Date(pull.timestamp).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}