'use client'

import '../styles/globals.css'
import Image from 'next/image'
import { Transition } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import { useCookies } from 'react-cookie'
import Link from 'next/link'
import { useState } from 'react'

const WrapperHome = () => {
    return <Home />
}

export default WrapperHome

const Home = () => {
    const router = useRouter()
    const [, setCookie] = useCookies([
        'hasSeenLanding',
        'acceptedTerms',
        'acceptedTermsTimestamp'
    ])
    const [terms, setTerms] = useState(false)
    const [warning, setWarning] = useState(false)

    return (
        <div className='flex min-h-screen w-full flex-row bg-black'>
            <div className='flex min-h-full w-full flex-col'>
                <div className='flex h-full w-full flex-row items-center justify-center'>
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
                            enter='transition-opacity ease-linear duration-500 delay-[8000ms]'
                            enterFrom='opacity-0'
                            enterTo='opacity-100'
                            leave='ease-out'
                            leaveFrom='opacity-100'
                            leaveTo='opacity-0'
                        >
                            <div className='mb-8 w-[447px] -translate-y-20 text-center text-[24px] font-light text-white'>
                                Welcome to Senate!
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
                            <div className='mb-8 w-[447px] -translate-y-20 text-center text-[24px] font-light text-white'>
                                The place where you can keep track of{' '}
                                <span className='bg-[#5EF413] font-semibold text-black'>
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
                            leave='ease-out'
                            leaveFrom='opacity-100'
                            leaveTo='opacity-0'
                        >
                            <div className='mb-8 w-[447px] -translate-y-20 text-center text-[24px] font-light text-white'>
                                And also, you’ll never miss a vote ever again
                                with our{' '}
                                <span className='bg-[#5EF413] font-semibold text-black'>
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
                            leave='ease-out'
                            leaveFrom='opacity-100'
                            leaveTo='opacity-0'
                        >
                            <div className='w-[447px] -translate-y-20 whitespace-pre text-center text-[24px] font-light text-white'>
                                Does that sound cool to you?
                            </div>
                            <div className='w-[447px] -translate-y-20 whitespace-pre text-center text-[24px] font-light text-white'>
                                Then go ahead, and...
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
                                    className='ml-2 select-none text-sm font-light text-white'
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
                            <div
                                className={
                                    terms
                                        ? `mt-8 flex h-[42px] w-full cursor-pointer flex-col justify-center bg-white text-center text-black`
                                        : `mt-8 flex h-[42px] w-full cursor-pointer flex-col justify-center bg-gray-500 text-center text-gray-700`
                                }
                                onClick={() => {
                                    if (!terms) {
                                        setWarning(true)
                                    } else {
                                        setCookie('hasSeenLanding', true)
                                        setCookie('acceptedTerms', true)
                                        setCookie(
                                            'acceptedTermsTimestamp',
                                            Date.now()
                                        )
                                        setTimeout(function () {
                                            router.push('/daos')
                                        }, 500)
                                    }
                                }}
                            >
                                Enter the Senate
                            </div>

                            {warning && !terms && (
                                <div className='mt-4 text-center text-[12px] font-normal text-[#FF3D00]'>
                                    Please accept the Terms of Service, Privacy
                                    Policy and Cookie Policy above.
                                </div>
                            )}
                        </Transition.Child>
                    </Transition>
                </div>
            </div>
        </div>
    )
}
