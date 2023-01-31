import { Prisma, PrismaClient } from '@prisma/client'
import { IBackOffOptions, backOff } from 'exponential-backoff'
import { log_prisma } from '@senate/axiom'

function RetryTransactions(options?: Partial<IBackOffOptions>) {
    return Prisma.defineExtension((prisma) =>
        prisma.$extends({
            client: {
                $transaction(...args: any) {
                    return backOff(
                        // eslint-disable-next-line prefer-spread
                        () => prisma.$transaction.apply(prisma, args),
                        {
                            retry: (e) => {
                                // Retry the transaction only if the error was due to a write conflict or deadlock
                                // See: https://www.prisma.io/docs/reference/api-reference/error-reference#p2034
                                log_prisma.log({
                                    level: 'warn',
                                    message: `Retrying prisma transaction`,
                                    error: e
                                })
                                return e.code === 'P2034' || e.code === 'P1001'
                            },
                            ...options
                        }
                    )
                }
            } as { $transaction: (typeof prisma)['$transaction'] }
        })
    )
}

declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined
}

const p = global.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
    global.prisma = p
}

export const prisma = p.$extends(
    RetryTransactions({
        jitter: 'full',
        numOfAttempts: 3
    })
)
