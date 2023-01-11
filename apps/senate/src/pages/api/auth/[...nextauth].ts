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
            name: 'Ethereum',
            credentials: {
                message: {
                    label: 'Message',
                    type: 'text',
                    placeholder: '0x0'
                },
                signature: {
                    label: 'Signature',
                    type: 'text',
                    placeholder: '0x0'
                }
            },
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
                                },
                                lastActive: new Date(),
                                sessionCount: 0
                            },
                            update: {
                                name: siwe.address,
                                newUser: false,
                                sessionCount: { increment: 1 }
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
            }
        })
    ]

    return {
        providers,
        session: {
            strategy: 'jwt',
            maxAge: 600
        },
        callbacks: {
            async session({ session, token }: { session: any; token: any }) {
                session.address = token.sub
                session.user.name = token.sub
                return session
            }
        },
        secret: process.env.NEXTAUTH_SECRET,
        events: {
            async signIn(message) {
                await prisma.user.update({
                    where: {
                        name: String(message.user.name)
                    },
                    data: {
                        lastActive: new Date(),
                        sessionCount: { increment: 1 }
                    }
                })
            },
            async signOut(message) {
                console.log(message)
            },
            async createUser(message) {
                console.log(message)
            },
            async updateUser(message) {
                console.log(message)
            },
            async linkAccount(message) {
                console.log(message)
            },
            async session(message) {
                console.log(message)
            }
        }
    }
}

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    const authOptions = getAuthOptions(req)

    return await NextAuth(req, res, authOptions)
}
