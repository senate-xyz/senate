import {
  db,
  prisma,
  ProposalState,
  type JsonArray,
  eq,
  user,
  userTovoter,
  voter,
  proposal,
  vote,
  inArray,
  and,
  voterhandler,
} from "@senate/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import { PostHog } from "posthog-node";

const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
  host: `${process.env.NEXT_PUBLIC_WEB_URL ?? ""}/ingest`,
  disableGeoip: true,
});

enum VoteResult {
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

  const user = await prisma.user.findFirst({
    where: {
      address: { equals: userAddress },
    },
    include: {
      voters: true,
      subscriptions: {
        include: { dao: { select: { name: true } } },
      },
    },
  });

  let voteStatusQuery = {};
  if (user)
    switch (String(voted)) {
      case "no":
        voteStatusQuery = {
          votes: {
            none: {
              voteraddress: {
                in:
                  proxy == "any"
                    ? user?.voters.map((voter) => voter.address)
                    : [proxy],
              },
            },
          },
        };

        break;
      case "yes":
        voteStatusQuery = {
          votes: {
            some: {
              voteraddress: {
                in:
                  proxy == "any"
                    ? user?.voters.map((voter) => voter.address)
                    : [proxy],
              },
            },
          },
        };
        break;
      default:
        voteStatusQuery = {};
        break;
    }

  const dao = (await prisma.dao.findMany({})).filter(
    (dao) =>
      dao.name.toLowerCase().replace(" ", "") ==
      from.toLowerCase().replace(" ", ""),
  )[0];

  const canSeeDeleted =
    (await posthog.isFeatureEnabled(
      "can-see-deleted-proposals",
      userAddress,
    )) ?? false;

  const proposals = await prisma.proposal.findMany({
    where: {
      AND: [
        {
          dao: {
            name:
              from == "any"
                ? user
                  ? {
                      in: user?.subscriptions.map((sub) => sub.dao.name),
                    }
                  : {}
                : {
                    equals: String(dao?.name),
                  },
          },
        },
        {
          state: active
            ? {
                in: [ProposalState.ACTIVE, ProposalState.PENDING],
              }
            : {
                in: [
                  ProposalState.QUEUED,
                  ProposalState.DEFEATED,
                  ProposalState.EXECUTED,
                  ProposalState.EXPIRED,
                  ProposalState.SUCCEEDED,
                  ProposalState.HIDDEN,
                  ProposalState.UNKNOWN,
                ],
              },
        },
        voteStatusQuery,
        canSeeDeleted ? {} : { visible: true },
      ],
    },
    orderBy: {
      timeend: active ? "asc" : "desc",
    },
    include: {
      dao: true,
      daohandler: { select: { type: true } },
    },
    skip: page,
    take: 20,
  });

  const result =
    // eslint-disable-next-line @typescript-eslint/require-await
    proposals.map(async (proposal) => {
      let highestScore = 0.0;
      let highestScoreIndex = 0;
      let highestScoreChoice = "";
      if (
        proposal.scores &&
        typeof proposal.scores === "object" &&
        Array.isArray(proposal?.scores) &&
        proposal.choices &&
        typeof proposal.choices === "object" &&
        Array.isArray(proposal?.choices)
      ) {
        const scores = proposal.scores as JsonArray;
        for (let i = 0; i < scores.length; i++) {
          if (parseFloat(String(scores[i]?.toString())) > highestScore) {
            highestScore = parseFloat(String(scores[i]?.toString()));
            highestScoreIndex = i;
          }
        }
        highestScoreChoice = String(proposal.choices[highestScoreIndex]);
      }

      const voteResult = await fetchVote(proposal.id, proxy);

      return {
        proposalId: proposal.id,
        daoName: proposal.dao.name,
        daoHandlerId: proposal.daohandlerid,
        onchain: proposal.daohandler.type == "SNAPSHOT" ? false : true,
        daoPicture: proposal.dao.picture,
        proposalTitle: proposal.name,
        state: proposal.state,
        proposalLink: `${
          process.env.NEXT_PUBLIC_URL_SHORTNER || ""
        }${proposal.id.slice(-6)}/w/${user ? user.id.slice(-6) : ""}`,
        daoHandlerType: proposal.daohandler.type,
        timeEnd: proposal.timeend,
        highestScoreChoice: highestScoreChoice,
        highestScore: highestScore,
        scoresTotal: parseFloat(proposal.scorestotal?.toString() ?? "0.0"),
        passedQuorum: Number(proposal.quorum) < Number(proposal.scorestotal),
        voteResult: voteResult,
      };
    }) ?? [];

  return Promise.all(result);
}

export default function Home() {
  redirect("/proposals/active");
}
