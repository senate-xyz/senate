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
  useToast,
} from "@chakra-ui/react";
import { ExternalLinkIcon, WarningTwoIcon } from "@chakra-ui/icons";

import { useEffect, useState } from "react";
import { ProposalType } from "../../../../types";
import moment from "moment";
import { useSession } from "next-auth/react";

export const Tracker = () => {
  const { data: session } = useSession();
  const toast = useToast();
  const [votes, setVotes] = useState<ProposalType[]>([]);
  const [daos, setDaos] = useState<string[]>([]);
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
    fetch(`/api/tracker/?userInputAddress=${session?.user?.name}`)
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
      <Grid w="full">
        <VStack m="10" align="start" spacing={5} p="5">
          <HStack w="full">
            <Text>Vote tracker</Text>
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
  );
};

export default Tracker;
