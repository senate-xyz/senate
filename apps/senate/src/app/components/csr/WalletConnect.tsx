"use client";

import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { signOut, useSession } from "next-auth/react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { disconnect } from "@wagmi/core";
import { trpc } from "../../../server/trpcClient";
import { usePostHog } from "posthog-js/react";

const WalletConnect = () => {
  const posthog = usePostHog();
  const router = useRouter();
  const searchParams = useSearchParams();
  const account = useAccount();
  const session = useSession();
  const acceptedTerms = trpc.accountSettings.getAcceptedTerms.useQuery();
  const acceptedTermsTimestamp =
    trpc.accountSettings.getAcceptedTermsTimestamp.useQuery();
  const { connector: activeConnector } = useAccount();
  const { openConnectModal } = useConnectModal();

  useEffect(() => {
    const handleConnectorUpdate = ({ account }) => {
      if (account) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        signOut();
      }
    };

    if (activeConnector) {
      activeConnector.on("change", handleConnectorUpdate);
    }
  }, [activeConnector]);

  useEffect(() => {
    if (account.isConnected && posthog) posthog.identify(account.address);
  }, [account.isConnected, posthog]);

  useEffect(() => {
    if (router) router.refresh();
  }, [account.isConnected, account.isDisconnected, session.status]);

  useEffect(() => {
    const disconnectForTerms = async () => {
      await disconnect();
    };

    if (
      session.status == "authenticated" &&
      acceptedTerms.isSuccess &&
      acceptedTermsTimestamp.isSuccess
    ) {
      if (!(acceptedTerms.data && acceptedTermsTimestamp.data)) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        disconnectForTerms();
      }
    }
  }, [acceptedTerms.isFetched, acceptedTermsTimestamp.isFetched]);

  if (process.env.OUTOFSERVICE === "true") redirect("/outofservice");
  // const [cookie] = useCookies(['hasSeenLanding'])
  // useEffect(() => {
  //     if (!cookie.hasSeenLanding && router) router.push('/landing')
  // }, [cookie])

  const [modalOpened, setModalOpened] = useState(false);

  useEffect(() => {
    if (
      searchParams?.has("connect") &&
      openConnectModal &&
      account.isDisconnected &&
      !modalOpened
    ) {
      setModalOpened(true);
      openConnectModal();
    }
  }, [openConnectModal, searchParams, account]);

  return (
    <div>
      <Suspense fallback={<></>}>
        <ConnectButton showBalance={false} />
      </Suspense>
    </div>
  );
};

export default WalletConnect;
