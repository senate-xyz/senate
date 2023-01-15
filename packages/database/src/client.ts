import { Prisma, PrismaClient } from '@prisma/client'
import { IBackOffOptions, backOff } from 'exponential-backoff'

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
                                return e.code === 'P2034'
                            },
                            ...options
                        }
                    )
                }
            } as { $transaction: (typeof prisma)['$transaction'] }
        })
    )
}

export const prisma = new PrismaClient().$extends(
    RetryTransactions({
        jitter: 'full',
        numOfAttempts: 5
    })
)

//export const prisma = new PrismaClient()
