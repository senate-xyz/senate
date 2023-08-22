"use client";

import Image from "next/image";
import dayjs, { extend } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Suspense } from "react";
import { type fetchItemsType } from "../../actions";
import { useAccount } from "wagmi";

extend(relativeTime);

export default function Item(props: {
  item: fetchItemsType[0];
  proxy: string;
}) {
  const { isConnected } = useAccount();

  return (
    <div>
      <div className="hidden h-[96px] w-full flex-row justify-between bg-[#121212] text-[#EDEDED] lg:flex">
        <div className="flex flex-row items-center">
          <div className="m-[12px] flex w-[220px] flex-row items-center gap-[8px]">
            <div className=" border border-b-2 border-l-0 border-r-2 border-t-0">
              <Image
                className="min-w-[64px]"
                loading="eager"
                priority={true}
                width={64}
                height={64}
                src={`${process.env.NEXT_PUBLIC_WEB_URL ?? ""}${
                  props.item.dao!.picture
                }.svg`}
                alt={props.item.dao!.name}
              />
            </div>
            <div className="flex h-[70px] min-w-[150px] flex-col justify-between gap-1 pl-2">
              <div className="text-[24px] font-light leading-[22px]">
                {props.item.dao?.name}
              </div>

              <div>
                {props.item.daohandler!.type == "SNAPSHOT" ? (
                  <Image
                    loading="eager"
                    priority={true}
                    width={94}
                    height={26}
                    src={"/assets/Icon/OffChainProposal.svg"}
                    alt="off-chain"
                  />
                ) : (
                  <Image
                    loading="eager"
                    priority={true}
                    width={94}
                    height={26}
                    src={"/assets/Icon/OnChainProposal.svg"}
                    alt="on-chain"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="cursor-pointer hover:underline">
            <a href={props.item.proposal!.url} target="_blank" rel="noreferrer">
              <div className="pr-5 text-[18px] font-normal">
                {props.item.proposal!.name.length > 150
                  ? props.item.proposal!.name.slice(0, 149) + "..."
                  : props.item.proposal!.name}
              </div>
            </a>
          </div>
        </div>

        <div className="flex flex-row items-center">
          <div className="flex w-[340px] flex-col justify-between gap-2">
            <div className="text-[21px] font-semibold leading-[26px]">
              {dayjs(props.item.proposal!.timeend).fromNow()}
            </div>
            <div className="text-[15px] font-normal leading-[19px]">
              {`on ${new Date(props.item.proposal!.timeend).toLocaleDateString(
                "en-US",
                {
                  month: "long",
                  day: "numeric",
                },
              )} at ${new Date(props.item.proposal!.timeend).toLocaleTimeString(
                "en-US",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  timeZone: "UTC",
                  hour12: false,
                },
              )} UTC
                    `}
            </div>
          </div>

          <div className="w-[200px] text-end">
            <Suspense>
              <div className="flex flex-col items-center">
                {!isConnected && (
                  <div className="p-2 text-center text-[17px] leading-[26px] text-white">
                    Connect wallet to see your vote status
                  </div>
                )}

                {!props.item.uptodate && (
                  <Image
                    loading="eager"
                    priority={true}
                    src="/assets/Senate_Logo/Loading/senate-loading-onDark.svg"
                    alt="loading"
                    width={32}
                    height={32}
                  />
                )}

                {props.item.uptodate &&
                  isConnected &&
                  props.item.votes!.length > 0 && (
                    <div className="flex w-full flex-col items-center">
                      <Image
                        loading="eager"
                        priority={true}
                        src="/assets/Icon/Voted.svg"
                        alt="voted"
                        width={32}
                        height={32}
                      />
                      <div className="text-[18px]">Voted</div>
                    </div>
                  )}

                {props.item.uptodate &&
                  isConnected &&
                  props.item.votes!.length == 0 && (
                    <div className="flex w-full flex-col items-center">
                      <Image
                        loading="eager"
                        priority={true}
                        src="/assets/Icon/NotVotedYet.svg"
                        alt="voted"
                        width={32}
                        height={32}
                      />
                      <div className="text-[18px]">Not Voted Yet</div>
                    </div>
                  )}
              </div>
            </Suspense>
          </div>
        </div>
      </div>

      <div className="my-1 flex w-full flex-col items-start bg-[#121212] text-[#EDEDED] lg:hidden">
        <div className="flex w-full flex-col gap-2 p-2">
          <div className="flex flex-row gap-2">
            <div className="flex flex-col items-center gap-2">
              <div className="w-[48px] border border-b-2 border-l-0 border-r-2 border-t-0">
                <Image
                  loading="eager"
                  priority={true}
                  width={48}
                  height={48}
                  src={`${process.env.NEXT_PUBLIC_WEB_URL ?? ""}${
                    props.item.dao!.picture
                  }.svg`}
                  alt={props.item.dao!.name}
                />
              </div>

              <div>
                {props.item.daohandler!.type == "SNAPSHOT" ? (
                  <Image
                    loading="eager"
                    priority={true}
                    width={50}
                    height={15}
                    src={"/assets/Icon/OnChainProposal.svg"}
                    alt="off-chain"
                  />
                ) : (
                  <Image
                    loading="eager"
                    priority={true}
                    width={50}
                    height={14}
                    src={"/assets/Icon/OffChainProposal.svg"}
                    alt="on-chain"
                  />
                )}
              </div>
            </div>
            <div className="cursor-pointer self-center pb-5 hover:underline">
              <a
                href={props.item.proposal!.url}
                target="_blank"
                rel="noreferrer"
              >
                <div className="text-[15px] font-normal leading-[23px]">
                  {props.item.proposal!.name.length > 150
                    ? props.item.proposal!.name.slice(0, 149) + "..."
                    : props.item.proposal!.name}
                </div>
              </a>
            </div>
          </div>

          <div className="flex w-full flex-row items-end justify-between">
            <div className="flex flex-col justify-end">
              <div className="text-start text-[21px] font-semibold leading-[26px]">
                {dayjs(props.item.proposal!.timeend).fromNow()}
              </div>
              <div className="text-[12px] font-normal leading-[19px]">
                {`on ${new Date(
                  props.item.proposal!.timeend,
                ).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })} at ${new Date(
                  props.item.proposal!.timeend,
                ).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  timeZone: "UTC",
                  hour12: false,
                })} UTC
                    `}
              </div>
            </div>

            <div className="self-end p-2">
              <Suspense>
                <div className="flex w-full flex-col items-center">
                  {!isConnected && (
                    <div className="p-2 text-center text-[17px] leading-[26px] text-white">
                      Connect wallet to see your vote status
                    </div>
                  )}

                  {!props.item.uptodate && (
                    <Image
                      loading="eager"
                      priority={true}
                      src="/assets/Senate_Logo/Loading/senate-loading-onDark.svg"
                      alt="loading"
                      width={32}
                      height={32}
                    />
                  )}

                  {props.item.uptodate &&
                    isConnected &&
                    props.item.votes!.length > 0 && (
                      <div className="flex w-full flex-col items-center">
                        <Image
                          loading="eager"
                          priority={true}
                          src="/assets/Icon/Voted.svg"
                          alt="voted"
                          width={32}
                          height={32}
                        />
                      </div>
                    )}

                  {props.item.uptodate &&
                    isConnected &&
                    props.item.votes!.length == 0 && (
                      <div className="flex w-full flex-col items-center">
                        <Image
                          loading="eager"
                          priority={true}
                          src="/assets/Icon/NotVotedYet.svg"
                          alt="voted"
                          width={32}
                          height={32}
                        />
                      </div>
                    )}
                </div>
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
