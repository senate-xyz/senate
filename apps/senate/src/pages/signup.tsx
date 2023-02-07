'use client'

import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import Image from 'next/image'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { trpc } from '../server/trpcClient'
import RootProvider from '../app/providers/providers'

const WrapperHome = () => {
    return (
        <RootProvider>
            <Home />
        </RootProvider>
    )
}

export default WrapperHome

const Home = () => {
    const router = useRouter()

    const storeEmail = trpc.accountSettings.setEmail.useMutation()
    const storeTerms = trpc.accountSettings.setTerms.useMutation()
    const storeNewUser = trpc.accountSettings.setNewUser.useMutation()

    const newUser = trpc.accountSettings.isNewUser.useQuery()

    const [email, setEmail] = useState('')
    const [terms, setTerms] = useState(false)

    const [showSigninAnimation, setShowSigninAnimation] = useState(false)

    return (
        <div className='flex min-h-screen w-full flex-row bg-black'>
            <div className='flex min-h-full w-full flex-col'>
                {showSigninAnimation ? (
                    <div className='flex h-full w-full flex-row items-center justify-center'>
                        <Image
                            src='/assets/Senate_Logo/Senate_Animation.gif'
                            alt={''}
                            width={300}
                            height={300}
                        />
                    </div>
                ) : (
                    <div>
                        <div className='flex w-full flex-row justify-between px-12 pt-[20px]'>
                            <div className='flex flex-row items-center'>
                                <Image
                                    src='/assets/Senate_Logo/64/White.svg'
                                    width={64}
                                    height={64}
                                    alt={'Senate logo'}
                                />
                                <div className='relative -left-2 -top-1 text-[40px] font-semibold text-white'>
                                    senate
                                </div>
                            </div>
                            <div>
                                <ConnectButton showBalance={false} />
                            </div>
                        </div>

                        <div className='flex h-full w-full flex-row items-center justify-center '>
                            <div className='flex w-[40%] flex-col gap-3'>
                                <div className='text-[36px] font-bold text-white'>
                                    Welcome to Senate
                                </div>
                                <div className='text-[15px] font-normal text-white'>
                                    Senate works best with your email address,
                                    so we can notify you of new proposals from
                                    the DAOs you follow.
                                </div>

                                <div className='text-[18px] font-light text-white'>
                                    Your Email Address
                                </div>

                                <div className='flex h-[46px] flex-col'>
                                    <input
                                        className='h-full w-full bg-[#D9D9D9] px-2 text-black'
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder='delegatoooor@defi.dao'
                                    />
                                </div>

                                <div className='flex flex-row items-center'>
                                    <input
                                        id='default-checkbox'
                                        type='checkbox'
                                        checked={terms}
                                        onChange={(e) => {
                                            setTerms(e.target.checked)
                                        }}
                                        className='h-4 w-4 rounded border-gray-300 bg-gray-100  accent-gray-100 checked:bg-gray-600 focus:ring-2'
                                    />
                                    <label
                                        className='ml-2 select-none text-sm font-medium text-white'
                                        onClick={() => setTerms(!terms)}
                                    >
                                        I agree to the{' '}
                                        <Link
                                            href={
                                                'https://senate.notion.site/Senate-Labs-Terms-of-Service-990ca9e655094b6f9673a3ead572956a'
                                            }
                                            className='underline'
                                        >
                                            Terms & Conditions
                                        </Link>{' '}
                                        ,{' '}
                                        <Link
                                            href={
                                                'https://senate.notion.site/Senate-Labs-Privacy-Policy-494e23d8a4e34d0189bfe07e0ae01bde'
                                            }
                                            className='underline'
                                        >
                                            Privacy Policy
                                        </Link>{' '}
                                        and{' '}
                                        <Link
                                            href={
                                                'https://senate.notion.site/Senate-Labs-Cookie-Policy-b429fe7b181e4cfda95f404f480bfdc7'
                                            }
                                            className='underline'
                                        >
                                            Cookie Policy
                                        </Link>{' '}
                                    </label>
                                </div>

                                {email && terms ? (
                                    <div
                                        className='flex h-[42px] w-full cursor-pointer flex-col justify-center bg-white text-center text-black'
                                        onClick={() => {
                                            storeTerms.mutate(
                                                {
                                                    value: terms
                                                },
                                                {
                                                    onSettled() {
                                                        newUser.refetch()
                                                    }
                                                }
                                            )
                                            storeEmail.mutate(
                                                {
                                                    email: email
                                                },
                                                {
                                                    onSettled() {
                                                        newUser.refetch()
                                                    }
                                                }
                                            )
                                            storeNewUser.mutate(
                                                {
                                                    value: false
                                                },
                                                {
                                                    onSettled() {
                                                        newUser.refetch()
                                                        setShowSigninAnimation(
                                                            true
                                                        )
                                                        setTimeout(() => {
                                                            router.push('/daos')
                                                        }, 7000)
                                                    }
                                                }
                                            )
                                        }}
                                    >
                                        Enter the Senate
                                    </div>
                                ) : (
                                    <div className='flex h-[42px] w-full flex-col justify-center bg-[#ABABAB] text-center text-black'>
                                        Enter the Senate
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
