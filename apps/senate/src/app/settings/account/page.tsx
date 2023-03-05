'use client'

import { SignedIn, SignedOut, useClerk } from '@clerk/nextjs/app-beta/client'
import NotConnected from './components/csr/NotConnected'
import UserAddress from './components/csr/UserAddress'

export default function Home() {
    const { signOut, redirectToHome } = useClerk()

    return (
        <main>
            <div className='mt-2 flex flex-col gap-12'>
                <SignedOut>
                    <NotConnected />
                </SignedOut>
                <SignedIn>
                    <UserAddress />
                    <button
                        className='w-fit bg-black py-2 px-4 font-bold text-white hover:scale-105'
                        onClick={() => {
                            signOut()
                            redirectToHome()
                        }}
                    >
                        Disconnect Wallet
                    </button>
                </SignedIn>
            </div>
        </main>
    )
}
