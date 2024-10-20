import React from "react";
import { IconButton, useColorMode, Icon, Box, useBreakpointValue } from "@chakra-ui/react";
import { Sun, Moon } from "lucide-react";

interface ColorModeToggleProps {
  asMenuItem?: boolean;
}

const ColorModeToggle: React.FC<ColorModeToggleProps> = ({ asMenuItem = false }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const iconSize = useBreakpointValue({ base: 16, md: 20 });

  const icon = colorMode === "light" ? <Moon size={iconSize} /> : <Sun size={iconSize} />;

  if (asMenuItem) {
    return (
      <Box
        as="div"
        onClick={toggleColorMode}
        display="flex"
        alignItems="center"
        px={3}
        py={2}
        cursor="pointer"
      >
        <Icon as={() => icon} />
      </Box>
    );
  }

  return (
    <IconButton
      aria-label={`Switch to ${colorMode === "light" ? "dark" : "light"} mode`}
      icon={icon}
      onClick={toggleColorMode}
      variant="ghost"
      colorScheme="purple"
      size="md"
    />
  );
};

export default ColorModeToggle;
