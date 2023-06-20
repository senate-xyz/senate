import NextAuth, { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { SiweMessage } from "siwe";
import { getCsrfToken } from "next-auth/react";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@senate/database";
import { PostHog } from "posthog-node";

const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
  host: `${process.env.NEXT_PUBLIC_WEB_URL || ""}/ingest`,
});

export function authOptions(
  req?: NextApiRequest,
  res?: NextApiResponse
): NextAuthOptions {
  const providers = [
    Credentials({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        try {
          const siwe = new SiweMessage(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            JSON.parse(credentials?.message || "{}")
          );

          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL ?? "");

          const result = await siwe.verify({
            signature: credentials?.signature || "",
            domain: nextAuthUrl.host,
            nonce: await getCsrfToken({ req }),
          });

          if (result.success) {
            const existingUser = await prisma.user.findUnique({
              where: { address: siwe.address },
              include: {
                _count: true,
              },
            });

            if (!existingUser) {
              posthog.capture({
                distinctId: siwe.address,
                event: "sign_up_wallet",
              });

              await prisma.user.create({
                data: {
                  address: siwe.address,
                  verifiedaddress: true,
                  acceptedterms: true,
                  acceptedtermstimestamp: new Date(),
                  voters: {
                    connectOrCreate: {
                      where: { address: siwe.address },
                      create: { address: siwe.address },
                    },
                  },
                },
              });
            } else {
              posthog.identify({
                distinctId: siwe.address,
                properties: {
                  email: existingUser.email,
                  subscriptions: existingUser._count.subscriptions,
                  notifications: existingUser._count.notifications,
                  emaildailybulletin: existingUser.emaildailybulletin,
                  emptydailybulletin: existingUser.emptydailybulletin,
                  discordnotifications: existingUser.discordnotifications,
                  telegramnotifications: existingUser.telegramnotifications,
                  lastactive: existingUser.lastactive,
                  sessioncount: existingUser.sessioncount,
                },
              });

              await prisma.user.update({
                where: {
                  address: siwe.address,
                },
                data: {
                  verifiedaddress: true,
                  lastactive: new Date(),
                  sessioncount: { increment: 1 },
                  acceptedterms: true,
                  acceptedtermstimestamp: new Date(),
                },
              });
            }

            posthog.capture({
              distinctId: siwe.address,
              event: "connect_wallet",
            });

            return {
              id: siwe.address,
            };
          }
          return null;
        } catch (e) {
          return null;
        }
      },
    }),
  ];

  return {
    providers,
    session: {
      strategy: "jwt",
      maxAge: 14400,
    },
    callbacks: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/require-await
      async session({ session, token }: { session: any; token: any }) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        session.address = token.sub;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        session.user.name = token.sub;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return session;
      },
    },
    cookies: {
      sessionToken: {
        name: `next-auth.session-token`,
        options: {
          path: "/",
          httpOnly: true,
          sameSite: "none",
          secure: true,
        },
      },
      callbackUrl: {
        name: `next-auth.callback-url`,
        options: {
          path: "/",
          sameSite: "none",
          secure: true,
        },
      },
      csrfToken: {
        name: `next-auth.csrf-token`,
        options: {
          path: "/",
          httpOnly: true,
          sameSite: "none",
          secure: true,
        },
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
    events: {
      async signIn(message) {
        const user = await prisma.user.findFirst({
          where: {
            address: String(message.user.name),
          },
        });
        if (user)
          await prisma.user.update({
            where: {
              address: String(message.user.name),
            },
            data: {
              lastactive: new Date(),
              sessioncount: { increment: 1 },
            },
          });
      },
      // eslint-disable-next-line @typescript-eslint/require-await
      async signOut() {
        res?.setHeader("Set-Cookie", [
          `WebsiteToken=deleted; Max-Age=0`,
          `AnotherCookieName=deleted; Max-Age=0`,
        ]);
      },
    },
  };
}

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const opts = authOptions(req, res);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return await NextAuth(req, res, opts);
}
