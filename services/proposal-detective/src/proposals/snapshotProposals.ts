import dotenv from "dotenv";
import { Dao, PrismaClient } from "@prisma/client";
import axios from "axios";
import { ProposalTypeEnum } from "./../../../../types";

dotenv.config();

const prisma = new PrismaClient();

export const getSnapshotProposals = async () => {
  let daos = await prisma.dao.findMany({
    where: {
      snapshotSpace: {
        not: "",
      },
    },
  });
  await findOngoingProposals(daos);
};

const findOngoingProposals = async (daos: Dao[]) => {
  await Promise.all(
    daos.map(async (dao) => {
      let proposals = await axios
        .get("https://hub.snapshot.org/graphql", {
          method: "POST",
          data: JSON.stringify({
            query: `{
                proposals (
                first:1000,
                  where: {
                    space_in: ["${dao.snapshotSpace}"],
                  },
                  orderBy: "created",
                  orderDirection: desc
                ) {
                  id
                  title
                  body
                  created
                  start
                  end
                  link
                }
              }`,
          }),
          headers: {
            "content-type": "application/json",
          },
        })
        .then((response) => {
          return response.data;
        })
        .then((data) => {
          return data.data.proposals;
        })
        .catch((e) => {
          proposals = [];
        });

      if (proposals.length)
        await prisma
          .$transaction(
            proposals.map((proposal: any) =>
              prisma.proposal.upsert({
                where: {
                  snapshotId: proposal.id,
                },
                update: {
                  daoId: dao.id,
                  title: String(proposal.title),
                  type: ProposalTypeEnum.Snapshot,
                  description: String(proposal.body),
                  created: new Date(proposal.created * 1000),
                  voteStarts: new Date(proposal.start * 1000),
                  voteEnds: new Date(proposal.end * 1000),
                  url: proposal.link,
                },
                create: {
                  snapshotId: proposal.id,
                  daoId: dao.id,
                  title: String(proposal.title),
                  type: ProposalTypeEnum.Snapshot,
                  description: String(proposal.body),
                  created: new Date(proposal.created * 1000),
                  voteStarts: new Date(proposal.start * 1000),
                  voteEnds: new Date(proposal.end * 1000),
                  url: proposal.link,
                },
              })
            )
          )
          .then((res) => {
            if (res) console.log(`upserted ${res.length} snapshot proposals`);
            else console.log(`upserted 0 snapshot proposals`);
          });
    })
  );
};
