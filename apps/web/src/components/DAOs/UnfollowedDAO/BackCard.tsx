import { DAOType } from '../../../../../../packages/common-types/dist'
import { trpc } from '../../../utils/trpc'
import Image from 'next/image'

const BackCard = (props: {
    dao: DAOType
    refreshDaos: () => void
    setShowMenu: (show: boolean) => void
}) => {
    const subscribe = trpc.user.subscriptions.subscribe.useMutation()

    return (
        <div className="flex h-full w-full flex-col items-center justify-between rounded bg-black text-sm font-bold text-white shadow">
            <div className="flex h-full w-full flex-col items-center justify-between">
                <div className="flex flex-col items-center gap-2 pt-5">
                    <div className="flex w-full flex-row justify-between">
                        <p>Notifications</p>
                        <div
                            className="cursor-pointer"
                            onClick={() => {
                                props.setShowMenu(false)
                            }}
                        >
                            <Image
                                width="32"
                                height="32"
                                src="/assets/Icon/Close.svg"
                                alt="close button"
                            />
                        </div>
                    </div>
                    <p>Get daily emails about:</p>
                    <div className="flex w-full flex-row items-center justify-between gap-2">
                        <p>New Proposals</p>
                        <label className="relative inline-flex cursor-pointer items-center bg-gray-700">
                            <input
                                type="checkbox"
                                value=""
                                className="peer sr-only"
                            />
                            <div className="peer h-6 w-11 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5  after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-gray-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                        </label>
                    </div>
                    <div className="flex w-full flex-row items-center justify-between gap-2">
                        <p>Proposal ending soon</p>
                        <label className="relative inline-flex cursor-pointer items-center bg-gray-700">
                            <input
                                type="checkbox"
                                value=""
                                className="peer sr-only"
                            />
                            <div className="peer h-6 w-11 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5  after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-gray-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                        </label>
                    </div>
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
                >
                    Confirm
                </button>
            </div>
        </div>
    )
}

export default BackCard
