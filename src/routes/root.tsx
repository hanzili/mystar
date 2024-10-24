import React from "react";
import { Outlet, Link, useNavigate } from "@tanstack/react-router";
import {
  Box,
  Flex,
  Spacer,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Menu as MenuIcon } from "lucide-react";
import { useUser, UserButton, SignInButton } from "@clerk/clerk-react";
import ColorModeToggle from "../components/ColorModeToggle";
import { Image } from "@chakra-ui/react";
import { useCommonColors } from "../utils/theme";

export default function Root() {
  const { isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();
  const { bg, text, accent, cardBg } = useCommonColors();
  const userButtonSize = useBreakpointValue({ base: "sm", md: "md" });

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
    <Box minHeight="100vh" bg={bg} color={text}>
      <Flex
        as="header"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding={{ base: "1rem", md: "1.5rem" }}
        bg={cardBg}
        boxShadow="sm"
      >
        <Flex align="center" mr={5} cursor="pointer">
          <Image
            src="/logo.png"
            alt="Mystar"
            width={{ base: 6, md: 8 }}
            height={{ base: 6, md: 8 }}
            onClick={handleLogoClick}
          />
          <Box
            as="span"
            ml={2}
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="bold"
            color={accent}
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
                <UserButton userProfileMode="navigation" afterSignOutUrl="/" />
              </Box>
            </Flex>
            <Box display={{ base: "block", md: "none" }}>
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<MenuIcon />}
                  variant="outline"
                  aria-label="Options"
                  size="sm"
                />
                <MenuList minWidth="auto" width="auto" maxWidth="150px">
                  <MenuItem padding={0}>
                    <Box ml={2}>
                      <UserButton 
                        userProfileMode="navigation" 
                        afterSignOutUrl="/" 
                        appearance={{
                          elements: {
                            avatarBox: {
                              width: userButtonSize === "sm" ? "24px" : "32px",
                              height: userButtonSize === "sm" ? "24px" : "32px",
                            }
                          }
                        }}
                      />
                    </Box>
                  </MenuItem>
                  <MenuItem padding={0}>
                    <ColorModeToggle asMenuItem />
                  </MenuItem>
                  <MenuItem as={Link} to="/history" fontSize="xs" py={2} px={3}>
                    History
                  </MenuItem>
                  <MenuItem onClick={handleNewReading} fontSize="xs" py={2} px={3}>
                    Start Reading
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
