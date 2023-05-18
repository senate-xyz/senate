'use client'

import { redirect, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useAccount, usePublicClient } from 'wagmi'
import { trpc } from '../../../server/trpcClient'
import { normalize } from 'viem/ens'

export default function Home() {
    const account = useAccount()
    const router = useRouter()
    const provider = usePublicClient()

    const voters = trpc.accountSettings.voters.useQuery()

    const addVoter = trpc.accountSettings.addVoter.useMutation()

    const [proxyAddress, setProxyAddress] = useState('')

    useEffect(() => {
        if (!account.isConnected) router.push('/settings/account')
    }, [account])

    const onEnter = async () => {
        let resolvedAddress = proxyAddress
        if (
            (await provider.getEnsAddress({ name: normalize(proxyAddress) }))
                ?.length
        ) {
            resolvedAddress = String(
                await provider.getEnsAddress({ name: normalize(proxyAddress) })
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
    }

    return (
        <div className='flex min-h-screen flex-col gap-12'>
            <div className='flex flex-col gap-4'>
                <div className='text-[24px] font-light leading-[30px] text-white'>
                    Your Other Addresses
                </div>

                <div className='text-[18px] font-light leading-[23px] text-white lg:w-[50%]'>
                    Here you can add other addresses to your Senate account, so
                    that you can see the voting activity for those addresses as
                    well.
                </div>

                <div className='mt-12 flex flex-col gap-6'>
                    {voters.data &&
                        voters.data.map((voter) => {
                            return <Voter address={voter.address} />
                        })}
                </div>

                <div className='mt-12 flex h-[46px] flex-row items-center'>
                    <input
                        className={`h-full w-full bg-[#D9D9D9] px-2 font-mono text-[18px] font-light leading-[23px] text-black lg:w-[480px]`}
                        value={proxyAddress}
                        onChange={(e) => setProxyAddress(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') onEnter()
                        }}
                        placeholder='Paste a new proxy address here (or ENS)'
                    />

                    <div
                        className={`flex h-full w-[72px] cursor-pointer flex-col justify-center ${
                            proxyAddress.length ? 'bg-white' : 'bg-[#ABABAB]'
                        } text-center`}
                        onClick={() => {
                            onEnter()
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

const Voter = ({ address }: { address: string }) => {
    const provider = usePublicClient()
    const [voterEns, setVoterEns] = useState('')

    useEffect(() => {
        ;(async () => {
            const ens = await provider.getEnsAddress({
                name: normalize(address)
            })
            setVoterEns(ens ?? '')
        })()
    }, [address])

    const removeVoter = trpc.accountSettings.removeVoter.useMutation()

    return (
        <div
            key={address}
            className='flex flex-col items-start gap-2 lg:flex-row lg:items-end lg:gap-12'
        >
            <div className='flex flex-col'>
                <div className='font-mono text-[18px] font-normal leading-[23px] text-white'>
                    {voterEns}
                </div>
                <div className='break-all font-mono text-[18px] font-light leading-[23px] text-[#ABABAB]'>
                    {address}
                </div>
            </div>

            <button
                onClick={() => {
                    removeVoter.mutate({
                        address: address
                    })
                }}
                className='text-[18px] font-light text-white underline'
            >
                Delete
            </button>
        </div>
    )
}
