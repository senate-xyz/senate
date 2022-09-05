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
} from "@chakra-ui/react";
import { FiHome, FiList, FiSettings } from "react-icons/fi";
import { NavItemSPA } from "./NavBarSPA";
import { LinkItemSPAProps, Pages } from "../../types";

const LinkItems: Array<LinkItemSPAProps> = [
  { name: "Dashboard", id: Pages.Dashboard, icon: FiHome },
  {
    name: "Subscriptions",
    id: Pages.Subscriptions,
    icon: FiList,
  },
  // { name: "Settings", id: Pages.Settings, icon: FiSettings },
];

export default function NavBar(props: { page: Pages; setPage: any }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box bg={useColorModeValue("gray.100", "gray.900")} h="100vh">
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

const OpenContent = ({ onClose, setPage, ...rest }: SidebarProps) => {
  return (
    <Box
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      onMouseLeave={onClose}
      h="100%"
    >
      <Flex h="20" alignItems="center" mx="2" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Logo
        </Text>
      </Flex>
      {LinkItems.map((link) => (
        <NavItemSPA key={link.name} item={link} setPage={setPage}>
          {link.name}
        </NavItemSPA>
      ))}
    </Box>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
  setPage: () => void;
}
const ClosedContent = ({ onOpen, setPage, ...rest }: MobileProps) => {
  return (
    <Flex
      bg={useColorModeValue("white", "gray.900")}
      justifyContent="flex-start"
      flexDir="column"
      onMouseOver={onOpen}
      h="100%"
    >
      <Flex h="20" alignItems="center" mx="2" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Logo
        </Text>
      </Flex>
      {LinkItems.map((link) => (
        <NavItemSPA key={link.name} item={link} setPage={setPage}></NavItemSPA>
      ))}
    </Flex>
  );
};
