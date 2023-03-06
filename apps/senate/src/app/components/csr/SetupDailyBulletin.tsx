'use client'

import { useRouter } from 'next/navigation'

const SetupDailyBulletin = () => {
    const router = useRouter()
    return (
        <div className='flex h-[72px] w-full flex-row items-center justify-between bg-[#FFF1BF] p-6'>
            <div className='text-[24px] font-light text-black'>
                You can setup a daily email to notify you of the latest
                proposals for the DAOs that you’re subscribed to on Senate.
            </div>

            <button
                className='flex h-[44px] w-[208px] items-center justify-center bg-black text-white'
                onClick={() => {
                    router.push('/bulletin')
                }}
            >
                Setup Daily Email
            </button>
        </div>
    )
}
export default SetupDailyBulletin
