import { Grid, Text, VStack, Divider, Flex, Avatar } from "@chakra-ui/react";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import NavBar from "../../components/navbar/NavBar";
import { DaoType } from "../../types";

const Daos: NextPage = () => {
  const [daos, setDaos] = useState([]);

  useEffect(() => {
    fetch(`/api/listSupportedDaos`)
      .then((response) => response.json())
      .then(async (data) => {
        setDaos(data);
      });
  }, []);

  return (
    <Flex flexDir="row">
      <NavBar />

      <Grid bg="gray.200" minH="100vh" w="full">
        <VStack bg="gray.100" m="10" align="start" spacing={5} p="5">
          <Text>Daos</Text>
          <Divider></Divider>
          <VStack>
            <Grid templateColumns="repeat(5, 1fr)" gap={6}>
              {daos.map((dao: DaoType) => {
                return (
                  <Flex
                    key={dao.id}
                    m="2rem"
                    align="center"
                    flexDir="column"
                    border="1px"
                    borderRadius="5px"
                    borderColor="gray.400"
                  >
                    <Avatar src={dao.image}></Avatar>
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
