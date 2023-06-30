import { getUnsubscribedDAOs } from "../page";
import { UnsubscribedDAO } from "./components/Card";
import { Suspense } from "react";

export default async function UnsubscribedDAOs() {
  const { unsubscriptions, backgroundColors } = await getUnsubscribedDAOs();

  return (
    <div>
      {unsubscriptions.length > 0 && (
        <main>
          <p className="mb-4 w-full text-[36px] font-bold leading-[36px] text-white">
            Organisations you can subscribe to
          </p>

          <Suspense>
            <div className="grid grid-cols-1  place-items-center gap-10 min-[650px]:grid-cols-2 min-[900px]:grid-cols-3 lg:place-items-start min-[1200px]:grid-cols-4 min-[1500px]:grid-cols-5 min-[1800px]:grid-cols-6 min-[2200px]:grid-cols-7 min-[2300px]:grid-cols-8 min-[2500px]:grid-cols-9 min-[3000px]:grid-cols-10">
              {unsubscriptions.map((unsubscribedDAO, index) => {
                return (
                  <UnsubscribedDAO
                    key={unsubscribedDAO.id}
                    daoId={unsubscribedDAO.id}
                    daoName={unsubscribedDAO.name}
                    daoPicture={unsubscribedDAO.picture}
                    bgColor={backgroundColors[index].color}
                    daoHandlers={unsubscribedDAO.handlers.map(
                      (handler) => handler.type
                    )}
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
