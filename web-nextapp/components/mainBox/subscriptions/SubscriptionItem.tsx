import {
  Avatar,
  Box,
  Divider,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Switch,
  Text,
  useDisclosure,
  Center,
  VStack,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { NotificationChannelTypes, SubscriptionType } from "../../../types";
import { FaDiscord, FaSlack, FaCheck } from "react-icons/fa";
import { ChevronDownIcon } from "@chakra-ui/icons";

export const SubscriptionItem = (props: { sub: SubscriptionType }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <HStack
      p="1rem"
      border="1px"
      borderRadius="5px"
      borderColor={
        props.sub.notificationChannels.length > 0 ? "gray.400" : "gray.200"
      }
      background={
        props.sub.notificationChannels.length > 0 ? "gray.200" : "gray.100"
      }
      w="full"
      onClick={onOpen}
    >
      <Avatar src={props.sub.Dao.picture}></Avatar>
      <Text>{props.sub.Dao.name}</Text>
      <Spacer />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay backdropFilter="blur(2px)" />
        <ModalContent>
          <ModalHeader>Set notification frequency</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center>
              <VStack>
                <HStack>
                  <Avatar src={props.sub.Dao.picture}></Avatar>
                  <Text>{props.sub.Dao.name}</Text>
                </HStack>
                <Divider />
                <HStack>
                  <Icon as={FaDiscord} />
                  <Switch
                    isChecked={
                      props.sub.notificationChannels.filter(
                        (channel) =>
                          channel.type == NotificationChannelTypes.Discord
                      ).length > 0
                    }
                  ></Switch>
                </HStack>
                <HStack>
                  <Icon as={FaSlack} />
                  <Switch
                    isChecked={
                      props.sub.notificationChannels.filter(
                        (channel) =>
                          channel.type == NotificationChannelTypes.Slack
                      ).length > 0
                    }
                  ></Switch>
                </HStack>
                <VStack>
                  {props.sub.notificationSettings.map((opt) => {
                    return (
                      <HStack key={opt.time.toString()}>
                        <FaCheck /> <Text>{opt.time.toString()}</Text>
                      </HStack>
                    );
                  })}
                </VStack>
                <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    Add new notification
                  </MenuButton>
                  <MenuList>
                    <MenuItem>New Proposal</MenuItem>
                    <MenuItem>3 days left to vote</MenuItem>
                    <MenuItem>2 days left to vote</MenuItem>
                    <MenuItem>1 day left to vote</MenuItem>
                    <MenuItem>12 hours left to vote</MenuItem>
                    <MenuItem>6 hours left to vote</MenuItem>
                    <MenuItem>3 hours left to vote</MenuItem>
                    <MenuItem>1 hour left to vote</MenuItem>
                  </MenuList>
                </Menu>
              </VStack>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </HStack>
  );
};
