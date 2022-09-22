import type { NextPage } from "next";
import {
  Text,
  HStack,
  VStack,
  Spacer,
  GridItem,
  Button,
  Image,
  SimpleGrid,
  Link,
  useBreakpointValue,
} from "@chakra-ui/react";

const Home: NextPage = () => {
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });

  return (
    <VStack w="full" minH="100vh">
      <VStack
        w="full"
        minH="100vh"
        bg="gray.800"
        bgImage="/homebg.svg"
        bgSize="cover"
        opacity="0.2"
        position="absolute"
        zIndex="-1"
      />
      <HStack mt="2rem" px="2rem" justify="end" spacing="2rem" w="full">
        <Link href="https://dev-senate-web.onrender.com/">
          <HStack mt="1rem">
            <Image boxSize="50px" src="/logo.svg" alt="very cool logo" />
            {!isMobile && (
              <Text
                color="white"
                fontFamily="manrope"
                fontWeight="500"
                fontSize="30px"
              >
                Senate
              </Text>
            )}
          </HStack>
        </Link>
        <Spacer />
        <Link href={"/about"}>
          <Text color="white" fontFamily="manrope" fontWeight="800">
            About
          </Text>
        </Link>
        <Link href={"/faq"}>
          <Text color="white" fontFamily="manrope" fontWeight="800">
            FAQ
          </Text>
        </Link>
        <Link href={"/twitter"}>
          <Text color="white" fontFamily="manrope" fontWeight="800">
            Twitter
          </Text>
        </Link>
        <Link href={"/github"}>
          <Text color="white" fontFamily="manrope" fontWeight="800">
            Github
          </Text>
        </Link>
        <Link href={"/discord"}>
          <Text color="white" fontFamily="manrope" fontWeight="800">
            Discord
          </Text>
        </Link>
      </HStack>
      <SimpleGrid columns={[1, 1, 1, 2]} gap={12} w="full">
        <GridItem rowSpan={1} colSpan={1}>
          <VStack>
            <Text
              fontSize="115px"
              color="white"
              fontFamily="manrope"
              fontWeight="800"
            >
              Join
            </Text>
            <Text
              fontSize="115px"
              color="white"
              fontFamily="manrope"
              fontWeight="800"
            >
              Senate!
            </Text>
            <Text
              fontSize={20}
              color="gray.400"
              w="25rem"
              align="center"
              fontFamily="manrope"
              fontWeight="600"
            >
              Start receiving notifications from your DAOs every time a new
              proposal is made!
            </Text>
          </VStack>
        </GridItem>
        <GridItem rowSpan={2} colSpan={1}>
          <HStack align="end" justify="end" mt="5rem">
            <Image fit="fill" src="/homeart.svg" alt="very cool graphics" />
          </HStack>
        </GridItem>
        <GridItem colSpan={1}>
          <HStack align="start" justify="center" h="full">
            <Link href="/app">
              <Button
                minW={{ base: "80vw", md: "10rem" }}
                mx={{ base: "1rem", md: "5rem" }}
                mb="5rem"
                borderRadius="20px"
                borderWidth="2px"
                bg="gray.800"
                borderColor="gray.700"
                color="white"
              >
                Let&rsquo;s start
              </Button>
            </Link>
          </HStack>
        </GridItem>
      </SimpleGrid>
    </VStack>
  );
};

export default Home;
