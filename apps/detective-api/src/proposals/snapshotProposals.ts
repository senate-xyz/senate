import { InternalServerErrorException, Logger } from "@nestjs/common";
import { ProposalType } from "@prisma/client";
import { DAOHandler } from "@senate/common-types";
import { prisma } from "@senate/database";
import axios from "axios";

const logger = new Logger("SnapshotProposals");


export const updateSnapshotProposals = async (daoName: string, daoHandler : DAOHandler) => {

  logger.log(`Searching snapshot proposals for ${daoName}`);
  let proposals;

  try {
    proposals = await axios
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
      });

      logger.log(`got ${proposals.length} proposals for ${daoName}`);

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
            logger.log(`upserted ${res.length} snapshot proposals for ${daoName}`);
          else logger.log(`upserted 0 snapshot proposals for ${daoName}`);
        });

  } catch (err) {
    logger.error("Error while updating snapshot proposals", err);
    throw new InternalServerErrorException();
  }
    
};