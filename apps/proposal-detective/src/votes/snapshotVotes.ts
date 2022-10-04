import { Subscription } from "@prisma/client";
import axios from "axios";
import { ProposalTypeEnum } from "@senate/common-types";
import { prisma } from "@senate/database";

export const getSnapshotVotes = async () => {
  let subscriptions = await prisma.subscription.findMany();
  await findVotes(subscriptions);
};

const findVotes = async (subs: Subscription[]) => {
  for (const sub of subs) {
    await updateSingleSub(sub);
  }
};

const updateSingleSub = async (sub: Subscription) => {
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

  if (!dao?.snapshotSpace.length) return;

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
                title
                body
                created
                start
                end
                link
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
    })
    .catch((e) => {
      console.log(e);
      return;
    });

  //TODO support multiple choice vote
  if (votes.length)
    for (const vote of votes)
      prisma.userVote.upsert({
        where: {
          snapshotId: vote.id,
        },
        update: {
          voteOption: vote.choice.length > 0 ? vote.choice[0] : vote.choice,
          voteName: vote.proposal.choices[vote.choice - 1],
        },
        create: {
          snapshotId: vote.id,
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
          voteOption: vote.choice.length > 0 ? vote.choice[0] : vote.choice,
          voteName: vote.proposal.choices[vote.choice - 1] ?? "No name",
        },
      });

  console.log(
    `upserted ${votes.length} snapshot votes for ${user?.address} in ${dao?.name}`
  );
};
