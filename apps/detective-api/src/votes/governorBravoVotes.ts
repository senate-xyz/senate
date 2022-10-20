import { BigNumber, ethers } from "ethers";

import { hexZeroPad } from "ethers/lib/utils";
import { prisma } from "@senate/database";
import { Proposal, DAOHandler, User } from "@senate/common-types"

const provider = new ethers.providers.JsonRpcProvider({
  url: String(process.env.PROVIDER_URL),
});

type Vote = {
    proposalOnChainId: string;
    support: string
};

export const updateGovernorBravoVotes = async (daoHandler: DAOHandler, user: User, daoName: string) => {
    if (user == null || daoHandler == null) return;

    let votes = await getVotes(daoHandler, user);
    if (!votes) return;
  
    for (const vote of votes) {
      let proposal : Proposal = await prisma.proposal.findFirst({
          where: {
              externalId: vote.proposalOnChainId,
              daoId: daoHandler.daoId,
              daoHandlerId: daoHandler.id,
          },
      })
  
      await prisma.vote.upsert({
          where: {
            userId_daoId_proposalId: {
              userId: user.id,
              daoId: daoHandler.daoId,
              proposalId: proposal.id
            }
          },
          update: {
            options: {
              update: {
                where: {
                  voteProposalId_option: {
                    voteProposalId: proposal.id,
                    option: vote.support,
                  }
                },
                data: {
                  option: vote.support,
                  optionName: vote.support ? "Yes" : "No"
                },
              } 
            }
          },
          create: {
            userId: user.id,
            daoId: daoHandler.daoId,
            proposalId: proposal.id,
            daoHandlerId: daoHandler.id,
            options: {
              create: {
                option: vote.support,
                optionName: vote.support ? "Yes" : "No",
              }
            }
          },
        });
  
      console.log(`upserted ${votes.length} chain votes for ${daoName}`);
    }
}

const getVotes = async (daoHandler: DAOHandler, user: User): Promise<Vote[]> => {
  const govBravoIface = new ethers.utils.Interface(daoHandler.decoder['abi']);

  if (daoHandler.type !== "BRAVO1" && daoHandler.type !== "BRAVO2")
    return [];

  let logs: any[] = [];
  switch (daoHandler.type) {
    case "BRAVO1":
      logs = await provider.getLogs({
        fromBlock: daoHandler.decoder["fromBlock"],
        address: daoHandler.decoder['address'],
        topics: [
          govBravoIface.getEventTopic("VoteEmitted"),
          null,
          hexZeroPad(user.address, 32),
        ],
      });
      break;
    case "BRAVO2":
      logs = await provider.getLogs({
        fromBlock: daoHandler.decoder["fromBlock"],
        address: daoHandler.decoder['address'],
        topics: [
          govBravoIface.getEventTopic("VoteCast"),
          hexZeroPad(user.address, 32),
        ],
      });
      break;
  }

  const votes = logs.map((log) => {
    let eventData = govBravoIface.parseLog({
      topics: log.topics,
      data: log.data,
    }).args;

    return {
      proposalOnChainId: BigNumber.from(eventData.proposalId).toString(),
      support: String(eventData.support),
    };
  });

  return votes;
}
