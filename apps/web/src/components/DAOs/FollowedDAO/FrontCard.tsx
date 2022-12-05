import Image from 'next/image'
import { DAOType } from '@senate/common-types'
import { trpc } from '../../../utils/trpc'
import { useEffect, useState } from 'react'
import { FastAverageColor } from 'fast-average-color'

const FrontCard = (props: {
    dao: DAOType
    refreshDaos: () => void
    setShowMenu: (show: boolean) => void
}) => {
    const [backgroundColor, setBackgroundColor] = useState('#4e4e4e')

    useEffect(() => {
        const fetch = async (url: string) => {
            console.log(url)
            const fac = new FastAverageColor()
            fac.getColorAsync(url)
                // eslint-disable-next-line promise/always-return
                .then((color) => {
                    setBackgroundColor(`${color.hex}50`)
                    console.log(color.hex)
                })
                .catch((e) => {
                    console.log(e)
                })
        }
        fetch(props.dao.picture)
    }, [props.dao.picture])

    const activeProposalsForDao = trpc.public.activeProposalsForDao.useQuery({
        daoId: props.dao.id,
    })

    const cardClassNames = `flex h-full w-full flex-col rounded text-sm font-bold text-white shadow`

    return (
        <div
            style={{ backgroundColor: backgroundColor }}
            // eslint-disable-next-line tailwindcss/no-custom-classname
            className={cardClassNames}
        >
            <div className="flex w-full flex-col items-end pt-4 pr-4">
                <div
                    className="cursor-pointer"
                    onClick={() => {
                        props.setShowMenu(true)
                    }}
                >
                    <Image
                        width="32"
                        height="32"
                        src="/assets/Icon/Menu.svg"
                        alt="menu button"
                    />
                </div>
            </div>
            <div className="flex h-full flex-col items-center justify-between">
                <Image
                    width="96"
                    height="96"
                    src={props.dao.picture}
                    alt="dao logo"
                />

                <div className="px-6 py-4">
                    <div className="mb-2 text-[36px] font-light leading-8">
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
                <div
                    className={
                        activeProposalsForDao.data?.filter(
                            (proposal) => proposal.timeEnd > new Date()
                        ).length
                            ? 'cursor-pointer p-6 text-[15px] font-thin underline decoration-from-font underline-offset-2'
                            : 'p-6 text-[15px] font-thin'
                    }
                >
                    {activeProposalsForDao.data?.filter(
                        (proposal) => proposal.timeEnd > new Date()
                    ).length
                        ? activeProposalsForDao.data
                              ?.filter(
                                  (proposal) => proposal.timeEnd > new Date()
                              )
                              .length.toString() + ' Active Proposals'
                        : 'No Active Proposals'}
                </div>
            </div>
        </div>
    )
}

export default FrontCard
