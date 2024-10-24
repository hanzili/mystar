// src/routes/history.tsx
import { useEffect, useState } from 'react';
import { Box, Heading, Text, Spinner, Center } from '@chakra-ui/react';
import { useUser } from '@clerk/clerk-react';
import { getTarotReadings, getSupabaseUserId } from '../lib/supabase';
import { TarotReading } from '../lib/supabase_types';
import PastReadingsList from '../components/PastReadingsList';
import { useCommonColors } from '../utils/theme';

export default function History() {
  const { user } = useUser();
  const [pastReadings, setPastReadings] = useState<TarotReading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { cardBg, accent, text } = useCommonColors();

  useEffect(() => {
    const fetchReadings = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const supabaseUserId = await getSupabaseUserId(user.id);
          if (supabaseUserId) {
            const readings = await getTarotReadings(supabaseUserId);
            setPastReadings(readings);
          } else {
            console.error('Supabase user ID not found');
          }
        } catch (error) {
          console.error('Failed to fetch readings:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchReadings();
  }, [user]);

  return (
    <Box 
      p={{ base: 2, md: 6 }} 
      bg={cardBg} 
      borderRadius={{ base: 0, md: "lg" }} 
      boxShadow={{ base: "none", md: "md" }}
    >
      <Heading 
        as="h2" 
        size={{ base: "lg", md: "xl" }} 
        mb={4} 
        color={accent} 
        textAlign="center"
      >
        Your Past Readings
      </Heading>
      {isLoading ? (
        <Center p={8}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color={accent}
            size="xl"
          />
        </Center>
      ) : pastReadings.length > 0 ? (
        <PastReadingsList pastReadings={pastReadings} />
      ) : (
        <Text textAlign="center" color={text}>
          You haven't had any readings yet. Start a new reading to see your history!
        </Text>
      )}
    </Box>
  );
}
