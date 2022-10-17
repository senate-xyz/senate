import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { SiweMessage } from 'siwe'
import { getCsrfToken } from 'next-auth/react'
import { NextApiRequest, NextApiResponse } from 'next'
import { IncomingMessage } from 'http'
import { prisma } from '@senate/database'

export function getAuthOptions(req: IncomingMessage): NextAuthOptions {
    const providers = [
        CredentialsProvider({
            async authorize(credentials) {
                try {
                    const siwe = new SiweMessage(
                        JSON.parse(credentials?.message || '{}')
                    )

                    const nextAuthUrl =
                        process.env.NEXTAUTH_URL ||
                        (process.env.VERCEL_URL
                            ? `https://${process.env.VERCEL_URL}`
                            : null)
                    if (!nextAuthUrl) {
                        return null
                    }

                    const nextAuthHost = new URL(nextAuthUrl).host
                    if (siwe.domain !== nextAuthHost) {
                        return null
                    }

                    if (siwe.nonce !== (await getCsrfToken({ req }))) {
                        return null
                    }

                    await siwe.validate(credentials?.signature || '')

                    await prisma.user.upsert({
                        where: {
                            address: siwe.address,
                        },
                        create: {
                            address: siwe.address,
                        },
                        update: {
                            address: siwe.address,
                        },
                    })
                    return {
                        id: siwe.address,
                    }
                } catch (e) {
                    return null
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
        // https://next-auth.js.org/configuration/providers/oauth
        providers,
        secret: process.env.NEXTAUTH_SECRET,
        session: {
            strategy: 'jwt',
        },
    }
}

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    const authOptions = getAuthOptions(req)

    if (!Array.isArray(req.query.nextauth)) {
        res.status(400).send('Bad request')
        return
    }

    const isDefaultSigninPage =
        req.method === 'GET' &&
        req.query.nextauth.find((value) => value === 'signin')

    // Hide Sign-In with Ethereum from default sign page
    if (isDefaultSigninPage) {
        authOptions.providers.pop()
    }

    return await NextAuth(req, res, authOptions)
}
