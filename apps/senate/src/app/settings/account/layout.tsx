'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

const defaultTab: { id: number; name: string; color: string; link: string } = {
    id: 0,
    name: 'Account',
    color: 'text-white text-[36px] font-bold cursor-pointer',
    link: '/settings/account'
}

const tabs: { id: number; name: string; color: string; link: string }[] = [
    {
        id: 0,
        name: 'Account',
        color: 'text-white text-[36px] font-bold cursor-pointer',
        link: '/settings/account'
    },
    {
        id: 1,
        name: 'Other Addresses',
        color: 'text-[#808080] text-[36px] font-light cursor-pointer',
        link: '/settings/proxy'
    },
    {
        id: 2,
        name: 'Notifications',
        color: 'text-[#808080] text-[36px] font-light cursor-pointer',
        link: '/settings/notifications'
    }
]

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    const session = useSession()

    return (
        <>
            <div className='flex grow flex-col bg-[#1E1B20] p-5 px-12'>
                <div className='flex w-full flex-row gap-10'>
                    {session.status == 'authenticated' ? (
                        tabs.map((tab) => {
                            return (
                                <Link
                                    key={tab.id}
                                    className={tab.color}
                                    href={tab.link}
                                >
                                    {tab.name}
                                </Link>
                            )
                        })
                    ) : (
                        <Link
                            key={defaultTab.id}
                            className={defaultTab.color}
                            href={defaultTab.link}
                        >
                            {defaultTab.name}
                        </Link>
                    )}
                </div>
                <div className='w-[1150px] pt-10 pl-2'>{children}</div>
            </div>
        </>
    )
}
