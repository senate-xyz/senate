'use client'

import { useEffect, useState } from 'react'
import InnerTable from './InnerTable'
import { useRouter, useSearchParams } from 'next/navigation'

const endingInOptions: { name: string; time: number }[] = [
    {
        name: 'Any day',
        time: 365 * 24 * 60 * 60 * 1000
    },
    {
        name: '7 days',
        time: 7 * 24 * 60 * 60 * 1000
    },
    {
        name: '5 days',
        time: 5 * 24 * 60 * 60 * 1000
    },
    {
        name: '3 days',
        time: 3 * 24 * 60 * 60 * 1000
    },
    {
        name: '1 days',
        time: 1 * 24 * 60 * 60 * 1000
    }
]

const voteStatus: { id: number; name: string }[] = [
    {
        id: 0,
        name: 'Any status'
    },
    {
        id: 1,
        name: 'Voted on'
    },
    {
        id: 2,
        name: 'Not voted on'
    }
]

export const OuterTable = (props: {
    subscriptions: { id: string; name: string }[]
}) => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [from, setFrom] = useState('any')
    const [endingIn, setEndingIn] = useState(365 * 24 * 60 * 60 * 1000)
    const [withVoteStatus, setWithVoteStatus] = useState(0)

    useEffect(() => {
        setFrom(String(searchParams.get('fromDAO') ?? 'any'))
        setEndingIn(
            Number(searchParams.get('endingIn') ?? 365 * 24 * 60 * 60 * 1000)
        )
        setWithVoteStatus(Number(searchParams.get('withVoteStatus') ?? 0))
    }, [searchParams])

    useEffect(() => {
        router.push(
            `/proposals/active?fromDAO=${from}&endingIn=${endingIn}&withVoteStatus=${withVoteStatus}&active=true`
        )
    }, [from, endingIn, withVoteStatus])

    return (
        <div className='mt-[16px] flex flex-col'>
            <div className='flex flex-row gap-5' data-testid='active-proposals'>
                <div className='flex h-[38px] w-[300px] flex-row items-center'>
                    <label
                        className='flex h-full min-w-max items-center bg-black py-[9px] px-[12px] text-[15px] text-white'
                        htmlFor='fromDao'
                    >
                        From
                    </label>
                    <select
                        className='h-full w-full text-black'
                        id='fromDao'
                        onChange={(e) => {
                            setFrom(e.target.value)
                        }}
                        value={from}
                        data-testid='from-selector'
                    >
                        <option key='any' value='any'>
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
                        htmlFor='endingIn'
                    >
                        <div>Ending in</div>
                    </label>
                    <select
                        className='h-full w-full text-black'
                        id='endingIn'
                        onChange={(e) => {
                            setEndingIn(Number(e.target.value))
                        }}
                        value={endingIn}
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
                        htmlFor='voteStatus'
                    >
                        <div>With Vote Status of</div>
                    </label>
                    <select
                        className='h-full w-full text-black'
                        id='voteStatus'
                        onChange={(e) => {
                            setWithVoteStatus(Number(e.target.value))
                        }}
                        value={withVoteStatus}
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
            <InnerTable
                from={from}
                endingIn={endingIn}
                withVoteStatus={withVoteStatus}
            />
        </div>
    )
}
