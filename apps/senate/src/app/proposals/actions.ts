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
import { voterhandler } from "@senate/database";

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

  const session = await getServerSession(authOptions());

  if (!session || !session.user || !session.user.name) {
    const daosListQueryResult = await db.select({ dao }).from(dao);

    daosListQueryResult.sort(
      (a: MergedDao, b: MergedDao) =>
        a.dao?.name.localeCompare(b.dao?.name || ""),
    );

    return daosListQueryResult;
  }

  const userAddress = session.user.name;

  const [u] = await db.select().from(user).where(eq(user.address, userAddress));

  const daosListQueryResult = await db
    .select({ dao })
    .from(dao)
    .innerJoin(subscription, eq(dao.id, subscription.daoid))
    .where(eq(subscription.userid, u.id));

  daosListQueryResult.sort(
    (a: MergedDao, b: MergedDao) =>
      a.dao?.name.localeCompare(b.dao?.name || ""),
  );

  return daosListQueryResult;
};

export const userHasProxies = async () => {
  "use server";

  const session = await getServerSession(authOptions());
  if (!session || !session.user || !session.user.name) return true;
  const userAddress = session.user.name;

  const proxies = await db
    .select()
    .from(userTovoter)
    .leftJoin(user, eq(userTovoter.a, user.id))
    .where(eq(user.address, userAddress));

  return proxies.length > 1;
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

  const result: Array<string> = [];

  proxies.map((p) => {
    if (p.voter && p.voter.address.length > 0) {
      result.push(p.voter.address);
    }
  });

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

  const session = await getServerSession(authOptions());
  const userAddress = session?.user?.name ?? "unknown";

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
    .where(u ? eq(user.id, u.id) : eq(user.id, "unknown"));

  const votersAddresses =
    proxy == "any"
      ? proxies.map((p) => (p.voter ? p.voter?.address : "unknown"))
      : [proxy];

  const votersIds =
    proxy == "any"
      ? proxies.map((p) => (p.voter ? p.voter?.id : "unknown"))
      : [proxy];

  const subscribedDaos = await db
    .select()
    .from(subscription)
    .leftJoin(dao, eq(subscription.daoid, dao.id))
    .leftJoin(user, eq(user.id, subscription.userid))
    .where(eq(user.address, userAddress));

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
            ? ["ACTIVE"]
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

  type ConsolidatedProposalResult = Omit<(typeof p)[0], "vote"> & {
    votes?: (typeof p)[0]["vote"][];
    uptodate?: boolean;
  };

  const consolidatedResults: ConsolidatedProposalResult[] = [];

  for (const curr of p) {
    const existingProposal = consolidatedResults.find(
      (proposal) => proposal.proposal?.id === curr.proposal?.id,
    );

    const voterHandlers = await db
      .select()
      .from(voterhandler)
      .where(
        and(
          eq(voterhandler.daohandlerid, curr.proposal.daohandlerid),
          votersIds.length > 0
            ? inArray(voterhandler.voterid, votersIds)
            : inArray(voterhandler.voterid, ["undefined"]),
        ),
      );

    let uptodate = true;
    for (const vh of voterHandlers) {
      if (!vh.uptodate) uptodate = vh.uptodate;
    }

    if (
      !curr.daohandler?.uptodate &&
      curr.daohandler?.type != "MAKER_POLL_ARBITRUM"
    ) {
      uptodate = false;
    }

    if (existingProposal) {
      existingProposal.votes!.push(curr.vote);
      existingProposal.uptodate = uptodate;
    } else {
      if (curr.vote) (curr as ConsolidatedProposalResult).votes = [curr.vote];
      else (curr as ConsolidatedProposalResult).votes = [];

      (curr as ConsolidatedProposalResult).uptodate = uptodate;
      consolidatedResults.push(curr as ConsolidatedProposalResult);
    }
  }

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
