import { inferProcedureOutput } from '@trpc/server'

import { useState } from 'react'
import { AppRouter } from '../../../server/trpc/router/_app'
import BackCard from './BackCard'
import FrontCard from './FrontCard'

export const UnfollowedDAO = (props: {
    dao: inferProcedureOutput<AppRouter['public']['daos']>[0]
    refreshDaos: () => void
}) => {
    const [showMenu, setShowMenu] = useState(false)

    return (
        <div data-cy="unfollowed">
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
