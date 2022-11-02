import '../../styles/globals.css'
import { DashboardThead } from '../../components/views/dashboard/table/DashboardTable'
import { ComponentMeta, ComponentStory } from '@storybook/react'

export default {
    title: 'Dashboard/DashboardThead',
    component: DashboardThead,
} as ComponentMeta<typeof DashboardThead>

export const Primary: ComponentStory<typeof DashboardThead> = () => (
    <DashboardThead />
)
