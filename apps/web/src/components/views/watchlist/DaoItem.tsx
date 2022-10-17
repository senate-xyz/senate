import { DAOType } from "@senate/common-types";
import { FaDiscord, FaSlack, FaTelegram, FaBell } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";

export const DaoItem = (props: {
  dao: DAOType;
  handleSubscribe;
  handleUnsubscribe;
}) => {
  const { data: session } = useSession();

  const [subscribed, setSubscribed] = useState(
    props.dao.subscriptions.length > 0 ? true : false
  );

  return (
    <div className="max-w-xs rounded overflow-hidden shadow-md flex flex-col items-center">
      <div className="mt-4">
        <Image width="50" height="50" src={props.dao.picture} alt="dao Image" />
        {props.dao.handlers.map((handler, index: number) => {
          switch (handler.type) {
            case "BRAVO1":
            case "BRAVO2":
            case "MAKER_POLL":
            case "MAKER_PROPOSAL":
              return (
                <Image
                  width="25"
                  height="25"
                  src="https://assets.coingecko.com/coins/images/279/thumb/ethereum.png"
                  alt="dao Image"
                />
              );

            case "SNAPSHOT":
              return (
                <Image
                  width="25"
                  height="25"
                  src="https://avatars.githubusercontent.com/u/72904068?s=200&v=4"
                  alt="dao Image"
                />
              );
          }
        })}
      </div>

      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{props.dao.name}</div>
      </div>
      <div className="px-2 pt-4 pb-2">
        <span className="inline-block bg-gray-200 rounded-full px-1 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          <FaDiscord />
        </span>
        <span className="inline-block bg-gray-200 rounded-full px-1 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          <FaSlack />
        </span>
        <span className="inline-block bg-gray-200 rounded-full px-1 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          <FaTelegram />
        </span>
        <span className="inline-block bg-gray-200 rounded-full px-1 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          <FaBell />
        </span>
      </div>
    </div>
  );
};
