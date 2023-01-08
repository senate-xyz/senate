import { useState } from 'react'
import RainbowConnect from './RainbowConnect'
import Link from 'next/link'
import NavBar from './navbar/NavBar'

const Dashboard = (props: { title: string; component: JSX.Element }) => {
    const [headerHeight, setHeaderHeight] = useState('h-[192px]')
    const [componentPadding, setComponentPadding] = useState('pt-[192px]')
    const [titleSize, setTitleSize] = useState('text-[78px]')

    return (
        <div
            className='h-full min-h-screen w-full bg-black'
            onWheel={() => {
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
            <div className='absolute left-0 z-30 w-full justify-center bg-slate-300 p-1 text-center text-black'>
                This software is still in beta and some proposals, for some
                DAOs, at some times, fail to load. So it’s not totally reliable
                yet. If you find something wrong or missing or just plain weird,{' '}
                <Link
                    className='underline'
                    href='https://discord.gg/kwGCVqHVdX'
                >
                    please let us know
                </Link>
                .
            </div>
            <div className='flex h-full min-h-screen w-full flex-row'>
                <div className='fixed z-20'>
                    <NavBar />
                </div>
                <div className='w-full pl-[92px]'>
                    <div
                        className={`fixed z-10 flex w-full bg-black transition-all ${headerHeight} items-center justify-between border border-x-0 border-t-0 border-[#545454] px-10`}
                    >
                        <h1
                            className={`${titleSize} font-extrabold text-white transition`}
                        >
                            {props.title}
                        </h1>
                        <div className='pr-20'>
                            <RainbowConnect />
                        </div>
                    </div>
                    <div
                        className={`flex min-h-screen w-full grow flex-col ${componentPadding}`}
                    >
                        {props.component}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
