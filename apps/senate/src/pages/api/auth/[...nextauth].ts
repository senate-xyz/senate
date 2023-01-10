import NextAuth, { NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { SiweMessage } from 'siwe'
import { getCsrfToken } from 'next-auth/react'
import { NextApiRequest, NextApiResponse } from 'next'
import { IncomingMessage } from 'http'
import { prisma } from '@senate/database'

export function getAuthOptions(req: IncomingMessage): NextAuthOptions {
    const providers = [
        Credentials({
            async authorize(credentials) {
                try {
                    const siwe = new SiweMessage(
                        JSON.parse(credentials?.message || '{}')
                    )

                    const nextAuthUrl = new URL(process.env.NEXTAUTH_URL ?? '')

                    const result = await siwe.verify({
                        signature: credentials?.signature || '',
                        domain: nextAuthUrl.host,
                        nonce: await getCsrfToken({ req })
                    })

                    if (result.success) {
                        const user = await prisma.user.upsert({
                            where: {
                                name: siwe.address
                            },
                            create: {
                                name: siwe.address,
                                newUser: true,
                                acceptedTerms: false,
                                email: '',
                                userSettings: {
                                    create: {
                                        dailyBulletinEmail: true
                                    }
                                }
                            },
                            update: {
                                name: siwe.address,
                                newUser: false
                            }
                        })

                        await prisma.voter.upsert({
                            where: {
                                address: siwe.address
                            },
                            create: {
                                address: siwe.address,
                                users: { connect: { id: user.id } }
                            },
                            update: {
                                address: siwe.address,
                                users: { connect: { id: user.id } }
                            }
                        })

                        return {
                            id: siwe.address
                        }
                    }
                    return null
                } catch (e) {
                    return null
                }
            },
            credentials: {
                message: {
                    label: 'Message',
                    placeholder: '0x0',
                    type: 'text'
                },
                signature: {
                    label: 'Signature',
                    placeholder: '0x0',
                    type: 'text'
                }
            },
            name: 'Ethereum'
        })
    ]

    return {
        callbacks: {
            async session({ session, token }) {
                if (session.user) {
                    session.user.name = token.sub
                }
                return session
            }
        },
        providers,
        secret: process.env.NEXTAUTH_SECRET,
        session: {
            strategy: 'jwt'
        },
        debug: true
    }
}

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    const authOptions = getAuthOptions(req)

    return await NextAuth(req, res, authOptions)
}
