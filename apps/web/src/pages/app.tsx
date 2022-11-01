import type { NextPage } from 'next'
import { useState, Suspense } from 'react'
import NavBar, { ViewsEnum } from '../components/navbar/NavBar'
import dynamic from 'next/dynamic'
import { useSession } from 'next-auth/react'

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

const DynamicSettings = dynamic(
    () => import('../components/views/settings/Settings'),
    {
        suspense: true,
    }
)

const Home: NextPage = () => {
    const [page, setPage] = useState(ViewsEnum.Dashboard)
    const { data: session } = useSession()

    return (
        <div className="flex flex-row">
            <NavBar page={page} setPage={setPage} />
            <div className="w-full">
                <Suspense fallback={`Loading...`}>
                    {page == ViewsEnum.Dashboard && <DynamicDashboard />}
                    {page == ViewsEnum.Watchlist && <DynamicWatchlist />}

                    {session?.user?.name
                        ? page == ViewsEnum.Tracker && (
                              <DynamicTracker
                                  useProxies={true}
                                  address={session?.user?.name}
                              />
                          )
                        : page == ViewsEnum.Tracker && (
                              <DynamicTracker useProxies={true} address="" />
                          )}

                    {page == ViewsEnum.Settings && <DynamicSettings />}
                </Suspense>
            </div>
        </div>
    )
}

export default Home
