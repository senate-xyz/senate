import Image from 'next/image'
import { DAOType } from '@senate/common-types'

const FrontCard = (props: {
    dao: DAOType
    refreshDaos: () => void
    setShowMenu: (show: boolean) => void
}) => {
    return (
        <div className="mt-4 mr-1 mb-1 flex h-80 w-60 flex-col items-center justify-between rounded bg-gray-500 text-sm font-bold text-white shadow">
            <div className="flex flex-col items-center pt-5">
                <Image
                    width="96"
                    height="96"
                    src={props.dao.picture}
                    alt="dao Image"
                />

                <div className="px-6 py-4">
                    <div className="mb-2 text-3xl font-bold">
                        {props.dao.name}
                    </div>
                </div>

                <div className="flex flex-row">
                    {props.dao.handlers.map((handler, index: number) => {
                        switch (handler.type) {
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
                                        src="https://assets.coingecko.com/coins/images/279/thumb/ethereum.png"
                                        alt="dao Image"
                                    />
                                )

                            case 'SNAPSHOT':
                                return (
                                    <Image
                                        key={index}
                                        width="24"
                                        height="24"
                                        src="https://avatars.githubusercontent.com/u/72904068?s=200&v=4"
                                        alt="dao Image"
                                    />
                                )
                        }
                    })}
                </div>
            </div>
            <button
                className="h-20 w-full bg-gray-300 text-xl font-bold text-black"
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
