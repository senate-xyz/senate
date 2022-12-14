import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { trpc } from '../../../utils/trpc'

const tabs: { id: number; name: string; color: string; link: string }[] = [
    {
        id: 0,
        name: 'Account',
        color: 'text-white text-[36px] font-bold cursor-pointer',
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
        color: 'text-[#808080] text-[36px] font-light cursor-pointer',
        link: '/dashboard/settings/notifications',
    },
]

const AccountSettings = () => {
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
                        Your Account Address
                    </div>
                    {address && (
                        <div className="flex flex-row gap-6">
                            <div className="text-[18px] font-thin text-white">
                                {address}
                            </div>
                            <div
                                className="cursor-pointer text-[18px] font-thin text-white underline"
                                onClick={() => {
                                    disconnect()
                                }}
                            >
                                Disconnect
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <div className="text-[24px] font-light text-white">
                        Your Email Address
                    </div>
                    {address && (
                        <div className="flex h-[46px] flex-row items-center">
                            {currentEmail.data != email ? (
                                <input
                                    className="h-full w-[320px] bg-[#D9D9D9] px-2"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            ) : (
                                <input
                                    className="h-full w-[320px] px-2"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            )}

                            <div
                                className="flex h-full w-[72px] cursor-pointer flex-col justify-center bg-[#ABABAB] text-center"
                                onClick={() => {
                                    storeEmail.mutate(
                                        { emailAddress: email },
                                        {
                                            onSuccess() {
                                                currentEmail.refetch()
                                            },
                                        }
                                    )
                                }}
                            >
                                Save
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AccountSettings
