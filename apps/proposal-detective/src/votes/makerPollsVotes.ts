import { Dao, Subscription, User } from "@prisma/client";
import { BigNumber, ethers } from "ethers";
import { DaoOnChainHandler } from "@senate/common-types";
import { hexZeroPad } from "ethers/lib/utils";
import { prisma } from "@senate/database";

const provider = new ethers.providers.JsonRpcProvider({
  url: String(process.env.PROVIDER_URL),
});

export const getMakerPollsVotes = async () => {
  let subscriptions = await prisma.subscription.findMany({
    where: {
      Dao: {
        is: {
          name: "MakerDAO Polls",
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

const updateSingleSub = async (sub: Subscription) => {
  let user = await prisma.user.findFirst({
    where: {
      id: sub.userId,
    },
  });

  let dao = await prisma.dao.findFirst({
    where: {
      // Address of contract emitting PollCreated events (same the one added as DAO)
      address: "0xf9be8f0945acddeedaa64dfca5fe9629d0cf8e5d",
    },
  });

  if (user == null || dao == null) return;

  let votes = await getVotes(user);

  // Get proposals from pollCreated contract
  let proposals = await prisma.proposal.findMany({
    where: { daoId: dao.id },
  });

  if (votes) {
    for (const vote of votes) {
      try {
        const userVote = await prisma.userVote.upsert({
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

        console.log(userVote);
      } catch (e) {
        console.log(e);
      }
    }

    console.log(`upserted ${votes.length} chain votes`);
  }
};

const getVotes = async (user: User): Promise<any> => {
  const iface = new ethers.utils.Interface(JSON.parse(PollingVotes.abi));

  const logs = await provider.getLogs({
    fromBlock: 13618343,
    address: PollingVotesAddress,
    topics: [iface.getEventTopic("Voted"), hexZeroPad(user.address, 32)],
  });

  //console.log(logs)

  const votes = logs.map((log) => {
    let eventData = iface.parseLog({
      topics: log.topics,
      data: log.data,
    }).args;

    return {
      voterAddress: eventData.voter,
      proposalOnChainId: BigNumber.from(eventData.pollId).toNumber(),
      support: BigNumber.from(eventData.optionId).toNumber(),
      txHash: log.transactionHash,
    };
  });

  return votes;
};

const PollingVotes = {
  abi: '[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"creator","type":"address"},{"indexed":false,"internalType":"uint256","name":"blockCreated","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"pollId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"startDate","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"endDate","type":"uint256"},{"indexed":false,"internalType":"string","name":"multiHash","type":"string"},{"indexed":false,"internalType":"string","name":"url","type":"string"}],"name":"PollCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"creator","type":"address"},{"indexed":false,"internalType":"uint256","name":"blockWithdrawn","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"pollId","type":"uint256"}],"name":"PollWithdrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"voter","type":"address"},{"indexed":true,"internalType":"uint256","name":"pollId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"optionId","type":"uint256"}],"name":"Voted","type":"event"},{"inputs":[{"internalType":"uint256","name":"startDate","type":"uint256"},{"internalType":"uint256","name":"endDate","type":"uint256"},{"internalType":"string","name":"multiHash","type":"string"},{"internalType":"string","name":"url","type":"string"}],"name":"createPoll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"npoll","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"pollIds","type":"uint256[]"},{"internalType":"uint256[]","name":"optionIds","type":"uint256[]"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"pollId","type":"uint256"},{"internalType":"uint256","name":"optionId","type":"uint256"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"pollId","type":"uint256"}],"name":"withdrawPoll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"pollIds","type":"uint256[]"}],"name":"withdrawPoll","outputs":[],"stateMutability":"nonpayable","type":"function"}]',
};
const PollingVotesAddress = "0xD3A9FE267852281a1e6307a1C37CDfD76d39b133";
