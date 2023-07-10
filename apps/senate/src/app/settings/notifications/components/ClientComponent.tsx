"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export const ClientComponent = () => {
  const account = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (!account.isConnected) if (router) void router.push("/settings/account");
  }, [account, router]);

  return <></>;
};
