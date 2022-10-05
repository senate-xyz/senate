import {
  Text,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  Divider,
  Avatar,
  Link,
  HStack,
  Center,
  Spinner,
  Spacer,
  Tab,
  TabList,
  TabPanels,
  Tabs,
  useToast,
  Box,
  Container,
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Input,
} from "@chakra-ui/react";
import { ExternalLinkIcon, WarningTwoIcon } from "@chakra-ui/icons";

import { useEffect, useState } from "react";
import { Proposal } from "@senate/common-types";
import moment from "moment";
import { useSession } from "next-auth/react";

export const Tracker = () => {
  const { data: session } = useSession();
  const toast = useToast();
  const [votes, setVotes] = useState<Proposal[]>([]);
  const [daos, setDaos] = useState<any[]>([]);
  const [selectedDao, setSelectedDao] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session)
      toast({
        title: "Not signed in",
        description: "Vote tracker requires you to sign in first",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });

    setDaos([]);
    setSelectedDao("");

    let fetchUrl;
    if (session)
      fetchUrl = `/api/user/tracker/?userInputAddress=${session?.user?.name}`;
    else
      fetchUrl = `/api/unrestricted/tracker/?userInputAddress=${session?.user?.name}`;

    fetch(fetchUrl)
      .then((response) => response.json())
      .then(async (data) => {
        setLoading(false);
        setVotes(data);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    votes
      .map((vote) => vote.dao)
      .filter((element, index, array) => {
        return array.findIndex((a) => a.name == element.name) === index;
      })
      .map((dao) => {
        setDaos((oldArray) => [...oldArray, dao]);
      });
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
          <Popover>
            <PopoverTrigger>
              <Button>Share</Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverHeader>Share your voting stats</PopoverHeader>
              <PopoverBody>
                <Input
                  value={`https://dev-senate-web.onrender.com/tracker/${session?.user?.name}`}
                />
                <Button
                  my="2"
                  w="full"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `https://dev-senate-web.onrender.com/tracker/${session?.user?.name}`
                    );
                  }}
                >
                  Copy to clipboard
                </Button>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </HStack>
        <Box pb="0.3rem" pt="1rem" />
        <Divider />
        <Box pb="0.3rem" pt="1rem" />
        {loading && (
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
              <TableContainer w="full">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Proposal</Th>
                      <Th>Description</Th>
                      <Th>Time Ago</Th>
                      <Th>Voted</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {votes
                      .filter((vote) => vote.dao.name === selectedDao)
                      .map((proposal: Proposal) => {
                        return (
                          <Tr key={proposal.id}>
                            <Td>
                              <HStack>
                                <Avatar src={proposal.dao.picture}></Avatar>
                                <Link
                                  href={proposal.data["url"]}
                                  isExternal
                                  maxW="20rem"
                                >
                                  <Text noOfLines={1}>{proposal.name}</Text>
                                </Link>
                                <ExternalLinkIcon mx="2px" />
                              </HStack>
                            </Td>
                            <Td maxW={"20rem"}>
                              <Text noOfLines={1}>{proposal.description}</Text>
                            </Td>
                            <Td>
                              {moment(proposal.data["timeEnd"]).fromNow()}
                            </Td>
                            <Td>idk</Td>
                          </Tr>
                        );
                      })}
                  </Tbody>
                </Table>
              </TableContainer>
            </TabPanels>
          </Container>
        </Tabs>
      </VStack>
    </Box>
  );
};

export default Tracker;
