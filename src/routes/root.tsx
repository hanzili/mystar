import React from "react";
import { Outlet, Link, useNavigate } from "@tanstack/react-router";
import {
  Box,
  Flex,
  Spacer,
  Button,
  useColorModeValue,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { Menu as MenuIcon } from "lucide-react";
import { useUser, UserButton, SignInButton } from "@clerk/clerk-react";
import ColorModeToggle from "../components/ColorModeToggle";
import { Image } from "@chakra-ui/react";

export default function Root() {
  const { isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.800", "white");
  const headerBg = useColorModeValue("white", "gray.800");

  React.useEffect(() => {
    const currentPath = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const hasShareId = searchParams.has('shareId');
  
    if (isLoaded && !isSignedIn && currentPath !== "/" && !hasShareId) {
      navigate({ to: "/" });
    }
  }, [isLoaded, isSignedIn, navigate]);

  const handleNewReading = () => {
    navigate({ to: "/prediction" });
  };

  const handleLogoClick = () => {
    navigate({ to: "/" });
  };

  return (
    <Box minHeight="100vh" bg={bgColor} color={textColor}>
      <Flex
        as="header"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="1.5rem"
        bg={headerBg}
        boxShadow="sm"
      >
        <Flex align="center" mr={5} cursor="pointer">
          <Image
            src="/logo.png"
            alt="Mystar"
            width={8}
            height={8}
            onClick={handleLogoClick}
          />
          <Box
            as="span"
            ml={2}
            fontSize="2xl"
            fontWeight="bold"
            color={useColorModeValue("purple.500", "purple.300")}
            onClick={handleLogoClick}
          >
            Mystar
          </Box>
        </Flex>

        <Spacer />
        {isSignedIn ? (
          <>
            <Flex align="center" display={{ base: "none", md: "flex" }}>
              <Button
                colorScheme="purple"
                variant="ghost"
                onClick={handleNewReading}
                mr={4}
              >
                Start Reading
              </Button>
              <Link to="/history" style={{ marginRight: "1rem" }}>
                <Button colorScheme="purple" variant="ghost">
                  History
                </Button>
              </Link>
              <ColorModeToggle />
              <Box ml={4}>
                <UserButton />
              </Box>
            </Flex>
            <Box display={{ base: "block", md: "none" }}>
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<MenuIcon />}
                  variant="outline"
                  aria-label="Options"
                />
                <MenuList>
                  <MenuItem onClick={handleNewReading}>Start Reading</MenuItem>
                  <MenuItem as={Link} to="/history">
                    History
                  </MenuItem>
                  <MenuItem>
                    <ColorModeToggle asMenuItem />
                  </MenuItem>
                  <MenuItem>
                    <UserButton />
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </>
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
  );
}
