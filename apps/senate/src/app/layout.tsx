import { ClerkProvider } from '@clerk/nextjs/app-beta'
import { dark } from '@clerk/themes'
import Link from 'next/link'
import '../styles/globals.css'
import { NavBar } from './components/csr/NavBar'
import RootProvider from './providers/providers'

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider
            appearance={{
                baseTheme: dark
            }}
        >
            <RootProvider>
                <html lang='en'>
                    <head />
                    <body>
                        <div className='h-full min-h-screen w-full bg-black'>
                            <div className='absolute left-0 z-30 w-full justify-center bg-slate-300 p-1 text-center text-black'>
                                This software is still in beta and some
                                proposals, for some DAOs, at some times, fail to
                                load. So it’s not totally reliable yet. If you
                                find something wrong or missing or just plain
                                weird,{' '}
                                <Link
                                    className='underline'
                                    href='https://discord.gg/kwGCVqHVdX'
                                >
                                    please let us know
                                </Link>
                                .
                            </div>
                            <div className='z-10 flex h-full min-h-screen w-full flex-row'>
                                <div className='fixed'>
                                    <NavBar />
                                </div>

                                <div className='w-full'>{children}</div>
                            </div>
                        </div>
                    </body>
                </html>
            </RootProvider>
        </ClerkProvider>
    )
}
