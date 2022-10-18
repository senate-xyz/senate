import { ConnectButton } from '@rainbow-me/rainbowkit'
import type { IconType } from 'react-icons'
import { FiBarChart2, FiHome, FiStar, FiSettings } from 'react-icons/fi'

export enum ViewsEnum {
    None = 1,
    Dashboard = 2,
    Watchlist = 3,
    Tracker = 4,
    Settings = 5,
}
export interface NavItemProps {
    name: string
    id: ViewsEnum
    icon: IconType
}

const linkItems: Array<NavItemProps> = [
    { name: 'Dashboard', id: ViewsEnum.Dashboard, icon: FiHome },
    {
        name: 'Watchlist',
        id: ViewsEnum.Watchlist,
        icon: FiBarChart2,
    },
    { name: 'Vote tracker', id: ViewsEnum.Tracker, icon: FiStar },
    { name: 'Settings', id: ViewsEnum.Settings, icon: FiSettings },
]

export default function NavBar(props: { page: ViewsEnum; setPage: any }) {
    return (
        <main className="group h-screen w-16 place-items-center">
            <section className="absolute -left-96 z-10 border bg-red-300 transition-all duration-500 group-hover:left-0">
                <div className="grid h-screen w-48 place-items-start">
                    <ul className="mt-12 space-y-4 p-2">
                        <ConnectButton showBalance={false} />
                        {linkItems.map((item, index) => {
                            return (
                                <li key={index}>
                                    <button
                                        onClick={() => {
                                            props.setPage(item.id)
                                        }}
                                    >
                                        <div className="flex">
                                            {<item.icon size="1.5rem" />}
                                            <p>{item.name}</p>
                                        </div>
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </section>
            <section className="grid h-screen w-12 place-items-start bg-red-200">
                <ul className="mt-12 space-y-4 p-2">
                    {linkItems.map((item, index) => {
                        return (
                            <li key={index}>{<item.icon size="1.5rem" />}</li>
                        )
                    })}
                </ul>
            </section>
        </main>
    )
}
