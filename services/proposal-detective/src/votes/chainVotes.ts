import dotenv from "dotenv";
import { PrismaClient, Dao, Subscription, User, Vote} from "@prisma/client";
import { ethers } from "ethers";
import axios from "axios";
import { ProposalTypeEnum } from "../../../../types";

dotenv.config();

const prisma = new PrismaClient();

const provider = new ethers.providers.JsonRpcProvider({
  url: String(process.env.PROVIDER_URL),
});


export const getChainVotes = async () => {
    let subscriptions = await prisma.subscription.findMany();
    await findVotes(subscriptions);
}

const findVotes = async (subs: Subscription[]) => {
    await Promise.all(
      subs.map(async (sub) => {
        await updateSingleSub(sub);
      })
    );
  };

  const updateSingleSub = async (sub: Subscription) => {
    let user = await prisma.user.findFirst({
        where: {
          id: sub.userId,
        },
      });
    
    let dao = await prisma.dao.findFirst({
    where: {
        id: sub.daoId,
    },
    });

    if (user && dao) {
        let votes = await getVotes(dao, user);

        if (votes) {
            // get active proposals for DAO
            // build proposals map
            let proposals = await prisma.proposal.findMany({
                where: {
                    type: {
                        equals: ProposalTypeEnum.Chain
                    },
                    daoId: {
                        equals: dao.id,
                    }
                },
            })

            let proposalsMap = new Map(
                proposals.map(proposal => [proposal.onchainId, proposal.id])
            )

            votes.forEach(vote => {
                if (proposalsMap.has(vote.proposalId)) {
                    let proposalDbId = proposalsMap.get(vote.proposalId);

                    prisma.userVote.upsert({
                        where: {
                            proposalId: proposalDbId,
                            userId: user.id,
                        },
                        update: {
                            proposalId: proposalDbId,
                            userId: user.id,
                            voteOption: vote.support
                        },
                        create: {
                            proposalId: proposalDbId,
                            userId: user.id,
                            voteOption: vote.support
                        }
                    })
                }
            })
        }
    }
      
  }

  const getVotes = async (dao: Dao, user: User) : Promise<Vote[]> => {
    const govBravoIface = new ethers.utils.Interface(dao.abi);

    const logs = await provider.getLogs({
        fromBlock: 0,
        address: dao.address,
        topics: [govBravoIface.getEventTopic("VoteCast"), user.address],
    });
   
    const votes = logs.map((log) => {
        let eventData = govBravoIface.parseLog({
            topics: log.topics,
            data: log.data
        }).args

        return {
            voterAddress: eventData.address,
            proposalId: eventData.proposalId,
            support: eventData.support,
        }
    })

    return votes;
  }