import { SingleTarget } from 'framer-motion'
import { ProposalsView } from '../pages/dashboard/proposals/active'
import RainbowConnect from './RainbowConnect'

const tabs: { id: number; name: string; color: string; link: string }[] = [
    {
        id: 0,
        name: 'Active Proposals',
        color: 'text-gray-100 text-5xl cursor-pointer',
        link: '/dashboard/proposals/active',
    },
    {
        id: 1,
        name: 'Past Proposals',
        color: 'text-gray-400 text-5xl cursor-pointer',
        link: '/dashboard/proposals/past',
    },
]

const DashboardHeader = (props: { title: string; component: JSX.Element }) => {
    return (
        <div className="min-h-screen w-full">
            <div className="h-full w-full bg-slate-700">
                <div className="flex w-full flex-col">
                    <div className="flex h-48 items-center justify-between bg-slate-800 px-10">
                        <h1 className="text-5xl">{props.title}</h1>
                        <RainbowConnect />
                    </div>
                    {props.component}
                </div>
            </div>
        </div>
    )
}

export default DashboardHeader
