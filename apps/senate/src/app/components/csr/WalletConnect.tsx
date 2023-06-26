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
  const session = useSession();
  const account = useAccount({
    onConnect() {
      const disconnectForTerms = async () => {
        await disconnect();
      };

      if (
        session.status == "authenticated" &&
        account.isConnected &&
        acceptedTerms.isSuccess &&
        acceptedTermsTimestamp.isSuccess &&
        !acceptedTerms.data
      ) {
        void disconnectForTerms();
      } else {
        if (posthog) posthog.identify(account.address);
      }
    },
    onDisconnect() {
      if (posthog) posthog.reset();
      if (router) router.refresh();
    },
  });

  const acceptedTerms = trpc.accountSettings.getAcceptedTerms.useQuery();
  const acceptedTermsTimestamp =
    trpc.accountSettings.getAcceptedTermsTimestamp.useQuery();
  const { connector: activeConnector } = useAccount();
  const { openConnectModal } = useConnectModal();

  useEffect(() => {
    if (router) router.refresh();
  }, [router, session.status]);

  useEffect(() => {
    const handleConnectorUpdate = ({ account }) => {
      if (account) {
        void signOut();
      }
    };

    if (activeConnector) {
      activeConnector.on("change", handleConnectorUpdate);
    }
  }, [activeConnector]);

  if (process.env.OUTOFSERVICE === "true") redirect("/outofservice");

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
  }, [openConnectModal, searchParams, account, modalOpened]);

  return (
    <div>
      <Suspense fallback={<></>}>
        <ConnectButton showBalance={false} />
      </Suspense>
    </div>
  );
};

export default WalletConnect;
