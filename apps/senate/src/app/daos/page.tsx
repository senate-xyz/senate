import SubscribedDAOs from './subscribedDAOs/page'
import UnsubscribedDAOs from './unsubscribedDAOs/page'

export default async function Home() {
    return (
        <main className='text-white'>
            <div className='flex w-full flex-col gap-12'>
                {/* @ts-expect-error Server Component */}
                <SubscribedDAOs />

                {/* @ts-expect-error Server Component */}
                <UnsubscribedDAOs />
            </div>
        </main>
    )
}
