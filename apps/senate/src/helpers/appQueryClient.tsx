'use client'

import 'client-only'

import { QueryClient } from '@tanstack/react-query'
import { Context, createContext } from 'react'

export const appQueryClient = new QueryClient()
export const appQueryContext: Context<QueryClient | undefined> = createContext(
    appQueryClient
) as Context<QueryClient | undefined>
