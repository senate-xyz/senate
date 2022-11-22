import { DAOType } from '@senate/common-types'

import { trpc } from '../../../utils/trpc'
import { FollowedDAO } from '../../../components/DAOs/FollowedDAO'
import { UnfollowedDAO } from '../../../components/DAOs/UnfollowedDAO'
import NavBar from '../../../components/navbar/NavBar'

import DashboardHeader from '../../../components/DashboardHeader'

const DAOs = () => {
    const allDAOs = trpc.public.daos.useQuery()

    const followingDAOs = trpc.user.subscriptions.subscribedDAOs.useQuery()

    return (
        <div className="flex w-full flex-col">
            <div className="p-4">
                <p className="text-2xl">DAOs you are following</p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
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

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
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
        <div className="flex flex-row">
            <NavBar />
            <DashboardHeader title="DAOs" component={<DAOs />} />
        </div>
    )
}

export default DAOsContainer
