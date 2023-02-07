import { redirect } from 'next/navigation'

export default function Home() {
    redirect('/daos')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return <main></main>
}
