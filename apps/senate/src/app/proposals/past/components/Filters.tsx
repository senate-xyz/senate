"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAccount, usePublicClient } from "wagmi";
import { useSession } from "next-auth/react";
import { LoadingFilters } from "../../components/LoadingFilters";

const endOptions: { name: string; time: number }[] = [
  {
    name: "Last 24 hours",
    time: 1,
  },
  {
    name: "Last 7 days",
    time: 7,
  },
  {
    name: "Last 30 days",
    time: 30,
  },
  {
    name: "Last 90 days",
    time: 90,
  },
  {
    name: "All time",
    time: 9999,
  },
];

const voteOptions: { id: string; name: string }[] = [
  {
    id: "any",
    name: "Any",
  },
  {
    id: "no",
    name: "Not voted on",
  },
  {
    id: "yes",
    name: "Voted on",
  },
];

export const Filters = (props: {
  subscriptions: { id: string; name: string }[];
  proxies: string[];
}) => {
  const session = useSession();
  const account = useAccount();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [from, setFrom] = useState(String(searchParams?.get("from") ?? "any"));
  const [end, setEnd] = useState(Number(searchParams?.get("end") ?? 9999));
  const [voted, setVoted] = useState(
    String(searchParams?.get("voted") ?? "any"),
  );
  const [proxy, setProxy] = useState(
    String(searchParams?.get("proxy") ?? "any"),
  );

  useEffect(() => {
    if (router && searchParams)
      if (
        searchParams.get("from") != from ||
        searchParams.get("end") != String(end) ||
        searchParams.get("voted") != voted ||
        searchParams.get("proxy") != proxy
      )
        router.push(
          `/proposals/past?from=${from}&end=${end}&voted=${voted}&proxy=${proxy}`,
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, end, voted, proxy]);

  return (
    <Suspense fallback={<LoadingFilters />}>
      <div className="mt-[16px] flex flex-col overflow-hidden">
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="flex h-[38px] w-full flex-row items-center lg:w-[300px]">
            <label
              className="flex h-full min-w-max items-center bg-black px-[12px] py-[9px] text-[15px] text-white"
              htmlFor="from"
            >
              From
            </label>
            <select
              className="h-full w-full text-black"
              id="from"
              onChange={(e) => {
                setFrom(e.target.value);
              }}
              value={from}
            >
              {session.status === "authenticated" && account.address ? (
                <>
                  <option key="any" value="any">
                    All Subscribed Organisations
                  </option>
                </>
              ) : (
                <>
                  <option key="any" value="any">
                    All Organisations
                  </option>
                </>
              )}
              {props.subscriptions
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((sub) => {
                  return (
                    <option
                      key={sub.name.toLowerCase().replace(" ", "")}
                      value={sub.name.toLowerCase().replace(" ", "")}
                    >
                      {sub.name}
                    </option>
                  );
                })}
            </select>
          </div>

          <div className="flex h-[38px] w-full flex-row items-center lg:w-[300px]">
            <label
              className="flex h-full min-w-max items-center bg-black px-[12px] py-[9px] text-[15px] text-white"
              htmlFor="end"
            >
              <div>Ended on</div>
            </label>
            <select
              className="h-full w-full text-black"
              id="end"
              onChange={(e) => {
                setEnd(Number(e.target.value));
              }}
              value={end}
            >
              {endOptions.map((endOption) => {
                return (
                  <option key={endOption.time} value={endOption.time}>
                    {endOption.name}
                  </option>
                );
              })}
            </select>
          </div>

          {session.status === "authenticated" && account.address && (
            <div className="flex h-[38px] w-full flex-row items-center lg:w-[300px]">
              <label
                className="flex h-full min-w-max items-center bg-black px-[12px] py-[9px] text-[15px] text-white"
                htmlFor="voted"
              >
                <div>With Vote Status of</div>
              </label>
              <select
                className="h-full w-full text-black"
                id="voted"
                onChange={(e) => {
                  setVoted(String(e.target.value));
                }}
                value={voted}
              >
                {voteOptions.map((voteOption) => {
                  return (
                    <option key={voteOption.id} value={voteOption.id}>
                      {voteOption.name}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {props.proxies.length > 1 && (
            <div className="flex h-[38px] w-full flex-row items-center lg:w-[300px]">
              <label
                className="flex h-full min-w-max items-center bg-black px-[12px] py-[9px] text-[15px] text-white"
                htmlFor="voted"
              >
                <div>And Showing Votes From</div>
              </label>
              <select
                className="h-full w-full text-black"
                id="voted"
                onChange={(e) => {
                  setProxy(String(e.target.value));
                }}
                value={proxy}
              >
                <option key="any" value="any">
                  Any
                </option>
                {props.proxies.map((proxy) => {
                  return <Proxy address={proxy} key={proxy} />;
                })}
              </select>
            </div>
          )}
        </div>
      </div>
    </Suspense>
  );
};

const Proxy = (props: { address: string }) => {
  const [name, setName] = useState(props.address);
  const provider = usePublicClient();

  useEffect(() => {
    void (async () => {
      const ens = await provider.getEnsName({
        address: props.address as `0x${string}`,
      });
      setName(ens ?? props.address);
    })();
  }, [props.address, provider]);

  return (
    <option key={props.address} value={props.address}>
      {name}
    </option>
  );
};
