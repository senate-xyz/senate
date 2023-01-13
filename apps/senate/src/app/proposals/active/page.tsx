import { prisma } from '@senate/database'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from '../../../pages/api/auth/[...nextauth]'
import { Filters } from './components/csr/Filters'
import Table from './components/ssr/Table'

const getSubscribedDAOs = async () => {
    const session = await unstable_getServerSession(authOptions())
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

    const daosList = await prisma.dAO.findMany({
        where: {
            subscriptions: {
                some: {
                    user: { is: user }
                }
            }
        },
        orderBy: {
            id: 'asc'
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
export default async function Home() {
    const subscribedDAOs = await getSubscribedDAOs()

    const subscripions = subscribedDAOs.map((subDAO) => {
        return { id: subDAO.id, name: subDAO.name }
    })

    return (
        <div>
            <Filters subscriptions={subscripions} />
            {/* @ts-expect-error Server Component */}
            <Table />
        </div>
    )
}
