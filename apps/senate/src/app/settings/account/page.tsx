'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const UserAddress = () => {
    const { data, error } = useSWR('/api/user/settings/account/name', fetcher)

    if (error)
        return (
            <div className='text-[24px] font-light text-white'>
                An error has occurred.
            </div>
        )

    if (!data)
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
                        {data.userName}
                    </div>
                </div>
            </div>
        </div>
    )
}

async function updateUser(url: string, { arg }: any) {
    await fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg)
    })
}

const UserEmail = () => {
    const [currentEmail, setCurrentEmail] = useState('')
    const [success, setSuccess] = useState(false)

    const { data, error } = useSWR('/api/user/settings/account/email', fetcher)
    const { trigger } = useSWRMutation(
        '/api/user/settings/account/email',
        updateUser
    )

    useEffect(() => {
        if (data) setCurrentEmail(data.emailAddress)
    }, [data])

    if (error)
        return (
            <div className='text-[24px] font-light text-white'>
                An error has occurred.
            </div>
        )

    if (!data)
        return (
            <div className='text-[24px] font-light text-white'>Loading...</div>
        )

    return (
        <div>
            <div className='text-[24px] font-light text-white'>
                Your Email Address
            </div>

            <div className='flex h-[46px] flex-row items-center'>
                <input
                    className={
                        data.emailAddress == currentEmail
                            ? 'h-full w-[320px] bg-[#D9D9D9] px-2 text-black'
                            : 'h-full w-[320px] px-2 text-black'
                    }
                    value={currentEmail}
                    onChange={(e) => {
                        setCurrentEmail(String(e.target.value))
                    }}
                />

                <div
                    className='flex h-full w-[72px] cursor-pointer flex-col justify-center bg-[#ABABAB] text-center'
                    onClick={() => {
                        trigger({ emailAddress: currentEmail })
                            .then(() => setSuccess(true))
                            .catch(() => setSuccess(false))
                    }}
                >
                    Save
                </div>
            </div>
            {success && (
                <div className='text-[18px] font-thin text-white'>
                    Email address successfully updated!
                </div>
            )}
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
