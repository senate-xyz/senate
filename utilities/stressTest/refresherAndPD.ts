import { prisma, User } from "@senate/database";
import axios from "axios";
import promptSync from "prompt-sync";

const prompt = promptSync({ sigint: true });

const SNAPSHOT_SPACES = ["opcollective.eth", "ens.eth", "balancer.eth"];

async function main() {
  console.log("🚀 Let's gooooo...");

  const user: User = await bootstrapStressTestUserWithSubscriptions();
  const snapshotVoters: Array<string> =
    await buildSnapshotVoterAddressesDataSet(SNAPSHOT_SPACES);
  console.log("📃 Snapshot voters dataset size:", snapshotVoters.length);

  let index = 0;
  while (true) {
    console.log("\n");
    const answer = prompt("❓ How many voters to add to the database? ");

    const count = parseInt(answer);
    if (isNaN(count)) {
      console.log("❌ Invalid input. Please enter a number");
      continue;
    }

    const limit =
      index + count > snapshotVoters.length
        ? snapshotVoters.length
        : index + count;
    const voters = snapshotVoters.slice(index, index + count);

    await linkVotersToUser(user, voters);
    console.log(`✨ Processed voters from index ${index} to ${limit}`);

    index += count;

    if (limit == snapshotVoters.length) {
      console.log("✨ Processed all voters. Bye now!");
      break;
    }
  }
}

async function linkVotersToUser(user: User, voters: Array<string>) {
  await prisma.$transaction(
    voters.map((voter) => {
      return prisma.user.update({
        where: { name: user.name },
        data: {
          voters: {
            connectOrCreate: {
              where: { address: voter },
              create: { address: voter },
            },
          },
        },
      });
    }),
    {
      isolationLevel: "ReadCommitted",
    }
  );
}

async function buildSnapshotVoterAddressesDataSet(
  spaces: Array<string>
): Promise<Array<string>> {
  let voters: Array<string> = [];
  for (let space of spaces) voters.push(...(await getSnapshotVoters(space)));

  return voters;
}

async function getSnapshotVoters(space: string): Promise<Array<string>> {
  console.log("⚡ Fetching voters from space:", space);
  const graphqlQuery = `{votes(
        first:1000, 
        orderBy: "created", 
        orderDirection: desc, 
        where: {space: "${space}"}) 
        {
        voter
        }
    }`;

  let results: Array<string> = [];
  try {
    const res = await axios({
      url: "https://hub.snapshot.org/graphql",
      method: "get",
      data: {
        query: graphqlQuery,
      },
    });

    results = res.data.data.votes.map((vote: any) => vote.voter);
  } catch (err) {
    console.log(err);
  }

  return Array.from(new Set(results));
}

async function bootstrapStressTestUserWithSubscriptions(): Promise<User> {
  try {
    const stressTestUser: User = await createStressTestUser();
    const daos = await fetchDaos();

    await prisma.$transaction(
      daos.map((dao) => {
        return prisma.subscription.upsert({
          where: {
            userId_daoId: { userId: stressTestUser.id, daoId: dao.id },
          },
          create: {
            userId: stressTestUser.id,
            daoId: dao.id,
          },
          update: {},
        });
      })
    );

    return stressTestUser;
  } catch (error) {
    console.log("Failed bootstrapping stress test user with subscriptions");
    throw error;
  }
}

async function createStressTestUser(): Promise<User> {
  return await prisma.user.upsert({
    where: {
      name: "0xD8ECE0f01dC86DfBd55fB90EfaFAd1a2a254C965",
    },
    create: {
      name: "0xD8ECE0f01dC86DfBd55fB90EfaFAd1a2a254C965",
    },
    update: {},
  });
}

async function fetchDaos() {
  return await prisma.dAO.findMany();
}

main();
