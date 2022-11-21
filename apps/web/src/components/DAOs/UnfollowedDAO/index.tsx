import { inferProcedureOutput } from '@trpc/server'
import Image from 'next/image'

import { useState } from 'react'
import { AppRouter } from '../../../server/trpc/router/_app'
import { trpc } from '../../../utils/trpc'
import BackCard from './BackCard'
import FrontCard from './FrontCard'

export const UnfollowedDAO = (props: {
    dao: inferProcedureOutput<AppRouter['public']['daos']>[0]
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
