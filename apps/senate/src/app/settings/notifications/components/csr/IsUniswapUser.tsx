'use client'

import { MagicUserState } from '@senate/database'
import { trpc } from '../../../../../server/trpcClient'

const IsUniswapUser = () => {
    const user = trpc.accountSettings.getUser.useQuery()

    const disableUniswapUser =
        trpc.accountSettings.disableUniswapUser.useMutation()

    if (user.data?.isuniswapuser)
        return (
            <div className='flex flex-col gap-2'>
                <div className='text-[18px] font-light text-white'>
                    Uniswap magic user
                </div>

                <div className='flex flex-row items-center gap-4'>
                    <label className='relative inline-flex cursor-pointer items-center bg-gray-400'>
                        <input
                            type='checkbox'
                            checked={
                                user.data?.isuniswapuser ==
                                MagicUserState.ENABLED
                            }
                            onChange={() => {
                                disableUniswapUser.mutate()
                            }}
                            className='peer sr-only'
                        />
                        <div className="bg-uniswap-gradient peer h-6 w-11 after:absolute after:left-[2px] after:top-[2px] after:h-5  after:w-5 after:bg-black after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-700" />
                    </label>
                </div>
            </div>
        )
    else return <></>
}

export default IsUniswapUser
