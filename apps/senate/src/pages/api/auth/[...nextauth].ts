import NextAuth, { type NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { SiweMessage } from 'siwe'
import { getCsrfToken } from 'next-auth/react'
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@senate/database'

export function authOptions(
    req?: NextApiRequest,
    res?: NextApiResponse
): NextAuthOptions {
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

                    const nextAuthUrl = new URL(
                        process.env.NEXT_PUBLIC_WEB_URL ?? ''
                    )

                    const result = await siwe.verify({
                        signature: credentials?.signature || '',
                        domain: nextAuthUrl.host,
                        nonce: await getCsrfToken({ req })
                    })

                    if (result.success) {
                        await prisma.user.upsert({
                            where: {
                                name: siwe.address
                            },
                            create: {
                                name: siwe.address,
                                acceptedterms: true,
                                acceptedtermstimestamp: new Date()
                            },
                            update: {
                                lastactive: new Date(),
                                sessioncount: { increment: 1 },
                                newuser: false
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
            maxAge: 2592000
        },
        callbacks: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            async session({ session, token }: { session: any; token: any }) {
                session.address = token.sub
                session.user.name = token.sub
                return session
            }
        },
        cookies: {
            sessionToken: {
                name: `next-auth.session-token`,
                options: {
                    path: '/',
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true
                }
            },
            callbackUrl: {
                name: `next-auth.callback-url`,
                options: {
                    path: '/',
                    sameSite: 'none',
                    secure: true
                }
            },
            csrfToken: {
                name: `next-auth.csrf-token`,
                options: {
                    path: '/',
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true
                }
            }
        },
        secret: process.env.NEXTAUTH_SECRET,
        events: {
            async signIn(message) {
                const user = await prisma.user.findFirst({
                    where: {
                        name: String(message.user.name)
                    }
                })

                if (user)
                    await prisma.user.update({
                        where: {
                            name: String(message.user.name)
                        },
                        data: {
                            lastactive: new Date(),
                            sessioncount: { increment: 1 }
                        }
                    })
            },
            async signOut() {
                res?.setHeader('Set-Cookie', [
                    `WebsiteToken=deleted; Max-Age=0`,
                    `AnotherCookieName=deleted; Max-Age=0`
                ])
            },
            async session(message) {
                const user = await prisma.user.findFirst({
                    where: {
                        name: String(message.session.user?.name)
                    }
                })

                if (user)
                    await prisma.user.update({
                        where: {
                            name: String(message.session.user?.name)
                        },
                        data: {
                            lastactive: new Date()
                        }
                    })
            }
        }
    }
}

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    const opts = authOptions(req, res)

    return await NextAuth(req, res, opts)
}
