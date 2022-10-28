import { useSession } from 'next-auth/react'

import { DAOType } from '@senate/common-types'

import { trpc } from '../../../utils/trpc'
import { DaoItem } from './DaoItem'

const Watchlist = () => {
    const { data: session } = useSession()

    const DAOs = trpc.useQuery([session ? 'user.daos' : 'public.daos'])

    const subscribe = trpc.useMutation('user.subscribe')
    const unsubscribe = trpc.useMutation('user.unsubscribe')

    const utils = trpc.useContext()

    const handleSubscribe = async (daoId: string) => {
        subscribe.mutate(
            { daoId: daoId },
            {
                onSuccess() {
                    utils.invalidateQueries()
                },
            }
        )
        utils.invalidateQueries()
    }

    const handleUnsubscribe = async (daoId: string) => {
        unsubscribe.mutate(
            { daoId: daoId },
            {
                onSuccess() {
                    utils.invalidateQueries()
                },
            }
        )
        utils.invalidateQueries()
    }

    if (!DAOs.data) return <div>Loading</div>

    return (
        <div className="w-full flex flex-col">
            <p>Watchlist</p>

            <div className="w-full flex">
                <div className="grid grid-cols-4 gap-4">
                    {DAOs.data.map((dao: DAOType, index: number) => {
                        return (
                            <DaoItem
                                dao={dao}
                                key={index}
                                handleSubscribe={handleSubscribe}
                                handleUnsubscribe={handleUnsubscribe}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Watchlist
