import {
  Text,
  VStack,
  Divider,
  Flex,
  Spinner,
  Center,
  SimpleGrid,
  Box,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { DaoType } from "common-types";
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
    <Box w="full">
      <VStack
        m={{ base: "0", md: "10" }}
        align="start"
        p={{ base: "2", md: "5" }}
      >
        <Text fontSize="3xl" fontWeight="800">
          Watchlist
        </Text>
        <Box pb="0.3rem" pt="1rem" />
        <Divider />
        <Box pb="0.3rem" pt="1rem" />
        {loading && (
          <Center w="full">
            <Spinner />
          </Center>
        )}
        <SimpleGrid
          minChildWidth="10rem"
          spacing="1rem"
          w="full"
          justifyItems="center"
        >
          {subscribed.map((dao: DaoType, index: number) => {
            return (
              <Flex key={index}>
                <SubscriptionItem dao={dao} />
              </Flex>
            );
          })}
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default Subscriptions;
