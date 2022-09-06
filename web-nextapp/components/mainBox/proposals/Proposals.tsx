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
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

import { useEffect, useState } from "react";
import { ProposalType } from "../../../types";

const TEST_USER = "0xbob";

export const Proposals = () => {
  const [proposals, setProposals] = useState<ProposalType[]>([]);

  useEffect(() => {
    fetch(`/api/listProposals/?userInputAddress=${TEST_USER}`)
      .then((response) => response.json())
      .then(async (data) => {
        setProposals(data);
      });
  }, []);

  return (
    <Flex flexDir="row" w="full">
      <Grid bg="gray.200" minH="100vh" w="full">
        <VStack bg="gray.100" m="10" align="start" spacing={5} p="5">
          <Text>Proposals</Text>
          <Divider></Divider>
          <TableContainer w="full">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Proposal</Th>
                  <Th>Description</Th>
                  <Th>Time Created</Th>
                  <Th>Time End</Th>
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
                      <Td>{proposal.timeCreated.toString()}</Td>
                      <Td>{proposal.timeEnd.toString()}</Td>
                      <Td>Hardcoded yes</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </VStack>
      </Grid>
    </Flex>
  );
};
export default Proposals;
