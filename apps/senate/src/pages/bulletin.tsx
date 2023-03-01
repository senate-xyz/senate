'use client'

import '../styles/globals.css'
import RootProvider from '../app/providers/providers'
import Image from 'next/image'
import { useState } from 'react'

const WrapperHome = () => {
    return (
        <RootProvider>
            <Home />
        </RootProvider>
    )
}

export default WrapperHome

const Home = () => {
    const [email, setEmail] = useState('')

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
                        value={email}
                        placeholder='delegatooooor@defi.dao'
                        onChange={(e) => {
                            setEmail(String(e.target.value))
                        }}
                    />

                    <div
                        className={`flex h-[43px] w-[420px] cursor-pointer flex-col justify-center ${
                            email.length ? 'bg-white' : 'bg-[#545454]'
                        } text-center mt-6`}
                        onClick={() => {}}
                    >
                        Get Daily Bulletin
                    </div>
                </div>
            </div>
        </div>
    )
}
