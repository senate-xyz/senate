import dotenv from "dotenv";
import { PrismaClient, Dao } from "@prisma/client";
import { ethers } from "ethers";
import axios from "axios";
import { ProposalTypeEnum } from "./../../../../types";

dotenv.config();

const prisma = new PrismaClient();

const provider = new ethers.providers.JsonRpcProvider({
  url: String(process.env.PROVIDER_URL),
});

export const getMakerProposalsWithTheGraph = async () => {
  let maker = await prisma.dao.findFirst({
    where: {
      address: "0x0a3f6849f78076aefaDf113F5BED87720274dDC0",
    },
  });

  if (maker !== null) {
    await findMakerProposals(maker);
  }
};

const getSpellAddresses = async () => {
    try {

    const response = await axios.post(
        `https://gateway.thegraph.com/api/${process.env.THEGRAPH_APIKEY}/subgraphs/id/EiRmckRKCFMN3hmych8LsefFvGei2ucF86Ka84HX1Jy6`,
        {
            query: `{
                spells {
                    id
                    casted
                }
            }`,
            
        }, 
        {
            headers: {
            'Content-Type': 'application/json'
            }
        }
    );

    console.log(response.data.data.spells);

    } catch (error) {
        console.log(error);

    }
    
}

const findMakerProposals = async (dao: Dao) => {

  getSpellAddresses()
//   let spellAddresses = await getSpellAddresses();

//   for (let i = 0; i < spellAddresses.length; i++) {
//     console.log(`inserted ${spellAddresses[i]} spell address`);
//     try {
//       const response = await axios.get(
//         "https://vote.makerdao.com/api/executive/" + spellAddresses[i]
//       );

//       await prisma.proposal.upsert({
//         where: {
//           spellAddress: spellAddresses[i],
//         },
//         update: {
//           spellAddress: spellAddresses[i],
//           daoId: dao.id,
//           title: response.data.title,
//           type: ProposalTypeEnum.Chain,
//           description: response.data.content,
//           created: new Date(response.data.date),
//           voteStarts: new Date(response.data.date),
//           voteEnds: new Date(
//             calculateVotingPeriodEndDate(response.data.spellData)
//           ),
//           url: dao.proposalUrl + response.data.key,
//         },
//         create: {
//           spellAddress: spellAddresses[i],
//           daoId: dao.id,
//           title: response.data.title,
//           type: ProposalTypeEnum.Chain,
//           description: response.data.content,
//           created: new Date(response.data.date),
//           voteStarts: new Date(response.data.date),
//           voteEnds: new Date(
//             calculateVotingPeriodEndDate(response.data.spellData)
//           ),
//           url: dao.proposalUrl + response.data.key,
//         },
//       });
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   let latestBlock = await provider.getBlockNumber();

//   await prisma.dao.update({
//     where: {
//       id: dao?.id,
//     },
//     data: {
//       latestBlock: latestBlock - 100,
//     },
//   });

//   console.log("\n\n");
//   console.log(`inserted ${spellAddresses.length} chain proposals`);
//   console.log("======================================================\n\n");
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
