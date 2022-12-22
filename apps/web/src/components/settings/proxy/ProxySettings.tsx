import Link from 'next/link'
import { useState } from 'react'
import { trpc } from '../../../utils/trpc'
import { useProvider } from 'wagmi'
import { ethers } from 'ethers'

const tabs: { id: number; name: string; color: string; link: string }[] = [
    {
        id: 0,
        name: 'Account',
        color: 'text-[#808080] text-[36px] font-light cursor-pointer',
        link: '/settings/account',
    },
    {
        id: 1,
        name: 'Proxy Addresses',
        color: 'text-white text-[36px] font-bold cursor-pointer',
        link: '/settings/proxy',
    },
    {
        id: 2,
        name: 'Notifications',
        color: 'text-[#808080] text-[36px] font-light cursor-pointer',
        link: '/settings/notifications',
    },
]

const ProxySettings = () => {
    const provider = useProvider()

    const voters = trpc.user.settings.voters.useQuery()
    const removeVoter = trpc.user.settings.removeVoter.useMutation()
    const addVoter = trpc.user.settings.addVoter.useMutation()

    const [proxyAddress, setProxyAddress] = useState('')

    return (
        <div className="flex grow flex-col bg-[#1E1B20] p-5">
            <div className="flex w-full flex-row gap-10">
                {tabs.map((tab) => {
                    return (
                        <Link
                            key={tab.id}
                            className={tab.color}
                            href={tab.link}
                        >
                            {tab.name}
                        </Link>
                    )
                })}
            </div>
            <div className="mt-2 flex flex-col gap-12">
                <div className="flex flex-col gap-2">
                    <div className="text-[24px] font-light text-white">
                        Your Proxy Addresses
                    </div>

                    <div className="w-[50%] text-[18px] font-light text-white">
                        Proxy Addresses are wallet addresses that you can add in
                        Senate, so that you can see the voting activity of
                        multiple addresses.
                    </div>

                    <div className="mt-12 flex flex-col gap-6">
                        {voters.data &&
                            voters.data.map((voter) => {
                                return (
                                    <div
                                        key={voter.address}
                                        className="flex flex-row items-center gap-12"
                                    >
                                        <div className="font-mono text-[18px] font-light text-white">
                                            {voter.address}
                                        </div>
                                        <button
                                            onClick={() => {
                                                provider.resolveName
                                                removeVoter.mutate(
                                                    { address: voter.address },
                                                    {
                                                        onSuccess() {
                                                            voters.refetch()
                                                        },
                                                    }
                                                )
                                            }}
                                            className="text-[18px] font-light text-white underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )
                            })}
                    </div>

                    <div className="mt-12 flex h-[46px] flex-row items-center">
                        <input
                            className="h-full w-[480px] bg-[#D9D9D9] px-2 text-black"
                            value={proxyAddress}
                            onChange={(e) => setProxyAddress(e.target.value)}
                            placeholder="Paste a new proxy address here"
                        />

                        <div
                            className="flex h-full w-[72px] cursor-pointer flex-col justify-center bg-[#ABABAB] text-center"
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
                                        },
                                    }
                                )
                            }}
                        >
                            Add
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProxySettings
