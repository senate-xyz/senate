import '../../styles/globals.css'
import { TrackerView } from '../../components/views/tracker/Tracker'
import { ComponentMeta, ComponentStory } from '@storybook/react'

export default {
    title: 'Tracker/TrackerView',
    component: TrackerView,
} as ComponentMeta<typeof TrackerView>

export const Primary: ComponentStory<typeof TrackerView> = (args) => (
    <TrackerView {...args} />
)

Primary.args = {
    shareButton: false,
    daosTabs: [
        {
            id: 'cl9zbtbgb00007ygci5wct46m',
            name: 'Aave',
            picture:
                'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
        },
        {
            id: 'cl9zbtd5c000a7ygcl0exngl0',
            name: 'MakerDAO',
            picture:
                'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
        },
    ],
    votes: [
        {
            id: 'cl9zcepjy00iy7yiptbi7amty',
            externalId:
                '0x1d85c2688b000a9249668c7eb16d59095bb74cb9f0c244140ceb94c95a7ab877',
            name: '[ARC] Risk Parameter Updates for Aave V2: 2022-10-06',
            daoId: 'cl9zbtbgb00007ygci5wct46m',
            daoHandlerId: 'cl9zbtbgb00027ygc9g6ms9gz',
            proposalType: 'SNAPSHOT',
            data: {
                timeEnd: 1665522000,
                timeStart: 1665111456,
                timeCreated: 1665111486,
            },
            url: 'https://snapshot.org/#/aave.eth/proposal/0x1d85c2688b000a9249668c7eb16d59095bb74cb9f0c244140ceb94c95a7ab877',
            dao: {
                id: 'cl9zbtbgb00007ygci5wct46m',
                name: 'Aave',
                picture:
                    'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
            },
            votes: [
                {
                    id: 'cl9zclqj500r07yip3rdaa3kk',
                    voterAddress: '0x5B3bFfC0bcF8D4cAEC873fDcF719F60725767c98',
                    proposalId: 'cl9zcepjy00iy7yiptbi7amty',
                    daoId: 'cl9zbtbgb00007ygci5wct46m',
                    daoHandlerId: 'cl9zbtbgb00027ygc9g6ms9gz',
                    options: [
                        {
                            optionName: 'YAE',
                        },
                    ],
                },
            ],
        },
        {
            id: 'cl9zcepjz00iz7yipdt2jyd8x',
            externalId:
                '0xad105e87d4df487bbe1daec2cd94ca49d1ea595901f5773c1804107539288b59',
            name: 'Chaos Labs <> Aave',
            daoId: 'cl9zbtbgb00007ygci5wct46m',
            daoHandlerId: 'cl9zbtbgb00027ygc9g6ms9gz',
            proposalType: 'SNAPSHOT',
            data: {
                timeEnd: 1665331200,
                timeStart: 1664813293,
                timeCreated: 1664813401,
            },
            url: 'https://snapshot.org/#/aave.eth/proposal/0xad105e87d4df487bbe1daec2cd94ca49d1ea595901f5773c1804107539288b59',
            dao: {
                id: 'cl9zbtbgb00007ygci5wct46m',
                name: 'Aave',
                picture:
                    'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
            },
            votes: [
                {
                    id: 'cl9zclrkp00r77yipcdci5y4i',
                    voterAddress: '0x5B3bFfC0bcF8D4cAEC873fDcF719F60725767c98',
                    proposalId: 'cl9zcepjz00iz7yipdt2jyd8x',
                    daoId: 'cl9zbtbgb00007ygci5wct46m',
                    daoHandlerId: 'cl9zbtbgb00027ygc9g6ms9gz',
                    options: [
                        {
                            optionName: ' Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'cl9zcepjz00j17yippzw4m944',
            externalId:
                '0x584eb4e0f79e1d9dcdd99b3a0c831bfc3c654af3f8f619d5f68eae23cd9cb149',
            name: 'Aave v3 Ethereum. Approval of path forward',
            daoId: 'cl9zbtbgb00007ygci5wct46m',
            daoHandlerId: 'cl9zbtbgb00027ygc9g6ms9gz',
            proposalType: 'SNAPSHOT',
            data: {
                timeEnd: 1665482400,
                timeStart: 1664877600,
                timeCreated: 1664807328,
            },
            url: 'https://snapshot.org/#/aave.eth/proposal/0x584eb4e0f79e1d9dcdd99b3a0c831bfc3c654af3f8f619d5f68eae23cd9cb149',
            dao: {
                id: 'cl9zbtbgb00007ygci5wct46m',
                name: 'Aave',
                picture:
                    'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
            },
            votes: [
                {
                    id: 'cl9zcloub00qt7yips4guemow',
                    voterAddress: '0x5B3bFfC0bcF8D4cAEC873fDcF719F60725767c98',
                    proposalId: 'cl9zcepjz00j17yippzw4m944',
                    daoId: 'cl9zbtbgb00007ygci5wct46m',
                    daoHandlerId: 'cl9zbtbgb00027ygc9g6ms9gz',
                    options: [
                        {
                            optionName: 'Deploy a new Aave v3 Ethereum',
                        },
                    ],
                },
            ],
        },
        {
            id: 'cl9zcepk100j67yip3s8wa1jx',
            externalId:
                '0x765d1e018f32d7deb8d7b06dc55ac054f75891805a8f6befc2a8d7f497851540',
            name: 'Risk Parameter Updates for Aave V2: 2022-09-22',
            daoId: 'cl9zbtbgb00007ygci5wct46m',
            daoHandlerId: 'cl9zbtbgb00027ygc9g6ms9gz',
            proposalType: 'SNAPSHOT',
            data: {
                timeEnd: 1664312400,
                timeStart: 1663914136,
                timeCreated: 1663914165,
            },
            url: 'https://snapshot.org/#/aave.eth/proposal/0x765d1e018f32d7deb8d7b06dc55ac054f75891805a8f6befc2a8d7f497851540',
            dao: {
                id: 'cl9zbtbgb00007ygci5wct46m',
                name: 'Aave',
                picture:
                    'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
            },
            votes: [
                {
                    id: 'cl9zclsm700rf7yipta74hcyi',
                    voterAddress: '0x5B3bFfC0bcF8D4cAEC873fDcF719F60725767c98',
                    proposalId: 'cl9zcepk100j67yip3s8wa1jx',
                    daoId: 'cl9zbtbgb00007ygci5wct46m',
                    daoHandlerId: 'cl9zbtbgb00027ygc9g6ms9gz',
                    options: [
                        {
                            optionName: 'YAE',
                        },
                    ],
                },
            ],
        },
        {
            id: 'cl9zcepk200jb7yipgw7o8aai',
            externalId:
                '0xdaa660ea59f8678748d6f133d7d7ed70b941798aa9a0044a16a1285d09e26bf5',
            name: '[ARC] Whitelist Balancer’s Liquidity Mining Claim',
            daoId: 'cl9zbtbgb00007ygci5wct46m',
            daoHandlerId: 'cl9zbtbgb00027ygc9g6ms9gz',
            proposalType: 'SNAPSHOT',
            data: {
                timeEnd: 1663973940,
                timeStart: 1663542060,
                timeCreated: 1663436462,
            },
            url: 'https://snapshot.org/#/aave.eth/proposal/0xdaa660ea59f8678748d6f133d7d7ed70b941798aa9a0044a16a1285d09e26bf5',
            dao: {
                id: 'cl9zbtbgb00007ygci5wct46m',
                name: 'Aave',
                picture:
                    'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
            },
            votes: [
                {
                    id: 'cl9zcltnp00rm7yipjnmqlpee',
                    voterAddress: '0x5B3bFfC0bcF8D4cAEC873fDcF719F60725767c98',
                    proposalId: 'cl9zcepk200jb7yipgw7o8aai',
                    daoId: 'cl9zbtbgb00007ygci5wct46m',
                    daoHandlerId: 'cl9zbtbgb00027ygc9g6ms9gz',
                    options: [
                        {
                            optionName: 'YAE',
                        },
                    ],
                },
            ],
        },
        {
            id: 'cl9zcepk400ji7yipfniofk8r',
            externalId:
                '0x519f6ecb17b00eb9c2c175c586173b15cfa5199247903cda9ddab48763ddb035',
            name: '[ARC] Ethereum v2 Reserve Factor - aFEI Holding Update ',
            daoId: 'cl9zbtbgb00007ygci5wct46m',
            daoHandlerId: 'cl9zbtbgb00027ygc9g6ms9gz',
            proposalType: 'SNAPSHOT',
            data: {
                timeEnd: 1661763600,
                timeStart: 1661446800,
                timeCreated: 1661363906,
            },
            url: 'https://snapshot.org/#/aave.eth/proposal/0x519f6ecb17b00eb9c2c175c586173b15cfa5199247903cda9ddab48763ddb035',
            dao: {
                id: 'cl9zbtbgb00007ygci5wct46m',
                name: 'Aave',
                picture:
                    'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
            },
            votes: [
                {
                    id: 'cl9zclvqs00s27yiphvkm7903',
                    voterAddress: '0x5B3bFfC0bcF8D4cAEC873fDcF719F60725767c98',
                    proposalId: 'cl9zcepk400ji7yipfniofk8r',
                    daoId: 'cl9zbtbgb00007ygci5wct46m',
                    daoHandlerId: 'cl9zbtbgb00027ygc9g6ms9gz',
                    options: [
                        {
                            optionName: 'YAE',
                        },
                    ],
                },
            ],
        },
        {
            id: 'cl9zcepk500jk7yip5prqi64n',
            externalId:
                '0x19df23070be999efbb7caf6cd35c320eb74dd119bcb15d003dc2e82c2bbd0d94',
            name: '[ARC] Risk Parameter Updates for Ethereum Aave v2 Market',
            daoId: 'cl9zbtbgb00007ygci5wct46m',
            daoHandlerId: 'cl9zbtbgb00027ygc9g6ms9gz',
            proposalType: 'SNAPSHOT',
            data: {
                timeEnd: 1661763600,
                timeStart: 1661446800,
                timeCreated: 1661363746,
            },
            url: 'https://snapshot.org/#/aave.eth/proposal/0x19df23070be999efbb7caf6cd35c320eb74dd119bcb15d003dc2e82c2bbd0d94',
            dao: {
                id: 'cl9zbtbgb00007ygci5wct46m',
                name: 'Aave',
                picture:
                    'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
            },
            votes: [
                {
                    id: 'cl9zclupb00ru7yipesy5hwfq',
                    voterAddress: '0x5B3bFfC0bcF8D4cAEC873fDcF719F60725767c98',
                    proposalId: 'cl9zcepk500jk7yip5prqi64n',
                    daoId: 'cl9zbtbgb00007ygci5wct46m',
                    daoHandlerId: 'cl9zbtbgb00027ygc9g6ms9gz',
                    options: [
                        {
                            optionName: 'YAE',
                        },
                    ],
                },
            ],
        },
        {
            id: 'cl9zcepk700jr7yipdtqjzzsr',
            externalId:
                '0x88e896a245ffeda703e0b8f5494f3e66628be6e32a7243e3341b545c2972857f',
            name: '[ARC] Add MaticX to Polygon v3 Market',
            daoId: 'cl9zbtbgb00007ygci5wct46m',
            daoHandlerId: 'cl9zbtbgb00027ygc9g6ms9gz',
            proposalType: 'SNAPSHOT',
            data: {
                timeEnd: 1661122740,
                timeStart: 1660518060,
                timeCreated: 1660401177,
            },
            url: 'https://snapshot.org/#/aave.eth/proposal/0x88e896a245ffeda703e0b8f5494f3e66628be6e32a7243e3341b545c2972857f',
            dao: {
                id: 'cl9zbtbgb00007ygci5wct46m',
                name: 'Aave',
                picture:
                    'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
            },
            votes: [
                {
                    id: 'cl9zclwsw00s97yipqwyfj80y',
                    voterAddress: '0x5B3bFfC0bcF8D4cAEC873fDcF719F60725767c98',
                    proposalId: 'cl9zcepk700jr7yipdtqjzzsr',
                    daoId: 'cl9zbtbgb00007ygci5wct46m',
                    daoHandlerId: 'cl9zbtbgb00027ygc9g6ms9gz',
                    options: [
                        {
                            optionName: 'YAE',
                        },
                    ],
                },
            ],
        },
        {
            id: 'cl9zcepk900k37yipi1a07no9',
            externalId:
                '0xb17b3294dcb08316cb623c717add7f82df54948d558992f886be59d0958e9b24',
            name: 'Greenlight for GHO',
            daoId: 'cl9zbtbgb00007ygci5wct46m',
            daoHandlerId: 'cl9zbtbgb00027ygc9g6ms9gz',
            proposalType: 'SNAPSHOT',
            data: {
                timeEnd: 1659261600,
                timeStart: 1659011100,
                timeCreated: 1658924851,
            },
            url: 'https://snapshot.org/#/aave.eth/proposal/0xb17b3294dcb08316cb623c717add7f82df54948d558992f886be59d0958e9b24',
            dao: {
                id: 'cl9zbtbgb00007ygci5wct46m',
                name: 'Aave',
                picture:
                    'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
            },
            votes: [
                {
                    id: 'cl9zcm02a00sw7yipfgop626x',
                    voterAddress: '0x5B3bFfC0bcF8D4cAEC873fDcF719F60725767c98',
                    proposalId: 'cl9zcepk900k37yipi1a07no9',
                    daoId: 'cl9zbtbgb00007ygci5wct46m',
                    daoHandlerId: 'cl9zbtbgb00027ygc9g6ms9gz',
                    options: [
                        {
                            optionName: 'YAE',
                        },
                    ],
                },
            ],
        },
        {
            id: 'cl9zcepk900k77yipidxsp5zu',
            externalId:
                'bafkreieeyh6pbqwhgryo6v67oxlmnfhaptrgkc3u7y6bvz2y3jdkxgrrh4',
            name: 'ARC: Extend the Safety Module Protection to Aave V2 Arc',
            daoId: 'cl9zbtbgb00007ygci5wct46m',
            daoHandlerId: 'cl9zbtbgb00027ygc9g6ms9gz',
            proposalType: 'SNAPSHOT',
            data: {
                timeEnd: 1659294000,
                timeStart: 1658862000,
                timeCreated: 1658866422,
            },
            url: 'https://snapshot.org/#/aave.eth/proposal/bafkreieeyh6pbqwhgryo6v67oxlmnfhaptrgkc3u7y6bvz2y3jdkxgrrh4',
            dao: {
                id: 'cl9zbtbgb00007ygci5wct46m',
                name: 'Aave',
                picture:
                    'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
            },
            votes: [
                {
                    id: 'cl9zclz0s00so7yipfavveqfd',
                    voterAddress: '0x5B3bFfC0bcF8D4cAEC873fDcF719F60725767c98',
                    proposalId: 'cl9zcepk900k77yipidxsp5zu',
                    daoId: 'cl9zbtbgb00007ygci5wct46m',
                    daoHandlerId: 'cl9zbtbgb00027ygc9g6ms9gz',
                    options: [
                        {
                            optionName: 'YAE - Do Extend SM to ARC market',
                        },
                    ],
                },
            ],
        },
        {
            id: 'cl9zcepkb00ke7yipwiquetzj',
            externalId:
                'bafkreigdmcfmwvnxfolpds4xkdicgrszgmknig7pz2r2t37tltupdpyfu4',
            name: 'Risk-Off Framework for the Aave Protocol',
            daoId: 'cl9zbtbgb00007ygci5wct46m',
            daoHandlerId: 'cl9zbtbgb00027ygc9g6ms9gz',
            proposalType: 'SNAPSHOT',
            data: {
                timeEnd: 1659153540,
                timeStart: 1658516400,
                timeCreated: 1658427706,
            },
            url: 'https://snapshot.org/#/aave.eth/proposal/bafkreigdmcfmwvnxfolpds4xkdicgrszgmknig7pz2r2t37tltupdpyfu4',
            dao: {
                id: 'cl9zbtbgb00007ygci5wct46m',
                name: 'Aave',
                picture:
                    'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
            },
            votes: [
                {
                    id: 'cl9zclxyx00sg7yip3riad8n9',
                    voterAddress: '0x5B3bFfC0bcF8D4cAEC873fDcF719F60725767c98',
                    proposalId: 'cl9zcepkb00ke7yipwiquetzj',
                    daoId: 'cl9zbtbgb00007ygci5wct46m',
                    daoHandlerId: 'cl9zbtbgb00027ygc9g6ms9gz',
                    options: [
                        {
                            optionName: '3%',
                        },
                    ],
                },
            ],
        },
        {
            id: 'cl9zcdr0e00hs7yip3e1s8iok',
            externalId: '0x3ea2748a32D53449bee93e2AE101E6d7179d7865',
            name: 'Update the PROXY_ACTIONS_END_CROPPER Address, Starknet Bridge Deposit Limit Increase, Core Unit MKR Vesting - September 28, 2022',
            daoId: 'cl9zbtd5c000a7ygcl0exngl0',
            daoHandlerId: 'cl9zbtd5c000b7ygckhwjdq0l',
            proposalType: 'MAKER_EXECUTIVE',
            data: {
                timeEnd: 1664629211,
                timeStart: 1664323200,
                timeCreated: 1664323200,
            },
            url: 'https://vote.makerdao.com/executive/0x3ea2748a32D53449bee93e2AE101E6d7179d7865',
            dao: {
                id: 'cl9zbtd5c000a7ygcl0exngl0',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
            },
            votes: [
                {
                    id: 'cl9zcn01e00t97yippjeqpp2k',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'cl9zcdr0e00hs7yip3e1s8iok',
                    daoId: 'cl9zbtd5c000a7ygcl0exngl0',
                    daoHandlerId: 'cl9zbtd5c000b7ygckhwjdq0l',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'cl9zcdw1100hx7yip5e3454n7',
            externalId: '0x0900328701eA2561F530869c4fe088A72256409C',
            name: 'Monetalis Clydesdale (RWA007-A) Onboarding, Funding Ambassador Program SPF, Core Unit MKR Streams and Transfers - October 5, 2022',
            daoId: 'cl9zbtd5c000a7ygcl0exngl0',
            daoHandlerId: 'cl9zbtd5c000b7ygckhwjdq0l',
            proposalType: 'MAKER_EXECUTIVE',
            data: {
                timeEnd: 1665410555,
                timeStart: 1664928000,
                timeCreated: 1664928000,
            },
            url: 'https://vote.makerdao.com/executive/0x0900328701eA2561F530869c4fe088A72256409C',
            dao: {
                id: 'cl9zbtd5c000a7ygcl0exngl0',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
            },
            votes: [
                {
                    id: 'cl9zcn1zf00te7yipht57nwtk',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'cl9zcdw1100hx7yip5e3454n7',
                    daoId: 'cl9zbtd5c000a7ygcl0exngl0',
                    daoHandlerId: 'cl9zbtd5c000b7ygckhwjdq0l',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'cl9zce2ka00i17yipin3ww7gv',
            externalId: '0x07bFA4db5587A75617aFA9E43624b8C2609497b5',
            name: 'Core Unit MKR Vesting, Recognized Delegate Compensation, MOMC Parameter Changes - September 07, 2022',
            daoId: 'cl9zbtd5c000a7ygcl0exngl0',
            daoHandlerId: 'cl9zbtd5c000b7ygckhwjdq0l',
            proposalType: 'MAKER_EXECUTIVE',
            data: {
                timeEnd: 1662798645,
                timeStart: 1662508800,
                timeCreated: 1662508800,
            },
            url: 'https://vote.makerdao.com/executive/0x07bFA4db5587A75617aFA9E43624b8C2609497b5',
            dao: {
                id: 'cl9zbtd5c000a7ygcl0exngl0',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
            },
            votes: [
                {
                    id: 'cl9zcmxtk00t37yip74fe9ga7',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'cl9zce2ka00i17yipin3ww7gv',
                    daoId: 'cl9zbtd5c000a7ygcl0exngl0',
                    daoHandlerId: 'cl9zbtd5c000b7ygckhwjdq0l',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'cl9zce74f00i67yipz1etne2p',
            externalId: '0xdfFa28aAABF9E6a07e19FDf3a9B94fDC93A039f1',
            name: 'Collateral Auction Parameter Changes, MOMC Parameter Adjustments, Recognized Delegate Compensation for September - October 14, 2022',
            daoId: 'cl9zbtd5c000a7ygcl0exngl0',
            daoHandlerId: 'cl9zbtd5c000b7ygckhwjdq0l',
            proposalType: 'MAKER_EXECUTIVE',
            data: {
                timeEnd: 1665938003,
                timeStart: 1665705600,
                timeCreated: 1665705600,
            },
            url: 'https://vote.makerdao.com/executive/0xdfFa28aAABF9E6a07e19FDf3a9B94fDC93A039f1',
            dao: {
                id: 'cl9zbtd5c000a7ygcl0exngl0',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
            },
            votes: [
                {
                    id: 'cl9zcn3sx00tk7yipzhqf46pw',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'cl9zce74f00i67yipz1etne2p',
                    daoId: 'cl9zbtd5c000a7ygcl0exngl0',
                    daoHandlerId: 'cl9zbtd5c000b7ygckhwjdq0l',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'cl9zcedf400ic7yipwbpj0pdh',
            externalId: '0x8E4faFef5bF61f09654aDeB46E6bC970BcD42c52',
            name: 'Enable DC-IAM for RWA-007-A (Monetalis Clydesdale), GUSD PSM Parameter Changes - October 13 , 2022',
            daoId: 'cl9zbtd5c000a7ygcl0exngl0',
            daoHandlerId: 'cl9zbtd5c000b7ygckhwjdq0l',
            proposalType: 'MAKER_EXECUTIVE',
            data: {
                timeEnd: 1666550447,
                timeStart: 1666137600,
                timeCreated: 1666137600,
            },
            url: 'https://vote.makerdao.com/executive/0x8E4faFef5bF61f09654aDeB46E6bC970BcD42c52',
            dao: {
                id: 'cl9zbtd5c000a7ygcl0exngl0',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
            },
            votes: [
                {
                    id: 'cl9zcn5mg00tp7yip9rx0gxac',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'cl9zcedf400ic7yipwbpj0pdh',
                    daoId: 'cl9zbtd5c000a7ygcl0exngl0',
                    daoHandlerId: 'cl9zbtd5c000b7ygckhwjdq0l',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'cl9zcek2l00ig7yiph1ydccoe',
            externalId: '0x4124b7a881DBBF98D72474D1A882d3afE3758526',
            name: 'rETH Technical Onboarding, Enable Starknet DAI Bridge Fees - October 26, 2022',
            daoId: 'cl9zbtd5c000a7ygcl0exngl0',
            daoHandlerId: 'cl9zbtd5c000b7ygckhwjdq0l',
            proposalType: 'MAKER_EXECUTIVE',
            data: {
                timeEnd: 1667224931,
                timeStart: 1666742400,
                timeCreated: 1666742400,
            },
            url: 'https://vote.makerdao.com/executive/0x4124b7a881DBBF98D72474D1A882d3afE3758526',
            dao: {
                id: 'cl9zbtd5c000a7ygcl0exngl0',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
            },
            votes: [
                {
                    id: 'cl9zcn7kl00tv7yipr9ev2gxl',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'cl9zcek2l00ig7yiph1ydccoe',
                    daoId: 'cl9zbtd5c000a7ygcl0exngl0',
                    daoHandlerId: 'cl9zbtd5c000b7ygckhwjdq0l',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'cl9zcenc700ij7yipr21oas92',
            externalId: '877',
            name: 'Whitelist Oasis.app on rETHUSD Oracle (MIP10c9-SP31) - October 10, 2022\n',
            daoId: 'cl9zbtd5c000a7ygcl0exngl0',
            daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1665676800,
                timeStart: 1665417600,
                timeCreated: 1571844100,
            },
            url: 'https://vote.makerdao.com/polling/QmZzFPF',
            dao: {
                id: 'cl9zbtd5c000a7ygcl0exngl0',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
            },
            votes: [
                {
                    id: 'cl9zcnt4000u17yipnx4fovu9',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'cl9zcenc700ij7yipr21oas92',
                    daoId: 'cl9zbtd5c000a7ygcl0exngl0',
                    daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'cl9zceowa00im7yipafb2h2z1',
            externalId: '878',
            name: 'Change PSM-GUSD-A Parameters - October 10, 2022\n',
            daoId: 'cl9zbtd5c000a7ygcl0exngl0',
            daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1665676800,
                timeStart: 1665417600,
                timeCreated: 1571845600,
            },
            url: 'https://vote.makerdao.com/polling/QmYffkv',
            dao: {
                id: 'cl9zbtd5c000a7ygcl0exngl0',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
            },
            votes: [
                {
                    id: 'cl9zcnuxq00u67yipotl4gll6',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'cl9zceowa00im7yipafb2h2z1',
                    daoId: 'cl9zbtd5c000a7ygcl0exngl0',
                    daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'cl9zceqfk00py7yip4lfb1k43',
            externalId: '879',
            name: 'End DAI Funding For Sourcecred - October 10, 2022\n',
            daoId: 'cl9zbtd5c000a7ygcl0exngl0',
            daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1665676800,
                timeStart: 1665417600,
                timeCreated: 1571846900,
            },
            url: 'https://vote.makerdao.com/polling/QmYNSoy',
            dao: {
                id: 'cl9zbtd5c000a7ygcl0exngl0',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
            },
            votes: [
                {
                    id: 'cl9zcnwr900ub7yipv8wgvdcp',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'cl9zceqfk00py7yip4lfb1k43',
                    daoId: 'cl9zbtd5c000a7ygcl0exngl0',
                    daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'cl9zceryn00q07yipn3ku2nti',
            externalId: '880',
            name: 'MOMC Guidance - Remove ETH Supply Yield And Liquidity Incentives From D3M Target Borrow Rate Calculations - October 10, 2022\n',
            daoId: 'cl9zbtd5c000a7ygcl0exngl0',
            daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1665676800,
                timeStart: 1665417600,
                timeCreated: 1571848200,
            },
            url: 'https://vote.makerdao.com/polling/QmSvCFp',
            dao: {
                id: 'cl9zbtd5c000a7ygcl0exngl0',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
            },
            votes: [
                {
                    id: 'cl9zcnykj00ug7yipwyug6lt3',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'cl9zceryn00q07yipn3ku2nti',
                    daoId: 'cl9zbtd5c000a7ygcl0exngl0',
                    daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'cl9zcethq00q17yip065tecec',
            externalId: '881',
            name: 'MOMC Guidance - Allowed Spread Between D3M Target Borrow Rate And ETH-A Stability Fee October 10, 2022\n',
            daoId: 'cl9zbtd5c000a7ygcl0exngl0',
            daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1665676800,
                timeStart: 1665417600,
                timeCreated: 1571852600,
            },
            url: 'https://vote.makerdao.com/polling/QmbbdsR',
            dao: {
                id: 'cl9zbtd5c000a7ygcl0exngl0',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
            },
            votes: [
                {
                    id: 'cl9zco0e600um7yipf1ca278a',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'cl9zcethq00q17yip065tecec',
                    daoId: 'cl9zbtd5c000a7ygcl0exngl0',
                    daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'cl9zceuzu00q27yiph84i7212',
            externalId: '882',
            name: 'Ratification Poll for Endgame Prelaunch MIP Set - October 10, 2022\n',
            daoId: 'cl9zbtd5c000a7ygcl0exngl0',
            daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1666627200,
                timeStart: 1665417600,
                timeCreated: 1571854900,
            },
            url: 'https://vote.makerdao.com/polling/QmTmS5N',
            dao: {
                id: 'cl9zbtd5c000a7ygcl0exngl0',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
            },
            votes: [
                {
                    id: 'cl9zco27u00us7yip5dv3cbto',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'cl9zceuzu00q27yiph84i7212',
                    daoId: 'cl9zbtd5c000a7ygcl0exngl0',
                    daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'cl9zcewqy00q47yip62qiom9q',
            externalId: '883',
            name: 'Ratification Poll for Offboarding the Strategic Happiness Core Unit - SH-001 (MIP39c3-SP3) - October 10, 2022\n',
            daoId: 'cl9zbtd5c000a7ygcl0exngl0',
            daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1666627200,
                timeStart: 1665417600,
                timeCreated: 1571856500,
            },
            url: 'https://vote.makerdao.com/polling/QmdUv8L',
            dao: {
                id: 'cl9zbtd5c000a7ygcl0exngl0',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
            },
            votes: [
                {
                    id: 'cl9zco41e00uy7yipawvpz89d',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'cl9zcewqy00q47yip62qiom9q',
                    daoId: 'cl9zbtd5c000a7ygcl0exngl0',
                    daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'cl9zceyb400q57yipgouyxnzm',
            externalId: '884',
            name: 'Ratification Poll for Offboarding the Events Core Unit - EVENTS-001 (MIP39c3-SP4) - October 10, 2022\n',
            daoId: 'cl9zbtd5c000a7ygcl0exngl0',
            daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1666627200,
                timeStart: 1665417600,
                timeCreated: 1571857200,
            },
            url: 'https://vote.makerdao.com/polling/QmbP2Xd',
            dao: {
                id: 'cl9zbtd5c000a7ygcl0exngl0',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
            },
            votes: [
                {
                    id: 'cl9zco5zl00v47yipava177fi',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'cl9zceyb400q57yipgouyxnzm',
                    daoId: 'cl9zbtd5c000a7ygcl0exngl0',
                    daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'cl9zcezun00q77yiph93ox5qz',
            externalId: '885',
            name: 'Ratification Poll for Offboarding the Real-World Finance Core Unit - RWF-001 (MIP39c3-SP5) - October 10, 2022\n',
            daoId: 'cl9zbtd5c000a7ygcl0exngl0',
            daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1666627200,
                timeStart: 1665417600,
                timeCreated: 1571858300,
            },
            url: 'https://vote.makerdao.com/polling/QmX68eH',
            dao: {
                id: 'cl9zbtd5c000a7ygcl0exngl0',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
            },
            votes: [
                {
                    id: 'cl9zco7sx00va7yipgfliyw2j',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'cl9zcezun00q77yiph93ox5qz',
                    daoId: 'cl9zbtd5c000a7ygcl0exngl0',
                    daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'cl9zcf1et00q97yipsqtvpqjl',
            externalId: '886',
            name: 'Ratification Poll for Coinbase USDC Institutional Rewards (MIP81) - October 10, 2022\n',
            daoId: 'cl9zbtd5c000a7ygcl0exngl0',
            daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1666627200,
                timeStart: 1665417600,
                timeCreated: 1571859800,
            },
            url: 'https://vote.makerdao.com/polling/QmbMaQ9',
            dao: {
                id: 'cl9zbtd5c000a7ygcl0exngl0',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
            },
            votes: [
                {
                    id: 'cl9zco9md00vg7yipyfh5l9mc',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'cl9zcf1et00q97yipsqtvpqjl',
                    daoId: 'cl9zbtd5c000a7ygcl0exngl0',
                    daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'cl9zcf2wy00qb7yipw3vga5b5',
            externalId: '887',
            name: 'Ratification Poll for Monetalis-Coinbase Appaloosa (MIP82) - October 10, 2022\n',
            daoId: 'cl9zbtd5c000a7ygcl0exngl0',
            daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1666627200,
                timeStart: 1665417600,
                timeCreated: 1571860400,
            },
            url: 'https://vote.makerdao.com/polling/QmRVN2S',
            dao: {
                id: 'cl9zbtd5c000a7ygcl0exngl0',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
            },
            votes: [
                {
                    id: 'cl9zcobfw00vm7yipx9yf3y96',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'cl9zcf2wy00qb7yipw3vga5b5',
                    daoId: 'cl9zbtd5c000a7ygcl0exngl0',
                    daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'cl9zcf4ft00qd7yipvlhfjvx6',
            externalId: '888',
            name: 'Ratification Poll for Legal And Commercial Risk Domain Work on Greenlit Collateral BlockTower Credit - RWA Arranger SPF (MIP55c3-SP9) - October 10, 2022\n',
            daoId: 'cl9zbtd5c000a7ygcl0exngl0',
            daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1666627200,
                timeStart: 1665417600,
                timeCreated: 1571862000,
            },
            url: 'https://vote.makerdao.com/polling/QmcV2pM',
            dao: {
                id: 'cl9zbtd5c000a7ygcl0exngl0',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
            },
            votes: [
                {
                    id: 'cl9zcod9b00vr7yip2c9salvr',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'cl9zcf4ft00qd7yipvlhfjvx6',
                    daoId: 'cl9zbtd5c000a7ygcl0exngl0',
                    daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'cl9zcf5yi00qe7yipvqf7m1kb',
            externalId: '889',
            name: 'Ratification Poll for Facilitator Offboarding Process (MIP41c5) adjustments (MIP4c2-SP26) - October 10, 2022\n',
            daoId: 'cl9zbtd5c000a7ygcl0exngl0',
            daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1666627200,
                timeStart: 1665417600,
                timeCreated: 1571863100,
            },
            url: 'https://vote.makerdao.com/polling/QmYgLJ1',
            dao: {
                id: 'cl9zbtd5c000a7ygcl0exngl0',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
            },
            votes: [
                {
                    id: 'cl9zcof3300vx7yip0y5tfmom',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'cl9zcf5yi00qe7yipvqf7m1kb',
                    daoId: 'cl9zbtd5c000a7ygcl0exngl0',
                    daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'cl9zcf7gd00qf7yipva7x5rgv',
            externalId: '890',
            name: 'Ratification Poll for Facilitator Offboarding - RWF-001 (MIP41c5-SP12) - October 10, 2022\n',
            daoId: 'cl9zbtd5c000a7ygcl0exngl0',
            daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1666627200,
                timeStart: 1665417600,
                timeCreated: 1571863800,
            },
            url: 'https://vote.makerdao.com/polling/QmRp4bD',
            dao: {
                id: 'cl9zbtd5c000a7ygcl0exngl0',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
            },
            votes: [
                {
                    id: 'cl9zcogwp00w27yiprw7xhilh',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'cl9zcf7gd00qf7yipva7x5rgv',
                    daoId: 'cl9zbtd5c000a7ygcl0exngl0',
                    daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'cl9zcf94q00qh7yiphfaksp00',
            externalId: '891',
            name: 'MIP65 Asset Reallocation - October 24, 2022 \n',
            daoId: 'cl9zbtd5c000a7ygcl0exngl0',
            daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1666886400,
                timeStart: 1666627200,
                timeCreated: 1581845300,
            },
            url: 'https://vote.makerdao.com/polling/QmSfMtT',
            dao: {
                id: 'cl9zbtd5c000a7ygcl0exngl0',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
            },
            votes: [
                {
                    id: 'cl9zcoiut00w87yipzm67m3ou',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'cl9zcf94q00qh7yiphfaksp00',
                    daoId: 'cl9zbtd5c000a7ygcl0exngl0',
                    daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'cl9zcfao200qi7yipwjyfjjnw',
            externalId: '892',
            name: 'Activate Liquidations for Stablecoin Vaults to Clear Bad Debt - October 31, 2022\n',
            daoId: 'cl9zbtd5c000a7ygcl0exngl0',
            daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1667491200,
                timeStart: 1667232000,
                timeCreated: 1586867400,
            },
            url: 'https://vote.makerdao.com/polling/QmSvAa5',
            dao: {
                id: 'cl9zbtd5c000a7ygcl0exngl0',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
            },
            votes: [
                {
                    id: 'cl9zcokog00we7yippx45ef3l',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'cl9zcfao200qi7yipwjyfjjnw',
                    daoId: 'cl9zbtd5c000a7ygcl0exngl0',
                    daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'cl9zcfc6m00qk7yiph987vxy3',
            externalId: '893',
            name: 'One Month Budget Extension for Strategic Happiness Core Unit - October 31, 2022\n',
            daoId: 'cl9zbtd5c000a7ygcl0exngl0',
            daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1667491200,
                timeStart: 1667232000,
                timeCreated: 1586868900,
            },
            url: 'https://vote.makerdao.com/polling/QmbpGs3',
            dao: {
                id: 'cl9zbtd5c000a7ygcl0exngl0',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
            },
            votes: [
                {
                    id: 'cl9zcomhw00wj7yipjmnboy7i',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'cl9zcfc6m00qk7yiph987vxy3',
                    daoId: 'cl9zbtd5c000a7ygcl0exngl0',
                    daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
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
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
    ],
    selectedDao: 'Aave',
}