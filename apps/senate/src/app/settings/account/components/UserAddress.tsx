"use client";

import { useAccountModal } from "@rainbow-me/rainbowkit";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import NotConnected from "./NotConnected";
import { DM_Mono } from "next/font/google";

const dmmono = DM_Mono({
  weight: "400",
  subsets: ["latin"],
});

const UserAddress = () => {
  const session = useSession();
  const account = useAccount();
  const provider = usePublicClient();
  const { openAccountModal } = useAccountModal();

  const [ens, setEns] = useState("");

  useEffect(() => {
    if (session.status === "authenticated" && account.address) {
      void provider.getEnsName({ address: account.address }).then((ens) => {
        setEns(ens ?? "");
      });
    }
  }, [account.address, provider, session.status]);

  return (
    <div>
      {!account.address || session.status != "authenticated" ? (
        <div>
          <NotConnected />
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <div className="text-[18px] text-white">
              This is your current connected account
            </div>
            <div className="flex flex-col gap-2 overflow-hidden">
              <div
                className={`${dmmono.className} text-[18px] font-normal leading-[23px] text-white`}
              >
                {ens}
              </div>
              <div
                className={`break-all ${dmmono.className} text-[18px] font-light leading-[23px] text-[#ABABAB]`}
              >
                {account.address}
              </div>
            </div>
          </div>
          <button
            className="w-fit bg-black px-4 py-2 font-bold text-white hover:scale-105"
            onClick={() => {
              openAccountModal ? openAccountModal() : null;
            }}
          >
            Disconnect Wallet
          </button>
          <div className="text-[12px] text-white">
            You can read our{" "}
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
            </Link>
            .
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAddress;
