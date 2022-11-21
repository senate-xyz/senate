import { useSession } from 'next-auth/react'
import DashboardHeader from '../../../components/DashboardHeader'
import NavBar from '../../../components/navbar/NavBar'
import VoterAddresses from '../../../components/views/settings/voter-addresses/VoterAddresses'

const Settings = () => {
    const { data: session } = useSession()

    if (!session) return <div>Please log in</div>

    return (
        <div className="flex flex-row">
            <NavBar />
            <DashboardHeader title="Settings" component={<VoterAddresses />} />
        </div>
    )
}

export default Settings
