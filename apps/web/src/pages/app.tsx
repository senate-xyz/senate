import type { NextPage } from 'next'
import { useState, Suspense } from 'react'
import NavBar, { ViewsEnum } from '../components/navbar/NavBar'
import dynamic from 'next/dynamic'

const DynamicDAOs = dynamic(() => import('../components/views/DAOs/DAOs'), {
    suspense: true,
})

const DynamicProposals = dynamic(
    () => import('../components/views/proposals/Proposals'),
    {
        suspense: true,
    }
)

const DynamicSettings = dynamic(
    () => import('../components/views/settings/Settings'),
    {
        suspense: true,
    }
)

const Home: NextPage = () => {
    const [page, setPage] = useState(ViewsEnum.DAOs)

    return (
        <div className="flex flex-row">
            <NavBar page={page} setPage={setPage} />
            <div className="min-h-screen w-full">
                <Suspense>
                    {page == ViewsEnum.DAOs && <DynamicDAOs />}
                    {page == ViewsEnum.Proposals && <DynamicProposals />}
                    {page == ViewsEnum.Settings && <DynamicSettings />}
                </Suspense>
            </div>
        </div>
    )
}

export default Home
