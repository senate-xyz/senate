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
  Spacer,
  VStack,
  Image,
  IconButton,
  Avatar,
} from "@chakra-ui/react";
import { NavItemSPA } from "./NavBarSPA";
import { LinkItemSPAProps, PagesEnum } from "@senate/common-types";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useSession, getCsrfToken, signIn } from "next-auth/react";
import { SiweMessage } from "siwe";
import {
  useConnect,
  useAccount,
  useNetwork,
  useSignMessage,
  useEnsName,
  useEnsAvatar,
} from "wagmi";

import { ConnectButton } from "@rainbow-me/rainbowkit";

const LinkItems: Array<LinkItemSPAProps> = [
  { name: "Dashboard", id: PagesEnum.Dashboard, icon: 1 },
  { name: "Vote tracker", id: PagesEnum.Tracker, icon: 3 },
  {
    name: "Watchlist",
    id: PagesEnum.Watchlist,
    icon: 2,
  },
];

export default function NavBar(props: { page: PagesEnum; setPage: any }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();
  return (
    <Box bgColor={colorMode == "light" ? "blackAlpha.200" : "blackAlpha.600"}>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerContent>
          <OpenContent onClose={onClose} setPage={props.setPage} />
        </DrawerContent>
      </Drawer>
      <ClosedContent onOpen={onOpen} />
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
      align="start"
      justify="start"
      bgColor={colorMode == "light" ? "blackAlpha.200" : "blackAlpha.700"}
      minH="full"
    >
      <VStack
        w="full"
        bgImg="/homebg.svg"
        position="absolute"
        zIndex="-1"
        opacity="0.2"
        minH="full"
      />

      <Flex h="20" w="full" alignItems="center" justify="center">
        {colorMode == "light" ? (
          <Image boxSize="35px" src="/logo_dark.svg" alt="very cool logo" />
        ) : (
          <Image boxSize="35px" src="/logo.svg" alt="very cool logo" />
        )}
        <Text fontFamily="manrope" fontWeight="500" fontSize="30px" ml="1rem">
          Senate
        </Text>
      </Flex>
      <Box py="3" />

      <ConnectButton accountStatus="avatar" showBalance={false} />

      <Box py="3" />
      {LinkItems.map((link) => (
        <NavItemSPA
          key={link.name}
          item={link}
          setPage={setPage}
          onClose={onClose}
        >
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
}
const ClosedContent = ({ onOpen }: MobileProps) => {
  const { colorMode } = useColorMode();

  const { data: session } = useSession();

  const ensName = useEnsName({
    address: session?.user?.name as string,
  });
  const ensAvatar = useEnsAvatar({
    addressOrName: session?.user?.name as string,
  });
  return (
    <VStack
      justify="start"
      align="center"
      onMouseEnter={onOpen}
      bgColor={colorMode == "light" ? "blackAlpha.200" : "blackAlpha.400"}
      minH="full"
    >
      <Flex h="20" w="full" alignItems="center" justify="center" p="2">
        {colorMode == "light" ? (
          <Image boxSize="55px" src="/logo_dark.svg" alt="very cool logo" />
        ) : (
          <Image boxSize="55px" src="/logo.svg" alt="very cool logo" />
        )}
      </Flex>

      <Box py="3" />
      <Avatar
        boxSize="45px"
        src={ensAvatar.data!}
        name={ensName.data!}
      ></Avatar>

      <Box py="3" />
      <Box px="50px" />

      {LinkItems.map((link) => (
        <NavItemSPA key={link.name} item={link}></NavItemSPA>
      ))}
    </VStack>
  );
};
