'use client'

import { useState, useEffect } from 'react'
import { trpc } from '../../../../../server/trpcClient'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import Image from 'next/image'

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

    if (!user.data) return <></>

    return (
        <div className='flex max-w-[800px] flex-col gap-4 bg-black p-4'>
            <div className='flex flex-row justify-between'>
                <div className='flex flex-row gap-4'>
                    <Image
                        src='/assets/Senate_Logo/settings_discord_icon.svg'
                        alt={''}
                        width={24}
                        height={24}
                    ></Image>
                    <div className='font-[18px] leading-[23px] text-white'>
                        Discord Notifications
                    </div>
                </div>
                <label className='relative inline-flex cursor-pointer items-center bg-gray-400 hover:bg-gray-500'>
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
                    <div className="peer h-6 w-11 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5  after:bg-black after:transition-all after:content-[''] peer-checked:bg-[#5EF413] peer-checked:after:translate-x-full peer-checked:hover:bg-[#7EF642]" />
                </label>
            </div>

            <div className='max-w-[610px] text-[15px] text-white'>
                Receive instant notifications in your Discord server about
                proposals from all DAOs you follow on Senate. This will help
                ensure that you and your team always remember to vote.
            </div>

            {getDiscordNotifications && (
                <div className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-2'>
                        <div className='text-[18px] font-light text-white'>
                            Discord webhook
                        </div>
                        <div
                            className={`flex h-[46px] max-w-[382px] flex-row items-center`}
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
                                className={`flex h-full w-[72px] cursor-pointer flex-col justify-center  ${
                                    user.data?.discordwebhook == currentWebhook
                                        ? 'bg-[#ABABAB] hover:bg-[#999999]'
                                        : 'bg-white hover:bg-[#e5e5e5]'
                                } text-center`}
                                onClick={() => onEnter()}
                            >
                                Save
                            </div>
                        </div>
                    </div>

                    <div className='flex max-w-[382px] flex-row items-center justify-between gap-4'>
                        <div className='font-[18px] leading-[23px] text-white'>
                            Ending soon reminders
                        </div>
                        <label className='relative inline-flex cursor-pointer items-center bg-gray-400 hover:bg-gray-500'>
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
                            <div className="peer h-6 w-11 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5  after:bg-black after:transition-all after:content-[''] peer-checked:bg-[#5EF413] peer-checked:after:translate-x-full peer-checked:hover:bg-[#7EF642]" />
                        </label>
                    </div>
                </div>
            )}
            {setDiscordWebhook.error && (
                <div className='flex flex-col text-white'>
                    {JSON.parse(setDiscordWebhook.error.message).map(
                        (err: Error) => (
                            <div>{err.message}</div>
                        )
                    )}
                </div>
            )}
        </div>
    )
}

export default Discord
