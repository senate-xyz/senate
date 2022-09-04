import {
  Avatar,
  Box,
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
} from "@chakra-ui/react";
import { NotificationTypes, SubscriptionType } from "../../../types";
import { FaDiscord, FaSlack, FaCheck } from "react-icons/fa";

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
      <HStack>
        <Icon as={FaDiscord} />
        <Switch isChecked={props.dao.notificationSettings.discord}></Switch>
      </HStack>
      <HStack>
        <Icon as={FaSlack} />
        <Switch isChecked={props.dao.notificationSettings.slack}></Switch>
      </HStack>
      {/* <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          Notifications
        </MenuButton>
        <MenuList>
          <MenuItem>
            {props.dao.notificationSettings.notificationOptions.find(
              (x) => x.type === NotificationTypes.New
            ) && <Icon as={FaCheck} />}
            &nbsp; New Proposal
          </MenuItem>
          <MenuItem>
            {props.dao.notificationSettings.notificationOptions.find(
              (x) => x.type === NotificationTypes.threeDays
            ) && <Icon as={FaCheck} />}
            &nbsp; 3 days left to vote
          </MenuItem>
          <MenuItem>
            {props.dao.notificationSettings.notificationOptions.find(
              (x) => x.type === NotificationTypes.twoDays
            ) && <Icon as={FaCheck} />}
            &nbsp; 2 days left to vote
          </MenuItem>
          <MenuItem>
            {props.dao.notificationSettings.notificationOptions.find(
              (x) => x.type === NotificationTypes.oneDay
            ) && <Icon as={FaCheck} />}
            &nbsp; 1 day left to vote
          </MenuItem>
          <MenuItem>
            {props.dao.notificationSettings.notificationOptions.find(
              (x) => x.type === NotificationTypes.twelveHours
            ) && <Icon as={FaCheck} />}
            &nbsp; 12 hours left to vote
          </MenuItem>
          <MenuItem>
            {props.dao.notificationSettings.notificationOptions.find(
              (x) => x.type === NotificationTypes.sixHours
            ) && <Icon as={FaCheck} />}
            &nbsp; 6 hours left to vote
          </MenuItem>
          <MenuItem>
            {props.dao.notificationSettings.notificationOptions.find(
              (x) => x.type === NotificationTypes.threeHours
            ) && <Icon as={FaCheck} />}
            &nbsp; 3 hours left to vote
          </MenuItem>
          <MenuItem>
            {props.dao.notificationSettings.notificationOptions.find(
              (x) => x.type === NotificationTypes.oneHour
            ) && <Icon as={FaCheck} />}
            &nbsp; 1 hour left to vote
          </MenuItem>
        </MenuList>
      </Menu> */}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Set notification frequency</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              {props.dao.notificationSettings.notificationOptions.find(
                (x) => x.type === NotificationTypes.New
              ) && <Icon as={FaCheck} />}
              &nbsp; New Proposal
            </Box>
            <Box>
              {props.dao.notificationSettings.notificationOptions.find(
                (x) => x.type === NotificationTypes.threeDays
              ) && <Icon as={FaCheck} />}
              &nbsp; 3 days left to vote
            </Box>
            <Box>
              {props.dao.notificationSettings.notificationOptions.find(
                (x) => x.type === NotificationTypes.twoDays
              ) && <Icon as={FaCheck} />}
              &nbsp; 2 days left to vote
            </Box>
            <Box>
              {props.dao.notificationSettings.notificationOptions.find(
                (x) => x.type === NotificationTypes.oneDay
              ) && <Icon as={FaCheck} />}
              &nbsp; 1 day left to vote
            </Box>
            <Box>
              {props.dao.notificationSettings.notificationOptions.find(
                (x) => x.type === NotificationTypes.twelveHours
              ) && <Icon as={FaCheck} />}
              &nbsp; 12 hours left to vote
            </Box>
            <Box>
              {props.dao.notificationSettings.notificationOptions.find(
                (x) => x.type === NotificationTypes.sixHours
              ) && <Icon as={FaCheck} />}
              &nbsp; 6 hours left to vote
            </Box>
            <Box>
              {props.dao.notificationSettings.notificationOptions.find(
                (x) => x.type === NotificationTypes.threeHours
              ) && <Icon as={FaCheck} />}
              &nbsp; 3 hours left to vote
            </Box>
            <Box>
              {props.dao.notificationSettings.notificationOptions.find(
                (x) => x.type === NotificationTypes.oneHour
              ) && <Icon as={FaCheck} />}
              &nbsp; 1 hour left to vote
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </HStack>
  );
};
