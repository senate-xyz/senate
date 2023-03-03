'use client'

import { SignedOut, useClerk } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'

const ConnectWalletModal = () => {
    const { openSignIn } = useClerk()
    const pathname = usePathname()

    return (
        <SignedOut>
            <div className='absolute flex h-full w-full scale-x-[1.025] flex-col items-center backdrop-blur'>
                <button
                    className='w-fit bg-zinc-800 py-2 px-4 font-bold text-white hover:scale-105 mt-48'
                    onClick={() =>
                        openSignIn({
                            redirectUrl: `/connected?redirect=${pathname}`,
                            appearance: {
                                elements: { footer: { display: 'none' } }
                            }
                        })
                    }
                >
                    Connect Wallet
                </button>
            </div>
        </SignedOut>
    )
}

export default ConnectWalletModal
