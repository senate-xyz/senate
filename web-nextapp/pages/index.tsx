import type { NextPage } from "next";
import { useState } from "react";
import { Flex } from "@chakra-ui/react";
import NavBar from "../components/navbar/NavBar";
import { PagesEnum } from "../../types";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const DyanmicProposals = dynamic(
  () => import("../components/mainBox/proposals/Proposals"),
  {
    suspense: true,
  }
);

const DynamicSubscriptions = dynamic(
  () => import("../components/mainBox/daos/Daos"),
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

const DynamicHeader = dynamic(() => import("../components/header/Header"), {
  suspense: true,
});

const Home: NextPage = () => {
  const [page, setPage] = useState(PagesEnum.Dashboard);

  return (
    <Flex flexDir="row" w="100vw">
      <NavBar page={page} setPage={setPage} />
      <Flex w="full" flexDir="column" bg="gray.200">
        <DynamicHeader />
        <Suspense fallback={`Loading...`}>
          {page == PagesEnum.Dashboard && <DyanmicProposals />}
          {page == PagesEnum.Subscriptions && <DynamicSubscriptions />}
          {page == PagesEnum.Tracker && <DynamicTracker />}
          {page == PagesEnum.Settings && <DynamicSettings />}
        </Suspense>
      </Flex>
    </Flex>
  );
};

export default Home;
