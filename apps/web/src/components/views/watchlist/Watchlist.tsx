import { DaoItem } from "./DaoItem";
import { useSession } from "next-auth/react";
import { trpc } from "../../../utils/trpc";
import { DAOType } from "@senate/common-types";

const Watchlist = () => {
  const { data: session } = useSession();

  const DAOs = trpc.useQuery([session ? "user.daos" : "public.daos"]);
  const subscribe = trpc.useMutation("user.subscribe");
  const unsubscribe = trpc.useMutation("user.unsubscribe");
  const utils = trpc.useContext();

  const handleSubscribe = async (daoId: string) => {
    subscribe.mutate(
      { daoId: daoId },
      {
        onSuccess() {
          utils.invalidateQueries();
        },
      }
    );
  };

  const handleUnsubscribe = async (daoId: string) => {
    unsubscribe.mutate(
      { daoId: daoId },
      {
        onSuccess() {
          utils.invalidateQueries();
        },
      }
    );
  };

  if (DAOs.isLoading) return <div>loading</div>;

  if (!DAOs.isLoading && !DAOs.data) return <div>no data</div>;

  return (
    <div className="w-full">
      <p>Watchlist</p>
      <div className="w-full">
        <div className="grid grid-cols-4 gap-4">
          {DAOs.data.map((dao: DAOType, index: number) => {
            return (
              <div key={index}>
                <DaoItem
                  dao={dao}
                  key={index}
                  handleSubscribe={handleSubscribe}
                  handleUnsubscribe={handleUnsubscribe}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Watchlist;
