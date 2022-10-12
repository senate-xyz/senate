import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

dayjs.extend(relativeTime);

import { PrismaJsonObject, TrackerProposalType } from "@senate/common-types";

const tableHeader = ["Proposal", "Description", "Time Ag", "Voted"];

export const TrackerTable = (props: { votes; selectedDao }) => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            {tableHeader.map((column, index) => {
              return <th key={index}>{column}</th>;
            })}
          </tr>
        </thead>

        {props.votes.data && (
          <tbody>
            {props.votes.data
              .filter((vote) => vote.dao.name === props.selectedDao)
              .map((proposal: TrackerProposalType) => {
                return (
                  <tr key={proposal.id}>
                    <td>
                      <div>
                        <img src={proposal.dao.picture} />
                        <a
                          href={(proposal.data as PrismaJsonObject)[
                            "url"
                          ]?.toString()}
                        >
                          <p>{proposal.name}</p>
                        </a>
                      </div>
                    </td>
                    <td>
                      <p>{proposal.description}</p>
                    </td>
                    <td>
                      {dayjs(
                        (proposal.data as PrismaJsonObject)[
                          "timeEnd"
                        ]?.toString()
                      ).fromNow()}
                    </td>
                    <td>idk</td>
                  </tr>
                );
              })}
          </tbody>
        )}
      </table>
    </div>
  );
};

export default TrackerTable;
