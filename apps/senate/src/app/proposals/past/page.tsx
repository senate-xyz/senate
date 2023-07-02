import { Filters } from "./components/Filters";
import { getSubscribedDAOs, getProxies, fetchItems, fetchVote } from "../page";
import Items from "./components/Items";

export default async function Home({
  searchParams,
}: {
  params: { slug: string };
  searchParams: { from: string; end: number; voted: string; proxy: string };
}) {
  const subscribedDAOs = await getSubscribedDAOs();
  const proxies = await getProxies();

  const subscripions = subscribedDAOs.map((subDAO) => {
    return { id: subDAO.id, name: subDAO.name };
  });

  return (
    <div className="relative min-h-screen">
      <Filters subscriptions={subscripions} proxies={proxies} />

      {searchParams.end &&
        searchParams.from &&
        searchParams.proxy &&
        searchParams.voted && (
          <Items
            fetchItems={fetchItems}
            fetchVote={fetchVote}
            searchParams={searchParams}
          />
        )}
    </div>
  );
}
