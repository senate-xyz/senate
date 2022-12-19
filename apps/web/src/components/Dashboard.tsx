import { useState } from 'react'
import RainbowConnect from './RainbowConnect'
import Link from 'next/link'

const Dashboard = (props: { title: string; component: JSX.Element }) => {
    const [headerHeight, setHeaderHeight] = useState('h-[192px]')
    const [componentPadding, setComponentPadding] = useState('pt-[192px]')
    const [titleSize, setTitleSize] = useState('text-[78px]')

    return (
        <div
            className="h-full min-h-screen w-full bg-black"
            onWheel={() => {
                console.log(window.scrollY)
                if (window.scrollY > 0) {
                    setHeaderHeight('h-[96px]')
                    setComponentPadding('pt-[96px]')
                } else {
                    setHeaderHeight('h-[192px]')
                    setComponentPadding('pt-[192px]')
                    setTitleSize('text-[78px]')
                }
                if (window.scrollY > 13) {
                    setTitleSize('text-[52px]')
                }
            }}
        >
            <div className="absolute left-0 z-20 w-full justify-center bg-red-200 p-1 text-center text-black">
                This software is still in beta and some proposals, for some
                DAOs, at some times, fail to load. So it’s not totally reliable
                yet, you know? If you find something wrong or missing or just
                plain weird,{' '}
                <Link
                    className="underline"
                    href="https://discord.gg/kwGCVqHVdX"
                >
                    please let us know
                </Link>
                .
            </div>
            <div className="flex h-full min-h-screen flex-col">
                <div
                    className={`fixed z-10 flex w-full bg-black transition-all ${headerHeight} items-center justify-between border border-x-0 border-t-0 border-[#545454] px-10`}
                >
                    <h1 className={`${titleSize} font-semibold text-white`}>
                        {props.title}
                    </h1>
                    <div className="pr-20">
                        <RainbowConnect />
                    </div>
                </div>
                <div
                    className={`flex min-h-screen flex-col ${componentPadding}`}
                >
                    {props.component}
                </div>
            </div>
        </div>
    )
}

export default Dashboard
