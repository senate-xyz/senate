import { Filters } from "./components/Filters";
import { Suspense } from "react";
import { type Metadata } from "next";
import Items from "./components/Items";
import { fetchItems, fetchVote, getProxies, getSubscribedDAOs } from "../page";

export const metadata: Metadata = {
  title: "Senate - Active Proposals",
  icons: "/assets/Senate_Logo/64/Black.svg",
};

export default async function Home({
  searchParams,
}: {
  searchParams?: { from: string; end: number; voted: string; proxy: string };
}) {
  const subscribedDAOs = await getSubscribedDAOs();
  const proxies = await getProxies();

  const subscripions = subscribedDAOs.map((subDAO) => {
    return { id: subDAO.id, name: subDAO.name };
  });

  return (
    <div className="min-h-screen gap-2">
      <Suspense>
        <Filters subscriptions={subscripions} proxies={proxies} />
      </Suspense>

      <Suspense>
        <Items
          fetchItems={fetchItems}
          fetchVote={fetchVote}
          searchParams={searchParams}
        />
      </Suspense>
    </div>
  );
}
