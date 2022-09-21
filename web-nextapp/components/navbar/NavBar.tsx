import React from "react";
import {
  Box,
  Flex,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  useColorMode,
  Button,
  Spacer,
  VStack,
  Image,
  IconButton,
  color,
} from "@chakra-ui/react";
import { NavItemSPA } from "./NavBarSPA";
import { LinkItemSPAProps, PagesEnum } from "../../../types";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const LinkItems: Array<LinkItemSPAProps> = [
  { name: "Dashboard", id: PagesEnum.Dashboard, icon: 1 },
  {
    name: "Subscriptions",
    id: PagesEnum.Subscriptions,
    icon: 2,
  },
  { name: "Vote tracker", id: PagesEnum.Tracker, icon: 3 },
  { name: "Settings", id: PagesEnum.Settings, icon: 4 },
];

export default function NavBar(props: { page: PagesEnum; setPage: any }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box bgColor={colorMode == "light" ? "blackAlpha.200" : "blackAlpha.700"}>
      <Drawer
        autoFocus={true}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={true}
        size="xs"
      >
        <DrawerContent>
          <OpenContent onClose={onClose} setPage={props.setPage} />
        </DrawerContent>
      </Drawer>
      <ClosedContent onOpen={onOpen} setPage={props.setPage} />
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
  setPage: () => void;
}

const OpenContent = ({ onClose, setPage }: SidebarProps) => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <VStack
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      onMouseLeave={onClose}
      h="full"
      align="start"
      justify="start"
      bgImg="/homebg.svg"
      bgColor={colorMode == "light" ? "blackAlpha.200" : "blackAlpha.700"}
    >
      <Flex h="20" alignItems="center" mx="2" justifyContent="space-between">
        {colorMode == "light" ? (
          <Image boxSize="50px" src="/logo_dark.svg" alt="very cool logo" />
        ) : (
          <Image boxSize="50px" src="/logo.svg" alt="very cool logo" />
        )}
        <Text fontFamily="manrope" fontWeight="500" fontSize="30px">
          Senate
        </Text>
      </Flex>
      {LinkItems.map((link) => (
        <NavItemSPA key={link.name} item={link} setPage={setPage}>
          {link.name}
        </NavItemSPA>
      ))}
      <Spacer />
      <Box p="4">
        <IconButton
          onClick={toggleColorMode}
          aria-label={"theme"}
          icon={colorMode == "light" ? <MoonIcon /> : <SunIcon />}
        ></IconButton>
      </Box>
    </VStack>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
  setPage: () => void;
}
const ClosedContent = ({ onOpen, setPage }: MobileProps) => {
  const { colorMode } = useColorMode();
  return (
    <VStack
      justify="start"
      align="center"
      onMouseOver={onOpen}
      h="full"
      bgColor={colorMode == "light" ? "blackAlpha.200" : "blackAlpha.400"}
    >
      <Flex h="20" alignItems="center" mx="2" justifyContent="space-between">
        {colorMode == "light" ? (
          <Image boxSize="50px" src="/logo_dark.svg" alt="very cool logo" />
        ) : (
          <Image boxSize="50px" src="/logo.svg" alt="very cool logo" />
        )}
      </Flex>
      {LinkItems.map((link) => (
        <NavItemSPA key={link.name} item={link} setPage={setPage}></NavItemSPA>
      ))}
    </VStack>
  );
};
