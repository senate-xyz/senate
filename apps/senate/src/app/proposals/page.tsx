import {
  prisma,
  type Vote,
  ProposalState,
  type JsonArray,
} from "@senate/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";

enum VoteResult {
  NOT_CONNECTED = "NOT_CONNECTED",
  LOADING = "LOADING",
  VOTED = "VOTED",
  NOT_VOTED = "NOT_VOTED",
}

export async function getSubscribedDAOs() {
  "use server";

  const session = await getServerSession(authOptions());
  if (!session || !session.user || !session.user.name) {
    const daosList = await prisma.dao.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return daosList;
  }
  const userAddress = session.user.name;

  const user = await prisma.user.findFirstOrThrow({
    where: {
      address: { equals: userAddress },
    },
    select: {
      id: true,
    },
  });

  const daosList = await prisma.dao.findMany({
    where: {
      subscriptions: {
        some: {
          user: { is: user },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
  return daosList;
}

export async function getProxies() {
  "use server";

  const session = await getServerSession(authOptions());
  if (!session || !session.user || !session.user.name) return [];
  const userAddress = session.user.name;

  const user = await prisma.user.findFirstOrThrow({
    where: {
      address: { equals: userAddress },
    },
    include: {
      voters: true,
    },
  });

  const proxies = user.voters.map((voter) => voter.address);

  return proxies;
}

export async function fetchVote(proposalId: string, proxy: string) {
  "use server";

  const session = await getServerSession(authOptions());
  if (!session || !session.user || !session.user.name)
    return VoteResult.NOT_CONNECTED;
  const userAddress = session.user.name;

  const user = await prisma.user.findFirst({
    where: {
      address: { equals: userAddress },
    },
    include: {
      voters: true,
    },
  });

  if (!user) return VoteResult.NOT_CONNECTED;

  const proposal = await prisma.proposal.findFirst({
    where: { id: proposalId },
    include: {
      votes: {
        where: {
          voteraddress: {
            in:
              proxy == "any"
                ? user?.voters.map((voter) => voter.address)
                : [proxy],
          },
        },
      },
    },
  });

  if (!proposal) return VoteResult.LOADING;

  const voterHandlers = await prisma.voterhandler.findMany({
    where: {
      daohandlerid: { equals: proposal?.daohandlerid },
      voter: { id: { in: user?.voters.map((v) => v.id) } },
    },
  });

  if (voterHandlers.some((vh) => !vh.uptodate)) return VoteResult.LOADING;

  if (proposal.votes.map((vote: Vote) => vote.choice).length > 0)
    return VoteResult.VOTED;

  return VoteResult.NOT_VOTED;
}

export async function fetchItems(
  active: boolean,
  page: number,
  from: string,
  voted: string,
  proxy: string
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
      from.toLowerCase().replace(" ", "")
  )[0];

  const proposals = await prisma.proposal.findMany({
    where: {
      AND: [
        {
          dao: {
            name: user
              ? from == "any"
                ? {
                    in: user?.subscriptions.map((sub) => sub.dao.name),
                  }
                : {
                    equals: String(dao?.name),
                  }
              : { endsWith: "placeholder" },
          },
        },
        {
          timeend: active
            ? {
                lte: new Date(),
              }
            : {
                gte: new Date(),
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
