"use client";

import Image from "next/image";
import { Fragment, useEffect, useState, useTransition } from "react";
import {
  setDiscordIncludeVotes,
  setDiscordReminders,
  setTelegram,
} from "../actions";
import { PostHogFeature } from "posthog-js/react";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";

export const Telegram = (props: {
  userId: string;
  enabled: boolean;
  reminders: boolean;
  includeVotes: boolean;
  chatId: string;
  chatTitle: string;
}) => {
  const [telegramEnabled, setTelegramEnabled] = useState(props.enabled);
  const [, startTransition] = useTransition();

  return (
    <PostHogFeature flag="telegram-secretary" match={true}>
      <div className="flex max-w-[800px] flex-col gap-4 bg-black p-4">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-4">
            <Image
              src="/assets/Senate_Logo/settings_telegram_icon.svg"
              alt={""}
              width={24}
              height={24}
            />
            <div className="font-[18px] leading-[23px] text-white">
              Telegram Notifications
            </div>
          </div>
          <label className="relative inline-flex cursor-pointer items-center bg-gray-400 hover:bg-gray-500">
            <input
              type="checkbox"
              checked={telegramEnabled}
              onChange={(e) => {
                setTelegramEnabled(e.target.checked);
                if (!e.target.checked)
                  startTransition(() => setTelegram(false));
              }}
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5  after:bg-black after:transition-all after:content-[''] peer-checked:bg-[#5EF413] peer-checked:after:translate-x-full peer-checked:hover:bg-[#7EF642]" />
          </label>
        </div>
        <div className="max-w-[610px] text-[15px] text-white">
          Receive instant notifications on Telegram about proposals from all
          organisations you follow on Senate. This will help ensure that you and
          your team always remember to vote.
        </div>
        {telegramEnabled && (
          <Enabled
            userId={props.userId}
            enabled={props.enabled}
            reminders={props.reminders}
            includeVotes={props.includeVotes}
            chatId={props.chatId}
            chatTitle={props.chatTitle}
          />
        )}
      </div>
    </PostHogFeature>
  );
};

const Enabled = (props: {
  userId: string;
  enabled: boolean;
  reminders: boolean;
  includeVotes: boolean;
  chatId: string;
  chatTitle: string;
}) => {
  const [adminModal, setAdminModal] = useState(false);
  const [change, setChange] = useState(!props.enabled);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <div>
          <AdminModal
            show={adminModal}
            userId={props.userId}
            setAdminModal={setAdminModal}
          />
          <div className={`flex flex-col gap-4`}>
            {props.chatTitle.length > 0 && (
              <div className="flex flex-col text-white">
                {Number(props.chatId) > 0 ? (
                  <div>
                    Sending notifications to a private chat with @
                    {props.chatTitle}
                  </div>
                ) : (
                  <div>
                    Sending notifications to a group chat called{" "}
                    {props.chatTitle}
                  </div>
                )}
                {!change && (
                  <div
                    className="w-fit cursor-pointer text-[15px] font-light text-[#ABABAB] underline"
                    onClick={() => {
                      setChange(true);
                    }}
                  >
                    Change Telegram Notifications
                  </div>
                )}
              </div>
            )}

            {change && (
              <div className={`flex flex-row gap-4`}>
                <Link
                  className="flex h-[44px] w-[320px] cursor-pointer flex-col justify-center bg-white text-center text-black"
                  href={`https://t.me/senatesecretary${
                    process.env.NEXT_PUBLIC_WEB_URL?.includes("dev") ||
                    process.env.NEXT_PUBLIC_WEB_URL?.includes("127") ||
                    process.env.NEXT_PUBLIC_WEB_URL?.includes("localhost")
                      ? "dev"
                      : process.env.NEXT_PUBLIC_WEB_URL?.includes("staging")
                      ? "staging"
                      : ""
                  }bot?start=${props.userId}_dm`}
                  target="_blank"
                >
                  Get notifications in a Private Chat
                </Link>

                <div
                  className="flex h-[44px] w-[320px] cursor-pointer flex-col justify-center bg-white text-center text-black"
                  onClick={() => {
                    setAdminModal(true);
                  }}
                >
                  Get notifications in a Group Chat
                </div>
              </div>
            )}
            {props.enabled && (
              <div className={`flex flex-row gap-16`}>
                <RemindersSetting endingSoon={props.reminders} />

                <PostHogFeature flag="telegram-extended-menu" match={true}>
                  <IncludeVotesSetting includeVotes={props.includeVotes} />
                </PostHogFeature>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const RemindersSetting = ({ endingSoon }: { endingSoon: boolean }) => {
  const [rem, setRem] = useState(endingSoon);
  const [, startTransition] = useTransition();
  return (
    <div className="flex max-w-[382px] flex-row items-center justify-between gap-4">
      <div className="font-[18px] leading-[23px] text-white">
        Ending soon reminders
      </div>
      <label className="relative inline-flex cursor-pointer items-center bg-gray-400 hover:bg-gray-500">
        <input
          type="checkbox"
          checked={rem}
          onChange={(e) => {
            startTransition(() => setDiscordReminders(e.target.checked));
            setRem(e.target.checked);
          }}
          className="peer sr-only"
        />
        <div className="peer h-6 w-11 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5  after:bg-black after:transition-all after:content-[''] peer-checked:bg-[#5EF413] peer-checked:after:translate-x-full peer-checked:hover:bg-[#7EF642]" />
      </label>
    </div>
  );
};

const IncludeVotesSetting = ({ includeVotes }: { includeVotes: boolean }) => {
  const [IV, setIV] = useState(includeVotes);
  const [, startTransition] = useTransition();
  return (
    <div className="flex max-w-[382px] flex-row items-center justify-between gap-4">
      <div className="font-[18px] leading-[23px] text-white">
        Show my vote status
      </div>
      <label className="relative inline-flex cursor-pointer items-center bg-gray-400 hover:bg-gray-500">
        <input
          type="checkbox"
          checked={IV}
          onChange={(e) => {
            startTransition(() => setDiscordIncludeVotes(e.target.checked));
            setIV(e.target.checked);
          }}
          className="peer sr-only"
        />
        <div className="peer h-6 w-11 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5  after:bg-black after:transition-all after:content-[''] peer-checked:bg-[#5EF413] peer-checked:after:translate-x-full peer-checked:hover:bg-[#7EF642]" />
      </label>
    </div>
  );
};

function AdminModal(props: {
  show: boolean;
  userId: string;
  setAdminModal: (value: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(props.show);

  useEffect(() => {
    setIsOpen(props.show);
  }, [props.show]);

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={closeModal}>
          <div className="op fixed inset-0 overflow-y-auto bg-[#1e1b207e]">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="align-middleshadow-xl w-full max-w-[500px] transform overflow-hidden bg-black p-8 text-left transition-all">
                  <div className="flex flex-col p-2 gap-12 items-center">
                    <div className="text-white">
                      Are you an admin in a Telegram group chat?
                    </div>

                    <div className="flex flex-col gap-2">
                      <Link
                        className="flex h-[44px] w-[320px] cursor-pointer flex-col justify-center bg-white text-center text-black"
                        href={`https://t.me/senatesecretary${
                          process.env.NEXT_PUBLIC_WEB_URL?.includes("dev") ||
                          process.env.NEXT_PUBLIC_WEB_URL?.includes("127") ||
                          process.env.NEXT_PUBLIC_WEB_URL?.includes("localhost")
                            ? "dev"
                            : process.env.NEXT_PUBLIC_WEB_URL?.includes(
                                "staging",
                              )
                            ? "staging"
                            : ""
                        }bot?startgroup=${props.userId}_group`}
                        target="_blank"
                        onClick={() => {
                          props.setAdminModal(false);
                        }}
                      >
                        Yes, I&apos;m a Telegram group chat admin!
                      </Link>

                      <div
                        className="flex h-[44px] cursor-pointer flex-col justify-center underline text-center text-white"
                        onClick={() => {
                          props.setAdminModal(false);
                        }}
                      >
                        No, I&apos;m not.
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
