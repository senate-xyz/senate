"use client";

import { useEffect, useState } from "react";
import { trpc } from "../../../../../server/trpcClient";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import Image from "next/image";
import Link from "next/link";

const Telegram = () => {
  const [getTelegramNotifications, setTelegramNotifications] = useState(false);
  const [getTelegramReminders, setTelegramReminders] = useState(false);
  const [currentChatId, setCurrentChatId] = useState("");

  const account = useAccount();
  const router = useRouter();
  const user = trpc.accountSettings.getUser.useQuery();
  const setTelegramChatId =
    trpc.accountSettings.setTelegramChatId.useMutation();

  useEffect(() => {
    setCurrentChatId(String(user.data?.telegramchatid));
  }, [user.data]);

  useEffect(() => {
    if (!account.isConnected && router) router.push("/settings/account");
  }, [account, router]);

  useEffect(() => {
    if (user.data) {
      setTelegramNotifications(user.data.telegramnotifications);
      setTelegramReminders(user.data.telegramreminders);
    }
  }, [user.data]);

  const updateTelegramNotifications =
    trpc.accountSettings.updateTelegramNotifications.useMutation();

  const updateTelegramReminders =
    trpc.accountSettings.updateTelegramReminders.useMutation();

  const onEnter = () => {
    setTelegramChatId.mutate({ chatid: parseInt(currentChatId) });
  };

  return (
    <div className="flex max-w-[800px] flex-col gap-4 bg-black p-4">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-4">
          <Image
            src="/assets/Senate_Logo/settings_discord_icon.svg"
            alt={""}
            width={24}
            height={24}
          ></Image>
          <div className="font-[18px] leading-[23px] text-white">
            Telegram Notifications
          </div>
        </div>
        <label className="relative inline-flex cursor-pointer items-center bg-gray-400 hover:bg-gray-500">
          <input
            type="checkbox"
            checked={getTelegramNotifications}
            onChange={(e) => {
              updateTelegramNotifications.mutate({
                val: e.target.checked,
              });
            }}
            className="peer sr-only"
          />
          <div className="peer h-6 w-11 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5  after:bg-black after:transition-all after:content-[''] peer-checked:bg-[#5EF413] peer-checked:after:translate-x-full peer-checked:hover:bg-[#7EF642]" />
        </label>
      </div>

      <div className="max-w-[610px] text-[15px] text-white">
        Receive instant notifications in your Telegram group chat about
        proposals from all organisations you follow on Senate. This will help
        ensure that you and your team always remember to vote.
      </div>

      {getTelegramNotifications && (
        <div className="flex flex-col gap-4">
          <Link
            className="text-[18px] font-light text-white underline"
            href={"https://t.me/senatesecretarybot"}
            target="_blank"
          >
            Open a telegram chat
          </Link>

          <div className="flex flex-col gap-2">
            <div className="text-[18px] font-light text-white">
              Telegram ChatId
            </div>
            <div
              className={`flex h-[46px] max-w-[382px] flex-row items-center`}
            >
              <input
                className={`h-full w-full bg-[#D9D9D9] px-2 text-black focus:outline-none lg:w-[320px] `}
                value={currentChatId}
                onChange={(e) => {
                  setCurrentChatId(String(e.target.value));
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onEnter();
                }}
              />

              <div
                className={`flex h-full w-[72px] cursor-pointer flex-col justify-center  ${
                  user.data?.telegramchatid == currentChatId
                    ? "bg-[#ABABAB] hover:bg-[#999999]"
                    : "bg-white hover:bg-[#e5e5e5]"
                } text-center`}
                onClick={() => onEnter()}
              >
                Save
              </div>
            </div>
          </div>

          <div className="flex max-w-[382px] flex-row items-center justify-between gap-4">
            <div className="font-[18px] leading-[23px] text-white">
              Ending soon reminders
            </div>
            <label className="relative inline-flex cursor-pointer items-center bg-gray-400 hover:bg-gray-500">
              <input
                type="checkbox"
                checked={getTelegramReminders}
                onChange={(e) => {
                  updateTelegramReminders.mutate({
                    val: e.target.checked,
                  });
                }}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5  after:bg-black after:transition-all after:content-[''] peer-checked:bg-[#5EF413] peer-checked:after:translate-x-full peer-checked:hover:bg-[#7EF642]" />
            </label>
          </div>
        </div>
      )}
      {setTelegramChatId.error && (
        <div className="flex flex-col text-white">
          <div>{setTelegramChatId.error.message}</div>
        </div>
      )}
    </div>
  );
};

export default Telegram;
