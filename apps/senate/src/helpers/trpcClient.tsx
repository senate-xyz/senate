import { createTRPCReact, httpBatchLink } from '@trpc/react-query'
import type { TrpcAppRouter } from '../server/routers/trpcAppRouter'
import superjson from 'superjson'

const getBaseUrl = (): string => {
    if (typeof window !== 'undefined') return ''

    if (process.env.WEB_URL) return `https://${process.env.WEB_URL}`

    if (process.env.WEB_URL)
        return `http://${process.env.WEB_URL}:${process.env.PORT}`

    return `http://localhost:${process.env.PORT ?? 3000}`
}
export const trpc = createTRPCReact<TrpcAppRouter>()

export const trpcClient = trpc.createClient({
    transformer: superjson,
    links: [
        httpBatchLink({
            url: `${getBaseUrl()}/api/trpc`
            // optional
            // headers:  () => {
            //   return {
            //     authorization: getAuthCookie(),
            //   };
            // },
        })
    ]
})
