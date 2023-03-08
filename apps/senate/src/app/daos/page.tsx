import SubscribedDAOs from './subscribedDAOs/page'
import UnsubscribedDAOs from './unsubscribedDAOs/page'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Home() {
    if (process.env.OUTOFSERVICE === 'true') redirect('/outofservice')
    const cookieStore = cookies()
    if (!cookieStore.get('hasSeenLanding')) redirect('/landing')

    return (
        <main className='text-white'>
            <div className='flex w-full flex-col gap-12'>
                {
                    /* @ts-expect-error Server Component */
                    <SubscribedDAOs />
                }

                {/* @ts-expect-error Server Component */}
                <UnsubscribedDAOs />
            </div>
        </main>
    )
}
