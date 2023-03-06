import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default function Home() {
    if (process.env.OUTOFSERVICE === 'true') redirect('/outofservice')
    const cookieStore = cookies()
    if (cookieStore.get('hasSeenLanding')) {
        redirect('/daos')
    } else redirect('/landing')

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return <main></main>
}
