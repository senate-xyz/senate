import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from '../server/routers/_app'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export type Inputs = inferRouterInputs<AppRouter>

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export type Outputs = inferRouterOutputs<AppRouter>
