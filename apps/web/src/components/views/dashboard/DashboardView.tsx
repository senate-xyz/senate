import {
  Text,
  VStack,
  Divider,
  Alert,
  AlertIcon,
  Box,
  Container,
} from "@chakra-ui/react";

import { useSession } from "next-auth/react";
import { trpc } from "../../../utils/trpc";
import DashboardTable from "./table/DashboardTable";

export const DashboardView = () => {
  const { data: session } = useSession();

  const proposals = trpc.useQuery([
    session ? "user.proposals" : "public.proposals",
  ]);

  return (
    <Box w="full">
      <VStack
        m={{ base: "0", md: "10" }}
        align="start"
        p={{ base: "2", md: "5" }}
      >
        {!proposals.data && (
          <Alert status="warning">
            <AlertIcon />
            No data. New accounts require up to 10 minutes to fetch new data...
          </Alert>
        )}
        =
        <Text fontSize="3xl" fontWeight="800">
          Proposals
        </Text>
        <Box pb="0.3rem" pt="1rem" />
        <Divider />
        <Box pb="0.3rem" pt="1rem" />
        {proposals.data && (
          <Container overflow="auto" maxW="90vw">
            <DashboardTable proposals={proposals} />
          </Container>
        )}
      </VStack>
    </Box>
  );
};

export default DashboardView;
