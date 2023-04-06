import { snapshotProposalsSanity } from './proposals/snapshot'
import { makerPollsSanity} from './proposals/makerPolls'
import { snapshotVotesSanity } from './votes/snapshot'

snapshotProposalsSanity.start()
makerPollsSanity.start()

snapshotVotesSanity.start()
