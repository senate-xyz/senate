import { Dao, Subscription, User } from "@prisma/client";
import { BigNumber, ethers } from "ethers";
import { DaoOnChainHandler } from "@senate/common-types";
import { hexZeroPad } from "ethers/lib/utils";
import { prisma } from "@senate/database";

const prisma = new PrismaClient();

const provider = new ethers.providers.JsonRpcProvider({
  url: String(process.env.PROVIDER_URL),
});

export const getChainVotes = async () => {
  let subscriptions = await prisma.subscription.findMany({
    where: {
      Dao: {
        is: {
          address: {
            not: "",
          },
        },
      },
    },
  });
  await findVotes(subscriptions);
};

const findVotes = async (subs: Subscription[]) => {
  await Promise.all(
    subs.map(async (sub) => {
      await updateSingleSub(sub);
    })
  );
};

type Vote = {
  voterAddress: string;
  proposalOnChainId: number;
  support: number;
  txHash: string;
};

const updateSingleSub = async (sub: Subscription) => {
  let user = await prisma.user.findFirst({
    where: {
      id: sub.userId,
    },
  });

  let dao = await prisma.dao.findFirst({
    where: {
      id: sub.daoId,
    },
  });

  if (user == null || dao == null) return;

  let votes = await getVotes(dao, user);

  let proposals = await prisma.proposal.findMany({
    where: { daoId: dao.id },
  });

  if (votes) {
    for (const vote of votes) {
      prisma.userVote.upsert({
        where: {
          txHash: vote.txHash,
        },
        update: {
          voteOption: vote.support,
          voteName: vote.support ? "Yes" : "No",
        },
        create: {
          txHash: vote.txHash,
          user: {
            connect: {
              id: user?.id,
            },
          },
          proposal: {
            connect: {
              id: proposals.find(
                (proposal) => proposal.onchainId == vote.proposalOnChainId
              )?.id,
            },
          },
          voteOption: vote.support,
          voteName: vote.support ? "Yes" : "No",
        },
      });
    }

    console.log(`upserted ${votes.length} chain votes`);
  }
};

const getVotes = async (dao: Dao, user: User): Promise<Vote[]> => {
  const govBravoIface = new ethers.utils.Interface(dao.abi);

  if (
    dao.onchainHandler != DaoOnChainHandler.Bravo1 &&
    dao.onchainHandler != DaoOnChainHandler.Bravo2
  )
    return [];

  let logs: any[] = [];
  switch (dao.onchainHandler) {
    case DaoOnChainHandler.Bravo1:
      logs = await provider.getLogs({
        fromBlock: 0,
        address: dao.address,
        topics: [
          govBravoIface.getEventTopic("VoteEmitted"),
          null,
          hexZeroPad(user.address, 32),
        ],
      });
      break;
    case DaoOnChainHandler.Bravo2:
      logs = await provider.getLogs({
        fromBlock: 0,
        address: dao.address,
        topics: [
          govBravoIface.getEventTopic("VoteCast"),
          hexZeroPad(user.address, 32),
        ],
      });
      break;
  }

  const votes = logs.map((log) => {
    let eventData = govBravoIface.parseLog({
      topics: log.topics,
      data: log.data,
    }).args;

    return {
      voterAddress: eventData.voter,
      proposalOnChainId: BigNumber.from(eventData.proposalId).toNumber(),
      support: Number(eventData.support),
      txHash: log.transactionHash,
    };
  });

  return votes;
};
