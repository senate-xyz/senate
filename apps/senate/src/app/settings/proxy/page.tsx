'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import useSWR, { useSWRConfig } from 'swr'
import useSWRMutation from 'swr/mutation'

const fetcher = (url: string) => fetch(url).then((res) => res.json())
async function removeProxy(url: string, { arg }: any) {
    await fetch(url, {
        method: 'DELETE',
        body: JSON.stringify(arg)
    })
}
const ProxyList = () => {
    const { data, error } = useSWR('/api/user/settings/proxy/proxies', fetcher)
    const { trigger } = useSWRMutation(
        '/api/user/settings/proxy/remove',
        removeProxy
    )
    const { mutate } = useSWRConfig()

    if (error)
        return (
            <div className='text-[24px] font-light text-white'>
                An error has occurred.
            </div>
        )

    if (!data)
        return (
            <div className='text-[24px] font-light text-white'>Loading...</div>
        )

    return (
        <div>
            {data.proxies.map((proxy: string) => {
                return (
                    <div
                        key={proxy}
                        className='flex flex-row items-center gap-12'
                    >
                        <div className='font-mono text-[18px] font-light text-white'>
                            {proxy}
                        </div>

                        <button
                            onClick={() => {
                                trigger({ proxy: proxy })
                                    .then(() => {
                                        mutate(
                                            '/api/user/settings/proxy/proxies'
                                        )
                                        return
                                    })
                                    .catch(() => {
                                        return
                                    })
                            }}
                            className='text-[18px] font-light text-white underline'
                        >
                            Delete
                        </button>
                    </div>
                )
            })}
        </div>
    )
}

export default function Home() {
    const session = useSession()
    const router = useRouter()
    if (session.status != 'authenticated') router.push('/settings/account')

    // const provider = useProvider()

    //    const voters = trpc.user.settings.voters.useQuery(undefined, {
    //        refetchInterval: 5000
    //    })
    //    const removeVoter = trpc.user.settings.removeVoter.useMutation()
    //    const addVoter = trpc.user.settings.addVoter.useMutation()

    //    const [proxyAddress, setProxyAddress] = useState('')

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
                    <ProxyList />
                    {/* {voters.data &&
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
                                               provider.resolveName
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
                           })} */}
                </div>

                <div className='mt-12 flex h-[46px] flex-row items-center'>
                    {/* <input
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
                                       }
                                   }
                               )
                           }}
                       >
                           Add
                       </div> */}
                </div>
            </div>
        </div>
    )
}
