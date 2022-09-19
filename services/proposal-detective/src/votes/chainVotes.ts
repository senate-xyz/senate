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

    if (user !== null && dao !== null) {
        let votes = await getVotes(dao, user);

        if (votes) {
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

            votes.forEach(async (vote) => {
                if (proposalsMap.has(vote.proposalOnChainId)) {
                    let proposalDbId = proposalsMap.get(vote.proposalOnChainId);

                    /// Sooo, this didn't work because proposalId and userId are not unique fields. I thought of fetching the UserVote first, then create or update new field
                    /// An alternative would be to use a composite key (userId + propsalId) as UserVote PK. Maybe the most sustainable option long term but not sure it's the easiest one since we need to deliver this thing today.

                    // prisma.userVote.upsert({
                    //     where: {
                    //         proposalId: proposalDbId,
                    //         userId: user?.id,
                    //     },
                    //     update: {
                    //         proposalId: proposalDbId,
                    //         userId: user?.id,
                    //         voteOption: vote.support
                    //     },
                    //     create: {
                    //         proposalId: Number(proposalDbId),
                    //         userId: user?.id,
                    //         voteOption: vote.support
                    //     }
                    // })

                    /// This also didn't work because data needs to be some twisted type.

                    // See if user vote already exists
                    // let existingUserVote = await prisma.userVote.findFirst({
                    //     where: {
                    //         proposalId: proposalDbId,
                    //         userId: user?.id,
                    //     }
                    // });

                    // If it does not exist -> add it to database
                    // if (existingUserVote === null) {
                    //     prisma.userVote.create({
                    //         data: {
                    //             proposalId: proposalDbId,
                    //             userId: user?.id,
                    //             voteOption: vote.support,
                    //             voteName: ""
                    //         }
                            
                    //     })
                    // } else {
                    //   If it exists, update it
                    //}

                    
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
            proposalOnChainId: eventData.proposalId,
            support: eventData.support,
        }
    })

    return votes;
  }