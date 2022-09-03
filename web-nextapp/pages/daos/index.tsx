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
  Stat,
  StatHelpText,
  StatNumber,
  Avatar,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useState } from "react";
import NavBar from "../../components/navbar/NavBar";

interface DaoProps {
  name: string;
  pfp: string;
}
const DaoItems: Array<DaoProps> = [
  {
    name: "SomeDao",
    pfp: "https://www.rd.com/wp-content/uploads/2021/04/GettyImages-1070620072-scaled.jpg",
  },
  {
    name: "AnotherDao",
    pfp: "https://www.rd.com/wp-content/uploads/2021/04/GettyImages-1070620072-scaled.jpg",
  },
  {
    name: "KittyDao",
    pfp: "https://www.rd.com/wp-content/uploads/2021/04/GettyImages-988013222-scaled-e1618857975729.jpg",
  },
  {
    name: "NoDogsDao",
    pfp: "https://www.rd.com/wp-content/uploads/2021/04/GettyImages-988013222-scaled-e1618857975729.jpg",
  },
  {
    name: "SomeDao 2",
    pfp: "https://www.rd.com/wp-content/uploads/2021/04/GettyImages-1070620072-scaled.jpg",
  },
  {
    name: "AnotherDao 2",
    pfp: "https://www.rd.com/wp-content/uploads/2021/04/GettyImages-1070620072-scaled.jpg",
  },
  {
    name: "KittyDao 2",
    pfp: "https://www.rd.com/wp-content/uploads/2021/04/GettyImages-988013222-scaled-e1618857975729.jpg",
  },
  {
    name: "NoDogsDao 2",
    pfp: "https://www.rd.com/wp-content/uploads/2021/04/GettyImages-988013222-scaled-e1618857975729.jpg",
  },
];

const Daos: NextPage = () => {
  const [daos, setDaos] = useState(DaoItems);

  return (
    <Flex flexDir="row">
      <NavBar />

      <Grid bg="gray.200" minH="100vh" w="full">
        <VStack bg="gray.100" m="10" align="start" spacing={5} p="5">
          <Text>Daos</Text>
          <Divider></Divider>
          <VStack>
            <Grid templateColumns="repeat(5, 1fr)" gap={6}>
              {daos.map((dao) => {
                return (
                  <Flex
                    key={dao.name}
                    m="2rem"
                    align="center"
                    flexDir="column"
                    border="1px"
                    borderRadius="5px"
                    borderColor="gray.400"
                  >
                    <Avatar src={dao.pfp}></Avatar>
                    <Text>{dao.name}</Text>
                  </Flex>
                );
              })}
            </Grid>
          </VStack>
        </VStack>
      </Grid>
    </Flex>
  );
};

export default Daos;
