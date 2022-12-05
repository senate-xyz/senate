import { DAOType } from '@senate/common-types'

import { trpc } from '../../../utils/trpc'
import { FollowedDAO } from '../../../components/DAOs/FollowedDAO'
import { UnfollowedDAO } from '../../../components/DAOs/UnfollowedDAO'
import NavBar from '../../../components/navbar/NavBar'

import Dashboard from '../../../components/Dashboard'

const DAOs = () => {
    const allDAOs = trpc.public.daos.useQuery()

    const followingDAOs = trpc.user.subscriptions.subscribedDAOs.useQuery()

    return (
        <div className="flex w-full flex-col items-center bg-[#1E1B20]">
            <div className="p-10 max-w-fit">
                <p className="mb-4 text-[36px] text-white">Your DAOs</p>
                <div className="m-auto grid grid-cols-1 gap-10 md:max-2xl:grid-cols-3 2xl:grid-cols-6">
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

            <div className="p-10 max-w-fit">
                <p className="mb-4 text-[36px] text-white">
                    DAOs you can subscribe to
                </p>
                <div className="m-auto grid grid-cols-1 gap-10 md:max-2xl:grid-cols-3 2xl:grid-cols-6">
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
        <div className="flex w-full flex-row" data-cy="daos">
            <NavBar />
            <Dashboard title="DAOs" component={<DAOs />} />
        </div>
    )
}

export default DAOsContainer
