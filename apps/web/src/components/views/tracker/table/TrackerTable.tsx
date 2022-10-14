import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import Image from "next/image";

dayjs.extend(relativeTime);

import { PrismaJsonObject, TrackerProposalType } from "@senate/common-types";

const tableHeader = ["Proposal", "Description", "Time Ag", "Voted"];

export const TrackerTable = (props: { votes; selectedDao }) => {
  console.log(props);
  return (
    <div>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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

        {props.votes.data && (
          <tbody>
            {props.votes.data
              .filter((vote) => vote.dao.name === props.selectedDao)
              .map((proposal: TrackerProposalType) => {
                console.log(proposal.description);
                return (
                  <tr
                    key={proposal.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
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
