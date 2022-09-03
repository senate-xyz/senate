import React from "react";
import {
  Box,
  Flex,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
} from "@chakra-ui/react";
import { FiHome, FiTrendingUp } from "react-icons/fi";
import { IconType } from "react-icons/lib";

interface LinkItemProps {
  name: string;
  href: string;
  icon: IconType;
}
const LinkItems: Array<LinkItemProps> = [
  { name: "Proposals", icon: FiHome, href: "/proposals" },
  { name: "DAOs", icon: FiTrendingUp, href: "/daos" },
];

export default function NavBar(/*{ children }: { children: ReactNode }*/) {
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
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      // bg={useColorModeValue("white", "gray.900")}
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
        <NavItem key={link.name} icon={link.icon} link={link.href}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  link: string;
  children?: string;
}
const NavItem = ({ icon, link, children, ...rest }: NavItemProps) => {
  return (
    <Link
      href={link}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "red.400",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
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
        <NavItem key={link.name} icon={link.icon} link={link.href}></NavItem>
      ))}
    </Flex>
  );
};
