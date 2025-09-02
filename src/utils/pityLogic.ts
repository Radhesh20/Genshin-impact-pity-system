import { BannerState, BannerType, PullInput, PullResult } from '../types/banners';

export function calculateNewPity(
  bannerState: BannerState,
  bannerType: BannerType,
  pullInput: PullInput,
  pullCount: number
): BannerState {
  const newState = { ...bannerState };
  const newPulls: PullResult[] = [];

  // Add radiance to total if specified
  if (pullInput.radianceUsed) {
    newState.totalRadiance += pullInput.radianceUsed;
  }

  for (let i = 0; i < pullCount; i++) {
    newState.pity4++;
    newState.pity5++;
    newState.totalPulls++;

    const pullResult: PullResult = {
      id: crypto.randomUUID(),
      pullNumber: newState.totalPulls,
      rarity: pullInput.rarity,
      timestamp: Date.now(),
      isFeatured: pullInput.isFeatured,
      isChosenItem: pullInput.isChosenItem,
      isGuaranteed: pullInput.isGuaranteed,
      radianceUsed: i === 0 ? pullInput.radianceUsed : undefined, // Only apply radiance to first pull
    };

    // Handle 4-star
    if (pullInput.rarity === 4) {
      newState.pity4 = 0;
    }

    // Handle 5-star
    if (pullInput.rarity === 5) {
      newState.pity4 = 0;
      newState.pity5 = 0;

      // Only apply guarantee logic if this wasn't a guaranteed pull (like from radiance)
      if (!pullInput.isGuaranteed) {
        // Banner-specific logic
        switch (bannerType) {
          case 'character':
            if (newState.isGuaranteed5) {
              // This is a guaranteed featured character
              newState.isGuaranteed5 = false;
            } else {
              // 50/50 chance
              if (!pullInput.isFeatured) {
                newState.isGuaranteed5 = true;
              }
            }
            break;

          case 'weapon':
            if (pullInput.isChosenItem) {
              // Got the chosen weapon, reset fate points
              newState.fatePoints = 0;
            } else if (!pullInput.isFeatured) {
              // Got off-banner 5-star, increment fate points
              newState.fatePoints = Math.min(newState.fatePoints + 1, 2);
            } else {
              // Got featured weapon but not chosen one, increment fate points
              newState.fatePoints = Math.min(newState.fatePoints + 1, 2);
            }
            break;

          case 'chronicled':
            if (newState.isGuaranteed5) {
              // This is a guaranteed chosen item
              newState.isGuaranteed5 = false;
            } else {
              // 50/50 chance
              if (!pullInput.isChosenItem) {
                newState.isGuaranteed5 = true;
              }
            }
            break;

          case 'standard':
            // No special guarantee system
            break;
        }
      } else {
        // If it was a guaranteed pull, reset appropriate guarantees
        if (bannerType === 'character' || bannerType === 'chronicled') {
          newState.isGuaranteed5 = false;
        } else if (bannerType === 'weapon' && pullInput.isChosenItem) {
          newState.fatePoints = 0;
        }
      }
    }

    newPulls.push(pullResult);
  }

  newState.pullHistory = [...newState.pullHistory, ...newPulls];
  return newState;
}

export function getPityDisplayText(bannerType: BannerType, bannerState: BannerState): string {
  switch (bannerType) {
    case 'character':
      if (bannerState.isGuaranteed5) {
        return "Next 5-Star is Guaranteed to be the featured character!";
      }
      return "50/50 Chance for featured character";

    case 'weapon':
      if (bannerState.fatePoints === 2) {
        return "Next 5-Star is Guaranteed to be your chosen weapon!";
      }
      if (bannerState.fatePoints === 1) {
        return `Epitomized Path: ${bannerState.fatePoints}/2 Fate Points`;
      }
      return "No Epitomized Path progress";

    case 'chronicled':
      if (bannerState.isGuaranteed5) {
        return "Next 5-Star is Guaranteed to be your chosen item!";
      }
      return "50/50 Chance for chosen item";

    case 'standard':
      return "Standard Banner - No guarantees";

    default:
      return "";
  }
}

export function getMaxPity(bannerType: BannerType): number {
  return bannerType === 'weapon' ? 80 : 90;
}