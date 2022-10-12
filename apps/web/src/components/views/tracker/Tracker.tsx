import {
  Text,
  VStack,
  Divider,
  Avatar,
  HStack,
  Center,
  Spinner,
  Spacer,
  Tab,
  TabList,
  TabPanels,
  Tabs,
  Box,
  Container,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import { trpc } from "../../../utils/trpc";
import TrackerTable from "./table/TrackerTable";
import SharePopover from "./SharePopover";
import { DAOType } from "@senate/common-types";

export const TrackerView = (props: {
  address?: string;
  shareButton: boolean;
}) => {
  const [daos, setDaos] = useState<DAOType[]>([]);
  const [selectedDao, setSelectedDao] = useState<string>();

  const { data: session } = useSession();

  const votes = trpc.useQuery([
    "tracker.track",
    {
      address: props.address
        ? props.address
        : session?.user?.id ?? "0x000000000000000000000000000000000000dEaD",
    },
  ]);

  useEffect(() => {
    if (!votes.data) return;

    const daosTabs = votes.data
      .map((vote: { dao }) => vote.dao)
      .filter((element: { name }, index, array) => {
        return (
          array.findIndex((a: { name }) => a.name == element.name) === index
        );
      });
    setDaos(daosTabs);
  }, [votes]);

  useEffect(() => {
    if (daos[0]) setSelectedDao(daos[0].name);
  }, [daos]);

  return (
    <Box w="full">
      <VStack
        m={{ base: "0", md: "10" }}
        align="start"
        p={{ base: "2", md: "5" }}
      >
        <HStack w="full">
          <Text fontSize="3xl" fontWeight="800">
            Vote tracker
          </Text>
          <Spacer />

          {props.shareButton && <SharePopover />}
        </HStack>
        <Box pb="0.3rem" pt="1rem" />
        <Divider />
        <Box pb="0.3rem" pt="1rem" />
        {votes.isLoading && (
          <Center w="full">
            <Spinner />
          </Center>
        )}

        <Tabs w="full" variant="enclosed">
          <TabList>
            {daos.map((dao, index) => {
              return (
                <Tab
                  key={index}
                  onClick={() => {
                    setSelectedDao(dao.name);
                  }}
                >
                  <Avatar src={dao.picture} size="xs"></Avatar>
                  <Box m="2"></Box>
                  <Text>{dao.name}</Text>
                </Tab>
              );
            })}
          </TabList>

          <Container overflow="auto" w="full" maxW="90vw">
            <TabPanels w="full">
              <TrackerTable votes={votes} selectedDao={selectedDao} />
            </TabPanels>
          </Container>
        </Tabs>
      </VStack>
    </Box>
  );
};

export default TrackerView;
