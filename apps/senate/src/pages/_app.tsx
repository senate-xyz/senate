import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import type { Session } from 'next-auth'
import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import type { GetSiweMessageOptions } from '@rainbow-me/rainbowkit-siwe-next-auth'
import { RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth'
import {
    darkTheme,
    getDefaultWallets,
    RainbowKitProvider
} from '@rainbow-me/rainbowkit'
import { mainnet, configureChains, createClient, WagmiConfig } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'
import { trpc } from '../utils/trpc'
import Head from 'next/head'
import Script from 'next/script'

const { chains, provider } = configureChains(
    [mainnet],
    [
        jsonRpcProvider({
            rpc: () => ({
                http: process.env.NEXT_PUBLIC_PROVIDER_URL ?? 'missing_key'
            })
        }),
        publicProvider()
    ]
)

const { connectors } = getDefaultWallets({
    appName: 'Senate',
    chains
})

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
})

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
    statement: 'Sign in to Senate'
})

const MyApp = ({
    Component,
    pageProps
}: AppProps<{
    session: Session
}>) => {
    return (
        <>
            <WagmiConfig client={wagmiClient}>
                <SessionProvider
                    refetchInterval={60}
                    session={pageProps.session}
                >
                    <RainbowKitSiweNextAuthProvider
                        getSiweMessageOptions={getSiweMessageOptions}
                    >
                        <RainbowKitProvider
                            chains={chains}
                            theme={darkTheme({
                                accentColor: '#262626',
                                accentColorForeground: 'white',
                                borderRadius: 'medium',
                                overlayBlur: 'small'
                            })}
                        >
                            <Head>
                                <title>Senate</title>
                                <link
                                    rel='icon'
                                    type='image/png'
                                    sizes='64x64'
                                    href='/assets/Senate_Logo/64/Black.svg'
                                />
                                <meta
                                    name='viewport'
                                    content='initial-scale=1.0, width=device-width'
                                />
                            </Head>

                            <Script id='howuku'>
                                {`(function(t,r,a,c,k){
                                c=['track','identify','converted'],t.o=t._init||{},
                                c.map(function(n){return t.o[n]=t.o[n]||function(){(t.o[n].q=t.o[n].q||[]).push(arguments);};}),t._init=t.o,
                                k=r.createElement("script"),k.type="text/javascript",k.async=true,k.src="https://cdn.howuku.com/js/track.js",k.setAttribute("key",a),
                                r.getElementsByTagName("head")[0].appendChild(k);
                                })(window, document, "9mv6yAGkYDZV0BJEzlN34O");`}
                            </Script>
                            <Script src='https://api.buildbetter.app/v1/widget/index.js' />
                            <Script id='feedback'>
                                {`function start() {
                                if (
                                    window.hasOwnProperty("BuildBetter") &&
                                    typeof window.BuildBetter.FeedbackWidget.init === "function"
                                ) {
                                    window.BuildBetter.FeedbackWidget.init({
                                    token: "671228cf-23f1-41bf-8ad9-ee22328942d9",
                                    });
                                }
                                window.clearInterval(interval);
                                }
                                var interval = window.setInterval(start, 1000);`}
                            </Script>

                            <Component {...pageProps} />
                        </RainbowKitProvider>
                    </RainbowKitSiweNextAuthProvider>
                </SessionProvider>
            </WagmiConfig>
        </>
    )
}

export default trpc.withTRPC(MyApp)
