'use client'

import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useAccount } from 'wagmi'
import { trpc } from '../../../../../server/trpcClient'

export const UnsubscribedDAO = (props: {
    daoId: string
    daoName: string
    daoPicture: string
    bgColor: string | undefined
    daoHandlers: string[]
}) => {
    const [imgSrc, setImgSrc] = useState(
        props.daoPicture
            ? props.daoPicture + '_medium.png'
            : '/assets/Project_Icons/placeholder_medium.png'
    )

    useEffect(() => {
        setImgSrc(
            props.daoPicture
                ? props.daoPicture + '_medium.png'
                : '/assets/Project_Icons/placeholder_medium.png'
        )
    }, [props.daoPicture])

    const [cookie, setCookie, removeCookie] = useCookies(['subscribe'])

    const account = useAccount()
    const session = useSession()
    const { openConnectModal } = useConnectModal()

    const router = useRouter()
    const subscribe = trpc.subscriptions.subscribe.useMutation()

    const connectAndSubscribe = (id: string) => {
        setCookie('subscribe', id)
        openConnectModal && openConnectModal()
    }

    //automagically subscribe to the dao you tried to but weren't connected
    useEffect(() => {
        if (
            cookie.subscribe &&
            session.status == 'authenticated' &&
            subscribe.isIdle
        ) {
            subscribe.mutate(
                {
                    daoId: cookie.subscribe,
                    notificationsEnabled: true
                },
                {
                    onSuccess: () => {
                        router.refresh()
                        removeCookie('subscribe')
                    },
                    onError: () => {
                        router.refresh()
                        removeCookie('subscribe')
                    }
                }
            )
        }
    }, [cookie.subscribe, session])

    return (
        <div className='h-[320px] w-[240px]'>
            <div
                style={{
                    backgroundImage: `linear-gradient(45deg, ${props.bgColor}40 15%, ${props.bgColor}10)`,
                    filter: 'saturate(5)'
                }}
                className='relative flex h-full w-full flex-col rounded text-sm font-bold text-white shadow'
            >
                <div className='flex grow flex-col items-center justify-end px-6 pb-6'>
                    <Image
                        loading='eager'
                        priority={true}
                        style={{
                            filter: 'saturate(0.2)'
                        }}
                        width='96'
                        height='96'
                        src={imgSrc}
                        onError={() => {
                            setImgSrc(
                                '/assets/Project_Icons/placeholder_medium.png'
                            )
                        }}
                        quality='100'
                        alt='dao logo'
                    />
                    <div className='pt-6 text-center text-[36px] font-thin leading-8'>
                        {props.daoName}
                    </div>
                    <div className='flex flex-row gap-4 pt-6 opacity-50'>
                        {props.daoHandlers
                            .sort((a, b) => a.localeCompare(b))
                            .map((handler, index: number) => {
                                switch (handler) {
                                    case 'SNAPSHOT':
                                        return (
                                            <Image
                                                loading='eager'
                                                priority={true}
                                                key={index}
                                                width='24'
                                                height='24'
                                                src='/assets/Chain/Snapshot/On_Dark.svg'
                                                alt='snapshot proposals'
                                            />
                                        )
                                    case 'AAVE_CHAIN':
                                    case 'COMPOUND_CHAIN':
                                    case 'UNISWAP_CHAIN':
                                    case 'MAKER_POLL':
                                    case 'MAKER_EXECUTIVE':
                                        return (
                                            <Image
                                                loading='eager'
                                                priority={true}
                                                key={index}
                                                width='24'
                                                height='24'
                                                src='/assets/Chain/Ethereum/On_Dark.svg'
                                                alt='chain proposals'
                                            />
                                        )
                                    case 'MAKER_POLL_ARBITRUM':
                                        return (
                                            <Image
                                                loading='eager'
                                                priority={true}
                                                key={index}
                                                width='24'
                                                height='24'
                                                src='/assets/Chain/Arbitrum/On_Dark.svg'
                                                alt='chain proposals'
                                            />
                                        )
                                    default:
                                        return (
                                            <Image
                                                loading='eager'
                                                priority={true}
                                                key={index}
                                                width='24'
                                                height='24'
                                                src='/assets/Chain/Ethereum/On_Dark.svg'
                                                alt='chain proposals'
                                            />
                                        )
                                }
                            })}
                    </div>
                </div>

                <button
                    className='h-14 w-full bg-white text-xl font-bold text-black'
                    onClick={() => {
                        account.isConnected && session.status == 'authenticated'
                            ? subscribe.mutate(
                                  {
                                      daoId: props.daoId,
                                      notificationsEnabled: true
                                  },
                                  {
                                      onSuccess: () => {
                                          router.refresh()
                                      },
                                      onError: () => {
                                          router.refresh()
                                      }
                                  }
                              )
                            : connectAndSubscribe(props.daoId)
                    }}
                >
                    Subscribe
                </button>
            </div>
        </div>
    )
}
