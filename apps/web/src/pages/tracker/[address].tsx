import type { NextPage } from 'next'

import { useRouter } from 'next/router'
import { Tracker } from '../../components/views/tracker/Tracker'

const TrackerPage: NextPage = () => {
    const router = useRouter()
    const { address } = router.query

    if (!address) return <div>Loading</div>
    return (
        <div>
            <Tracker address={String(address)} shareButton={false} />
        </div>
    )
}

export default TrackerPage
