import { type Subscribed } from "../actions";
import { SubscribedDAO } from "./components/Card";
import { Suspense } from "react";

export default function SubscribedDAOs({
  subscribed,
}: {
  subscribed: Subscribed;
}) {
  const { subscriptions, backgroundColors } = subscribed;
  return (
    <div>
      {subscriptions.length > 0 && (
        <main className="mb-10">
          <p className="mb-4 w-full text-[36px] font-bold leading-[36px] text-white">
            Your Organisations
          </p>

          <Suspense>
            <div className="grid grid-cols-1 place-items-center gap-10 min-[650px]:grid-cols-2 min-[900px]:grid-cols-3 lg:place-items-start min-[1200px]:grid-cols-4 min-[1500px]:grid-cols-5 min-[1800px]:grid-cols-6 min-[2200px]:grid-cols-7 min-[2300px]:grid-cols-8 min-[2500px]:grid-cols-9 min-[3000px]:grid-cols-10">
              {subscriptions.map((dao, index) => {
                return (
                  <SubscribedDAO
                    key={dao.id}
                    daoId={dao.id}
                    daoName={dao.name}
                    daoPicture={dao.picture}
                    bgColor={backgroundColors[index].color}
                    daoHandlers={dao.handlers.map((handler) => handler.type)}
                    activeProposals={dao.proposals.length}
                  />
                );
              })}
            </div>
          </Suspense>
        </main>
      )}
    </div>
  );
}
