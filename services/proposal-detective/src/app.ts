import { ProposalType } from "./../../../types/index";
import { getChainProposals } from "./proposals/chainDetective";
import { getSnapshotProposals } from "./proposals/snapshotProposals";
import { getSnapshotVotes } from "./votes/snapshotVotes";
import { getChainVotes } from "./votes/chainVotes";
import { getMakerProposals } from "./proposals/makerProposals";
let integrationTestType: ProposalType;

const main = async () => {
  console.log(`proposalDetective start`);

  // console.log(`getChainProposals`);
  // await getChainProposals();

  // console.log(`getSnapshotProposals`);
  // await getSnapshotProposals();

  // console.log(`getSnapshotVotes`);
  // await getSnapshotVotes();

  console.log('getChainVotes');
  await getChainVotes()

  // console.log('getMakerProposals');
  // await getMakerProposals()
};

main();
