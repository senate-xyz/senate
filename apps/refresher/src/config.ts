import { prisma } from '@senate/database'

interface ConfigParam {
    key: string
    defaultValue: number
}

const CONFIG_PARAMS: ConfigParam[] = [
    { key: 'refresh_interval', defaultValue: 300 },

    { key: 'normal_chain_proposals', defaultValue: 60 * 1000 },
    { key: 'normal_chain_votes', defaultValue: 60 * 1000 },
    { key: 'normal_snapshot_proposals', defaultValue: 60 * 1000 },
    { key: 'normal_snapshot_votes', defaultValue: 60 * 1000 },

    { key: 'new_chain_proposals', defaultValue: 5 * 1000 },
    { key: 'new_chain_votes', defaultValue: 5 * 1000 },
    { key: 'new_snapshot_proposals', defaultValue: 5 * 1000 },
    { key: 'new_snapshot_votes', defaultValue: 5 * 1000 },

    { key: 'force_chain_proposals', defaultValue: 5 * 60 * 1000 },
    { key: 'force_chain_votes', defaultValue: 5 * 60 * 1000 },
    { key: 'force_snapshot_proposals', defaultValue: 5 * 60 * 1000 },
    { key: 'force_snapshot_votes', defaultValue: 5 * 60 * 1000 },

    { key: 'batch_chain_votes', defaultValue: 100 },
    { key: 'batch_snapshot_votes', defaultValue: 100 }
]

interface ConfigValues {
    [key: string]: number
}

export const CONFIG: ConfigValues = {}

const upsertConfig = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tx: any,
    key: string,
    defaultValue: number
) => {
    const result = await tx.config.upsert({
        where: { key },
        create: { key, value: String(defaultValue) },
        update: {}
    })
    return result.value
}

const loadSingleConfig = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tx: any,
    { key, defaultValue }: ConfigParam
) => {
    CONFIG[key] = await upsertConfig(tx, key, defaultValue)
}

export const loadConfig = async () => {
    await prisma.$transaction(async (tx) => {
        await Promise.all(
            CONFIG_PARAMS.map((param) => loadSingleConfig(tx, param))
        )
    })
}
