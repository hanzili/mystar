import { TarotReading as DbTarotReading } from '../lib/types';
import { TarotReading as FrontendTarotReading, Prediction, SelectedCard } from '../types/types';

export const readingToFrontendFormat = (dbReading: DbTarotReading | null): FrontendTarotReading | null => {
  if (!dbReading) return null;
  
  const cards: SelectedCard[] = dbReading.cards.split(', ').map(card => {
    const match = card.match(/^(.*?)\s*\((Reversed)?\)$/);
    if (match) {
      return {
        name: match[1],
        isReversed: match[2] === 'Reversed'
      };
    }
    // Fallback in case the format is unexpected
    return {
      name: card,
      isReversed: false
    };
  });

  const prediction: Prediction = JSON.parse(dbReading.prediction);

  return {
    ...dbReading,
    cards,
    prediction
  };
};
