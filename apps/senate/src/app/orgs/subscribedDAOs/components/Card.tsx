"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { unsubscribe } from "../actions";

export const SubscribedDAO = (props: {
  daoId: string;
  daoName: string;
  daoPicture: string;
  bgColor: string;
  daoHandlers: string[];
  activeProposals: number;
}) => {
  const [imgSrc, setImgSrc] = useState(
    props.daoPicture
      ? props.daoPicture + "_medium.png"
      : "/assets/Project_Icons/placeholder_medium.png",
  );

  useEffect(() => {
    setImgSrc(
      props.daoPicture
        ? props.daoPicture + "_medium.png"
        : "/assets/Project_Icons/placeholder_medium.png",
    );
  }, [props.daoPicture]);

  const [showMenu, setShowMenu] = useState(false);

  const [, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  return (
    <li
      data-testid={props.daoName}
      className={`h-[320px] w-[240px] ${
        loading ? "pointer-events-none animate-pulse opacity-25" : "opacity-100"
      }`}
    >
      {showMenu ? (
        <div
          className={`relative flex h-full w-full flex-col rounded bg-black text-sm font-bold text-white shadow`}
        >
          <div className="flex h-full flex-col justify-between">
            <div className="flex w-full flex-row items-start justify-between px-4 pt-4">
              <div className="justify-center  text-center text-[21px] font-semibold leading-8">
                {props.daoName}
              </div>
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowMenu(false);
                }}
              >
                <Image
                  loading="eager"
                  priority={true}
                  width="32"
                  height="32"
                  src="/assets/Icon/Close.svg"
                  alt="close button"
                />
              </div>
            </div>
            <div className="flex h-full flex-col gap-4 px-4 pt-4">
              <div className="text-[15px] font-thin leading-[19px]">
                You are currently subscribed to follow the off-chain and onchain
                proposals of {props.daoName}.
              </div>
              <div className="text-[15px] font-thin leading-[19px]">
                You are also getting daily updates on these proposals on your
                email.
              </div>
              <div className="text-[15px] font-thin leading-[19px]">
                Do you wish to unsubscribe from {props.daoName}?
              </div>
            </div>

            <div
              data-testid="unsubscribe-button"
              className="w-full cursor-pointer px-4 pb-4 text-center text-[15px] font-thin text-white underline"
              onClick={() => {
                startTransition(() => unsubscribe(props.daoId));
                setLoading(true);
              }}
            >
              Unsubscribe from {props.daoName}
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            backgroundImage: `linear-gradient(45deg, ${props.bgColor}40 15%, ${props.bgColor}10)`,
            filter: "saturate(5)",
          }}
          className="relative flex h-full w-full flex-col rounded text-sm font-bold text-white shadow"
        >
          <div className="absolute flex w-full flex-col items-end pr-4 pt-4">
            <div
              data-testid="menu-button"
              className="cursor-pointer"
              onClick={() => {
                setShowMenu(true);
              }}
            >
              <Image
                loading="eager"
                priority={true}
                width="32"
                height="32"
                src="/assets/Icon/Menu.svg"
                alt="menu button"
              />
            </div>
          </div>
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
                      handler !== "MAKER_POLL",
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
                  case "ARBITRUM_CORE_CHAIN":
                  case "ARBITRUM_TREASURY_CHAIN":
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
                  case "OPTIMISM_CHAIN":
                    return (
                      <Image
                        loading="eager"
                        priority={true}
                        key={index}
                        width="24"
                        height="24"
                        src="/assets/Chain/Optimism/On_Dark.svg"
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
            <div
              className={
                props.activeProposals
                  ? "cursor-pointer pb-1 pt-6 text-[15px] font-thin text-white text-opacity-80 underline decoration-from-font underline-offset-2 hover:text-opacity-100"
                  : "pb-1 pt-6 text-[15px] font-thin text-white text-opacity-80"
              }
            >
              {props.activeProposals ? (
                <Link
                  href={`/proposals/active?from=${props.daoName.toLowerCase()}`}
                >
                  {`${props.activeProposals} Active Proposals`}
                </Link>
              ) : (
                "No Active Proposals"
              )}
            </div>
          </div>
        </div>
      )}
    </li>
  );
};
