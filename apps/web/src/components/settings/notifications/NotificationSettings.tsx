import Link from 'next/link'
import { trpc } from '../../../utils/trpc'

const tabs: { id: number; name: string; color: string; link: string }[] = [
    {
        id: 0,
        name: 'Account',
        color: 'text-[#808080] text-[36px] font-light cursor-pointer',
        link: '/settings/account',
    },
    {
        id: 1,
        name: 'Proxy Addresses',
        color: 'text-[#808080] text-[36px] font-light cursor-pointer',
        link: '/settings/proxy',
    },
    {
        id: 2,
        name: 'Notifications',
        color: 'text-white text-[36px] font-bold cursor-pointer',
        link: '/settings/notifications',
    },
]

const NotificationSettings = () => {
    const dailyBulletinSetting = trpc.user.settings.userSettings.useQuery()
    const setDailyBulletin = trpc.user.settings.setDailyBulletin.useMutation()

    if (!dailyBulletinSetting.data) return <div />

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
<<<<<<< Updated upstream
                            <label className="relative inline-flex cursor-pointer items-center bg-[#5EF413]">
=======
                            <label className="relative inline-flex cursor-pointer items-center bg-gray-400">
>>>>>>> Stashed changes
                                <input
                                    type="checkbox"
                                    checked={Boolean(
                                        dailyBulletinSetting.data
                                            .dailyBulletinEmail
                                    )}
                                    onChange={(e) => {
                                        console.log(e.target.checked)
                                        setDailyBulletin.mutate(
                                            {
                                                value: e.target.checked,
                                            },
                                            {
                                                onSettled() {
                                                    dailyBulletinSetting.refetch()
                                                },
                                            }
                                        )
                                    }}
                                    className="peer sr-only"
                                />
                                <div className="peer h-6 w-11 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5  after:bg-black after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-700" />
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
