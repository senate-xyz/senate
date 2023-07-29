import { Filters } from "./components/Filters";
import { fetchItems } from "../page";
import Items from "./components/Items";
import { fetchVote, getProxies, getSubscribedDAOs } from "../actions";

export default async function Home({
  searchParams,
}: {
  params: { slug: string };
  searchParams: { from: string; voted: string; proxy: string };
}) {
  const subscribedDAOs = await getSubscribedDAOs();
  const proxies = await getProxies();

  const subscripions = subscribedDAOs.map((entry) => {
    return { id: entry.dao.id, name: entry.dao.name };
  });

  return (
    <div className="relative min-h-screen">
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
