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
  voterhandler,
  asc,
  daohandler,
  desc,
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

export async function getProxies() {
  "use server";

  const session = await getServerSession(authOptions());
  if (!session || !session.user || !session.user.name) return [];
  const userAddress = session.user.name;

  const [u] = await db.select().from(user).where(eq(user.address, userAddress));

  const proxies = await db
    .select()
    .from(userTovoter)
    .leftJoin(user, eq(userTovoter.a, user.id))
    .leftJoin(voter, eq(userTovoter.b, voter.id))
    .where(eq(user.id, u.id));

  return proxies.map((p) => (p.voter ? p.voter?.address : ""));
}

export enum VoteResult {
  NOT_CONNECTED = "NOT_CONNECTED",
  LOADING = "LOADING",
  VOTED = "VOTED",
  NOT_VOTED = "NOT_VOTED",
}

export async function fetchVote(proposalId: string, proxy: string) {
  "use server";

  const session = await getServerSession(authOptions());
  if (!session || !session.user || !session.user.name)
    return VoteResult.NOT_CONNECTED;
  const userAddress = session.user.name;

  const [u] = await db.select().from(user).where(eq(user.address, userAddress));

  if (!u) return VoteResult.NOT_CONNECTED;

  const [p] = await db
    .select()
    .from(proposal)
    .where(and(eq(proposal.id, proposalId)));

  if (!p) return VoteResult.LOADING;

  const proxies =
    proxy == "any"
      ? await db
          .select()
          .from(userTovoter)
          .leftJoin(user, eq(userTovoter.a, user.id))
          .leftJoin(voter, eq(userTovoter.b, voter.id))
          .where(eq(user.id, u.id))
      : [];

  const votersAddresses = proxies.map((p) => (p.voter ? p.voter?.address : ""));
  const votersIds = proxies.map((p) => (p.voter ? p.voter?.address : ""));

  const voterHandlers = await db
    .select()
    .from(voterhandler)
    .where(
      and(
        eq(voterhandler.daohandlerid, p.daohandlerid),
        inArray(voterhandler.voterid, votersIds),
      ),
    );

  if (voterHandlers.some((vh) => !vh.uptodate)) return VoteResult.LOADING;

  const votes = await db
    .select()
    .from(vote)
    .where(
      and(
        eq(vote.proposalid, proposalId),
        inArray(vote.voteraddress, proxy == "any" ? votersAddresses : [proxy]),
      ),
    );

  if (votes.map((vote) => vote.choice).length > 0) return VoteResult.VOTED;

  return VoteResult.NOT_VOTED;
}

export async function fetchItems(
  active: boolean,
  page: number,
  from: string,
  voted: string,
  proxy: string,
) {
  "use server";

  const session = await getServerSession(authOptions());
  const userAddress = session?.user?.name ?? "";

  const canSeeDeleted =
    (await posthog.isFeatureEnabled(
      "can-see-deleted-proposals",
      userAddress,
    )) ?? false;

  const [u] = await db.select().from(user).where(eq(user.address, userAddress));

  const proxies = await db
    .select()
    .from(userTovoter)
    .leftJoin(user, eq(userTovoter.a, user.id))
    .leftJoin(voter, eq(userTovoter.b, voter.id))
    .where(u ? eq(user.id, u.id) : undefined);

  const votersAddresses =
    proxy == "any"
      ? proxies.map((p) => (p.voter ? p.voter?.address : ""))
      : [proxy];

  const subscribedDaos = await db
    .select()
    .from(subscription)
    .leftJoin(dao, eq(subscription.daoid, dao.id))
    .leftJoin(user, eq(user.id, subscription.userid))
    .where(eq(user.address, userAddress));

  const unfiltededProposals = await db
    .select()
    .from(proposal)
    .leftJoin(
      vote,
      and(
        eq(proposal.id, vote.proposalid),
        inArray(vote.voteraddress, votersAddresses),
      ),
    )
    .leftJoin(dao, eq(proposal.daoid, dao.id))
    .leftJoin(daohandler, eq(proposal.daohandlerid, daohandler.id))
    .where(
      and(
        canSeeDeleted ? undefined : eq(proposal.visible, 1),
        from == "any"
          ? userAddress
            ? inArray(
                dao.name,
                subscribedDaos.map((s) => s.dao!.name),
              )
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

  let p: typeof unfiltededProposals = [];
  switch (voted) {
    case "yes":
      p = unfiltededProposals.filter((p) => p.vote);
      break;
    case "no":
      p = unfiltededProposals.filter((p) => !p.vote);
      break;
    case "any":
      p = unfiltededProposals;
      break;
  }

  return p;
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
