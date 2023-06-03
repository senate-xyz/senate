import SubscribedDAOs from './subscribedDAOs/page'
import UnsubscribedDAOs from './unsubscribedDAOs/page'

export default async function Home() {
    return (
        <main className='flex w-full flex-col'>
            <SubscribedDAOs />
            <UnsubscribedDAOs />
        </main>
    )
}
