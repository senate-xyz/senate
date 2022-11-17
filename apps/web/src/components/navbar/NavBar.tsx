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
    icon: IconType
}

const linkItems: Array<NavItemProps> = [
    { name: 'DAOs', id: ViewsEnum.DAOs, icon: TfiLayoutPlaceholder },
    {
        name: 'Proposals',
        id: ViewsEnum.Proposals,
        icon: TfiLayoutPlaceholder,
    },
    { name: 'Settings', id: ViewsEnum.Settings, icon: TfiLayoutPlaceholder },
]

export default function NavBar(props: {
    page: ViewsEnum
    setPage: (arg0: ViewsEnum) => void
}) {
    return (
        <div className="grid w-24 items-start bg-slate-900">
            <div className="flex flex-col items-center">
                <TfiLayoutPlaceholder
                    size="64"
                    className="my-12 fill-slate-600"
                />

                {linkItems.map((item, index) => {
                    return (
                        <button
                            onClick={() => {
                                props.setPage(item.id)
                            }}
                            key={index}
                        >
                            <div className="flex flex-col items-center">
                                <item.icon
                                    className="fill-slate-400"
                                    size="64"
                                />
                                <p className="text-sm text-slate-400">
                                    {item.name}
                                </p>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
