'use client'

import { useState, useEffect } from 'react'
import { trpc } from '../../../../../server/trpcClient'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'

const Telegram = () => {
    const [getTelegramNotifications, setTelegramNotifications] = useState(false)
    const [getTelegramReminders, setTelegramReminders] = useState(false)
    const [currentChatId, setCurrentChatId] = useState('')

    const account = useAccount()
    const router = useRouter()
    const user = trpc.accountSettings.getUser.useQuery()
    const setTelegramChatId =
        trpc.accountSettings.setTelegramChatId.useMutation()

    useEffect(() => {
        setCurrentChatId(String(user.data?.telegramchatid))
    }, [user.data])

    useEffect(() => {
        if (!account.isConnected && router) router.push('/settings/account')
    }, [account])

    useEffect(() => {
        if (user.data) {
            setTelegramNotifications(user.data.telegramnotifications)
            setTelegramReminders(user.data.telegramreminders)
        }
    }, [user.data])

    const updateTelegramNotifications =
        trpc.accountSettings.updateTelegramNotifications.useMutation()

    const updateTelegramReminders =
        trpc.accountSettings.updateTelegramReminders.useMutation()

    const onEnter = () => {
        setTelegramChatId.mutate({ chatid: currentChatId })
    }

    return (
        <div className='flex flex-col'>
            <div className='flex max-w-[400px] flex-row items-center justify-between gap-4'>
                <div className='font-[18px] leading-[23px] text-white'>
                    Receive Telegram Notifications
                </div>
                <label className='relative inline-flex cursor-pointer items-center bg-gray-400 hover:bg-gray-500'>
                    <input
                        type='checkbox'
                        checked={getTelegramNotifications}
                        onChange={(e) => {
                            updateTelegramNotifications.mutate({
                                val: e.target.checked
                            })
                        }}
                        className='peer sr-only'
                    />
                    <div className="peer h-6 w-11 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5  after:bg-black after:transition-all after:content-[''] peer-checked:bg-[#5EF413] peer-checked:after:translate-x-full peer-checked:hover:bg-[#7EF642]" />
                </label>
            </div>

            {getTelegramNotifications && (
                <div className='flex flex-col gap-4 border-b border-l border-neutral-600 py-4 pl-4'>
                    <div className='flex flex-col gap-2'>
                        <div className='text-[18px] font-light text-white'>
                            Telegram ChatId
                        </div>
                        <div
                            className={`flex h-[46px] max-w-[382px] flex-row items-center`}
                        >
                            <input
                                className={`h-full w-full bg-[#D9D9D9] px-2 text-black focus:outline-none lg:w-[320px] `}
                                value={currentChatId}
                                onChange={(e) => {
                                    setCurrentChatId(String(e.target.value))
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') onEnter()
                                }}
                            />

                            <div
                                className={`flex h-full w-[72px] cursor-pointer flex-col justify-center  ${
                                    user.data?.telegramchatid == currentChatId
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
                                checked={getTelegramReminders}
                                onChange={(e) => {
                                    updateTelegramReminders.mutate({
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
            {setTelegramChatId.error && (
                <input
                    className={`h-full w-full bg-[#D9D9D9] px-2 text-black focus:outline-none lg:w-[320px] `}
                    value={currentChatId}
                    onChange={(e) => {
                        setCurrentChatId(String(e.target.value))
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') onEnter()
                    }}
                />
            )}
        </div>
    )
}

export default Telegram