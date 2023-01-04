import { prisma } from '@senate/database'

const DEFAULT_DAOS_PROPOSALS_SNAPSHOT_INTERVAL = 5,
    DEFAULT_DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE = 60,
    DEFAULT_DAOS_VOTES_SNAPSHOT_INTERVAL = 5,
    DEFAULT_DAOS_VOTES_SNAPSHOT_INTERVAL_FORCE = 60,
    DEFAULT_DAOS_PROPOSALS_CHAIN_INTERVAL = 5,
    DEFAULT_DAOS_PROPOSALS_CHAIN_INTERVAL_FORCE = 60,
    DEFAULT_DAOS_VOTES_CHAIN_INTERVAL = 5,
    DEFAULT_DAOS_VOTES_CHAIN_INTERVAL_FORCE = 60

export let DAOS_PROPOSALS_SNAPSHOT_INTERVAL: number,
    DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE: number,
    DAOS_VOTES_SNAPSHOT_INTERVAL: number,
    DAOS_VOTES_SNAPSHOT_INTERVAL_FORCE: number,
    DAOS_PROPOSALS_CHAIN_INTERVAL: number,
    DAOS_PROPOSALS_CHAIN_INTERVAL_FORCE: number,
    DAOS_VOTES_CHAIN_INTERVAL: number,
    DAOS_VOTES_CHAIN_INTERVAL_FORCE: number

export const loadConfig = async () => {
    DAOS_PROPOSALS_SNAPSHOT_INTERVAL = Number(
        (
            await prisma.config.upsert({
                where: {
                    param: 'DAOS_PROPOSALS_SNAPSHOT_INTERVAL'
                },
                create: {
                    param: 'DAOS_PROPOSALS_SNAPSHOT_INTERVAL',
                    value: String(DEFAULT_DAOS_PROPOSALS_SNAPSHOT_INTERVAL)
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
            await prisma.config.upsert({
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
            await prisma.config.upsert({
                where: {
                    param: 'DAOS_VOTES_SNAPSHOT_INTERVAL_FORCE'
                },
                create: {
                    param: 'DAOS_VOTES_SNAPSHOT_INTERVAL_FORCE',
                    value: String(DEFAULT_DAOS_VOTES_SNAPSHOT_INTERVAL_FORCE)
                },
                update: {}
            })
        ).value
    )

    DAOS_PROPOSALS_CHAIN_INTERVAL = Number(
        (
            await prisma.config.upsert({
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
            await prisma.config.upsert({
                where: {
                    param: 'DAOS_PROPOSALS_CHAIN_INTERVAL_FORCE'
                },
                create: {
                    param: 'DAOS_PROPOSALS_CHAIN_INTERVAL_FORCE',
                    value: String(DEFAULT_DAOS_PROPOSALS_CHAIN_INTERVAL_FORCE)
                },
                update: {}
            })
        ).value
    )

    DAOS_VOTES_CHAIN_INTERVAL = Number(
        (
            await prisma.config.upsert({
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
            await prisma.config.upsert({
                where: {
                    param: 'DAOS_VOTES_CHAIN_INTERVAL_FORCE'
                },
                create: {
                    param: 'DAOS_VOTES_CHAIN_INTERVAL_FORCE',
                    value: String(DEFAULT_DAOS_VOTES_CHAIN_INTERVAL_FORCE)
                },
                update: {}
            })
        ).value
    )
}
