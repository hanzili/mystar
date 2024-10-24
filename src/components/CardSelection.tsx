import React, { useMemo } from 'react';
import {
  Box,
  Grid,
  Heading,
  Text,
  Image,
  useBreakpointValue,
  chakra,
  Tooltip,
  Container,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { tarotCards, tarotCardImages } from '../utils/tarotCards';
import { useCardSelection } from '../hooks/useCardSelections';
import { useCommonColors } from '../utils/theme';

const MotionBox = chakra(motion.div);

interface CardSelectionProps {
  onSelect: (cards: { name: string; isReversed: boolean }[]) => void;
}

const CardSelection: React.FC<CardSelectionProps> = ({ onSelect }) => {
  const { selectedCards, flippedCards, isRevealing, handleCardClick } =
    useCardSelection(onSelect);

  const cardSize = useBreakpointValue({
    base: { width: '40px', height: '60px' },
    sm: { width: '50px', height: '75px' },
    md: { width: '60px', height: '90px' },
    lg: { width: '70px', height: '105px' },
    xl: { width: '80px', height: '120px' },
  });

  const { text, accent, cardBg, border } = useCommonColors();

  const guidanceText = [
    'Trust your intuition as you select your cards.',
    'Let your energy guide you to the cards that resonate with you.',
    'Choose cards that catch your eye or evoke a feeling.',
    'There are no wrong choices - each card has a message for you.',
  ];

  const cardMessages = [
    "I'm your hidden potential unlocked!",
    "Brace yourself for a wild change ride!",
    "I'm your inner strength, unleashed!",
    "Challenge-busting secrets inside!",
    "Psst... juicy wisdom right here!",
    "All aboard the self-discovery express!",
    "Time to face those sneaky feelings!",
    "Your cosmic purpose GPS, at your service!",
    "Fear-kicking partner, reporting for duty!",
    "Let's make your intuition boogie!",
    "Opportunity knocks - I'm the door!",
    "Balance master, at your fingertips!",
    "Past and present's favorite party mix!",
    "Superhero cape, now with extra sparkle!",
    "Dream big, win bigger - that's my motto!",
    "Serving up a joy platter, just for you!",
    "Spiritual teacher with a funky twist!",
    "Your inner voice's new bestie!",
    "Change is coming - let's dance!",
    "Authenticity booster, activated!",
  ];

  const randomizedCardMessages = useMemo(() => {
    return tarotCards.reduce((acc, card) => {
      acc[card] = cardMessages[Math.floor(Math.random() * cardMessages.length)];
      return acc;
    }, {} as Record<string, string>);
  }, []);

  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h2" size="xl" color={accent} textAlign="center" mb={4}>
        {isRevealing ? 'Revealing Your Cards' : 'Select 3 Cards'}
      </Heading>
      <Text fontSize="lg" fontWeight="medium" color={accent} textAlign="center" mb={4}>
        {isRevealing
          ? 'Preparing your reading...'
          : `${selectedCards.length}/3 cards selected`}
      </Text>

      <AnimatePresence>
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition="0.5s"
          textAlign="center"
          mb={8}
        >
          <Text fontSize="md" color={text} fontStyle="italic">
            {guidanceText[Math.floor(Math.random() * guidanceText.length)]}
          </Text>
        </MotionBox>
      </AnimatePresence>

      <Grid
        templateColumns={`repeat(auto-fill, minmax(${cardSize?.width}, 1fr))`}
        gap={4}
        justifyContent="center"
      >
        {tarotCards.map((card, index) => (
          <Tooltip
            key={index}
            label={randomizedCardMessages[card]}
            placement="top"
          >
            <MotionBox
              onClick={() => handleCardClick(card)}
              width={cardSize?.width}
              height={cardSize?.height}
              position="relative"
              cursor="pointer"
              initial={false}
              animate={{
                rotateY: flippedCards.includes(card) ? 180 : 0,
                scale: selectedCards.some((c) => c.name === card) ? 1.05 : 1,
              }}
              whileHover={{ scale: 1.1 }}
              transition="0.4s spring"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Card Back */}
              <Box
                position="absolute"
                width="100%"
                height="100%"
                borderRadius="md"
                bg={cardBg}
                border="2px solid"
                borderColor={border}
                style={{ backfaceVisibility: 'hidden' }}
                display="flex"
                alignItems="center"
                justifyContent="center"
                overflow="hidden"
                boxShadow={
                  selectedCards.some((c) => c.name === card)
                    ? `0 0 15px #f6e05e`
                    : 'md'
                }
              >
                <Image
                  src="/images/tarot/card-back.png"
                  alt="Card Back"
                  objectFit="cover"
                  width="100%"
                  height="100%"
                />
              </Box>

              {/* Card Front */}
              <Box
                position="absolute"
                width="100%"
                height="100%"
                borderRadius="md"
                bg={cardBg}
                border="2px solid"
                borderColor={border}
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
                display="flex"
                alignItems="center"
                justifyContent="center"
                overflow="hidden"
                boxShadow="md"
              >
                <Image
                  src={tarotCardImages[card]}
                  alt={card}
                  objectFit="cover"
                  width="100%"
                  height="100%"
                  transform={
                    selectedCards.find((c) => c.name === card)?.isReversed
                      ? 'rotate(180deg)'
                      : 'none'
                  }
                />
              </Box>
            </MotionBox>
          </Tooltip>
        ))}
      </Grid>
    </Container>
  );
};

export default CardSelection;
