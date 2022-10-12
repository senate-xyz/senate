import { DaoItem } from "./DaoItem";
import { useSession } from "next-auth/react";
import { trpc } from "../../../utils/trpc";
import { DAOType } from "@senate/common-types";

const Watchlist = () => {
  const { data: session } = useSession();

  const DAOs = trpc.useQuery([session ? "user.daos" : "public.daos"]);
  const subscribe = trpc.useMutation("user.subscribe");
  const unsubscribe = trpc.useMutation("user.unsubscribe");
  const utils = trpc.useContext();

  const handleSubscribe = async (daoId: string) => {
    subscribe.mutate(
      { daoId: daoId },
      {
        onSuccess() {
          utils.invalidateQueries();
        },
      }
    );
  };

  const handleUnsubscribe = async (daoId: string) => {
    unsubscribe.mutate(
      { daoId: daoId },
      {
        onSuccess() {
          utils.invalidateQueries();
        },
      }
    );
  };

  return (
    <div>
      <p>Watchlist</p>
      {/* <VStack
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
        {DAOs.isLoading && (
          <Center w="full">
            <Spinner />
          </Center>
        )}
        {DAOs.data && (
          <SimpleGrid
            minChildWidth="10rem"
            spacing="1rem"
            w="full"
            justifyItems="center"
          >
            {DAOs.data.map((dao: DAOType, index: number) => {
              return (
                <Flex key={index}>
                  <DaoItem
                    dao={dao}
                    key={index}
                    handleSubscribe={handleSubscribe}
                    handleUnsubscribe={handleUnsubscribe}
                  />
                </Flex>
              );
            })}
          </SimpleGrid>
        )}
      </VStack> */}
    </div>
  );
};

export default Watchlist;
