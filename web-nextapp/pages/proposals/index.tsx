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

export const Proposals: NextPage = () => {
  return (
    <Flex flexDir="row">
      <NavBar />

      <Grid bg="gray.200" minH="100vh" w="full">
        <VStack bg="gray.100" m="10" align="start" spacing={5} p="5">
          <Text>Proposals</Text>
          <Divider></Divider>
          <TableContainer w="full">
            <Table variant="simple">
              <TableCaption>Imperial to metric conversion factors</TableCaption>
              <Thead>
                <Tr>
                  <Th>To convert</Th>
                  <Th>into</Th>
                  <Th isNumeric>multiply by</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>inches</Td>
                  <Td>millimetres (mm)</Td>
                  <Td isNumeric>25.4</Td>
                </Tr>
                <Tr>
                  <Td>feet</Td>
                  <Td>centimetres (cm)</Td>
                  <Td isNumeric>30.48</Td>
                </Tr>
                <Tr>
                  <Td>yards</Td>
                  <Td>metres (m)</Td>
                  <Td isNumeric>0.91444</Td>
                </Tr>
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th>To convert</Th>
                  <Th>into</Th>
                  <Th isNumeric>multiply by</Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        </VStack>
      </Grid>
    </Flex>
  );
};
export default Proposals;
