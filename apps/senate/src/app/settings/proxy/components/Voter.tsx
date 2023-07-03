"use client";

import { useTransition } from "react";
import { useEnsName } from "wagmi";
import { DM_Mono } from "next/font/google";

const dmmono = DM_Mono({
  weight: "400",
  subsets: ["latin"],
});

export const Voter = ({
  address,
  removeVoter,
}: {
  address: string;
  removeVoter: (address: string) => void;
}) => {
  const { data } = useEnsName({
    address: address as `0x${string}`,
  });

  const [, startTransition] = useTransition();

  return (
    <div
      key={address}
      className="flex flex-col items-start gap-2 lg:flex-row lg:items-end lg:gap-12"
    >
      <div className="flex flex-col">
        <div
          className={`${dmmono.className} text-[18px] font-normal leading-[23px] text-white`}
        >
          {data}
        </div>
        <div
          className={`break-all ${dmmono.className} text-[18px] font-light leading-[23px] text-[#ABABAB]`}
        >
          {address}
        </div>
      </div>

      <button
        onClick={() => {
          startTransition(() => {
            void removeVoter(address);
          });
        }}
        className="text-[18px] font-light text-white underline"
      >
        Delete
      </button>
    </div>
  );
};
