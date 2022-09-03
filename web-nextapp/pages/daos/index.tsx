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
import { useState } from "react";
import NavBar from "../../components/navbar/NavBar";

const Daos: NextPage = () => {
  const [daos, setDaos] = useState([1, 2, 3]);

  return (
    <Flex flexDir="row">
      <NavBar />

      <Grid bg="gray.200" minH="100vh" w="full">
        <VStack bg="gray.100" m="10" align="start" spacing={5} p="5">
          <Text>Daos</Text>
          <Divider></Divider>
          <VStack>
            {daos.map((dao) => {
              return <Text key={dao}>{dao}</Text>;
            })}
          </VStack>
        </VStack>
      </Grid>
    </Flex>
  );
};

export default Daos;
