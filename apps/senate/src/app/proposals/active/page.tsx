import { Filters } from "./components/Filters";
import Items from "./components/Items";
import { fetchItems, fetchVote, getProxies, getSubscribedDAOs } from "../page";

export default async function Home({
  searchParams,
}: {
  searchParams: { from: string; voted: string; proxy: string };
}) {
  const subscribedDAOs = await getSubscribedDAOs();
  const proxies = await getProxies();

  const subscripions = subscribedDAOs.map((subDAO) => {
    return { id: subDAO.id, name: subDAO.name };
  });

  return (
    <div className="min-h-screen gap-2">
      <Filters subscriptions={subscripions} proxies={proxies} />

      {searchParams.from && searchParams.proxy && searchParams.voted && (
        <Items
          fetchItems={fetchItems}
          fetchVote={fetchVote}
          searchParams={searchParams}
        />
      )}
    </div>
  );
}
