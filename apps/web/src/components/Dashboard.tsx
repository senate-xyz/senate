import { useState } from 'react'
import RainbowConnect from './RainbowConnect'

const Dashboard = (props: { title: string; component: JSX.Element }) => {
    const [headerHeight, setHeaderHeight] = useState('h-[192px]')
    const [componentPadding, setComponentPadding] = useState('pt-[192px]')

    return (
        <div
            className="h-full min-h-screen w-full bg-black"
            onWheel={() => {
                if (window.scrollY > 0) {
                    setHeaderHeight('h-[96px]')
                    setComponentPadding('pt-[96px]')
                } else {
                    setHeaderHeight('h-[192px]')
                    setComponentPadding('pt-[192px]')
                }
            }}
        >
            <div className="absolute left-0 z-20 flex min-h-[44px] w-full flex-col justify-center bg-red-200 px-4 text-center text-black">
                This software is still in beta and some proposals, for some
                DAOs, at some times, still fail to load. So it’s still not
                totally reliable, you know? If you find something wrong or
                missing or just plain weird, please tell us.
            </div>
            <div className="flex h-full min-h-screen flex-col">
                <div
                    className={`fixed z-10 flex w-full bg-black transition-all ${headerHeight} items-center justify-between border border-x-0 border-t-0 border-[#545454] px-10`}
                >
                    <h1 className={`text-[78px] font-semibold text-white`}>
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
