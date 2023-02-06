'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { trpc } from '../../../server/trpcClient'

const UserAddress = () => {
    const session = useSession()

    if (session.status != 'authenticated')
        return (
            <div className='text-[24px] font-light text-white'>
                Please connect your wallet to customize your Account settings
            </div>
        )

    if (!session.data)
        return (
            <div className='text-[24px] font-light text-white'>Loading...</div>
        )
    return (
        <div>
            <div className='flex flex-col gap-2'>
                <div className='text-[24px] font-light text-white'>
                    Your Account Address
                </div>

                <div className='flex flex-row gap-6'>
                    <div className='text-[18px] font-thin text-white'>
                        {session.data?.user?.name}
                    </div>
                </div>
            </div>
        </div>
    )
}

const UserEmail = () => {
    const [currentEmail, setCurrentEmail] = useState('true')
    const [success, setSuccess] = useState(true)

    const setEmail = trpc.accountSettings.setEmail.useMutation()
    const email = trpc.accountSettings.getEmail.useQuery()

    useEffect(() => {
        setCurrentEmail(email.data ?? '')
    }, [email.data])

    if (!email.isFetched)
        return (
            <div className='text-[24px] font-light text-white'>Loading...</div>
        )

    return (
        <div>
            <div className='text-[24px] font-light text-white'>
                Your Email Address
            </div>

            <div className={`flex h-[46px] w-fit flex-row items-center`}>
                <input
                    className={`h-full w-[320px] focus:outline-none ${
                        email.data == currentEmail ? ' bg-[#D9D9D9]' : ''
                    } px-2 text-black `}
                    value={currentEmail}
                    onChange={(e) => {
                        setCurrentEmail(String(e.target.value))
                        setSuccess(false)
                    }}
                />

                <div
                    className='flex h-full w-[72px] cursor-pointer flex-col justify-center bg-[#ABABAB] text-center'
                    onClick={() => {
                        setEmail.mutate(
                            { email: currentEmail },
                            {
                                onSuccess: () => setSuccess(true),
                                onError: () => setSuccess(false)
                            }
                        )
                    }}
                >
                    Save
                </div>
            </div>
        </div>
    )
}

export default function Home() {
    return (
        <main>
            <div className='mt-2 flex flex-col gap-12'>
                <UserAddress />
                <UserEmail />
            </div>
        </main>
    )
}
