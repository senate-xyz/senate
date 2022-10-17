import type { NextPage } from 'next'
import { useState, Suspense } from 'react'
import NavBar, { ViewsEnum } from '../components/navbar/NavBar'
import dynamic from 'next/dynamic'

const DynamicDashboard = dynamic(
    () => import('../components/views/dashboard/Dashboard'),
    {
        suspense: true,
    }
)

const DynamicWatchlist = dynamic(
    () => import('../components/views/watchlist/Watchlist'),
    {
        suspense: true,
    }
)

const DynamicTracker = dynamic(
    () => import('../components/views/tracker/Tracker'),
    {
        suspense: true,
    }
)

const Home: NextPage = () => {
    const [page, setPage] = useState(ViewsEnum.Dashboard)

    return (
        <div className="flex flex-row">
            <NavBar page={page} setPage={setPage} />
            <div className="w-full">
                <Suspense fallback={`Loading...`}>
                    {page == ViewsEnum.Dashboard && <DynamicDashboard />}
                    {page == ViewsEnum.Watchlist && <DynamicWatchlist />}
                    {page == ViewsEnum.Tracker && (
                        <DynamicTracker shareButton={true} />
                    )}
                </Suspense>
            </div>
        </div>
    )
}

export default Home
