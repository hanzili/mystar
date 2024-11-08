import { Box, Button, Heading, Text, VStack, Image, Flex, Stack } from '@chakra-ui/react'
import { SignInButton, useUser } from '@clerk/clerk-react'
import { useNavigate } from '@tanstack/react-router'
import { useCommonColors } from '../utils/theme'

export default function Login() {
  const { isSignedIn } = useUser()
  const navigate = useNavigate()
  const { 
    loginBg, 
    text, 
    loginHeading, 
    loginButtonBg, 
    loginButtonHoverBg 
  } = useCommonColors()

  const handleBeginJourney = () => {
    if (isSignedIn) {
      navigate({ to: '/prediction' })
    }
  }

  return (
    <Flex direction={{ base: 'column', lg: 'row' }} minHeight="calc(100vh - 80px)" bg={loginBg}>
      <Box flex="1" p={{ base: 4, md: 8 }} display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={{ base: 6, md: 8 }} align="flex-start" maxWidth="600px" width="100%">
          <Flex align="center" width="100%" justifyContent={{ base: 'center', md: 'flex-start' }}>
            <Image src="/logo.png" alt="Mystic Tarot Logo" boxSize={{ base: "50px", md: "60px" }} mr={4} />
            <Heading as="h1" size={{ base: "xl", md: "2xl" }} color={loginHeading}>
              Mystar
            </Heading>
          </Flex>
          <Heading as="h2" size={{ base: "lg", md: "xl" }} color={text} textAlign={{ base: 'center', md: 'left' }} width="100%">
            Discover Your Path with Modern Tarot
          </Heading>
          <Text fontSize={{ base: "md", md: "xl" }} color={text} textAlign={{ base: 'center', md: 'left' }}>
            Explore the mysteries of your past, present, and future with our AI-enhanced Tarot readings. Gain valuable insights and navigate life's challenges with the perfect blend of ancient wisdom and cutting-edge technology.
          </Text>
          <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" color={loginHeading} textAlign={{ base: 'center', md: 'left' }} width="100%">
            100% Free - No Hidden Costs
          </Text>
          <Stack direction={{ base: 'column', md: 'row' }} spacing={4} width="100%">
            <VStack align={{ base: 'center', md: 'flex-start' }} spacing={4} flex="1">
              <Text fontSize={{ base: "md", md: "lg" }} color={text}>
                ✨ Personalized Tarot insights
              </Text>
              <Text fontSize={{ base: "md", md: "lg" }} color={text}>
                💬 Interact with our AI Astrologer
              </Text>
            </VStack>
            <VStack align={{ base: 'center', md: 'flex-start' }} spacing={4} flex="1">
              <Text fontSize={{ base: "md", md: "lg" }} color={text}>
                📊 Track your personal growth
              </Text>
              <Text fontSize={{ base: "md", md: "lg" }} color={text}>
                🎨 Unique, customizable Tarot deck
              </Text>
            </VStack>
          </Stack>
          <Box width="100%" display="flex" justifyContent={{ base: 'center', md: 'flex-start' }}>
            {isSignedIn ? (
              <Button
                size="lg"
                bg={loginButtonBg}
                color="white"
                _hover={{ bg: loginButtonHoverBg }}
                onClick={handleBeginJourney}
                width={{ base: "full", md: "auto" }}
              >
                Begin Your Free Tarot Journey
              </Button>
            ) : (
              <SignInButton mode="modal">
                <Button
                  size="lg"
                  bg={loginButtonBg}
                  color="white"
                  _hover={{ bg: loginButtonHoverBg }}
                  width={{ base: "full", md: "auto" }}
                >
                  Get Your Free Reading Now
                </Button>
              </SignInButton>
            )}
          </Box>
        </VStack>
      </Box>
      
      <Flex
        flex="1"
        bg={loginBg}
        justifyContent="center"
        alignItems="center"
        display={{ base: 'none', lg: 'flex' }}
      >
        <Box
          width="450px"
          height="450px"
          backgroundImage="url('/cat_crystall.webp')"
          backgroundSize="cover"
          backgroundPosition="center"
          borderRadius="full"
          boxShadow="lg"
        />
      </Flex>
    </Flex>
  )
}
