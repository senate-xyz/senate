import { Grid, Text, VStack, Divider, Flex } from "@chakra-ui/react";

export const Proposals = () => {
  return (
    <Flex flexDir="row" w="full">
      <Grid bg="gray.200" minH="100vh" w="full">
        <VStack bg="gray.100" m="10" align="start" spacing={5} p="5">
          <Text>Settings</Text>
          <Divider></Divider>
        </VStack>
      </Grid>
    </Flex>
  );
};
export default Proposals;
