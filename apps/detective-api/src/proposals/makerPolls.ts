import { ethers } from "ethers";
import axios from "axios";

import { prisma } from "@senate/database";
import { DAOHandler } from "@senate/common-types";
import { DAOHandlerType, ProposalType } from "@prisma/client";

const provider = new ethers.providers.JsonRpcProvider({
  url: String(process.env.PROVIDER_URL),
});

export const updateMakerPolls = async (daoHandler: DAOHandler) => {
  const pollingContractIface = new ethers.utils.Interface(daoHandler.decoder['abi']);

  const logs = await provider.getLogs({
    fromBlock: daoHandler.decoder['latestProposalBlock'],
    address: daoHandler.decoder['address'],
    topics: [pollingContractIface.getEventTopic("PollCreated")],
  });

  const proposals = logs.map((log) => ({
    txBlock: log.blockNumber,
    txHash: log.transactionHash,
    eventData: pollingContractIface.parseLog({
      topics: log.topics,
      data: log.data,
    }).args,
  }));

  console.log(proposals);

  for (let i = 0; i < proposals.length; i++) {
    let proposalCreatedTimestamp = Number(proposals[i].eventData.blockCreated);

    let votingStartsTimestamp = Number(proposals[i].eventData.startDate);
    let votingEndsTimestamp = Number(proposals[i].eventData.endDate);
    let { title, description } = await getProposalTitleAndDescription(
      proposals[i].eventData.url
    );
    let proposalUrl =
    daoHandler.decoder['proposalUrl'] + proposals[i].eventData.multiHash.substring(0, 7);
    let proposalOnChainId = Number(proposals[i].eventData.pollId).toString();

    // Update latest block
    let decoder = daoHandler.decoder;
    decoder['latestProposalBlock'] = proposals[i].txBlock + 1;
    await prisma.dAOHandler.update({
      where: {
        id: daoHandler.id,
      },
      data: {
        decoder: decoder,
      },
    });

    let proposal = await prisma.proposal.upsert({
        where: {
            externalId_daoId: {
                daoId: daoHandler.daoId,
                externalId: proposalOnChainId,
            },
      },
      update: {},
      create: {
        externalId: proposalOnChainId,
        name: String(title),
        description: "",
        daoId: daoHandler.daoId,
        daoHandlerId: daoHandler.id,
        proposalType: ProposalType.MAKER_POLL,
        data: {
            timeEnd: votingEndsTimestamp * 1000,
            timeStart: votingStartsTimestamp * 1000,
            timeCreated: proposalCreatedTimestamp * 1000,
        },
        url: proposalUrl,
      },
    });

    console.log(proposal);
  }

  console.log("\n\n");
  console.log(`inserted ${proposals.length} chain proposals`);
  console.log("======================================================\n\n");
};

const formatTitle = (text: String): String => {
  let temp = text.split("summary:")[0].split("title: ")[1];

  return temp;
};

// Some DAOs store onchain the proposal title and full description in the same variable.
// This function parses that entire text and returns the title and the description
const formatDescription = (text: String) => {
  return text;
};

const getProposalTitleAndDescription = async (url: string): Promise<any> => {
  let title, description;
  try {
    const response = await axios.get(url);
    title = formatTitle(response.data);
    description = formatDescription(response.data.description);
  } catch (error) {
    title = "Unknown";
    description = "Unknown";
  }

  return {
    title: title,
    description: description,
  };
};

