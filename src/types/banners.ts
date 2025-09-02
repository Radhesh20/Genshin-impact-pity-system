export interface PullResult {
  id: string;
  pullNumber: number;
  rarity: 3 | 4 | 5;
  timestamp: number;
  isFeatured?: boolean;
  isChosenItem?: boolean;
}

export interface BannerState {
  pity4: number;
  pity5: number;
  isGuaranteed5: boolean;
  fatePoints: number;
  chosenItem?: string;
  pullHistory: PullResult[];
  totalPulls: number;
}

export type BannerType = 'character' | 'weapon' | 'standard' | 'chronicled';

export interface BannerData {
  character: BannerState;
  weapon: BannerState;
  standard: BannerState;
  chronicled: BannerState;
}

export interface PullInput {
  rarity: 3 | 4 | 5;
  isFeatured?: boolean;
  isChosenItem?: boolean;
}