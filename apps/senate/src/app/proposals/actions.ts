import { db, user, eq, dao, subscription } from "@senate/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

export interface MergedDao {
  dao: {
    id: string;
    name: string;
    picture: string;
    quorumwarningemailsupport: number;
  };
}

export const getSubscribedDAOs = async () => {
  "use server";

  const session = await getServerSession(authOptions());

  const reduceAsync = (qr: typeof daosListQueryResult): MergedDao[] => {
    const acc: MergedDao[] = [];

    for (const cur of qr) {
      acc.push({
        dao: {
          ...cur.dao,
        },
      });
    }

    return acc;
  };

  if (!session || !session.user || !session.user.name) {
    const daosListQueryResult = await db.select({ dao }).from(dao);
    const reducedDaosListQueryResult = reduceAsync(daosListQueryResult);

    const daosList: MergedDao[] = Object.values(reducedDaosListQueryResult);

    daosList.sort(
      (a: MergedDao, b: MergedDao) =>
        a.dao?.name.localeCompare(b.dao?.name || ""),
    );

    return daosList;
  }

  const userAddress = session.user.name;

  const [u] = await db.select().from(user).where(eq(user.address, userAddress));

  const daosListQueryResult = await db
    .select({ dao })
    .from(dao)
    .innerJoin(subscription, eq(dao.id, subscription.daoid))
    .where(eq(subscription.userid, u.id));

  const reducedDaosListQueryResult = reduceAsync(daosListQueryResult);

  const daosList: MergedDao[] = Object.values(reducedDaosListQueryResult);

  daosList.sort(
    (a: MergedDao, b: MergedDao) =>
      a.dao?.name.localeCompare(b.dao?.name || ""),
  );

  return daosList;
};
