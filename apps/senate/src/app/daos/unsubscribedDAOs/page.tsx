import { UnsubscribedDAO } from './components/csr'
import { getAverageColor } from 'fast-average-color-node'
import { prisma } from '@senate/database'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../pages/api/auth/[...nextauth]'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

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
    if (process.env.OUTOFSERVICE === 'true') redirect('/outofservice')
    const cookieStore = cookies()
    if (!cookieStore.get('hasSeenLanding')) redirect('/landing')

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
        <div>
            {unsubscribedDAOs.length > 0 && (
                <main className='p-10'>
                    <p className='mb-4 w-full text-[36px] font-semibold text-white'>
                        DAOs you can subscribe to
                    </p>

                    <div className='grid grid-cols-1 place-items-start gap-10 min-[650px]:grid-cols-2 min-[900px]:grid-cols-3 min-[1150px]:grid-cols-4 min-[1500px]:grid-cols-5'>
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
