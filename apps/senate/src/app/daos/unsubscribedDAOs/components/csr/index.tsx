'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import ClientOnly from '../../../../clientOnly'

export const UnsubscribedDAO = (props: {
    daoId: string
    daoName: string
    daoPicture: string
    bgColor: string | undefined
    daoHandlers: string[]
}) => {
    const [showMenu, setShowMenu] = useState(false)
    const [getDailyEmails, setDailyEmails] = useState(true)

    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [isFetching, setIsFetching] = useState(false)
    const isMutating = isFetching || isPending

    return (
        <div className='h-[320px] w-[240px]'>
            {showMenu ? (
                <div
                    className={`relative flex h-full w-full flex-col rounded bg-black text-sm font-bold text-white shadow ${
                        isMutating ? 'opacity-50' : 'opacity-100'
                    }`}
                >
                    <div className='flex w-full flex-row justify-between px-4 pt-4'>
                        <p>Notifications</p>
                        <div
                            className='cursor-pointer'
                            onClick={() => {
                                setShowMenu(false)
                            }}
                        >
                            <Image
                                width='32'
                                height='32'
                                src='/assets/Icon/Close.svg'
                                alt='close button'
                            />
                        </div>
                    </div>
                    <div className='flex w-full grow flex-col items-center justify-between'>
                        <div className='flex w-full flex-col items-center gap-2 px-3 pt-5'>
                            <div className='flex w-full flex-row items-center justify-between gap-2'>
                                <p>Get daily emails</p>
                                <label className='relative inline-flex cursor-pointer items-center bg-gray-400'>
                                    <input
                                        type='checkbox'
                                        checked={getDailyEmails}
                                        onChange={(e) =>
                                            setDailyEmails(e.target.checked)
                                        }
                                        className='peer sr-only'
                                    />
                                    <div className="peer h-6 w-11 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5  after:bg-black after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-700" />
                                </label>
                            </div>
                        </div>
                    </div>
                    <button
                        className='h-14 w-full bg-white text-xl font-bold text-black'
                        onClick={async () => {
                            setIsFetching(true)
                            await fetch('/api/user/subscriptions/subscribe', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    daoId: props.daoId,
                                    dailyEmails: getDailyEmails
                                })
                            })
                            setIsFetching(false)

                            startTransition(() => {
                                router.refresh()
                                setShowMenu(false)
                            })
                        }}
                    >
                        Confirm
                    </button>
                </div>
            ) : (
                <div
                    style={{
                        backgroundImage: `linear-gradient(45deg, ${props.bgColor}40 15%, ${props.bgColor}10)`,
                        filter: 'saturate(5)'
                    }}
                    className='relative flex h-full w-full flex-col rounded text-sm font-bold text-white shadow'
                >
                    <div className='flex grow flex-col items-center justify-end px-6 pb-6'>
                        <Image
                            style={{
                                filter: 'saturate(0.2)'
                            }}
                            width='96'
                            height='96'
                            src={props.daoPicture + '_medium.png'}
                            quality='100'
                            alt='dao logo'
                        />
                        <div className='pt-6 text-center text-[36px] font-thin leading-8'>
                            {props.daoName}
                        </div>
                        <div className='flex flex-row gap-4 pt-6 opacity-50'>
                            {props.daoHandlers.map((handler, index: number) => {
                                switch (handler) {
                                    case 'SNAPSHOT':
                                        return (
                                            <Image
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

                    <ClientOnly>
                        <SubscribeButton setShowMenu={setShowMenu} />
                    </ClientOnly>
                </div>
            )}
        </div>
    )
}

const SubscribeButton = (props: { setShowMenu: (arg0: boolean) => void }) => {
    const { openConnectModal } = useConnectModal()
    const session = useSession()

    return (
        <>
            <button
                className='h-14 w-full bg-white text-xl font-bold text-black'
                onClick={() => {
                    session.status == 'authenticated'
                        ? props.setShowMenu(true)
                        : openConnectModal && openConnectModal()
                }}
            >
                Subscribe
            </button>
        </>
    )
}
