'use client'

import { useState, useEffect } from 'react'
import { trpc } from '../../../../../server/trpcClient'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'

const Discord = () => {
    const [getDiscordNotifications, setDiscordNotifications] = useState(false)
    const [getDiscordReminders, setDiscordReminders] = useState(false)
    const [currentWebhook, setCurrentWebhook] = useState('')

    const account = useAccount()
    const router = useRouter()
    const user = trpc.accountSettings.getUser.useQuery()
    const setDiscordWebhook =
        trpc.accountSettings.setDiscordWebhook.useMutation()

    useEffect(() => {
        setCurrentWebhook(String(user.data?.discordwebhook))
    }, [user.data])

    useEffect(() => {
        if (!account.isConnected && router) router.push('/settings/account')
    }, [account])

    useEffect(() => {
        if (user.data) {
            setDiscordNotifications(user.data.discordnotifications)
            setDiscordReminders(user.data.discordreminders)
        }
    }, [user.data])

    const updateDiscordNotifications =
        trpc.accountSettings.updateDiscordNotifications.useMutation()

    const updateDiscordReminders =
        trpc.accountSettings.updateDiscordReminders.useMutation()

    const onEnter = () => {
        setDiscordWebhook.mutate({ url: currentWebhook })
    }

    return (
        <div className='flex flex-col'>
            <div className='flex w-[400px] flex-row items-center justify-between gap-4'>
                <div className='font-[18px] leading-[23px] text-white'>
                    Receive Discord Notifications
                </div>
                <label className='relative inline-flex cursor-pointer items-center bg-gray-400'>
                    <input
                        type='checkbox'
                        checked={getDiscordNotifications}
                        onChange={(e) => {
                            updateDiscordNotifications.mutate({
                                val: e.target.checked
                            })
                        }}
                        className='peer sr-only'
                    />
                    <div className="peer h-6 w-11 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5  after:bg-black after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-700" />
                </label>
            </div>

            {getDiscordNotifications && (
                <div className='flex flex-col gap-4 border-b border-l border-neutral-600 p-4'>
                    <div className='flex flex-col gap-2'>
                        <div className='text-[18px] font-light text-white'>
                            Discord webhook
                        </div>
                        <div
                            className={`flex h-[46px] w-full flex-row items-center`}
                        >
                            <input
                                className={`h-full w-full bg-[#D9D9D9] px-2 text-black focus:outline-none lg:w-[320px] `}
                                value={currentWebhook}
                                onChange={(e) => {
                                    setCurrentWebhook(String(e.target.value))
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') onEnter()
                                }}
                            />

                            <div
                                className={`flex h-full w-[72px] cursor-pointer flex-col justify-center ${
                                    user.data?.discordwebhook == currentWebhook
                                        ? ' bg-[#ABABAB]'
                                        : 'bg-white'
                                } text-center`}
                                onClick={() => onEnter()}
                            >
                                Save
                            </div>
                        </div>
                    </div>

                    <div className='flex w-[382px] flex-row items-center justify-between gap-4'>
                        <div className='font-[18px] leading-[23px] text-white'>
                            Ending soon reminders
                        </div>
                        <label className='relative inline-flex cursor-pointer items-center bg-gray-400'>
                            <input
                                type='checkbox'
                                checked={getDiscordReminders}
                                onChange={(e) => {
                                    updateDiscordReminders.mutate({
                                        val: e.target.checked
                                    })
                                }}
                                className='peer sr-only'
                            />
                            <div className="peer h-6 w-11 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5  after:bg-black after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-700" />
                        </label>
                    </div>
                </div>
            )}
            {setDiscordWebhook.error && (
                <input
                    className={`h-full w-full bg-[#D9D9D9] px-2 text-black focus:outline-none lg:w-[320px] `}
                    value={currentWebhook}
                    onChange={(e) => {
                        setCurrentWebhook(String(e.target.value))
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') onEnter()
                    }}
                />
            )}
        </div>
    )
}

export default Discord
