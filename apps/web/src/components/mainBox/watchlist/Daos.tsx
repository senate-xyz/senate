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
import { DAOType } from "@senate/common-types";
import { DaoItem } from "./DaoItem";
import { useSession } from "next-auth/react";

const Subscriptions = () => {
  const [DAOs, setDAOs] = useState<DAOType[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    let fetchUrl;
    if (session)
      fetchUrl = `/api/user/daos??userInputAddress=${session?.user?.name}`;
    else
      fetchUrl = `/api/unrestricted/daos??userInputAddress=${session?.user?.name}`;

    fetch(fetchUrl, {
      method: "GET",
    })
      .then((response) => response.json())
      .then(async (data) => {
        setDAOs(data);
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
          {DAOs.map((dao: DAOType, index: number) => {
            return (
              <Flex key={index}>
                <DaoItem dao={dao} />
              </Flex>
            );
          })}
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default Subscriptions;
