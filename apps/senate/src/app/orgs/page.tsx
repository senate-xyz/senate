import SubscribedDAOs from "./subscribedDAOs/page";
import UnsubscribedDAOs from "./unsubscribedDAOs/page";
import { getSubscriptions } from "./actions";

export default async function Home() {
  const { subscribed, unsubscribed } = await getSubscriptions();

  return (
    <main className="flex w-full flex-col">
      <SubscribedDAOs subscribed={subscribed} />
      <UnsubscribedDAOs unsubscribed={unsubscribed} />
    </main>
  );
}
