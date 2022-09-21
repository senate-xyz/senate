import {
  Divider,
  Flex,
  Grid,
  HStack,
  Icon,
  Spacer,
  Switch,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FaBell, FaDiscord, FaSlack, FaTelegram } from "react-icons/fa";
import {
  NotificationChannelEnum,
  NotificationChannelType,
  NotificationIntervalEnum,
  NotificationSettingType,
} from "../../../../types";

export const Settings = () => {
  const { data: session } = useSession();
  const toast = useToast();

  const [epns, setEpns] = useState(false);
  const [discord, setDiscord] = useState(false);
  const [slack, setSlack] = useState(false);
  const [telegram, setTelegram] = useState(false);

  const [onNew, setOnNew] = useState(false);
  const [oneHour, setOneHour] = useState(false);
  const [twoHours, setTwoHours] = useState(false);
  const [threeHours, setThreeHours] = useState(false);
  const [sixHours, setSixHours] = useState(false);
  const [twelveHours, setTwelveHours] = useState(false);
  const [oneDay, setOneDay] = useState(false);
  const [twoDays, setTwoDays] = useState(false);
  const [threeDays, setThreeDays] = useState(false);

  useEffect(() => {
    if (!session)
      toast({
        title: "Not signed in",
        description: "Vote tracker requires you to sign in first",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
  });

  useEffect(() => {
    fetch(
      `/api/settings/general/notificationChannels?userAddress=${session?.user?.name}`,
      {
        method: "GET",
      }
    ).then((response) => {
      if (response.status == 200)
        response.json().then((channels) => {
          if (channels.length)
            channels.map((channel: any) => {
              switch (channel.type) {
                case NotificationChannelEnum.Discord:
                  setDiscord(true);
                  break;
                case NotificationChannelEnum.Slack:
                  setSlack(true);
                  break;
                case NotificationChannelEnum.Telegram:
                  setTelegram(true);
                  break;
                case NotificationChannelEnum.EPNS:
                  setEpns(true);
                  break;
              }
            });
        });
    });

    fetch(
      `/api/settings/general/notificationSettings?userAddress=${session?.user?.name}`,
      {
        method: "GET",
      }
    ).then((response) => {
      if (response.status == 200)
        response.json().then((settings) => {
          if (settings.length)
            settings.map((setting: any) => {
              switch (setting.delay) {
                case NotificationIntervalEnum.NewProposal:
                  setOnNew(true);
                  break;
                case NotificationIntervalEnum.OneHour:
                  setOneHour(true);
                  break;
                case NotificationIntervalEnum.TwoHours:
                  setTwoHours(true);
                  break;
                case NotificationIntervalEnum.ThreeHours:
                  setThreeHours(true);
                  break;
                case NotificationIntervalEnum.SixHours:
                  setSixHours(true);
                  break;
                case NotificationIntervalEnum.TwelveHours:
                  setTwelveHours(true);
                  break;
                case NotificationIntervalEnum.OneDay:
                  setOneDay(true);
                  break;
                case NotificationIntervalEnum.TwoDays:
                  setTwoDays(true);
                  break;
                case NotificationIntervalEnum.ThreeDays:
                  setThreeDays(true);
                  break;
              }
            });
        });
    });
  }, [session?.user?.name]);

  const updateDiscord = (val: boolean) => {
    setDiscord(val);

    let tmp: NotificationChannelType = {
      type: NotificationChannelEnum.Discord,
      connector: "#defaultConnector",
    };

    fetch(
      `/api/settings/general/notificationChannels?userAddress=${session?.user?.name}`,
      {
        method: val ? "PUT" : "DELETE",
        body: JSON.stringify(tmp),
      }
    );
  };

  const updateSlack = (val: boolean) => {
    setSlack(val);

    let tmp: NotificationChannelType = {
      type: NotificationChannelEnum.Slack,
      connector: "#defaultConnector",
    };

    fetch(
      `/api/settings/general/notificationChannels?userAddress=${session?.user?.name}`,
      {
        method: val ? "PUT" : "DELETE",
        body: JSON.stringify(tmp),
      }
    );
  };

  const updateTelegram = (val: boolean) => {
    setTelegram(val);
    let tmp: NotificationChannelType = {
      type: NotificationChannelEnum.Telegram,
      connector: "#defaultConnector",
    };

    fetch(
      `/api/settings/general/notificationChannels?userAddress=${session?.user?.name}`,
      {
        method: val ? "PUT" : "DELETE",
        body: JSON.stringify(tmp),
      }
    );
  };

  const updateEpns = (val: boolean) => {
    setEpns(val);
    let tmp: NotificationChannelType = {
      type: NotificationChannelEnum.EPNS,
      connector: "#defaultConnector",
    };

    fetch(
      `/api/settings/general/notificationChannels?userAddress=${session?.user?.name}`,
      {
        method: val ? "PUT" : "DELETE",
        body: JSON.stringify(tmp),
      }
    );
  };

  const updateOnNew = (val: boolean) => {
    setOnNew(val);
    let tmp: NotificationSettingType = {
      createdTime: new Date(),
      delay: NotificationIntervalEnum.NewProposal,
    };

    fetch(
      `/api/settings/general/notificationSettings?userAddress=${session?.user?.name}`,
      {
        method: val ? "PUT" : "DELETE",
        body: JSON.stringify(tmp),
      }
    );
  };

  const updateOneHour = (val: boolean) => {
    setOneHour(val);
    let tmp: NotificationSettingType = {
      createdTime: new Date(),
      delay: NotificationIntervalEnum.OneHour,
    };

    fetch(
      `/api/settings/general/notificationSettings?userAddress=${session?.user?.name}`,
      {
        method: val ? "PUT" : "DELETE",
        body: JSON.stringify(tmp),
      }
    );
  };

  const updateTwoHours = (val: boolean) => {
    setTwoHours(val);
    let tmp: NotificationSettingType = {
      createdTime: new Date(),
      delay: NotificationIntervalEnum.TwoHours,
    };

    fetch(
      `/api/settings/general/notificationSettings?userAddress=${session?.user?.name}`,
      {
        method: val ? "PUT" : "DELETE",
        body: JSON.stringify(tmp),
      }
    );
  };

  const updateThreeHours = (val: boolean) => {
    setThreeHours(val);
    let tmp: NotificationSettingType = {
      createdTime: new Date(),
      delay: NotificationIntervalEnum.OneHour,
    };

    fetch(
      `/api/settings/general/notificationSettings?userAddress=${session?.user?.name}`,
      {
        method: val ? "PUT" : "DELETE",
        body: JSON.stringify(tmp),
      }
    );
  };

  const updateSixHours = (val: boolean) => {
    setSixHours(val);
    let tmp: NotificationSettingType = {
      createdTime: new Date(),
      delay: NotificationIntervalEnum.SixHours,
    };

    fetch(
      `/api/settings/general/notificationSettings?userAddress=${session?.user?.name}`,
      {
        method: val ? "PUT" : "DELETE",
        body: JSON.stringify(tmp),
      }
    );
  };

  const updateTwelveHours = (val: boolean) => {
    setTwelveHours(val);
    let tmp: NotificationSettingType = {
      createdTime: new Date(),
      delay: NotificationIntervalEnum.TwelveHours,
    };

    fetch(
      `/api/settings/general/notificationSettings?userAddress=${session?.user?.name}`,
      {
        method: val ? "PUT" : "DELETE",
        body: JSON.stringify(tmp),
      }
    );
  };

  const updateOneDay = (val: boolean) => {
    setOneDay(val);
    let tmp: NotificationSettingType = {
      createdTime: new Date(),
      delay: NotificationIntervalEnum.OneDay,
    };

    fetch(
      `/api/settings/general/notificationSettings?userAddress=${session?.user?.name}`,
      {
        method: val ? "PUT" : "DELETE",
        body: JSON.stringify(tmp),
      }
    );
  };

  const updateTwoDays = (val: boolean) => {
    setTwoDays(val);
    let tmp: NotificationSettingType = {
      createdTime: new Date(),
      delay: NotificationIntervalEnum.TwoDays,
    };

    fetch(
      `/api/settings/general/notificationSettings?userAddress=${session?.user?.name}`,
      {
        method: val ? "PUT" : "DELETE",
        body: JSON.stringify(tmp),
      }
    );
  };

  const updateThreeDays = (val: boolean) => {
    setThreeDays(val);
    let tmp: NotificationSettingType = {
      createdTime: new Date(),
      delay: NotificationIntervalEnum.ThreeDays,
    };

    fetch(
      `/api/settings/general/notificationSettings?userAddress=${session?.user?.name}`,
      {
        method: val ? "PUT" : "DELETE",
        body: JSON.stringify(tmp),
      }
    );
  };

  return (
    <Flex flexDir="row" w="full">
      <Grid minH="100vh" w="full">
        <VStack m="10" spacing={5} p="5" align="center">
          <Text>General settings</Text>
          <Divider />
          <HStack align="start" justify="space-evenly" w="full">
            <VStack>
              <Text>Notification frequency</Text>
              <Divider />
              <VStack align="start" w="20rem">
                <HStack justify="space-between" w="full">
                  <HStack>
                    <Text>On new proposal</Text>
                  </HStack>
                  <Switch
                    isChecked={onNew}
                    onChange={() => updateOnNew(!onNew)}
                  ></Switch>
                </HStack>
                <HStack justify="space-between" w="full">
                  <HStack>
                    <Text>1 hour left to the deadline</Text>
                  </HStack>
                  <Spacer />
                  <Switch
                    isChecked={oneHour}
                    onChange={() => updateOneHour(!oneHour)}
                  ></Switch>
                </HStack>
                <HStack justify="space-between" w="full">
                  <HStack>
                    <Text>2 hours left to the deadline</Text>
                  </HStack>
                  <Switch
                    isChecked={twoHours}
                    onChange={() => updateTwoHours(!twoHours)}
                  ></Switch>
                </HStack>
                <HStack justify="space-between" w="full">
                  <HStack>
                    <Text>3 hours left to the deadline</Text>
                  </HStack>
                  <Switch
                    isChecked={threeHours}
                    onChange={() => updateThreeHours(!threeHours)}
                  ></Switch>
                </HStack>
                <HStack justify="space-between" w="full">
                  <HStack>
                    <Text>6 hours left to the deadline</Text>
                  </HStack>
                  <Switch
                    isChecked={sixHours}
                    onChange={() => updateSixHours(!sixHours)}
                  ></Switch>
                </HStack>
                <HStack justify="space-between" w="full">
                  <HStack>
                    <Text>12 hours left to the deadline</Text>
                  </HStack>
                  <Switch
                    isChecked={twelveHours}
                    onChange={() => updateTwelveHours(!twelveHours)}
                  ></Switch>
                </HStack>
                <HStack justify="space-between" w="full">
                  <HStack>
                    <Text>1 day left to the deadline</Text>
                  </HStack>
                  <Switch
                    isChecked={oneDay}
                    onChange={() => updateOneDay(!oneDay)}
                  ></Switch>
                </HStack>
                <HStack justify="space-between" w="full">
                  <HStack>
                    <Text>2 days left to the deadline</Text>
                  </HStack>
                  <Switch
                    isChecked={twoDays}
                    onChange={() => updateTwoDays(!twoDays)}
                  ></Switch>
                </HStack>
                <HStack justify="space-between" w="full">
                  <HStack>
                    <Text>3 days left to the deadline</Text>
                  </HStack>
                  <Switch
                    isChecked={threeDays}
                    onChange={() => updateThreeDays(!threeDays)}
                  ></Switch>
                </HStack>
              </VStack>
              <Divider />
            </VStack>

            <Divider orientation="vertical" />

            <VStack>
              <Text>Notification channels</Text>
              <Divider />
              <VStack align="start" w="10rem">
                <HStack justify="space-between" w="full">
                  <HStack>
                    <Icon as={FaBell} /> <Text>EPNS</Text>
                  </HStack>
                  <Switch
                    isChecked={epns}
                    onChange={() => updateEpns(!epns)}
                  ></Switch>
                </HStack>
                <HStack justify="space-between" w="full">
                  <HStack>
                    <Icon as={FaDiscord} />
                    <Text>Discord</Text>
                  </HStack>
                  <Spacer />
                  <Switch
                    isChecked={discord}
                    onChange={() => updateDiscord(!discord)}
                  ></Switch>
                </HStack>
                <HStack justify="space-between" w="full">
                  <HStack>
                    <Icon as={FaSlack} />
                    <Text>Slack</Text>
                  </HStack>
                  <Switch
                    isChecked={slack}
                    onChange={() => updateSlack(!slack)}
                  ></Switch>
                </HStack>
                <HStack justify="space-between" w="full">
                  <HStack>
                    <Icon as={FaTelegram} />
                    <Text>Telegram</Text>
                  </HStack>
                  <Switch
                    isChecked={telegram}
                    onChange={() => updateTelegram(!telegram)}
                  ></Switch>
                </HStack>
              </VStack>
            </VStack>
          </HStack>
        </VStack>
      </Grid>
    </Flex>
  );
};

export default Settings;
