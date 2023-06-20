"use client";

import {
  connectorsForWallets,
  darkTheme,
  type DisclaimerComponent,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import {
  type GetSiweMessageOptions,
  RainbowKitSiweNextAuthProvider,
} from "@rainbow-me/rainbowkit-siwe-next-auth";
import { SessionProvider } from "next-auth/react";
import { configureChains, createConfig, mainnet, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { TrpcClientProvider } from "../server/trpcClient";
import Link from "next/link";
import {
  braveWallet,
  coinbaseWallet,
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  rabbyWallet,
  safeWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { getWebInstrumentations, initializeFaro } from "@grafana/faro-web-sdk";
import { TracingInstrumentation } from "@grafana/faro-web-tracing";

const { chains, publicClient } = configureChains(
  [mainnet],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY ?? "" }),
    publicProvider(),
  ]
);

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      metaMaskWallet({
        projectId: process.env.NEXT_PUBLIC_WALLERCONNECTID ?? "",
        chains: chains,
      }),
      injectedWallet({ chains }),
      walletConnectWallet({
        projectId: process.env.NEXT_PUBLIC_WALLERCONNECTID ?? "",
        chains,
      }),
    ],
  },
  {
    groupName: "Others",
    wallets: [
      safeWallet({ chains: chains }),
      coinbaseWallet({ chains, appName: "Senate" }),
      braveWallet({
        chains,
      }),
      ledgerWallet({
        projectId: process.env.NEXT_PUBLIC_WALLERCONNECTID ?? "",
        chains,
      }),
      rabbyWallet({
        chains,
      }),
    ],
  },
]);

const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: "Sign in to Senate",
});

const Disclaimer: DisclaimerComponent = () => (
  <div className="ml-2 select-none text-sm font-light text-white">
    By connecting your wallet, you agree to the{" "}
    <Link
      href={
        "https://senate.notion.site/Senate-Labs-Terms-of-Service-990ca9e655094b6f9673a3ead572956a"
      }
      className="underline"
      target="_blank"
    >
      Terms of Service
    </Link>
    ,{" "}
    <Link
      href={
        "https://senate.notion.site/Senate-Labs-Privacy-Policy-494e23d8a4e34d0189bfe07e0ae01bde"
      }
      className="underline"
      target="_blank"
    >
      Privacy Policy
    </Link>{" "}
    and{" "}
    <Link
      href={
        "https://senate.notion.site/Senate-Labs-Cookie-Policy-b429fe7b181e4cfda95f404f480bfdc7"
      }
      className="underline"
      target="_blank"
    >
      Cookie Policy
    </Link>{" "}
  </div>
);

if (typeof window !== "undefined") {
  initializeFaro({
    url: "https://faro-collector-prod-eu-west-3.grafana.net/collect/a50f821c64ac545d40b5a05022855dc3",
    app: {
      name: "web",
      version: "1.0.0",
      environment: process.env.NEXT_PUBLIC_EXEC_ENV,
    },
    instrumentations: [...getWebInstrumentations()],
  });

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
    api_host: `${process.env.NEXT_PUBLIC_WEB_URL || ""}/ingest`,
    opt_in_site_apps: true,
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") posthog.debug();
    },
  });
}

function HogProvider({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Track pageviews
  useEffect(() => {
    if (pathname && searchParams) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

export default function RootProvider({ children }) {
  return (
    <Suspense fallback={<RootProviderInner>{children}</RootProviderInner>}>
      <HogProvider>
        <RootProviderInner>{children}</RootProviderInner>
      </HogProvider>
    </Suspense>
  );
}

function RootProviderInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SessionProvider refetchInterval={60}>
      <TrpcClientProvider>
        <WagmiConfig config={config}>
          {pathname?.includes("verify") ? (
            <RainbowKitProvider
              appInfo={{
                appName: "Senate",
                disclaimer: Disclaimer,
                learnMoreUrl: "https://senate.notion.site",
              }}
              chains={chains}
              modalSize="compact"
              theme={darkTheme({
                accentColor: "#262626",
                accentColorForeground: "white",
                borderRadius: "none",
                overlayBlur: "small",
                fontStack: "rounded",
              })}
            >
              {children}
            </RainbowKitProvider>
          ) : (
            <RainbowKitSiweNextAuthProvider
              getSiweMessageOptions={getSiweMessageOptions}
            >
              <RainbowKitProvider
                appInfo={{
                  appName: "Senate",
                  disclaimer: Disclaimer,
                  learnMoreUrl: "https://senate.notion.site",
                }}
                chains={chains}
                modalSize="compact"
                theme={darkTheme({
                  accentColor: "#262626",
                  accentColorForeground: "white",
                  borderRadius: "none",
                  overlayBlur: "small",
                  fontStack: "rounded",
                })}
              >
                {children}
              </RainbowKitProvider>
            </RainbowKitSiweNextAuthProvider>
          )}
        </WagmiConfig>
      </TrpcClientProvider>
    </SessionProvider>
  );
}
