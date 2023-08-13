import {
  db,
  user,
  eq,
  dao,
  subscription,
  voter,
  and,
  inArray,
  proposal,
  vote,
  asc,
  daohandler,
  desc,
  isNull,
} from "@senate/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { userTovoter } from "@senate/database";
import { PostHog } from "posthog-node";

const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
  host: `${process.env.NEXT_PUBLIC_WEB_URL ?? ""}/ingest`,
  disableGeoip: true,
});

export interface MergedDao {
  dao: {
    id: string;
    name: string;
    picture: string;
    quorumwarningemailsupport: boolean;
  };
}

export const getSubscribedDAOs = async () => {
  "use server";

  console.log("getSubscribedDAOs 1");
  const session = await getServerSession(authOptions());

  console.log("getSubscribedDAOs 2");
  if (!session || !session.user || !session.user.name) {
    console.log("getSubscribedDAOs 3");
    const daosListQueryResult = await db.select({ dao }).from(dao);

    daosListQueryResult.sort(
      (a: MergedDao, b: MergedDao) =>
        a.dao?.name.localeCompare(b.dao?.name || ""),
    );

    console.log("getSubscribedDAOs 5");
    return daosListQueryResult;
  }

  console.log("getSubscribedDAOs 6");
  const userAddress = session.user.name;

  const [u] = await db.select().from(user).where(eq(user.address, userAddress));

  console.log("getSubscribedDAOs 7");
  const daosListQueryResult = await db
    .select({ dao })
    .from(dao)
    .innerJoin(subscription, eq(dao.id, subscription.daoid))
    .where(eq(subscription.userid, u.id));

  daosListQueryResult.sort(
    (a: MergedDao, b: MergedDao) =>
      a.dao?.name.localeCompare(b.dao?.name || ""),
  );

  console.log("getSubscribedDAOs 10");
  return daosListQueryResult;
};

export const userHasProxies = async () => {
  "use server";

  console.log("userHasProxies 1");
  const session = await getServerSession(authOptions());
  if (!session || !session.user || !session.user.name) return true;
  const userAddress = session.user.name;

  console.log("userHasProxies 2");
  const proxies = await db
    .select()
    .from(userTovoter)
    .leftJoin(user, eq(userTovoter.a, user.id))
    .where(eq(user.address, userAddress));

  console.log("userHasProxies 3");
  return proxies.length > 1;
};

export async function getProxies() {
  "use server";

  console.log("getProxies 1");
  const session = await getServerSession(authOptions());
  if (!session || !session.user || !session.user.name) return [];
  const userAddress = session.user.name;

  console.log("getProxies 2");
  const [u] = await db.select().from(user).where(eq(user.address, userAddress));

  console.log("getProxies 3");
  const proxies = await db
    .select()
    .from(userTovoter)
    .leftJoin(user, eq(userTovoter.a, user.id))
    .leftJoin(voter, eq(userTovoter.b, voter.id))
    .where(eq(user.id, u.id));

  console.log("getProxies 4");
  const result: Array<string> = [];

  proxies.map((p) => {
    if (p.voter && p.voter.address.length > 0) {
      result.push(p.voter.address);
    }
  });

  console.log("getProxies 5");

  return result;
}

export enum VoteResult {
  NOT_CONNECTED = "NOT_CONNECTED",
  LOADING = "LOADING",
  VOTED = "VOTED",
  NOT_VOTED = "NOT_VOTED",
}

export async function fetchItems(
  active: boolean,
  page: number,
  from: string,
  voted: string,
  proxy: string,
) {
  "use server";

  console.log("=======");
  console.log(from);
  console.log("fetchItems 1");

  const session = await getServerSession(authOptions());
  const userAddress = session?.user?.name ?? "unknown";

  console.log("fetchItems 2");
  const canSeeDeleted =
    (await posthog.isFeatureEnabled(
      "can-see-deleted-proposals",
      userAddress,
    )) ?? false;

  console.log("fetchItems 3");

  const [u] = await db.select().from(user).where(eq(user.address, userAddress));

  console.log("fetchItems 4");
  const proxies = await db
    .select()
    .from(userTovoter)
    .leftJoin(user, eq(userTovoter.a, user.id))
    .leftJoin(voter, eq(userTovoter.b, voter.id))
    .where(u ? eq(user.id, u.id) : eq(user.id, "unknown"));

  console.log("fetchItems 5");
  const votersAddresses =
    proxy == "any"
      ? proxies.map((p) => (p.voter ? p.voter?.address : "unknown"))
      : [proxy];

  console.log("fetchItems 6");
  const subscribedDaos = await db
    .select()
    .from(subscription)
    .leftJoin(dao, eq(subscription.daoid, dao.id))
    .leftJoin(user, eq(user.id, subscription.userid))
    .where(eq(user.address, userAddress));

  console.log("fetchItems 7");

  console.log(`voted ${voted}`);
  console.log(`votersAddresses.length > 0 ${votersAddresses.length > 0}`);
  console.log(`canSeeDeleted ${canSeeDeleted}`);
  console.log(`from == "any" ${from == "any"}`);
  console.log(`userAddress ${userAddress}`);
  console.log(`subscribedDaos.length > 0" ${subscribedDaos.length > 0}`);
  console.log(`active" ${active}`);

  const p = await db
    .select()
    .from(proposal)
    .leftJoin(
      vote,
      and(
        eq(proposal.id, vote.proposalid),
        votersAddresses.length > 0
          ? inArray(vote.voteraddress, votersAddresses)
          : inArray(vote.voteraddress, ["undefined"]),
      ),
    )
    .leftJoin(dao, eq(proposal.daoid, dao.id))
    .leftJoin(daohandler, eq(proposal.daohandlerid, daohandler.id))

    .where(
      and(
        voted == "no" ? isNull(vote.id) : undefined,
        voted == "yes" ? eq(vote.proposalid, proposal.id) : undefined,
        canSeeDeleted ? undefined : eq(proposal.visible, true),
        from == "any"
          ? userAddress
            ? subscribedDaos.length > 0
              ? inArray(
                  dao.name,
                  subscribedDaos.map((s) => s.dao!.name),
                )
              : undefined
            : undefined
          : eq(dao.name, from),
        inArray(
          proposal.state,
          active
            ? ["ACTIVE", "PENDING"]
            : [
                "QUEUED",
                "DEFEATED",
                "EXECUTED",
                "EXPIRED",
                "SUCCEEDED",
                "HIDDEN",
                "UNKNOWN",
              ],
        ),
      ),
    )
    .orderBy(active ? asc(proposal.timeend) : desc(proposal.timeend))
    .limit(20)
    .offset(page);

  console.log("fetchItems 9");

  type ConsolidatedProposalResult = Omit<(typeof p)[0], "vote"> & {
    votes?: (typeof p)[0]["vote"][];
  };

  const consolidatedResults = p.reduce(
    (acc: ConsolidatedProposalResult[], curr) => {
      const existingProposal = acc.find(
        (p) => p.proposal.id === curr.proposal.id,
      );

      if (existingProposal) {
        existingProposal.votes!.push(curr.vote);
      } else {
        acc.push(curr);
        if (curr.vote) (curr as ConsolidatedProposalResult).votes = [curr.vote];
        else (curr as ConsolidatedProposalResult).votes = [];
      }

      return acc;
    },
    [],
  );

  console.log("fetchItems 10");

  return consolidatedResults;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any
) => Promise<infer R>
  ? R
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any;

export type fetchItemsType = AsyncReturnType<typeof fetchItems>;
