"use client";

import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { signOut, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { usePostHog } from "posthog-js/react";
import { useCookies } from "react-cookie";
import { subscribe } from "../../orgs/unsubscribedDAOs/actions";

const WalletConnect = () => {
  const posthog = usePostHog();
  const router = useRouter();
  const searchParams = useSearchParams();
  const session = useSession();
  const account = useAccount({
    onConnect({ address }) {
      if (posthog) posthog.identify(address);
    },
    onDisconnect() {
      if (posthog) posthog.reset();
      if (router) router.refresh();
    },
  });

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

  const [cookie, , removeCookie] = useCookies(["subscribe"]);

  //automagically subscribe to the dao you tried to but weren't connected
  useEffect(() => {
    if (cookie.subscribe && session.status == "authenticated") {
      void subscribe(cookie.subscribe as string).then(() => {
        removeCookie("subscribe");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookie.subscribe, session.status]);

  return (
    <div id="connectButton">
      <Suspense fallback={<></>}>
        <ConnectButton showBalance={false} />
      </Suspense>
    </div>
  );
};

export default WalletConnect;
