import '../../styles/globals.css'
import { DashboardRow } from '../../components/views/dashboard/table/DashboardRow'

export default {
    title: 'Dashboard/DashboardRow',
    component: DashboardRow,
}

const Template = (args) => <DashboardRow {...args} />

export const Primary = Template.bind({})
Primary.args = {
    proposal: {
        id: 'cl95izuz6000maqdvpm4lj6ba',
        externalId: '1',
        name: 'Aave proposal test snapshot',
        description: 'Test description',
        daoId: 'cl95izuyi0002aqdvdgb721xj',
        daoHandlerId: 'cl95izuyi0003aqdv41llbvx9',
        proposalType: 'SNAPSHOT',
        data: { timeEnd: 1665975385, timeStart: 1664975385 },
        dao: {
            id: 'cl95izuyi0002aqdvdgb721xj',
            name: 'Aave',
            picture:
                'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
            handlers: [{ type: 'BRAVO1' }, { type: 'SNAPSHOT' }],
        },
        votes: [
            {
                id: 'cl95izuza000paqdve5bzneil',
                userId: 'cl95izuy90000aqdvhs3u5e69',
                proposalId: 'cl95izuz6000maqdvpm4lj6ba',
                daoId: 'cl95izuyi0002aqdvdgb721xj',
                daoHandlerId: 'cl95izuyi0003aqdv41llbvx9',
                user: {
                    id: 'cl95izuy90000aqdvhs3u5e69',
                    address: '0xCdB792c14391F7115Ba77A7Cd27f724fC9eA2091',
                },
            },
        ],
    },
}
