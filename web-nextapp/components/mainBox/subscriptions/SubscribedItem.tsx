import {
  Avatar,
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
import { CheckIcon } from "@chakra-ui/icons";
import {
  NotificationChannel,
  NotificationInterval,
  NotificationSettings,
  SubscriptionType,
} from "../../../../types";
import { FaDiscord, FaSlack, FaCheck } from "react-icons/fa";
import { ChevronDownIcon, BellIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import moment from "moment";

export const SubscribedItem = (props: { sub: SubscriptionType }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [discordChecked, setDiscordChecked] = useState(false);
  const [slackChecked, setSlackChcked] = useState(false);
  const [notifSettings, setNotifSettings] = useState<NotificationSettings[]>(
    []
  );

  useEffect(() => {
    setDiscordChecked(
      props.sub.notificationChannels.filter(
        (channel: any) => channel.type == NotificationChannel.Discord
      ).length > 0
    );

    setSlackChcked(
      props.sub.notificationChannels.filter(
        (channel: any) => channel.type == NotificationChannel.Slack
      ).length > 0
    );

    setNotifSettings(props.sub.notificationSettings);
  }, [props]);

  const setNotif = (arg0: NotificationInterval) => {
    let tmp: NotificationSettings[] = [];

    let found = notifSettings.find((e) => e.delay == arg0);

    if (found) {
      tmp = notifSettings.filter((i) => i != found);
    } else
      tmp = [
        ...notifSettings,
        { createdTime: new Date(), delay: arg0 as number },
      ];

    setNotifSettings(tmp);
  };

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
                    isChecked={discordChecked}
                    onChange={() => {
                      setDiscordChecked(!discordChecked);
                    }}
                  ></Switch>
                </HStack>
                <HStack>
                  <Icon as={FaSlack} />
                  <Switch
                    isChecked={slackChecked}
                    onChange={() => {
                      setSlackChcked(!slackChecked);
                    }}
                  ></Switch>
                </HStack>
                <VStack>
                  <Text>Active notifications:</Text>
                  {notifSettings.map(
                    (opt: { createdTime: Date; delay: number }, index) => {
                      return (
                        <HStack key={index}>
                          <BellIcon />{" "}
                          <Text>
                            {moment.duration(opt.delay, "seconds").days() +
                              " days " +
                              moment.duration(opt.delay, "seconds").hours() +
                              " hours " +
                              moment.duration(opt.delay, "seconds").minutes() +
                              " minutes"}
                          </Text>
                        </HStack>
                      );
                    }
                  )}
                </VStack>
                <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    Add new notification
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      onClick={() => {
                        setNotif(NotificationInterval.NewProposal);
                      }}
                    >
                      <HStack>
                        {notifSettings.filter(
                          (opt) => opt.delay == NotificationInterval.NewProposal
                        ).length > 0 && <CheckIcon />}
                        <Text>New proposal</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setNotif(NotificationInterval.OneHour);
                      }}
                    >
                      <HStack>
                        {notifSettings.filter(
                          (opt) => opt.delay == NotificationInterval.OneHour
                        ).length > 0 && <CheckIcon />}
                        <Text>1 hour left to vote</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setNotif(NotificationInterval.TwoHours);
                      }}
                    >
                      <HStack>
                        {notifSettings.filter(
                          (opt) => opt.delay == NotificationInterval.TwoHours
                        ).length > 0 && <CheckIcon />}
                        <Text>2 hours left to vote</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setNotif(NotificationInterval.ThreeHours);
                      }}
                    >
                      <HStack>
                        {notifSettings.filter(
                          (opt) => opt.delay == NotificationInterval.ThreeHours
                        ).length > 0 && <CheckIcon />}
                        <Text>3 hours left to vote</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setNotif(NotificationInterval.SixHours);
                      }}
                    >
                      <HStack>
                        {notifSettings.filter(
                          (opt) => opt.delay == NotificationInterval.SixHours
                        ).length > 0 && <CheckIcon />}
                        <Text>6 hours left to vote</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setNotif(NotificationInterval.TwelveHours);
                      }}
                    >
                      <HStack>
                        {notifSettings.filter(
                          (opt) => opt.delay == NotificationInterval.TwelveHours
                        ).length > 0 && <CheckIcon />}
                        <Text>12 hours left to vote</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setNotif(NotificationInterval.OneDay);
                      }}
                    >
                      <HStack>
                        {notifSettings.filter(
                          (opt) => opt.delay == NotificationInterval.OneDay
                        ).length > 0 && <CheckIcon />}
                        <Text>1 day left to vote</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setNotif(NotificationInterval.TwoDays);
                      }}
                    >
                      <HStack>
                        {notifSettings.filter(
                          (opt) => opt.delay == NotificationInterval.TwoDays
                        ).length > 0 && <CheckIcon />}
                        <Text>2 days left to vote</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setNotif(NotificationInterval.ThreeDays);
                      }}
                    >
                      <HStack>
                        {notifSettings.filter(
                          (opt) => opt.delay == NotificationInterval.ThreeDays
                        ).length > 0 && <CheckIcon />}
                        <Text>3 days left to vote</Text>
                      </HStack>
                    </MenuItem>
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
