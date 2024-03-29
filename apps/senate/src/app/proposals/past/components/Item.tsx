"use client";

import Image from "next/image";
import { extend } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { Suspense, useEffect, useState } from "react";
import { type fetchItemsType } from "../../actions";
import { useAccount } from "wagmi";

extend(relativeTime);

export default function Item(props: {
  item: fetchItemsType[0];
  proxy: string;
}) {
  const [highestScore, setHighestScore] = useState(0.0);
  const [highestScoreChoice, setHighestScoreChoice] = useState("");
  const [passedQuorum, setPassedQuorum] = useState(false);
  const { isConnected } = useAccount();

  useEffect(() => {
    let highestScore = 0.0;
    let highestScoreIndex = 0;
    let highestScoreChoice = "";
    if (
      props.item.proposal.scores &&
      typeof props.item.proposal.scores === "object" &&
      Array.isArray(props.item.proposal?.scores) &&
      props.item.proposal.choices &&
      typeof props.item.proposal.choices === "object" &&
      Array.isArray(props.item.proposal?.choices)
    ) {
      const scores = props.item.proposal.scores;
      for (let i = 0; i < scores.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        if (parseFloat(String(scores[i]?.toString())) > highestScore) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
          highestScore = parseFloat(String(scores[i]?.toString()));
          highestScoreIndex = i;
        }
      }
      highestScoreChoice = String(
        props.item.proposal.choices[highestScoreIndex],
      );
    }
    setHighestScoreChoice(String(highestScoreChoice));
    setHighestScore(highestScore);
    setPassedQuorum(
      Number(props.item.proposal!.scorestotal) >=
        Number(props.item.proposal!.quorum) &&
        Number(props.item.proposal!.scorestotal) > 0,
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.item, props.proxy]);

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
                src={`${process.env.NEXT_PUBLIC_WEB_URL ?? ""}/${
                  props.item.dao!.picture
                }.svg`}
                alt={props.item.dao!.name}
              />
            </div>
            <div className="flex h-[70px] min-w-[150px] flex-col justify-between gap-1 pl-2">
              <div className="text-[24px] font-light leading-[22px]">
                {props.item.dao!.name}
              </div>

              <div>
                <div
                  className={`w-[87px] h-[26px] flex items-center justify-center gap-1 leading-[19px] ${
                    props.item.daohandler?.type == "SNAPSHOT"
                      ? "bg-[#262626]"
                      : "bg-[#D9D9D9]"
                  } ${
                    props.item.daohandler?.type == "SNAPSHOT"
                      ? "text-[#ABABAB]"
                      : "text-[#262626]"
                  } text-[15px]`}
                >
                  {props.item.daohandler?.type == "SNAPSHOT" ? (
                    <Image
                      loading="eager"
                      priority={true}
                      width={16}
                      height={16}
                      src={"/assets/Icon/Chains/snapshot.svg"}
                      alt="off-chain"
                    />
                  ) : props.item.daohandler?.type == "ARBITRUM_CORE_CHAIN" ||
                    props.item.daohandler?.type == "ARBITRUM_TREASURY_CHAIN" ? (
                    <Image
                      loading="eager"
                      priority={true}
                      width={16}
                      height={16}
                      src={"/assets/Icon/Chains/arbitrum.svg"}
                      alt="off-chain"
                    />
                  ) : props.item.daohandler?.type == "OPTIMISM_CHAIN" ? (
                    <Image
                      loading="eager"
                      priority={true}
                      width={16}
                      height={16}
                      src={"/assets/Icon/Chains/optimism.svg"}
                      alt="off-chain"
                    />
                  ) : (
                    <Image
                      loading="eager"
                      priority={true}
                      width={16}
                      height={16}
                      src={"/assets/Icon/Chains/ethereum.svg"}
                      alt="off-chain"
                    />
                  )}
                  <div>
                    {props.item.daohandler?.type == "SNAPSHOT"
                      ? "offchain"
                      : "onchain"}
                  </div>
                </div>
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
            {props.item.daohandler?.type == "MAKER_EXECUTIVE" && (
              <div className="text-[21px] leading-[26px] text-white">
                <div className="mb-1 flex flex-row gap-2">
                  {(props.item.proposal!.state == "EXECUTED" ||
                    props.item.proposal!.state == "QUEUED") && (
                    <div className="flex flex-row gap-2">
                      <div className="h-[24px] w-[24px] items-center justify-center bg-[#D9D9D9]">
                        <Image
                          loading="eager"
                          priority={true}
                          width={22}
                          height={22}
                          src={"/assets/Icon/Check.svg"}
                          alt="off-chain"
                        />
                      </div>

                      <div>Passed</div>
                    </div>
                  )}
                  {props.item.proposal!.state == "EXPIRED" && (
                    <div className="flex flex-row gap-2">
                      <div className="h-[24px] w-[24px] items-center justify-center bg-[#D9D9D9]">
                        <Image
                          loading="eager"
                          priority={true}
                          width={22}
                          height={22}
                          src={"/assets/Icon/NoCheck.svg"}
                          alt="off-chain"
                        />
                      </div>

                      <div>Did not pass</div>
                    </div>
                  )}
                </div>
                <div className="text-[18px] leading-[26px] text-white">
                  with{" "}
                  {(
                    (props.item.proposal!.scorestotal as number) /
                    1000000000000000000
                  ).toFixed(2)}{" "}
                  MKR
                </div>
              </div>
            )}
            {props.item.daohandler?.type != "MAKER_EXECUTIVE" &&
              highestScoreChoice != "undefined" &&
              props.item.proposal!.state != "HIDDEN" &&
              passedQuorum && (
                <div className="w-[340px]">
                  <div className="flex flex-row gap-2">
                    <div className="flex h-[24px] w-[24px] items-center justify-center bg-[#D9D9D9]">
                      <Image
                        loading="eager"
                        priority={true}
                        width={22}
                        height={22}
                        src={"/assets/Icon/Check.svg"}
                        alt="off-chain"
                      />
                    </div>
                    <div className="truncate text-[21px] leading-[26px] text-white">
                      {highestScoreChoice}
                    </div>
                  </div>
                  {!(
                    props.item.daohandler!.type == "OPTIMISM_CHAIN" &&
                    highestScoreChoice.includes("Options")
                  ) && (
                    <div className="mt-1 bg-[#262626]">
                      <div
                        style={{
                          width: `${(
                            (highestScore /
                              (props.item.proposal!.scorestotal as number)) *
                            100
                          ).toFixed(0)}%`,
                        }}
                        className={`h-full bg-[#EDEDED]`}
                      >
                        <div className="px-2 text-black">
                          {(
                            (highestScore /
                              (props.item.proposal!.scorestotal as number)) *
                            100
                          ).toFixed(2)}
                          %
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

            {props.item.daohandler?.type != "MAKER_EXECUTIVE" &&
              highestScoreChoice != "undefined" &&
              props.item.proposal!.state != "HIDDEN" &&
              !passedQuorum && (
                <div>
                  <div className="flex flex-row gap-2">
                    <div className="flex h-[24px] w-[24px] items-center justify-center bg-[#D9D9D9]">
                      <Image
                        loading="eager"
                        priority={true}
                        width={22}
                        height={22}
                        src={"/assets/Icon/NoCheck.svg"}
                        alt="off-chain"
                      />
                    </div>
                    <div className="text-[21px] leading-[26px] text-white">
                      No Quorum
                    </div>
                  </div>
                </div>
              )}

            {props.item.proposal!.state == "HIDDEN" && (
              <div>
                <div className="flex flex-row gap-2">
                  <div className="flex h-[24px] w-[24px] items-center justify-center bg-[#D9D9D9]">
                    <Image
                      loading="eager"
                      priority={true}
                      width={22}
                      height={22}
                      src={"/assets/Icon/Hidden.svg"}
                      alt="off-chain"
                    />
                  </div>

                  <div className="text-[21px] leading-[26px] text-white">
                    Hidden results
                  </div>
                </div>
                <div className="mt-1 w-[340px] bg-[#262626]">
                  <div
                    style={{
                      width: "100%",
                    }}
                    className={`h-full bg-[#EDEDED]`}
                  >
                    <div className="px-2 text-black">??</div>
                  </div>
                </div>
              </div>
            )}

            {props.item.daohandler?.type != "MAKER_EXECUTIVE" &&
              highestScoreChoice == "undefined" && (
                <div className="text-[17px] leading-[26px] text-white">
                  Unable to fetch results data
                </div>
              )}
            <div className="text-[15px] font-normal leading-[19px]">
              {`on ${new Date(props.item.proposal!.timeend).toLocaleDateString(
                "en-US",
                {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
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
              <div className="w-[68px] border border-b-2 border-l-0 border-r-2 border-t-0">
                <Image
                  loading="eager"
                  priority={true}
                  width={68}
                  height={68}
                  src={`${process.env.NEXT_PUBLIC_WEB_URL ?? ""}/${
                    props.item.dao!.picture
                  }.svg`}
                  alt={props.item.dao!.name}
                />
              </div>

              <div>
                <div
                  className={`w-[68px] h-[20px] flex items-center justify-center gap-1 leading-[19px] ${
                    props.item.daohandler?.type == "SNAPSHOT"
                      ? "bg-[#262626]"
                      : "bg-[#D9D9D9]"
                  } ${
                    props.item.daohandler?.type == "SNAPSHOT"
                      ? "text-[#ABABAB]"
                      : "text-[#262626]"
                  } text-[12px]`}
                >
                  {props.item.daohandler?.type == "SNAPSHOT" ? (
                    <Image
                      loading="eager"
                      priority={true}
                      width={12}
                      height={12}
                      src={"/assets/Icon/Chains/snapshot.svg"}
                      alt="off-chain"
                    />
                  ) : props.item.daohandler?.type == "ARBITRUM_CORE_CHAIN" ||
                    props.item.daohandler?.type == "ARBITRUM_TREASURY_CHAIN" ? (
                    <Image
                      loading="eager"
                      priority={true}
                      width={12}
                      height={12}
                      src={"/assets/Icon/Chains/arbitrum.svg"}
                      alt="off-chain"
                    />
                  ) : props.item.daohandler?.type == "OPTIMISM_CHAIN" ? (
                    <Image
                      loading="eager"
                      priority={true}
                      width={12}
                      height={12}
                      src={"/assets/Icon/Chains/optimism.svg"}
                      alt="off-chain"
                    />
                  ) : (
                    <Image
                      loading="eager"
                      priority={true}
                      width={12}
                      height={12}
                      src={"/assets/Icon/Chains/ethereum.svg"}
                      alt="off-chain"
                    />
                  )}
                  <div>
                    {props.item.daohandler?.type == "SNAPSHOT"
                      ? "offchain"
                      : "onchain"}
                  </div>
                </div>
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
              {props.item.daohandler?.type == "MAKER_EXECUTIVE" && (
                <div>
                  <div className="text-[21px] leading-[26px] text-white">
                    {(props.item.proposal!.state == "EXECUTED" ||
                      props.item.proposal!.state == "QUEUED") && (
                      <div className="flex flex-row gap-2">
                        <div className="h-[24px] w-[24px] items-center justify-center bg-[#D9D9D9]">
                          <Image
                            loading="eager"
                            priority={true}
                            width={22}
                            height={22}
                            src={"/assets/Icon/Check.svg"}
                            alt="off-chain"
                          />
                        </div>

                        <div>Passed</div>
                      </div>
                    )}
                    {props.item.proposal!.state == "EXPIRED" && (
                      <div className="flex flex-row gap-2">
                        <div className="h-[24px] w-[24px] items-center justify-center bg-[#D9D9D9]">
                          <Image
                            loading="eager"
                            priority={true}
                            width={22}
                            height={22}
                            src={"/assets/Icon/NoCheck.svg"}
                            alt="off-chain"
                          />
                        </div>

                        <div>Did not pass</div>
                      </div>
                    )}
                  </div>
                  <div className="text-[18px] leading-[26px] text-white">
                    with{" "}
                    {(
                      (props.item.proposal!.scorestotal as number) /
                      1000000000000000000
                    ).toFixed(2)}{" "}
                    MKR
                  </div>
                </div>
              )}
              {props.item.daohandler?.type != "MAKER_EXECUTIVE" &&
                props.item.proposal!.state != "HIDDEN" &&
                highestScoreChoice != "undefined" && (
                  <div>
                    {passedQuorum ? (
                      <div>
                        <div className="flex flex-row gap-2">
                          <div className="flex h-[24px] w-[24px] items-center justify-center bg-[#D9D9D9]">
                            <Image
                              loading="eager"
                              priority={true}
                              width={22}
                              height={22}
                              src={"/assets/Icon/Check.svg"}
                              alt="off-chain"
                            />
                          </div>
                          <div className="w-[30vw] truncate text-[21px] leading-[26px] text-white">
                            {highestScoreChoice}
                          </div>
                        </div>
                        <div className="mt-1 w-[50vw] bg-[#262626]">
                          <div
                            style={{
                              width: `${(
                                (highestScore /
                                  (props.item.proposal!
                                    .scorestotal as number)) *
                                100
                              ).toFixed(0)}%`,
                            }}
                            className={`h-full bg-[#EDEDED]`}
                          >
                            <div className="px-2 text-black">
                              {(
                                (highestScore /
                                  (props.item.proposal!
                                    .scorestotal as number)) *
                                100
                              ).toFixed(2)}
                              %
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-row gap-2">
                        <div className="flex h-[24px] w-[24px] items-center justify-center bg-[#D9D9D9]">
                          <Image
                            loading="eager"
                            priority={true}
                            width={22}
                            height={22}
                            src={"/assets/Icon/NoCheck.svg"}
                            alt="off-chain"
                          />
                        </div>
                        <div className="text-[21px] leading-[26px] text-white">
                          No Quorum
                        </div>
                      </div>
                    )}
                  </div>
                )}

              {props.item.proposal!.state == "HIDDEN" && (
                <div>
                  <div className="flex flex-row gap-2">
                    <div className="flex h-[24px] w-[24px] items-center justify-center bg-[#D9D9D9] ">
                      <Image
                        loading="eager"
                        priority={true}
                        width={22}
                        height={22}
                        src={"/assets/Icon/Hidden.svg"}
                        alt="off-chain"
                      />
                    </div>

                    <div className="text-[21px] leading-[26px] text-white">
                      Hidden Results
                    </div>
                  </div>
                  <div className="mt-1 w-[50vw] bg-[#262626]">
                    <div
                      style={{
                        width: "100%",
                      }}
                      className={`h-full bg-[#EDEDED]`}
                    >
                      <div className="px-2 text-black">??</div>
                    </div>
                  </div>
                </div>
              )}

              {props.item.daohandler?.type != "MAKER_EXECUTIVE" &&
                highestScoreChoice == "undefined" && (
                  <div className="text-[17px] leading-[26px] text-white">
                    Unable to fetch results data
                  </div>
                )}
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
      </div>
    </div>
  );
}
