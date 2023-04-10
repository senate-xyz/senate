import { snapshotProposalsSanity } from './proposals/snapshot'
import { makerPollsSanity} from './proposals/makerPolls'
import { genericChainHandlersSanity } from './proposals/genericChainHandlers'
import { snapshotVotesSanity } from './votes/snapshot'

snapshotProposalsSanity.start()
makerPollsSanity.start()
genericChainHandlersSanity.start()

snapshotVotesSanity.start()
