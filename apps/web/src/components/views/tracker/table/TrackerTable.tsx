import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import Image from "next/image";

dayjs.extend(relativeTime);

import { PrismaJsonObject, TrackerProposalType } from "@senate/common-types";

const tableHeader = ["Proposal", "Description", "Time Ag", "Voted"];

export const TrackerThead = () => (
  <thead className="text-xs uppercase">
    <tr>
      {tableHeader.map((column, index) => {
        return (
          <th scope="col" className="py-3 px-6" key={index}>
            {column}
          </th>
        );
      })}
    </tr>
  </thead>
);

export const TrackerTable = (props: { votes; selectedDao }) => {
  return (
    <div>
      <table className="w-full text-left text-sm">
        <TrackerThead />
        {props.votes.data && (
          <tbody>
            {props.votes.data
              .filter((vote) => vote.dao.name === props.selectedDao)
              .map((proposal: TrackerProposalType) => {
                return (
                  <tr key={proposal.id} className="border-b">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <Image
                          className="absolute bottom-0 left-0"
                          src={proposal.dao.picture}
                          width="40"
                          height="40"
                          alt="dao image"
                        />

                        <a
                          href={(proposal.data as PrismaJsonObject)[
                            "url"
                          ]?.toString()}
                        >
                          <p>{proposal.name}</p>
                        </a>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p>{proposal.description}</p>
                    </td>
                    <td className="py-4 px-6">
                      {dayjs(
                        (proposal.data as PrismaJsonObject)[
                          "timeEnd"
                        ]?.toString()
                      ).fromNow()}
                    </td>
                    <td className="py-4 px-6">idk</td>
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
