import {
  Avatar,
  Divider,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Spacer,
  Switch,
  Text,
  useDisclosure,
  Center,
  VStack,
  useToast,
  AvatarGroup,
  useColorMode,
  Box,
} from "@chakra-ui/react";
import { DAOType, DAOHandlerType } from "@senate/common-types";
import { FaDiscord, FaSlack, FaTelegram, FaBell } from "react-icons/fa";
import { useSession } from "next-auth/react";

export const DaoItem = (props: { dao: DAOType }) => {
  const { colorMode } = useColorMode();
  const { data: session } = useSession();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const signedOutWarning = () => {
    toast({
      title: "Not signed in",
      description:
        "Subscribing to DAOs notifications requires you to sign in first",
      status: "warning",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <VStack
      w="10rem"
      h="12em"
      p="1rem"
      border={props.dao.subscriptions ? "2px" : "1px"}
      bgColor={
        colorMode == "light"
          ? props.dao.subscriptions
            ? "blackAlpha.50"
            : "blackAlpha.300"
          : props.dao.subscriptions
          ? "whiteAlpha.300"
          : "whiteAlpha.50"
      }
      borderColor={
        colorMode == "light"
          ? props.dao.subscriptions
            ? "blackAlpha.300"
            : "blackAlpha.300"
          : props.dao.subscriptions
          ? "whiteAlpha.400"
          : "whiteAlpha.100"
      }
      borderRadius="5px"
      onClick={session ? onOpen : signedOutWarning}
    >
      <Avatar size="lg" src={props.dao.picture} bg="white" position="relative">
        <AvatarGroup
          position="absolute"
          size="sm"
          max={2}
          bottom={{ base: "-0.5", md: "-2.5" }}
          right={{ base: "-0.5", md: "-2.5" }}
        >
          {props.dao.handlers.map((handler: any, index: number) => {
            switch (handler.type) {
              case "BRAVO1":
              case "BRAVO2":
              case "MAKER_POLL":
              case "MAKER_EXECUTIVE":
                return (
                  <Avatar
                    key={index}
                    bg="white"
                    name="eth"
                    src="https://assets.coingecko.com/coins/images/279/thumb/ethereum.png"
                    boxSize={{ base: "25px", md: "30px" }}
                  />
                );

              case "SNAPSHOT":
                return (
                  <Avatar
                    key={index}
                    bg="white"
                    name="snapshot"
                    src="https://avatars.githubusercontent.com/u/72904068?s=200&v=4"
                    boxSize={{ base: "25px", md: "30px" }}
                  />
                );
            }
          })}
        </AvatarGroup>
      </Avatar>
      <Text>{props.dao.name}</Text>
      <Spacer />
      <HStack>
        <Icon as={FaDiscord} />
        <Icon as={FaSlack} />
        <Icon as={FaTelegram} />
        <Icon as={FaBell} />
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose} size="xs" isCentered>
        <ModalOverlay backdropFilter="blur(2px)" />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Center>
              <VStack my="1rem">
                <HStack>
                  <Avatar
                    bg="white"
                    showBorder={true}
                    src={props.dao.picture}
                  ></Avatar>

                  <Text>{props.dao.name}</Text>
                </HStack>

                <HStack>
                  <Text>Subscribed</Text>
                  <Switch
                  // isChecked={subscribe}
                  // onChange={() => {
                  //   // storeSubscribe(!subscribe);
                  //   // setSubscribe(!subscribe);
                  // }}
                  ></Switch>
                </HStack>

                <Divider />
                <VStack>
                  <Text fontWeight="600">Notifications</Text>

                  <HStack>
                    <VStack>
                      <HStack>
                        <Icon as={FaBell} boxSize="8" />

                        <Switch size="md" disabled isChecked={true}></Switch>
                      </HStack>
                      <HStack>
                        <Icon as={FaDiscord} boxSize="8" />
                        <Switch size="md" disabled></Switch>
                      </HStack>
                    </VStack>

                    <Box w="1rem" />

                    <VStack>
                      <HStack>
                        <Icon as={FaSlack} boxSize="8" />
                        <Switch size="md" disabled></Switch>
                      </HStack>
                      <HStack>
                        <Icon as={FaTelegram} boxSize="8" />
                        <Switch size="md" disabled></Switch>
                      </HStack>
                    </VStack>
                  </HStack>
                </VStack>
              </VStack>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};
