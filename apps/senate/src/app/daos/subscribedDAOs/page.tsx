import { serverQuery } from '../../../helpers/trpcHelpers'
import { unstable_getServerSession } from 'next-auth/next'
import { getAuthOptions } from '../../../pages/api/auth/[...nextauth]'
import { SubscribedDAO } from './item'

const getData = async () => {
    const session = await unstable_getServerSession(getAuthOptions())
    const userAddress = session?.user?.name ?? ''
    return await serverQuery.user.subscriptions.subscribedDAOs({
        userAddress: userAddress
    })
}

export default async function SubscribedDAOs() {
    const subscribedDAOs = await getData()

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
