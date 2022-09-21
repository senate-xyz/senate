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
  Button,
  Avatar,
  HStack,
} from "@chakra-ui/react";
import { NavItemSPA } from "./NavBarSPA";
import { LinkItemSPAProps, PagesEnum } from "../../../types";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useSession, getCsrfToken, signIn, signOut } from "next-auth/react";
import { SiweMessage } from "siwe";
import {
  useConnect,
  useAccount,
  useNetwork,
  useSignMessage,
  useEnsName,
  useEnsAvatar,
} from "wagmi";

import { FaSignOutAlt, FaSignInAlt } from "react-icons/fa";

const LinkItems: Array<LinkItemSPAProps> = [
  { name: "Dashboard", id: PagesEnum.Dashboard, icon: 1 },
  { name: "Vote tracker", id: PagesEnum.Tracker, icon: 3 },
  {
    name: "Watchlist",
    id: PagesEnum.Watchlist,
    icon: 2,
  },
  { name: "Settings", id: PagesEnum.Settings, icon: 4 },
];

export default function NavBar(props: { page: PagesEnum; setPage: any }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();
  return (
    <Box bgColor={colorMode == "light" ? "blackAlpha.200" : "blackAlpha.700"}>
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

  const { data: session } = useSession();

  const { connectors, connectAsync } = useConnect();
  const { address, isConnected } = useAccount();
  const ensName = useEnsName({
    address: session?.user?.name!,
  });
  const ensAvatar = useEnsAvatar({
    addressOrName: session?.user?.name!,
  });
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage({});

  const handleLogin = async () => {
    try {
      if (!isConnected)
        Promise.all(
          connectors.map(async (connector) => {
            await connectAsync({ connector });
          })
        );

      if (isConnected) {
        const message = new SiweMessage({
          domain: window.location.host,
          address: address,
          statement: "Sign in with Ethereum to the app.",
          uri: window.location.origin,
          version: "1",
          chainId: chain?.id,
          nonce: await getCsrfToken(),
        });
        const signature = await signMessageAsync({
          message: message.prepareMessage(),
        });

        signIn("credentials", {
          message: JSON.stringify(message),
          signature,
          redirect: false,
          callbackUrl: message.uri,
        });
      }
    } catch (error) {
      window.alert(error);
    }
  };

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

      <Flex h="20" w="full" alignItems="center" p="2">
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
      {session?.user ? (
        <HStack mt="2rem" px="2rem" w="full">
          <Avatar src={ensAvatar.data!} name={ensName.data!}></Avatar>

          <VStack align="start">
            <Text fontWeight="800" justifySelf="end">
              {ensName.data}
            </Text>
            <Text justifySelf="start">
              {session.user.name?.substring(0, 6)}...
              {session.user.name?.substring(36)}
            </Text>
          </VStack>
          <Spacer />
          <IconButton
            bgColor={colorMode == "light" ? "blackAlpha.100" : "whiteAlpha.100"}
            onClick={() => {
              signOut();
            }}
            icon={<FaSignOutAlt />}
            aria-label={"signOut"}
          >
            Sign out
          </IconButton>
        </HStack>
      ) : (
        <HStack mt="2rem" px="2rem" w="full">
          <Button
            bgColor={colorMode == "light" ? "blackAlpha.100" : "whiteAlpha.100"}
            rightIcon={<FaSignInAlt />}
            aria-label={"signIn"}
            onClick={() => {
              handleLogin();
            }}
          >
            <Text>Sign in with Ethereum</Text>
          </Button>
        </HStack>
      )}
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
    address: session?.user?.name!,
  });
  const ensAvatar = useEnsAvatar({
    addressOrName: session?.user?.name!,
  });
  return (
    <VStack
      justify="start"
      align="center"
      onMouseEnter={onOpen}
      bgColor={colorMode == "light" ? "blackAlpha.200" : "blackAlpha.400"}
      minH="full"
    >
      <Flex h="20" w="full" alignItems="center" p="2">
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

      {LinkItems.map((link) => (
        <NavItemSPA key={link.name} item={link}></NavItemSPA>
      ))}
    </VStack>
  );
};
