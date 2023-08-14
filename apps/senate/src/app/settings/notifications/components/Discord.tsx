"use client";

import Image from "next/image";
import { Fragment, useEffect, useState, useTransition } from "react";
import {
  setDiscord,
  setDiscordIncludeVotes,
  setDiscordReminders,
  setWebhookAndEnableDiscord,
} from "../actions";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { PostHogFeature } from "posthog-js/react";

export const Discord = (props: {
  enabled: boolean;
  webhook: string;
  reminders: boolean;
  includeVotes: boolean;
}) => {
  const [discordEnabled, setDiscordEnabled] = useState(props.enabled);
  const [, startTransition] = useTransition();

  return (
    <PostHogFeature flag="discord-secretary" match={true}>
      <div className="flex max-w-[800px] flex-col gap-4 bg-black p-4">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-4">
            <Image
              src="/assets/Senate_Logo/settings_discord_icon.svg"
              alt={""}
              width={24}
              height={24}
            />
            <div className="font-[18px] leading-[23px] text-white">
              Discord Notifications
            </div>
          </div>
          <label className="relative inline-flex cursor-pointer items-center bg-gray-400 hover:bg-gray-500">
            <input
              type="checkbox"
              checked={discordEnabled}
              onChange={(e) => {
                setDiscordEnabled(e.target.checked);
                if (!e.target.checked) startTransition(() => setDiscord(false));
                if (e.target.checked) {
                  if (props.webhook) startTransition(() => setDiscord(true));
                }
              }}
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5  after:bg-black after:transition-all after:content-[''] peer-checked:bg-[#5EF413] peer-checked:after:translate-x-full peer-checked:hover:bg-[#7EF642]" />
          </label>
        </div>
        <div className="max-w-[610px] text-[15px] text-white">
          Receive instant notifications in your Discord server about proposals
          from all organisations you follow on Senate. This will help ensure
          that you and your team always remember to vote.
        </div>
        {discordEnabled && (
          <Enabled
            webhook={props.webhook}
            reminders={props.reminders}
            includeVotes={props.includeVotes}
            setDiscordEnabled={setDiscordEnabled}
          />
        )}
      </div>
    </PostHogFeature>
  );
};

const Enabled = (props: {
  webhook: string;
  reminders: boolean;
  includeVotes: boolean;
  setDiscordEnabled: (value: boolean) => void;
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(props.webhook ? true : false);
  const [edit, setEdit] = useState(false);
  const [, startTransition] = useTransition();
  const [currentWebhook, setCurrentWebhook] = useState(props.webhook);

  return (
    <div className="flex flex-col gap-2">
      <VideoModal show={showModal} />
      {isAdmin ? (
        <div className="flex flex-col gap-1">
          <div className="flex flex-row items-end gap-2">
            <div className="text-[18px] font-light text-white">
              Discord Webhook URL
            </div>
          </div>
          <div>
            {edit ? (
              <div className="flex flex-col gap-2">
                <div
                  className={`flex h-[46px] max-w-[382px] flex-row items-center`}
                >
                  <input
                    className={`h-full w-full bg-[#D9D9D9] px-2 text-black focus:outline-none lg:w-[320px] `}
                    value={currentWebhook}
                    onChange={(e) => {
                      setCurrentWebhook(String(e.target.value));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        startTransition(() =>
                          setWebhookAndEnableDiscord(currentWebhook),
                        );
                        setEdit(false);
                      }
                    }}
                    placeholder="https://discord.com/webhook/"
                  />

                  <div
                    className={`flex h-full w-[72px] cursor-pointer flex-col justify-center
                  bg-[#ABABAB] text-center hover:bg-[#999999]`}
                    onClick={() => {
                      startTransition(() =>
                        setWebhookAndEnableDiscord(currentWebhook),
                      );
                      setEdit(false);
                    }}
                  >
                    Save
                  </div>
                </div>
                <div>
                  <div className="flex flex-row gap-2">
                    <Link
                      className="cursor-pointer text-[15px] font-light text-[#D9D9D9] underline"
                      href={
                        "https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks"
                      }
                      target="_blank"
                    >
                      What is a Discord webhook?
                    </Link>
                    <div
                      className="cursor-pointer text-[15px] font-light text-[#D9D9D9] underline"
                      onClick={() => {
                        setShowModal(false);
                        setTimeout(() => {
                          setShowModal(true);
                        }, 100);
                      }}
                    >
                      How do I get a webhook URL?
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`flex flex-col gap-4`}>
                <div className={`flex flex-col gap-1`}>
                  <div className="truncate text-[18px] font-light text-[#D9D9D9]">
                    {
                      currentWebhook.split("/")[
                        currentWebhook.split("/").length - 1
                      ]
                    }
                  </div>
                  <div
                    className="w-fit cursor-pointer text-[15px] font-light text-[#ABABAB] underline"
                    onClick={() => {
                      setEdit(true);
                    }}
                  >
                    Change Webhook
                  </div>
                </div>
                <div className="flex flex-row gap-16">
                  <RemindersSetting endingSoon={props.reminders} />

                  <PostHogFeature flag="discord-extended-menu" match={true}>
                    <IncludeVotesSetting includeVotes={props.includeVotes} />
                  </PostHogFeature>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 text-white">
          Are you an admin in a Discord server?
          <div className="flex flex-row gap-8">
            <div
              className="flex h-[44px] w-[320px] cursor-pointer flex-col justify-center bg-white text-center text-black"
              onClick={() => {
                setIsAdmin(true);
                setShowModal(true);
                setEdit(true);
              }}
            >
              Yes, I&apos;m a Discord server admin!
            </div>
            <div
              className="flex h-[44px] w-[120px] cursor-pointer flex-col justify-center bg-black text-center text-white underline"
              onClick={() => {
                setIsAdmin(false);
                props.setDiscordEnabled(false);
              }}
            >
              No, I&apos;m not.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const RemindersSetting = ({ endingSoon }: { endingSoon: boolean }) => {
  const [rem, setRem] = useState(endingSoon);
  const [, startTransition] = useTransition();
  return (
    <div className="flex max-w-[382px] flex-row items-center justify-between gap-4">
      <div className="font-[18px] leading-[23px] text-white">
        Ending in 24 hours reminder
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

function VideoModal(props: { show: boolean }) {
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
                <Dialog.Panel className="align-middleshadow-xl w-full max-w-[1280px] transform overflow-hidden bg-black p-6 text-left transition-all">
                  <iframe
                    className="aspect-video w-full"
                    src="/assets/Discord/discord_webhooks_high.mp4"
                    allow="autoplay *; fullscreen *"
                    allowFullScreen
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
