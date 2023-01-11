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

export default async function SubscribedDAOs() {
    const subscribedDAOs = await getData()

    return (
        <main>
            {subscribedDAOs.map((subscribedDAO, index) => {
                return <SubscribedDAO key={index} dao={subscribedDAO.name} />
            })}
        </main>
    )
}

const SubscribedDAO = (props: { dao: string }) => {
    return <main>{props.dao}</main>
}
