import moment from "moment";
import { useSession } from "next-auth/react";
import Image from "next/future/image";
import { trpc } from "../../../utils/trpc";
import { TrackerProposalType } from "@senate/common-types";

export const Proposals = () => {
  const { data: session } = useSession();

  const proposals = trpc.useQuery([
    session ? "user.proposals" : "unrestricted.proposals",
  ]);

  return (
    <div>
      <div>
        <p>Proposals</p>

        {proposals.data && (
          <div>
            <table>
              <thead>
                <tr>
                  <th>DAO</th>
                  <th>Proposal</th>
                  <th>Time Left</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {proposals.data.map((proposal: TrackerProposalType) => {
                  return (
                    proposal.data && (
                      <tr key={proposal.id}>
                        <td>
                          <div></div>
                        </td>
                        <td>
                          <div>
                            <a
                              // @ts-ignore
                              href={proposal.data["url"]}
                            >
                              <p>{proposal.name}</p>
                            </a>
                          </div>
                        </td>

                        <td>
                          {
                            // @ts-ignore
                            moment(proposal.data["timeEnd"]).fromNow(true)
                          }
                        </td>

                        <td>idk</td>
                      </tr>
                    )
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Proposals;
