import NextAuth, { NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { SiweMessage } from 'siwe'
import { getCsrfToken } from 'next-auth/react'
import { NextApiRequest, NextApiResponse } from 'next'
import { IncomingMessage } from 'http'
import { prisma } from '@senate/database'
import { RefreshStatus } from '../../../../../../packages/common-types/dist'

export function getAuthOptions(req: IncomingMessage): NextAuthOptions {
    const providers = [
        Credentials({
            async authorize(credentials) {
                try {
                    const siwe = new SiweMessage(
                        JSON.parse(credentials?.message || '{}')
                    )

                    // const nextAuthUrl =
                    //     process.env.NEXTAUTH_URL ||
                    //     (process.env.VERCEL_URL
                    //         ? `https://${process.env.VERCEL_URL}`
                    //         : null)
                    // if (!nextAuthUrl) {
                    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    //     return 'bad url' as any
                    // }

                    // const nextAuthHost = new URL(nextAuthUrl).host
                    // if (siwe.domain !== nextAuthHost) {
                    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    //     return 'bad domain' as any
                    // }

                    if (siwe.nonce !== (await getCsrfToken({ req }))) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        return 'bad nonce' as any
                    }

                    await siwe.validate(credentials?.signature || '')

                    const user = await prisma.user.upsert({
                        where: {
                            name: siwe.address,
                        },
                        create: {
                            name: siwe.address,
                            newUser: true,
                            acceptedTerms: false,
                            email: '',
                            userSettings: {
                                create: {
                                    dailyBulletinEmail: true,
                                },
                            },
                        },
                        update: {
                            name: siwe.address,
                            newUser: false,
                        },
                    })

                    await prisma.voter.upsert({
                        where: {
                            address: siwe.address,
                        },
                        create: {
                            address: siwe.address,
                            refreshStatus: RefreshStatus.NEW,
                            lastRefresh: new Date(0),
                            users: { connect: { id: user.id } },
                        },
                        update: {
                            address: siwe.address,
                            refreshStatus: RefreshStatus.NEW,
                            lastRefresh: new Date(0),
                            users: { connect: { id: user.id } },
                        },
                    })

                    return {
                        id: siwe.address,
                    }
                } catch (e) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    return e as any
                }
            },
            credentials: {
                message: {
                    label: 'Message',
                    placeholder: '0x0',
                    type: 'text',
                },
                signature: {
                    label: 'Signature',
                    placeholder: '0x0',
                    type: 'text',
                },
            },
            name: 'Ethereum',
        }),
    ]

    return {
        callbacks: {
            async session({ session, token }) {
                if (session.user) {
                    session.user.name = token.sub
                }
                return session
            },
        },
        providers,
        secret: process.env.NEXTAUTH_SECRET,
        session: {
            strategy: 'jwt',
        },
        debug: true,
    }
}

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    const authOptions = getAuthOptions(req)

    return await NextAuth(req, res, authOptions)
}
