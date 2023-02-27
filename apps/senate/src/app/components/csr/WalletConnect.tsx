'use client'

import { useClerk, useUser } from '@clerk/nextjs'
import { SignedIn, SignedOut } from '@clerk/nextjs/app-beta/client'
import { usePathname, useRouter } from 'next/navigation'

import { useEffect } from 'react'

export const WalletConnect = () => {
    const router = useRouter()
    const { openSignIn, signOut, redirectToHome } = useClerk()
    const user = useUser()
    const pathname = usePathname()

    useEffect(() => {
        if (user.isSignedIn) {
            const createdAt = user.user?.createdAt?.getTime() ?? 0

            if (Date.now() - createdAt < 5000) {
                router.push('/sign-up')
            }
        }
    }, [user])

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
