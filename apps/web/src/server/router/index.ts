// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { userRouter } from "./user";
import { unrestrictedRouter } from "./unrestricted";
import { trackerRouter } from "./tracker";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("user.", userRouter)
  .merge("unrestricted.", unrestrictedRouter)
  .merge("tracker.", trackerRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
