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
  useColorModeValue,
  Container,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { tarotCards, tarotCardImages } from '../utils/tarotCards';
import { useCardSelection } from '../hooks/useCardSelections';

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

  const textColor = useColorModeValue('gray.700', 'gray.200');
  const headingColor = useColorModeValue('purple.600', 'purple.300');
  const cardBgColor = useColorModeValue('gray.100', 'gray.700');
  const cardBorderColor = useColorModeValue('purple.300', 'purple.500');

  const guidanceText = [
    'Trust your intuition as you select your cards.',
    'Let your energy guide you to the cards that resonate with you.',
    'Choose cards that catch your eye or evoke a feeling.',
    'There are no wrong choices - each card has a message for you.',
  ];

  const cardMessages = [
    'What secrets do I hold for you?',
    'Are you ready to embrace change?',
    'What hidden potential lies within you?',
    'How can you overcome your current challenges?',
    'What wisdom do you seek?',
    'Are you prepared for a journey of self-discovery?',
    'What emotions are you hiding from yourself?',
    'How can you align with your true purpose?',
    'What fears are holding you back?',
    'Where will your intuition lead you?',
    'What unexpected opportunities await you?',
    'How can you bring more balance into your life?',
    'What past experiences are shaping your present?',
    'Are you ready to step into your power?',
    'What dreams are waiting to be realized?',
    'How can you cultivate more joy in your life?',
    'What lessons are you meant to learn now?',
    'Are you listening to your inner voice?',
    'What transformations are you resisting?',
    'How can you embrace your authentic self?',
  ];

  const randomizedCardMessages = useMemo(() => {
    return tarotCards.reduce((acc, card) => {
      acc[card] = cardMessages[Math.floor(Math.random() * cardMessages.length)];
      return acc;
    }, {} as Record<string, string>);
  }, []);

  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h2" size="xl" color={headingColor} textAlign="center" mb={4}>
        {isRevealing ? 'Revealing Your Cards' : 'Select 3 Cards'}
      </Heading>
      <Text fontSize="lg" fontWeight="medium" color={headingColor} textAlign="center" mb={4}>
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
          <Text fontSize="md" color={textColor} fontStyle="italic">
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
                bg={cardBgColor}
                border="2px solid"
                borderColor={cardBorderColor}
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
                bg={cardBgColor}
                border="2px solid"
                borderColor={cardBorderColor}
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