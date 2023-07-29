import { Filters } from "./components/Filters";
import Items from "./components/Items";
import {
  fetchItems,
  fetchVote,
  getProxies,
  getSubscribedDAOs,
} from "../actions";

export default async function Home({
  searchParams,
}: {
  searchParams: { from: string; voted: string; proxy: string };
}) {
  const subscribedDAOs = await getSubscribedDAOs();
  const proxies = await getProxies();

  const subscripions = subscribedDAOs.map((entry) => {
    return { id: entry.dao.id, name: entry.dao.name };
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
