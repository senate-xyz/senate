"use client";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import Link from "next/link";

const NotConnected = () => {
  const { openConnectModal } = useConnectModal();
  return (
    <div>
      <div className="flex flex-col gap-5">
        <p className="text-[15px] text-[#D9D9D9]">
          Please connect your wallet to customize your Account settings
        </p>
        <button
          className="w-fit bg-zinc-800 px-4 py-2 font-bold text-white hover:scale-105"
          onClick={() => {
            openConnectModal ? openConnectModal() : null;
          }}
        >
          Connect Wallet
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
    </div>
  );
};

export default NotConnected;
