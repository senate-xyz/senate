import { type MergedDao } from "../actions";
import { SubscribedDAO } from "./components/Card";
import { Suspense } from "react";

export default function SubscribedDAOs({
  subscribed,
}: {
  subscribed: Array<MergedDao>;
}) {
  const entries = subscribed;
  return (
    <div>
      {entries.length > 0 && (
        <main className="mb-10">
          <p className="mb-4 w-full text-[36px] font-bold leading-[36px] text-white">
            Your Organisations
          </p>

          <Suspense>
            <ul
              data-testid="subscribed-list"
              className="grid grid-cols-1 place-items-center gap-10 min-[650px]:grid-cols-2 min-[900px]:grid-cols-3 lg:place-items-start min-[1200px]:grid-cols-4 min-[1500px]:grid-cols-5 min-[1800px]:grid-cols-6 min-[2200px]:grid-cols-7 min-[2300px]:grid-cols-8 min-[2500px]:grid-cols-9 min-[3000px]:grid-cols-10"
            >
              {entries.map((entry) => {
                return (
                  <SubscribedDAO
                    key={entry.dao.id}
                    daoId={entry.dao.id}
                    daoName={entry.dao.name}
                    daoPicture={entry.dao.picture}
                    bgColor={entry.dao.backgroundColor}
                    daoHandlers={entry.daohandlers.map(
                      (handler) => handler.type,
                    )}
                    activeProposals={entry.proposals.count}
                  />
                );
              })}
            </ul>
          </Suspense>
        </main>
      )}
    </div>
  );
}
