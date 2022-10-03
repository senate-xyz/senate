import dotenv from "dotenv";
import { PrismaClient, Dao, Subscription, User } from "@prisma/client";
import { BigNumber, ethers } from "ethers";
import { DaoOnChainHandler } from "../../../../types";
import { hexZeroPad } from "ethers/lib/utils";

dotenv.config();

const prisma = new PrismaClient();

const provider = new ethers.providers.JsonRpcProvider({
  url: String(process.env.PROVIDER_URL),
});

export const getMakerVotes = async () => {
  let subscriptions = await prisma.subscription.findMany({
    where: {
      Dao: {
        is: {
          name: "MakerDAO",
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
      id: sub.daoId,
    },
  });

  if (user == null || dao == null) return;

  let votedSpells = await getVotes(dao, user);

  let proposals = await prisma.proposal.findMany({
    where: { daoId: dao.id },
  });

  if (votedSpells) {
    for (const votedSpellAddress of votedSpells)
      prisma.userVote.upsert({
        where: {
          spellAddress: votedSpellAddress,
        },
        update: {
          spellAddress: votedSpellAddress,
          user: {
            connect: {
              id: user?.id,
            },
          },
          proposal: {
            connect: {
              id: proposals.find(
                (proposal) => proposal.spellAddress === votedSpellAddress
              )?.id,
            },
          },
          voteOption: 1,
          voteName: "Yes",
        },
        create: {
          spellAddress: votedSpellAddress,
          user: {
            connect: {
              id: user?.id,
            },
          },
          proposal: {
            connect: {
              id: proposals.find(
                (proposal) => proposal.spellAddress == votedSpellAddress
              )?.id,
            },
          },
          voteOption: 1,
          voteName: "Yes",
        },
      });

    console.log(`upserted ${votedSpells.length} chain votes`);
  }
};

const getVotes = async (dao: Dao, user: User): Promise<string[]> => {
  const iface = new ethers.utils.Interface(dao.abi);
  const chiefContract = new ethers.Contract(dao.address, dao.abi, provider);

  if (dao.onchainHandler != DaoOnChainHandler.Maker) return [];

  const voteMultipleActionsTopic =
    "0xed08132900000000000000000000000000000000000000000000000000000000";
  const voteSingleActionTopic =
    "0xa69beaba00000000000000000000000000000000000000000000000000000000";
  const voterAddressTopic = "0x" + "0".repeat(24) + user.address.substring(2);

  const logs = await provider.getLogs({
    fromBlock: 11327777, //always look at all blocks
    address: dao.address,
    topics: [
      [voteMultipleActionsTopic, voteSingleActionTopic],
      voterAddressTopic,
    ],
  });

  const spellAddressesSet = new Set<string>();
  for (let i = 0; i < logs.length; i++) {
    let log = logs[i];
    let eventArgs = iface.decodeEventLog("LogNote", log.data);

    let decodedFunctionData =
      log.topics[0] === voteSingleActionTopic
        ? iface.decodeFunctionData("vote(bytes32)", eventArgs.fax)
        : iface.decodeFunctionData("vote(address[])", eventArgs.fax);

    let spells: string[] =
      decodedFunctionData.yays !== undefined
        ? decodedFunctionData.yays
        : await getSlateYays(chiefContract, decodedFunctionData.slate);

    spells.forEach((spell) => {
      spellAddressesSet.add(spell);
    });
  }

  return Array.from(spellAddressesSet);
};

const getSlateYays = async (chiefContract: ethers.Contract, slate: string) => {
  let yays = [];
  let count = 0;

  while (true) {
    let spellAddress;
    try {
      spellAddress = await chiefContract.slates(slate, count);
      yays.push(spellAddress);
      count++;
    } catch (err) {
      break;
    }
  }

  return yays;
};
