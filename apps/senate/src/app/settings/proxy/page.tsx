'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useProvider } from 'wagmi'
import { trpc } from '../../../server/trpcClient'

export default function Home() {
    const { isLoaded, isSignedIn } = useUser()
    const router = useRouter()
    const provider = useProvider()

    const voters = trpc.accountSettings.voters.useQuery(undefined, {
        refetchInterval: 5000
    })
    const removeVoter = trpc.accountSettings.removeVoter.useMutation()
    const addVoter = trpc.accountSettings.addVoter.useMutation()

    const [proxyAddress, setProxyAddress] = useState('')

    useEffect(() => {
        if (isLoaded && !isSignedIn) router.push('/settings/account')
    }, [isLoaded])

    return (
        <div className='mt-2 flex flex-col gap-12'>
            <div className='flex flex-col gap-2'>
                <div className='text-[24px] font-light text-white'>
                    Your Proxy Addresses
                </div>

                <div className='w-[50%] text-[18px] font-light text-white'>
                    Proxy Addresses are wallet addresses that you can add in
                    Senate, so that you can see the voting activity of multiple
                    addresses.
                </div>

                <div className='mt-12 flex flex-col gap-6'>
                    {voters.data &&
                        voters.data.map((voter) => {
                            return (
                                <div
                                    key={voter.address}
                                    className='flex flex-row items-center gap-12'
                                >
                                    <div className='font-mono text-[18px] font-light text-white'>
                                        {voter.address}
                                    </div>

                                    <button
                                        onClick={() => {
                                            removeVoter.mutate(
                                                {
                                                    address: voter.address
                                                },
                                                {
                                                    onSuccess() {
                                                        voters.refetch()
                                                    }
                                                }
                                            )
                                        }}
                                        className='text-[18px] font-light text-white underline'
                                    >
                                        Delete
                                    </button>
                                </div>
                            )
                        })}
                </div>

                <div className='mt-12 flex h-[46px] flex-row items-center'>
                    <input
                        className='h-full w-[480px] bg-[#D9D9D9] px-2 text-black'
                        value={proxyAddress}
                        onChange={(e) => setProxyAddress(e.target.value)}
                        placeholder='Paste a new proxy address here'
                    />

                    <div
                        className='flex h-full w-[72px] cursor-pointer flex-col justify-center bg-[#ABABAB] text-center'
                        onClick={async () => {
                            let resolvedAddress = proxyAddress
                            if (
                                (await provider.resolveName(proxyAddress))
                                    ?.length
                            ) {
                                resolvedAddress = String(
                                    await provider.resolveName(proxyAddress)
                                )
                            }

                            addVoter.mutate(
                                { address: resolvedAddress },
                                {
                                    onSuccess() {
                                        voters.refetch()
                                        setProxyAddress('')
                                    }
                                }
                            )
                        }}
                    >
                        Add
                    </div>
                </div>
                {addVoter.error && (
                    <div className='flex flex-col text-white'>
                        {JSON.parse(addVoter.error.message).map(
                            (err: Error) => (
                                <div>{err.message}</div>
                            )
                        )}
                    </div>
                )}
                {removeVoter.error && (
                    <div className='flex flex-col text-white'>
                        {JSON.parse(removeVoter.error.message).map(
                            (err: Error) => (
                                <div>{err.message}</div>
                            )
                        )}
                    </div>
                )}
                {voters.error && (
                    <div className='flex flex-col text-white'>
                        {JSON.parse(voters.error.message).map((err: Error) => (
                            <div>{err.message}</div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
