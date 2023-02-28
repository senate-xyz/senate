'use client'

import { useUser } from '@clerk/nextjs'

const UserAddress = () => {
    const user = useUser()

    return (
        <div>
            <div className='flex flex-col gap-2'>
                <div className='text-[24px] font-light text-white'>
                    Your Account Address
                </div>

                <div className='flex flex-row gap-6'>
                    <div className='text-[18px] font-thin text-white'>
                        {user.user?.web3Wallets[0]?.web3Wallet}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserAddress
