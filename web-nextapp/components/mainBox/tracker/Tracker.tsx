import {
  Grid,
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
  Flex,
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
} from "@chakra-ui/react";
import { ExternalLinkIcon, WarningTwoIcon } from "@chakra-ui/icons";

import { useEffect, useState } from "react";
import { ProposalType, TEST_USER } from "../../../../types";
import moment from "moment";

const pastDaysOptions = [
  { id: 1, name: "Include yesterday" },
  { id: 2, name: "Include two days ago" },
  { id: 3, name: "Include three days ago" },
  { id: 7, name: "Include one week ago" },
  { id: 14, name: "Include two weeks ago" },
  { id: 30, name: "Include one month ago" },
];

export const Tracker = () => {
  const [votes, setVotes] = useState<ProposalType[]>([]);
  const [daos, setDaos] = useState<string[]>([]);
  const [selectedDao, setSelectedDao] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDaos([]);
    setSelectedDao("");
    fetch(`/api/tracker/?userInputAddress=${TEST_USER}`)
      .then((response) => response.json())
      .then(async (data) => {
        setLoading(false);
        setVotes(data);
      });
  }, []);

  useEffect(() => {
    votes
      .map((vote) => vote.dao.name)
      .filter((value, index, self) => self.indexOf(value) === index)
      .map((dao) => {
        setDaos((oldArray) => [...oldArray, dao]);
      });
  }, [votes]);

  useEffect(() => {
    setSelectedDao(daos[0]);
  }, [daos]);

  return (
    <Flex flexDir="row" w="full">
      <Grid bg="gray.200" minH="100vh" w="full">
        <VStack bg="gray.100" m="10" align="start" spacing={5} p="5">
          <HStack w="full">
            <Text>Votes tracker</Text>
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
                                  <Text noOfLines={1}>{proposal.title}</Text>
                                </Link>
                                <ExternalLinkIcon mx="2px" />
                              </HStack>
                            </Td>
                            <Td maxW={"20rem"}>
                              <Text noOfLines={1}>{proposal.description}</Text>
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
                                  "Not available"
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
  );
};

export default Tracker;
