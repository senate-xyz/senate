import { useState } from "react";

import { useSession } from "next-auth/react";
import { trpc } from "../../../utils/trpc";
import TrackerTable from "./table/TrackerTable";
import SharePopover from "./SharePopover";
import Image from "next/image";

export const TrackerHeader = (props: { shareButton: boolean }) => (
  <div>
    <p>Vote tracker</p>
    {props.shareButton && <SharePopover />}
  </div>
);

export const TrackerTab = (props: {
  daoName: string;
  daoPicture: string;
  setSelectedDao: any;
}) => (
  <button
    className="flex m-4 p-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
    onClick={() => {
      props.setSelectedDao(props.daoName);
    }}
  >
    <Image
      className="absolute bottom-0 left-0"
      src={props.daoPicture}
      width="25"
      height="25"
      alt="dao image"
    />

    <p>{props.daoName}</p>
  </button>
);

export const TrackerTabList = (props: { daosTabs; setSelectedDao }) => (
  <div className="flex">
    {props.daosTabs?.map((dao) => {
      return (
        <TrackerTab
          key={dao.name}
          daoName={dao.name}
          daoPicture={dao.picture}
          setSelectedDao={props.setSelectedDao}
        />
      );
    })}
  </div>
);

export const TrackerView = (props: {
  votes;
  daosTabs;
  shareButton;
  setSelectedDao;
  selectedDao;
}) => (
  <div>
    <TrackerHeader shareButton={props.shareButton} />
    <TrackerTabList
      daosTabs={props.daosTabs}
      setSelectedDao={props.setSelectedDao}
    />
    <TrackerTable votes={props.votes} selectedDao={props.selectedDao} />
  </div>
);

export const Tracker = (props: { address?: string; shareButton: boolean }) => {
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

  return (
    <TrackerView
      shareButton={props.shareButton}
      daosTabs={daosTabs}
      votes={votes}
      selectedDao={selectedDao}
      setSelectedDao={setSelectedDao}
    />
  );
};

export default Tracker;
