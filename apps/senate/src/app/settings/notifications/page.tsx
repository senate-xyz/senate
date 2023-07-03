"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import UserEmail from "./components/csr/UserEmail";
import IsUniswapUser from "./components/csr/IsUniswapUser";
import IsAaveUser from "./components/csr/IsAaveUser";
import Discord from "./components/csr/Discord";
import Telegram from "./components/csr/Telegram";
import { trpc } from "../../../server/trpcClient";

export default function Home() {
  const account = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (!account.isConnected) if (router) router.push("/settings/account");
  }, [account, router]);

  const featureFlags = trpc.public.featureFlags.useQuery();

  return (
    <div className="flex min-h-screen flex-col gap-10">
      <div className="flex flex-col gap-4">
        <div className="text-[24px] font-light leading-[30px] text-white">
          Your Notifications
        </div>

        <div className="max-w-[580px] text-[18px] text-white">
          Here&apos;s the place to pick and choose which Senate notifications
          you want, and how you want them to reach you.
        </div>
      </div>

      {featureFlags.data?.includes("email_settings") && <UserEmail />}
      {featureFlags.data?.includes("discord_settings") && <Discord />}
      {featureFlags.data?.includes("telegram_settings") && <Telegram />}
      {featureFlags.data?.includes("magic_user_settings") && (
        <div className="flex flex-row gap-8">
          <IsAaveUser />
          <IsUniswapUser />
        </div>
      )}
    </div>
  );
}
