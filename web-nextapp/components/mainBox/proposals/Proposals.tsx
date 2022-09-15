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
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

import { useEffect, useState } from "react";
import { ProposalType, TEST_USER } from "../../../../types";
import moment from "moment";

const pastDaysOptions = [
  { id: 1, name: "One day" },
  { id: 2, name: "Two Days" },
  { id: 3, name: "Three Days" },
  { id: 7, name: "One week" },
  { id: 14, name: "Two Weeks" },
  { id: 30, name: "One Month" },
];

export const Proposals = () => {
  const [proposals, setProposals] = useState<ProposalType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/proposals/?userInputAddress=${TEST_USER}&includePastDays=0`)
      .then((response) => response.json())
      .then(async (data) => {
        setLoading(false);
        setProposals(data);
      });
  }, []);

  const getPastDays = (pastDaysIndex: number) => {
    setLoading(true);

    let daysAgo;
    if (pastDaysIndex > 0) daysAgo = pastDaysOptions[pastDaysIndex].id;
    else daysAgo = 0;

    fetch(
      `/api/proposals/?userInputAddress=${TEST_USER}&includePastDays=${daysAgo}`
    )
      .then((response) => response.json())
      .then(async (data) => {
        setLoading(false);
        setProposals(data);
      });
  };

  return (
    <Flex flexDir="row" w="full">
      <Grid bg="gray.200" minH="100vh" w="full">
        <VStack bg="gray.100" m="10" align="start" spacing={5} p="5">
          <HStack w="full">
            <Text>Proposals</Text>
            <Spacer />
            <Select
              placeholder="Include past days"
              w="20rem"
              onChange={(e) => getPastDays(e.target.selectedIndex)}
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
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Proposal</Th>
                    <Th>Description</Th>
                    <Th>Time Left</Th>
                    <Th>Voted</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {proposals.map((proposal: ProposalType) => {
                    return (
                      <Tr key={proposal.id}>
                        <Td>
                          <HStack>
                            <Avatar src={proposal.dao.picture}></Avatar>
                            <Link href={proposal.url} isExternal maxW="20rem">
                              <Text noOfLines={1}>{proposal.title}</Text>
                            </Link>
                            <ExternalLinkIcon mx="2px" />
                          </HStack>
                        </Td>
                        <Td maxW={"20rem"}>
                          <Text noOfLines={1}>{proposal.description}</Text>
                        </Td>
                        <Td>{moment(proposal.voteEnds).fromNow()}</Td>

                        <Td>Hardcoded yes</Td>
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
