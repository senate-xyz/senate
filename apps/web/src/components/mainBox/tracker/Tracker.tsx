import { useEffect, useState } from "react";

import moment from "moment";
import { useSession } from "next-auth/react";
import { trpc } from "../../../utils/trpc";
import { TrackerProposalType } from "@senate/common-types";

export const Tracker = () => {
  const [daos, setDaos] = useState<any[]>([]);
  const [selectedDao, setSelectedDao] = useState<string>();

  const { data: session } = useSession();

  const votes = trpc.useQuery([
    "tracker.track",
    {
      address:
        session?.user?.id ?? "0x000000000000000000000000000000000000dEaD",
    },
  ]);

  useEffect(() => {
    if (votes.data)
      votes.data
        .map((vote: { dao: any }) => vote.dao)
        .filter((element: { name: any }, index: any, array: any[]) => {
          return (
            array.findIndex((a: { name: any }) => a.name == element.name) ===
            index
          );
        })
        .map((dao: any) => {
          setDaos((oldArray) => [...oldArray, dao]);
        });
  }, [votes]);

  useEffect(() => {
    if (daos[0]) setSelectedDao(daos[0].name);
  }, [daos]);

  return (
    <div>
      <p>Tracker</p>
      {/* <VStack
        m={{ base: "0", md: "10" }}
        align="start"
        p={{ base: "2", md: "5" }}
      >
        <HStack w="full">
          <Text fontSize="3xl" fontWeight="800">
            Vote tracker
          </Text>
          <Spacer />
          <Popover>
            <PopoverTrigger>
              <Button>Share</Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverHeader>Share your voting stats</PopoverHeader>
              <PopoverBody>
                <Input
                  value={`https://dev-senate-web.onrender.com/tracker/${session?.user?.name}`}
                />
                <Button
                  my="2"
                  w="full"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `https://dev-senate-web.onrender.com/tracker/${session?.user?.name}`
                    );
                  }}
                >
                  Copy to clipboard
                </Button>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </HStack>
        <Box pb="0.3rem" pt="1rem" />
        <Divider />
        <Box pb="0.3rem" pt="1rem" />
        {votes.isLoading && (
          <Center w="full">
            <Spinner />
          </Center>
        )}

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

          <Container overflow="auto" w="full" maxW="90vw">
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
                        .map((proposal: TrackerProposalType) => {
                          return (
                            <Tr key={proposal.id}>
                              <Td>
                                <HStack>
                                  <Avatar src={proposal.dao.picture}></Avatar>
                                  <Link
                                    // @ts-ignore
                                    href={proposal.data["url"]}
                                    isExternal
                                    maxW="20rem"
                                  >
                                    <Text noOfLines={1}>{proposal.name}</Text>
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
                                {
                                  // @ts-ignore
                                  moment(proposal.data["timeEnd"]).fromNow()
                                }
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
          </Container>
        </Tabs>
      </VStack> */}
    </div>
  );
};

export default Tracker;
