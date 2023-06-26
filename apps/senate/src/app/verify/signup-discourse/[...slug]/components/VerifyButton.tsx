"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

import { Suspense, useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { trpc } from "../../../../../server/trpcClient";
import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";

export const VerifyButton = (props: { challenge: string }) => {
  const router = useRouter();
  const posthog = usePostHog();
  const message = `Welcome to Senate! \nchallenge: ${props.challenge}`;
  const [signPopup, setSignPopup] = useState(false);
  const { address, isConnected, connector: activeConnector } = useAccount();
  const { signMessage, data: signedMessage } = useSignMessage({
    message: message,
  });

  const verify = trpc.verify.discourseSignup.useMutation();

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
      verify.mutate(
        {
          challenge: props.challenge,
          message: message,
          address: address ?? "",
          signature: signedMessage ?? "",
        },
        {
          onSuccess: () => {
            if (router) router.push("/orgs?connect");
          },
        }
      );
  }, [address, message, props.challenge, router, signedMessage, verify]);

  return (
    <Suspense fallback={<></>}>
      <ConnectButton showBalance={false} />
    </Suspense>
  );
};
