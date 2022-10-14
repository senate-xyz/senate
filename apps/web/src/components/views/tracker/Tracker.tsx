import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import { trpc } from "../../../utils/trpc";
import TrackerTable from "./table/TrackerTable";
import SharePopover from "./SharePopover";
import Image from "next/image";

export const TrackerView = (props: {
  address?: string;
  shareButton: boolean;
}) => {
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

  const daosTabs = votes.data
    ?.map((vote: { dao }) => vote.dao)
    .filter((element: { name }, index, array) => {
      return array.findIndex((a: { name }) => a.name == element.name) === index;
    });

  useEffect(() => {
    if (daosTabs) if (daosTabs[0]) setSelectedDao(daosTabs[0].name);
  }, []);

  return (
    <div>
      <div>
        <div>
          <p>Vote tracker</p>
          {props.shareButton && <SharePopover />}
        </div>

        {votes.isLoading && <div>Loading</div>}

        <div>
          <div className="flex">
            {daosTabs?.map((dao, index) => {
              return (
                <button
                  className="flex m-4 p-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
                  key={index}
                  onClick={() => {
                    setSelectedDao(dao.name);
                  }}
                >
                  <Image
                    className="absolute bottom-0 left-0"
                    src={dao.picture}
                    width="25"
                    height="25"
                    alt="dao image"
                  />

                  <p>{dao.name}</p>
                </button>
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
