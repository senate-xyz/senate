import SubscribedDAOs from './subscribedDAOs/page'
import UnsubscribedDAOs from './unsubscribedDAOs/page'

export default async function Home() {
    return (
        <main className='flex w-full flex-col'>
            {/* @ts-expect-error Server Component */}
            <SubscribedDAOs />

            {/* @ts-expect-error Server Component */}
            <UnsubscribedDAOs />
        </main>
    )
}
