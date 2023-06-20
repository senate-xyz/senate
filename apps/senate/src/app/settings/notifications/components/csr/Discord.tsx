"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { trpc } from "../../../../../server/trpcClient";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { useForceUpdate } from "framer-motion";

const Discord = () => {
  const [edit, setEdit] = useState(false);

  const [getDiscordNotifications, setDiscordNotifications] = useState(false);
  const [getDiscordReminders, setDiscordReminders] = useState(false);
  const [currentWebhook, setCurrentWebhook] = useState("");
  const [adminConfirmation, setAdminConfirmation] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const account = useAccount();
  const router = useRouter();
  const user = trpc.accountSettings.getUser.useQuery();
  const setDiscordWebhook =
    trpc.accountSettings.setDiscordWebhook.useMutation();

  useEffect(() => {
    setCurrentWebhook(String(user.data?.discordwebhook));
  }, [user.data]);

  useEffect(() => {
    if (!account.isConnected && router) router.push("/settings/account");
  }, [account]);

  useEffect(() => {
    if (user.data) {
      setDiscordNotifications(user.data.discordnotifications);
      setDiscordReminders(user.data.discordreminders);
    }
  }, [user.data]);

  const updateDiscordNotifications =
    trpc.accountSettings.updateDiscordNotifications.useMutation();

  // const updateDiscordReminders =
  //   trpc.accountSettings.updateDiscordReminders.useMutation();

  const onEnter = () => {
    setDiscordWebhook.mutate(
      { url: currentWebhook },
      {
        onSuccess: () => {
          setEdit(false);
        },
      }
    );
  };

  if (!user.data) return <></>;

  return (
    <div className="flex max-w-[800px] flex-col gap-4 bg-black p-4">
      <VideoModal show={showModal} />
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-4">
          <Image
            src="/assets/Senate_Logo/settings_discord_icon.svg"
            alt={""}
            width={24}
            height={24}
          ></Image>
          <div className="font-[18px] leading-[23px] text-white">
            Discord Notifications
          </div>
        </div>
        <label className="relative inline-flex cursor-pointer items-center bg-gray-400 hover:bg-gray-500">
          <input
            type="checkbox"
            checked={getDiscordNotifications}
            onChange={(e) => {
              updateDiscordNotifications.mutate({
                val: e.target.checked,
              });
            }}
            className="peer sr-only"
          />
          <div className="peer h-6 w-11 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5  after:bg-black after:transition-all after:content-[''] peer-checked:bg-[#5EF413] peer-checked:after:translate-x-full peer-checked:hover:bg-[#7EF642]" />
        </label>
      </div>

      <div className="max-w-[610px] text-[15px] text-white">
        Receive instant notifications in your Discord server about proposals
        from all DAOs you follow on Senate. This will help ensure that you and
        your team always remember to vote.
      </div>

      {getDiscordNotifications && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {!user.data.discordwebhook && !adminConfirmation ? (
              <div className="flex flex-col gap-2 text-white">
                Are you an admin in a Discord server?
                <div className="flex flex-row gap-8">
                  <div
                    className="flex h-[44px] w-[320px] cursor-pointer flex-col justify-center bg-white text-center text-black"
                    onClick={() => {
                      setAdminConfirmation(true);
                      setShowModal(true);
                    }}
                  >
                    Yes, I'm a Discord server admin!
                  </div>
                  <div
                    className="flex h-[44px] w-[120px] cursor-pointer flex-col justify-center bg-black text-center text-white underline"
                    onClick={() => {
                      updateDiscordNotifications.mutate({
                        val: false,
                      });
                    }}
                  >
                    No, I'm not.
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <div className="flex flex-row items-end gap-2">
                  <div className="text-[18px] font-light text-white">
                    Discord Webhook URL
                  </div>
                  {edit ? (
                    <>
                      <Link
                        className="cursor-pointer text-[15px] font-light text-[#D9D9D9] underline"
                        href={
                          "https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks"
                        }
                        target="_blank"
                      >
                        What is a Discord webhook
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
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                {edit || !user.data.discordwebhook ? (
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
                        if (e.key === "Enter") onEnter();
                      }}
                      placeholder="https://discord.com/webhook/"
                    />

                    <div
                      className={`flex h-full w-[72px] cursor-pointer flex-col justify-center ${
                        user.data.discordwebhook?.includes("https")
                          ? user.data.discordwebhook == currentWebhook
                            ? "bg-[#ABABAB] hover:bg-[#999999]"
                            : "bg-white hover:bg-[#e5e5e5]"
                          : currentWebhook.length
                          ? "bg-white hover:bg-[#e5e5e5]"
                          : "bg-[#ABABAB] hover:bg-[#999999]"
                      } text-center`}
                      onClick={() => onEnter()}
                    >
                      Save
                    </div>
                  </div>
                ) : (
                  <div className={`flex flex-col gap-1`}>
                    <div className="truncate text-[18px] font-light text-[#D9D9D9]">
                      {
                        currentWebhook.split("/")[
                          currentWebhook.split("/").length - 1
                        ]
                      }
                    </div>
                    <div
                      className="cursor-pointer text-[15px] font-light text-[#ABABAB] underline"
                      onClick={() => {
                        setEdit(true);
                      }}
                    >
                      Change Webhook
                    </div>
                  </div>
                )}
                {/* <div className="flex max-w-[382px] flex-row items-center justify-between gap-4">
                  <div className="font-[18px] leading-[23px] text-white">
                    Ending soon reminders
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center bg-gray-400 hover:bg-gray-500">
                    <input
                      type="checkbox"
                      checked={getDiscordReminders}
                      onChange={(e) => {
                        updateDiscordReminders.mutate({
                          val: e.target.checked,
                        });
                      }}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5  after:bg-black after:transition-all after:content-[''] peer-checked:bg-[#5EF413] peer-checked:after:translate-x-full peer-checked:hover:bg-[#7EF642]" />
                  </label>
                </div> */}
              </div>
            )}
          </div>
        </div>
      )}
      {setDiscordWebhook.error && (
        <div className="flex flex-col text-white">
          {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            JSON.parse(setDiscordWebhook.error.message).map((err: Error) => (
              // eslint-disable-next-line react/jsx-key
              <div>{err.message}</div>
            ))
          }
        </div>
      )}
    </div>
  );
};

function VideoModal(props: { show: boolean }) {
  let [isOpen, setIsOpen] = useState(props.show);

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

export default Discord;
