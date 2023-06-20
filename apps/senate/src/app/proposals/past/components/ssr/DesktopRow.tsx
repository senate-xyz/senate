import { DAOHandlerType, ProposalState } from "@senate/database";
import { isUpToDate } from "./Table";
import Image from "next/image";

export const PastProposal = async (props: {
  proposal: {
    daoName: string;
    daoHandlerId: string;
    daoHandlerType: string;
    onchain: boolean;
    daoPicture: string;
    proposalTitle: string;
    state: string;
    proposalLink: string;
    timeEnd: Date;
    voted: string;
    highestScoreChoice: string;
    highestScore: number;
    scoresTotal: number;
    passedQuorum: boolean;
  };
}) => {
  const loading = !(await isUpToDate(props.proposal.daoHandlerId));
  const daoPicture = await fetch(
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    process.env.NEXT_PUBLIC_WEB_URL + props.proposal.daoPicture + ".svg"
  )
    .then((res) => {
      if (res.ok)
        return (
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          process.env.NEXT_PUBLIC_WEB_URL + props.proposal.daoPicture + ".svg"
        );
      else
        return (
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          process.env.NEXT_PUBLIC_WEB_URL +
          "/assets/Project_Icons/placeholder_medium.png"
        );
    })
    .catch(() => {
      return (
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        process.env.NEXT_PUBLIC_WEB_URL +
        "/assets/Project_Icons/placeholder_medium.png"
      );
    });

  return (
    <tr className="h-[96px] w-full items-center justify-evenly bg-[#121212] text-[#EDEDED] ">
      <td className="hidden lg:table-cell">
        <div className="m-[12px] flex w-max flex-row items-center gap-[8px]">
          <div className="border border-b-2 border-l-0 border-r-2 border-t-0">
            <Image
              loading="eager"
              priority={true}
              width={64}
              height={64}
              src={daoPicture}
              alt={props.proposal.daoName}
            />
          </div>
          <div className="flex flex-col gap-2 pl-2">
            <div className="text-[24px] font-light leading-[30px]">
              {props.proposal.daoName}
            </div>

            <div>
              {props.proposal.onchain ? (
                <Image
                  loading="eager"
                  priority={true}
                  width={94}
                  height={26}
                  src={"/assets/Icon/OnChainProposal.svg"}
                  alt="off-chain"
                />
              ) : (
                <Image
                  loading="eager"
                  priority={true}
                  width={94}
                  height={26}
                  src={"/assets/Icon/OffChainProposal.svg"}
                  alt="off-chain"
                />
              )}
            </div>
          </div>
        </div>
      </td>
      <td className="hidden cursor-pointer hover:underline lg:table-cell">
        <a href={props.proposal.proposalLink} target="_blank" rel="noreferrer">
          <div className="pr-5 text-[18px] font-normal">
            {props.proposal.proposalTitle}
          </div>
        </a>
      </td>
      <td className="hidden lg:table-cell">
        <div className="flex h-[96px] flex-col justify-center gap-1 py-2">
          {props.proposal.daoHandlerType == DAOHandlerType.MAKER_EXECUTIVE && (
            <div className="text-[21px] leading-[26px] text-white">
              <div className="mb-1 flex flex-row gap-2">
                {(props.proposal.state == ProposalState.EXECUTED ||
                  props.proposal.state == ProposalState.QUEUED) && (
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
                {props.proposal.state == ProposalState.EXPIRED && (
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
                {(props.proposal.scoresTotal / 1000000000000000000).toFixed(2)}{" "}
                MKR
              </div>
            </div>
          )}
          {props.proposal.daoHandlerType != DAOHandlerType.MAKER_EXECUTIVE &&
            props.proposal.highestScoreChoice != "undefined" &&
            props.proposal.state != "HIDDEN" &&
            props.proposal.passedQuorum && (
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
                    {props.proposal.highestScoreChoice}
                  </div>
                </div>
                <div className="mt-1 bg-[#262626]">
                  <div
                    style={{
                      width: `${(
                        (props.proposal.highestScore /
                          props.proposal.scoresTotal) *
                        100
                      ).toFixed(0)}%`,
                    }}
                    className={`h-full bg-[#EDEDED]`}
                  >
                    <div className="px-2 text-black">
                      {(
                        (props.proposal.highestScore /
                          props.proposal.scoresTotal) *
                        100
                      ).toFixed(2)}
                      %
                    </div>
                  </div>
                </div>
              </div>
            )}

          {props.proposal.daoHandlerType != DAOHandlerType.MAKER_EXECUTIVE &&
            props.proposal.highestScoreChoice != "undefined" &&
            props.proposal.state != "HIDDEN" &&
            !props.proposal.passedQuorum && (
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

          {props.proposal.state == "HIDDEN" && (
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

          {props.proposal.daoHandlerType != DAOHandlerType.MAKER_EXECUTIVE &&
            props.proposal.highestScoreChoice == "undefined" && (
              <div className="text-[17px] leading-[26px] text-white">
                Unable to fetch results data
              </div>
            )}

          <div className="text-[15px] leading-[19px]">
            {`on ${new Date(props.proposal.timeEnd).toLocaleDateString(
              "en-US",
              {
                month: "long",
                day: "numeric",
              }
            )} at ${new Date(props.proposal.timeEnd).toLocaleTimeString(
              "en-US",
              {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                timeZone: "UTC",
                hour12: false,
              }
            )} UTC
                    `}
          </div>
        </div>
      </td>
      <td className="hidden lg:table-cell">
        <div className="text-end">
          <div className="flex w-full flex-col items-center">
            {props.proposal.voted == "not-connected" ? (
              <div className="p-2 text-center text-[17px] leading-[26px] text-white">
                Connect wallet to see your vote status
              </div>
            ) : loading ? (
              <Image
                loading="eager"
                priority={true}
                src="/assets/Senate_Logo/Loading/senate-loading-onDark.svg"
                alt="loading"
                width={32}
                height={32}
              />
            ) : (
              <div>
                {props.proposal.voted == "true" && (
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
                {props.proposal.voted == "false" && (
                  <div className="flex w-full flex-col items-center">
                    <Image
                      loading="eager"
                      priority={true}
                      src="/assets/Icon/DidntVote.svg"
                      alt="voted"
                      width={32}
                      height={32}
                    />
                    <div className="text-[18px]">Didn’t Vote</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};
