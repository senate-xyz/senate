import { log_ref } from '@senate/axiom'
import { prisma } from '@senate/database'

const DEFAULT_DAOS_PROPOSALS_SNAPSHOT_INTERVAL = 1,
    DEFAULT_DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE = 30,
    DEFAULT_DAOS_VOTES_SNAPSHOT_INTERVAL = 1,
    DEFAULT_DAOS_VOTES_SNAPSHOT_INTERVAL_FORCE = 30,
    DEFAULT_DAOS_PROPOSALS_CHAIN_INTERVAL = 1,
    DEFAULT_DAOS_PROPOSALS_CHAIN_INTERVAL_FORCE = 60,
    DEFAULT_DAOS_VOTES_CHAIN_INTERVAL = 1,
    DEFAULT_DAOS_VOTES_CHAIN_INTERVAL_FORCE = 30

export let DAOS_PROPOSALS_SNAPSHOT_INTERVAL: number,
    DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE: number,
    DAOS_VOTES_SNAPSHOT_INTERVAL: number,
    DAOS_VOTES_SNAPSHOT_INTERVAL_FORCE: number,
    DAOS_PROPOSALS_CHAIN_INTERVAL: number,
    DAOS_PROPOSALS_CHAIN_INTERVAL_FORCE: number,
    DAOS_VOTES_CHAIN_INTERVAL: number,
    DAOS_VOTES_CHAIN_INTERVAL_FORCE: number

export const loadConfig = async () => {
    log_ref.log({
        level: 'info',
        message: `Load config`
    })

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
    log_ref.log({
        level: 'info',
        message: `Loaded config`,
        data: {
            DAOS_PROPOSALS_SNAPSHOT_INTERVAL: DAOS_PROPOSALS_SNAPSHOT_INTERVAL,
            DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE:
                DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE,
            DAOS_VOTES_SNAPSHOT_INTERVAL: DAOS_VOTES_SNAPSHOT_INTERVAL,
            DAOS_VOTES_SNAPSHOT_INTERVAL_FORCE:
                DAOS_VOTES_SNAPSHOT_INTERVAL_FORCE,
            DAOS_PROPOSALS_CHAIN_INTERVAL: DAOS_PROPOSALS_CHAIN_INTERVAL,
            DAOS_PROPOSALS_CHAIN_INTERVAL_FORCE:
                DAOS_PROPOSALS_CHAIN_INTERVAL_FORCE,
            DAOS_VOTES_CHAIN_INTERVAL: DAOS_VOTES_CHAIN_INTERVAL,
            DAOS_VOTES_CHAIN_INTERVAL_FORCE: DAOS_VOTES_CHAIN_INTERVAL_FORCE
        }
    })
}
