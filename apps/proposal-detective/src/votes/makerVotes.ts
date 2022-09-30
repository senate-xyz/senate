import dotenv from "dotenv";
import { Dao, Subscription, User } from "@prisma/client";
import { ethers } from "ethers";
import { DaoOnChainHandler } from "common-types";
import { prisma } from "database";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider({
  url: String(process.env.PROVIDER_URL),
});

export const getMakerVotes = async () => {
  const subscriptions = await prisma.subscription.findMany({
    where: {
      Dao: {
        is: {
          address: "0x0a3f6849f78076aefaDf113F5BED87720274dDC0",
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
  const user = await prisma.user.findFirst({
    where: {
      id: sub.userId,
    },
  });

  const dao = await prisma.dao.findFirst({
    where: {
      id: sub.daoId,
    },
  });

  if (user == null || dao == null) return;

  const votedSpells = await getVotes(dao, user);

  const proposals = await prisma.proposal.findMany({
    where: { daoId: dao.id },
  });

  if (votedSpells) {
    await prisma.$transaction(
      votedSpells.map((votedSpellAddress: string) =>
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
        })
      )
    );
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
    const log = logs[i];
    const eventArgs = iface.decodeEventLog("LogNote", log.data);

    const decodedFunctionData =
      log.topics[0] === voteSingleActionTopic
        ? iface.decodeFunctionData("vote(bytes32)", eventArgs.fax)
        : iface.decodeFunctionData("vote(address[])", eventArgs.fax);

    const spells: string[] =
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
  const yays = [];
  let count = 0;

  // eslint-disable-next-line no-constant-condition
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
