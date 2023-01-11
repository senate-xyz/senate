import { Suspense } from 'react'
import SubscribedDAOs from './subscribedDAOs/page'
import UnsubscribedDAOs from './unsubscribedDAOs/page'
import Loading from './subscribedDAOs/loading'

export default async function Home() {
    return (
        <main className='w-full text-white'>
            <div className='flex grow flex-col bg-[#1E1B20] p-5'>
                <div className='w-full'>
                    <div className='w-full p-10'>
                        <p className='mb-4 w-full text-[36px] font-medium text-white'>
                            Your DAOs
                        </p>
                        <div className='w-full'>
                            <Suspense fallback={<Loading />}>
                                {/* @ts-expect-error Server Component */}
                                <SubscribedDAOs />
                            </Suspense>
                        </div>
                    </div>

                    <div className='p-10'>
                        <p className='mb-4 w-full text-[36px] font-medium text-white'>
                            DAOs you can subscribe to
                        </p>
                        <div className='w-full'>
                            <Suspense fallback={<Loading />}>
                                {/* @ts-expect-error Server Component */}
                                <UnsubscribedDAOs />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
