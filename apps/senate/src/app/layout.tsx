'use client'

import '@rainbow-me/rainbowkit/styles.css'

import '../styles/globals.css'
import { NavBar } from './components/csr/NavBar'
import RootProvider from './providers'
import PHProvider from './components/csr/PostHogProvider'

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <html lang='en' className='bg-[#1E1B20]'>
            <PHProvider>
                <head>
                    <link
                        rel='preconnect'
                        href='https://fonts.googleapis.com'
                    />
                    <link rel='preconnect' href='https://fonts.gstatic.com' />
                    <link
                        href='https://fonts.googleapis.com/css2?family=DM+Mono&display=swap'
                        rel='stylesheet'
                    ></link>
                </head>
                <body>
                    <RootProvider>
                        <div className='h-full min-h-screen w-full'>
                            {/* <div className='absolute left-0 z-30 w-full justify-center bg-slate-300 p-1 text-center text-black'>
                            This software is still in beta and some proposals,
                            for some DAOs, at some times, fail to load. So it’s
                            not totally reliable yet. If you find something
                            wrong or missing or just plain weird,{' '}
                            <Link
                                className='underline'
                                href='https://discord.gg/kwGCVqHVdX'
                                target='_blank'
                            >
                                please let us know
                            </Link>
                            .
                        </div> */}
                            <div className='z-10 flex h-full min-h-screen w-full flex-row'>
                                <div className='fixed hidden lg:flex'>
                                    <NavBar />
                                </div>

                                <div className='w-full'>{children}</div>
                            </div>
                        </div>
                    </RootProvider>
                </body>
            </PHProvider>
        </html>
    )
}
