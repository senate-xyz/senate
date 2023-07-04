"use client";

import { Suspense, useEffect, useState, useTransition } from "react";
import { usePublicClient } from "wagmi";
import { Voter } from "./Voter";
import { addVoter, removeVoter, getVoters } from "../actions";
import { DM_Mono } from "next/font/google";

const dmmono = DM_Mono({
  weight: "400",
  subsets: ["latin"],
});

export const Voters = () => {
  const provider = usePublicClient();
  const [proxyAddress, setProxyAddress] = useState("");
  const [, startTransition] = useTransition();
  const [voters, setVoters] = useState<string[]>([]);

  useEffect(() => {
    const fetchVoters = async () => {
      const v = await getVoters();
      setVoters(v);
    };
    void fetchVoters();
  }, []);

  const onEnter = async () => {
    let resolvedAddress = proxyAddress;
    if (proxyAddress.includes(".eth")) {
      resolvedAddress = String(
        await provider.getEnsAddress({
          name: proxyAddress,
        })
      );
    }
    startTransition(() =>
      addVoter(resolvedAddress).then(async () => {
        setProxyAddress("");
        const v = await getVoters();
        setVoters(v);
      })
    );
  };

  const remove = (address: string) => {
    startTransition(() =>
      removeVoter(address).then(async () => {
        const v = await getVoters();
        setVoters(v);
      })
    );
  };

  return (
    <div>
      <Suspense>
        <div className="mb-8 flex flex-col gap-4">
          {voters.map((voter, index) => {
            return <Voter key={index} address={voter} removeVoter={remove} />;
          })}
        </div>
      </Suspense>

      <div className="flex h-[46px] flex-row items-center">
        <input
          className={`h-full w-full bg-[#D9D9D9] px-2 ${dmmono.className} text-[18px] font-light leading-[23px] text-black lg:w-[480px]`}
          value={proxyAddress}
          onChange={(e) => setProxyAddress(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void onEnter();
          }}
          placeholder="Paste a new proxy address here (or ENS)"
        />

        <div
          className={`flex h-full w-[72px] cursor-pointer flex-col justify-center hover:bg-[#999999] ${
            proxyAddress.length ? "bg-white" : "bg-[#ABABAB]"
          } text-center`}
          onClick={() => {
            void onEnter();
          }}
        >
          Add
        </div>
      </div>
    </div>
  );
};
