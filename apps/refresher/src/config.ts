import { prisma } from '@senate/database'

interface Config {
    REFRESH_PROCESS_INTERVAL_MS: number
    DAOS_PROPOSALS_SNAPSHOT_INTERVAL: number
    DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE: number
    DAOS_VOTES_SNAPSHOT_INTERVAL: number
    DAOS_VOTES_SNAPSHOT_INTERVAL_FORCE: number
    DAOS_PROPOSALS_CHAIN_INTERVAL: number
    DAOS_PROPOSALS_CHAIN_INTERVAL_FORCE: number
    DAOS_VOTES_CHAIN_INTERVAL: number
    DAOS_VOTES_CHAIN_INTERVAL_FORCE: number
}

const DEFAULT_CONFIG: Config = {
    REFRESH_PROCESS_INTERVAL_MS: 300,
    DAOS_PROPOSALS_SNAPSHOT_INTERVAL: 1,
    DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE: 300,
    DAOS_VOTES_SNAPSHOT_INTERVAL: 1,
    DAOS_VOTES_SNAPSHOT_INTERVAL_FORCE: 300,
    DAOS_PROPOSALS_CHAIN_INTERVAL: 1,
    DAOS_PROPOSALS_CHAIN_INTERVAL_FORCE: 300,
    DAOS_VOTES_CHAIN_INTERVAL: 1,
    DAOS_VOTES_CHAIN_INTERVAL_FORCE: 300
}

export let config: Config = { ...DEFAULT_CONFIG }

export const loadConfig = async () => {
    const dbConfig = await prisma.$transaction(
        Object.keys(DEFAULT_CONFIG).map((key) =>
            prisma.config.upsert({
                where: { param: key },
                create: {
                    param: key,
                    value: String(DEFAULT_CONFIG[key as keyof Config])
                },
                update: {}
            })
        )
    )
    config = Object.assign(
        {},
        DEFAULT_CONFIG,
        ...dbConfig.map((row) => ({
            [row.param as keyof Config]: Number(row.value)
        }))
    )
}
