import { prisma } from '@senate/database'

export let DAOS_PROPOSALS_SNAPSHOT_INTERVAL: number,
    DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE: number,
    DAOS_VOTES_SNAPSHOT_INTERVAL: number,
    DAOS_VOTES_SNAPSHOT_INTERVAL_FORCE: number

export const loadConfig = async () => {
    DAOS_PROPOSALS_SNAPSHOT_INTERVAL = Number(
        (
            await prisma.config.upsert({
                where: {
                    param: 'DAOS_PROPOSALS_SNAPSHOT_INTERVAL'
                },
                create: {
                    param: 'DAOS_PROPOSALS_SNAPSHOT_INTERVAL',
                    value: '10'
                },
                update: {}
            })
        ).value
    )

    DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE = Number(
        (
            await prisma.config.upsert({
                where: {
                    param: 'DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE'
                },
                create: {
                    param: 'DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE',
                    value: '30'
                },
                update: {}
            })
        ).value
    )

    DAOS_VOTES_SNAPSHOT_INTERVAL = Number(
        (
            await prisma.config.upsert({
                where: {
                    param: 'DAOS_VOTES_SNAPSHOT_INTERVAL'
                },
                create: {
                    param: 'DAOS_VOTES_SNAPSHOT_INTERVAL',
                    value: '5'
                },
                update: {}
            })
        ).value
    )

    DAOS_VOTES_SNAPSHOT_INTERVAL_FORCE = Number(
        (
            await prisma.config.upsert({
                where: {
                    param: 'DAOS_VOTES_SNAPSHOT_INTERVAL_FORCE'
                },
                create: {
                    param: 'DAOS_VOTES_SNAPSHOT_INTERVAL_FORCE',
                    value: '30'
                },
                update: {}
            })
        ).value
    )
}
