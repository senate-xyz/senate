import axios from "axios";
import { prisma } from "@senate/database";
import { DAOHandler } from "@senate/common-types";
import { DAOHandlerType, ProposalType } from "@prisma/client";

export const updateSnapshotProposals = async (daoName: string, daoHandler : DAOHandler) => {

  console.log(`get proposals for ${daoName}`);
    let proposals = await axios
      .get("https://hub.snapshot.org/graphql", {
        method: "POST",
        data: JSON.stringify({
          query: `{
                proposals (
                first:1000,
                  where: {
                    space_in: ["${daoHandler.decoder['space']}"],
                  }
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
        console.log(e);
        return;
      });

    console.log(`got ${proposals.length} proposals for ${daoName}`);

    if (
      proposals.length >
      (await prisma.proposal.count({ where: { daoId: daoHandler.daoId } }))
    )
      await prisma
        .$transaction(
          proposals.map((proposal: any) =>
            prisma.proposal.upsert({
              where: {
                externalId_daoId: {
                  daoId: daoHandler.daoId,
                  externalId: proposal.id,
                },
              },
              update: {},
              create: {
                externalId: proposal.id,
                name: String(proposal.title),
                description: "" /*String(proposal.body)*/,
                daoId: daoHandler.daoId,
                daoHandlerId: daoHandler.id,
                proposalType: ProposalType.SNAPSHOT,
                data: {
                  timeEnd: proposal.end * 1000,
                  timeStart: proposal.start * 1000,
                  timeCreated: proposal.created * 1000
                },
                url: proposal.link,
              },
            })
          )
        )
        .then((res) => {
          if (res)
            console.log(
              `upserted ${res.length} snapshot proposals for ${daoName}`
            );
          else console.log(`upserted 0 snapshot proposals for ${daoName}`);
        });
};