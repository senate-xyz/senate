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
import { SubscriptionType, UnsubscribedType } from "../../../../types";

import { SubscribedItem } from "./SubscribedItem";
import { UnsubscribedItem } from "./UnsubscribedItem";

const TEST_USER = "0xbob";

const Subscriptions = () => {
  const [subscribed, setSubscribed] = useState<SubscriptionType[]>([]);
  const [unsubscribed, setUnsubscribed] = useState<UnsubscribedType[]>([]);

  useEffect(() => {
    fetch(`/api/listSubscribed?userInputAddress=${TEST_USER}`)
      .then((response) => response.json())
      .then(async (data) => {
        setSubscribed(data);
      });
  }, []);

  useEffect(() => {
    fetch(`/api/listUnsubscribed?userInputAddress=${TEST_USER}`)
      .then((response) => response.json())
      .then(async (data) => {
        setUnsubscribed(data);
      });
  }, []);

  return (
    <Flex flexDir="row" w="full">
      <Grid bg="gray.200" minH="100vh" w="full">
        <VStack bg="gray.100" m="10" align="start" spacing={2} p="5">
          <Text>DAOs</Text>
          <Divider />
          <VStack w="full">
            {!subscribed.length && !unsubscribed.length && (
              <Center>
                <Spinner />
              </Center>
            )}
            {subscribed.map((sub: SubscriptionType) => {
              return (
                <Flex key={sub.id} w="full">
                  <SubscribedItem sub={sub} />
                </Flex>
              );
            })}

            {unsubscribed.map((unsub: UnsubscribedType) => {
              return (
                <Flex key={unsub.id} w="full">
                  <UnsubscribedItem unsub={unsub} />
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
