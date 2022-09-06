import {
  Grid,
  Text,
  VStack,
  Divider,
  Flex,
  Spinner,
  Center,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { SubscriptionType } from "../../../types";

import { SubscriptionItem } from "./SubscriptionItem";

const TEST_USER = "0xbob";

const Subscriptions = () => {
  const [daos, setDaos] = useState<SubscriptionType[]>([]);

  useEffect(() => {
    fetch(`/api/listSubscriptions?userInputAddress=${TEST_USER}`)
      .then((response) => response.json())
      .then(async (data) => {
        setDaos(data);
      });
  }, []);

  return (
    <Flex flexDir="row" w="full">
      <Grid bg="gray.200" minH="100vh" w="full">
        <VStack bg="gray.100" m="10" align="start" spacing={2} p="5">
          <Text>DAOs</Text>
          <Divider />
          <VStack w="full">
            {!daos.length && (
              <Center>
                <Spinner />
              </Center>
            )}
            {daos.map((sub: SubscriptionType) => {
              return (
                <Flex key={sub.id} w="full">
                  <SubscriptionItem sub={sub} />
                </Flex>
              );
            })}
          </VStack>
        </VStack>
      </Grid>
    </Flex>
  );
};

export default Subscriptions;
