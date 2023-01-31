import { Suspense } from 'react'
import SubscribedDAOs from './subscribedDAOs/page'
import UnsubscribedDAOs from './unsubscribedDAOs/page'
import Loading from './subscribedDAOs/loading'
import { getServerSession } from 'next-auth'

export default async function Home() {
    const session = await getServerSession()
    return (
        <main className='text-white'>
            <div className='flex grow flex-col p-5'>
                <div className='w-full'>
                    {session && (
                        <div className='w-full p-10'>
                            <p className='mb-4 w-full text-[36px] font-semibold text-white'>
                                Your DAOs
                            </p>

                            <div className='w-full'>
                                <Suspense fallback={<Loading />}>
                                    {/* @ts-expect-error Server Component */}
                                    <SubscribedDAOs />
                                </Suspense>
                            </div>
                        </div>
                    )}

                    <div className='p-10'>
                        <p className='mb-4 w-full text-[36px] font-semibold text-white'>
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
