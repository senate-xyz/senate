import { DAOType } from '@senate/common-types'

import { trpc } from '../../../utils/trpc'
import { FollowedDAO } from './FollowedDAO'
import { UnfollowedDAO } from './UnfollowedDAO'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const DAOs = () => {
    const allDAOs = trpc.public.daos.useQuery()
    const followingDAOs = trpc.user.userSubscribedDAOs.useQuery()

    return (
        <div className="flex w-full flex-col">
            <div className="p-4">
                <p className="text-2xl">DAOs you are following</p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {followingDAOs.data ? (
                        followingDAOs.data.map(
                            (dao: DAOType, index: number) => {
                                return (
                                    <FollowedDAO
                                        dao={dao}
                                        key={index}
                                        refreshDaos={() => {
                                            allDAOs.refetch()
                                            followingDAOs.refetch()
                                        }}
                                    />
                                )
                            }
                        )
                    ) : (
                        <div>Loading...</div>
                    )}
                </div>
            </div>

            <div className="p-4">
                <p className="text-2xl">DAOs you are not following yet...</p>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {allDAOs.data ? (
                        allDAOs.data
                            .filter(
                                (dao) =>
                                    !followingDAOs.data
                                        ?.map((followedDAO) => followedDAO.name)
                                        .includes(dao.name)
                            )
                            .map((dao: DAOType, index: number) => {
                                return (
                                    <UnfollowedDAO
                                        dao={dao}
                                        key={index}
                                        refreshDaos={() => {
                                            allDAOs.refetch()
                                            followingDAOs.refetch()
                                        }}
                                    />
                                )
                            })
                    ) : (
                        <div>Loading...</div>
                    )}
                </div>
            </div>
        </div>
    )
}

const DAOsContainer = () => {
    return (
        <div className="h-full w-full bg-slate-700">
            <div className="flex w-full flex-col">
                <div className="flex h-48 items-center justify-between bg-slate-800 px-10">
                    <h1 className="text-5xl">DAOs</h1>
                    <ConnectButton />
                </div>
                <DAOs />
            </div>
        </div>
    )
}

export default DAOsContainer
