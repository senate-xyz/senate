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
  useToast,
} from "@chakra-ui/react";
import {
  DaoType,
  NotificationChannelType,
  NotificationChannelEnum,
  NotificationIntervalEnum,
  NotificationSettingType,
} from "../../../../types";
import {
  FaBell,
  FaDiscord,
  FaEthereum,
  FaSlack,
  FaTelegram,
} from "react-icons/fa";
import { ChevronDownIcon, BellIcon, CheckIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import moment from "moment";
import { useSession } from "next-auth/react";

export const SubscriptionItem = (props: { dao: DaoType }) => {
  const { data: session } = useSession();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [subscribe, setSubscribe] = useState(false);

  const [loading, setLoading] = useState(true);

  // const [notifSettings, setNotifSettings] = useState<NotificationSettingType[]>(
  //   []
  // );
  // const [notifChannels, setNotifChannels] = useState<NotificationChannelType[]>(
  //   []
  // );

  useEffect(() => {
    fetch(
      `/api/settings/individual/subscription?userAddress=${
        session?.user?.name
      }&daoId=${String(props.dao.id)}`,
      {
        method: "GET",
      }
    ).then((response) => {
      response.json().then((data) => {
        setSubscribe(data);
        setLoading(false);
      });
    });
  }, [props, session?.user?.name]);

  const storeSubscribe = (val: boolean) => {
    setLoading(true);
    fetch(
      `/api/settings/individual/subscription?userAddress=${
        session?.user?.name
      }&daoId=${String(props.dao.id)}`,
      {
        method: val ? "PUT" : "DELETE",
      }
    ).then((response) => {
      setLoading(false);
    });
  };

  // const setChannel = (arg: NotificationChannelEnum, method: string) => {
  //   let tmp: NotificationChannelType = {
  //     type: arg,
  //     connector: "#defaultConnector",
  //   };

  //   setLoading(true);
  //   fetch(
  //     `/api/individualsettings/notificationChannels?userAddress=${
  //       session?.user?.name
  //     }&daoId=${String(props.dao.id)}`,
  //     {
  //       method: method,
  //       body: JSON.stringify(tmp),
  //     }
  //   ).then(() => {
  //     getData();
  //   });
  // };

  // const setSetting = (arg: NotificationIntervalEnum, method: string) => {
  //   let tmp: NotificationSettingType = {
  //     createdTime: new Date(),
  //     delay: arg,
  //   };

  //   setLoading(true);
  //   fetch(
  //     `/api/individualsettings/notificationSettings?userAddress=${
  //       session?.user?.name
  //     }&daoId=${String(props.dao.id)}`,
  //     {
  //       method: method,
  //       body: JSON.stringify(tmp),
  //     }
  //   ).then(() => {
  //     getData();
  //   });
  // };

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
    <HStack
      p="1rem"
      border="1px"
      borderRadius="5px"
      borderColor={subscribe ? "gray.400" : "gray.200"}
      background={subscribe ? "gray.200" : "gray.100"}
      w="full"
      onClick={session ? onOpen : signedOutWarning}
    >
      <Avatar src={props.dao.picture}></Avatar>
      <Text>{props.dao.name}</Text>
      <Spacer />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay backdropFilter="blur(2px)" />
        <ModalContent>
          <ModalHeader>Set notification settings</ModalHeader>
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
                  <Icon as={FaBell} />
                  <Switch
                    isChecked={subscribe}
                    onChange={() => {
                      storeSubscribe(!subscribe);
                      setSubscribe(!subscribe);
                    }}
                  ></Switch>
                </HStack>

                <Divider />
                <Text>DAO specific settings</Text>
                <Text>🚧 under construction 🚧</Text>
                <Divider />
                <VStack>
                  <HStack>
                    <Icon as={FaBell} /> <Text>EPNS</Text>
                    <Switch
                      disabled
                      // isChecked={
                      //   notifChannels.filter(
                      //     (opt) => opt.type == NotificationChannelEnum.Slack
                      //   ).length > 0
                      // }
                      // onChange={() => {
                      //   setChannel(
                      //     NotificationChannelEnum.Slack,
                      //     notifChannels.filter(
                      //       (opt) => opt.type == NotificationChannelEnum.Slack
                      //     ).length > 0
                      //       ? "DELETE"
                      //       : "PUT"
                      //   );
                      // }}
                    ></Switch>
                  </HStack>
                  <HStack>
                    <Icon as={FaDiscord} />
                    <Text>Discord</Text>
                    <Switch
                      disabled
                      // isChecked={
                      //   notifChannels.filter(
                      //     (opt) => opt.type == NotificationChannelEnum.Discord
                      //   ).length > 0
                      // }
                      // onChange={() => {
                      //   setChannel(
                      //     NotificationChannelEnum.Discord,
                      //     notifChannels.filter(
                      //       (opt) => opt.type == NotificationChannelEnum.Discord
                      //     ).length > 0
                      //       ? "DELETE"
                      //       : "PUT"
                      //   );
                      // }}
                    ></Switch>
                  </HStack>
                  <HStack>
                    <Icon as={FaSlack} />
                    <Text>Slack</Text>
                    <Switch
                      disabled
                      // isChecked={
                      //   notifChannels.filter(
                      //     (opt) => opt.type == NotificationChannelEnum.Slack
                      //   ).length > 0
                      // }
                      // onChange={() => {
                      //   setChannel(
                      //     NotificationChannelEnum.Slack,
                      //     notifChannels.filter(
                      //       (opt) => opt.type == NotificationChannelEnum.Slack
                      //     ).length > 0
                      //       ? "DELETE"
                      //       : "PUT"
                      //   );
                      // }}
                    ></Switch>
                  </HStack>
                  <HStack>
                    <Icon as={FaTelegram} />
                    <Text>Telegram</Text>
                    <Switch
                      disabled
                      // isChecked={
                      //   notifChannels.filter(
                      //     (opt) => opt.type == NotificationChannelEnum.Slack
                      //   ).length > 0
                      // }
                      // onChange={() => {
                      //   setChannel(
                      //     NotificationChannelEnum.Slack,
                      //     notifChannels.filter(
                      //       (opt) => opt.type == NotificationChannelEnum.Slack
                      //     ).length > 0
                      //       ? "DELETE"
                      //       : "PUT"
                      //   );
                      // }}
                    ></Switch>
                  </HStack>
                </VStack>
                <Divider />
                <VStack>
                  <Text>Active notifications:</Text>
                  {/* {notifSettings.map(
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
                  )} */}
                </VStack>
                <Menu>
                  <MenuButton
                    disabled
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                  >
                    Set notification
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      onClick={() => {
                        // setSetting(
                        //   NotificationIntervalEnum.NewProposal,
                        //   notifSettings.filter(
                        //     (opt) =>
                        //       opt.delay == NotificationIntervalEnum.NewProposal
                        //   ).length > 0
                        //     ? "DELETE"
                        //     : "PUT"
                        // );
                      }}
                    >
                      <HStack>
                        {/* {notifSettings.filter(
                          (opt) =>
                            opt.delay == NotificationIntervalEnum.NewProposal
                        ).length > 0 && <CheckIcon />} */}
                        <Text>New proposal</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        // setSetting(
                        //   NotificationIntervalEnum.OneHour,
                        //   notifSettings.filter(
                        //     (opt) =>
                        //       opt.delay == NotificationIntervalEnum.OneHour
                        //   ).length > 0
                        //     ? "DELETE"
                        //     : "PUT"
                        // );
                      }}
                    >
                      <HStack>
                        {/* {notifSettings.filter(
                          (opt) => opt.delay == NotificationIntervalEnum.OneHour
                        ).length > 0 && <CheckIcon />} */}
                        <Text>1 hour left to vote</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        // setSetting(
                        //   NotificationIntervalEnum.TwoHours,
                        //   notifSettings.filter(
                        //     (opt) =>
                        //       opt.delay == NotificationIntervalEnum.TwoHours
                        //   ).length > 0
                        //     ? "DELETE"
                        //     : "PUT"
                        // );
                      }}
                    >
                      <HStack>
                        {/* {notifSettings.filter(
                          (opt) =>
                            opt.delay == NotificationIntervalEnum.TwoHours
                        ).length > 0 && <CheckIcon />} */}
                        <Text>2 hours left to vote</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        // setSetting(
                        //   NotificationIntervalEnum.ThreeHours,
                        //   notifSettings.filter(
                        //     (opt) =>
                        //       opt.delay == NotificationIntervalEnum.ThreeHours
                        //   ).length > 0
                        //     ? "DELETE"
                        //     : "PUT"
                        // );
                      }}
                    >
                      <HStack>
                        {/* {notifSettings.filter(
                          (opt) =>
                            opt.delay == NotificationIntervalEnum.ThreeHours
                        ).length > 0 && <CheckIcon />} */}
                        <Text>3 hours left to vote</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        // setSetting(
                        //   NotificationIntervalEnum.SixHours,
                        //   notifSettings.filter(
                        //     (opt) =>
                        //       opt.delay == NotificationIntervalEnum.SixHours
                        //   ).length > 0
                        //     ? "DELETE"
                        //     : "PUT"
                        // );
                      }}
                    >
                      <HStack>
                        {/* {notifSettings.filter(
                          (opt) =>
                            opt.delay == NotificationIntervalEnum.SixHours
                        ).length > 0 && <CheckIcon />} */}
                        <Text>6 hours left to vote</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        // setSetting(
                        //   NotificationIntervalEnum.TwelveHours,
                        //   notifSettings.filter(
                        //     (opt) =>
                        //       opt.delay == NotificationIntervalEnum.TwelveHours
                        //   ).length > 0
                        //     ? "DELETE"
                        //     : "PUT"
                        // );
                      }}
                    >
                      <HStack>
                        {/* {notifSettings.filter(
                          (opt) =>
                            opt.delay == NotificationIntervalEnum.TwelveHours
                        ).length > 0 && <CheckIcon />} */}
                        <Text>12 hours left to vote</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        // setSetting(
                        //   NotificationIntervalEnum.OneDay,
                        //   notifSettings.filter(
                        //     (opt) =>
                        //       opt.delay == NotificationIntervalEnum.OneDay
                        //   ).length > 0
                        //     ? "DELETE"
                        //     : "PUT"
                        // );
                      }}
                    >
                      <HStack>
                        {/* {notifSettings.filter(
                          (opt) => opt.delay == NotificationIntervalEnum.OneDay
                        ).length > 0 && <CheckIcon />} */}
                        <Text>1 day left to vote</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        // setSetting(
                        //   NotificationIntervalEnum.TwoDays,
                        //   notifSettings.filter(
                        //     (opt) =>
                        //       opt.delay == NotificationIntervalEnum.TwoDays
                        //   ).length > 0
                        //     ? "DELETE"
                        //     : "PUT"
                        // );
                      }}
                    >
                      <HStack>
                        {/* {notifSettings.filter(
                          (opt) => opt.delay == NotificationIntervalEnum.TwoDays
                        ).length > 0 && <CheckIcon />} */}
                        <Text>2 days left to vote</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        // setSetting(
                        //   NotificationIntervalEnum.ThreeDays,
                        //   notifSettings.filter(
                        //     (opt) =>
                        //       opt.delay == NotificationIntervalEnum.ThreeDays
                        //   ).length > 0
                        //     ? "DELETE"
                        //     : "PUT"
                        // );
                      }}
                    >
                      <HStack>
                        {/* {notifSettings.filter(
                          (opt) =>
                            opt.delay == NotificationIntervalEnum.ThreeDays
                        ).length > 0 && <CheckIcon />} */}
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
