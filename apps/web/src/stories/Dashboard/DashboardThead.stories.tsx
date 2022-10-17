import '../../styles/globals.css'
import { DashboardThead } from '../../components/views/dashboard/table/DashboardTable'

export default {
    title: 'Dashboard/DashboardThead',
    component: DashboardThead,
}

const Template = (args) => <DashboardThead {...args} />

export const Primary = Template.bind({})
