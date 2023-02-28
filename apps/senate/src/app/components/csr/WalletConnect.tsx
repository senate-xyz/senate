'use client'

import { useClerk } from '@clerk/nextjs'
import { SignedIn, SignedOut } from '@clerk/nextjs/app-beta/client'
import { usePathname } from 'next/navigation'

export const WalletConnect = () => {
    const { openSignIn, signOut, redirectToHome } = useClerk()
    const pathname = usePathname()

    return (
        <div>
            <SignedOut>
                <button
                    className='w-fit bg-zinc-800 py-2 px-4 font-bold text-white hover:scale-105'
                    onClick={() =>
                        openSignIn({
                            redirectUrl: pathname,
                            appearance: {
                                elements: { footer: { display: 'none' } }
                            }
                        })
                    }
                >
                    Connect Wallet
                </button>
            </SignedOut>
            <SignedIn>
                <button
                    className='w-fit bg-zinc-800 py-2 px-4 font-bold text-white hover:scale-105'
                    onClick={() => {
                        signOut()
                        redirectToHome()
                    }}
                >
                    Sign out
                </button>
            </SignedIn>
        </div>
    )
}
