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
  NotificationChannelType,
  NotificationChannelEnum,
  NotificationIntervalEnum,
  NotificationSettingType,
} from "../../../../types";
import { FaDiscord, FaSlack } from "react-icons/fa";
import { ChevronDownIcon, BellIcon, CheckIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import moment from "moment";
import { useAccount } from "wagmi";

export const SubscriptionItem = (props: { dao: DaoType }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [notifSettings, setNotifSettings] = useState<NotificationSettingType[]>(
    []
  );
  const [notifChannels, setNotifChannels] = useState<NotificationChannelType[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const [{ data: accountData }] = useAccount();

  const getData = () => {
    let settingsDone = false;
    let channelsDone = false;

    fetch(
      `/api/notificationSettings?userAddress=${
        accountData?.address
      }&daoId=${String(props.dao.id)}`,
      {
        method: "GET",
      }
    ).then((response) => {
      response.json().then((data) => {
        setNotifSettings(data);
        settingsDone = true;
        if (channelsDone == true) setLoading(false);
      });
    });

    fetch(
      `/api/notificationChannels?userAddress=${String(
        accountData?.address
      )}&daoId=${String(props.dao.id)}`,
      {
        method: "GET",
      }
    ).then((response) => {
      response.json().then((data) => {
        setNotifChannels(data);
        channelsDone = true;
        if (settingsDone == true) setLoading(false);
      });
    });
  };

  useEffect(() => {
    getData();
  }, [accountData]);

  const setChannel = (arg: NotificationChannelEnum, method: string) => {
    let tmp: NotificationChannelType = {
      type: arg,
      connector: "#defaultConnector",
    };
    if (!accountData) return;
    setLoading(true);
    fetch(
      `/api/notificationChannels?userAddress=${
        accountData?.address
      }&daoId=${String(props.dao.id)}`,
      {
        method: method,
        body: JSON.stringify(tmp),
      }
    ).then(() => {
      getData();
    });
  };

  const setSetting = (arg: NotificationIntervalEnum, method: string) => {
    let tmp: NotificationSettingType = {
      createdTime: new Date(),
      delay: arg,
    };
    if (!accountData) return;
    setLoading(true);
    fetch(
      `/api/notificationSettings?userAddress=${
        accountData?.address
      }&daoId=${String(props.dao.id)}`,
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
                        (opt) => opt.type == NotificationChannelEnum.Discord
                      ).length > 0
                    }
                    onChange={() => {
                      setChannel(
                        NotificationChannelEnum.Discord,
                        notifChannels.filter(
                          (opt) => opt.type == NotificationChannelEnum.Discord
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
                        (opt) => opt.type == NotificationChannelEnum.Slack
                      ).length > 0
                    }
                    onChange={() => {
                      setChannel(
                        NotificationChannelEnum.Slack,
                        notifChannels.filter(
                          (opt) => opt.type == NotificationChannelEnum.Slack
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
                          NotificationIntervalEnum.NewProposal,
                          notifSettings.filter(
                            (opt) =>
                              opt.delay == NotificationIntervalEnum.NewProposal
                          ).length > 0
                            ? "DELETE"
                            : "PUT"
                        );
                      }}
                    >
                      <HStack>
                        {notifSettings.filter(
                          (opt) =>
                            opt.delay == NotificationIntervalEnum.NewProposal
                        ).length > 0 && <CheckIcon />}
                        <Text>New proposal</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setSetting(
                          NotificationIntervalEnum.OneHour,
                          notifSettings.filter(
                            (opt) =>
                              opt.delay == NotificationIntervalEnum.OneHour
                          ).length > 0
                            ? "DELETE"
                            : "PUT"
                        );
                      }}
                    >
                      <HStack>
                        {notifSettings.filter(
                          (opt) => opt.delay == NotificationIntervalEnum.OneHour
                        ).length > 0 && <CheckIcon />}
                        <Text>1 hour left to vote</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setSetting(
                          NotificationIntervalEnum.TwoHours,
                          notifSettings.filter(
                            (opt) =>
                              opt.delay == NotificationIntervalEnum.TwoHours
                          ).length > 0
                            ? "DELETE"
                            : "PUT"
                        );
                      }}
                    >
                      <HStack>
                        {notifSettings.filter(
                          (opt) =>
                            opt.delay == NotificationIntervalEnum.TwoHours
                        ).length > 0 && <CheckIcon />}
                        <Text>2 hours left to vote</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setSetting(
                          NotificationIntervalEnum.ThreeHours,
                          notifSettings.filter(
                            (opt) =>
                              opt.delay == NotificationIntervalEnum.ThreeHours
                          ).length > 0
                            ? "DELETE"
                            : "PUT"
                        );
                      }}
                    >
                      <HStack>
                        {notifSettings.filter(
                          (opt) =>
                            opt.delay == NotificationIntervalEnum.ThreeHours
                        ).length > 0 && <CheckIcon />}
                        <Text>3 hours left to vote</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setSetting(
                          NotificationIntervalEnum.SixHours,
                          notifSettings.filter(
                            (opt) =>
                              opt.delay == NotificationIntervalEnum.SixHours
                          ).length > 0
                            ? "DELETE"
                            : "PUT"
                        );
                      }}
                    >
                      <HStack>
                        {notifSettings.filter(
                          (opt) =>
                            opt.delay == NotificationIntervalEnum.SixHours
                        ).length > 0 && <CheckIcon />}
                        <Text>6 hours left to vote</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setSetting(
                          NotificationIntervalEnum.TwelveHours,
                          notifSettings.filter(
                            (opt) =>
                              opt.delay == NotificationIntervalEnum.TwelveHours
                          ).length > 0
                            ? "DELETE"
                            : "PUT"
                        );
                      }}
                    >
                      <HStack>
                        {notifSettings.filter(
                          (opt) =>
                            opt.delay == NotificationIntervalEnum.TwelveHours
                        ).length > 0 && <CheckIcon />}
                        <Text>12 hours left to vote</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setSetting(
                          NotificationIntervalEnum.OneDay,
                          notifSettings.filter(
                            (opt) =>
                              opt.delay == NotificationIntervalEnum.OneDay
                          ).length > 0
                            ? "DELETE"
                            : "PUT"
                        );
                      }}
                    >
                      <HStack>
                        {notifSettings.filter(
                          (opt) => opt.delay == NotificationIntervalEnum.OneDay
                        ).length > 0 && <CheckIcon />}
                        <Text>1 day left to vote</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setSetting(
                          NotificationIntervalEnum.TwoDays,
                          notifSettings.filter(
                            (opt) =>
                              opt.delay == NotificationIntervalEnum.TwoDays
                          ).length > 0
                            ? "DELETE"
                            : "PUT"
                        );
                      }}
                    >
                      <HStack>
                        {notifSettings.filter(
                          (opt) => opt.delay == NotificationIntervalEnum.TwoDays
                        ).length > 0 && <CheckIcon />}
                        <Text>2 days left to vote</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setSetting(
                          NotificationIntervalEnum.ThreeDays,
                          notifSettings.filter(
                            (opt) =>
                              opt.delay == NotificationIntervalEnum.ThreeDays
                          ).length > 0
                            ? "DELETE"
                            : "PUT"
                        );
                      }}
                    >
                      <HStack>
                        {notifSettings.filter(
                          (opt) =>
                            opt.delay == NotificationIntervalEnum.ThreeDays
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
