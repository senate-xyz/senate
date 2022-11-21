import Link from 'next/link'
import type { IconType } from 'react-icons'
import { TfiLayoutPlaceholder } from 'react-icons/tfi'

export enum ViewsEnum {
    None = 1,
    DAOs = 2,
    Proposals = 3,
    Settings = 5,
}
export interface NavItemProps {
    name: string
    id: ViewsEnum
    link: string
    icon: IconType
}

const linkItems: Array<NavItemProps> = [
    {
        name: 'DAOs',
        id: ViewsEnum.DAOs,
        link: '/dashboard/daos',
        icon: TfiLayoutPlaceholder,
    },
    {
        name: 'Proposals',
        id: ViewsEnum.Proposals,
        link: '/dashboard/proposals/active',
        icon: TfiLayoutPlaceholder,
    },
    {
        name: 'Settings',
        id: ViewsEnum.Settings,
        link: '/dashboard/settings',
        icon: TfiLayoutPlaceholder,
    },
]

export default function NavBar() {
    return (
        <div className="grid w-24 items-start bg-slate-900">
            <div className="flex flex-col items-center">
                <Link href="/">
                    <TfiLayoutPlaceholder
                        size="64"
                        className="my-12 fill-slate-600"
                    />
                </Link>

                {linkItems.map((item, index) => {
                    return (
                        <Link href={item.link} key={index}>
                            <div className="flex flex-col items-center">
                                <item.icon
                                    className="fill-slate-400"
                                    size="64"
                                />
                                <p className="text-sm text-slate-400">
                                    {item.name}
                                </p>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
