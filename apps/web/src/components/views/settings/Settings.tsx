import { useSession } from 'next-auth/react'
import ProxyAccounts from './proxy-accounts/ProxyAccounts'

const Settings = () => {
    const { data: session } = useSession()

    if (!session) return <div>Please log in</div>

    return (
        <div className="w-full">
            <p>Settings</p>
            <ProxyAccounts />
        </div>
    )
}

export default Settings
