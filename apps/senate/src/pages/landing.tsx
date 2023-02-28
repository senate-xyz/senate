'use client'

import '../styles/globals.css'
import Image from 'next/image'
import RootProvider from '../app/providers/providers'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { Transition } from '@headlessui/react'

const WrapperHome = () => {
    return (
        <RootProvider>
            <Home />
        </RootProvider>
    )
}

export default WrapperHome

const Home = () => {
    return (
        <ClerkProvider
            appearance={{
                baseTheme: dark
            }}
        >
            <div className='flex min-h-screen w-full flex-row bg-black'>
                <div className='flex min-h-full w-full flex-col'>
                    <div className='flex h-full w-full flex-row items-center justify-center'>
                        <Transition appear={true} show={true}>
                            <Transition.Child
                                appear={true}
                                enter='transition ease-in-out duration-[5000ms] delay-[3000ms]'
                                enterFrom='translate-y-28'
                                enterTo='-translate-y-28'
                            >
                                <div className='flex justify-center'>
                                    <Image
                                        src='/assets/Senate_Logo/Senate_Animation.gif'
                                        alt={''}
                                        width={300}
                                        height={300}
                                    />
                                </div>
                            </Transition.Child>
                            <Transition.Child
                                appear={true}
                                enter='transition-opacity ease-linear duration-500 delay-[8000ms]'
                                enterFrom='opacity-0'
                                enterTo='opacity-100'
                            >
                                <div className='text-[24px] font-light text-white -translate-y-20 w-[447px] text-center mb-8'>
                                    Welcome to Senate
                                </div>
                            </Transition.Child>

                            <Transition.Child
                                appear={true}
                                enter='transition-opacity ease-linear duration-500 delay-[9000ms]'
                                enterFrom='opacity-0'
                                enterTo='opacity-100'
                            >
                                <div className='text-[24px] font-light text-white -translate-y-20 w-[447px] text-center mb-8'>
                                    The place where you can keep track of{' '}
                                    <span className='bg-lime-400 text-black font-semibold'>
                                        off-chain and on-chain proposals
                                    </span>{' '}
                                    from your favorite DAOs with ease.
                                </div>
                            </Transition.Child>

                            <Transition.Child
                                appear={true}
                                enter='transition-opacity ease-linear duration-500 delay-[10000ms]'
                                enterFrom='opacity-0'
                                enterTo='opacity-100'
                            >
                                <div className='text-[24px] font-light text-white -translate-y-20 w-[447px] text-center mb-8'>
                                    And also, you’ll never miss a vote ever
                                    again with our{' '}
                                    <span className='bg-lime-400 text-black font-semibold'>
                                        daily email reminders
                                    </span>
                                    .
                                </div>
                            </Transition.Child>

                            <Transition.Child
                                appear={true}
                                enter='transition-opacity ease-linear duration-500 delay-[11000ms]'
                                enterFrom='opacity-0'
                                enterTo='opacity-100'
                            >
                                <div className='text-[24px] font-light text-white -translate-y-20 w-[447px] text-center whitespace-pre'>
                                    Does that sound cool to you?
                                </div>
                                <div className='text-[24px] font-light text-white -translate-y-20 w-[447px] text-center whitespace-pre'>
                                    Then go ahead, and...
                                </div>
                                <div
                                    className='mt-8 -translate-y-20 flex h-[42px] w-full cursor-pointer flex-col justify-center bg-white text-center text-black'
                                    onClick={() => {}}
                                >
                                    Enter the Senate
                                </div>
                            </Transition.Child>
                        </Transition>
                    </div>
                </div>
            </div>
        </ClerkProvider>
    )
}
