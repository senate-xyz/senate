'use client'

import '../styles/globals.css'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { trpc } from '../server/trpcClient'
import { useRouter } from 'next/navigation'
import RootProvider from '../app/providers'
import { Transition } from '@headlessui/react'
import Script from 'next/script'
import Head from 'next/head'

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

    const onEnter = () => {
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
    }

    return (
        <div className='flex min-h-screen w-full bg-black'>
            <Head>
                <Script id='howuku'>
                    {`(function(t,r,a,c,k){
                c=['track','identify','converted'],t.o=t._init||{},
                c.map(function(n){return t.o[n]=t.o[n]||function(){(t.o[n].q=t.o[n].q||[]).push(arguments);};}),t._init=t.o,
                k=r.createElement("script"),k.type="text/javascript",k.async=true,k.src="https://cdn.howuku.com/js/track.js",k.setAttribute("key",a),
                r.getElementsByTagName("head")[0].appendChild(k);
                })(window, document, "9mv6yAGkYDZV0BJEzlN34O");`}
                </Script>
            </Head>
            <div className='flex min-h-full w-full flex-col lg:flex-row'>
                <div
                    className='absolute right-5 top-5 cursor-pointer'
                    onClick={() => {
                        router.push('/daos')
                    }}
                >
                    <Image
                        loading='eager'
                        priority={true}
                        width='32'
                        height='32'
                        src='/assets/Icon/Close.svg'
                        alt='close button'
                    />
                </div>
                <div className='hidden w-full grow flex-col items-center justify-center bg-white lg:flex lg:w-0.5'>
                    <Transition appear={true} show={true}>
                        <Transition.Child
                            appear={true}
                            enter='transition ease-in-out duration-[1000ms] delay-[500ms]'
                            enterFrom='opacity-0'
                            enterTo='opacity-100'
                        >
                            <Transition.Child
                                appear={true}
                                enter='transition ease-in-out duration-[6000ms] delay-[2000ms]'
                                enterFrom='translate-y-[0px]'
                                enterTo='-translate-y-[1000px]'
                            >
                                <Transition.Child
                                    appear={true}
                                    enter='transition ease-in-out duration-[6000ms] delay-[12000ms]'
                                    enterFrom='translate-y-[0px]'
                                    enterTo='translate-y-[1000px]'
                                >
                                    <Image
                                        loading='eager'
                                        priority={true}
                                        src='/assets/Senate_Logo/Daily_Bulletin_Example.png'
                                        width={800}
                                        height={1987}
                                        alt={''}
                                        quality={100}
                                    />
                                </Transition.Child>
                            </Transition.Child>
                        </Transition.Child>
                    </Transition>
                </div>

                <div className='flex h-1/2 w-full grow flex-col items-start bg-black px-10 py-20 lg:h-screen lg:w-0.5 lg:items-center'>
                    <div className='text-[36px] font-bold text-white'>
                        Get your Daily Bulletin
                    </div>
                    <div className='mt-4 text-[15px] font-normal text-white lg:w-[420px]'>
                        Senate works best with your email address, so we can
                        notify you of new proposals from the DAOs you follow.
                    </div>
                    <div className='text-[15px] font-normal text-white lg:w-[420px]'>
                        Everyday, at 8:00 am UTC.
                    </div>

                    <input
                        className={`mt-6 h-[46px] w-full bg-[#D9D9D9] px-2 text-black focus:outline-none lg:w-[420px] `}
                        value={newEmail}
                        placeholder='delegatooooor@defi.dao'
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') onEnter()
                        }}
                        onChange={(e) => {
                            setNewEmail(String(e.target.value))
                        }}
                    />

                    <div
                        className={`flex h-[43px] w-full cursor-pointer flex-col justify-center lg:w-[420px] ${
                            newEmail.length ? 'bg-white' : 'bg-[#ABABAB]'
                        } mt-6 text-center`}
                        onClick={() => onEnter()}
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

                <div className='flex w-full grow flex-col items-center justify-center bg-white lg:hidden'>
                    <Image
                        loading='eager'
                        priority={true}
                        src='/assets/Senate_Logo/Daily_Bulletin_Example.png'
                        width={800}
                        height={1987}
                        alt={''}
                        quality={100}
                    />
                </div>
            </div>
        </div>
    )
}
