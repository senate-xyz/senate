import { ProposalType } from "./../../../types/index";
import { getChainProposals } from "./proposals/chainDetective";
import { getSnapshotProposals } from "./proposals/snapshotProposals";
import { getSnapshotVotes } from "./votes/snapshotVotes";
let integrationTestType: ProposalType;

const main = async () => {
  console.log(`proposalDetective start`);

  console.log(`getChainProposals`);
  await getChainProposals();

  console.log(`getSnapshotProposals`);
  await getSnapshotProposals();

  console.log(`getSnapshotVotes`);
  await getSnapshotVotes();
};

main();
