import { Dao } from "@prisma/client";
import { ethers } from "ethers";
import axios from "axios";
import { DaoOnChainHandler, ProposalTypeEnum } from "@senate/common-types";
import { prisma } from "@senate/database";

const provider = new ethers.providers.JsonRpcProvider({
  url: String(process.env.PROVIDER_URL),
});

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

const findMakerPolls = async (dao: Dao) => {
  const pollingContractIface = new ethers.utils.Interface(dao.abi);

  //   const pollingContract = new ethers.Contract(dao.address, dao.abi, provider);
  //   console.log(await pollingContract.queryFilter("PollCreated", 13053839, 15653839));

  const logs = await provider.getLogs({
    fromBlock: dao.latestBlock,
    address: dao.address,
    topics: [pollingContractIface.getEventTopic("PollCreated")],
  });

  //console.log(logs)

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
      dao.proposalUrl + proposals[i].eventData.multiHash.substring(0, 7);
    let proposalHash = proposals[i].txHash;

    console.log(title);
    await prisma.dao.update({
      where: {
        id: dao.id,
      },
      data: {
        latestBlock: proposals[i].txBlock + 1,
      },
    });

    let proposal = await prisma.proposal.upsert({
      where: { txHash: proposalHash },
      update: {
        txHash: proposalHash,
        daoId: dao.id,
        title: String(title),
        type: ProposalTypeEnum.MakerPoll,
        onchainId: Number(proposals[i].eventData.pollId),
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
        type: ProposalTypeEnum.MakerPoll,
        onchainId: Number(proposals[i].eventData.pollId),
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

export const getMakerPolls = async () => {
  let makerPolls = await prisma.dao.findFirst({
    where: {
      name: "MakerDAO Polls",
    },
  });

  if (makerPolls !== null) {
    await findMakerPolls(makerPolls);
  }
};
