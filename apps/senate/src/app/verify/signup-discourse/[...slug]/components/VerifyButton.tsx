"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

import { Suspense, useEffect, useState, useTransition } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { discourseSignup } from "../actions";

export const VerifyButton = (props: { challenge: string }) => {
  const router = useRouter();
  const posthog = usePostHog();
  const message = `Welcome to Senate! \nchallenge: ${props.challenge}`;
  const [signPopup, setSignPopup] = useState(false);
  const { address, isConnected, connector: activeConnector } = useAccount();
  const { signMessage, data: signedMessage } = useSignMessage({
    message: message,
  });
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (
      address &&
      activeConnector &&
      signMessage &&
      isConnected &&
      !signPopup
    ) {
      if (posthog) posthog.identify(address);
      setSignPopup(true);
      signMessage();
    }
  }, [posthog, address, isConnected, activeConnector, signMessage, signPopup]);

  useEffect(() => {
    if (signedMessage)
      startTransition(() =>
        discourseSignup(
          props.challenge,
          message,
          address ?? "",
          signedMessage ?? ""
        ).then(() => {
          if (router) router.push("/orgs?connect");
        })
      );
  }, [address, message, props.challenge, router, signedMessage]);

  return (
    <Suspense fallback={<></>}>
      <ConnectButton showBalance={false} />
    </Suspense>
  );
};
