import type { NextPage } from "next";
import { useEffect, useState } from "react";
import {
  Avatar,
  Center,
  Divider,
  Flex,
  Grid,
  HStack,
  Link,
  Spacer,
  Spinner,
  Tab,
  Table,
  TableContainer,
  TabList,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  Text,
  Box,
  Image,
  useColorMode,
} from "@chakra-ui/react";

import { ExternalLinkIcon } from "@chakra-ui/icons";
import moment from "moment";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const Home: NextPage = () => {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const { address } = router.query;

  const [daos, setDaos] = useState<any[]>([]);
  const [selectedDao, setSelectedDao] = useState<string>();

  const votes = trpc.useQuery(["tracker.track", { address: String(address) }]);

  useEffect(() => {
    if (votes.data) {
      setDaos(
        votes.data
          .map((vote) => vote.dao)
          .filter((element, index, array) => {
            return array.findIndex((a) => a.name == element.name) === index;
          })
      );
    }
  }, [votes]);

  useEffect(() => {
    if (daos[0]) setSelectedDao(daos[0].name);
  }, [daos]);

  return (
    <Box w="full">
      <VStack
        w="full"
        bgImg="/homebg.svg"
        position="absolute"
        zIndex="-1"
        opacity="0.2"
        minH="full"
      />
      <VStack m={{ base: "0", md: "5" }} align="start">
        <HStack w="full">
          <Link href="https://dev-senate-web.onrender.com/">
            <HStack w="full">
              {colorMode == "light" ? (
                <Image
                  boxSize="35px"
                  src="/logo_dark.svg"
                  alt="very cool logo"
                />
              ) : (
                <Image boxSize="35px" src="/logo.svg" alt="very cool logo" />
              )}
              <Text
                fontFamily="manrope"
                fontWeight="500"
                fontSize="30px"
                ml="1rem"
              >
                Senate
              </Text>
            </HStack>
          </Link>
        </HStack>
        <Flex flexDir="row" w="full">
          <Grid minH="100vh" w="full">
            <VStack m="10" align="start" spacing={5} p="5">
              <HStack w="full">
                <Text>Vote tracker for {address}</Text>
                <Spacer />
              </HStack>
              <Divider></Divider>
              {votes.isLoading && (
                <Center w="full">
                  <Spinner />
                </Center>
              )}
              {daos && (
                <Tabs w="full" variant="enclosed">
                  <TabList>
                    {daos.map((dao, index) => {
                      return (
                        <Tab
                          key={index}
                          onClick={() => {
                            setSelectedDao(dao.name);
                          }}
                        >
                          <Avatar src={dao.picture} size="xs"></Avatar>
                          <Box m="2"></Box>
                          <Text>{dao.name}</Text>
                        </Tab>
                      );
                    })}
                  </TabList>

                  <TabPanels w="full">
                    <TableContainer w="full">
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>Proposal</Th>
                            <Th>Description</Th>
                            <Th>Time Ago</Th>
                            <Th>Voted</Th>
                          </Tr>
                        </Thead>
                        {votes.data && (
                          <Tbody>
                            {votes.data
                              .filter((vote) => vote.dao.name === selectedDao)
                              .map((proposal) => {
                                return (
                                  <Tr key={proposal.id}>
                                    <Td>
                                      <HStack>
                                        <Avatar
                                          src={proposal.dao.picture}
                                        ></Avatar>
                                        <Link
                                          // @ts-ignore
                                          href={proposal.data["url"]}
                                          isExternal
                                          maxW="20rem"
                                        >
                                          <Text noOfLines={1}>
                                            {proposal.name}
                                          </Text>
                                        </Link>
                                        <ExternalLinkIcon mx="2px" />
                                      </HStack>
                                    </Td>
                                    <Td maxW={"20rem"}>
                                      <Text noOfLines={1}>
                                        {proposal.description}
                                      </Text>
                                    </Td>
                                    <Td>
                                      {moment(
                                        // @ts-ignore
                                        proposal.data["timeEnd"]
                                      ).fromNow()}
                                    </Td>

                                    <Td>idk</Td>
                                  </Tr>
                                );
                              })}
                          </Tbody>
                        )}
                      </Table>
                    </TableContainer>
                  </TabPanels>
                </Tabs>
              )}
            </VStack>
          </Grid>
        </Flex>
      </VStack>
    </Box>
  );
};

export default Home;
