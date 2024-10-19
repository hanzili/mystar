import React from 'react'
import { Box, Button, Heading, Text, VStack, Image, Flex, useColorModeValue, Stack } from '@chakra-ui/react'
import { SignInButton, useUser } from '@clerk/clerk-react'
import { useNavigate } from '@tanstack/react-router'
import { Sparkles } from 'lucide-react'

export default function Login() {
  const { isSignedIn } = useUser()
  const navigate = useNavigate()
  const bgColor = useColorModeValue('purple.50', 'gray.900')
  const textColor = useColorModeValue('gray.800', 'gray.100')
  const headingColor = useColorModeValue('purple.600', 'purple.300')
  const buttonBgColor = useColorModeValue('purple.500', 'purple.400')
  const buttonHoverBgColor = useColorModeValue('purple.600', 'purple.500')

  const handleBeginJourney = () => {
    if (isSignedIn) {
      navigate({ to: '/prediction' })
    }
  }

  return (
    <Flex direction={{ base: 'column', lg: 'row' }} minHeight="calc(100vh - 80px)" bg={bgColor}>
      <Box flex="1" p={{ base: 4, md: 8 }} display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={{ base: 6, md: 8 }} align="flex-start" maxWidth="600px" width="100%">
          <Flex align="center" width="100%" justifyContent={{ base: 'center', md: 'flex-start' }}>
            <Image src="/logo.png" alt="Mystic Tarot Logo" boxSize={{ base: "50px", md: "60px" }} mr={4} />
            <Heading as="h1" size={{ base: "xl", md: "2xl" }} color={headingColor}>
              Mystic Tarot
            </Heading>
          </Flex>
          <Heading as="h2" size={{ base: "lg", md: "xl" }} color={textColor} textAlign={{ base: 'center', md: 'left' }} width="100%">
            Unlock the Secrets of Your Destiny
          </Heading>
          <Text fontSize={{ base: "md", md: "xl" }} color={textColor} textAlign={{ base: 'center', md: 'left' }}>
            Embark on a mystical journey with our AI-powered Tarot readings. Gain insights into your past, present, and future with the ancient wisdom of Tarot cards, enhanced by cutting-edge artificial intelligence.
          </Text>
          <Stack direction={{ base: 'column', md: 'row' }} spacing={4} width="100%">
            <VStack align={{ base: 'center', md: 'flex-start' }} spacing={4} flex="1">
              <Text fontSize={{ base: "md", md: "lg" }} color={textColor}>
                ✨ Personalized Tarot readings
              </Text>
              <Text fontSize={{ base: "md", md: "lg" }} color={textColor}>
                💬 Chat with our AI Astrologer
              </Text>
            </VStack>
            <VStack align={{ base: 'center', md: 'flex-start' }} spacing={4} flex="1">
              <Text fontSize={{ base: "md", md: "lg" }} color={textColor}>
                📜 Track your spiritual journey
              </Text>
              <Text fontSize={{ base: "md", md: "lg" }} color={textColor}>
                🌟 Customized Tarot deck
              </Text>
            </VStack>
          </Stack>
          <Box width="100%" display="flex" justifyContent={{ base: 'center', md: 'flex-start' }}>
            {isSignedIn ? (
              <Button
                size="lg"
                bg={buttonBgColor}
                color="white"
                _hover={{ bg: buttonHoverBgColor }}
                onClick={handleBeginJourney}
                width={{ base: "full", md: "auto" }}
              >
                Start Your Free Reading
              </Button>
            ) : (
              <SignInButton mode="modal">
                <Button
                  size="lg"
                  bg={buttonBgColor}
                  color="white"
                  _hover={{ bg: buttonHoverBgColor }}
                  width={{ base: "full", md: "auto" }}
                >
                  Try a Free Reading
                </Button>
              </SignInButton>
            )}
          </Box>
        </VStack>
      </Box>
      <Box flex="1" p={4} display={{ base: 'none', lg: 'flex' }} alignItems="center" justifyContent="center">
        <Image
          src="https://images.unsplash.com/photo-1632292220916-e9c34dd75db2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
          alt="Tarot cards"
          objectFit="cover"
          borderRadius="lg"
          boxShadow="2xl"
          maxWidth="100%"
          height="auto"
        />
      </Box>
    </Flex>
  )
}