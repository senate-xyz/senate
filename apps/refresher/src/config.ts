import { prisma } from '@senate/database'

const DEFAULT_REFRESH_PROCESS_INTERVAL_MS = 300

const DEFAULT_DAOS_PROPOSALS_SNAPSHOT_INTERVAL = 1,
    DEFAULT_DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE = 300,
    DEFAULT_DAOS_VOTES_SNAPSHOT_INTERVAL = 1,
    DEFAULT_DAOS_VOTES_SNAPSHOT_INTERVAL_FORCE = 300,
    DEFAULT_DAOS_PROPOSALS_CHAIN_INTERVAL = 1,
    DEFAULT_DAOS_PROPOSALS_CHAIN_INTERVAL_FORCE = 300,
    DEFAULT_DAOS_VOTES_CHAIN_INTERVAL = 1,
    DEFAULT_DAOS_VOTES_CHAIN_INTERVAL_FORCE = 300

export let REFRESH_PROCESS_INTERVAL_MS: number

export let DAOS_PROPOSALS_SNAPSHOT_INTERVAL: number,
    DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE: number,
    DAOS_VOTES_SNAPSHOT_INTERVAL: number,
    DAOS_VOTES_SNAPSHOT_INTERVAL_FORCE: number,
    DAOS_PROPOSALS_CHAIN_INTERVAL: number,
    DAOS_PROPOSALS_CHAIN_INTERVAL_FORCE: number,
    DAOS_VOTES_CHAIN_INTERVAL: number,
    DAOS_VOTES_CHAIN_INTERVAL_FORCE: number

export const loadConfig = async () => {
    await prisma.$transaction(
        async (tx) => {
            REFRESH_PROCESS_INTERVAL_MS = Number(
                (
                    await tx.config.upsert({
                        where: {
                            param: 'REFRESH_PROCESS_INTERVAL_MS'
                        },
                        create: {
                            param: 'REFRESH_PROCESS_INTERVAL_MS',
                            value: String(DEFAULT_REFRESH_PROCESS_INTERVAL_MS)
                        },
                        update: {}
                    })
                ).value
            )

            DAOS_PROPOSALS_SNAPSHOT_INTERVAL = Number(
                (
                    await tx.config.upsert({
                        where: {
                            param: 'DAOS_PROPOSALS_SNAPSHOT_INTERVAL'
                        },
                        create: {
                            param: 'DAOS_PROPOSALS_SNAPSHOT_INTERVAL',
                            value: String(
                                DEFAULT_DAOS_PROPOSALS_SNAPSHOT_INTERVAL
                            )
                        },
                        update: {}
                    })
                ).value
            )

            DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE = Number(
                (
                    await tx.config.upsert({
                        where: {
                            param: 'DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE'
                        },
                        create: {
                            param: 'DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE',
                            value: String(
                                DEFAULT_DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE
                            )
                        },
                        update: {}
                    })
                ).value
            )

            DAOS_VOTES_SNAPSHOT_INTERVAL = Number(
                (
                    await tx.config.upsert({
                        where: {
                            param: 'DAOS_VOTES_SNAPSHOT_INTERVAL'
                        },
                        create: {
                            param: 'DAOS_VOTES_SNAPSHOT_INTERVAL',
                            value: String(DEFAULT_DAOS_VOTES_SNAPSHOT_INTERVAL)
                        },
                        update: {}
                    })
                ).value
            )

            DAOS_VOTES_SNAPSHOT_INTERVAL_FORCE = Number(
                (
                    await tx.config.upsert({
                        where: {
                            param: 'DAOS_VOTES_SNAPSHOT_INTERVAL_FORCE'
                        },
                        create: {
                            param: 'DAOS_VOTES_SNAPSHOT_INTERVAL_FORCE',
                            value: String(
                                DEFAULT_DAOS_VOTES_SNAPSHOT_INTERVAL_FORCE
                            )
                        },
                        update: {}
                    })
                ).value
            )

            DAOS_PROPOSALS_CHAIN_INTERVAL = Number(
                (
                    await tx.config.upsert({
                        where: {
                            param: 'DAOS_PROPOSALS_CHAIN_INTERVAL'
                        },
                        create: {
                            param: 'DAOS_PROPOSALS_CHAIN_INTERVAL',
                            value: String(DEFAULT_DAOS_PROPOSALS_CHAIN_INTERVAL)
                        },
                        update: {}
                    })
                ).value
            )

            DAOS_PROPOSALS_CHAIN_INTERVAL_FORCE = Number(
                (
                    await tx.config.upsert({
                        where: {
                            param: 'DAOS_PROPOSALS_CHAIN_INTERVAL_FORCE'
                        },
                        create: {
                            param: 'DAOS_PROPOSALS_CHAIN_INTERVAL_FORCE',
                            value: String(
                                DEFAULT_DAOS_PROPOSALS_CHAIN_INTERVAL_FORCE
                            )
                        },
                        update: {}
                    })
                ).value
            )

            DAOS_VOTES_CHAIN_INTERVAL = Number(
                (
                    await tx.config.upsert({
                        where: {
                            param: 'DAOS_VOTES_CHAIN_INTERVAL'
                        },
                        create: {
                            param: 'DAOS_VOTES_CHAIN_INTERVAL',
                            value: String(DEFAULT_DAOS_VOTES_CHAIN_INTERVAL)
                        },
                        update: {}
                    })
                ).value
            )

            DAOS_VOTES_CHAIN_INTERVAL_FORCE = Number(
                (
                    await tx.config.upsert({
                        where: {
                            param: 'DAOS_VOTES_CHAIN_INTERVAL_FORCE'
                        },
                        create: {
                            param: 'DAOS_VOTES_CHAIN_INTERVAL_FORCE',
                            value: String(
                                DEFAULT_DAOS_VOTES_CHAIN_INTERVAL_FORCE
                            )
                        },
                        update: {}
                    })
                ).value
            )
        },
        {
            maxWait: 30000,
            timeout: 30000
        }
    )
}
