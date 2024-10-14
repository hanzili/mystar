// src/hooks/useCardSelection.ts
import { useState, useEffect } from 'react';

interface CardSelectionHook {
  selectedCards: { name: string; isReversed: boolean }[];
  flippedCards: string[];
  isRevealing: boolean;
  handleCardClick: (card: string) => void;
}

export const useCardSelection = (onSelect: (cards: { name: string; isReversed: boolean }[]) => void): CardSelectionHook => {
  const [selectedCards, setSelectedCards] = useState<{ name: string; isReversed: boolean }[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    if (selectedCards.length === 3 && !isRevealing) {
      setIsRevealing(true);
      setTimeout(() => {
        setFlippedCards(selectedCards.map(card => card.name));
        setTimeout(() => {
          onSelect(selectedCards);
        }, 2000);
      }, 2000);
    }
  }, [selectedCards, onSelect, isRevealing]);

  const handleCardClick = (card: string) => {
    if (selectedCards.length < 3 && !selectedCards.some(c => c.name === card) && !isRevealing) {
      const isReversed = Math.random() < 0.5; // 50% chance of being reversed
      setSelectedCards(prev => [...prev, { name: card, isReversed }]);
    }
  };

  return { selectedCards, flippedCards, isRevealing, handleCardClick };
};
