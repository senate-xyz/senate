'use client'

import { redirect, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useAccount, useProvider } from 'wagmi'
import { trpc } from '../../../server/trpcClient'

export default function Home() {
    if (process.env.OUTOFSERVICE === 'true') redirect('/outofservice')
    const [cookie] = useCookies(['hasSeenLanding'])
    if (!cookie.hasSeenLanding) redirect('/landing')

    const account = useAccount()
    const router = useRouter()
    const provider = useProvider()

    const voters = trpc.accountSettings.voters.useQuery(undefined, {
        refetchInterval: 5000
    })

    const addVoter = trpc.accountSettings.addVoter.useMutation()

    const [proxyAddress, setProxyAddress] = useState('')

    useEffect(() => {
        if (!account.isConnected) router.push('/settings/account')
    }, [account])

    return (
        <div className='flex flex-col gap-12'>
            <div className='flex flex-col gap-4'>
                <div className='text-[24px] font-light leading-[30px] text-white'>
                    Your Other Addresses
                </div>

                <div className='w-[50%] text-[18px] font-light leading-[23px] text-white'>
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
                        className={`h-full w-[480px] bg-[#D9D9D9] px-2 font-mono text-[18px] font-light leading-[23px] text-black`}
                        value={proxyAddress}
                        onChange={(e) => setProxyAddress(e.target.value)}
                        placeholder='Paste a new proxy address here (or ENS)'
                    />

                    <div
                        className={`flex h-full w-[72px] cursor-pointer flex-col justify-center ${
                            proxyAddress.length ? 'bg-white' : 'bg-[#ABABAB]'
                        } text-center`}
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
    const provider = useProvider()
    const [voterEns, setVoterEns] = useState('')

    useEffect(() => {
        ;(async () => {
            const ens = await provider.lookupAddress(address)
            setVoterEns(ens ?? '')
        })()
    }, [address])

    const removeVoter = trpc.accountSettings.removeVoter.useMutation()

    return (
        <div key={address} className='flex flex-row items-end gap-12'>
            <div className='flex flex-col'>
                <div className='font-mono text-[18px] font-normal leading-[23px] text-white'>
                    {voterEns}
                </div>
                <div className='font-mono text-[18px] font-light leading-[23px] text-[#ABABAB]'>
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
