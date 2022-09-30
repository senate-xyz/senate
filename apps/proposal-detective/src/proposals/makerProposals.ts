import { Dao } from "@prisma/client";
import { ethers } from "ethers";
import axios from "axios";
import { ProposalTypeEnum } from "@senate/common-types";
import { prisma } from "@senate/database";
import { config } from "dotenv";
config();

const provider = new ethers.providers.JsonRpcProvider({
  url: String(process.env.PROVIDER_URL),
});

export const getMakerProposals = async () => {
  const maker = await prisma.dao.findFirst({
    where: {
      address: "0x0a3f6849f78076aefaDf113F5BED87720274dDC0",
    },
  });

  if (maker !== null) {
    await findMakerProposals(maker);
  }
};

const findMakerProposals = async (dao: Dao) => {
  const iface = new ethers.utils.Interface(dao.abi);
  const chiefContract = new ethers.Contract(dao.address, dao.abi, provider);

  const voteMultipleActionsTopic =
    "0xed08132900000000000000000000000000000000000000000000000000000000";
  const voteSingleActionTopic =
    "0xa69beaba00000000000000000000000000000000000000000000000000000000";

  const logs = await provider.getLogs({
    fromBlock: dao.latestBlock,
    address: dao.address,
    topics: [[voteMultipleActionsTopic, voteSingleActionTopic]],
  });

  const spellAddressesSet = new Set<string>();
  for (let i = 0; i < logs.length; i++) {
    console.log(`maker event ${i} out of ${logs.length}`);

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

  const spellAddresses = Array.from(spellAddressesSet);

  for (let i = 0; i < spellAddresses.length; i++) {
    console.log(`inserted ${spellAddresses[i]} spell address`);
    try {
      const response = await axios.get(
        "https://vote.makerdao.com/api/executive/" + spellAddresses[i]
      );

      await prisma.proposal.upsert({
        where: {
          spellAddress: spellAddresses[i],
        },
        update: {
          spellAddress: spellAddresses[i],
          daoId: dao.id,
          title: response.data.title,
          type: ProposalTypeEnum.Chain,
          description: response.data.content,
          created: new Date(response.data.date),
          voteStarts: new Date(response.data.date),
          voteEnds: new Date(
            calculateVotingPeriodEndDate(response.data.spellData)
          ),
          url: dao.proposalUrl + response.data.key,
        },
        create: {
          spellAddress: spellAddresses[i],
          daoId: dao.id,
          title: response.data.title,
          type: ProposalTypeEnum.Chain,
          description: response.data.content,
          created: new Date(response.data.date),
          voteStarts: new Date(response.data.date),
          voteEnds: new Date(
            calculateVotingPeriodEndDate(response.data.spellData)
          ),
          url: dao.proposalUrl + response.data.key,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  const latestBlock = await provider.getBlockNumber();

  await prisma.dao.update({
    where: {
      id: dao?.id,
    },
    data: {
      latestBlock: latestBlock - 100,
    },
  });

  console.log("\n\n");
  console.log(`inserted ${spellAddresses.length} chain proposals`);
  console.log("======================================================\n\n");
};

const calculateVotingPeriodEndDate = (spellData: any) => {
  return spellData.hasBeenCast
    ? spellData.dateExecuted
    : spellData.hasBeenScheduled
    ? spellData.nextCastTime
    : spellData.expiration;
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
