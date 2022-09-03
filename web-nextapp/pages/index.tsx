import type { NextPage } from "next";
import { Flex } from "@chakra-ui/react";
import NavBar from "../components/dashboard/navbar/NavBar";
import { MainBox } from "../components/dashboard/container/MainBox";

const Home: NextPage = () => {
  return (
    <Flex flexDir="row">
      <NavBar></NavBar>
      <MainBox></MainBox>
    </Flex>
  );
};

export default Home;
