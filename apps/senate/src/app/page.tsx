import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default function Home() {
    if (process.env.OUTOFSERVICE === 'true') redirect('/outofservice')

    const cookie = cookies()
    if (!cookie.has('hasSeenLanding')) redirect('/landing')
    else redirect('/daos')
}
