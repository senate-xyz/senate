'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { trpc } from '../../../server/trpcClient'

export default function Home() {
    const session = useSession()
    const router = useRouter()

    const [getDailyEmails, setDailyEmails] = useState(false)

    useEffect(() => {
        if (session.status != 'authenticated') router.push('/settings/account')
    }, [session.status])

    const user = trpc.accountSettings.getUser.useQuery()

    useEffect(() => {
        if (user.data) setDailyEmails(user.data.dailyBulletin)
    }, [user.data])

    const updateNotifications =
        trpc.accountSettings.updateDailyEmails.useMutation()

    return (
        <div className='mt-2 flex flex-col gap-12'>
            <div className='flex flex-col gap-2'>
                <div className='text-[24px] font-light text-white'>
                    Your Notifications
                </div>

                <div className='w-[50%] text-[18px] font-light text-white'>
                    If you wish to, we will send you a daily email with the
                    Proposals that you can vote on.
                </div>

                <div className='flex flex-row items-center gap-4 pt-12'>
                    <div className='font-[18px] text-white'>
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
                        <div className="peer h-6 w-11 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5  after:bg-black after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-700" />
                    </label>
                </div>

                <div className='w-[50%] text-[15px] font-light text-white'>
                    You can customize the proposals that show up in your daily
                    email, in the DAOs page.
                </div>

                <div className='mt-12 flex h-[46px] flex-row items-center'></div>
            </div>
        </div>
    )
}
