import Image from 'next/image'
import { useState } from 'react'
import { FaBell, FaDiscord, FaSlack, FaTelegram } from 'react-icons/fa'

import { trpc } from '../../../utils/trpc'
import { inferProcedureOutput } from '@trpc/server'
import { AppRouter } from '../../../server/trpc/router/_app'

export const FollowedDAO = (props: {
    dao: inferProcedureOutput<AppRouter['user']['userSubscribedDAOs']>[0]
}) => {
    const [showModal, setShowModal] = useState(false)

    const subscribe = trpc.user.userSubscribe.useMutation()
    const unsubscribe = trpc.user.userUnsubscribe.useMutation()

    const refreshDao = trpc.public.refreshDao.useMutation({
        onSuccess: () => {
            refreshStatus.refetch()
        },
    })
    const refreshStatus = trpc.public.refreshStatus.useQuery({
        daoId: props.dao.id,
    })

    const [subscribed, setSubscribed] = useState(
        props.dao.subscriptions.length > 0 ? true : false
    )

    if (!refreshStatus.data) return <div>Loading...</div>

    return (
        <div>
            {showModal ? (
                <>
                    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
                        <div className="relative my-6 mx-auto w-auto max-w-3xl">
                            {/*content*/}
                            <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-start justify-between rounded-t border-b border-solid border-slate-200 p-5">
                                    <h3 className="text-3xl font-semibold">
                                        Modal Title
                                    </h3>
                                    <button
                                        className="float-right ml-auto border-0 bg-transparent p-1 text-3xl font-semibold leading-none text-black opacity-5 outline-none focus:outline-none"
                                        onClick={() => setShowModal(false)}
                                    >
                                        <span className="block h-6 w-6 bg-transparent text-2xl text-black opacity-5 outline-none focus:outline-none">
                                            ×
                                        </span>
                                    </button>
                                </div>
                                {/*body*/}
                                <div className="relative flex-auto p-6">
                                    <p className="my-4 text-lg leading-relaxed text-slate-500">
                                        Modal text
                                    </p>
                                    {subscribed ? (
                                        <button
                                            className="mr-1 mb-1 rounded bg-red-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-red-600"
                                            type="button"
                                            onClick={() => {
                                                unsubscribe.mutate(
                                                    {
                                                        daoId: props.dao.id,
                                                    },
                                                    {
                                                        onSuccess() {
                                                            setSubscribed(false)
                                                            setShowModal(false)
                                                        },
                                                    }
                                                )
                                            }}
                                        >
                                            Unsubscribe
                                        </button>
                                    ) : (
                                        <button
                                            className="mr-1 mb-1 rounded bg-emerald-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
                                            type="button"
                                            onClick={() => {
                                                subscribe.mutate(
                                                    {
                                                        daoId: props.dao.id,
                                                    },
                                                    {
                                                        onSuccess() {
                                                            setSubscribed(true)
                                                            setShowModal(false)
                                                        },
                                                    }
                                                )
                                            }}
                                        >
                                            Subscribe
                                        </button>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <div>Last refresh at :</div>
                                    <div>
                                        {`${refreshStatus.data.lastRefresh}`}
                                    </div>
                                </div>
                                {refreshStatus.data.refreshStatus == 'DONE' ? (
                                    <button
                                        className="mr-1 mb-1 rounded bg-blue-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-blue-600"
                                        type="button"
                                        onClick={() => {
                                            refreshDao.mutate({
                                                daoId: props.dao.id,
                                            })
                                        }}
                                    >
                                        Refresh DAO
                                    </button>
                                ) : (
                                    <button
                                        className="mr-1 mb-1 rounded bg-orange-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-red-600"
                                        type="button"
                                    >
                                        Refresh pending
                                    </button>
                                )}

                                {/*footer*/}
                                <div className="flex items-center justify-end rounded-b border-t border-solid border-slate-200 p-6">
                                    <button
                                        className="mr-1 mb-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
                </>
            ) : null}
            <button
                onClick={() => setShowModal(true)}
                type="button"
                className="mr-1 mb-1 rounded bg-gray-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-500"
            >
                <div className="mt-4 flex h-80 w-60 flex-col items-center">
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
                        {props.dao.handlers.map((handler, index: number) => {
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
                        })}
                    </div>
                </div>
            </button>
        </div>
    )
}
