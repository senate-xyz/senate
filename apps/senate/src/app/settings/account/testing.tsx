'use client'

import {signOut} from 'next-auth/react'
import {trpc} from '../../../server/trpcClient'

const Testing = () => {
    const featureFlags = trpc.public.featureFlags.useQuery()

    const deleteUser = trpc.accountSettings.deleteUser.useMutation()
    const randomQuorumAlert = trpc.testing.randomQuorumAlert.useMutation()
    const lastQuorumAlert = trpc.testing.lastQuorumAlert.useMutation()
    const lastAaveQuorumAlert = trpc.testing.lastAaveQuorumAlert.useMutation()
    const lastUniswapQuorumAlert =
        trpc.testing.lastUniswapQuorumAlert.useMutation()
    const deleteDispatchedNotifications =
        trpc.testing.deleteDispatchedNotifications.useMutation()
    const sendBulletin = trpc.testing.sendBulletin.useMutation()

    return (
        featureFlags.data?.includes('testing_stuff') && (
            <div className='flex max-w-[400px] flex-col gap-2 border border-red-400 p-2'>
                <div className='font-bold text-white'>Testing stuff</div>
                <div/>
                <div/>
                <div
                    className='w-max cursor-pointer bg-red-400 p-2 text-white active:bg-red-500'
                    onClick={() => {
                        deleteUser.mutate(void 0, {
                            onSuccess: () => {
                                signOut()
                            }
                        })
                    }}
                >
                    Delete my own user!
                </div>
                <div/>
                <div/>
                <div className='text-white'>Can take up to one minute</div>
                <div
                    className='w-max cursor-pointer bg-red-400 p-2 text-white active:bg-red-500'
                    onClick={() => {
                        randomQuorumAlert.mutate()
                    }}
                >
                    Send random quorum alert
                </div>
                <div
                    className='w-max cursor-pointer bg-red-400 p-2 text-white active:bg-red-500'
                    onClick={() => {
                        lastQuorumAlert.mutate()
                    }}
                >
                    Send last proposal quorum alert
                </div>
                <div
                    className='w-max cursor-pointer bg-red-400 p-2 text-white active:bg-red-500'
                    onClick={() => {
                        lastAaveQuorumAlert.mutate()
                    }}
                >
                    Send last Aave proposal quorum alert
                </div>
                <div
                    className='w-max cursor-pointer bg-red-400 p-2 text-white active:bg-red-500'
                    onClick={() => {
                        lastUniswapQuorumAlert.mutate()
                    }}
                >
                    Send last Uniswap proposal quorum alert
                </div>
                <div className='text-white'>
                    Because our backend service works on repeat every minute and
                    it must not repeat sending the same notification every time,
                    it saves "already sent" notifications. Because of this, you
                    can send one notification only once.
                </div>
                <div className='text-white'>
                    You can delete all your saved, dispatched notification with
                    this button.
                </div>
                <div
                    className='w-max cursor-pointer bg-red-400 p-2 text-white active:bg-red-500'
                    onClick={() => {
                        deleteDispatchedNotifications.mutate()
                    }}
                >
                    Delete dispatched notifications
                </div>
                <div/>
                <div/>
                <div
                    className='w-max cursor-pointer bg-red-400 p-2 text-white active:bg-red-500'
                    onClick={() => {
                        sendBulletin.mutate()
                    }}
                >
                    Send bulletin
                </div>
            </div>
        )
    )
}

export default Testing
