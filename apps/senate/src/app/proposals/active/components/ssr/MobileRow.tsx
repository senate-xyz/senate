import Image from "next/image";
import dayjs, { extend } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

extend(relativeTime);

export const MobileRow = async (props: {
  proposal: {
    daoHandlerId: string;
    daoName: string;
    onchain: boolean;
    daoPicture: string;
    proposalTitle: string;
    state: string;
    proposalLink: string;
    timeEnd: Date;
  };
}) => {
  const loading = true;

  const daoPicture = await fetch(
    `${process.env.NEXT_PUBLIC_WEB_URL ?? ""}${props.proposal.daoPicture}.svg`
  )
    .then((res) => {
      if (res.ok)
        return `${process.env.NEXT_PUBLIC_WEB_URL ?? ""}${
          props.proposal.daoPicture
        }.svg`;
      else
        return `${
          process.env.NEXT_PUBLIC_WEB_URL ?? ""
        }/assets/Project_Icons/placeholder_medium.png.svg`;
    })
    .catch(() => {
      return `${
        process.env.NEXT_PUBLIC_WEB_URL ?? ""
      }/assets/Project_Icons/placeholder_medium.png.svg`;
    });

  return (
    <div className="my-1 flex w-full flex-col items-start bg-[#121212] text-[#EDEDED]">
      <div className="flex w-full flex-col gap-2 p-2">
        <div className="flex flex-row gap-2">
          <div className="flex flex-col items-center gap-2">
            <div className="w-[48px] border border-b-2 border-l-0 border-r-2 border-t-0">
              <Image
                loading="eager"
                priority={true}
                width={48}
                height={48}
                src={daoPicture}
                alt={props.proposal.daoName}
              />
            </div>

            <div>
              {props.proposal.onchain ? (
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
                  alt="off-chain"
                />
              )}
            </div>
          </div>
          <div className="cursor-pointer self-center pb-5 hover:underline">
            <a
              href={props.proposal.proposalLink}
              target="_blank"
              rel="noreferrer"
            >
              <div className="text-[15px] font-normal leading-[23px]">
                {props.proposal.proposalTitle}
              </div>
            </a>
          </div>
        </div>

        <div className="flex w-full flex-row items-end justify-between">
          <div className="flex flex-col justify-end">
            <div className="text-start text-[21px] font-semibold leading-[26px]">
              {dayjs(props.proposal.timeEnd).fromNow()}
            </div>
            <div className="text-[12px] font-normal leading-[19px]">
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

          <div className="self-end p-2">
            <div className="flex w-full flex-col items-center">
              {props.proposal.proposalLink == "not-connected" ? (
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
                  {props.proposal.proposalLink == "true" && (
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
                  {props.proposal.proposalLink == "false" && (
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
