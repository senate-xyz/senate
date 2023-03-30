'use client'

import { redirect, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useAccount } from 'wagmi'
import { trpc } from '../../../server/trpcClient'
import UserEmail from './components/csr/UserEmail'

export default function Home() {
    if (process.env.OUTOFSERVICE === 'true') redirect('/outofservice')
    const [cookie] = useCookies(['hasSeenLanding'])
    if (!cookie.hasSeenLanding) redirect('/landing')

    const account = useAccount()
    const router = useRouter()
    const user = trpc.accountSettings.getUser.useQuery()

    const [getDailyEmails, setDailyEmails] = useState(false)

    useEffect(() => {
        if (!account.isConnected) router.push('/settings/account')
    }, [account])

    useEffect(() => {
        if (user.data) setDailyEmails(user.data.dailybulletin)
    }, [user.data])

    const updateNotifications =
        trpc.accountSettings.updateDailyEmails.useMutation()

    return (
        <div className='flex min-h-screen flex-col gap-12'>
            <div className='flex flex-col gap-4'>
                <div className='text-[24px] font-light leading-[30px] text-white'>
                    Your Notifications
                </div>

                <div className='text-[18px] font-light leading-[23px] text-white'>
                    If you wish to, we will send you a daily email with the
                    Proposals for the DAOs you are subscribed to.
                </div>
            </div>

            <div className='flex flex-row items-center gap-4'>
                <div className='font-[18px] leading-[23px] text-white'>
                    Receive Senate Daily Bulletin Email
                </div>
                <label className='relative inline-flex cursor-pointer items-center bg-gray-400'>
                    <input
                        type='checkbox'
                        checked={getDailyEmails}
                        onChange={(e) => {
                            updateNotifications.mutate({
                                dailyBulletin: e.target.checked
                            })
                        }}
                        className='peer sr-only'
                    />
                    <div className="peer h-6 w-11 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5  after:bg-black after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-700" />
                </label>
            </div>

            {getDailyEmails && <UserEmail />}
        </div>
    )
}
