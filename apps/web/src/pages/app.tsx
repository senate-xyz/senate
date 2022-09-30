import type { NextPage } from "next";
import { useState } from "react";
import { Flex, useColorMode } from "@chakra-ui/react";
import NavBar from "../components/navbar/NavBar";
import { PagesEnum } from "common-types";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const DyanmicProposals = dynamic(
  () => import("../components/mainBox/proposals/Proposals"),
  {
    suspense: true,
  }
);

const DynamicWatchlist = dynamic(
  () => import("../components/mainBox/watchlist/Daos"),
  {
    suspense: true,
  }
);

const DynamicTracker = dynamic(
  () => import("../components/mainBox/tracker/Tracker"),
  {
    suspense: true,
  }
);

const DynamicSettings = dynamic(
  () => import("../components/mainBox/settings/Settings"),
  {
    suspense: true,
  }
);

const Home: NextPage = () => {
  const [page, setPage] = useState(PagesEnum.Dashboard);
  const { colorMode } = useColorMode();
  return (
    <Flex
      flexDir="row"
      minH={{ base: "100%", sm: "100vh" }}
      w="full"
      bgColor={colorMode == "light" ? "white.200" : "white.500"}
    >
      <NavBar page={page} setPage={setPage} />
      <Flex
        w="full"
        minH={{ base: "100%", sm: "100vh" }}
        flexDir="column"
        bgColor={colorMode == "light" ? "blackAlpha.200" : "blackAlpha.500"}
      >
        <Suspense fallback={`Loading...`}>
          {page == PagesEnum.Dashboard && <DyanmicProposals />}
          {page == PagesEnum.Watchlist && <DynamicWatchlist />}
          {page == PagesEnum.Tracker && <DynamicTracker />}
          {page == PagesEnum.Settings && <DynamicSettings />}
        </Suspense>
      </Flex>
    </Flex>
  );
};

export default Home;
