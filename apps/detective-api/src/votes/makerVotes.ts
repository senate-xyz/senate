import { ethers } from "ethers";
import { Logger, InternalServerErrorException } from "@nestjs/common";
import { prisma } from "@senate/database";
import { Proposal, DAOHandler, User } from "@senate/common-types"

const provider = new ethers.providers.JsonRpcProvider({
  url: String(process.env.PROVIDER_URL),
});

const logger = new Logger("MakerVotes");

export const updateMakerVotes = async (daoHandler: DAOHandler, user: User, daoName: string) => {
  logger.log("Updating Maker executive votes");
  let votedSpells;

  try {
    let userLatestVoteBlock = await prisma.userLatestVoteBlock.findFirst({
      where: {
        userId: user.id,
        daoHandlerId: daoHandler.id
      },
    });
  
    let latestVoteBlock = userLatestVoteBlock ? Number(userLatestVoteBlock.latestVoteBlock) : 0;
    let currentBlock = await provider.getBlockNumber();

    votedSpells = await getVotes(daoHandler, user, latestVoteBlock);
    if (!votedSpells) return; 

    for (const votedSpellAddress of votedSpells) {
      let proposal : Proposal = await prisma.proposal.findFirst({
          where: {
              externalId: votedSpellAddress,
              daoId: daoHandler.daoId,
              daoHandlerId: daoHandler.id,
          },
      })

      if (!proposal) {
        console.log(`MKR Executive proposal with externalId ${votedSpellAddress} does not exist in DB`);
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
          update: {},
          create: {
            userId: user.id,
            daoId: daoHandler.daoId,
            proposalId: proposal.id,
            daoHandlerId: daoHandler.id,
            options: {
              create: {
                option: "1",
                optionName: "Yes"
              }
            }
          },
        });

        await prisma.userLatestVoteBlock.upsert({
          where: {
            userId_daoHandlerId: {
              userId: user.id,
              daoHandlerId: daoHandler.id,
            }
          },
          update: {
            latestVoteBlock: currentBlock
          },
          create: {
            userId: user.id,
            daoHandlerId: daoHandler.id,
            latestVoteBlock: currentBlock
          }
        })
    }

  } catch (err) {
    logger.error("Error while updating maker executive proposals", err);
    throw new InternalServerErrorException();
  }
      
  console.log(`updated ${votedSpells.length} maker executive votes`);
  
};

const getVotes = async (daoHandler: DAOHandler, user: User, latestVoteBlock: number): Promise<string[]> => {
  const iface = new ethers.utils.Interface(daoHandler.decoder["abi"]);
  const chiefContract = new ethers.Contract(daoHandler.decoder["address"], daoHandler.decoder["abi"], provider);

  if (daoHandler.type != "MAKER_EXECUTIVE") return [];

  const voteMultipleActionsTopic =
    "0xed08132900000000000000000000000000000000000000000000000000000000";
  const voteSingleActionTopic =
    "0xa69beaba00000000000000000000000000000000000000000000000000000000";
  const voterAddressTopic = "0x" + "0".repeat(24) + user.address.substring(2);

  const logs = await provider.getLogs({
    fromBlock: latestVoteBlock,
    address: daoHandler.decoder['address'],
    topics: [
      [voteMultipleActionsTopic, voteSingleActionTopic],
      voterAddressTopic,
    ],
  });

  const spellAddressesSet = new Set<string>();
  for (let i = 0; i < logs.length; i++) {
    let log = logs[i];
    let eventArgs = iface.decodeEventLog("LogNote", log.data);

    let decodedFunctionData =
      log.topics[0] === voteSingleActionTopic
        ? iface.decodeFunctionData("vote(bytes32)", eventArgs.fax)
        : iface.decodeFunctionData("vote(address[])", eventArgs.fax);

    let spells: string[] =
      decodedFunctionData.yays !== undefined
        ? decodedFunctionData.yays
        : await getSlateYays(chiefContract, decodedFunctionData.slate);

    spells.forEach((spell) => {
      spellAddressesSet.add(spell);
    });
  }

  return Array.from(spellAddressesSet);
};

const getSlateYays = async (chiefContract: ethers.Contract, slate: string) => {
  let yays = [];
  let count = 0;

  while (true) {
    let spellAddress;
    try {
      spellAddress = await chiefContract.slates(slate, count);
      yays.push(spellAddress);
      count++;
    } catch (err) {
      break;
    }
  }

  return yays;
};
