import { scheduleJob } from 'node-schedule'
import { loadConfig } from './config'
import { createVoterHandlers } from './createHandlers'
import { log_ref } from '@senate/axiom'
import { processChainDaoVotes } from './process/chainDaoVotes'
import { processChainProposals } from './process/chainProposals'
import { processSnapshotDaoVotes } from './process/snapshotDaoVotes'
import { processSnapshotProposals } from './process/snapshotProposals'

export enum RefreshType {
    DAOCHAINPROPOSALS,
    DAOSNAPSHOTPROPOSALS,
    DAOCHAINVOTES,
    DAOSNAPSHOTVOTES
}

export type RefreshQueueType = {
    refreshType: RefreshType
    handlerId: string
    args: object
}
export const refreshQueue: RefreshQueueType[] = []

const main = async () => {
    log_ref.log({
        level: 'info',
        message: `Started refresher`
    })

    await loadConfig()
    await createVoterHandlers()

    scheduleJob('*/30 * * * * *', async () => {
        refreshQueue.push(
            ...[
                {
                    handlerId: 'clfr5ckhn000vurt50f7acex9',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5cjpu000purt5wg8jxslt',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5crzc002uurt5xql451e4',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5cts40039urt5v3kt3fbo',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5cvl7003lurt5c8bhztk0',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5d14a004vurt54vfuw2c3',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5ct0a0033urt5obg9q7l5',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5cutd003furt5xsp10dv8',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5cm1c0017urt5kii2vu5h',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5coi0001uurt59bpop6tl',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5cnq7001nurt5z2ymzodb',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5cq6e0029urt5xps5cd93',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5cgi00002urt5ra2uafmm',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5cysv004durt55sjloikp',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5d2o50057urt5n3x99bxd',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5cl9i0011urt5pi0bnoe9',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5cpej0023urt5qi9pmtbo',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5d47h005jurt5r823951x',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5d3fs005durt561wu1nxt',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5cxwg0043urt5vf04lu7t',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5cwcw003rurt5e0lg6vdj',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5czkv004jurt5sm0vh77z',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5cr2w002kurt5egxofqm8',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5cmti001durt5dd36rit3',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5cx4p003xurt5lvo7tils',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5d0ck004purt5fnumglo0',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5d1w30051urt5bwq4r0wo',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5d53u005purt5ai22vk5k',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5ckhn000vurt50f7acex9',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5cjpu000purt5wg8jxslt',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5crzc002uurt5xql451e4',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5cts40039urt5v3kt3fbo',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5cvl7003lurt5c8bhztk0',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5d14a004vurt54vfuw2c3',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5ct0a0033urt5obg9q7l5',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5cutd003furt5xsp10dv8',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5cm1c0017urt5kii2vu5h',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5coi0001uurt59bpop6tl',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5cnq7001nurt5z2ymzodb',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5cq6e0029urt5xps5cd93',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5cgi00002urt5ra2uafmm',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5cysv004durt55sjloikp',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5d2o50057urt5n3x99bxd',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5cl9i0011urt5pi0bnoe9',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5cpej0023urt5qi9pmtbo',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5d47h005jurt5r823951x',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5d3fs005durt561wu1nxt',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5cxwg0043urt5vf04lu7t',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5cwcw003rurt5e0lg6vdj',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5czkv004jurt5sm0vh77z',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5cr2w002kurt5egxofqm8',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5cmti001durt5dd36rit3',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5cx4p003xurt5lvo7tils',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5d0ck004purt5fnumglo0',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5d1w30051urt5bwq4r0wo',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5d53u005purt5ai22vk5k',
                    refreshType: 1,
                    args: {}
                },
                {
                    handlerId: 'clfr5ciot000burt5x9hoypss',
                    refreshType: 0,
                    args: {}
                },
                {
                    handlerId: 'clfr5coi0001turt5t6kqwqk2',
                    refreshType: 0,
                    args: {}
                },
                {
                    handlerId: 'clfr5crzc002turt546t71wb8',
                    refreshType: 0,
                    args: {}
                },
                {
                    handlerId: 'clfr5cgi00001urt5qwzmh5fn',
                    refreshType: 0,
                    args: {}
                },
                {
                    handlerId: 'clfr5cmti001eurt5br0bkkv3',
                    refreshType: 0,
                    args: {}
                },
                {
                    handlerId: 'clfr5cq6e002aurt53pv34fqh',
                    refreshType: 0,
                    args: {}
                },
                {
                    handlerId: 'clfr5cxwh0044urt5xdgry0df',
                    refreshType: 0,
                    args: {}
                },
                {
                    handlerId: 'clfr5cr2w002jurt560a96vpg',
                    refreshType: 0,
                    args: {}
                },
                {
                    handlerId: 'clfr5ciot000curt512nuy06q',
                    refreshType: 0,
                    args: {}
                },
                {
                    handlerId: 'clfr5ciot000burt5x9hoypss',
                    refreshType: 0,
                    args: {}
                },
                {
                    handlerId: 'clfr5coi0001turt5t6kqwqk2',
                    refreshType: 0,
                    args: {}
                },
                {
                    handlerId: 'clfr5crzc002turt546t71wb8',
                    refreshType: 0,
                    args: {}
                },
                {
                    handlerId: 'clfr5cgi00001urt5qwzmh5fn',
                    refreshType: 0,
                    args: {}
                },
                {
                    handlerId: 'clfr5cmti001eurt5br0bkkv3',
                    refreshType: 0,
                    args: {}
                },
                {
                    handlerId: 'clfr5cq6e002aurt53pv34fqh',
                    refreshType: 0,
                    args: {}
                },
                {
                    handlerId: 'clfr5cxwh0044urt5xdgry0df',
                    refreshType: 0,
                    args: {}
                },
                {
                    handlerId: 'clfr5cr2w002jurt560a96vpg',
                    refreshType: 0,
                    args: {}
                },
                {
                    handlerId: 'clfr5ciot000curt512nuy06q',
                    refreshType: 0,
                    args: {}
                }
            ]
        )
    })

    // scheduleJob('* * * * * *', async () => {
    //     createVoterHandlers()

    //     //refreshQueue.push(...(await addSnapshotProposalsToQueue()))
    //     //refreshQueue.push(...(await addSnapshotDaoVotes()))

    //     //refreshQueue.push(...(await addChainProposalsToQueue()))
    //     //refreshQueue.push(...(await addChainDaoVotes()))

    //     console.log(JSON.stringify(refreshQueue))
    // })

    setInterval(() => {
        if (refreshQueue.length) {
            const item = refreshQueue.pop()

            switch (item.refreshType) {
                case RefreshType.DAOSNAPSHOTPROPOSALS:
                    processSnapshotProposals(item)
                    break
                case RefreshType.DAOSNAPSHOTVOTES:
                    processSnapshotDaoVotes(item)
                    break
                case RefreshType.DAOCHAINPROPOSALS:
                    processChainProposals(item)
                    break
                case RefreshType.DAOCHAINVOTES:
                    processChainDaoVotes(item)
                    break
                default:
                    break
            }
        }
    }, 300)
}

main()
