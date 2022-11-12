// Importing required libraries
import { schedule } from "node-cron";
import express from "express";
import { prisma } from '@senate/database'
import { RoundupNotificationType } from "@prisma/client";
import { Proposal, Subscription, SubscriptionWithProxies, UserProxy} from "@senate/common-types";

const app = express(); // Initializing app

// Creating a cron job which runs on every 10 second
schedule("*/15 * * * * *", async function() {
	console.log("running a task every 15 second");
    
    await clearNotificationsTable();
    await addNewProposals();
    await addEndingProposals();

    let notifications = await prisma.notification.findMany();
    console.log(notifications);

    // For each user 
           // Get new notifications
           // Get ending soon notifications
           // Send email

});

let lastMonthProposals : Proposal[];

const clearNotificationsTable = async () => {
    console.log("Clearing notifications table...")
    await prisma.notification.deleteMany();
};

const addNewProposals = async () => {
    console.log("Adding new proposal notifications...");
    let oneMonth : number = 2592000000;
    let oneDay: number = 86400000;
    let fiveMinutes : number = 300000;
    let twoMinutes : number = 120000;
    let now: number = Date.now();

    lastMonthProposals = await prisma.proposal.findMany({
        where: {
            addedAt: {
                gte: now - oneMonth,
            }
        }
    })

    let proposals = lastMonthProposals.filter(proposal => 
        proposal.data?.['timeCreated'] >= now - fiveMinutes
    );

    if (proposals) {
        console.log(`Found ${proposals.length} new proposals`)
    } else {
        console.log(`Found 0 new proposals`)
    }

    for (let proposal of proposals) {
        let subscriptions: Subscription[] = await prisma.subscription.findMany({
            where: {
                daoId: proposal.daoId,
            }
        })

        await prisma.$transaction(
            subscriptions.map((subscription: Subscription) => {
                return prisma.notification.upsert({
                    where: {
                        proposalId_userId: {
                            proposalId: proposal.id,
                            userId: subscription.userId,
                        }
                    },
                    update: {},
                    create: {
                        userId: subscription.userId,
                        proposalId: proposal.id,
                        type: RoundupNotificationType.NEW,
                    }
                })
            })
        ).then(res => {
            if (res) console.log(`Inserted ${res.length} notifications`);
            else console.log('Inserted 0 notifications');

            return res;
        })
    }

    console.log("\n")

}

const addEndingProposals = async () => {
    console.log("Adding voting due proposal notifications...")
    let threeDays : number = 259200000
    let fiveMinutes : number = 300000  
    let twoMinutes : number = 180000;
    let now : number = Date.now();

    console.log("Last month proposals: ", lastMonthProposals.length);
    let proposals = lastMonthProposals.filter(proposal => 
        proposal.data?.['timeEnd'] <= now + threeDays && proposal.data?.['timeEnd'] > now
    );

    console.log("About to end proposals: ", proposals.length);

    if (proposals) {
        console.log(`Found ${proposals.length} ending soon proposals`)
    } else {
        console.log(`Found 0 ending soon proposals`)
    }

    for(let proposal of proposals) {

        let subscriptions : SubscriptionWithProxies[] = await prisma.subscription.findMany({
            where: {
                daoId: proposal.daoId,
            },
            include: {
                user: {
                    select: {
                        proxies: true
                    }
                }
            }
        })

        let promises = [];

        for(let subscription of subscriptions) {
            let userHasVoted = await userVoted(subscription.user.proxies, proposal.id, proposal.daoId);
            if (!userHasVoted) {
                console.log(`User ${subscription.userId} hasn't voted for ${proposal.name}`);
                promises.push(
                    prisma.notification.upsert({
                        where: {
                            proposalId_userId: {
                                proposalId: proposal.id,
                                userId: subscription.userId
                            }
                        },
                        update: {},
                        create: {
                            userId: subscription.userId,
                            proposalId: proposal.id,
                            type: RoundupNotificationType.ENDING_SOON
                        }
                    })
                );
            } else {
                console.log(`User ${subscription.userId} has already voted for ${proposal.name}`)
            }
        }

        await prisma.$transaction(promises)
    }

    console.log("\n")

}

const userVoted = async (proxies: UserProxy[], proposalId: string, daoId: string) => {
    let voted = false;
    for (let proxy of proxies) {
        let vote = await prisma.vote.findFirst({
            where: {
                voterAddress: proxy.address,
                daoId: daoId,
                proposalId: proposalId
            }
        })
        
        console.log(`Proxy address ${proxy.address} has vote ${vote} for proposal ${proposalId} in DAO ${daoId}`);
        
        if (vote) voted = true;
    }

    console.log("User has voted: ", voted);

    return voted;
}

app.listen(3200);
