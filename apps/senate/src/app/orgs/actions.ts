"use server";

import {
  db,
  sql,
  eq,
  dao,
  user,
  subscription,
  proposal,
  daohandler,
} from "@senate/database";
import { getAverageColor } from "fast-average-color-node";
import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { isNull } from "@senate/database";
import { and } from "@senate/database";

export interface MergedDao {
  dao: {
    id: string;
    name: string;
    picture: string;
    quorumwarningemailsupport: number;
    backgroundColor: string;
  };
  daohandlers: Array<{
    id: string;
    type: string;
    decoder: unknown;
    chainindex: number;
    snapshotindex: string;
    uptodate: number;
    daoid: string;
  }>;
  proposals: { count: number };
}

export const getSubscriptions = async () => {
  "use server";

  const subscribed = await getSubscribedDAOs();
  const unsubscribed = await getUnsubscribedDAOs();

  return { subscribed, unsubscribed };
};

const getSubscribedDAOs = async () => {
  "use server";

  const session = await getServerSession(authOptions());

  if (!session || !session.user || !session.user.name) return [];

  const userAddress = session.user.name;

  const [u] = await db.select().from(user).where(eq(user.address, userAddress));

  const daosListQueryResult = await db
    .select()
    .from(dao)
    .innerJoin(subscription, eq(dao.id, subscription.daoid))
    .leftJoin(daohandler, eq(daohandler.daoid, dao.id))
    .where(eq(subscription.userid, u.id));

  const reduceAsync = async (
    qr: typeof daosListQueryResult,
  ): Promise<MergedDao[]> => {
    const acc: MergedDao[] = [];

    for (const cur of qr) {
      const item = acc.find((item) => item.dao?.id === cur.dao.id);

      const backgroundColor = await getAverageColor(
        `${process.env.NEXT_PUBLIC_WEB_URL ?? ""}${cur.dao.picture}.svg`,
        {
          mode: "precision",
          algorithm: "sqrt",
        },
      )
        .then((r) => r.hex)
        .catch(() => {
          return "#5A5A5A";
        });

      const proposalsCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(proposal)
        .where(
          and(eq(proposal.daoid, cur.dao.id), eq(proposal.state, "ACTIVE")),
        );

      if (cur.daohandler)
        if (item) {
          item.daohandlers?.push(cur.daohandler);
        } else {
          acc.push({
            dao: {
              ...cur.dao,
              backgroundColor,
            },
            daohandlers: [cur.daohandler],
            proposals: proposalsCount[0],
          });
        }
    }

    return acc;
  };

  const reducedDaosListQueryResult = await reduceAsync(daosListQueryResult);

  const daosList: MergedDao[] = Object.values(reducedDaosListQueryResult);

  daosList.sort(
    (a: MergedDao, b: MergedDao) =>
      a.dao?.name.localeCompare(b.dao?.name || ""),
  );

  return daosList;
};

const getUnsubscribedDAOs = async () => {
  "use server";

  const session = await getServerSession(authOptions());

  const reduceAsync = async (
    qr: typeof daosListQueryResult,
  ): Promise<MergedDao[]> => {
    const acc: MergedDao[] = [];

    for (const cur of qr) {
      const item = acc.find((item) => item.dao?.id === cur.dao.id);

      const backgroundColor = await getAverageColor(
        `${process.env.NEXT_PUBLIC_WEB_URL ?? ""}${cur.dao.picture}.svg`,
        {
          mode: "precision",
          algorithm: "sqrt",
        },
      )
        .then((r) => r.hex)
        .catch(() => {
          return "#5A5A5A";
        });

      if (cur.daohandler)
        if (item) {
          item.daohandlers?.push(cur.daohandler);
        } else {
          acc.push({
            dao: {
              ...cur.dao,
              backgroundColor,
            },
            daohandlers: [cur.daohandler],
            proposals: { count: 0 },
          });
        }
    }

    return acc;
  };

  if (!session || !session.user || !session.user.name) {
    const daosListQueryResult = await db
      .select({ dao, daohandler })
      .from(dao)
      .leftJoin(daohandler, eq(daohandler.daoid, dao.id));

    const reducedDaosListQueryResult = await reduceAsync(daosListQueryResult);

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
    .select({ dao, daohandler })
    .from(dao)
    .leftJoin(
      subscription,
      and(eq(dao.id, subscription.daoid), eq(subscription.userid, u.id)),
    )
    .leftJoin(daohandler, eq(daohandler.daoid, dao.id))
    .where(isNull(subscription.id));

  const reducedDaosListQueryResult = await reduceAsync(daosListQueryResult);

  const daosList: MergedDao[] = Object.values(reducedDaosListQueryResult);

  daosList.sort(
    (a: MergedDao, b: MergedDao) =>
      a.dao?.name.localeCompare(b.dao?.name || ""),
  );

  return daosList;
};
