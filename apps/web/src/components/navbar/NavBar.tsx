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
import { LinkItemSPAProps, NavItem } from "./NavItem";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useSession } from "next-auth/react";
import { useEnsName, useEnsAvatar } from "wagmi";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FiBarChart2, FiHome, FiStar } from "react-icons/fi";

export enum ViewsEnum {
  None = 1,
  Dashboard = 2,
  Watchlist = 3,
  Tracker = 4,
  Settings = 5,
}

const LinkItems: Array<LinkItemSPAProps> = [
  { name: "Dashboard", id: ViewsEnum.Dashboard, icon: FiHome },
  {
    name: "Watchlist",
    id: ViewsEnum.Watchlist,
    icon: FiBarChart2,
  },
  { name: "Vote tracker", id: ViewsEnum.Tracker, icon: FiStar },
];

export default function NavBar(props: { page: ViewsEnum; setView: any }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();
  return (
    <Box bgColor={colorMode == "light" ? "blackAlpha.200" : "blackAlpha.600"}>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerContent>
          <OpenContent onClose={onClose} setView={props.setView} />
        </DrawerContent>
      </Drawer>
      <ClosedContent onOpen={onOpen} />
    </Box>
  );
}

interface OpenProps extends BoxProps {
  onClose: () => void;
  setView: () => void;
}

const OpenContent = ({ onClose, setView }: OpenProps) => {
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
      {LinkItems.map((view) => (
        <NavItem
          key={view.name}
          item={view}
          setView={setView}
          onClose={onClose}
        >
          {view.name}
        </NavItem>
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

interface ClosedProps extends FlexProps {
  onOpen: () => void;
}
const ClosedContent = ({ onOpen }: ClosedProps) => {
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

      <Box py="3" px="50px" />

      {LinkItems.map((view) => (
        <NavItem key={view.name} item={view}></NavItem>
      ))}
    </VStack>
  );
};
