import { prisma } from '@senate/database'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../pages/api/auth/[...nextauth]'
import { Header } from '../components/csr/Header'
import SetupDailyBulletin from '../components/csr/SetupDailyBulletin'

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

export default async function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    const userBulletin = await hasUserBulletin()
    const userDAOs = await hasSubscribedDAOs()
    return (
        <div className='lg:pl-[92px]'>
            <Header title='DAOs' />
            <div className='pt-[92px] lg:pt-[192px]'>
                {!userBulletin && userDAOs && <SetupDailyBulletin />}
            </div>
            <div className='bg-[#1E1B20] p-5 lg:p-10'>
                <div className={`flex min-h-screen w-full grow flex-col`}>
                    <div className='flex grow flex-col'>{children}</div>
                </div>
            </div>
        </div>
    )
}
