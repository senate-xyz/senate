import Image from "next/image";
import dayjs, { extend } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

extend(relativeTime);

export const DesktopItem = (props: {
  proposal: {
    daoName: string;
    daoHandlerId: string;
    onchain: boolean;
    daoPicture: string;
    proposalTitle: string;
    state: string;
    proposalLink: string;
    timeEnd: Date;
  };
}) => {
  const loading = true;

  return (
    <div className="flex h-[96px] w-full flex-row justify-between bg-[#121212] text-[#EDEDED]">
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
                props.proposal.daoPicture
              }.svg`}
              alt={props.proposal.daoName}
            />
          </div>
          <div className="flex h-[64px] min-w-[150px] flex-col gap-2 pl-2">
            <div className="whitespace-nowrap text-[24px] font-light leading-[30px]">
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
        <div className="cursor-pointer hover:underline">
          <a
            href={props.proposal.proposalLink}
            target="_blank"
            rel="noreferrer"
          >
            <div className="pr-5 text-[18px] font-normal">
              {props.proposal.proposalTitle}
            </div>
          </a>
        </div>
      </div>

      <div className="flex flex-row items-center">
        <div className="flex w-[250px] flex-col justify-between gap-2">
          <div className="text-[21px] font-semibold leading-[26px]">
            {dayjs(props.proposal.timeEnd).fromNow()}
          </div>
          <div className="text-[15px] font-normal leading-[19px]">
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

        <div className="w-[200px] text-end">
          <div className="flex flex-col items-center">
            {props.proposal.proposalTitle == "not-connected" ? (
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
                {props.proposal.proposalTitle == "true" && (
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
                {props.proposal.proposalTitle == "false" && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
