import Image from 'next/image'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import { trpc } from '../utils/trpc'
import Link from 'next/link'
import { useRouter } from 'next/router'

const NewUser = () => {
    const router = useRouter()
    const { address } = useAccount()
    const storeEmail = trpc.user.settings.setEmail.useMutation()
    const storeTerms = trpc.user.settings.setTerms.useMutation()
    const storeNewUser = trpc.user.settings.setNewUser.useMutation()

    const newUser = trpc.user.settings.newUser.useQuery()
    if (newUser.data) {
        if (!newUser.data.newUser) {
            setTimeout(() => {
                router.push('/dashboard/daos')
            }, 10000)
        }
    }

    const [email, setEmail] = useState('')
    const [terms, setTerms] = useState(false)

    const [showSigninAnimation, setShowSigninAnimation] = useState(false)

    return (
        <div className="flex min-h-screen w-full flex-row bg-black">
            <div className="flex min-h-full w-full flex-col">
                {showSigninAnimation ? (
                    <div className="flex h-full w-full flex-row items-center justify-center">
                        <Image
                            src="/assets/Senate_Logo/Senate_Animation.gif"
                            alt={''}
                            width={300}
                            height={300}
                        />
                    </div>
                ) : (
                    <div>
                        <div className="flex w-full flex-row justify-between px-12 pt-[20px]">
                            <div className="flex flex-row items-center">
                                <Image
                                    src="/assets/Senate_Logo/64/White.svg"
                                    width={64}
                                    height={64}
                                    alt={'Senate logo'}
                                />
                                <div className="relative -left-2 -top-1 text-[40px] font-semibold text-white">
                                    senate
                                </div>
                            </div>
                            <div>
                                <ConnectButton showBalance={false} />
                            </div>
                        </div>

                        <div className="flex h-full w-full flex-row items-center justify-center ">
                            <div className="flex w-[40%] flex-col gap-3">
                                <div className="text-[36px] font-bold text-white">
                                    Welcome to Senate
                                </div>
                                <div className="text-[15px] font-normal text-white">
                                    Senate works best with your email address,
                                    so we can notify you of new proposals from
                                    the DAOs you follow.
                                </div>

                                <div className="text-[18px] font-light text-white">
                                    Your Email Address
                                </div>

                                {address && (
                                    <div className="flex h-[46px] flex-col">
                                        <input
                                            className="h-full w-full bg-[#D9D9D9] px-2"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            placeholder="delegatoooor@defi.dao"
                                        />

                                        {/* <div
                                    className="flex h-full w-[72px] cursor-pointer flex-col justify-center bg-[#ABABAB] text-center"
                                    onClick={() => {
                                        storeEmail.mutate(
                                            { emailAddress: email },
                                            {
                                                onSuccess() {
                                                    currentEmail.refetch()
                                                },
                                            }
                                        )
                                    }}
                                >
                                    Save
                                </div> */}
                                    </div>
                                )}
                                <div className="flex flex-row">
                                    <input
                                        id="default-checkbox"
                                        type="checkbox"
                                        checked={terms}
                                        onChange={(e) => {
                                            setTerms(e.target.checked)
                                        }}
                                        className="h-4 w-4 rounded border-gray-300 bg-gray-100  accent-gray-100 checked:bg-gray-600 focus:ring-2"
                                    />
                                    <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        I agree to the{' '}
                                        <Link
                                            href={'/terms'}
                                            className="underline"
                                        >
                                            Terms & Conditions
                                        </Link>{' '}
                                        and{' '}
                                        <Link
                                            href={'/privacy'}
                                            className="underline"
                                        >
                                            Privacy Policy
                                        </Link>{' '}
                                    </label>
                                </div>

                                {email && terms ? (
                                    <div
                                        className="flex h-[42px] w-full cursor-pointer flex-col justify-center bg-white text-center"
                                        onClick={() => {
                                            storeTerms.mutate(
                                                {
                                                    value: terms,
                                                },
                                                {
                                                    onSettled() {
                                                        newUser.refetch()
                                                    },
                                                }
                                            )
                                            storeEmail.mutate(
                                                {
                                                    emailAddress: email,
                                                },
                                                {
                                                    onSettled() {
                                                        newUser.refetch()
                                                    },
                                                }
                                            )
                                            storeNewUser.mutate(
                                                {
                                                    value: false,
                                                },
                                                {
                                                    onSettled() {
                                                        newUser.refetch()
                                                        setShowSigninAnimation(
                                                            true
                                                        )
                                                    },
                                                }
                                            )
                                        }}
                                    >
                                        Enter the Senate
                                    </div>
                                ) : (
                                    <div className="flex h-[42px] w-full flex-col justify-center bg-[#ABABAB] text-center">
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

export default NewUser
