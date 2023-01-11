'use client'

import 'client-only'

import { QueryClientProvider } from '@tanstack/react-query'
import { FC, FunctionComponent, ReactNode } from 'react'

import { appQueryClient, appQueryContext } from './appQueryClient'
import { trpc, trpcClient } from './trpcClient'

export const ClientWrappers: FC<{ children: ReactNode }> = (props) => {
    return (
        <trpc.Provider client={trpcClient} queryClient={appQueryClient}>
            <QueryClientProvider
                client={appQueryClient}
                context={appQueryContext}
            >
                {props.children}
            </QueryClientProvider>
        </trpc.Provider>
    )
}

export const withClientWrappers = <T extends Record<string, any> | never>(
    Child: FunctionComponent<T>
) => {
    // eslint-disable-next-line react/display-name
    return (props: T): JSX.Element => {
        return (
            <ClientWrappers>
                <Child {...props}></Child>
            </ClientWrappers>
        )
    }
}
