import aaveGovBravo from "./abis/aaveGovBravo.json";
import { prisma } from "./client";
import { DAOHandlerType, ProposalType } from "@prisma/client";

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

  await prisma.dAO.upsert({
    where: { name: "TestDAO" },
    update: {},
    create: {
      name: "TestDAO",
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

  const testDAO = await prisma.dAO.findFirst({
    where: {
      name: "TestDAO",
    },
    include: {
      handlers: true,
    },
  });

  const testProposal = await prisma.proposal.upsert({
    where: {
      externalId_daoId: {
        daoId: testDAO!.id,
        externalId: "1",
      },
    },
    update: {},
    create: {
      externalId: "1",
      name: "Test name",
      description: "Test description",
      daoId: testDAO!.id,
      daoHandlerId: testDAO!.handlers[0].id,
      proposalType: ProposalType.SNAPSHOT,
      data: {
        timeStart: 1664975385,
        timeEnd: 1665975385,
      },
    },
  });

  const testProposal2 = await prisma.proposal.upsert({
    where: {
      externalId_daoId: {
        daoId: testDAO!.id,
        externalId: "2",
      },
    },
    update: {},
    create: {
      externalId: "2",
      name: "Test name 2",
      description: "Test description 2",
      daoId: testDAO!.id,
      daoHandlerId: testDAO!.handlers[0].id,
      proposalType: ProposalType.BRAVO1,
      data: {
        timeStart: 1664975385,
        timeEnd: 1665975385,
      },
    },
  });

  await prisma.vote.upsert({
    where: {
      userId_daoId_proposalId: {
        userId: testUser.id,
        daoId: testDAO!.id,
        proposalId: testProposal.id,
      },
    },
    update: {},
    create: {
      userId: testUser.id,
      daoId: testDAO!.id,
      proposalId: testProposal.id,
      daoHandlerId: testDAO!.handlers[0].id,
      options: {
        create: {
          option: "1",
          optionName: "Yes",
        },
      },
    },
  });

  await prisma.vote.upsert({
    where: {
      userId_daoId_proposalId: {
        userId: testUser.id,
        daoId: testDAO!.id,
        proposalId: testProposal2.id,
      },
    },
    update: {},
    create: {
      userId: testUser.id,
      daoId: testDAO!.id,
      proposalId: testProposal2.id,
      daoHandlerId: testDAO!.handlers[0].id,
      options: {
        create: {
          option: "0",
          optionName: "No",
        },
      },
    },
  });

  await prisma.subscription.upsert({
    where: {
      userId_daoId: {
        userId: testUser.id,
        daoId: testDAO!.id,
      },
    },
    update: {},
    create: {
      userId: testUser.id,
      daoId: testDAO!.id,
    },
  });
}

main();
