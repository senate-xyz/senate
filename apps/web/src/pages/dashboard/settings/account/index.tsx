import DashboardHeader from '../../../../components/Dashboard'
import NavBar from '../../../../components/navbar/NavBar'
import dynamic from 'next/dynamic'

const SettingsContainer = () => {
    const AccountSettingsNOSRR = dynamic(
        import('./../../../../components/settings/account/AccountSettings'),
        {
            ssr: false,
        }
    )

    return (
        <div className="flex flex-row">
            <NavBar />
            <DashboardHeader
                title="Settings"
                component={<AccountSettingsNOSRR />}
            />
        </div>
    )
}

export default SettingsContainer
