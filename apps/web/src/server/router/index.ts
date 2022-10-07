// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { userRouter } from "./user";
import { unrestrictedRouter } from "./unrestricted";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("user.", userRouter)
  .merge("unrestricted.", unrestrictedRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
