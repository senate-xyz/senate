import inquirer from 'inquirer'

import {
    PrismaClient as PrismaNewClient,
    Prisma as PrismaNew
} from '../prisma/new/generated/client'
import {
    PrismaClient as PrismaOldClient,
    Prisma as PrismaOld
} from '../prisma/old/generated/client'
import fs from 'fs'

const newPrisma = new PrismaNewClient()
const oldPrisma = new PrismaOldClient()

async function main() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'run',
                message: 'What do you want to do?',
                choices: [
                    { name: 'Export users from db to file', value: 'export' },
                    { name: 'Import users from file to db', value: 'import' }
                ]
            },
            {
                type: 'input',
                name: 'file',
                message: 'How shall I name the exported file?',
                when(answers: { run: string }) {
                    return answers.run === 'export'
                }
            },
            {
                type: 'input',
                name: 'file',
                message:
                    'What file do you want to import? Hint: the file should be located in /data',
                when(answers: { run: string }) {
                    return answers.run === 'import'
                }
            }
        ])
        .then((answers: any) => {
            if (answers.run === 'export') {
                exportUsers(answers.file)
            } else {
                importUsers(answers.file)
            }
        })
}

export type OldUserType = PrismaOld.UserGetPayload<{
    include: {
        subscriptions: { include: { dao: true } }
        voters: true
        userSettings: true
    }
}>

export type NewUsertype = PrismaNew.UserGetPayload<{
    include: {
        subscriptions: { include: { dao: true } }
    }
}>

const exportUsers = async (toFile: string) => {
    const data = await oldPrisma.user.findMany({
        include: {
            subscriptions: { include: { dao: true } },
            voters: true,
            userSettings: true
        }
    })

    fs.writeFile(
        `./data/${toFile}.json`,
        JSON.stringify(data, null, 4),
        (err) => {
            if (err) {
                throw err
            }
            console.log('JSON data is saved.')
        }
    )

    console.log({ data: data, file: toFile })
}

const importUsers = async (fromFile: string) => {
    await newPrisma.user.count()

    const rawdata = fs.readFileSync(`./data/${fromFile}.json`)

    const users: OldUserType[] = JSON.parse(rawdata.toString())

    for (const user of users) {
        const newUser = await newPrisma.user.upsert({
            where: {
                name: user.name
            },
            create: {
                name: user.name,
                email: user.email,
                newUser: user.newUser,
                acceptedTerms: user.acceptedTerms,
                lastActive: user.lastActive,
                sessionCount: user.sessionCount,
                dailyBulletin: user.userSettings.dailyBulletinEmail,
                voters: {
                    connectOrCreate: user.voters.map((voter) => ({
                        where: {
                            address: voter.address
                        },
                        create: {
                            address: voter.address
                        }
                    }))
                }
            },
            update: {
                name: user.name,
                email: user.email,
                newUser: user.newUser,
                acceptedTerms: user.acceptedTerms,
                lastActive: user.lastActive,
                sessionCount: user.sessionCount,
                dailyBulletin: user.userSettings.dailyBulletinEmail,
                voters: {
                    connectOrCreate: user.voters.map((voter) => ({
                        where: {
                            address: voter.address
                        },
                        create: {
                            address: voter.address
                        }
                    }))
                }
            }
        })

        for (const subscription of user.subscriptions) {
            const dao = await newPrisma.dAO.findFirst({
                where: {
                    name: subscription.dao.name
                }
            })
            await newPrisma.subscription.upsert({
                where: {
                    userId_daoId: {
                        userId: newUser.id,
                        daoId: dao.id
                    }
                },
                create: {
                    dao: {
                        connect: {
                            name: dao.name
                        }
                    },
                    user: {
                        connect: {
                            id: newUser.id
                        }
                    }
                },
                update: {}
            })
        }
    }

    console.log('Done!')
}

main()
