import NextAuth, { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { SiweMessage } from "siwe";
import { getCsrfToken } from "next-auth/react";
import type { NextApiRequest, NextApiResponse } from "next";
import { db, eq, sql, user, userTovoter, voter } from "@senate/database";
import { PostHog } from "posthog-node";
import cuid from "cuid";

const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
  host: `${process.env.NEXT_PUBLIC_WEB_URL ?? ""}/ingest`,
});

export function authOptions(
  req?: NextApiRequest,
  res?: NextApiResponse,
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
          if (!credentials) return { id: "" };

          const siwe: SiweMessage = new SiweMessage(
            JSON.parse(credentials.message) as Partial<SiweMessage>,
          );

          const nonce = await getCsrfToken({ req: { headers: req?.headers } });

          const result = await siwe.verify({
            signature: credentials?.signature || "",
            nonce: nonce,
          });

          if (result.success) {
            const existingUser = await db.query.user.findFirst({
              where: eq(user.address, result.data.address),
            });

            if (!existingUser) {
              posthog.capture({
                distinctId: result.data.address,
                event: "sign_up_wallet",
              });

              const userCUID = cuid();

              await db.insert(user).ignore().values({
                id: userCUID,
                address: result.data.address,
                verifiedaddress: true,
                acceptedterms: true,
                acceptedtermstimestamp: new Date(),
                sessioncount: 1,
              });

              await db
                .insert(voter)
                .ignore()
                .values({ id: cuid(), address: result.data.address });

              const [newVoter] = await db
                .select()
                .from(voter)
                .where(eq(voter.address, result.data.address));

              await db
                .insert(userTovoter)
                .values({ a: userCUID, b: newVoter.id });
            } else {
              posthog.identify({
                distinctId: result.data.address,
                properties: {
                  email: existingUser.email,
                  emaildailybulletin: existingUser.emaildailybulletin,
                  emptydailybulletin: existingUser.emptydailybulletin,
                  discordnotifications: existingUser.discordnotifications,
                  telegramnotifications: existingUser.telegramnotifications,
                  lastactive: existingUser.lastactive,
                  sessioncount: existingUser.sessioncount,
                },
              });

              await db
                .update(user)
                .set({
                  lastactive: new Date(),
                  verifiedaddress: true,
                  acceptedterms: true,
                  acceptedtermstimestamp: new Date(),
                  sessioncount: existingUser.sessioncount + 1,
                })
                .where(eq(user.address, result.data.address));
            }

            posthog.capture({
              distinctId: result.data.address,
              event: "connect_wallet",
            });

            return {
              id: result.data.address,
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
      // eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-explicit-any
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
        await db
          .update(user)
          .set({
            lastactive: new Date(),
            sessioncount: sql`${user.sessioncount} + 1`,
          })
          .where(eq(user.address, String(message.user.name)))
          .catch();
      },
      signOut() {
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
