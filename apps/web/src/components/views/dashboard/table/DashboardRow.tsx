import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
dayjs.extend(relativeTime);

export const DashboardRow = (props: { proposal }) => {
  return (
    <tr>
      <td>
        <div>
          <img src={props.proposal.dao.picture}>
            <img
              src={
                props.proposal.proposalType == "SNAPSHOT"
                  ? "https://avatars.githubusercontent.com/u/72904068?s=200&v=4"
                  : "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png"
              }
            ></img>
          </img>
          {/* {!isMobile && <Text>{props.proposal.dao.name}</Text>} */}
        </div>
      </td>
      <td>
        <div>
          <a href={props.proposal.data["url"]}>
            <p>{props.proposal.name}</p>
          </a>
        </div>
      </td>

      <td>{dayjs(props.proposal.data["timeEnd"]).fromNow(true)}</td>

      <td>idk</td>
    </tr>
  );
};

export default DashboardRow;
