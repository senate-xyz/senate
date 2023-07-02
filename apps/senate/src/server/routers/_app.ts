/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, router } from "../trpc";
import { accountSettingsRouter } from "./accountSettings";
import { healthRouter } from "./health";
import { publicRouter } from "./public";
import { verifyRouter } from "./verify";

export const appRouter = router({
  public: publicRouter,
  accountSettings: accountSettingsRouter,
  verify: verifyRouter,
  health: healthRouter,

  whoami: publicProcedure.query(({ ctx }) => {
    const user = ctx.user ?? null;
    return user;
  }),
});

export type AppRouter = typeof appRouter;
