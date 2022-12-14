import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { trpc } from '../../../utils/trpc'

const tabs: { id: number; name: string; color: string; link: string }[] = [
    {
        id: 0,
        name: 'Account',
        color: 'text-[#808080] text-[36px] font-light cursor-pointer',
        link: '/dashboard/settings/account',
    },
    {
        id: 1,
        name: 'Proxy Addresses',
        color: 'text-[#808080] text-[36px] font-light cursor-pointer',
        link: '/dashboard/settings/proxy',
    },
    {
        id: 2,
        name: 'Notifications',
        color: 'text-white text-[36px] font-bold cursor-pointer',
        link: '/dashboard/settings/notifications',
    },
]

const NotificationSettings = () => {
    const { address } = useAccount()
    const { disconnect } = useDisconnect()

    const currentEmail = trpc.user.settings.email.useQuery()
    const storeEmail = trpc.user.settings.setEmail.useMutation()

    const [email, setEmail] = useState('')

    useEffect(() => {
        setEmail(String(currentEmail.data))
    }, [currentEmail.data])

    return (
        <div className="flex grow flex-col bg-[#1E1B20] p-5">
            <div className="flex w-full flex-row gap-10">
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
            <div className="mt-2 flex flex-col gap-12">
                <div className="flex flex-col gap-2">
                    <div className="text-[24px] font-light text-white">
                        Your Notifications
                    </div>

                    <div className="text-[18px] font-thin text-white">
                        If you wish to, we will send you a daily email with the
                        Proposals that you can vote on.
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-6">
                        <div className="text-[18px] font-light text-white">
                            Receive Senate Daily Bulletin Email
                        </div>

                        <div className="flex flex-row items-center justify-between gap-2">
                            <label className="relative inline-flex cursor-pointer items-center bg-[#5EF413]">
                                <input
                                    type="checkbox"
                                    value=""
                                    className="peer sr-only"
                                />
                                <div className="peer h-6 w-11 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5  after:bg-black after:transition-all after:content-[''] peer-checked:bg-[##5EF413] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                            </label>
                        </div>
                    </div>
                    <div className="text-[15px] font-thin text-white">
                        You can customize the proposals that show up in your
                        daily email, in the DAOs page.
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotificationSettings
