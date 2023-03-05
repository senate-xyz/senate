'use client'

import { useRouter } from 'next/navigation'

const SetupDailyBulletin = () => {
    const router = useRouter()
    return (
        <div className='h-[72px] w-full bg-[#FFF1BF] flex flex-row justify-between items-center p-6'>
            <div className='text-black font-light text-[24px]'>
                You can setup a daily email to notify you of the latest
                proposals for the DAOs that you’re subscribed to on Senate.
            </div>

            <button
                className='h-[44px] bg-black w-[208px] text-white justify-center items-center flex'
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
