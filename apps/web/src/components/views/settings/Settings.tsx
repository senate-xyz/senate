import { useSession } from 'next-auth/react'
import VoterAddresses from './voter-addresses/VoterAddresses'

const Settings = () => {
    const { data: session } = useSession()

    if (!session) return <div>Please log in</div>

    return (
        <div className="w-full">
            <p>Settings</p>
            <VoterAddresses />
        </div>
    )
}

export default Settings
