import { DAOType } from '@senate/common-types'

import { trpc } from '../../utils/trpc'
import { FollowedDAO } from '../../components/DAOs/FollowedDAO'
import { UnfollowedDAO } from '../../components/DAOs/UnfollowedDAO'
import NavBar from '../../components/navbar/NavBar'

import Dashboard from '../../components/Dashboard'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

const DAOs = () => {
    const session = useSession()

    const allDAOs = trpc.public.daos.useQuery()

    const followingDAOs = trpc.user.subscriptions.subscribedDAOs.useQuery()

    useEffect(() => {
        followingDAOs.refetch()
    }, [session])

    return (
        <div className="flex grow flex-col bg-[#1E1B20] p-5">
            <div>
                <div className="p-10">
                    <p className="mb-4 w-full text-[36px] font-medium text-white">
                        Your DAOs
                    </p>
                    <div className="grid grid-cols-1 place-items-center gap-10 min-[650px]:grid-cols-2 min-[900px]:grid-cols-3 min-[1150px]:grid-cols-4 min-[1500px]:grid-cols-5 min-[1650px]:grid-cols-6">
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
                            <p className="mb-4 text-[16px] text-white">
                                Loading...
                            </p>
                        )}
                    </div>
                </div>

                <div className="p-10">
                    <p className="mb-4 w-full text-[36px] font-medium text-white">
                        DAOs you can subscribe to
                    </p>
                    <div className="grid grid-cols-1 place-items-center gap-10 min-[650px]:grid-cols-2 min-[900px]:grid-cols-3 min-[1150px]:grid-cols-4 min-[1500px]:grid-cols-5 min-[1650px]:grid-cols-6">
                        {allDAOs.data ? (
                            allDAOs.data
                                .filter(
                                    (dao) =>
                                        !followingDAOs.data
                                            ?.map(
                                                (followedDAO) =>
                                                    followedDAO.name
                                            )
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
                            <p className="mb-4 text-[16px] text-white">
                                Loading...
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

const DAOsContainer = () => {
    return (
        <div className="flex min-h-screen flex-row">
            <NavBar />
            <Dashboard title="DAOs" component={<DAOs />} />
        </div>
    )
}

export default DAOsContainer
