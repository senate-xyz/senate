import { currentUser } from '@clerk/nextjs/app-beta'
import { prisma } from '@senate/database'
import ConnectWalletModal from '../components/csr/ConnectWalletModal'
import { Filters } from './components/csr/Filters'
import Table from './components/ssr/Table'

export const revalidate = 300

const getSubscribedDAOs = async () => {
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

    const daosList = await prisma.dAO.findMany({
        where: {
            subscriptions: {
                some: {
                    user: { is: user }
                }
            }
        },
        orderBy: {
            name: 'asc'
        },
        distinct: 'id',
        include: {
            handlers: true,
            subscriptions: {
                where: {
                    userId: { contains: user.id }
                }
            },
            proposals: { where: { timeEnd: { gt: new Date() } } }
        }
    })
    return daosList
}
export default async function Home({
    searchParams
}: {
    params: { slug: string }
    searchParams?: { from: string; end: number; voted: string }
}) {
    const subscribedDAOs = await getSubscribedDAOs()

    const subscripions = subscribedDAOs.map((subDAO) => {
        return { id: subDAO.id, name: subDAO.name }
    })

    return (
        <div className='relative'>
            <div className='z-10'>
                <ConnectWalletModal />
            </div>
            <Filters subscriptions={subscripions} />
            {/* @ts-expect-error Server Component */}
            <Table
                from={searchParams?.from}
                end={searchParams?.end}
                voted={searchParams?.voted}
            />
        </div>
    )
}
