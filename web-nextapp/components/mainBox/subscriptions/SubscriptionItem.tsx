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
import { NotificationTypes, SubscriptionType } from "../../../types";
import { FaDiscord, FaSlack, FaCheck } from "react-icons/fa";
import { ChevronDownIcon } from "@chakra-ui/icons";

export const SubscriptionItem = (props: { dao: SubscriptionType }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <HStack
      p="1rem"
      border="1px"
      borderRadius="5px"
      borderColor={
        props.dao.notificationSettings.discord ||
        props.dao.notificationSettings.slack
          ? "gray.400"
          : "gray.200"
      }
      background={
        props.dao.notificationSettings.discord ||
        props.dao.notificationSettings.slack
          ? "gray.200"
          : "gray.100"
      }
      w="full"
      onClick={onOpen}
    >
      <Avatar src={props.dao.image}></Avatar>
      <Text>{props.dao.name}</Text>
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
                  <Avatar src={props.dao.image}></Avatar>
                  <Text>{props.dao.name}</Text>
                </HStack>
                <Divider />
                <HStack>
                  <Icon as={FaDiscord} />
                  <Switch
                    isChecked={props.dao.notificationSettings.discord}
                  ></Switch>
                </HStack>
                <HStack>
                  <Icon as={FaSlack} />
                  <Switch
                    isChecked={props.dao.notificationSettings.slack}
                  ></Switch>
                </HStack>
                {props.dao.notificationSettings.notificationOptions.map(
                  (opt) => {
                    switch (opt.type) {
                      case NotificationTypes.New:
                        return (
                          <HStack>
                            <FaCheck /> <Text>On new proposal</Text>
                          </HStack>
                        );
                      case NotificationTypes.threeDays:
                        return (
                          <HStack>
                            <FaCheck /> <Text>3 days before</Text>
                          </HStack>
                        );
                      case NotificationTypes.twoDays:
                        return (
                          <HStack>
                            <FaCheck /> <Text>2 days before</Text>
                          </HStack>
                        );
                      case NotificationTypes.oneDay:
                        return (
                          <HStack>
                            <FaCheck /> <Text>1 day before</Text>
                          </HStack>
                        );
                      case NotificationTypes.twelveHours:
                        return (
                          <HStack>
                            <FaCheck /> <Text>12 hours before</Text>
                          </HStack>
                        );
                      case NotificationTypes.sixHours:
                        return (
                          <HStack>
                            <FaCheck /> <Text>6 hours before</Text>
                          </HStack>
                        );
                      case NotificationTypes.threeHours:
                        return (
                          <HStack>
                            <FaCheck /> <Text>3 hours before</Text>
                          </HStack>
                        );
                      case NotificationTypes.oneHour:
                        return (
                          <HStack>
                            <FaCheck /> <Text>1 hour before</Text>
                          </HStack>
                        );
                    }
                  }
                )}
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
