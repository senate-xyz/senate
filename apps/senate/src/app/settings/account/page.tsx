'use client'

import { useAccountModal } from '@rainbow-me/rainbowkit'
import { useSession } from 'next-auth/react'
import { useAccount } from 'wagmi'
import NotConnected from './components/csr/NotConnected'
import UserAddress from './components/csr/UserAddress'
import Link from 'next/link'
import Testing from './testing'

export default function Home() {
    const account = useAccount()
    const session = useSession()
    const { openAccountModal } = useAccountModal()

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

                <Testing />
            </div>
        </div>
    )
}
