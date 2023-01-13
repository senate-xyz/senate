'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const endingInOptions: { name: string; time: number }[] = [
    {
        name: 'Any day',
        time: 365
    },
    {
        name: '7 days',
        time: 7
    },
    {
        name: '5 days',
        time: 5
    },
    {
        name: '3 days',
        time: 3
    },
    {
        name: '1 days',
        time: 1
    }
]

const voteStatus: { id: number; name: string }[] = [
    {
        id: -1,
        name: 'Any'
    },
    {
        id: 0,
        name: 'Not voted on'
    },
    {
        id: 1,
        name: 'Voted on'
    }
]

export const Filters = (props: {
    subscriptions: { id: string; name: string }[]
}) => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [from, setFrom] = useState('0')
    const [end, setEnd] = useState(365)
    const [voted, setVoted] = useState(-1)

    useEffect(() => {
        setFrom(String(searchParams.get('from') ?? '0'))
        setEnd(Number(searchParams.get('end') ?? 365))
        setVoted(Number(searchParams.get('voted') ?? -1))
    }, [searchParams])

    useEffect(() => {
        router.push(`/proposals/active?from=${from}&end=${end}&voted=${voted}`)
    }, [from, end, voted])

    return (
        <div className='mt-[16px] flex flex-col'>
            <div className='flex flex-row gap-5' data-testid='active-proposals'>
                <div className='flex h-[38px] w-[300px] flex-row items-center'>
                    <label
                        className='flex h-full min-w-max items-center bg-black py-[9px] px-[12px] text-[15px] text-white'
                        htmlFor='from'
                    >
                        From
                    </label>
                    <select
                        className='h-full w-full text-black'
                        id='from'
                        onChange={(e) => {
                            setFrom(e.target.value)
                        }}
                        value={from}
                        data-testid='from-selector'
                    >
                        <option key='0' value='0'>
                            Any
                        </option>
                        {props.subscriptions.map((sub) => {
                            return (
                                <option
                                    key={sub.id}
                                    value={sub.id}
                                    data-testid={`select-${sub.id}`}
                                >
                                    {sub.name}
                                </option>
                            )
                        })}
                    </select>
                </div>

                <div className='flex h-[38px] w-[300px] flex-row items-center'>
                    <label
                        className='flex h-full min-w-max items-center bg-black py-[9px] px-[12px] text-[15px] text-white'
                        htmlFor='end'
                    >
                        <div>Ending in</div>
                    </label>
                    <select
                        className='h-full w-full text-black'
                        id='end'
                        onChange={(e) => {
                            setEnd(Number(e.target.value))
                        }}
                        value={end}
                        data-testid='ending-selector'
                    >
                        {endingInOptions.map((endingIn) => {
                            return (
                                <option
                                    key={endingIn.time}
                                    value={endingIn.time}
                                    data-testid={`select-${endingIn.time}`}
                                >
                                    {endingIn.name}
                                </option>
                            )
                        })}
                    </select>
                </div>

                <div className='flex h-[38px] w-[300px] flex-row items-center'>
                    <label
                        className='flex h-full min-w-max items-center bg-black py-[9px] px-[12px] text-[15px] text-white'
                        htmlFor='voted'
                    >
                        <div>With Vote Status of</div>
                    </label>
                    <select
                        className='h-full w-full text-black'
                        id='voted'
                        onChange={(e) => {
                            setVoted(Number(e.target.value))
                        }}
                        value={voted}
                        data-testid='status-selector'
                    >
                        {voteStatus.map((status) => {
                            return (
                                <option
                                    key={status.id}
                                    value={status.id}
                                    data-testid={`select-${status.id}`}
                                >
                                    {status.name}
                                </option>
                            )
                        })}
                    </select>
                </div>
            </div>
        </div>
    )
}
