import { ethers } from "ethers";
import axios from "axios";

import { prisma } from "@senate/database";
import { DAOHandler } from "@senate/common-types";
import { DAOHandlerType, ProposalType } from "@prisma/client";

const provider = new ethers.providers.JsonRpcProvider({
  url: String(process.env.PROVIDER_URL),
});

export const updateMakerProposals = async (daoHandler: DAOHandler) => {

  console.log(`Searching executive proposals from block ${daoHandler.decoder['latestProposalBlock']} ...`)
  
  const iface = new ethers.utils.Interface(daoHandler.decoder['abi']);
  const chiefContract = new ethers.Contract(daoHandler.decoder['address'], daoHandler.decoder['abi'], provider);

  const voteMultipleActionsTopic =
    "0xed08132900000000000000000000000000000000000000000000000000000000";
  const voteSingleActionTopic =
    "0xa69beaba00000000000000000000000000000000000000000000000000000000";

  const logs = await provider.getLogs({
    fromBlock: daoHandler.decoder['latestProposalBlock'],
    address: daoHandler.decoder['address'],
    topics: [[voteMultipleActionsTopic, voteSingleActionTopic]],
  });

  const spellAddressesSet = new Set<string>();
  for (let i = 0; i < logs.length; i++) {
    console.log(`maker event ${i} out of ${logs.length}`);

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

  let spellAddresses = Array.from(spellAddressesSet);

  for (let i = 0; i < spellAddresses.length; i++) {
    console.log(`inserted ${spellAddresses[i]} spell address`);
    try {
      const response = await axios.get(
        "https://vote.makerdao.com/api/executive/" + spellAddresses[i]
      );

      if (!response.data) {
        console.log(`Maker API did not return any data for spell ${spellAddresses[i]}`)
        continue;
      }

      // if this didn't go through -> do not add proposal to db

      await prisma.proposal.upsert({
        where: {
            externalId_daoId: {
                daoId: daoHandler.daoId,
                externalId: spellAddresses[i],
            },
        },
        update: {},
        create: {
          externalId: spellAddresses[i],
          name: response.data.title,
          description: "" /*response.data.content*/,
          daoId: daoHandler.daoId,
          daoHandlerId: daoHandler.id,
          proposalType: ProposalType.MAKER_EXECUTIVE,
          data: {
            timeEnd: calculateVotingPeriodEndDate(response.data.spellData),
            timeStart: response.data.date,
            timeCreated: response.data.date,
          },
          url: daoHandler.decoder['proposalUrl'] + spellAddresses[i],
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  let latestBlock = await provider.getBlockNumber();
  let decoder = daoHandler.decoder;
    decoder['latestProposalBlock'] = latestBlock - 50;

  await prisma.dAOHandler.update({
    where: {
      id: daoHandler.id,
    },
    data: {
      decoder: decoder,
    },
  });

  console.log("\n\n");
  console.log(`inserted ${spellAddresses.length} maker executive proposals`);
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
