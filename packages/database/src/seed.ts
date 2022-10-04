import aaveGovBravo from "./abis/aaveGovBravo.json";
import { prisma } from "./client";
import { DAOHandlerType } from "@prisma/client";

async function main() {
  const testUser = await prisma.user.upsert({
    where: {
      address: "0xCdB792c14391F7115Ba77A7Cd27f724fC9eA2091",
    },
    update: {},
    create: {
      address: "0xCdB792c14391F7115Ba77A7Cd27f724fC9eA2091",
    },
  });

  const aave = await prisma.dAO.upsert({
    where: { name: "Aave" },
    update: {},
    create: {
      name: "Aave",
      picture: "https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png",
      handlers: {
        create: [
          {
            type: DAOHandlerType.BRAVO1,
            decoder: {
              address: "0xEC568fffba86c094cf06b22134B23074DFE2252c",
              abi: aaveGovBravo.abi,
              latestBlock: 0,
            },
          },
          {
            type: DAOHandlerType.SNAPSHOT,
            decoder: {
              space: "aave.eth",
              proposalsCount: 0,
            },
          },
        ],
      },
    },
    include: {
      handlers: true,
    },
  });

  const testProposal = await prisma.proposal.upsert({
    where: {
      externalId: "1",
    },
    update: {},
    create: {
      externalId: "1",
      name: "Test name",
      description: "Test description",
      daoId: aave.id,
      daoHandlerId: aave.handlers[0].id,
    },
  });

  await prisma.vote.upsert({
    where: {
      userId_daoId_proposalId: {
        userId: testUser.id,
        daoId: aave.id,
        proposalId: testProposal.id,
      },
    },
    update: {},
    create: {
      userId: testUser.id,
      daoId: aave.id,
      proposalId: testProposal.id,
      daoHandlerId: aave.handlers[0].id,
      options: {
        create: {
          option: "1",
          optionName: "Yes",
        },
      },
    },
  });

  await prisma.subscription.upsert({
    where: {
      userId_daoId: {
        userId: testUser.id,
        daoId: aave.id,
      },
    },
    update: {},
    create: {
      userId: testUser.id,
      daoId: aave.id,
    },
  });
}

main();
