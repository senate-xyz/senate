import axios from "axios";
import { prisma } from "@senate/database";
import { DAOHandler, User, VoteOption } from "@senate/common-types";

export const updateSnapshotVotes = async (daoHandler: DAOHandler, user: User, daoName: string) => {
  if (!daoHandler.decoder["space"]) return;

  let votes = await axios
    .get("https://hub.snapshot.org/graphql", {
      method: "POST",
      data: JSON.stringify({
        query: `{
            votes(first: 1000, where: {voter: "${user?.address}", space:"${daoHandler.decoder['space']}"}) {
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
    for (const vote of votes) {
        let proposal = await prisma.proposal.findFirst({
            where: {
                externalId: vote.proposal.id,
                daoId: daoHandler.daoId, 
                daoHandlerId: daoHandler.id
            },
        })

        let votedOptions : VoteOption[] = getVotedOptions(vote.choice, vote.proposal.choices, user.id, daoHandler.daoId, proposal.id);

        for (const votedOption of votedOptions) {
          await prisma.vote.upsert({
            where: {
              userId_daoId_proposalId: {
                userId: user.id,
                daoId: daoHandler.daoId,
                proposalId: proposal.id
              }
            },
            update: {
              options: {
                upsert: {
                  where: {
                    voteProposalId_option: {
                      voteProposalId: proposal.id,
                      option: votedOption.option,
                    }
                  },
                  update: {},
                  create: votedOption
                } 
              }
            },
            create: {
              userId: user.id,
              daoId: daoHandler.daoId,
              proposalId: proposal.id,
              daoHandlerId: daoHandler.id,
              options: {
                create: {
                  option: vote.choice.length > 0 ? vote.choice[0] : vote.choice,
                  optionName: vote.proposal.choices[vote.choice - 1] ?? "No name",
                }
              }
            },
          });
        }
        
    }
      

  console.log(
    `upserted ${votes.length} snapshot votes for ${user?.address} in ${daoName}`
  );

};



const getVotedOptions = (choices: any, proposalChoices: any, userId: string, daoId: string, proposalId: string) => {
  let options = [];

  if (choices.length > 0) {
    for (let i=0; i<choices.length; i++) {
      options.push({
        option: choices[i],
        optionName: proposalChoices[choices[i]-1] ?? "No name",
        voteUserId: userId,
        voteDaoId: daoId,
        voteProposalId: proposalId
      })
    }
  } else {
    options.push({
      option: choices,
      optionName: proposalChoices[choices-1] ?? "No name"
    })
  }

  return options;
}
