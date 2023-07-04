"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { Voters } from "./components/Voters";

export default function Home() {
  const account = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (!account.isConnected) if (router) router.push("/settings/account");
  }, [account, router]);

  return (
    <div className="flex min-h-screen flex-col gap-10">
      <div className="flex flex-col gap-4">
        <div className="text-[24px] font-light leading-[30px] text-white">
          Your Other Addresses
        </div>

        <div className="max-w-[580px] text-[18px] text-white">
          Here you can add other addresses to your Senate account, so that you
          can see the voting activity for those addresses as well.
        </div>
      </div>

      <Voters />
    </div>
  );
}
