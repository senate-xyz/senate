import dotenv from "dotenv";
import { Dao, PrismaClient, Subscription } from "@prisma/client";
import axios from "axios";
import { ProposalTypeEnum } from "./../../../../types/index";

dotenv.config();

const prisma = new PrismaClient();

main();
async function main() {
  let daos = await prisma.dao.findMany({
    where: {
      snapshotSpace: {
        not: "",
      },
    },
  });
  //await findOngoingProposals(daos);

  let subscriptions = await prisma.subscription.findMany();
  //await findVotes(subscriptions);
}

function findVotes(subs: Subscription[]) {
  subs.map(async (sub) => {
    let user = await prisma.user.findFirst({
      where: {
        id: sub.userId,
      },
    });

    let dao = await prisma.dao.findFirst({
      where: {
        id: sub.daoId,
      },
    });

    let votes = await axios
      .get("https://hub.snapshot.org/graphql", {
        method: "POST",
        data: JSON.stringify({
          query: `{
            votes(first: 1000, where: {voter: "${user?.address}", space:"${dao?.snapshotSpace}"}) {
              id
              voter
              choice
              proposal {
                id
                choices
              }
            }
          }
          `,
        }),
        headers: {
          "content-type": "application/json",
        },
      })
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        return data.data.votes;
      });

    if (votes)
      await prisma
        .$transaction(
          votes.map((vote: any) =>
            prisma.userVote.create({
              data: {
                user: {
                  connect: {
                    id: user?.id,
                  },
                },
                proposal: {
                  connect: {
                    snapshotId: vote.proposal.id,
                  },
                },
                voteOption: vote.choice,
                voteName: vote.proposal.choices[vote.choice - 1],
              },
            })
          )
        )
        .then(() => console.log(`inserted user votes`));
  });
}

async function findOngoingProposals(daos: Dao[]) {
  daos.map(async (dao) => {
    let proposals = await axios
      .get("https://hub.snapshot.org/graphql", {
        method: "POST",
        data: JSON.stringify({
          query: `{
                proposals (
                first:1000,
                  where: {
                    space_in: ["${dao.address}"],
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
      });

    if (proposals)
      await prisma
        .$transaction(
          proposals.map((proposal: any) =>
            prisma.proposal.create({
              data: {
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
        .then(() => console.log(`inserted snapshot proposals`));
  });
}
