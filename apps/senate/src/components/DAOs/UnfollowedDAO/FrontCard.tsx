import Image from 'next/image'
import { DAOType } from '@senate/database'
import { FastAverageColor } from 'fast-average-color'
import { useState, useEffect } from 'react'

const FrontCard = (props: {
    dao: DAOType
    refreshDaos: () => void
    setShowMenu: (show: boolean) => void
}) => {
    const [backgroundColor, setBackgroundColor] = useState('#4e4e4e')

    useEffect(() => {
        const fetch = async (url: string) => {
            const fac = new FastAverageColor()
            fac.getColorAsync(url + '.svg')
                // eslint-disable-next-line promise/always-return
                .then((color) => {
                    setBackgroundColor(`${color.hex}50`)
                })
                .catch((e) => {
                    console.log(e)
                })
        }
        fetch(props.dao.picture)
    }, [props.dao.picture])

    return (
        <div
            style={{ backgroundColor: backgroundColor }}
            className='relative flex h-full w-full flex-col rounded text-sm font-bold text-white shadow'
            data-testid='daocard-unfollowed-front'
        >
            <div className='flex h-full flex-col items-center justify-end px-6 pb-6'>
                <Image
                    width='96'
                    height='96'
                    src={props.dao.picture + '.svg'}
                    alt='dao logo'
                    data-testid='dao-picture'
                />

                <div
                    className='pt-6 text-center text-[36px] font-thin leading-8'
                    data-testid='dao-name'
                >
                    {props.dao.name}
                </div>

                <div
                    className='flex flex-row gap-4 pt-6 opacity-50'
                    data-testid='dao-handlers'
                >
                    {props.dao.handlers.map((handler, index: number) => {
                        switch (handler.type) {
                            case 'SNAPSHOT':
                                return (
                                    <Image
                                        key={index}
                                        width='24'
                                        height='24'
                                        src='/assets/Chain/Snapshot/On_Dark.svg'
                                        alt='snapshot proposals'
                                        data-testid='dao-handler-snapshot'
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
                                        data-testid='dao-handler-chain'
                                    />
                                )
                        }
                    })}
                </div>
            </div>
            <button
                className='h-[56px] w-full bg-white text-xl font-bold text-black'
                onClick={() => {
                    props.setShowMenu(true)
                }}
                data-testid='open-menu'
            >
                Subscribe
            </button>
        </div>
    )
}

export default FrontCard
