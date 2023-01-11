import { serverQuery } from '../../../helpers/trpcHelpers'
import { unstable_getServerSession } from 'next-auth/next'
import { getAuthOptions } from '../../../pages/api/auth/[...nextauth]'
import { UnsubscribedDAO } from './item'
import { getAverageColor } from 'fast-average-color-node'

const getData = async () => {
    const session = await unstable_getServerSession(getAuthOptions())
    const userAddress = session?.user?.name ?? ''

    const subscribedDAOs = await serverQuery.user.subscriptions.subscribedDAOs({
        userAddress: userAddress
    })
    const allDAOs = await serverQuery.public.daos()

    return allDAOs.filter(
        (dao) =>
            !subscribedDAOs
                .map((subscribedDAO) => subscribedDAO.name)
                .includes(dao.name)
    )
}

export default async function UnsubscribedDAOs() {
    const unsubscribedDAOs = await getData()

    const backgroundColors = await Promise.all(
        unsubscribedDAOs.map(async (dao) => {
            if (!dao.picture) return

            const color = await getAverageColor(
                'https://senatelabs.xyz/' + dao.picture + '.svg'
            ).then((color) => color)
            return {
                daoId: dao.id,
                color: `${color.hex}50`
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
