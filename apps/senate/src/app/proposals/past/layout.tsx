import Link from 'next/link'

const tabs: { id: number; name: string; color: string; link: string }[] = [
    {
        id: 0,
        name: 'Active Proposals',
        color: 'text-[#808080] text-[36px] font-light cursor-pointer',
        link: '/proposals/active'
    },
    {
        id: 1,
        name: 'Past Proposals',
        color: 'text-white text-[36px] font-bold cursor-pointer',
        link: '/proposals/past'
    }
]

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className='flex grow flex-col bg-[#1E1B20] p-5'>
            <div className='flex w-full flex-row gap-10'>
                {tabs.map((tab) => {
                    return (
                        <Link
                            key={tab.id}
                            className={tab.color}
                            href={tab.link}
                        >
                            {tab.name}
                        </Link>
                    )
                })}
            </div>
            <div className='mt-2'>{children}</div>
        </div>
    )
}
