import { ethers } from "ethers";
import axios from "axios";

import { prisma } from "@senate/database";
import { DAOHandler } from "@senate/common-types";
import { DAOHandlerType, ProposalType } from "@prisma/client";

const provider = new ethers.providers.JsonRpcProvider({
  url: String(process.env.PROVIDER_URL),
});

export const updateGovernorBravoProposals = async (daoHandler: DAOHandler) => {
  
  const govBravoIface = new ethers.utils.Interface(daoHandler.decoder['abi']);

  const logs = await provider.getLogs({
    fromBlock: daoHandler.decoder['latestProposalBlock'],
    address: daoHandler.decoder['address'],
    topics: [govBravoIface.getEventTopic("ProposalCreated")],
  });

  const proposals = logs.map((log) => ({
    txBlock: log.blockNumber,
    txHash: log.transactionHash,
    eventData: govBravoIface.parseLog({
      topics: log.topics,
      data: log.data,
    }).args,
  }));

//   const latestBlockMined = await provider.getBlockNumber();
//   const ongoingProposals = proposals.filter(
//     (proposal) => proposal.eventData.endBlock > latestBlockMined
//   );

  for (let i = 0; i < proposals.length; i++) {
    let proposalCreatedTimestamp = (
      await provider.getBlock(proposals[i].txBlock)
    ).timestamp;

    let votingStartsTimestamp =
      proposalCreatedTimestamp +
      (proposals[i].eventData.startBlock - proposals[i].txBlock) * 12;
    let votingEndsTimestamp =
      proposalCreatedTimestamp +
      (proposals[i].eventData.endBlock - proposals[i].txBlock) * 12;
    let { title, description } = await getProposalTitleAndDescription(
        daoHandler.decoder['address'],
      proposals[i].eventData.ipfsHash
        ? proposals[i].eventData.ipfsHash
        : proposals[i].eventData.description
    );
    let proposalUrl = daoHandler.decoder['proposalUrl'] + proposals[i].eventData.id;
    let proposalOnChainId = Number(proposals[i].eventData.id).toString();

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

    // TODO create only if the record doesn't exist
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
        proposalType: ProposalType.MAKER_EXECUTIVE,
        data: {
            timeEnd: votingEndsTimestamp * 1000,
            timeStart: votingStartsTimestamp * 1000,
            timeCreated: proposalCreatedTimestamp * 1000,
        },
        url: proposalUrl,
      },
    });
  }

  console.log("\n\n");
  console.log(`inserted ${proposals.length} chain proposals`);
  console.log("======================================================\n\n");
}

const fetchProposalInfoFromIPFS = async (
  hexHash: string
): Promise<{ title: string; description: string }> => {
  let title, description;
  try {
    const response = await axios.get(
      "https://gateway.pinata.cloud/ipfs/f01701220" + hexHash.substring(2)
    );
    title = response.data.title;
    description = response.data.description;
  } catch (error) {
    title = "Unknown";
    description = "Unknown";
  }

  return {
    title: title,
    description: description,
  };
};

const formatTitle = (text: String): String => {
  let temp = text.split("\n")[0];

  if (!temp) {
    console.log(text);
    return "Title unavailable";
  }

  if (temp[0] === "#") {
    return temp.substring(2);
  }

  return temp;
};

// Some DAOs store onchain the proposal title and full description in the same variable.
// This function parses that entire text and returns the title and the description
const parseDescription = async (text: String) => {
  return {
    title: formatTitle(text),
    description: text
      ? text.split("\n").slice(1).join("\n")
      : "Description unavailable",
  };
};

const getProposalTitleAndDescription = async (
  daoAddress: string,
  text: string
): Promise<any> => {
  if (daoAddress === "0xEC568fffba86c094cf06b22134B23074DFE2252c") {
    // Aave
    return await fetchProposalInfoFromIPFS(text);
  } else {
    return parseDescription(text);
  }
};

