import { ProposalState, type Vote, prisma } from "@senate/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import { Filters } from "./components/csr/Filters";
import { Suspense } from "react";
import { type Metadata } from "next";
import Items from "./components/Items";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Senate - Active Proposals",
  icons: "/assets/Senate_Logo/64/Black.svg",
};

const getSubscribedDAOs = async () => {
  const session = await getServerSession(authOptions());
  const userAddress = session?.user?.name ?? "";
  try {
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
  } catch (e) {
    const daosList = await prisma.dao.findMany({
      where: {},
      orderBy: {
        name: "asc",
      },
    });
    return daosList;
  }
};

const getProxies = async () => {
  const session = await getServerSession(authOptions());
  const userAddress = session?.user?.name ?? "";
  try {
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
  } catch (e) {
    return [];
  }
};

// eslint-disable-next-line @typescript-eslint/require-await
async function fetchItems(
  from: string,
  end: number,
  voted: string,
  proxy: string,
  page = 0
) {
  "use server";

  const active = true;

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

  let voteStatusQuery;
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

  const userProposals = await prisma.proposal.findMany({
    where: {
      AND: [
        {
          dao: {
            name:
              from == "any"
                ? {
                    in: user?.subscriptions.map((sub) => sub.dao.name),
                  }
                : {
                    equals: String(dao?.name),
                  },
          },
        },
        {
          timeend: Boolean(active)
            ? {
                lte: new Date(Date.now() + Number(end * 24 * 60 * 60 * 1000)),
              }
            : {
                gte: new Date(Date.now() - Number(end * 24 * 60 * 60 * 1000)),
              },
        },
        {
          state: Boolean(active)
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
      timeend: Boolean(active) ? "asc" : "desc",
    },
    include: {
      dao: true,
      daohandler: true,
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
    skip: page,
    take: 1,
  });

  const result =
    // eslint-disable-next-line @typescript-eslint/require-await
    userProposals.map(async (proposal) => {
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
        timeEnd: proposal.timeend,
        voted: user
          ? String(proposal.votes.map((vote: Vote) => vote.choice).length > 0)
          : "not-connected",
      };
    }) ?? [];

  return Promise.all(result);
}

export default async function Home({
  searchParams,
}: {
  searchParams?: { from: string; end: number; voted: string; proxy: string };
}) {
  const subscribedDAOs = await getSubscribedDAOs();
  const proxies = await getProxies();

  const subscripions = subscribedDAOs.map((subDAO) => {
    return { id: subDAO.id, name: subDAO.name };
  });

  return (
    <div className="relative min-h-screen">
      <Suspense>
        <Filters subscriptions={subscripions} proxies={proxies} />
      </Suspense>

      <Suspense>
        <Items fetchItems={fetchItems} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
