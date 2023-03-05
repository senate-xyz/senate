import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default function Home() {
    if (process.env.OUTOFSERVICE === 'true') redirect('/outofservice')

    const cookieStore = cookies()
    if (!cookieStore.get('hasSeenLanding')) redirect('/landing')

    return <main></main>
}
