import '../../styles/globals.css'
import { TrackerTabList } from '../../components/views/tracker/Tracker'

export default {
    title: 'Tracker/TrackerTabList',
    component: TrackerTabList,
}

const Template = (args) => <TrackerTabList {...args} />

export const Primary = Template.bind({})
Primary.args = {
    daosTabs: [
        {
            id: 'cl95izuyi0002aqdvdgb721xj',
            name: 'Aave',
            picture:
                'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
        },
        {
            id: 'cl95izuys000caqdv0c4y2fht',
            name: 'ENS',
            picture:
                'https://cdn.stamp.fyi/space/ens.eth?s=160&cb=bc8a2856691e05ab',
        },
    ],
}
