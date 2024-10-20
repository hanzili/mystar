// src/routes/history.tsx
import { useEffect, useState } from 'react';
import { Box, Heading, Text, useColorModeValue, Spinner, Center } from '@chakra-ui/react';
import { useUser } from '@clerk/clerk-react';
import { getTarotReadings, getSupabaseUserId } from '../lib/supabase';
import { TarotReading } from '../lib/supabase_types';
import PastReadingsList from '../components/PastReadingsList';

export default function History() {
  const { user } = useUser();
  const [pastReadings, setPastReadings] = useState<TarotReading[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      bg={useColorModeValue('white', 'gray.700')} 
      borderRadius={{ base: 0, md: "lg" }} 
      boxShadow={{ base: "none", md: "md" }}
    >
      <Heading 
        as="h2" 
        size={{ base: "lg", md: "xl" }} 
        mb={4} 
        color={useColorModeValue('purple.600', 'purple.300')} 
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
            color="purple.500"
            size="xl"
          />
        </Center>
      ) : pastReadings.length > 0 ? (
        <PastReadingsList pastReadings={pastReadings} />
      ) : (
        <Text textAlign="center">You haven't had any readings yet. Start a new reading to see your history!</Text>
      )}
    </Box>
  );
}
