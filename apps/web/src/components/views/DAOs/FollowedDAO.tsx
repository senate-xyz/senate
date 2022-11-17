import Image from 'next/image'

import { trpc } from '../../../utils/trpc'
import { inferProcedureOutput } from '@trpc/server'
import { AppRouter } from '../../../server/trpc/router/_app'
import { useState } from 'react'

export const FollowedDAO = (props: {
    dao: inferProcedureOutput<AppRouter['user']['userSubscribedDAOs']>[0]
    refreshDaos: () => void
}) => {
    const [showMenu, setShowMenu] = useState(false)

    const unsubscribe = trpc.user.userUnsubscribe.useMutation()
    const refreshStatus = trpc.public.refreshStatus.useQuery({
        daoId: props.dao.id,
    })
    const activeProposalsForDao = trpc.public.activeProposalsForDao.useQuery({
        daoId: props.dao.id,
    })

    if (!refreshStatus.data) return <div>Loading...</div>

    return (
        <div>
            {showMenu ? (
                <div className="mt-4 mr-1 mb-1 flex h-80 w-60 flex-col items-center justify-between rounded bg-gray-300 text-sm font-bold text-white shadow">
                    <div className="flex h-full w-full flex-col items-center justify-between">
                        <div className="flex flex-col items-center gap-2 pt-5">
                            <div className="flex w-full flex-row justify-between">
                                <p>Notifications</p>
                                <p
                                    className="cursor-pointer"
                                    onClick={() => {
                                        setShowMenu(false)
                                    }}
                                >
                                    X
                                </p>
                            </div>
                            <p>Get daily emails about:</p>
                            <div className="flex w-full flex-row items-center justify-between gap-2">
                                <p>New Proposals</p>
                                <label className="relative inline-flex cursor-pointer items-center bg-gray-700">
                                    <input
                                        type="checkbox"
                                        value=""
                                        className="peer sr-only"
                                    />
                                    <div className="peer h-6 w-11 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5  after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-gray-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                                </label>
                            </div>
                            <div className="flex w-full flex-row items-center justify-between gap-2">
                                <p>Proposal ending soon</p>
                                <label className="relative inline-flex cursor-pointer items-center bg-gray-700">
                                    <input
                                        type="checkbox"
                                        value=""
                                        className="peer sr-only"
                                    />
                                    <div className="peer h-6 w-11 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5  after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-gray-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                                </label>
                            </div>
                        </div>

                        <button
                            className="h-20 w-full bg-gray-500 text-xl font-bold text-black"
                            onClick={() => {
                                unsubscribe.mutate(
                                    {
                                        daoId: props.dao.id,
                                    },
                                    {
                                        onSuccess() {
                                            refreshStatus.refetch()
                                            props.refreshDaos()
                                            setShowMenu(false)
                                        },
                                    }
                                )
                            }}
                        >
                            Unsubscribe
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    className="mt-4 mr-1 mb-1 flex h-80 w-60 flex-col items-center justify-between rounded bg-gray-500 text-sm font-bold text-white shadow"
                    onClick={() => {
                        setShowMenu(true)
                    }}
                >
                    <div className="flex flex-col items-center pt-5">
                        <Image
                            width="96"
                            height="96"
                            src={props.dao.picture}
                            alt="dao Image"
                        />

                        <div className="px-6 py-4">
                            <div className="mb-2 text-3xl font-bold">
                                {props.dao.name}
                            </div>
                        </div>

                        <div className="flex flex-row">
                            {props.dao.handlers.map(
                                (handler, index: number) => {
                                    switch (handler.type) {
                                        case 'BRAVO1':
                                        case 'BRAVO2':
                                        case 'MAKER_POLL_CREATE':
                                        case 'MAKER_POLL_VOTE':
                                        case 'MAKER_EXECUTIVE':
                                            return (
                                                <Image
                                                    key={index}
                                                    width="24"
                                                    height="24"
                                                    src="https://assets.coingecko.com/coins/images/279/thumb/ethereum.png"
                                                    alt="dao Image"
                                                />
                                            )

                                        case 'SNAPSHOT':
                                            return (
                                                <Image
                                                    key={index}
                                                    width="24"
                                                    height="24"
                                                    src="https://avatars.githubusercontent.com/u/72904068?s=200&v=4"
                                                    alt="dao Image"
                                                />
                                            )
                                    }
                                }
                            )}
                        </div>
                        <div>
                            {
                                activeProposalsForDao.data?.filter(
                                    (proposal) =>
                                        proposal.data?.['timeEnd'] > Date.now()
                                ).length
                            }{' '}
                            Active Proposals
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
