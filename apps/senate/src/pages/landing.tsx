'use client'

import '../styles/globals.css'
import Image from 'next/image'
import { Transition } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import { useCookies } from 'react-cookie'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Script from 'next/script'

const WrapperHome = () => {
    return <Home />
}

export default WrapperHome

const Home = () => {
    const router = useRouter()
    const [cookie, setCookie] = useCookies([
        'hasSeenLanding',
        'acceptedTerms',
        'acceptedTermsTimestamp'
    ])
    const [terms, setTerms] = useState(false)
    const [warning, setWarning] = useState(false)

    useEffect(() => {
        if (
            cookie.acceptedTerms &&
            cookie.acceptedTermsTimestamp > 0 &&
            cookie.hasSeenLanding
        )
            router.push('/daos')
    }, [cookie])

    return (
        <div>
            <Script id='howuku'>
                {`(function(t,r,a,c,k){
                c=['track','identify','converted'],t.o=t._init||{},
                c.map(function(n){return t.o[n]=t.o[n]||function(){(t.o[n].q=t.o[n].q||[]).push(arguments);};}),t._init=t.o,
                k=r.createElement("script"),k.type="text/javascript",k.async=true,k.src="https://cdn.howuku.com/js/track.js",k.setAttribute("key",a),
                r.getElementsByTagName("head")[0].appendChild(k);
                })(window, document, "9mv6yAGkYDZV0BJEzlN34O");`}
            </Script>

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

                            <div className='mt-4 mb-8 w-full text-center text-[24px] font-light text-white lg:w-[447px]'>
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
                            <div className='mt-4 flex flex-row items-center self-end px-4'>
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
                                        target='_blank'
                                    >
                                        Terms of Service
                                    </Link>
                                    ,{' '}
                                    <Link
                                        href={
                                            'https://senate.notion.site/Senate-Labs-Privacy-Policy-494e23d8a4e34d0189bfe07e0ae01bde'
                                        }
                                        className='underline'
                                        target='_blank'
                                    >
                                        Privacy Policy
                                    </Link>{' '}
                                    and{' '}
                                    <Link
                                        href={
                                            'https://senate.notion.site/Senate-Labs-Cookie-Policy-b429fe7b181e4cfda95f404f480bfdc7'
                                        }
                                        className='underline'
                                        target='_blank'
                                    >
                                        Cookie Policy
                                    </Link>{' '}
                                </label>
                            </div>

                            {warning && !terms && (
                                <div className='mt-4 text-center text-[12px] font-normal text-[#FF3D00]'>
                                    Please accept the Terms of Service, Privacy
                                    Policy and Cookie Policy above.
                                </div>
                            )}

                            <div
                                className={
                                    terms
                                        ? `mb-8 mt-4 flex h-[42px] w-full cursor-pointer flex-col justify-center self-end bg-white text-center text-black`
                                        : `mb-8 mt-4 flex h-[42px] w-full cursor-pointer flex-col justify-center self-end bg-gray-500 text-center text-gray-700`
                                }
                                onClick={() => {
                                    if (!terms) {
                                        setWarning(true)
                                    } else {
                                        setCookie('hasSeenLanding', true, {
                                            maxAge: 60 * 60 * 24 * 365
                                        })
                                        setCookie('acceptedTerms', true, {
                                            maxAge: 60 * 60 * 24 * 365
                                        })
                                        setCookie(
                                            'acceptedTermsTimestamp',
                                            Date.now(),
                                            {
                                                maxAge: 60 * 60 * 24 * 365
                                            }
                                        )
                                    }
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
