import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import Image from "next/image";
dayjs.extend(relativeTime);

export const DashboardRow = (props: { proposal }) => {
  return (
    <tr className="border-b">
      <td className="py-4 px-6">
        <div className="relative">
          <Image
            className="absolute bottom-0 left-0"
            src={props.proposal.dao.picture}
            width="40"
            height="40"
            alt="dao image"
          />
          <Image
            className="absolute bottom-0 left-0"
            width="20"
            height="20"
            alt="proposal type"
            src={
              props.proposal.proposalType == "SNAPSHOT"
                ? "https://avatars.githubusercontent.com/u/72904068?s=200&v=4"
                : "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png"
            }
          />
        </div>
      </td>
      <td className="py-4 px-6">
        <div>
          <a href={props.proposal.data["url"]}>
            <p>{props.proposal.name}</p>
          </a>
        </div>
      </td>

      <td className="py-4 px-6">
        {dayjs(props.proposal.data["timeEnd"]).fromNow(true)}
      </td>

      <td className="py-4 px-6">idk</td>
    </tr>
  );
};
