'use client'

import '../styles/globals.css'
import RootProvider from '../app/components/providers/providers'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { trpc } from '../server/trpcClient'
import { useRouter } from 'next/navigation'

const WrapperHome = () => {
    return (
        <RootProvider>
            <Home />
        </RootProvider>
    )
}

export default WrapperHome

const Home = () => {
    const [newEmail, setNewEmail] = useState('')
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    const router = useRouter()

    const setEmail =
        trpc.accountSettings.setEmailAndEnableBulletin.useMutation()
    const email = trpc.accountSettings.getEmail.useQuery()

    useEffect(() => {
        if (email.isFetched) setNewEmail(email.data ?? '')
    }, [email.data])

    return (
        <div className='flex min-h-screen w-full flex-row bg-black'>
            <div className='flex min-h-full w-full flex-row'>
                <div className='flex grow flex-col bg-white items-center justify-center w-0.5'>
                    <Image
                        src='/assets/Senate_Logo/Daily_Bulletin_Example.png'
                        width={600}
                        height={1987}
                        alt={''}
                    ></Image>
                </div>
                <div className='flex grow flex-col bg-black w-0.5 items-center pt-20'>
                    <div className='text-[36px] font-bold text-white'>
                        Get your Daily Bulletin
                    </div>
                    <div className='text-[15px] font-normal text-white w-[420px] mt-4'>
                        Senate works best with your email address, so we can
                        notify you of new proposals from the DAOs you follow.
                    </div>
                    <div className='text-[15px] font-normal text-white w-[420px]'>
                        Everyday, at 8:00 am UTC.
                    </div>

                    <input
                        className={`h-[46px] w-[420px] mt-6 focus:outline-none bg-[#D9D9D9] px-2 text-black `}
                        value={newEmail}
                        placeholder='delegatooooor@defi.dao'
                        onChange={(e) => {
                            setNewEmail(String(e.target.value))
                        }}
                    />

                    <div
                        className={`flex h-[43px] w-[420px] cursor-pointer flex-col justify-center ${
                            newEmail.length ? 'bg-white' : 'bg-[#545454]'
                        } text-center mt-6`}
                        onClick={() => {
                            setEmail.mutate(
                                { email: newEmail },
                                {
                                    onSuccess: () => {
                                        setSuccess(true)
                                        router.push('/daos')
                                    },
                                    onError: () => {
                                        setError(true)
                                    }
                                }
                            )
                        }}
                    >
                        Get Daily Bulletin
                    </div>
                    {success && (
                        <div className='text-[12px] font-normal text-[#5EF413] mt-4 text-center'>
                            Email updated successfully!
                        </div>
                    )}
                    {error && (
                        <div className='text-[12px] font-normal text-[#FF3D00] mt-4 text-center'>
                            There was an error updating your email.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
