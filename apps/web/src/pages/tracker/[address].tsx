import type { NextPage } from "next";
import { useEffect, useState } from "react";
import {
  Avatar,
  Center,
  Divider,
  Flex,
  Grid,
  HStack,
  Link,
  Spacer,
  Spinner,
  Tab,
  Table,
  TableContainer,
  TabList,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  Text,
  Box,
  Image,
  useColorMode,
} from "@chakra-ui/react";
import { ProposalType } from "common-types";
import { ExternalLinkIcon, WarningTwoIcon } from "@chakra-ui/icons";
import moment from "moment";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const { address } = router.query;
  const [votes, setVotes] = useState<ProposalType[]>([]);
  const [daos, setDaos] = useState<any[]>([]);
  const [selectedDao, setSelectedDao] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setDaos([]);
    setSelectedDao("");
    fetch(`/api/tracker/?userInputAddress=${address}`)
      .then((response) => response.json())
      .then(async (data) => {
        setVotes(data);
      });
  }, [address]);

  useEffect(() => {
    votes
      .map((vote) => vote.dao)
      .filter((element, index, array) => {
        return array.findIndex((a) => a.name == element.name) === index;
      })
      .map((dao) => {
        setDaos((oldArray) => [...oldArray, dao]);
      });
    setLoading(false);
  }, [votes]);

  useEffect(() => {
    if (daos[0]) setSelectedDao(daos[0].name);
  }, [daos]);

  return (
    <Box w="full">
      <VStack
        w="full"
        bgImg="/homebg.svg"
        position="absolute"
        zIndex="-1"
        opacity="0.2"
        minH="full"
      />
      <VStack m={{ base: "0", md: "5" }} align="start">
        <HStack w="full">
          <Link href="https://dev-senate-web.onrender.com/">
            <HStack w="full">
              {colorMode == "light" ? (
                <Image
                  boxSize="35px"
                  src="/logo_dark.svg"
                  alt="very cool logo"
                />
              ) : (
                <Image boxSize="35px" src="/logo.svg" alt="very cool logo" />
              )}
              <Text
                fontFamily="manrope"
                fontWeight="500"
                fontSize="30px"
                ml="1rem"
              >
                Senate
              </Text>
            </HStack>
          </Link>
        </HStack>
        <Flex flexDir="row" w="full">
          <Grid minH="100vh" w="full">
            <VStack m="10" align="start" spacing={5} p="5">
              <HStack w="full">
                <Text>Vote tracker for {address}</Text>
                <Spacer />
              </HStack>
              <Divider></Divider>
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
                          .map((proposal: ProposalType) => {
                            return (
                              <Tr key={proposal.id}>
                                <Td>
                                  <HStack>
                                    <Avatar src={proposal.dao.picture}></Avatar>
                                    <Link
                                      href={proposal.url}
                                      isExternal
                                      maxW="20rem"
                                    >
                                      <Text noOfLines={1}>
                                        {proposal.title}
                                      </Text>
                                    </Link>
                                    <ExternalLinkIcon mx="2px" />
                                  </HStack>
                                </Td>
                                <Td maxW={"20rem"}>
                                  <Text noOfLines={1}>
                                    {proposal.description}
                                  </Text>
                                </Td>
                                <Td>{moment(proposal.voteEnds).fromNow()}</Td>

                                <Td>
                                  {moment(proposal.voteEnds).isBefore(
                                    new Date()
                                  ) ? (
                                    //past vote
                                    proposal.userVote.length ? (
                                      <Text color="green.400" fontWeight="800">
                                        {proposal.userVote[0].voteName}
                                      </Text>
                                    ) : (
                                      "Did not vote"
                                    )
                                  ) : //future vote
                                  proposal.userVote.length ? (
                                    <Text color="green.400" fontWeight="800">
                                      {proposal.userVote[0].voteName}
                                    </Text>
                                  ) : (
                                    <HStack>
                                      <WarningTwoIcon color="red.400" />
                                      <Text>Did not vote yet!</Text>
                                      <WarningTwoIcon color="red.400" />
                                    </HStack>
                                  )}
                                </Td>
                              </Tr>
                            );
                          })}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </TabPanels>
              </Tabs>
            </VStack>
          </Grid>
        </Flex>
      </VStack>
    </Box>
  );
};

export default Home;
