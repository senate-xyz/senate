import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../pages/api/auth/[...nextauth]'
import { SubscribedDAO } from './components/csr'
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
            },
            proposals: { where: { timeEnd: { gt: new Date() } } }
        }
    })
    return daosList
}

export default async function SubscribedDAOs() {
    const subscribedDAOs = await getSubscribedDAOs()

    const backgroundColors = await Promise.all(
        subscribedDAOs.map(async (dao) => {
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
                {subscribedDAOs.map((subscribedDAO, index) => {
                    return (
                        <SubscribedDAO
                            key={index}
                            daoId={subscribedDAO.id}
                            daoName={subscribedDAO.name}
                            daoPicture={subscribedDAO.picture}
                            bgColor={
                                backgroundColors.find(
                                    (dao) => dao?.daoId == subscribedDAO.id
                                )?.color
                            }
                            daoHandlers={subscribedDAO.handlers.map(
                                (handler) => handler.type
                            )}
                            activeProposals={subscribedDAO.proposals.length}
                        />
                    )
                })}
            </div>
        </main>
    )
}
