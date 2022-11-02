import { inferProcedureOutput } from '@trpc/server'
import Image from 'next/image'
import { Dispatch, SetStateAction, useState } from 'react'
import { DAO } from '@senate/common-types'
import { AppRouter } from '../../../server/trpc/router/_app'

import { trpc } from '../../../utils/trpc'
import { SharePopover } from './SharePopover'
import { TrackerTable } from './table/TrackerTable'

export const TrackerHeader = (props: { shareButton: boolean }) => (
    <div>
        <p>Vote tracker</p>
        {props.shareButton && <SharePopover />}
    </div>
)

export const TrackerTab = (props: {
    daoName: string
    daoPicture: string
    setSelectedDao: any
}) => {
    return (
        <button
            className="m-4 flex rounded border border-gray-400 p-2"
            onClick={() => {
                props.setSelectedDao(props.daoName)
            }}
        >
            <Image
                src={props.daoPicture}
                width={25}
                height={25}
                alt="dao image"
            />

            <p>{props.daoName}</p>
        </button>
    )
}
export const TrackerTabList = (props: {
    daosTabs: DAO[]
    setSelectedDao: Dispatch<SetStateAction<string | undefined>>
}) => (
    <div className="flex rounded border border-gray-300">
        {props.daosTabs?.map((dao) => {
            return (
                <TrackerTab
                    key={dao.name}
                    daoName={dao.name}
                    daoPicture={dao.picture}
                    setSelectedDao={props.setSelectedDao}
                />
            )
        })}
    </div>
)

export const TrackerView = (props: {
    votes: inferProcedureOutput<AppRouter['tracker']['track']>
    daosTabs: DAO[]
    shareButton: boolean
    setSelectedDao: Dispatch<SetStateAction<string | undefined>>
    selectedDao: string | undefined
}) => {
    return (
        <div>
            <TrackerHeader shareButton={props.shareButton} />
            <TrackerTabList
                daosTabs={props.daosTabs}
                setSelectedDao={props.setSelectedDao}
            />
            <TrackerTable votes={props.votes} selectedDao={props.selectedDao} />
        </div>
    )
}

export const Tracker = (props: { address: string; useProxies: boolean }) => {
    const [selectedDao, setSelectedDao] = useState<string>()

    let userVotes

    if (!props.useProxies) {
        userVotes = trpc.tracker.track.useQuery({
            addresses: [props.address],
        })
    } else {
        const proxies = trpc.user.proxyAddreses.useQuery()
        userVotes = trpc.tracker.track.useQuery({
            addresses: proxies.data
                ? [props.address, ...proxies.data.map((proxy) => proxy.address)]
                : Array.from(props.address),
        })
    }

    const daosTabs = userVotes.data
        ?.map((vote) => vote.dao)
        .filter((element, index, array) => {
            return array.findIndex((a) => a.name == element.name) === index
        })

    if (!userVotes.data) return <div>Loading</div>
    if (!daosTabs) return <div>No data</div>

    return (
        <TrackerView
            shareButton={props.useProxies ? false : true}
            daosTabs={daosTabs}
            votes={userVotes.data}
            selectedDao={selectedDao}
            setSelectedDao={setSelectedDao}
        />
    )
}

export default Tracker
