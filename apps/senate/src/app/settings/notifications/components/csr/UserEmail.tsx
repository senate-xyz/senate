'use client'

import { useState, useEffect } from 'react'
import { trpc } from '../../../../../server/trpcClient'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'

const UserEmail = () => {
    const [currentEmail, setCurrentEmail] = useState('')
    const [getDailyEmails, setDailyEmails] = useState(false)
    const [getEmptyEmails, setEmptyEmails] = useState(false)
    const [getEmailQuorum, setEmailQuorum] = useState(false)
    const [getEmailUpdated, setEmailUpdated] = useState(false)

    const account = useAccount()
    const router = useRouter()
    const user = trpc.accountSettings.getUser.useQuery()
    const setEmail = trpc.accountSettings.setEmail.useMutation()

    useEffect(() => {
        setCurrentEmail(
            user.data?.verifiedemail || user.data?.challengecode?.length
                ? user.data.email
                : ''
        )
    }, [user.data])

    useEffect(() => {
        if (!account.isConnected && router) router.push('/settings/account')
    }, [account])

    useEffect(() => {
        if (user.data) {
            setDailyEmails(user.data.emaildailybulletin)
            setEmptyEmails(user.data.emptydailybulletin)
            setEmailQuorum(user.data.emailquorumwarning)
        }
    }, [user.data])

    const updateDailyEmails =
        trpc.accountSettings.updateDailyEmails.useMutation()
    const updateEmptyEmails =
        trpc.accountSettings.updateEmptyEmails.useMutation()
    const updateEmailQuorum =
        trpc.accountSettings.updateQuorumEmails.useMutation()

    const onEnter = () => {
        setEmail.mutate({ email: currentEmail })
    }

    if (!user.data) return <></>

    console.log(user.data.email + currentEmail)

    return (
        <div className='flex flex-col'>
            <div className='flex max-w-[400px] flex-row items-center justify-between gap-4'>
                <div className='font-[18px] leading-[23px] text-white'>
                    Receive Senate Daily Bulletin Email
                </div>
                <label className='relative inline-flex cursor-pointer items-center bg-gray-400 hover:bg-gray-500'>
                    <input
                        type='checkbox'
                        checked={getDailyEmails}
                        onChange={(e) => {
                            updateDailyEmails.mutate(
                                {
                                    val: e.target.checked
                                },
                                {
                                    onSuccess: () => {
                                        setEmailUpdated(true)
                                    }
                                }
                            )
                        }}
                        className='peer sr-only'
                    />
                    <div className="peer h-6 w-11 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5  after:bg-black after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:hover:bg-green-300" />
                </label>
            </div>
            {getDailyEmails && (
                <div className='flex flex-col gap-4 border-b border-l border-neutral-600 py-4 pl-4'>
                    <div className='flex flex-col gap-2'>
                        <div className='text-[18px] font-light text-white'>
                            Your Email Address
                        </div>

                        <div
                            className={`flex h-[46px] max-w-[382px] flex-row items-center`}
                        >
                            <input
                                className={`h-full w-full bg-[#D9D9D9] px-2 text-black focus:outline-none lg:w-[320px] `}
                                value={currentEmail}
                                onChange={(e) => {
                                    setCurrentEmail(String(e.target.value))
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') onEnter()
                                }}
                            />

                            <div
                                className={`flex h-full w-[72px] cursor-pointer flex-col justify-center ${
                                    user.data.email.includes('@')
                                        ? user.data.email == currentEmail
                                            ? 'bg-[#ABABAB] hover:bg-[#999999]'
                                            : 'bg-white hover:bg-[#e5e5e5]'
                                        : currentEmail.length
                                        ? 'bg-white hover:bg-[#e5e5e5]'
                                        : 'bg-[#ABABAB] hover:bg-[#999999]'
                                } text-center`}
                                onClick={() => onEnter()}
                            >
                                Save
                            </div>
                        </div>

                        {getEmailUpdated && (
                            <div className='text-[18px] font-light text-green-400'>
                                Email updated!
                            </div>
                        )}

                        {!user.data.verifiedemail && (
                            <div className='text-[18px] font-light text-red-400'>
                                Email not verified!
                            </div>
                        )}

                        {setEmail.error && (
                            <div className='flex flex-col text-white'>
                                {JSON.parse(setEmail.error.message).map(
                                    (err: Error) => (
                                        <div>{err.message}</div>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    <div className='flex max-w-[382px] flex-row items-center justify-between gap-4'>
                        <div className='font-[18px] leading-[23px] text-white'>
                            Get empty emails
                        </div>
                        <label className='relative inline-flex cursor-pointer items-center bg-gray-400 hover:bg-gray-500'>
                            <input
                                type='checkbox'
                                checked={getEmptyEmails}
                                onChange={(e) => {
                                    updateEmptyEmails.mutate({
                                        val: e.target.checked
                                    })
                                }}
                                className='peer sr-only'
                            />
                            <div className="peer h-6 w-11 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5  after:bg-black after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:hover:bg-green-300" />
                        </label>
                    </div>

                    <div className='flex max-w-[382px] flex-row items-center justify-between gap-4'>
                        <div className='font-[18px] leading-[23px] text-white'>
                            Get quorum alerts
                        </div>
                        <label className='relative inline-flex cursor-pointer items-center bg-gray-400 hover:bg-gray-500'>
                            <input
                                type='checkbox'
                                checked={getEmailQuorum}
                                onChange={(e) => {
                                    updateEmailQuorum.mutate({
                                        val: e.target.checked
                                    })
                                }}
                                className='peer sr-only'
                            />
                            <div className="peer h-6 w-11 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5  after:bg-black after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:hover:bg-green-300" />
                        </label>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserEmail
