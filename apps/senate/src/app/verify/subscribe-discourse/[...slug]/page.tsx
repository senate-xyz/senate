import '@rainbow-me/rainbowkit/styles.css'

import {prisma} from '@senate/database'
import Link from 'next/link'

const isValidChallenge = async (challenge: string) => {
    const user = await prisma.user.findFirst({
        where: {
            challengecode: challenge
        }
    })

    return user ? true : false
}

const verifyUser = async (dao: string, challenge: string) => {
    const user = await prisma.user.findFirstOrThrow({
        where: {
            challengecode: challenge
        }
    })

    const subscribedao = await prisma.dao.findFirstOrThrow({
        where: {
            name: {equals: dao}
        }
    })

    switch (dao) {
        case 'aave': {
            await prisma.user.updateMany({
                where: {
                    challengecode: challenge
                },
                data: {
                    challengecode: '',
                    isaaveuser: 'ENABLED'
                }
            })
            break
        }
        case 'uniswap': {
            await prisma.user.updateMany({
                where: {
                    challengecode: challenge
                },
                data: {
                    challengecode: '',
                    isuniswapuser: 'ENABLED'
                }
            })
            break
        }
    }

    await prisma.subscription.createMany({
        data: {
            userid: user?.id,
            daoid: subscribedao?.id
        },
        skipDuplicates: true
    })
}

export default async function Page({params}) {
    const validChallenge = await isValidChallenge(String(params.slug[1]))

    if (!validChallenge)
        return (
            <div className='flex w-full flex-col items-center gap-4 pt-32'>
                <p className='text-3xl font-bold text-white'>
                    Invalid challenge
                </p>
                <Link
                    className='text-xl font-thin text-white underline'
                    href='/daos'
                >
                    Go back home
                </Link>
            </div>
        )
    else {
        await verifyUser(String(params.slug[0]), String(params.slug[1]))

        return (
            <div className='flex w-full flex-col items-center gap-4 pt-32'>
                <p className='text-3xl font-bold text-white'>
                    Thank you for verifying your email address.
                </p>
                <Link
                    className='text-xl font-thin text-white underline'
                    href='/daos'
                >
                    Go back home
                </Link>
            </div>
        )
    }
}
