import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";

const prisma = new PrismaClient();
// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default async function auth(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const providers = [
    CredentialsProvider({
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
            JSON.parse(credentials?.message as string) || "{}"
          );

          const nextAuthUrl =
            process.env.NEXTAUTH_URL ||
            (process.env.VERCEL_URL
              ? `https://${process.env.VERCEL_URL}`
              : null);

          if (siwe.uri !== nextAuthUrl) {
            console.log("bad domain");
            console.log(siwe);
            console.log(nextAuthUrl);
            return null;
          }

          if (siwe.nonce !== (await getCsrfToken({ req }))) {
            console.log("bad nonce");
            console.log(siwe);
            console.log(await getCsrfToken({ req }));
            return null;
          }

          await siwe.validate(credentials?.signature || "");

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
          });
          return {
            id: siwe.address,
          };
        } catch (e) {
          console.log(e);
          return null;
        }
      },
    }),
  ];

  const isDefaultSigninPage =
    req.method === "GET" && req.query.nextauth?.includes("signin");

  // Hide Sign-In with Ethereum from default sign page
  if (isDefaultSigninPage) {
    providers.pop();
  }

  return await NextAuth(req, res, {
    // https://next-auth.js.org/configuration/providers/oauth
    providers,
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async session({ session, token }) {
        session.address = token.sub;
        session.user!.name = token.sub;
        session.user!.image = "https://www.fillmurray.com/128/128";
        return session;
      },
    },
  });
}