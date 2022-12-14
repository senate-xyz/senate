import DashboardHeader from '../../../../components/Dashboard'
import NavBar from '../../../../components/navbar/NavBar'
import dynamic from 'next/dynamic'

const SettingsContainer = () => {
    const NotificationSettingsNOSRR = dynamic(
        import(
            './../../../../components/settings/notifications/NotificationSettings'
        ),
        {
            ssr: false,
        }
    )

    return (
        <div className="flex flex-row">
            <NavBar />
            <DashboardHeader
                title="Settings"
                component={<NotificationSettingsNOSRR />}
            />
        </div>
    )
}

export default SettingsContainer
