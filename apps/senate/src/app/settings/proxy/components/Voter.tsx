"use client";

import { useState, useEffect, useTransition } from "react";
import { usePublicClient } from "wagmi";

export const Voter = ({
  address,
  removeVoter,
}: {
  address: string;
  removeVoter: (address: string) => void;
}) => {
  const provider = usePublicClient();
  const [voterEns, setVoterEns] = useState("");
  const [, startTransition] = useTransition();

  useEffect(() => {
    void (async () => {
      const ens = await provider.getEnsName({
        address: address as `0x${string}`,
      });

      setVoterEns(ens ?? "");
    })();
  }, [address, provider]);

  return (
    <div
      key={address}
      className="flex flex-col items-start gap-2 lg:flex-row lg:items-end lg:gap-12"
    >
      <div className="flex flex-col">
        <div className="font-mono text-[18px] font-normal leading-[23px] text-white">
          {voterEns}
        </div>
        <div className="break-all font-mono text-[18px] font-light leading-[23px] text-[#ABABAB]">
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
