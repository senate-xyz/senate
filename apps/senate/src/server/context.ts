/* eslint-disable @typescript-eslint/no-unused-vars */
import type * as trpc from "@trpc/server";
import type * as trpcNext from "@trpc/server/adapters/next";
import {getServerSession, type User} from "next-auth";
import {authOptions} from "../pages/api/auth/[...nextauth]";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CreateContextOptions {
  user: User | null;
  rsc: boolean;
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export function createContextInner(opts: CreateContextOptions) {
  return {
    user: opts.user,
  };
}

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(
  opts: trpcNext.CreateNextContextOptions & { type: "api" }
) {
  // for API-response caching see https://trpc.io/docs/caching

  // not RSC
  const session = await getServerSession(opts.req, opts.res, authOptions());
  return {
    type: opts.type,
    user: session?.user,
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
