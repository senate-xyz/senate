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
  Spinner,
  useToast,
  AvatarGroup,
  useColorMode,
  Box,
  createIcon,
} from "@chakra-ui/react";
import { DaoType } from "common-types";
import { FaDiscord, FaSlack, FaTelegram } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export const EPNSIcon = createIcon({
  displayName: "EPNSIcon",
  viewBox: "10 15 120 120",
  // path can also be an array of elements, if you have multiple paths, lines, shapes, etc.
  path: [
    // eslint-disable-next-line react/jsx-key
    <path
      fill="#fdfefd"
      d="M47.5 24.5c1.478-.262 2.811.071 4 1-12.259 3.92-18.925 12.253-20 25 .219 1.175-.114 2.175-1 3-1.608-8.68.726-16.18 7-22.5a112.802 112.802 0 0010-6.5zM97.5 24.5c10.518 2.514 17.684 8.847 21.5 19 .824 3.382.657 6.716-.5 10-.506-13.652-7.172-22.485-20-26.5-.752-.67-1.086-1.504-1-2.5z"
    />,
    // eslint-disable-next-line react/jsx-key
    <path
      fill="#fdfefd"
      d="M52.5 33.5c-3.254.294-5.92 1.627-8 4-4.59 3.845-7.09 8.845-7.5 15-1.032-8.88 2.468-15.38 10.5-19.5 1.887-.78 3.554-.613 5 .5zM96.5 33.5c7.261.011 12.428 3.678 15.5 11a16.242 16.242 0 010 8c-.656-10.145-5.823-16.478-15.5-19zM101.5 57.5c-.6 1.4-1.6 2.4-3 3-.904.709-1.237 1.709-1 3h-6c-1.493 6.987-5.327 8.654-11.5 5-7.858 3.453-16.025 3.953-24.5 1.5-3.193-1.025-4.526-3.192-4-6.5h-4v-5c2.477-9.811 8.477-16.478 18-20 2.376-6.874 7.043-8.874 14-6 2.168 2.133 3.834 4.633 5 7.5 8.581 3.08 14.248 8.913 17 17.5z"
    />,
    // eslint-disable-next-line react/jsx-key
    <path
      fill="#fdfefd"
      d="M101.5 57.5c.986 4.47 1.319 9.137 1 14-.722.418-1.222 1.084-1.5 2l-1-1A631.736 631.736 0 0089.5 77c-8.202.211-16.369.711-24.5 1.5a95.283 95.283 0 00-16.5-7c-.607.124-.94.457-1 1-.934-1.068-1.268-2.401-1-4-.313-3.542.02-6.875 1-10v10c4.917 2.696 10.25 4.53 16 5.5 10.86.678 21.526-.322 32-3 3.36-2.902 4.36-6.402 3-10.5 1.4-.6 2.4-1.6 3-3z"
    />,
    // eslint-disable-next-line react/jsx-key
    <path
      fill="#fdfefd"
      d="M98.5 60.5c1.36 4.098.36 7.598-3 10.5-10.474 2.678-21.14 3.678-32 3-5.75-.97-11.083-2.804-16-5.5v-5h4c-.526 3.308.807 5.475 4 6.5 8.475 2.453 16.642 1.953 24.5-1.5 6.173 3.654 10.007 1.987 11.5-5h6c-.237-1.291.096-2.291 1-3z"
    />,
    // eslint-disable-next-line react/jsx-key
    <path
      fill="#fdfefd"
      d="M102.5 71.5v8c-5.344-.166-10.677 0-16 .5-7.938.716-15.605 2.216-23 4.5-3.035-2.34-6.368-4.34-10-6-1.603-2.454-3.603-4.454-6-6 .06-.543.393-.876 1-1a95.283 95.283 0 0116.5 7A346.102 346.102 0 0189.5 77a631.736 631.736 0 0110.5-4.5l1 1c.278-.916.778-1.582 1.5-2z"
    />,
    // eslint-disable-next-line react/jsx-key
    <path
      fill="#fdfefd"
      d="M102.5 79.5v9c-1.808-1.418-2.475-3.418-2-6-10.982-.238-21.649 1.096-32 4v4c-1.542-.8-3.209-1.134-5-1v-5c7.395-2.284 15.062-3.784 23-4.5 5.323-.5 10.656-.666 16-.5zM46.5 68.5c-.268 1.599.066 2.932 1 4 2.397 1.546 4.397 3.546 6 6 3.632 1.66 6.965 3.66 10 6v5a13.213 13.213 0 00-5-2c.13-.876-.203-1.543-1-2a1230.906 1230.906 0 01-10-6c-.358 3.189-1.025 6.189-2 9-.324-6.854.01-13.521 1-20z"
    />,
    // eslint-disable-next-line react/jsx-key
    <path
      fill="#fdfefd"
      d="M102.5 88.5c1.217 2.567 2.884 4.9 5 7a58.379 58.379 0 00-9-5v5h-3c-.163-2.357.003-4.69.5-7l1 1a10.76 10.76 0 012.5-3 20.627 20.627 0 00-6-2 111.518 111.518 0 01-11 1.5c-2.069 1.646-3.402 3.813-4 6.5-.929-1.05-1.595-1.05-2 0-1.838-.346-3.838-.346-6 0-1.022-.356-1.689-1.022-2-2v-4c10.351-2.904 21.018-4.238 32-4-.475 2.582.192 4.582 2 6zM58.5 87.5v3c-1.464-.905-2.798-.905-4 0-.958-.453-1.792-1.12-2.5-2-.278.916-.778 1.582-1.5 2-1.666-6.398-3-6.065-4 1-.734 1.208-1.067 2.541-1 4h-4c2.104-1.872 3.437-4.205 4-7 .975-2.811 1.642-5.811 2-9 3.221 1.954 6.555 3.954 10 6 .797.457 1.13 1.124 1 2z"
    />,
    // eslint-disable-next-line react/jsx-key
    <path
      fill="#fdfefd"
      d="M58.5 87.5c1.822.33 3.49.998 5 2 1.791-.134 3.458.2 5 1 .311.978.978 1.644 2 2 2.162-.346 4.162-.346 6 0 .709.904 1.709 1.237 3 1v4a18.436 18.436 0 00-6 .5c-.457.414-.79.914-1 1.5 2.768.898 5.101 2.231 7 4h-16c1.042-5.647-.625-9.98-5-13v-3zM46.5 91.5c.758 2.481.758 5.148 0 8h-8v4c-3.568-.259-4.901-2.259-4-6 .11-.617.444-1.117 1-1.5a18.436 18.436 0 016-.5h4c-.067-1.459.266-2.792 1-4zM54.5 90.5c1.16.765 2.16 1.765 3 3a176.684 176.684 0 01-2 9 19.372 19.372 0 01-8 1 19.588 19.588 0 013.5-2 82.992 82.992 0 01-.5-11c.722-.418 1.222-1.084 1.5-2 .708.88 1.542 1.547 2.5 2z"
    />,
    // eslint-disable-next-line react/jsx-key
    <path
      fill="#fdfefd"
      d="M107.5 95.5c1.792-.134 3.458.2 5 1a6.845 6.845 0 001 4l-2 2a256.825 256.825 0 01-32 1c-1.899-1.769-4.232-3.102-7-4a3.646 3.646 0 011-1.5 18.436 18.436 0 016-.5v-4c-1.291.237-2.291-.096-3-1 .405-1.05 1.071-1.05 2 0 .598-2.688 1.931-4.854 4-6.5 3.695-.318 7.362-.818 11-1.5a20.627 20.627 0 016 2 10.76 10.76 0 00-2.5 3l-1-1a24.939 24.939 0 00-.5 7h3v-5a58.379 58.379 0 019 5zM50.5 90.5c-.079 3.63.088 7.296.5 11a19.588 19.588 0 00-3.5 2v1h-12c-1.493-.812-2.16-2.145-2-4 .02-1.226.353-2.226 1-3-.901 3.741.432 5.741 4 6v-4h8c.758-2.852.758-5.519 0-8 1-7.065 2.334-7.398 4-1z"
    />,
    // eslint-disable-next-line react/jsx-key
    <path
      fill="#fdfefd"
      d="M58.5 90.5c4.375 3.02 6.042 7.353 5 13v1h-16v-1c2.75.226 5.416-.107 8-1a176.684 176.684 0 002-9c-.84-1.235-1.84-2.235-3-3 1.202-.905 2.536-.905 4 0z"
    />,
    // eslint-disable-next-line react/jsx-key
    <path
      fill="#fdfefd"
      d="M112.5 96.5c2.222.059 3.222 1.225 3 3.5-.117 2.616-1.45 4.116-4 4.5h-48v-1h16a256.825 256.825 0 0032-1l2-2a6.845 6.845 0 01-1-4zM59.5 109.5h30c-1.872 10.707-8.205 15.54-19 14.5-2.739-1.026-5.072-2.526-7-4.5 5.091 2.058 10.425 3.058 16 3a4.932 4.932 0 01.5-3c4.261-1.084 6.428-3.751 6.5-8h-6c-.545 3.672-.878 3.338-1-1a128.508 128.508 0 00-16 .5c-1.607 1.049-2.273 2.549-2 4.5-.958-1.802-1.625-3.802-2-6z"
    />,
    // eslint-disable-next-line react/jsx-key
    <path
      fill="#fdfefd"
      d="M63.5 119.5c-1.1-1.105-1.767-2.438-2-4-.273-1.951.393-3.451 2-4.5a128.508 128.508 0 0116-.5c.122 4.338.455 4.672 1 1h6c-.072 4.249-2.239 6.916-6.5 8a4.932 4.932 0 00-.5 3c-5.575.058-10.909-.942-16-3z"
    />,
  ],
});

