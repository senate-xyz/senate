import {
  Grid,
  Text,
  HStack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  VStack,
  Divider,
  Flex,
} from "@chakra-ui/react";
import { NextPage } from "next";
import NavBar from "../../components/navbar/NavBar";
import { useEffect, useState } from "react";
import { ProposalType } from "../../types";

export const Proposals: NextPage = () => {
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    fetch(`/api/listProposals`)
      .then((response) => response.json())
      .then(async (data) => {
        setProposals(data);
      });
  }, []);

  return (
    <Flex flexDir="row">
      <NavBar />

      <Grid bg="gray.200" minH="100vh" w="full">
        <VStack bg="gray.100" m="10" align="start" spacing={5} p="5">
          <Text>Proposals</Text>
          <Divider></Divider>
          <TableContainer w="full">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Proposal</Th>
                  <Th>Time Left</Th>
                  <Th>Voted</Th>
                </Tr>
              </Thead>
              <Tbody>
                {proposals.map((proposal: ProposalType) => {
                  return (
                    <Tr key={proposal.id}>
                      <Td>{proposal.name}</Td>
                      <Td>{proposal.timeLeft}</Td>
                      <Td>{proposal.voted ? "Yay" : "Nay"}</Td>
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
