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
            const fac = new FastAverageColor()
            fac.getColorAsync(url)
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

    const activeProposalsForDao = trpc.public.activeProposalsForDao.useQuery({
        daoId: props.dao.id,
    })

    return (
        <div
            style={{ backgroundColor: backgroundColor }}
            className="relative flex h-full w-full flex-col rounded text-sm font-bold text-white shadow"
            data-testid="daocard-followed-front"
        >
            <div className="absolute flex w-full flex-col items-end pt-4 pr-4">
                <div
                    className="cursor-pointer"
                    onClick={() => {
                        props.setShowMenu(true)
                    }}
                    data-testid="open-menu"
                >
                    <Image
                        width="32"
                        height="32"
                        src="/assets/Icon/Menu.svg"
                        alt="menu button"
                    />
                </div>
            </div>
            <div className="flex h-full flex-col items-center justify-end px-6 pb-6">
                <Image
                    width="96"
                    height="96"
                    src={props.dao.picture}
                    alt="dao logo"
                    data-testid="dao-picture"
                />

                <div
                    className="pt-6 text-center text-[36px] font-light leading-8"
                    data-testid="dao-name"
                >
                    {props.dao.name}
                </div>

                <div
                    className="flex flex-row gap-4 pt-6 opacity-50"
                    data-testid="dao-handler"
                >
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
                                        data-testid="dao-handler-snapshot"
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
                                        data-testid="dao-handler-chain"
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
                            ? 'cursor-pointer pt-6 pb-1 text-[15px] font-thin underline decoration-from-font underline-offset-2'
                            : 'pt-6 pb-1 text-[15px] font-thin'
                    }
                    data-testid="dao-proposals-count"
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
