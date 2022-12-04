import Image from 'next/image'
import { DAOType } from '@senate/common-types'
import { FastAverageColor } from 'fast-average-color'
import { useState, useEffect } from 'react'

const FrontCard = (props: {
    dao: DAOType
    refreshDaos: () => void
    setShowMenu: (show: boolean) => void
}) => {
    const [backgroundColor, setBackgroundColor] = useState('#525252')

    useEffect(() => {
        const fetch = async (url: string) => {
            console.log(url)
            const fac = new FastAverageColor()
            fac.getColorAsync(url)
                // eslint-disable-next-line promise/always-return
                .then((color) => {
                    setBackgroundColor(`${color.hex}80`)
                    console.log(color.hex)
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
            // eslint-disable-next-line tailwindcss/no-custom-classname
            className={`flex h-full w-full flex-col items-center justify-between rounded text-sm font-bold text-white shadow`}
        >
            <div className="flex flex-col items-center justify-between pt-4">
                <Image
                    width="96"
                    height="96"
                    src={props.dao.picture}
                    alt="dao Image"
                />

                <div className="px-6 py-4">
                    <div className="mb-2 text-[36px] font-thin">
                        {props.dao.name}
                    </div>
                </div>

                <div className="flex flex-row gap-4 opacity-50">
                    {props.dao.handlers.map((handler, index: number) => {
                        switch (handler.type) {
                            case 'SNAPSHOT':
                                return (
                                    <Image
                                        key={index}
                                        width="24"
                                        height="24"
                                        src="/assets/Chain/Snapshot/On_Dark.svg"
                                        alt="snapshot proposals"
                                    />
                                )
                            case 'BRAVO1':
                            case 'BRAVO2':
                            case 'MAKER_POLL_CREATE':
                            case 'MAKER_POLL_VOTE':
                            case 'MAKER_EXECUTIVE':
                                return (
                                    <Image
                                        key={index}
                                        width="24"
                                        height="24"
                                        src="/assets/Chain/Ethereum/On_Dark.svg"
                                        alt="chain proposals"
                                    />
                                )
                        }
                    })}
                </div>
            </div>
            <button
                className="h-20 w-full bg-white text-xl font-bold text-black"
                onClick={() => {
                    props.setShowMenu(true)
                }}
            >
                Subscribe
            </button>
        </div>
    )
}

export default FrontCard
