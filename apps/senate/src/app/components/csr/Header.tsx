'use client'

import { useState } from 'react'
import WalletConnect from './WalletConnect'

export const Header = (props: { title: string }) => {
    const [headerHeight, setHeaderHeight] = useState('h-[192px]')
    const [titleSize, setTitleSize] = useState('text-[78px]')

    if (typeof window != 'undefined')
        window.addEventListener('wheel', () => {
            if (
                window.scrollY > 0 &&
                document.body.scrollHeight > window.innerHeight + 100
            ) {
                setHeaderHeight('h-[96px]')
                setTitleSize('text-[52px]')
            } else {
                setHeaderHeight('h-[192px]')
                setTitleSize('text-[78px]')
            }
        })

    return (
        <div
            className={`fixed z-20 flex w-full ${headerHeight} items-center justify-between border border-x-0 border-t-0 border-[#545454] bg-black px-10 transition-all`}
        >
            <h1 className={`${titleSize} font-extrabold text-white transition`}>
                {props.title}
            </h1>

            <div className='hidden pr-20 lg:flex'>
                <WalletConnect />
            </div>
        </div>
    )
}
