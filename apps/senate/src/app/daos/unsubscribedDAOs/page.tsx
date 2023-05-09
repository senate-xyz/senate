import { UnsubscribedDAO } from './components/csr'
import { getAverageColor } from 'fast-average-color-node'
import { prisma } from '@senate/database'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../pages/api/auth/[...nextauth]'
import 'server-only'

const getSubscribedDAOs = async () => {
    const session = await getServerSession(authOptions())
    const userAddress = session?.user?.name ?? ''

    const user = await prisma.user
        .findFirstOrThrow({
            where: {
                address: { equals: userAddress }
            },
            select: {
                id: true
            }
        })
        .catch(() => {
            return { id: '0' }
        })

    const daosList = await prisma.dao.findMany({
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
        include: {
            handlers: true,
            subscriptions: {
                where: {
                    userid: { contains: user.id }
                }
            }
        }
    })
    return daosList
}

const getAllDAOs = async () => {
    const daosList = await prisma.dao.findMany({
        where: {},
        orderBy: {
            name: 'asc'
        },
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

    const unsubscribedDAOs = allDAOs
        .filter(
            (dao) =>
                !subscribedDAOs
                    .map((subscribedDAO) => subscribedDAO.name)
                    .includes(dao.name)
        )
        .sort((a, b) => a.name.localeCompare(b.name))

    const backgroundColors = await Promise.all(
        unsubscribedDAOs.map(async (dao) => {
            const color = await getAverageColor(
                process.env.NEXT_PUBLIC_WEB_URL + dao.picture + '.svg',
                {
                    mode: 'precision',
                    algorithm: 'sqrt'
                }
            )
                .then((color) => color)
                .catch(() => {
                    return { hex: '#5A5A5A' }
                })
            return {
                daoId: dao.id,
                color: `${color.hex}`
            }
        })
    )

    return (
        <div>
            {unsubscribedDAOs.length > 0 && (
                <main>
                    <p className='mb-4 w-full text-[36px] font-semibold text-white'>
                        DAOs you can subscribe to
                    </p>

                    <div className='grid grid-cols-1  place-items-center gap-10 min-[650px]:grid-cols-2 min-[900px]:grid-cols-3 lg:place-items-start min-[1200px]:grid-cols-4 min-[1500px]:grid-cols-5 min-[1800px]:grid-cols-6 min-[2200px]:grid-cols-7 min-[2300px]:grid-cols-8 min-[2500px]:grid-cols-9 min-[3000px]:grid-cols-10'>
                        {unsubscribedDAOs.map((unsubscribedDAO, index) => {
                            return (
                                <UnsubscribedDAO
                                    key={index}
                                    daoId={unsubscribedDAO.id}
                                    daoName={unsubscribedDAO.name}
                                    daoPicture={unsubscribedDAO.picture}
                                    bgColor={
                                        backgroundColors.find(
                                            (dao) =>
                                                dao?.daoId == unsubscribedDAO.id
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
            )}
        </div>
    )
}
