import {
  Grid,
  Text,
  VStack,
  Divider,
  Flex,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { DaoType } from "../../../types";

import { SubscriptionItem } from "./SubscriptionItem";

const Subscriptions = () => {
  const [daos, setDaos] = useState([]);

  useEffect(() => {
    fetch(`/api/listSupportedDaos`)
      .then((response) => response.json())
      .then(async (data) => {
        setDaos(data);
      });
  }, []);

  return (
    <Flex flexDir="row" w="full">
      <Grid bg="gray.200" minH="100vh" w="full">
        <VStack bg="gray.100" m="10" align="start" spacing={5} p="5">
          <Text>DAOs</Text>
          <Divider />
          <VStack>
            <Grid templateColumns="repeat(5, 1fr)" gap={6}>
              {!daos.length && (
                <Center>
                  <Spinner />
                </Center>
              )}
              {daos.map((dao: DaoType) => {
                return (
                  <div key={dao.id}>
                    <SubscriptionItem dao={dao} />
                  </div>
                );
              })}
            </Grid>
          </VStack>
        </VStack>
      </Grid>
    </Flex>
  );
};

export default Subscriptions;
