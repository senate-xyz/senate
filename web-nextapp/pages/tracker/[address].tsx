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
  useToast,
  VStack,
  Text,
} from "@chakra-ui/react";
import NavBar from "../../components/navbar/NavBar";
import { PagesEnum, ProposalType } from "../../../types";
import { ExternalLinkIcon, WarningTwoIcon } from "@chakra-ui/icons";
import moment from "moment";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();
  const { address } = router.query;
  const [votes, setVotes] = useState<ProposalType[]>([]);
  const [daos, setDaos] = useState<string[]>([]);
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
      .map((vote) => vote.dao.name)
      .filter((value, index, self) => self.indexOf(value) === index)
      .map((dao) => {
        setDaos((oldArray) => [...oldArray, dao]);
      });
    setLoading(false);
  }, [votes]);

  useEffect(() => {
    setSelectedDao(daos[0]);
  }, [daos]);

  return (
    <Flex flexDir="row" w="100vw">
      <Flex w="full" flexDir="column" bg="gray.200">
        <Flex flexDir="row" w="full">
          <Grid bg="gray.200" minH="100vh" w="full">
            <VStack bg="gray.100" m="10" align="start" spacing={5} p="5">
              <HStack w="full">
                <Text>Vote tracker - {address}</Text>
                <Spacer />
              </HStack>
              <Divider></Divider>
              {loading && (
                <Center w="full">
                  <Spinner />
                </Center>
              )}

              <Tabs w="full">
                <TabList>
                  {daos.map((dao, index) => {
                    return (
                      <Tab
                        key={index}
                        onClick={() => {
                          setSelectedDao(dao);
                        }}
                      >
                        {dao}
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
                                      proposal.userVote[0].voteName
                                    ) : (
                                      "Did not vote"
                                    )
                                  ) : //future vote
                                  proposal.userVote.length ? (
                                    proposal.userVote[0].voteName
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
      </Flex>
    </Flex>
  );
};

export default Home;
