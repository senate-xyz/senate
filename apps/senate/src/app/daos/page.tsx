import { serverQuery } from '../../helpers/trpcHelpers'

const getAllDAOs = async () => {
    return await serverQuery.public.daos()
}

export default async function Home() {
    const daos = await getAllDAOs()

    return (
        <main className='w-full text-white'>
            <ul>
                {daos.map((dao) => (
                    <li>{dao.name}</li>
                ))}
            </ul>
        </main>
    )
}
