import {prisma} from "@senate/database";
import fetch from "node-fetch";

async function main() {
    let subscriptions = await prisma.subscription.findMany();

    for (let i=0; i<subscriptions.length; i++) {

        let user = await prisma.user.findFirst({
            where: {
              id: subscriptions[i].userId,
            },
          });
        
        let dao = await prisma.dAO.findFirst({
          where: {
            id: subscriptions[i].daoId,
          },
        });

        const options = {
            method: 'POST',
            body: ''
        };

        console.log(`Updating subscription ${i} \n ${dao.name} - ${user.address} \n\n`);

        console.log(`Updating proposals for ${dao.name}`)
        let response = await fetch( `http://localhost:3100/api/updateProposals?daoId=${dao.id}`, options )
        console.log(await response.text());
        
        console.log(`Updating votes for user ${user.address}`)
        response = await fetch( `http://localhost:3100/api/updateVotes?daoId=${dao.id}&userId=${user.id}`, options );
        console.log(await response.text());
            
    }
}

await main();