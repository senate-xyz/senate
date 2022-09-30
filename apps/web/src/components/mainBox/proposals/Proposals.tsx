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
  Select,
  Alert,
  AlertIcon,
  Box,
  useBreakpointValue,
  Container,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

import { useEffect, useState } from "react";
import { ProposalType, ProposalTypeEnum } from "common-types";
import moment from "moment";
import { useSession } from "next-auth/react";

const pastDaysOptions = [
  { id: 1, days: 1, name: "Include yesterday" },
  { id: 2, days: 2, name: "Include two days ago" },
  { id: 3, days: 3, name: "Include three days ago" },
  { id: 4, days: 7, name: "Include one week ago" },
  { id: 5, days: 14, name: "Include two weeks ago" },
  { id: 6, days: 30, name: "Include one month ago" },
];

export const Proposals = () => {
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });
  const { data: session } = useSession();
  const [proposals, setProposals] = useState<ProposalType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectValue, setSelectValue] = useState(0);

  useEffect(() => {
    fetch(
      `/api/proposals/?userInputAddress=${session?.user?.name}&includePastDays=0`
    )
      .then((response) => response.json())
      .then(async (data) => {
        setLoading(false);
        setProposals(data);
        setSelectValue(0);
      });
  }, [session]);

  const getPastDays = (pastDaysIndex: number) => {
    setLoading(true);

    let daysAgo;
    if (pastDaysIndex > 0) daysAgo = pastDaysOptions[pastDaysIndex - 1]?.days;
    else daysAgo = 0;

    fetch(
      `/api/proposals/?userInputAddress=${session?.user?.name}&includePastDays=${daysAgo}`
    )
      .then((response) => response.json())
      .then(async (data) => {
        setLoading(false);
        setProposals(data);
      });
  };

  return (
    <Box w="full">
      <VStack
        m={{ base: "0", md: "10" }}
        align="start"
        p={{ base: "2", md: "5" }}
      >
        {!proposals.length && (
          <Alert status="warning">
            <AlertIcon />
            No data. New accounts require up to 10 minutes to fetch new data...
          </Alert>
        )}
        =
        <Text fontSize="3xl" fontWeight="800">
          Proposals
        </Text>
        <Select
          placeholder="Upcoming only"
          w={{ base: "full", md: "20rem" }}
          onChange={(e) => {
            setSelectValue(e.target.selectedIndex);
            getPastDays(e.target.selectedIndex);
          }}
          value={selectValue}
        >
          {pastDaysOptions.map((option) => {
            return (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            );
          })}
        </Select>
        <Box pb="0.3rem" pt="1rem" />
        <Divider />
        <Box pb="0.3rem" pt="1rem" />
        {proposals.length && (
          <Container overflow="auto" maxW="90vw">
            <TableContainer>
              <Table
                size={{ base: "sm", md: "md", lg: "lg" }}
                variant="striped"
                colorScheme="gray"
              >
                <Thead>
                  <Tr>
                    <Th>DAO</Th>
                    <Th>Proposal</Th>
                    <Th>Time Left</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {proposals.map((proposal: ProposalType) => {
                    return (
                      <Tr key={proposal.id}>
                        <Td>
                          <HStack>
                            <Avatar
                              boxSize={{ base: "35px", md: "40px" }}
                              src={proposal.dao.picture}
                              position="relative"
                            >
                              <Avatar
                                bottom={{ base: "-0.5", md: "-2" }}
                                right={{ base: "-0.5", md: "-2" }}
                                bg="white"
                                boxSize={{ base: "15px", md: "20px" }}
                                src={
                                  proposal.type == ProposalTypeEnum.Snapshot
                                    ? "https://avatars.githubusercontent.com/u/72904068?s=200&v=4"
                                    : "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png"
                                }
                                position="absolute"
                              ></Avatar>
                            </Avatar>
                            {!isMobile && <Text>{proposal.dao.name}</Text>}
                          </HStack>
                        </Td>
                        <Td>
                          <HStack>
                            <Link
                              href={proposal.url}
                              isExternal
                              maxW={{ base: "10rem", md: "20rem" }}
                            >
                              <Text noOfLines={1}>{proposal.title}</Text>
                            </Link>
                            <ExternalLinkIcon mx="2px" />
                          </HStack>
                        </Td>

                        <Td>{moment(proposal.voteEnds).fromNow(true)}</Td>

                        <Td>
                          {moment(proposal.voteEnds).isBefore(new Date()) && (
                            <div>
                              {!session && (
                                <HStack>
                                  <Text>Not logged in</Text>
                                </HStack>
                              )}

                              {session && (
                                <div>
                                  {proposal.userVote[0]?.user.address ==
                                  session?.user?.name ? (
                                    proposal.userVote.length ? (
                                      proposal.userVote[0]?.voteName
                                    ) : (
                                      <Text color="red.300">Did not vote</Text>
                                    )
                                  ) : (
                                    <Text color="red.300">Did not vote</Text>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {!moment(proposal.voteEnds).isBefore(new Date()) && (
                            <div>
                              {!session && (
                                <HStack>
                                  <Text>Voting</Text>
                                </HStack>
                              )}

                              {session && (
                                <div>
                                  {proposal.userVote.length ? (
                                    <HStack>
                                      <Text color="green.400" fontWeight="800">
                                        VOTED
                                      </Text>
                                    </HStack>
                                  ) : (
                                    <HStack>
                                      <Text color="red.400" fontWeight="800">
                                        NOT VOTED
                                      </Text>
                                    </HStack>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </Container>
        )}
      </VStack>
    </Box>
  );
};

export default Proposals;
