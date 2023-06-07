'use client'

import { useAccountModal } from '@rainbow-me/rainbowkit'
import { signOut, useSession } from 'next-auth/react'
import { useAccount } from 'wagmi'
import NotConnected from './components/csr/NotConnected'
import UserAddress from './components/csr/UserAddress'
import Link from 'next/link'
import { trpc } from '../../../server/trpcClient'

export default function Home() {
    const account = useAccount()
    const session = useSession()
    const { openAccountModal } = useAccountModal()

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
        <div className='flex min-h-screen flex-col gap-12'>
            <div className='flex flex-col gap-4'>
                <div className='text-[24px] font-light leading-[30px] text-white'>
                    Your Account
                </div>
                {!account.address || session.status != 'authenticated' ? (
                    <div>
                        <NotConnected />
                    </div>
                ) : (
                    <div className='flex flex-col gap-8'>
                        <UserAddress />
                        <button
                            className='w-fit bg-black px-4 py-2 font-bold text-white hover:scale-105'
                            onClick={() => {
                                openAccountModal ? openAccountModal() : null
                            }}
                        >
                            Disconnect Wallet
                        </button>
                        <div className='text-[12px] text-white'>
                            You can read our{' '}
                            <Link
                                href={
                                    'https://senate.notion.site/Senate-Labs-Terms-of-Service-990ca9e655094b6f9673a3ead572956a'
                                }
                                className='underline'
                                target='_blank'
                            >
                                Terms of Service
                            </Link>
                            ,{' '}
                            <Link
                                href={
                                    'https://senate.notion.site/Senate-Labs-Privacy-Policy-494e23d8a4e34d0189bfe07e0ae01bde'
                                }
                                className='underline'
                                target='_blank'
                            >
                                Privacy Policy
                            </Link>{' '}
                            and{' '}
                            <Link
                                href={
                                    'https://senate.notion.site/Senate-Labs-Cookie-Policy-b429fe7b181e4cfda95f404f480bfdc7'
                                }
                                className='underline'
                                target='_blank'
                            >
                                Cookie Policy
                            </Link>
                            .
                        </div>
                    </div>
                )}

                {featureFlags.data?.includes('testing_stuff') && (
                    <div className='flex max-w-[400px] flex-col gap-2 border border-red-400 p-2'>
                        <div className='font-bold text-white'>
                            Testing stuff
                        </div>
                        <div
                            className='w-max cursor-pointer bg-red-400 p-2 text-white'
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

                        <div className='text-white'>
                            Can take up to one minute
                        </div>
                        <div
                            className='w-max cursor-pointer bg-red-400 p-2 text-white'
                            onClick={() => {
                                randomQuorumAlert.mutate()
                            }}
                        >
                            Send random quorum alert{' '}
                        </div>

                        <div
                            className='w-max cursor-pointer bg-red-400 p-2 text-white'
                            onClick={() => {
                                lastQuorumAlert.mutate()
                            }}
                        >
                            Send last proposal quorum alert{' '}
                        </div>

                        <div
                            className='w-max cursor-pointer bg-red-400 p-2 text-white'
                            onClick={() => {
                                lastAaveQuorumAlert.mutate()
                            }}
                        >
                            Send last Aave proposal quorum alert
                        </div>

                        <div
                            className='w-max cursor-pointer bg-red-400 p-2 text-white'
                            onClick={() => {
                                lastUniswapQuorumAlert.mutate()
                            }}
                        >
                            Send last Uniswap proposal quorum alert
                        </div>

                        <div className='text-white'>
                            Because our backend service works on repeat every
                            minute and it must not repeat sending the same
                            notification every time, it saves "already sent"
                            notifications. Because of this, you can send one
                            notification only once.
                        </div>
                        <div className='text-white'>
                            You can delete all your saved, dispatched
                            notification with this button.
                        </div>

                        <div
                            className='w-max cursor-pointer bg-red-400 p-2 text-white'
                            onClick={() => {
                                deleteDispatchedNotifications.mutate()
                            }}
                        >
                            Delete dispatched notifications
                        </div>

                        <div
                            className='w-max cursor-pointer bg-red-400 p-2 text-white'
                            onClick={() => {
                                sendBulletin.mutate()
                            }}
                        >
                            Send bulletin
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
