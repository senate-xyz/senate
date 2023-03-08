'use client'

import '../styles/globals.css'
import Image from 'next/image'
import { Transition } from '@headlessui/react'

const WrapperHome = () => {
    return <Home />
}

export default WrapperHome

const Home = () => {
    return (
        <div className='flex min-h-screen w-full flex-row bg-black'>
            <div className='flex min-h-full w-full flex-col'>
                <div className='flex h-full w-full flex-row items-center justify-center px-4'>
                    <Transition appear={true} show={true}>
                        <Transition.Child
                            appear={true}
                            enter='transition ease-in-out duration-[5000ms] delay-[3000ms]'
                            enterFrom='translate-y-28'
                            enterTo='-translate-y-28'
                            leave='ease-out'
                            leaveFrom='opacity-100'
                            leaveTo='opacity-0'
                        >
                            <div className='flex justify-center'>
                                <Image
                                    loading='eager'
                                    priority={true}
                                    src='/assets/Senate_Logo/Senate_Animation.gif'
                                    priority={true}
                                    alt={''}
                                    width={300}
                                    height={300}
                                />
                            </div>
                        </Transition.Child>

                        <Transition.Child
                            appear={true}
                            enter='transition-opacity ease-linear duration-500 delay-[9000ms]'
                            enterFrom='opacity-0'
                            enterTo='opacity-100'
                            leave='ease-out'
                            leaveFrom='opacity-100'
                            leaveTo='opacity-0'
                        >
                            <div className='mb-8 -translate-y-20 text-center text-[24px] font-light text-white lg:w-[447px]'>
                                The app is being updated and will be back up
                                soon.
                            </div>
                        </Transition.Child>
                    </Transition>
                </div>
            </div>
        </div>
    )
}
