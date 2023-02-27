import SubscribedDAOs from './subscribedDAOs/page'
import UnsubscribedDAOs from './unsubscribedDAOs/page'

import { currentUser } from '@clerk/nextjs/app-beta'

export default async function Home() {
    const session = await currentUser()
    return (
        <main className='text-white'>
            <div className='w-full'>
                {session && (
                    <div className='w-full p-10'>
                        <div className='w-full'>
                            {/* @ts-expect-error Server Component */}
                            <SubscribedDAOs />
                        </div>
                    </div>
                )}

                <div className='p-10'>
                    <div className='w-full'>
                        {/* @ts-expect-error Server Component */}
                        <UnsubscribedDAOs />
                    </div>
                </div>
            </div>
        </main>
    )
}
