import { Metadata } from 'next'
import SubscribedDAOs from './subscribedDAOs/page'
import UnsubscribedDAOs from './unsubscribedDAOs/page'

export const metadata: Metadata = {
    title: 'Senate - DAOs',
    icons: '/assets/Senate_Logo/64/Black.svg'
}

export default async function Home() {
    return (
        <main className='flex w-full flex-col'>
            <SubscribedDAOs />
            <UnsubscribedDAOs />
        </main>
    )
}
