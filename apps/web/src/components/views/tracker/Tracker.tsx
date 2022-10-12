import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import { trpc } from "../../../utils/trpc";
import TrackerTable from "./table/TrackerTable";
import SharePopover from "./SharePopover";
import { DAOType } from "@senate/common-types";

export const TrackerView = (props: {
  address?: string;
  shareButton: boolean;
}) => {
  const [daos, setDaos] = useState<DAOType[]>([]);
  const [selectedDao, setSelectedDao] = useState<string>();

  const { data: session } = useSession();

  const votes = trpc.useQuery([
    "tracker.track",
    {
      address: props.address
        ? props.address
        : session?.user?.id ?? "0x000000000000000000000000000000000000dEaD",
    },
  ]);

  useEffect(() => {
    if (!votes.data) return;

    const daosTabs = votes.data
      .map((vote: { dao }) => vote.dao)
      .filter((element: { name }, index, array) => {
        return (
          array.findIndex((a: { name }) => a.name == element.name) === index
        );
      });
    setDaos(daosTabs);
  }, [votes]);

  useEffect(() => {
    if (daos[0]) setSelectedDao(daos[0].name);
  }, [daos]);

  return (
    <div>
      <div>
        <div>
          <p>Vote tracker</p>

          {props.shareButton && <SharePopover />}
        </div>

        {votes.isLoading && <div>Loading</div>}

        <div>
          <div>
            {daos.map((dao, index) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedDao(dao.name);
                  }}
                >
                  <img src={dao.picture} />

                  <p>{dao.name}</p>
                </div>
              );
            })}
          </div>

          <div>
            <div>
              <TrackerTable votes={votes} selectedDao={selectedDao} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackerView;
