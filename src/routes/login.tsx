import React from 'react'
import { Box, Heading, Text, VStack, useColorModeValue } from '@chakra-ui/react'
import { SignInButton } from '@clerk/clerk-react'

export default function Login() {
  const bgColor = useColorModeValue('white', 'gray.700')
  const headingColor = useColorModeValue('purple.600', 'purple.300')
  const buttonBgColor = useColorModeValue('purple.500', 'purple.400')
  const buttonHoverBgColor = useColorModeValue('purple.600', 'purple.500')

  return (
    <VStack spacing={8} align="center" justify="center" height="calc(100vh - 100px)">
      <Box textAlign="center" bg={bgColor} p={8} borderRadius="lg" boxShadow="xl">
        <Heading as="h2" size="xl" mb={4} color={headingColor}>
          Welcome to Mystic Tarot
        </Heading>
        <Text fontSize="lg" mb={6}>
          Unlock the secrets of the cards and discover your destiny
        </Text>
        <SignInButton mode="modal">
          <Box
            as="button"
            bg={buttonBgColor}
            color="white"
            px={6}
            py={3}
            borderRadius="md"
            _hover={{ bg: buttonHoverBgColor }}
            transition="all 0.2s"
          >
            Begin Your Journey
          </Box>
        </SignInButton>
      </Box>
    </VStack>
  )
}