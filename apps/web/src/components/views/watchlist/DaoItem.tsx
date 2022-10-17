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
  const [showModal, setShowModal] = useState(false);
  const { data: session } = useSession();

  const [subscribed, setSubscribed] = useState(
    props.dao.subscriptions.length > 0 ? true : false
  );

  return (
    <div>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Modal Title</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                    Modal text
                  </p>
                  {subscribed ? (
                    <button
                      className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => props.handleUnsubscribe(props.dao.id)}
                    >
                      Unsubscribe
                    </button>
                  ) : (
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => props.handleSubscribe(props.dao.id)}
                    >
                      Subscribe
                    </button>
                  )}
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
      <button
        onClick={() => setShowModal(true)}
        type="button"
        className={`${
          subscribed
            ? "bg-emerald-500 text-white active:bg-emerald-500"
            : "bg-pink-400 text-white active:bg-pink-500"
        } font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
      >
        <div className="mt-4">
          <Image
            width="50"
            height="50"
            src={props.dao.picture}
            alt="dao Image"
          />
          {props.dao.handlers.map((handler, index: number) => {
            switch (handler.type) {
              case "BRAVO1":
              case "BRAVO2":
              case "MAKER_POLL":
              case "MAKER_PROPOSAL":
                return (
                  <Image
                    key={index}
                    width="25"
                    height="25"
                    src="https://assets.coingecko.com/coins/images/279/thumb/ethereum.png"
                    alt="dao Image"
                  />
                );

              case "SNAPSHOT":
                return (
                  <Image
                    key={index}
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
      </button>
    </div>
  );
};
