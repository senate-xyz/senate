'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const endOptions: { name: string; time: number }[] = [
    {
        name: 'Last 90 days',
        time: 90
    },
    {
        name: 'Last 30 days',
        time: 30
    },
    {
        name: 'Last 7 days',
        time: 7
    },
    {
        name: 'Last 24 hours',
        time: 1
    }
]

const voteOptions: { id: string; name: string }[] = [
    {
        id: 'any',
        name: 'Any'
    },
    {
        id: 'no',
        name: 'Not voted on'
    },
    {
        id: 'yes',
        name: 'Voted on'
    }
]

export const Filters = (props: {
    subscriptions: { id: string; name: string }[]
}) => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [from, setFrom] = useState('any')
    const [end, setEnd] = useState(1)
    const [voted, setVoted] = useState('any')

    useEffect(() => {
        if (searchParams) {
            setFrom(String(searchParams.get('from') ?? 'any'))
            setEnd(Number(searchParams.get('end') ?? 90))
            setVoted(String(searchParams.get('voted') ?? 'any'))
        }
    }, [searchParams])

    useEffect(() => {
        router.push(`/proposals/past?from=${from}&end=${end}&voted=${voted}`)
    }, [from, end, voted, router])

    return (
        <div className='mt-[16px] flex flex-col'>
            <div className='flex flex-row gap-5'>
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
                    >
                        <option key='any' value='any'>
                            Any
                        </option>
                        {props.subscriptions.map((sub) => {
                            return (
                                <option key={sub.name} value={sub.name}>
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
                        <div>Ended on</div>
                    </label>
                    <select
                        className='h-full w-full text-black'
                        id='end'
                        onChange={(e) => {
                            setEnd(Number(e.target.value))
                        }}
                        value={end}
                    >
                        {endOptions.map((endOption) => {
                            return (
                                <option
                                    key={endOption.time}
                                    value={endOption.time}
                                >
                                    {endOption.name}
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
                            setVoted(String(e.target.value))
                        }}
                        value={voted}
                    >
                        {voteOptions.map((voteOption) => {
                            return (
                                <option
                                    key={voteOption.id}
                                    value={voteOption.id}
                                >
                                    {voteOption.name}
                                </option>
                            )
                        })}
                    </select>
                </div>
            </div>
        </div>
    )
}
