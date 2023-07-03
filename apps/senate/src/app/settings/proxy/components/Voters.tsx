"use client";

import { useEffect, useState, useTransition } from "react";
import { usePublicClient } from "wagmi";
import { Voter } from "./Voter";
import {
  addVoter,
  removeVoter,
  getVoters,
  type Voter as VoterType,
} from "../actions";

export const Voters = () => {
  const provider = usePublicClient();
  const [proxyAddress, setProxyAddress] = useState("");
  const [isPending, startTransition] = useTransition();
  const [voters, setVoters] = useState<Array<VoterType>>([]);

  const fetchVoters = async () => {
    const v = await getVoters();
    setVoters(v);
  };

  useEffect(() => {
    void fetchVoters();
  }, [isPending]);

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
      addVoter(resolvedAddress).then(() => {
        setProxyAddress("");
      })
    );
  };

  const remove = (address: string) => {
    startTransition(() => removeVoter(address).then(() => void fetchVoters()));
  };

  return (
    <div>
      {voters.length > 0 ? (
        <div className="mt-12 flex flex-col gap-6">
          {voters.map((voter) => {
            return (
              <Voter
                address={voter.address}
                key={voter.address}
                removeVoter={remove}
              />
            );
          })}
        </div>
      ) : null}

      <div className="mt-12 flex h-[46px] flex-row items-center">
        <input
          className={`h-full w-full bg-[#D9D9D9] px-2 font-mono text-[18px] font-light leading-[23px] text-black lg:w-[480px]`}
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
