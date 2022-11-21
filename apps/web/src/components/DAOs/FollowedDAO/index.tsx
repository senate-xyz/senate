import { inferProcedureOutput } from '@trpc/server'

import { useState } from 'react'
import { AppRouter } from '../../../server/trpc/router/_app'
import BackCard from './BackCard'
import FrontCard from './FrontCard'

export const FollowedDAO = (props: {
    dao: inferProcedureOutput<
        AppRouter['user']['subscriptions']['subscribedDAOs']
    >[0]
    refreshDaos: () => void
}) => {
    const [showMenu, setShowMenu] = useState(false)

    return (
        <div>
            {showMenu ? (
                <BackCard
                    dao={props.dao}
                    refreshDaos={props.refreshDaos}
                    setShowMenu={setShowMenu}
                />
            ) : (
                <FrontCard
                    dao={props.dao}
                    refreshDaos={props.refreshDaos}
                    setShowMenu={setShowMenu}
                />
            )}
        </div>
    )
}
