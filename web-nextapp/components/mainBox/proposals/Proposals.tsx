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
  Select,
  Spacer,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { ExternalLinkIcon, WarningTwoIcon } from "@chakra-ui/icons";

import { useEffect, useState } from "react";
import { ProposalType } from "../../../../types";
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
    if (pastDaysIndex > 0) daysAgo = pastDaysOptions[pastDaysIndex - 1].days;
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
    <Flex flexDir="row" w="full">
      <Grid w="full">
        <VStack m="10" align="start" spacing={5} p="5">
          {!proposals.length && (
            <Alert status="warning">
              <AlertIcon />
              No data. New accounts require up to 10 minutes to fetch new
              data...
            </Alert>
          )}
          <HStack w="full">
            <Text>Proposals</Text>
            <Spacer />
            <Select
              placeholder="Upcoming only"
              w="20rem"
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
          </HStack>
          <Divider></Divider>
          {loading && (
            <Center w="full">
              <Spinner />
            </Center>
          )}
          {proposals.length && (
            <TableContainer w="full">
              <Table variant="striped" colorScheme="blackAlpha">
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
                            <Avatar src={proposal.dao.picture}></Avatar>
                            <Text>{proposal.dao.name}</Text>
                          </HStack>
                        </Td>
                        <Td>
                          <HStack>
                            <Link href={proposal.url} isExternal maxW="20rem">
                              <Text noOfLines={1}>{proposal.title}</Text>
                            </Link>
                            <ExternalLinkIcon mx="2px" />
                          </HStack>
                        </Td>

                        <Td>{moment(proposal.voteEnds).fromNow(true)}</Td>

                        <Td>
                          {moment(proposal.voteEnds).isBefore(new Date()) ? (
                            //past vote

                            proposal.userVote[0]?.user.address ==
                            session?.user?.name ? (
                              proposal.userVote.length ? (
                                proposal.userVote[0].voteName
                              ) : (
                                "Did not vote"
                              )
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
          )}
        </VStack>
      </Grid>
    </Flex>
  );
};

export default Proposals;
