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
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
            <div className="relative my-6 mx-auto w-auto max-w-3xl">
              {/*content*/}
              <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between rounded-t border-b border-solid border-slate-200 p-5">
                  <h3 className="text-3xl font-semibold">Modal Title</h3>
                  <button
                    className="float-right ml-auto border-0 bg-transparent p-1 text-3xl font-semibold leading-none text-black opacity-5 outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="block h-6 w-6 bg-transparent text-2xl text-black opacity-5 outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative flex-auto p-6">
                  <p className="my-4 text-lg leading-relaxed text-slate-500">
                    Modal text
                  </p>
                  {subscribed ? (
                    <button
                      className="mr-1 mb-1 rounded bg-red-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-red-600"
                      type="button"
                      onClick={() => props.handleUnsubscribe(props.dao.id)}
                    >
                      Unsubscribe
                    </button>
                  ) : (
                    <button
                      className="mr-1 mb-1 rounded bg-emerald-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
                      type="button"
                      onClick={() => props.handleSubscribe(props.dao.id)}
                    >
                      Subscribe
                    </button>
                  )}
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end rounded-b border-t border-solid border-slate-200 p-6">
                  <button
                    className="background-transparent mr-1 mb-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
      ) : null}
      <button
        onClick={() => setShowModal(true)}
        type="button"
        className={`${
          subscribed
            ? "bg-emerald-500 text-white active:bg-emerald-500"
            : "bg-pink-400 text-white active:bg-pink-500"
        } mr-1 mb-1 rounded px-6 py-3 text-sm font-bold uppercase shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none`}
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
          <div className="mb-2 text-xl font-bold">{props.dao.name}</div>
        </div>
        <div className="px-2 pt-4 pb-2">
          <span className="mr-2 mb-2 inline-block rounded-full bg-gray-200 p-1 text-sm font-semibold text-gray-700">
            <FaDiscord />
          </span>
          <span className="mr-2 mb-2 inline-block rounded-full bg-gray-200 p-1 text-sm font-semibold text-gray-700">
            <FaSlack />
          </span>
          <span className="mr-2 mb-2 inline-block rounded-full bg-gray-200 p-1 text-sm font-semibold text-gray-700">
            <FaTelegram />
          </span>
          <span className="mr-2 mb-2 inline-block rounded-full bg-gray-200 p-1 text-sm font-semibold text-gray-700">
            <FaBell />
          </span>
        </div>
      </button>
    </div>
  );
};
