'use client'

import '../styles/globals.css'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { trpc, TrpcClientProvider } from '../server/trpcClient'
import { useRouter } from 'next/navigation'

const WrapperHome = () => {
    return (
        <TrpcClientProvider>
            <Home />
        </TrpcClientProvider>
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
                <div
                    className='absolute right-5 top-5 cursor-pointer'
                    onClick={() => {
                        router.push('/daos')
                    }}
                >
                    <Image
                        width='32'
                        height='32'
                        src='/assets/Icon/Close.svg'
                        alt='close button'
                    />
                </div>
                <div className='flex w-0.5 grow flex-col items-center justify-center bg-white'>
                    <Image
                        src='/assets/Senate_Logo/Daily_Bulletin_Example.png'
                        width={600}
                        height={1987}
                        alt={''}
                    ></Image>
                </div>

                <div className='flex w-0.5 grow flex-col items-center bg-black pt-20'>
                    <div className='text-[36px] font-bold text-white'>
                        Get your Daily Bulletin
                    </div>
                    <div className='mt-4 w-[420px] text-[15px] font-normal text-white'>
                        Senate works best with your email address, so we can
                        notify you of new proposals from the DAOs you follow.
                    </div>
                    <div className='w-[420px] text-[15px] font-normal text-white'>
                        Everyday, at 8:00 am UTC.
                    </div>

                    <input
                        className={`mt-6 h-[46px] w-[420px] bg-[#D9D9D9] px-2 text-black focus:outline-none `}
                        value={newEmail}
                        placeholder='delegatooooor@defi.dao'
                        onChange={(e) => {
                            setNewEmail(String(e.target.value))
                        }}
                    />

                    <div
                        className={`flex h-[43px] w-[420px] cursor-pointer flex-col justify-center ${
                            newEmail.length ? 'bg-white' : 'bg-[#ABABAB]'
                        } mt-6 text-center`}
                        onClick={() => {
                            setEmail.mutate(
                                { email: newEmail },
                                {
                                    onSuccess: () => {
                                        setSuccess(true)
                                        setError(false)
                                        router.push('/daos')
                                    },
                                    onError: () => {
                                        setError(true)
                                        setSuccess(false)
                                    }
                                }
                            )
                        }}
                    >
                        Get Daily Bulletin
                    </div>
                    {success && (
                        <div className='mt-4 text-center text-[12px] font-normal text-[#5EF413]'>
                            Email updated successfully!
                        </div>
                    )}
                    {error && (
                        <div className='mt-4 text-center text-[12px] font-normal text-[#FF3D00]'>
                            There was an error updating your email.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
