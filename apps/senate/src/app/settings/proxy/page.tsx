"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { trpc } from "../../../server/trpcClient";

export default function Home() {
  const account = useAccount();
  const router = useRouter();
  const provider = usePublicClient();

  const voters = trpc.accountSettings.voters.useQuery();

  const addVoter = trpc.accountSettings.addVoter.useMutation();

  const [proxyAddress, setProxyAddress] = useState("");

  useEffect(() => {
    if (!account.isConnected) if (router) router.push("/settings/account");
  }, [account, router]);

  const onEnter = async () => {
    let resolvedAddress = proxyAddress;
    if (proxyAddress.includes(".eth")) {
      resolvedAddress = String(
        await provider.getEnsAddress({
          name: proxyAddress,
        })
      );
    }

    addVoter.mutate(
      { address: resolvedAddress },
      {
        onSuccess() {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          voters.refetch();
          setProxyAddress("");
        },
      }
    );
  };

  if (!voters.data) return <></>;

  return (
    <div className="flex min-h-screen flex-col gap-12">
      <div className="flex flex-col gap-4">
        <div className="text-[24px] font-light leading-[30px] text-white">
          Your Other Addresses
        </div>

        <div className="text-[18px] font-light leading-[23px] text-white lg:w-[50%]">
          Here you can add other addresses to your Senate account, so that you
          can see the voting activity for those addresses as well.
        </div>

        {voters.data.length > 0 ? (
          <div className="mt-12 flex flex-col gap-6">
            {voters.data.map((voter) => {
              return <Voter address={voter.address} key={voter.address} />;
            })}
          </div>
        ) : null}

        <div className="mt-12 flex h-[46px] flex-row items-center">
          <input
            className={`h-full w-full bg-[#D9D9D9] px-2 font-mono text-[18px] font-light leading-[23px] text-black lg:w-[480px]`}
            value={proxyAddress}
            onChange={(e) => setProxyAddress(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                onEnter();
            }}
            placeholder="Paste a new proxy address here (or ENS)"
          />

          <div
            className={`flex h-full w-[72px] cursor-pointer flex-col justify-center hover:bg-[#999999] ${
              proxyAddress.length ? "bg-white" : "bg-[#ABABAB]"
            } text-center`}
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              onEnter();
            }}
          >
            Add
          </div>
        </div>
        {addVoter.error && (
          <div className="flex flex-col text-white">
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
              JSON.parse(addVoter.error.message).map((err: Error) => (
                // eslint-disable-next-line react/jsx-key
                <div>{err.message}</div>
              ))
            }
          </div>
        )}

        {voters.error && (
          <div className="flex flex-col text-white">
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
              JSON.parse(voters.error.message).map((err: Error) => (
                // eslint-disable-next-line react/jsx-key
                <div>{err.message}</div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
}

const Voter = ({ address }: { address: string }) => {
  const provider = usePublicClient();
  const [voterEns, setVoterEns] = useState("");

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const ens = await provider.getEnsName({
        address: address as `0x${string}`,
      });

      setVoterEns(ens ?? "");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const removeVoter = trpc.accountSettings.removeVoter.useMutation();

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
          removeVoter.mutate({
            address: address,
          });
        }}
        className="text-[18px] font-light text-white underline"
      >
        Delete
      </button>
    </div>
  );
};
