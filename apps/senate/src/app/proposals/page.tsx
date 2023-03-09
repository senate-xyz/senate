import { redirect } from 'next/navigation'

export default function Home() {
    if (process.env.OUTOFSERVICE === 'true') redirect('/outofservice')

    return <main></main>
}
