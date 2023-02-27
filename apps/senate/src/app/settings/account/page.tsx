'use client'

import { SignedIn, SignedOut } from '@clerk/nextjs/app-beta/client'
import NotConnected from './components/csr/NotConnected'
import UserAddress from './components/csr/UserAddress'
import UserEmail from './components/csr/UserEmail'

export default function Home() {
    return (
        <main>
            <div className='mt-2 flex flex-col gap-12'>
                <SignedOut>
                    <NotConnected />
                </SignedOut>
                <SignedIn>
                    <UserAddress />
                    <UserEmail />
                </SignedIn>
            </div>
        </main>
    )
}
