import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { ethers } from "ethers";
import axios from "axios";

dotenv.config();

const prisma = new PrismaClient();

const provider = new ethers.providers.JsonRpcProvider({
  url: String(process.env.PROVIDER_URL),
});

// const AaveGovIface = new ethers.utils.Interface(aaveGovV2.abi);
// const AaveGov = new ethers.Contract(
//   AAVE_GOV_V2_ADDRESS,
//   aaveGovV2.abi,
//   provider
// );

// const getAaveProposals = async () => {
//   const latestBlock = await provider.getBlockNumber();
//   const logs = await provider.getLogs({
//     fromBlock: 0,
//     address: AaveGov.address,
//     topics: [
//       AaveGovIface.getEventTopic("ProposalCreated")
//     ],
//   });

//   const proposals = logs.map(log => ({
//     txBlock: log.blockNumber,
//     eventData: AaveGovIface.parseLog({
//             topics: log.topics,
//             data: log.data
//           }).args
//     }))

//   const ongoingProposals = proposals.filter(proposal => proposal.eventData.endBlock > latestBlock);

//   for (let i=0; i<proposals.length; i++) {
//     let proposalCreatedTimestamp = (await provider.getBlock(proposals[i].txBlock)).timestamp;
//     let votingStartsTimestamp = proposalCreatedTimestamp + (proposals[i].eventData.startBlock - proposals[i].txBlock) * 15;
//     let votingEndsTimestamp = proposalCreatedTimestamp + (proposals[i].eventData.endBlock - proposals[i].txBlock) * 15;
//     let {title, description} = await fetchProposalInfoFromIPFS(proposals[i].eventData.ipfsHash);
//     let proposalUrl = "https://app.aave.com/governance/proposal/?proposalId=" + proposals[i].eventData.id;

//     let proposal = await prisma.proposal.upsert({
//       where: { id: 0 },
//       update: {},
//       create: {
//         daoId: 1,
//         title: title,
//         description: description,
//         created: new Date(proposalCreatedTimestamp * 1000),
//         voteStarts: new Date(votingStartsTimestamp * 1000),
//         voteEnds: new Date(votingEndsTimestamp * 1000),
//         url: proposalUrl

//       }

//     })

//     console.log(proposal);
//   }
// }

const fetchProposalInfoFromIPFS = async (hexHash: string) => {
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

// Some DAOs store onchain the proposal title and full description in the same variable.
// This function parses that entire text and returns the title and the description
const parseDescription = async (text: String) => {
  return {
    title: "Title",
    description: "Description",
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
const findGovernorBravoProposals = async (dao: any) => {
  const govBravoIface = new ethers.utils.Interface(dao.abi);

  const logs = await provider.getLogs({
    fromBlock: dao.latestBlock,
    address: dao.address,
    topics: [govBravoIface.getEventTopic("ProposalCreated")],
  });

  const proposals = logs.map((log) => ({
    txBlock: log.blockNumber,
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
      proposals[i].eventData[11]
    );
    let proposalUrl = dao.proposalUrl + proposals[i].eventData.id;

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
      where: { id: 0 },
      update: {},
      create: {
        daoId: dao.id,
        title: String(title),
        description: String(description),
        created: new Date(proposalCreatedTimestamp * 1000),
        voteStarts: new Date(votingStartsTimestamp * 1000),
        voteEnds: new Date(votingEndsTimestamp * 1000),
        url: proposalUrl,
      },
    });

    console.log(proposal);
  }
};

const findOngoingProposals = (daos: any) => {
  for (let i = 0; i < daos.length; i++) {
    findGovernorBravoProposals(daos[i]);
  }
};

async function main() {
  //await getAaveProposals();
  // while (true) {
  let daos = await prisma.dao.findMany();
  console.log(daos);
  findOngoingProposals(daos);
  // wait 15 minutes
  // }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
