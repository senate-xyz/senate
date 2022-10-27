import { prisma } from "@senate/database";
import { BigNumber, ethers } from "ethers";
import { hexZeroPad } from "ethers/lib/utils";
import { Logger, InternalServerErrorException } from "@nestjs/common";
import { Proposal, DAOHandler, User } from "@senate/common-types"

const provider = new ethers.providers.JsonRpcProvider({
  url: String(process.env.PROVIDER_URL),
});

const logger = new Logger("MakerPollVotes");

export const updateMakerPollsVotes = async (daoHandler: DAOHandler, user: User, daoName: string) => {
    logger.log("Updating Maker Poll votes");
    let votes;  

    try {
      votes = await getVotes(daoHandler, user);
      if (!votes) return;
    
      for (const vote of votes) {
          let proposal : Proposal = await prisma.proposal.findFirst({
              where: {
                  externalId: vote.proposalOnChainId,
                  daoId: daoHandler.daoId,
                  daoHandlerId: daoHandler.id,
              },
          })

          if (!proposal) {
            logger.error(`Poll with externalId ${vote.proposalOnChainId} does not exist in DB for daoId: ${daoHandler.daoId} & daoHandlerId: ${daoHandler.id}`);
            continue;
          }

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
      }

    } catch (err) {
      logger.error("Error while updating maker executive proposals", err);
      throw new InternalServerErrorException();
    }

    console.log(`updated ${votes.length} maker poll votes`);
}

const getVotes = async (daoHandler: DAOHandler, user: User): Promise<any> => {
  const iface = new ethers.utils.Interface(JSON.parse(daoHandler.decoder["abi"]));

  const logs = await provider.getLogs({
    fromBlock: daoHandler.decoder['latestVoteBlock'],
    address: daoHandler.decoder['address'],
    topics: [iface.getEventTopic("Voted"), hexZeroPad(user.address, 32)],
  });

  const votes = logs.map((log) => {
    let eventData = iface.parseLog({
      topics: log.topics,
      data: log.data,
    }).args;

    return {
      proposalOnChainId: BigNumber.from(eventData.pollId).toString(),
      support: BigNumber.from(eventData.optionId).toString(),
    };
  });

  return votes;
};
