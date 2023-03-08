import SubscribedDAOs from './subscribedDAOs/page'
import UnsubscribedDAOs from './unsubscribedDAOs/page'
import SetupDailyBulletin from '../components/csr/SetupDailyBulletin'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@senate/database'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../pages/api/auth/[...nextauth]'

const hasUserBulletin = async () => {
    const session = await getServerSession(authOptions())
    const userAddress = session?.user?.name ?? ''

    const user = await prisma.user
        .findFirstOrThrow({
            where: {
                name: { equals: userAddress }
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
    const session = await getServerSession(authOptions())
    const userAddress = session?.user?.name ?? ''

    const user = await prisma.user
        .findFirstOrThrow({
            where: {
                name: { equals: userAddress }
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
    if (process.env.OUTOFSERVICE === 'true') redirect('/outofservice')
    const cookieStore = cookies()
    if (!cookieStore.get('hasSeenLanding')) redirect('/landing')

    const userBulletin = await hasUserBulletin()
    const userDAOs = await hasSubscribedDAOs()

    return (
        <main className='text-white'>
            <div className='flex w-full flex-col gap-12'>
                {!userBulletin && userDAOs && <SetupDailyBulletin />}

                {
                    /* @ts-expect-error Server Component */
                    <SubscribedDAOs />
                }

                {/* @ts-expect-error Server Component */}
                <UnsubscribedDAOs />
            </div>
        </main>
    )
}
