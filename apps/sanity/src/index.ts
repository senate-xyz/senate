import { prisma, DAOHandler, Decoder } from '@senate/database'

import axios from 'axios'
import { config } from 'dotenv'
import { schedule } from 'node-cron'
import { log_san } from '@senate/axiom'

config()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const delay = (ms: number): Promise<any> => {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

// Cron job which runs whenever dictated by env var OR on Feb 31st if env var is missing
schedule(
    String(process.env.SANITY_CRON_INTERVAL) ?? '* * 31 2 *',
    async function () {
        log_san.log({
            level: 'info',
            message: 'Starting sanity check',
            data: {
                today: new Date(Date.now())
            }
        })
        const voteMatchingPercentage = new Map<string, number>()
        const daoHandlers = await prisma.dAOHandler.findMany()

        for (const daoHandler of daoHandlers) {
            // Fetch all the voter addresses associated with voterHandlers for this daoHandler. The result is an array of strings

            const voterAddresses: string[] = (
                await prisma.voterHandler.findMany({
                    where: {
                        daoHandlerId: daoHandler.id
                    },
                    select: {
                        voter: {
                            select: {
                                address: true
                            }
                        }
                    }
                })
            ).map((voterHandler) => voterHandler.voter.address)

            // Fetch all votes
            const dbVotesCount: number = await prisma.vote.count({
                where: {
                    daoHandlerId: daoHandler.id,
                    voterAddress: {
                        in: voterAddresses
                    }
                }
            })

            let apiVotesCount: number = 0
            // write a switch statement to handle each daoHandler type. Take each handler type from the DAOHandlerType enum in @senate/database
            switch (daoHandler.type) {
                case 'SNAPSHOT':
                    apiVotesCount = await getSnapshotVotesCount(
                        (daoHandler.decoder as Decoder).space,
                        voterAddresses
                    )
                    break
                case 'AAVE_CHAIN':
                    // do something
                    break
                case 'COMPOUND_CHAIN':
                    // do something
                    break
                case 'MAKER_EXECUTIVE':
                    // do something
                    break
                case 'MAKER_POLL':
                    // do something
                    break
                case 'UNISWAP_CHAIN':
                    // do something
                    break
                case 'MAKER_POLL_ARBITRUM':
                    // do something
                    break
                case 'ENS_CHAIN':
                    // do something
                    break
                case 'DYDX_CHAIN':
                    // do something
                    break
                case 'HOP_CHAIN':
                    // do something
                    break
                case 'GITCOIN_CHAIN':
                    // do something
                    break
            }

            voteMatchingPercentage.set(
                daoHandler.id,
                (dbVotesCount / apiVotesCount) * 100
            )
        }
    }
)

async function getSnapshotVotesCount(
    space: string,
    voterAddresses: string[]
): Promise<number> {}
