'use client'

import '../styles/globals.css'
import Image from 'next/image'
import { Transition } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import { useCookies } from 'react-cookie'
import { useEffect } from 'react'

const WrapperHome = () => {
    return <Home />
}

export default WrapperHome

const Home = () => {
    const router = useRouter()
    const [cookie, setCookie] = useCookies(['hasSeenLanding'])
    useEffect(() => {
        if (cookie.hasSeenLanding && router) router.push('/')
    }, [cookie])

    return (
        <div>
            <div className='flex min-h-screen w-full flex-row bg-black'>
                <div className='flex min-h-screen w-full flex-col'>
                    <div className='flex h-full min-h-screen w-full flex-row items-center justify-center px-4'>
                        <Transition
                            appear={true}
                            show={true}
                            enter='transition-opacity ease-linear duration-500'
                            enterFrom='opacity-0'
                            enterTo='opacity-100'
                            leave='ease-out'
                            leaveFrom='opacity-100'
                            leaveTo='opacity-0'
                        >
                            <div className='mt-4 flex justify-center'>
                                <Image
                                    loading='eager'
                                    priority={true}
                                    src='/assets/Senate_Logo/Senate_No_Animation.svg'
                                    alt={''}
                                    width={300}
                                    height={300}
                                />
                            </div>

                            <div className='mb-8 mt-4 w-full text-center text-[24px] font-light text-white lg:w-[447px]'>
                                Welcome to Senate!
                            </div>

                            <div className='mb-8 w-full text-center text-[24px] font-light text-white lg:w-[447px]'>
                                The place where you can keep track of{' '}
                                <span className='bg-[#5EF413] font-semibold text-black'>
                                    off-chain and on-chain proposals
                                </span>{' '}
                                from your favorite DAOs with ease.
                            </div>

                            <div className='mb-8 w-full text-center text-[24px] font-light text-white lg:w-[447px]'>
                                Also, you’ll never miss a vote ever again with
                                our{' '}
                                <span className='bg-[#5EF413] font-semibold text-black'>
                                    daily email reminders
                                </span>
                                .
                            </div>

                            <div className='w-full whitespace-pre text-center text-[24px] font-light text-white lg:w-[447px]'>
                                Does that sound cool to you?
                            </div>
                            <div className='w-full whitespace-pre text-center text-[24px] font-light text-white lg:w-[447px]'>
                                Then go ahead, and...
                            </div>

                            <div
                                className={`my-12 flex h-[42px] w-full cursor-pointer flex-col justify-center self-end bg-white text-center text-black`}
                                onClick={() => {
                                    setCookie('hasSeenLanding', true, {
                                        maxAge: 60 * 60 * 24 * 365
                                    })
                                }}
                            >
                                Enter the Senate
                            </div>
                        </Transition>
                    </div>
                </div>
            </div>
        </div>
    )
}
