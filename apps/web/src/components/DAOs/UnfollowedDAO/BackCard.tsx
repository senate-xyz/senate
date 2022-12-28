import { useState } from 'react'
import { DAOType } from '@senate/database'
import { trpc } from '../../../utils/trpc'
import Image from 'next/image'

const BackCard = (props: {
    dao: DAOType
    refreshDaos: () => void
    setShowMenu: (show: boolean) => void
}) => {
    const subscribe = trpc.user.subscriptions.subscribe.useMutation()

    const [getDailyEmails, setDailyEmails] = useState(true)

    return (
        <div
            className="flex h-full w-full flex-col items-center justify-between rounded bg-black text-sm font-bold text-white shadow"
            data-testid="daocard-unfollowed-back"
        >
            <div className="flex h-full w-full flex-col items-center justify-between">
                <div className="flex flex-col items-center gap-6 pt-5">
                    <div className="flex w-full flex-row justify-between">
                        <p>Notifications</p>
                        <div
                            className="cursor-pointer"
                            onClick={() => {
                                props.setShowMenu(false)
                            }}
                            data-testid="close-menu"
                        >
                            <Image
                                width="32"
                                height="32"
                                src="/assets/Icon/Close.svg"
                                alt="close button"
                            />
                        </div>
                    </div>
                    <div className="flex w-full flex-row items-center justify-between gap-2">
                        <p>Get daily emails</p>
                        <label className="relative inline-flex cursor-pointer items-center bg-gray-400">
                            <input
                                type="checkbox"
                                checked={getDailyEmails}
                                onChange={(e) =>
                                    setDailyEmails(e.target.checked)
                                }
                                className="peer sr-only"
                            />
                            <div className="peer h-6 w-11 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5  after:bg-black after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-700" />
                        </label>
                    </div>
                    {/* <p>Get daily emails about:</p>
                    <div className="flex w-full flex-row items-center justify-between gap-2">
                        <p>New Proposals</p>
                        <label className="relative inline-flex cursor-pointer items-center bg-gray-700">
                            <input
                                type="checkbox"
                                checked={true}
                                className="peer sr-only"
                            />
                            <div className="peer h-6 w-11 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5  after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-gray-500 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                        </label>
                    </div>
                    <div className="flex w-full flex-row items-center justify-between gap-2">
                        <p>Proposal ending soon</p>
                        <label className="relative inline-flex cursor-pointer items-center bg-gray-700">
                            <input
                                type="checkbox"
                                checked={true}
                                className="peer sr-only"
                            />
                            <div className="peer h-6 w-11 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5  after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-gray-500 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                        </label>
                    </div> */}
                </div>

                <button
                    className="h-20 w-full bg-white text-xl font-bold text-black"
                    onClick={() => {
                        subscribe.mutate(
                            {
                                daoId: props.dao.id,
                            },
                            {
                                onSuccess() {
                                    props.refreshDaos()
                                    props.setShowMenu(false)
                                },
                            }
                        )
                    }}
                    data-testid="subscribe"
                >
                    Confirm
                </button>
            </div>
        </div>
    )
}

export default BackCard