export const SubscriptionItem = (props: { dao: DaoType }) => {
  const { colorMode } = useColorMode();
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
    <VStack
      w="10rem"
      h="12em"
      p="1rem"
      border={subscribe ? "2px" : "1px"}
      bgColor={
        colorMode == "light"
          ? subscribe
            ? "blackAlpha.50"
            : "blackAlpha.300"
          : subscribe
          ? "whiteAlpha.300"
          : "whiteAlpha.50"
      }
      borderColor={
        colorMode == "light"
          ? subscribe
            ? "blackAlpha.300"
            : "blackAlpha.300"
          : subscribe
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
          {props.dao.address.length && (
            <Avatar
              bg="white"
              name="eth"
              src="https://assets.coingecko.com/coins/images/279/thumb/ethereum.png"
              boxSize={{ base: "25px", md: "30px" }}
            />
          )}
          {props.dao.snapshotSpace.length && (
            <Avatar
              bg="white"
              name="snapshot"
              src="https://avatars.githubusercontent.com/u/72904068?s=200&v=4"
              boxSize={{ base: "25px", md: "30px" }}
            />
          )}
        </AvatarGroup>
      </Avatar>
      <Text>{props.dao.name}</Text>
      <Spacer />
      <HStack>
        <Icon as={EPNSIcon} />
        <Icon as={FaDiscord} />
        <Icon as={FaSlack} />
        <Icon as={FaTelegram} />
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose} size="xs" isCentered>
        <ModalOverlay backdropFilter="blur(2px)" />
        <ModalContent>
          {/* <ModalHeader>Set notification settings</ModalHeader> */}
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
                  {loading && (
                    <Center>
                      <Spinner />
                    </Center>
                  )}
                </HStack>
                {/* <Divider /> */}
                <HStack>
                  {/* <Icon as={FaBell} /> */}
                  <Text>Subscribed</Text>
                  <Switch
                    isChecked={subscribe}
                    onChange={() => {
                      storeSubscribe(!subscribe);
                      setSubscribe(!subscribe);
                    }}
                  ></Switch>
                </HStack>

                {/* <Divider /> */}
                {/* <Text>DAO specific settings</Text>
                  <Text>🚧 under construction 🚧</Text> */}
                <Divider />
                <VStack>
                  <Text fontWeight="600">Notifications</Text>

                  <HStack>
                    <VStack>
                      <HStack>
                        <Icon as={EPNSIcon} boxSize="8" />
                        {/* <Text>EPNS</Text> */}
                        <Switch
                          size="md"
                          disabled
                          isChecked={true}
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
                        <Icon as={FaDiscord} boxSize="8" />
                        {/* <Text>Discord</Text> */}
                        <Switch
                          size="md"
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
                    </VStack>

                    <Box w="1rem" />

                    <VStack>
                      <HStack>
                        <Icon as={FaSlack} boxSize="8" />
                        {/* <Text>Slack</Text> */}
                        <Switch
                          size="md"
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
                        <Icon as={FaTelegram} boxSize="8" />
                        {/* <Text>Telegram</Text> */}
                        <Switch
                          size="md"
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
                  </HStack>
                </VStack>
                {/* <Divider /> */}
                {/* <VStack>
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
                  </Menu> */}
              </VStack>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};
