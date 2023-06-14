'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || '', {
        api_host: `${process.env.NEXT_PUBLIC_WEB_URL}/ingest`
    })
}

function Fallback({ children }) {
    return <>{children}</>
}

export default function PHProvider({ children }) {
    return (
        <Suspense fallback={<Fallback>{children}</Fallback>}>
            <HogProvider>{children}</HogProvider>
        </Suspense>
    )
}

function HogProvider({ children }) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    // Track pageviews
    useEffect(() => {
        if (pathname && searchParams) {
            let url = window.origin + pathname
            if (searchParams.toString()) {
                url = url + `?${searchParams.toString()}`
            }
            posthog.capture('$pageview', {
                $current_url: url
            })
        }
    }, [pathname, searchParams])

    return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
