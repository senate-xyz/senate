import {
  Text,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  Divider,
  Avatar,
  Link,
  HStack,
  Select,
  Alert,
  AlertIcon,
  Box,
  useBreakpointValue,
  Container,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

import { useEffect, useState } from "react";
import { Proposal } from "@senate/common-types";
import moment from "moment";
import { useSession } from "next-auth/react";

export const Proposals = () => {
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });
  const { data: session } = useSession();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let fetchUrl;
    if (session)
      fetchUrl = `/api/user/proposals/?userInputAddress=${session?.user?.name}&includePastDays=0`;
    else
      fetchUrl = `/api/unrestrcited/proposals/?userInputAddress=${session?.user?.name}&includePastDays=0`;

    fetch(fetchUrl)
      .then((response) => response.json())
      .then(async (data) => {
        setLoading(false);
        setProposals(data);

        console.log(data[0]);
      });
  }, [session]);

  return (
    <Box w="full">
      <VStack
        m={{ base: "0", md: "10" }}
        align="start"
        p={{ base: "2", md: "5" }}
      >
        {!proposals.length && (
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
        {proposals.length && (
          <Container overflow="auto" maxW="90vw">
            <TableContainer>
              <Table
                size={{ base: "sm", md: "md", lg: "lg" }}
                variant="striped"
                colorScheme="gray"
              >
                <Thead>
                  <Tr>
                    <Th>DAO</Th>
                    <Th>Proposal</Th>
                    <Th>Time Left</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {proposals.map((proposal: Proposal) => {
                    return (
                      <Tr key={proposal.id}>
                        <Td>
                          <HStack>
                            <Avatar
                              boxSize={{ base: "35px", md: "40px" }}
                              src={proposal.dao.picture}
                              position="relative"
                            >
                              <Avatar
                                bottom={{ base: "-0.5", md: "-2" }}
                                right={{ base: "-0.5", md: "-2" }}
                                bg="white"
                                boxSize={{ base: "15px", md: "20px" }}
                                src={
                                  proposal.proposalType == "SNAPSHOT"
                                    ? "https://avatars.githubusercontent.com/u/72904068?s=200&v=4"
                                    : "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png"
                                }
                                position="absolute"
                              ></Avatar>
                            </Avatar>
                            {!isMobile && <Text>{proposal.dao.name}</Text>}
                          </HStack>
                        </Td>
                        <Td>
                          <HStack>
                            <Link
                              href={proposal.data["url"]}
                              isExternal
                              maxW={{ base: "10rem", md: "20rem" }}
                            >
                              <Text noOfLines={1}>{proposal.name}</Text>
                            </Link>
                            <ExternalLinkIcon mx="2px" />
                          </HStack>
                        </Td>

                        <Td>
                          {moment(proposal.data["timeEnd"]).fromNow(true)}
                        </Td>

                        <Td>idk</Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </Container>
        )}
      </VStack>
    </Box>
  );
};

export default Proposals;
