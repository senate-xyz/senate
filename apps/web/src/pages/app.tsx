import type { NextPage } from "next";
import { useState } from "react";
import NavBar from "../components/navbar/NavBar";
import { PagesEnum } from "@senate/common-types";
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

const Home: NextPage = () => {
  const [page, setPage] = useState(PagesEnum.Dashboard);

  return (
    <div>
      app.tsx
      <NavBar page={page} setPage={setPage} />
      <div>
        <Suspense fallback={`Loading...`}>
          {page == PagesEnum.Dashboard && <DyanmicProposals />}
          {page == PagesEnum.Watchlist && <DynamicWatchlist />}
          {page == PagesEnum.Tracker && <DynamicTracker />}
        </Suspense>
      </div>
    </div>
  );
};

export default Home;
