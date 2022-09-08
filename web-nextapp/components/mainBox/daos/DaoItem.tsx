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
  Spinner,
} from "@chakra-ui/react";
import {
  DaoType,
  NotificationChannel,
  NotificationChannelType,
  NotificationInterval,
  NotificationSetting,
  TEST_USER,
} from "../../../../types";
import { FaDiscord, FaSlack } from "react-icons/fa";
import { ChevronDownIcon, BellIcon, CheckIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import moment from "moment";
import { Prisma } from "@prisma/client";

export const SubscriptionItem = (props: { dao: DaoType }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [notifSettings, setNotifSettings] = useState<NotificationSetting[]>([]);
  const [notifChannels, setNotifChannels] = useState<NotificationChannel[]>([]);
  const [loading, setLoading] = useState(true);

  const getData = () => {
    fetch(
      `/api/notificationSettings?userAddress=${String(
        TEST_USER
      )}&daoId=${String(props.dao.id)}`,
      {
        method: "GET",
      }
    ).then((response) => {
      response.json().then((data) => {
        setNotifSettings(data);
        setLoading(false);
      });
    });

    fetch(
      `/api/notificationChannels?userAddress=${String(
        TEST_USER
      )}&daoId=${String(props.dao.id)}`,
      {
        method: "GET",
      }
    ).then((response) => {
      response.json().then((data) => {
        setNotifChannels(data);
        setLoading(false);
      });
    });
  };

  useEffect(() => {
    getData();
  }, [props]);

  const setChannel = (arg: NotificationChannelType, method: string) => {
    let tmp: NotificationChannel = {
      type: arg,
      connector: "#defaultConnector",
    };

    setLoading(true);
    fetch(
      `/api/notificationChannels?userAddress=${String(
        TEST_USER
      )}&daoId=${String(props.dao.id)}`,
      {
        method: method,
        body: JSON.stringify(tmp),
      }
    ).then(() => {
      getData();
    });
  };

  const setSetting = (arg: NotificationInterval, method: string) => {
    let tmp: NotificationSetting = {
      createdTime: new Date(),
      delay: arg,
    };

    setLoading(true);
    fetch(
      `/api/notificationSettings?userAddress=${String(
        TEST_USER
      )}&daoId=${String(props.dao.id)}`,
      {
        method: method,
        body: JSON.stringify(tmp),
      }
    ).then(() => {
      getData();
    });
  };

  return (
    <HStack
      p="1rem"
      border="1px"
      borderRadius="5px"
      borderColor={notifChannels.length > 0 ? "gray.400" : "gray.200"}
      background={notifChannels.length > 0 ? "gray.200" : "gray.100"}
      w="full"
      onClick={onOpen}
    >
      <Avatar src={props.dao.picture}></Avatar>
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
                  <Avatar src={props.dao.picture}></Avatar>
                  <Text>{props.dao.name}</Text>
                  {loading && (
                    <Center w="full">
                      <Spinner />
                    </Center>
                  )}
                </HStack>
                <Divider />
                <HStack>
                  <Icon as={FaDiscord} />
                  <Switch
                    isChecked={
                      notifChannels.filter(
                        (opt) => opt.type == NotificationChannelType.Discord
                      ).length > 0
                    }
                    onChange={() => {
                      setChannel(
                        NotificationChannelType.Discord,
                        notifChannels.filter(
                          (opt) => opt.type == NotificationChannelType.Discord
                        ).length > 0
                          ? "DELETE"
                          : "PUT"
                      );
                    }}
                  ></Switch>
                </HStack>
                <HStack>
                  <Icon as={FaSlack} />
                  <Switch
                    isChecked={
                      notifChannels.filter(
                        (opt) => opt.type == NotificationChannelType.Slack
                      ).length > 0
                    }
                    onChange={() => {
                      setChannel(
                        NotificationChannelType.Slack,
                        notifChannels.filter(
                          (opt) => opt.type == NotificationChannelType.Slack
                        ).length > 0
                          ? "DELETE"
                          : "PUT"
                      );
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
                    Set notification
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      onClick={() => {
                        setSetting(
                          NotificationInterval.NewProposal,
                          notifSettings.filter(
                            (opt) =>
                              opt.delay == NotificationInterval.NewProposal
                          ).length > 0
                            ? "DELETE"
                            : "PUT"
                        );
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
                        setSetting(
                          NotificationInterval.OneHour,
                          notifSettings.filter(
                            (opt) => opt.delay == NotificationInterval.OneHour
                          ).length > 0
                            ? "DELETE"
                            : "PUT"
                        );
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
                        setSetting(
                          NotificationInterval.TwoHours,
                          notifSettings.filter(
                            (opt) => opt.delay == NotificationInterval.TwoHours
                          ).length > 0
                            ? "DELETE"
                            : "PUT"
                        );
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
                        setSetting(
                          NotificationInterval.ThreeHours,
                          notifSettings.filter(
                            (opt) =>
                              opt.delay == NotificationInterval.ThreeHours
                          ).length > 0
                            ? "DELETE"
                            : "PUT"
                        );
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
                        setSetting(
                          NotificationInterval.SixHours,
                          notifSettings.filter(
                            (opt) => opt.delay == NotificationInterval.SixHours
                          ).length > 0
                            ? "DELETE"
                            : "PUT"
                        );
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
                        setSetting(
                          NotificationInterval.TwelveHours,
                          notifSettings.filter(
                            (opt) =>
                              opt.delay == NotificationInterval.TwelveHours
                          ).length > 0
                            ? "DELETE"
                            : "PUT"
                        );
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
                        setSetting(
                          NotificationInterval.OneDay,
                          notifSettings.filter(
                            (opt) => opt.delay == NotificationInterval.OneDay
                          ).length > 0
                            ? "DELETE"
                            : "PUT"
                        );
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
                        setSetting(
                          NotificationInterval.TwoDays,
                          notifSettings.filter(
                            (opt) => opt.delay == NotificationInterval.TwoDays
                          ).length > 0
                            ? "DELETE"
                            : "PUT"
                        );
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
                        setSetting(
                          NotificationInterval.ThreeDays,
                          notifSettings.filter(
                            (opt) => opt.delay == NotificationInterval.ThreeDays
                          ).length > 0
                            ? "DELETE"
                            : "PUT"
                        );
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
