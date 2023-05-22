import '@rainbow-me/rainbowkit/styles.css'

import { prisma } from '@senate/database'
import Link from 'next/link'

const isValidChallenge = async (challenge: string) => {
    const user = await prisma.user.findFirst({
        where: {
            challengecode: challenge
        }
    })

    return user ? true : false
}

const verifyUser = async (challenge: string) => {
    await prisma.user.updateMany({
        where: {
            challengecode: challenge
        },
        data: {
            challengecode: '',
            isaaveuser: 'ENABLED'
        }
    })
}

export default async function Page({ params }) {
    const validChallenge = await isValidChallenge(String(params.challenge))

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
        await verifyUser(String(params.challenge))

        return (
            <div className='flex w-full flex-col items-center gap-4 pt-32'>
                <p className='text-3xl font-bold text-white'>
                    Thank you for verifying your email address. You are now an
                    Aave magic user.
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
