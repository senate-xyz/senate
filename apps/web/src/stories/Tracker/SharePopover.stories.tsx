import '../../styles/globals.css'
import { SharePopover } from '../../components/views/tracker/SharePopover'
import { ComponentMeta, ComponentStory } from '@storybook/react'

export default {
    /* 👇 The title prop is optional.
     * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
     * to learn how to generate automatic titles
     */
    title: 'Tracker/SharePopover',
    component: SharePopover,
} as ComponentMeta<typeof SharePopover>

export const Primary: ComponentStory<typeof SharePopover> = () => (
    <SharePopover />
)
