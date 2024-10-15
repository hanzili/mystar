import React from 'react'
import { Outlet, Link, useNavigate } from '@tanstack/react-router'
import { Box, Flex, Spacer, Button, useColorModeValue } from '@chakra-ui/react'
import { Sparkles } from 'lucide-react'
import { useUser, UserButton, SignInButton } from '@clerk/clerk-react'
import ColorModeToggle from '../components/ColorModeToggle'
import { Image } from '@chakra-ui/react'

export default function Root() {
  const { isSignedIn, isLoaded } = useUser()
  const navigate = useNavigate()
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const textColor = useColorModeValue('gray.800', 'white')
  const headerBg = useColorModeValue('white', 'gray.800')

  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate({ to: '/' })
    }
  }, [isLoaded, isSignedIn, navigate])

  const handleNewReading = () => {
    navigate({ to: '/prediction' })
  }

  return (
    <Box minHeight="100vh" bg={bgColor} color={textColor}>
      <Flex as="header" align="center" justify="space-between" wrap="wrap" padding="1.5rem" bg={headerBg} boxShadow="sm">
        <Flex align="center" mr={5}>
          <Sparkles size={24} color={useColorModeValue('purple.500', 'purple.300')} />
          <Image src="/logo.png" alt="Mystar" width={8} height={8} />
          <Box as="span" ml={2} fontSize="xl" fontWeight="bold" color={useColorModeValue('purple.500', 'purple.300')}>
            Mystar
          </Box>
        </Flex>
        <Spacer />
        {isSignedIn ? (
          <Flex align="center">
            <Button colorScheme="purple" variant="ghost" onClick={handleNewReading} mr={4}>
              Start Reading
            </Button>
            <Link to="/history" style={{ marginRight: '1rem' }}>
              <Button colorScheme="purple" variant="ghost">History</Button>
            </Link>
            <ColorModeToggle />
            <Box ml={4}>
              <UserButton />
            </Box>
          </Flex>
        ) : (
          <Flex align="center">
            <ColorModeToggle />
            <Box ml={4}>
              <SignInButton mode="modal">
                <Button colorScheme="purple">Sign In</Button>
              </SignInButton>
            </Box>
          </Flex>
        )}
      </Flex>
      <Box as="main" padding="2rem">
        <Outlet />
      </Box>
    </Box>
  )
}