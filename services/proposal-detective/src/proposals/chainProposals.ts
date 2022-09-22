import dotenv from "dotenv";
import { PrismaClient, Dao } from "@prisma/client";
import { ethers } from "ethers";
import axios from "axios";
import { DaoOnChainHandler, ProposalTypeEnum } from "./../../../../types";

dotenv.config();

const prisma = new PrismaClient();

const provider = new ethers.providers.JsonRpcProvider({
  url: String(process.env.PROVIDER_URL),
});

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

// TODO: Replace any with DAO type
const findGovernorBravoProposals = async (dao: Dao) => {
  const govBravoIface = new ethers.utils.Interface(dao.abi);

  const logs = await provider.getLogs({
    fromBlock: dao.latestBlock,
    address: dao.address,
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

  const latestBlockMined = await provider.getBlockNumber();
  const ongoingProposals = proposals.filter(
    (proposal) => proposal.eventData.endBlock > latestBlockMined
  );

  //TODO: Update dao.latestBlock to ongoingProposals[ongoingProposals.length-1].txBlock

  for (let i = 0; i < proposals.length; i++) {
    let proposalCreatedTimestamp = (
      await provider.getBlock(proposals[i].txBlock)
    ).timestamp;

    let votingStartsTimestamp =
      proposalCreatedTimestamp +
      (proposals[i].eventData.startBlock - proposals[i].txBlock) * 15;
    let votingEndsTimestamp =
      proposalCreatedTimestamp +
      (proposals[i].eventData.endBlock - proposals[i].txBlock) * 15;
    let { title, description } = await getProposalTitleAndDescription(
      dao.address,
      proposals[i].eventData.ipfsHash
        ? proposals[i].eventData.ipfsHash
        : proposals[i].eventData.description
    );
    let proposalUrl = dao.proposalUrl + proposals[i].eventData.id;

    let proposalHash = proposals[i].txHash;

    await prisma.dao.update({
      where: {
        id: dao.id,
      },
      data: {
        latestBlock: proposals[i].txBlock + 1,
      },
    });

    // TODO create only if the record doesn't exist
    let proposal = await prisma.proposal.upsert({
      where: { txHash: proposalHash },
      update: {
        txHash: proposalHash,
        daoId: dao.id,
        title: String(title),
        type: ProposalTypeEnum.Chain,
        onchainId: Number(proposals[i].eventData.id),
        description: String(description),
        created: new Date(proposalCreatedTimestamp * 1000),
        voteStarts: new Date(votingStartsTimestamp * 1000),
        voteEnds: new Date(votingEndsTimestamp * 1000),
        url: proposalUrl,
      },
      create: {
        txHash: proposalHash,
        daoId: dao.id,
        title: String(title),
        type: ProposalTypeEnum.Chain,
        onchainId: Number(proposals[i].eventData.id),
        description: String(description),
        created: new Date(proposalCreatedTimestamp * 1000),
        voteStarts: new Date(votingStartsTimestamp * 1000),
        voteEnds: new Date(votingEndsTimestamp * 1000),
        url: proposalUrl,
      },
    });

    console.log(proposal);
  }

  console.log("\n\n");
  console.log(`inserted ${proposals.length} chain proposals`);
  console.log("======================================================\n\n");
};

const findOngoingProposals = async (daos: Dao[]) => {
  for (let i = 0; i < daos.length; i++) {
    await findGovernorBravoProposals(daos[i]);
  }
};

export const getChainProposals = async () => {
  let daos = await prisma.dao.findMany({
    where: {
      AND: {
        address: {
          not: "",
        },
        onchainHandler: {
          in: [DaoOnChainHandler.Bravo1, DaoOnChainHandler.Bravo2],
        },
      },
    },
  });

  await findOngoingProposals(daos);
};
