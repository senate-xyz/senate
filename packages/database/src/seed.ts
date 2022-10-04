import aaveGovBravo from "./abis/aaveGovBravo.json";
import uniswapGovBravo from "./abis/uniswapGovBravo.json";
import { prisma } from "./client";
import { DAOHandlerType } from "@prisma/client";

async function main() {
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
            },
          },
        ],
      },
    },
  });

  const uniswap = await prisma.dAO.upsert({
    where: { name: "Uniswap" },
    update: {},
    create: {
      name: "Uniswap",
      picture:
        "https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png",
      handlers: {
        create: [
          {
            type: DAOHandlerType.BRAVO2,
            decoder: {
              address: "0x408ED6354d4973f66138C91495F2f2FCbd8724C3",
              abi: uniswapGovBravo.abi,
              latestBlock: 0,
            },
          },
          {
            type: DAOHandlerType.SNAPSHOT,
            decoder: {
              space: "uniswap",
            },
          },
        ],
      },
    },
  });

  await prisma.user.update({
    where: { address: "0xCdB792c14391F7115Ba77A7Cd27f724fC9eA2091" },
    data: {
      subscriptions: {
        create: [
          {
            daoId: aave.id,
          },
          {
            daoId: uniswap.id,
          },
        ],
      },
    },
  });
}

main();
