import { useSession } from 'next-auth/react'

import { DAOType } from '@senate/common-types'

import { trpc } from '../../../utils/trpc'
import { DaoItem } from './DaoItem'

const Watchlist = () => {
    const { data: session } = useSession()

    const DAOs = session
        ? trpc.user.userDaos.useQuery()
        : trpc.public.daos.useQuery()

    if (!DAOs.data) return <div>Loading</div>

    return (
        <div className="w-full flex flex-col">
            <p>Watchlist</p>

            <div className="w-full flex">
                <div className="grid grid-cols-4 gap-4">
                    {DAOs.data.map((dao: DAOType, index: number) => {
                        return <DaoItem dao={dao} key={index} />
                    })}
                </div>
            </div>
        </div>
    )
}

export default Watchlist
