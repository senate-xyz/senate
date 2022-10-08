import type { NextPage } from "next";
import { useState } from "react";
import { Flex, useColorMode } from "@chakra-ui/react";
import NavBar, { ViewsEnum } from "../components/navbar/NavBar";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const DynamicDashboard = dynamic(
  () => import("../components/views/dashboard/DashboardView"),
  {
    suspense: true,
  }
);

const DynamicWatchlist = dynamic(
  () => import("../components/views/watchlist/Watchlist"),
  {
    suspense: true,
  }
);

const DynamicTracker = dynamic(
  () => import("../components/views/tracker/Tracker"),
  {
    suspense: true,
  }
);

const Home: NextPage = () => {
  const [view, setView] = useState(ViewsEnum.Dashboard);
  const { colorMode } = useColorMode();

  return (
    <Flex
      flexDir="row"
      minH={{ base: "100%", sm: "100vh" }}
      w="full"
      bgColor={colorMode == "light" ? "white.200" : "white.500"}
    >
      <NavBar page={view} setView={setView} />
      <Flex
        w="full"
        minH={{ base: "100%", sm: "100vh" }}
        flexDir="column"
        bgColor={colorMode == "light" ? "blackAlpha.200" : "blackAlpha.500"}
      >
        <Suspense fallback={`Loading...`}>
          {view == ViewsEnum.Dashboard && <DynamicDashboard />}
          {view == ViewsEnum.Watchlist && <DynamicWatchlist />}
          {view == ViewsEnum.Tracker && <DynamicTracker shareButton={true} />}
        </Suspense>
      </Flex>
    </Flex>
  );
};

export default Home;
