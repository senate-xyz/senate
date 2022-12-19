import DashboardHeader from '../../../components/Dashboard'
import NavBar from '../../../components/navbar/NavBar'
import dynamic from 'next/dynamic'

const SettingsContainer = () => {
    const ProxySettingsNOSRR = dynamic(
        import('./../../../components/settings/proxy/ProxySettings'),
        {
            ssr: false,
        }
    )

    return (
        <div className="flex flex-row">
            <NavBar />
            <DashboardHeader
                title="Settings"
                component={<ProxySettingsNOSRR />}
            />
        </div>
    )
}

export default SettingsContainer
