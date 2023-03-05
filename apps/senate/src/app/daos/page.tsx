import SubscribedDAOs from './subscribedDAOs/page'
import UnsubscribedDAOs from './unsubscribedDAOs/page'
import SetupDailyBulletin from '../components/csr/SetupDailyBulletin'

import { currentUser } from '@clerk/nextjs/app-beta'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@senate/database'

const hasUserBulletin = async () => {
    if (process.env.OUTOFSERVICE === 'true') redirect('/outofservice')

    const userSession = await currentUser()

    const user = await prisma.user
        .findFirstOrThrow({
            where: {
                name: { equals: userSession?.web3Wallets[0]?.web3Wallet ?? '' }
            },
            select: {
                dailyBulletin: true
            }
        })
        .catch(() => {
            return { dailyBulletin: false }
        })

    return user.dailyBulletin
}

const hasSubscribedDAOs = async () => {
    const userSession = await currentUser()

    const user = await prisma.user
        .findFirstOrThrow({
            where: {
                name: { equals: userSession?.web3Wallets[0]?.web3Wallet ?? '' }
            },
            select: {
                id: true
            }
        })
        .catch(() => {
            return { id: '0' }
        })

    const subscriptionsList = await prisma.subscription.findMany({
        where: {
            userId: user.id
        },
        include: {
            dao: {
                include: {
                    handlers: true,
                    proposals: { where: { timeEnd: { gt: new Date() } } }
                }
            }
        },
        orderBy: {
            dao: {
                name: 'asc'
            }
        }
    })

    return subscriptionsList.length > 0
}

export default async function Home() {
    const session = await currentUser()

    const cookieStore = cookies()
    if (!cookieStore.get('hasSeenLanding')) redirect('/landing')

    const userBulletin = await hasUserBulletin()
    const userDAOs = await hasSubscribedDAOs()

    return (
        <main className='text-white'>
            <div className='w-full'>
                {!userBulletin && userDAOs && <SetupDailyBulletin />}

                {session && (
                    /* @ts-expect-error Server Component */
                    <SubscribedDAOs />
                )}

                {/* @ts-expect-error Server Component */}
                <UnsubscribedDAOs />
            </div>
        </main>
    )
}
