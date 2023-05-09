import {
    prisma,
    type User,
    DAOHandlerType,
    type DAOHandler,
    type Decoder
} from '@senate/database'
import axios from 'axios'
import promptSync from 'prompt-sync'

const prompt = promptSync({ sigint: true })

async function main() {
    console.log("🚀 Let's gooooo...")

    const user: User = await bootstrapStressTestUserWithSubscriptions()
    const snapshotSpaces: Array<string> = await fetchSnapshotSpacesFromDb()
    const snapshotVoters: Array<string> =
        await buildSnapshotVoterAddressesDataSet(snapshotSpaces)

    const votersNotYetInDb = await filterVoters(snapshotVoters)
    console.log(
        '📃 (Not yet in db) Snapshot voters dataset size:',
        votersNotYetInDb.length
    )

    let index = 0
    while (true) {
        const nextBatchOfVoters = votersNotYetInDb.slice(
            index,
            index + 5 < votersNotYetInDb.length
                ? index + 5
                : votersNotYetInDb.length
        )
        console.log(
            'Next 5 voters:',
            await getSnapshotVotesCount(nextBatchOfVoters, snapshotSpaces)
        )

        console.log('\n')
        const answer = prompt('❓ How many voters to add to the database? ')

        const count = parseInt(answer)
        if (isNaN(count)) {
            console.log('❌ Invalid input. Please enter a number')
            continue
        }

        const limit =
            index + count > votersNotYetInDb.length
                ? votersNotYetInDb.length
                : index + count

        const voters = votersNotYetInDb.slice(index, limit)

        await linkVotersToUser(user, voters)
        console.log(`✨ Processed voters from index ${index} to ${limit - 1}`)

        if (limit == votersNotYetInDb.length) {
            console.log('✨ Processed all voters. Bye now!')
            break
        }

        index = limit
    }
}

async function fetchSnapshotSpacesFromDb(): Promise<Array<string>> {
    const handlers: DAOHandler[] = await prisma.daohandler.findMany({
        where: {
            type: DAOHandlerType.SNAPSHOT
        }
    })

    return handlers.map((handler) => (handler.decoder as Decoder).space)
}

async function getSnapshotVotesCount(
    voters: Array<string>,
    spaces: Array<string>
): Promise<Map<string, number>> {
    const result = new Map()

    for (const voter of voters) {
        const graphqlQuery = `{
      votes(
        first:1000, 
        where: {
          voter: "${voter}",
          space_in: [${spaces.map((space) => `"${space}"`)}]
        }
      ) 
      {
        id
      }
    }`

        try {
            const res = await axios({
                url: 'https://hub.snapshot.org/graphql',
                method: 'get',
                data: {
                    query: graphqlQuery
                }
            })

            const votesCount = res.data.data.votes.length
            result.set(voter, votesCount)
        } catch (err) {
            console.log(err)
        }
    }

    return result
}

async function filterVoters(voters: string[]): Promise<string[]> {
    const votersInDb = await fetchVoters()
    return voters.filter((voter) => !votersInDb.includes(voter))
}

async function fetchVoters(): Promise<string[]> {
    return (await prisma.voter.findMany()).map((voter) => voter.address)
}

async function linkVotersToUser(user: User, voters: Array<string>) {
    console.log(`Adding ${voters.length} voters to db`)
    await prisma.$transaction(
        voters.map((voter) => {
            return prisma.user.update({
                where: { address: user.address },
                data: {
                    voters: {
                        connectOrCreate: {
                            where: { address: voter },
                            create: { address: voter }
                        }
                    }
                }
            })
        }),
        {
            isolationLevel: 'ReadCommitted'
        }
    )
}

async function buildSnapshotVoterAddressesDataSet(
    spaces: Array<string>
): Promise<Array<string>> {
    const voters: Array<string> = []
    for (const space of spaces) voters.push(...(await getSnapshotVoters(space)))

    return voters
}

async function getSnapshotVoters(space: string): Promise<Array<string>> {
    console.log('⚡ Fetching voters from space:', space)
    const graphqlQuery = `{votes(
        first:1000, 
        orderBy: "created", 
        orderDirection: desc, 
        where: {space: "${space}"}) 
        {
        voter
        }
    }`

    let results: Array<string> = []
    try {
        const res = await axios({
            url: 'https://hub.snapshot.org/graphql',
            method: 'get',
            data: {
                query: graphqlQuery
            }
        })

        results = res.data.data.votes.map((vote: any) => vote.voter)
    } catch (err) {
        console.log(err)
    }

    return Array.from(new Set(results))
}

async function bootstrapStressTestUserWithSubscriptions(): Promise<User> {
    try {
        const stressTestUser: User = await createStressTestUser()
        const daos = await fetchDaos()

        await prisma.$transaction(
            daos.map((dao) => {
                return prisma.subscription.upsert({
                    where: {
                        userid_daoid: {
                            userid: stressTestUser.id,
                            daoid: dao.id
                        }
                    },
                    create: {
                        userid: stressTestUser.id,
                        daoid: dao.id
                    },
                    update: {}
                })
            })
        )

        return stressTestUser
    } catch (error) {
        console.log('Failed bootstrapping stress test user with subscriptions')
        throw error
    }
}

async function createStressTestUser(): Promise<User> {
    return await prisma.user.upsert({
        where: {
            address: '0xD8ECE0f01dC86DfBd55fB90EfaFAd1a2a254C965'
        },
        create: {
            address: '0xD8ECE0f01dC86DfBd55fB90EfaFAd1a2a254C965'
        },
        update: {}
    })
}

async function fetchDaos() {
    return await prisma.dao.findMany()
}

main()
