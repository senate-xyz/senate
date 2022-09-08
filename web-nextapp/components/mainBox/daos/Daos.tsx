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
import { DaoType } from "../../../../types";
import { SubscriptionItem } from "./DaoItem";

const Subscriptions = () => {
  const [subscribed, setSubscribed] = useState<DaoType[]>([]);

  useEffect(() => {
    fetch(`/api/daos`, { method: "GET" })
      .then((response) => response.json())
      .then(async (data) => {
        setSubscribed(data);
      });
  }, []);

  return (
    <Flex flexDir="row" w="full">
      <Grid bg="gray.200" minH="100vh" w="full">
        <VStack bg="gray.100" m="10" align="start" spacing={2} p="5">
          <Text>DAOs</Text>
          <Divider />
          <VStack w="full">
            {!subscribed.length && (
              <Center>
                <Spinner />
              </Center>
            )}
            {subscribed.map((dao: DaoType, index: number) => {
              return (
                <Flex key={index} w="full">
                  <SubscriptionItem dao={dao} />
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
