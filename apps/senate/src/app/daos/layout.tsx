import { prisma } from '@senate/database'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../pages/api/auth/[...nextauth]'
import { Header } from '../components/csr/Header'
import SetupDailyBulletin from '../components/csr/SetupDailyBulletin'
import 'server-only'

const hasUserBulletin = async () => {
    const session = await getServerSession(authOptions())
    const userAddress = session?.user?.name ?? ''

    const user = await prisma.user
        .findFirstOrThrow({
            where: {
                name: { equals: userAddress }
            },
            select: {
                emaildailybulletin: true
            }
        })
        .catch(() => {
            return { emaildailybulletin: false }
        })

    return user.emaildailybulletin
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
            userid: user.id
        },
        include: {
            dao: {
                include: {
                    handlers: true,
                    proposals: { where: { timeend: { gt: new Date() } } }
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
        <div className='bg-[#1E1B20] lg:pl-[92px]'>
            <Header title='DAOs' />
            <div className='pt-[92px] lg:pt-[192px]'>
                {!userBulletin && userDAOs && <SetupDailyBulletin />}
            </div>
            <div className='p-5 lg:p-10'>
                <div className={`flex min-h-screen w-full grow flex-col`}>
                    <div className='flex grow flex-col'>{children}</div>
                </div>
            </div>
        </div>
    )
}
