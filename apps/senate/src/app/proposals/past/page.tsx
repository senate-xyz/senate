import { Filters } from "./components/Filters";
import { Suspense } from "react";
import { type Metadata } from "next";
import { getSubscribedDAOs, getProxies, fetchItems, fetchVote } from "../page";
import Items from "./components/Items";

export const metadata: Metadata = {
  title: "Senate - Past Proposals",
  icons: "/assets/Senate_Logo/64/Black.svg",
};

export default async function Home({
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { from: string; end: number; voted: string; proxy: string };
}) {
  const subscribedDAOs = await getSubscribedDAOs();
  const proxies = await getProxies();

  const subscripions = subscribedDAOs.map((subDAO) => {
    return { id: subDAO.id, name: subDAO.name };
  });

  return (
    <div className="relative min-h-screen">
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
