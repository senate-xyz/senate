import DashboardHeader from '../../../components/Dashboard'
import dynamic from 'next/dynamic'

const SettingsContainer = () => {
    const NotificationSettingsNOSRR = dynamic(
        import(
            './../../../components/settings/notifications/NotificationSettings'
        ),
        {
            ssr: false,
        }
    )

    return (
        <div className="flex flex-row">
            <DashboardHeader
                title="Settings"
                component={<NotificationSettingsNOSRR />}
            />
        </div>
    )
}

export default SettingsContainer
