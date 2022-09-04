import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import NavBar from "../components/navbar/NavBar";
import { Pages } from "../types";
import Proposals from "../components/mainBox/proposals/Proposals";
import Subscriptions from "../components/mainBox/subscriptions/Subscriptions";

const Home: NextPage = () => {
  const [page, setPage] = useState(Pages.Dashboard);

  useEffect(() => {
    console.log(page);
  }, [page]);

  return (
    <Flex flexDir="row" w="100vw">
      <NavBar page={page} setPage={setPage} />
      {page == Pages.Dashboard && <Proposals />}
      {page == Pages.Subscriptions && <Subscriptions />}
    </Flex>
  );
};

export default Home;
