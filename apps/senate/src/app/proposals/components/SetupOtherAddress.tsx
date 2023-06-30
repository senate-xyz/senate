"use client";

import { useCookies } from "react-cookie";
import Image from "next/image";
import Link from "next/link";

const SetupOtherAddress = () => {
  const [cookie, setCookie] = useCookies(["proposalsBannerDismissed"]);

  return (
    <div>
      {!cookie.proposalsBannerDismissed && (
        <div className="flex w-full flex-row items-center justify-between bg-[#FFF1BF] p-6">
          <div className="text-[24px] font-light text-black">
            You can add other wallet addresses so that you can also see the
            voting status of other wallets. You can do it in{" "}
            <Link href={"/settings/proxy"} className="underline">
              Settings
            </Link>
            .
          </div>
          <button
            className="flex min-w-[24px] justify-end"
            onClick={() =>
              setCookie("proposalsBannerDismissed", true, {
                maxAge: 60 * 60 * 24 * 365,
              })
            }
          >
            <Image
              loading="eager"
              priority={true}
              width={12}
              height={12}
              src={"/assets/Icon/CloseButton.svg"}
              alt="off-chain"
            />
          </button>
        </div>
      )}
    </div>
  );
};
export default SetupOtherAddress;
