import {
  Grid,
  Text,
  VStack,
  Divider,
  Flex,
  Spinner,
  Center,
  SimpleGrid,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { DaoType } from "../../../../types";
import { SubscriptionItem } from "./DaoItem";

const Subscriptions = () => {
  const [subscribed, setSubscribed] = useState<DaoType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/daos`, { method: "GET" })
      .then((response) => response.json())
      .then(async (data) => {
        setSubscribed(data);
        setLoading(false);
      });
  }, []);

  return (
    <VStack m="10" align="start" spacing={2} p="5">
      <Text>DAOs</Text>
      <Divider />
      {loading && (
        <Center w="full">
          <Spinner />
        </Center>
      )}
      <SimpleGrid minChildWidth="10rem" spacing="1rem" w="full">
        {subscribed.map((dao: DaoType, index: number) => {
          return (
            <Flex key={index}>
              <SubscriptionItem dao={dao} />
            </Flex>
          );
        })}
      </SimpleGrid>
    </VStack>
  );
};

export default Subscriptions;
