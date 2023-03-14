'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { trpc } from '../../../../../server/trpcClient'

export const SubscribedDAO = (props: {
    daoId: string
    daoName: string
    daoPicture: string
    bgColor: string | undefined
    daoHandlers: string[]
    activeProposals: number
    notificationsEnabled: boolean
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
    }, [props])

    const [showMenu, setShowMenu] = useState(false)
    // const [getDailyEmails, setDailyEmails] = useState(
    //     props.notificationsEnabled
    // )

    const router = useRouter()

    const unsubscribe = trpc.subscriptions.unsubscribe.useMutation()
    // const updateDAO = trpc.subscriptions.updateSubscription.useMutation()

    return (
        <div className='h-[320px] w-[240px]'>
            {showMenu ? (
                <div
                    className={`relative flex h-full w-full flex-col rounded bg-black text-sm font-bold text-white shadow ${
                        unsubscribe.isLoading ? 'opacity-50' : 'opacity-100'
                    }`}
                >
                    <div className='flex h-full flex-col justify-between'>
                        <div className='flex w-full flex-row items-start justify-between px-4 pt-4'>
                            <div className='justify-center  text-center text-[21px] font-semibold leading-8'>
                                {props.daoName}
                            </div>
                            <div
                                className='cursor-pointer'
                                onClick={() => {
                                    setShowMenu(false)
                                }}
                            >
                                <Image
                                    loading='eager'
                                    priority={true}
                                    width='32'
                                    height='32'
                                    src='/assets/Icon/Close.svg'
                                    alt='close button'
                                />
                            </div>
                        </div>
                        <div className='flex h-full flex-col gap-4 px-4 pt-4'>
                            <div className='text-[15px] font-thin leading-[19px]'>
                                You are currently subscribed to follow the
                                off-chain and on-chain proposals of{' '}
                                {props.daoName}.
                            </div>
                            <div className='text-[15px] font-thin leading-[19px]'>
                                You are also getting daily updates on these
                                proposals on your email.
                            </div>
                            <div className='text-[15px] font-thin leading-[19px]'>
                                Do you wish to unsubscribe from {props.daoName}?
                            </div>
                        </div>

                        <div
                            className='w-full cursor-pointer px-4 pb-4 text-center text-[15px] font-thin text-white underline'
                            onClick={async () => {
                                unsubscribe.mutate(
                                    { daoId: props.daoId },
                                    {
                                        onSuccess: () => {
                                            router.refresh()
                                            setShowMenu(false)
                                        }
                                    }
                                )
                            }}
                        >
                            Unsubscribe from {props.daoName}
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    style={{
                        backgroundImage: `linear-gradient(45deg, ${props.bgColor}40 15%, ${props.bgColor}10)`,
                        filter: 'saturate(5)'
                    }}
                    className='relative flex h-full w-full flex-col rounded text-sm font-bold text-white shadow'
                >
                    <div className='absolute flex w-full flex-col items-end pt-4 pr-4'>
                        <div
                            className='cursor-pointer'
                            onClick={() => {
                                setShowMenu(true)
                            }}
                        >
                            <Image
                                loading='eager'
                                priority={true}
                                width='32'
                                height='32'
                                src='/assets/Icon/Menu.svg'
                                alt='menu button'
                            />
                        </div>
                    </div>
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
                        <div
                            className={
                                props.activeProposals
                                    ? 'cursor-pointer pt-6 pb-1 text-[15px] font-thin underline decoration-from-font underline-offset-2'
                                    : 'pt-6 pb-1 text-[15px] font-thin'
                            }
                        >
                            {props.activeProposals ? (
                                <Link
                                    href={`/proposals/active?from=${props.daoName}`}
                                >
                                    {props.activeProposals +
                                        ' Active Proposals'}
                                </Link>
                            ) : (
                                'No Active Proposals'
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
