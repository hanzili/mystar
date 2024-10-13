import React from 'react'
import { IconButton, useColorMode } from '@chakra-ui/react'
import { Sun, Moon } from 'lucide-react'

const ColorModeToggle: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <IconButton
      aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
      icon={colorMode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      onClick={toggleColorMode}
      variant="ghost"
      colorScheme="purple"
      size="md"
    />
  )
}

export default ColorModeToggle