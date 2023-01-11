import { redirect } from 'next/navigation'

export default function Home() {
    redirect('/daos')
    return <main></main>
}
