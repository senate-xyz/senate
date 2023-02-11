'use client'

import { useSession } from 'next-auth/react'
import { useAccount } from 'wagmi'

const UserAddress = () => {
    const { address } = useAccount()
    const session = useSession()

    if (session?.status != 'unauthenticated')
        return (
            <div>
                <div className='flex flex-col gap-2'>
                    <div className='text-[24px] font-light text-white'>
                        Your Account Address
                    </div>

                    <div className='flex flex-row gap-6'>
                        <div className='text-[18px] font-thin text-white'>
                            {address}
                        </div>
                    </div>
                </div>
            </div>
        )

    return <></>
}

export default UserAddress
