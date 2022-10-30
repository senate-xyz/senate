import { inferProcedureOutput } from '@trpc/server'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useState } from 'react'
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
export const TrackerTabList = (props: { daosTabs; setSelectedDao }) => (
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
    daosTabs
    shareButton
    setSelectedDao
    selectedDao
}) => (
    <div>
        <TrackerHeader shareButton={props.shareButton} />
        <TrackerTabList
            daosTabs={props.daosTabs}
            setSelectedDao={props.setSelectedDao}
        />
        <TrackerTable votes={props.votes} selectedDao={props.selectedDao} />
    </div>
)

export const Tracker = (props: { address: string; shareButton: boolean }) => {
    const [selectedDao, setSelectedDao] = useState<string>()

    const { data: session } = useSession()

    const votes = trpc.tracker.track.useQuery({
        address: props.address
            ? props.address
            : session?.user?.id ?? '0x000000000000000000000000000000000000dEaD',
    })

    const daosTabs = votes.data
        ?.map((vote: { dao }) => vote.dao)
        .filter((element: { name }, index, array) => {
            return (
                array.findIndex((a: { name }) => a.name == element.name) ===
                index
            )
        })

    if (!votes.data) return <div>Loading</div>

    return (
        <TrackerView
            shareButton={props.shareButton}
            daosTabs={daosTabs}
            votes={votes.data}
            selectedDao={selectedDao}
            setSelectedDao={setSelectedDao}
        />
    )
}

export default Tracker
