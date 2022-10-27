import aaveGovBravo from "./abis/aaveGovBravo.json";
import makerChief from "./abis/makerChief.json";
import makerPollCreate from "./abis/makerPollCreate.json";
import makerPollVote from "./abis/makerPollVote.json";
import { prisma } from "./client";
import { DAOHandlerType, ProposalType } from "@prisma/client";

async function main() {

  const testUserMaker = await prisma.user.upsert({
    where: {
      address: "0xCdB792c14391F7115Ba77A7Cd27f724fC9eA2091",
    },
    update: {},
    create: {
      address: "0xCdB792c14391F7115Ba77A7Cd27f724fC9eA2091",
    },
  });

  const testUserAave = await prisma.user.upsert({
    where: {
      address: "0x5B3bFfC0bcF8D4cAEC873fDcF719F60725767c98",
    },
    update: {},
    create: {
      address: "0x5B3bFfC0bcF8D4cAEC873fDcF719F60725767c98",
    },
  });

  let aave = await prisma.dAO.upsert({
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
              latestProposalBlock: 10000000,
              proposalUrl: 'https://app.aave.com/governance/proposal/?proposalId='
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

  let maker = await prisma.dAO.upsert({
    where: { name: "MakerDAO" },
    update: {},
    create: {
      name: "MakerDAO",
      picture: "https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png",
      handlers: {
        create: [
          {
            type: DAOHandlerType.MAKER_EXECUTIVE,
            decoder: {
              address: "0x0a3f6849f78076aefaDf113F5BED87720274dDC0",
              abi: makerChief.abi,
              latestProposalBlock: 	15682797,
              proposalUrl: "https://vote.makerdao.com/executive/"
            },
          },
          {
            type: DAOHandlerType.MAKER_POLL_CREATE,
            decoder: {
              address: "0xf9be8f0945acddeedaa64dfca5fe9629d0cf8e5d",
              abi: makerPollCreate.abi,
              latestProposalBlock: 	15682797,
              proposalUrl: "https://vote.makerdao.com/polling/"
            },
          },
          {
            type: DAOHandlerType.MAKER_POLL_VOTE,
            decoder: {
              address: "0xD3A9FE267852281a1e6307a1C37CDfD76d39b133",
              abi: makerPollVote.abi,
            },
          },
        ],
      },
    },
    include: {
      handlers: true,
    },
  });

  // const testProposal = await prisma.proposal.upsert({
  //   where: {
  //     externalId_daoId: {
  //       daoId: aave.id,
  //       externalId: "1",
  //     },
  //   },
  //   update: {},
  //   create: {
  //     externalId: "1",
  //     name: "Test name",
  //     description: "Test description",
  //     daoId: aave.id,
  //     daoHandlerId: aave.handlers[0].id,
  //     proposalType: ProposalType.SNAPSHOT,
  //     data: {
  //       timeStart: 1664975385,
  //       timeEnd: 1665975385,
  //     },
  //     url: "",
  //   },
  // });

  // const testProposal2 = await prisma.proposal.upsert({
  //   where: {
  //     externalId_daoId: {
  //       daoId: aave.id,
  //       externalId: "2",
  //     },
  //   },
  //   update: {},
  //   create: {
  //     externalId: "2",
  //     name: "Test name 2",
  //     description: "Test description 2",
  //     daoId: aave.id,
  //     daoHandlerId: aave.handlers[0].id,
  //     proposalType: ProposalType.BRAVO,
  //     data: {
  //       timeStart: 1664975385,
  //       timeEnd: 1665975385,
  //     },
  //     url: "",
  //   },
  // });

  // await prisma.vote.upsert({
  //   where: {
  //     userId_daoId_proposalId: {
  //       userId: testUserMaker.id,
  //       daoId: aave.id,
  //       proposalId: testProposal.id,
  //     },
  //   },
  //   update: {},
  //   create: {
  //     userId: testUserMaker.id,
  //     daoId: aave.id,
  //     proposalId: testProposal.id,
  //     daoHandlerId: aave.handlers[0].id,
  //     options: {
  //       create: {
  //         option: "1",
  //         optionName: "Yes",
  //       },
  //     },
  //   },
  // });

  // await prisma.vote.upsert({
  //   where: {
  //     userId_daoId_proposalId: {
  //       userId: testUserMaker.id,
  //       daoId: aave.id,
  //       proposalId: testProposal2.id,
  //     },
  //   },
  //   update: {},
  //   create: {
  //     userId: testUserMaker.id,
  //     daoId: aave.id,
  //     proposalId: testProposal2.id,
  //     daoHandlerId: aave.handlers[0].id,
  //     options: {
  //       create: {
  //         option: "0",
  //         optionName: "No",
  //       },
  //     },
  //   },
  // });

  await prisma.subscription.upsert({
    where: {
      userId_daoId: {
        userId: testUserMaker.id,
        daoId: maker.id,
      },
    },
    update: {},
    create: {
      userId: testUserMaker.id,
      daoId: maker.id,
    },
  });

  await prisma.subscription.upsert({
    where: {
      userId_daoId: {
        userId: testUserAave.id,
        daoId: aave.id,
      },
    },
    update: {},
    create: {
      userId: testUserAave.id,
      daoId: aave.id,
    },
  });
}

main();
