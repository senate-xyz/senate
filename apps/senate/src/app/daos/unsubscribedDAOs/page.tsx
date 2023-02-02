import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../pages/api/auth/[...nextauth]'
import { UnsubscribedDAO } from './components/csr'
import { getAverageColor } from 'fast-average-color-node'
import { prisma } from '@senate/database'

const getSubscribedDAOs = async () => {
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
            }
        }
    })
    return daosList
}

const getAllDAOs = async () => {
    const daosList = await prisma.dAO.findMany({
        where: {},
        orderBy: {
            id: 'asc'
        },
        distinct: 'id',
        include: {
            handlers: true,
            subscriptions: {
                take: 0 //needed in order to maintain type safety
            }
        }
    })
    return daosList
}

export default async function UnsubscribedDAOs() {
    const allDAOs = await getAllDAOs()
    const subscribedDAOs = await getSubscribedDAOs()

    const unsubscribedDAOs = allDAOs.filter(
        (dao) =>
            !subscribedDAOs
                .map((subscribedDAO) => subscribedDAO.name)
                .includes(dao.name)
    )

    const backgroundColors = await Promise.all(
        unsubscribedDAOs.map(async (dao) => {
            if (!dao.picture) return

            const color = await getAverageColor(
                'https://senatelabs.xyz/' + dao.picture + '.svg',
                { mode: 'precision', algorithm: 'sqrt' }
            ).then((color) => color)
            return {
                daoId: dao.id,
                color: `${color.hex}`
            }
        })
    )

    return (
        <main>
            <div className='grid grid-cols-1 place-items-start gap-10 min-[650px]:grid-cols-2 min-[900px]:grid-cols-3 min-[1150px]:grid-cols-4 min-[1500px]:grid-cols-5 min-[1650px]:grid-cols-6'>
                {unsubscribedDAOs.map((unsubscribedDAO, index) => {
                    return (
                        <UnsubscribedDAO
                            key={index}
                            daoId={unsubscribedDAO.id}
                            daoName={unsubscribedDAO.name}
                            daoPicture={unsubscribedDAO.picture}
                            bgColor={
                                backgroundColors.find(
                                    (dao) => dao?.daoId == unsubscribedDAO.id
                                )?.color
                            }
                            daoHandlers={unsubscribedDAO.handlers.map(
                                (handler) => handler.type
                            )}
                        />
                    )
                })}
            </div>
        </main>
    )
}
