"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import {
  setDiscord,
  setDiscordIncludeVotes,
  setDiscordReminders,
} from "../actions";
import Link from "next/link";
import { PostHogFeature } from "posthog-js/react";

export const Discord = (props: {
  enabled: boolean;
  webhook: string;
  reminders: boolean;
  includeVotes: boolean;
  userId: string;
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
            userId={props.userId}
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
  userId: string;
}) => {
  const [isAdmin, setIsAdmin] = useState(props.webhook ? true : false);

  const discordUrl = process.env.NEXT_PUBLIC_WEB_URL?.includes("localhost")
    ? `https://discord.com/api/oauth2/authorize?client_id=1143964929645363210&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fdiscord%2Fcallback&response_type=code&scope=webhook.incoming&state=${props.userId}`
    : process.env.NEXT_PUBLIC_WEB_URL?.includes("dev")
    ? `https://discord.com/api/oauth2/authorize?client_id=1143964929645363210&redirect_uri=https%3A%2F%2Fdev.senatelabs.xyz%2Fapi%2Fdiscord%2Fcallback&response_type=code&scope=webhook.incoming&state=${props.userId}`
    : process.env.NEXT_PUBLIC_WEB_URL?.includes("staging")
    ? `https://discord.com/api/oauth2/authorize?client_id=1143964929645363210&redirect_uri=https%3A%2F%2Fstaging.senatelabs.xyz%2Fapi%2Fdiscord%2Fcallback&response_type=code&scope=webhook.incoming&state=${props.userId}`
    : `https://discord.com/api/oauth2/authorize?client_id=1143964929645363210&redirect_uri=https%3A%2F%2Fwww.senatelabs.xyz%2Fapi%2Fdiscord%2Fcallback&response_type=code&scope=webhook.incoming&state=${props.userId}`;

  return (
    <div className="flex flex-col gap-2">
      {isAdmin ? (
        <div className="flex flex-col gap-1">
          <div className="flex flex-row items-end gap-2">
            <div className="text-[18px] font-light text-white">
              Discord Webhook URL
            </div>
          </div>
          <div>
            <div className={`flex flex-col gap-4`}>
              <div className={`flex flex-col gap-1`}>
                <div className="truncate text-[18px] font-light text-[#D9D9D9]">
                  {
                    props.webhook.split("/")[
                      props.webhook.split("/").length - 1
                    ]
                  }
                </div>
                <Link
                  className="w-fit cursor-pointer text-[15px] font-light text-[#ABABAB] underline"
                  href={discordUrl}
                >
                  Change Webhook
                </Link>
              </div>
              <div className="flex flex-row gap-16">
                <IncludeVotesSetting includeVotes={props.includeVotes} />
                <RemindersSetting endingSoon={props.reminders} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 text-white">
          Are you an admin in a Discord server?
          <div className="flex flex-row gap-8">
            <Link
              className="flex h-[44px] w-[320px] cursor-pointer flex-col justify-center bg-white text-center text-black"
              href={discordUrl}
            >
              Yes, I&apos;m a Discord server admin!
            </Link>
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
