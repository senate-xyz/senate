import { useSession } from 'next-auth/react'
import NavBar from '../../../components/navbar/NavBar'
import VoterAddresses from '../../../components/views/settings/voter-addresses/VoterAddresses'

const Settings = () => {
    const { data: session } = useSession()

    if (!session) return <div>Please log in</div>

    return (
        <div className="flex flex-row">
            <NavBar />
            <div className="min-h-screen w-full">
                <div className="w-full">
                    <p>Settings</p>
                    <VoterAddresses />
                </div>
            </div>
        </div>
    )
}

export default Settings
