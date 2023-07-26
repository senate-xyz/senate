"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import {
  setDiscordIncludeVotes,
  setDiscordReminders,
  setTelegram,
} from "../actions";
import { PostHogFeature } from "posthog-js/react";
import Link from "next/link";

export const Telegram = (props: {
  userId: string;
  enabled: boolean;
  reminders: boolean;
  includeVotes: boolean;
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
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <div>
          <div className={`flex flex-col gap-4`}>
            <div className={`flex flex-row gap-1`}>
              <Link
                className="flex h-[44px] w-[240px] cursor-pointer flex-col justify-center bg-white text-center text-black"
                href={`https://t.me/senatesecretary${
                  process.env.NEXT_PUBLIC_WEB_URL?.includes("dev") ||
                  process.env.NEXT_PUBLIC_WEB_URL?.includes("127") ||
                  process.env.NEXT_PUBLIC_WEB_URL?.includes("localhost")
                    ? "dev"
                    : process.env.NEXT_PUBLIC_WEB_URL?.includes("staging")
                    ? "staging"
                    : ""
                }bot?start=${props.userId}`}
                target="_blank"
              >
                Start a chat
              </Link>

              <Link
                className="flex h-[44px] w-[240px] cursor-pointer flex-col justify-center bg-white text-center text-black"
                href={`https://t.me/senatesecretary${
                  process.env.NEXT_PUBLIC_WEB_URL?.includes("dev") ||
                  process.env.NEXT_PUBLIC_WEB_URL?.includes("127") ||
                  process.env.NEXT_PUBLIC_WEB_URL?.includes("localhost")
                    ? "dev"
                    : process.env.NEXT_PUBLIC_WEB_URL?.includes("staging")
                    ? "staging"
                    : ""
                }bot?startgroup=${props.userId}`}
                target="_blank"
              >
                Start a group chat
              </Link>
            </div>
            {props.enabled && (
              <div className={`flex flex-col gap-2`}>
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
      <div className="font-[18px] leading-[23px] text-white">Include votes</div>
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
