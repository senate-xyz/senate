"use client";

import { useEffect, useState, useTransition } from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useAccount } from "wagmi";
import { subscribe } from "../actions";
import { useCookies } from "react-cookie";

export const UnsubscribedDAO = (props: {
  daoId: string;
  daoName: string;
  daoPicture: string;
  bgColor: string;
  daoHandlers: string[];
}) => {
  const [imgSrc, setImgSrc] = useState(
    props.daoPicture
      ? props.daoPicture + "_medium.png"
      : "/assets/Project_Icons/placeholder_medium.png"
  );

  useEffect(() => {
    setImgSrc(
      props.daoPicture
        ? props.daoPicture + "_medium.png"
        : "/assets/Project_Icons/placeholder_medium.png"
    );
  }, [props.daoPicture]);

  const account = useAccount();
  const session = useSession();
  const { openConnectModal } = useConnectModal();

  const connectAndSubscribe = (id: string) => {
    setCookie("subscribe", id);
    openConnectModal && openConnectModal();
  };

  const [, setCookie] = useCookies(["subscribe"]);

  const [, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  return (
    <div
      data-testid={props.daoName}
      className={`h-[320px] w-[240px] ${
        loading ? "pointer-events-none animate-pulse opacity-25" : "opacity-100"
      }`}
    >
      <div
        style={{
          backgroundImage: `linear-gradient(45deg, ${props.bgColor}40 15%, ${props.bgColor}10)`,
          filter: "saturate(5)",
        }}
        className={`relative flex h-full w-full flex-col rounded text-sm font-bold text-white shadow`}
      >
        <div className="flex grow flex-col items-center justify-end px-6 pb-6">
          <Image
            loading="eager"
            priority={true}
            style={{
              filter: "saturate(0.2)",
            }}
            width="96"
            height="96"
            src={imgSrc}
            onError={() => {
              setImgSrc("/assets/Project_Icons/placeholder_medium.png");
            }}
            quality="100"
            alt="dao logo"
          />
          <div className="pt-6 text-center text-[36px] font-thin leading-8">
            {props.daoName}
          </div>
          <div className="flex flex-row gap-4 pt-6 opacity-50">
            {[
              ...(props.daoHandlers.includes("SNAPSHOT") ? ["SNAPSHOT"] : []),
              ...(props.daoHandlers.includes("MAKER_POLL")
                ? ["MAKER_POLL"]
                : []),
              ...(props.daoHandlers.includes("MAKER_POLL_ARBITRUM")
                ? ["MAKER_POLL_ARBITRUM"]
                : []),
              ...props.daoHandlers
                .filter(
                  (handler) =>
                    handler !== "SNAPSHOT" &&
                    handler !== "MAKER_POLL_ARBITRUM" &&
                    handler !== "MAKER_POLL"
                )
                .sort((a, b) => a.localeCompare(b)),
            ].map((handler, index: number) => {
              switch (handler) {
                case "SNAPSHOT":
                  return (
                    <Image
                      loading="eager"
                      priority={true}
                      key={index}
                      width="24"
                      height="24"
                      src="/assets/Chain/Snapshot/On_Dark.svg"
                      alt="snapshot proposals"
                    />
                  );
                case "MAKER_POLL_ARBITRUM":
                  return (
                    <Image
                      loading="eager"
                      priority={true}
                      key={index}
                      width="24"
                      height="24"
                      src="/assets/Chain/Arbitrum/On_Dark.svg"
                      alt="chain proposals"
                    />
                  );
                default:
                  return (
                    <Image
                      loading="eager"
                      priority={true}
                      key={index}
                      width="24"
                      height="24"
                      src="/assets/Chain/Ethereum/On_Dark.svg"
                      alt="chain proposals"
                    />
                  );
              }
            })}
          </div>
        </div>

        <button
          data-testid="subscribe-button"
          className="h-14 w-full bg-white text-xl font-bold text-black hover:bg-neutral-100 active:bg-neutral-300"
          onClick={() => {
            if (account.isConnected && session.status == "authenticated") {
              startTransition(() => subscribe(props.daoId));
              setLoading(true);
            } else connectAndSubscribe(props.daoId);
          }}
        >
          Subscribe
        </button>
      </div>
    </div>
  );
};
