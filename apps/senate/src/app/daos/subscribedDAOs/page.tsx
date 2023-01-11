import SubscribedDAO from './item/page'
import { serverQuery } from '../../../helpers/trpcHelpers'
import { unstable_getServerSession } from 'next-auth/next'
import { getAuthOptions } from '../../../pages/api/auth/[...nextauth]'

const getData = async () => {
    const session = await unstable_getServerSession(getAuthOptions())
    const userAddress = session?.user?.name ?? ''
    return await serverQuery.user.subscriptions.subscribedDAOs({
        userAddress: userAddress
    })
}

export const SubscribedDAOs = async () => {
    const subscribedDAOs = await getData()

    return (
        <main>
            {subscribedDAOs.map((subscribedDAO, index) => {
                return <SubscribedDAO key={index} dao={subscribedDAO.name} />
            })}
        </main>
    )
}
