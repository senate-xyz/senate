import inquirer from "inquirer";

import {
  type Prisma as PrismaNew,
  PrismaClient as PrismaNewClient,
} from "../prisma/new/generated/client";
import {
  type Prisma as PrismaOld,
  PrismaClient as PrismaOldClient,
} from "../prisma/old/generated/client";
import fs from "fs";

const newPrisma = new PrismaNewClient();
const oldPrisma = new PrismaOldClient();

async function main() {
  await inquirer
    .prompt([
      {
        type: "list",
        name: "run",
        message: "What do you want to do?",
        choices: [
          { name: "Export users from db to file", value: "export" },
          { name: "Import users from file to db", value: "import" },
        ],
      },
      {
        type: "input",
        name: "file",
        message: "How shall I name the exported file?",
        when(answers: { run: string }) {
          return answers.run === "export";
        },
      },
      {
        type: "input",
        name: "file",
        message:
          "What file do you want to import? Hint: the file should be located in /data",
        when(answers: { run: string }) {
          return answers.run === "import";
        },
      },
    ])

    .then(async (answers: any) => {
      if (answers.run === "export") {
        await exportUsers(answers.file);
      } else {
        await importUsers(answers.file);
      }
    });
}

export type OldUserType = PrismaOld.userGetPayload<{
  include: {
    subscriptions: { include: { dao: true } };
    voters: true;
  };
}>;

export type NewUsertype = PrismaNew.userGetPayload<{
  include: {
    subscriptions: { include: { dao: true } };
  };
}>;

const exportUsers = async (toFile: string) => {
  const data = await oldPrisma.user.findMany({
    include: {
      subscriptions: { select: { dao: { select: { name: true } } } },
      voters: true,
    },
  });

  fs.writeFile(
    `./data/${toFile}.json`,
    JSON.stringify(data, null, 4),
    (err) => {
      if (err) {
        throw err;
      }
      console.log("JSON data is saved.");
    }
  );

  console.log({ data: data, file: toFile });
};

const importUsers = async (fromFile: string) => {
  await newPrisma.user.count();

  const rawdata = fs.readFileSync(`./data/${fromFile}.json`);

  const users: OldUserType[] = JSON.parse(rawdata.toString());

  for (const user of users) {
    let newUser;
    const existingUser = await newPrisma.user.findFirst({
      where: {
        address: user.name,
      },
    });

    if (existingUser) {
      newUser = await newPrisma.user.update({
        where: {
          address: user.name,
        },
        data: {
          address: user.name,
          email: user.email,
          verifiedemail: user.email.length > 0 ? true : false,
          verifiedaddress: true,
          acceptedterms: false,
          acceptedtermstimestamp: new Date(0),
          lastactive: user.lastactive,
          sessioncount: user.sessioncount,
          emaildailybulletin: user.dailybulletin,
          createdat: user.createdat,
          updatedat: user.updatedat,
        },
      });
    } else {
      newUser = await newPrisma.user.create({
        data: {
          address: user.name,
          email: user.email,
          verifiedemail: user.email.length > 0 ? true : false,
          verifiedaddress: true,
          acceptedterms: false,
          acceptedtermstimestamp: new Date(0),
          lastactive: user.lastactive,
          sessioncount: user.sessioncount,
          emaildailybulletin: user.dailybulletin,
          createdat: user.createdat,
          updatedat: user.updatedat,
        },
      });
    }

    for (let v of user.voters) {
      let existingVoter = await newPrisma.voter.findFirst({
        where: { address: v.address },
      });

      if (!existingVoter) {
        let nv = await newPrisma.voter.create({
          data: {
            address: v.address,
          },
        });
        await newPrisma.user.update({
          where: {
            address: user.name,
          },
          data: {
            voters: { connect: { id: nv.id } },
          },
        });
      } else {
        await newPrisma.user.update({
          where: {
            address: user.name,
          },
          data: {
            voters: { connect: { id: existingVoter.id } },
          },
        });
      }
    }

    console.log(`Created: ${newUser.address}`);

    for (const subscription of user.subscriptions) {
      const dao = await newPrisma.dao.findFirst({
        where: {
          name: subscription.dao.name,
        },
      });

      const existingSub = newPrisma.subscription.findFirst({
        where: {
          userid: newUser.id,
          daoid: dao.id,
        },
      });

      if (!existingSub) {
        await newPrisma.subscription.create({
          data: {
            dao: { connect: { name: dao.name } },
            user: { connect: { id: newUser.id } },
          },
        });
      }
    }
  }

  console.log("Done!");
};

void main();
