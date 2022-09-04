import {
  Avatar,
  Button,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Switch,
  Text,
} from "@chakra-ui/react";
import { NotificationTypes, SubscriptionType } from "../../../types";
import { FaDiscord, FaSlack, FaCheck } from "react-icons/fa";
import { ChevronDownIcon } from "@chakra-ui/icons";

export const SubscriptionItem = (props: { dao: SubscriptionType }) => {
  return (
    <HStack
      p="1rem"
      border="1px"
      borderRadius="5px"
      borderColor="gray.400"
      w="full"
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
      <Menu>
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
      </Menu>
    </HStack>
  );
};
