import dotenv from "dotenv";
import { PrismaClient, Dao } from "@prisma/client";
import { ethers } from "ethers";
import axios from "axios";
import { ProposalTypeEnum } from "./../../../../types";

dotenv.config();

const prisma = new PrismaClient();

const provider = new ethers.providers.JsonRpcProvider({
  url: String(process.env.PROVIDER_URL),
});


export const getMakerProposals = async () => {
  let maker = await prisma.dao.findFirst({
    where: {
        address: "0x0a3f6849f78076aefaDf113F5BED87720274dDC0"
    }
  })

  if (maker !== null) {
    await findMakerProposals(maker);
  }
  
};

const findMakerProposals = async (dao: Dao) => {
    const iface = new ethers.utils.Interface(dao.abi);
    const chiefContract = new ethers.Contract(
        dao.address,
        dao.abi,
        provider
    );

    const voteMultipleActionsTopic =
    "0xed08132900000000000000000000000000000000000000000000000000000000";
    const voteSingleActionTopic =
    "0xa69beaba00000000000000000000000000000000000000000000000000000000";

  const logs = await provider.getLogs({
    fromBlock: 15044958,
    address: dao.address,
    topics: [
      [voteMultipleActionsTopic, voteSingleActionTopic]
    ],
  });

  const spellsAddressSet = new Set<string>();
  for (let i = 0; i < logs.length; i++) {
    let log = logs[i];
    console.log(log);
    //let logTimestamp = await getEventTimestamp(log.blockNumber);
    let eventArgs = iface.decodeEventLog("LogNote", log.data);

    let decodedFunctionData =
      log.topics[0] === voteSingleActionTopic
        ? iface.decodeFunctionData("vote(bytes32)", eventArgs.fax)
        : iface.decodeFunctionData("vote(address[])", eventArgs.fax);

    let spells : string[] =
      decodedFunctionData.yays !== undefined
        ? decodedFunctionData.yays
        : await getSlateYays(chiefContract, decodedFunctionData.slate);

    spells.forEach(spell => {
        spellsAddressSet.add(spell);
    })
  }

  spellsAddressSet.forEach(spell => {
    // Spells have unique addresses. Stuffing these into the snapshotId field
    // Add spells to database
  })

  console.log(spellsAddressSet.size);
}

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

//11954225 