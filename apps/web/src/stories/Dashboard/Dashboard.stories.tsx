import '../../styles/globals.css'
import { DashboardView } from '../../components/views/dashboard/Dashboard'
import { Meta } from '@storybook/react'

export default {
    title: 'Dashboard/DashboardView',
    component: DashboardView,
} as Meta

export const Primary = () => <DashboardView />
