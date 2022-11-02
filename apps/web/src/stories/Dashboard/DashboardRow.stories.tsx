import '../../styles/globals.css'
import { DashboardRow } from '../../components/views/dashboard/table/DashboardRow'
import { ComponentMeta, ComponentStory } from '@storybook/react'

export default {
    title: 'Dashboard/DashboardRow',
    component: DashboardRow,
} as ComponentMeta<typeof DashboardRow>

export const Primary: ComponentStory<typeof DashboardRow> = (args) => (
    <DashboardRow {...args} />
)

Primary.args = {
    proposal: {
        id: 'cl9zcfdp100ql7yipn2teehlg',
        externalId: '894',
        name: 'PPG - Open Market Committee Proposal - October 31, 2022\n',
        daoId: 'cl9zbtd5c000a7ygcl0exngl0',
        daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
        proposalType: 'MAKER_POLL',
        data: {
            timeEnd: 1667491200,
            timeStart: 1667232000,
            timeCreated: 1586870800,
        },
        url: 'https://vote.makerdao.com/polling/QmahDuN',
        dao: {
            id: 'cl9zbtd5c000a7ygcl0exngl0',
            name: 'MakerDAO',
            picture:
                'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
            handlers: [
                {
                    type: 'MAKER_EXECUTIVE',
                },
                {
                    type: 'MAKER_POLL_CREATE',
                },
                {
                    type: 'MAKER_POLL_VOTE',
                },
            ],
        },
        votes: [
            {
                id: 'cl9zcoob700wo7yip3sfom8b1',
                voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                proposalId: 'cl9zcfdp100ql7yipn2teehlg',
                daoId: 'cl9zbtd5c000a7ygcl0exngl0',
                daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
                options: [
                    {
                        id: 'cl9zcoob700wp7yipbzptd6yp',
                        option: '1',
                        optionName: 'Yes',
                        voterAddress:
                            '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                        voteDaoId: 'cl9zbtd5c000a7ygcl0exngl0',
                        voteProposalId: 'cl9zcfdp100ql7yipn2teehlg',
                    },
                ],
            },
        ],
    },
}
