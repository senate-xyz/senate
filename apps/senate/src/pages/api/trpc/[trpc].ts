import { createNextApiHandler } from '@trpc/server/adapters/next'

import { createTrpcContext } from '../../../server/context'
import { trpcAppRouter } from '../../../server/routers/trpcAppRouter'

// export API handler
export default createNextApiHandler({
    router: trpcAppRouter,
    createContext: createTrpcContext,
    onError:
        process.env.NODE_ENV === 'development'
            ? ({ path, error }) => {
                  console.error(`❌ tRPC failed on ${path}: ${error}`)
              }
            : undefined,
    batching: {
        enabled: true
    }
})
