"use client";

import { useCookies } from "react-cookie";
import Image from "next/image";
import Link from "next/link";
import { trpc } from "../../../server/trpcClient";

const SetupOtherAddress = () => {
  const [cookie, setCookie] = useCookies(["proposalsBannedDismissed"]);
  const proxies = trpc.accountSettings.voters.useQuery();

  if (!proxies.data) return <></>;

  return (
    <div>
      {!cookie.proposalsBannedDismissed && proxies.data?.length < 1 && (
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
              setCookie("proposalsBannedDismissed", true, {
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
