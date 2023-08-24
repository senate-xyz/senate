"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import {
  setSlack,
  setSlackIncludeVotes,
  setSlackReminders,
  setWebhookAndEnableSlack,
} from "../actions";
import Link from "next/link";
import { PostHogFeature } from "posthog-js/react";

export const Slack = (props: {
  enabled: boolean;
  webhook: string;
  reminders: boolean;
  includeVotes: boolean;
  userId: string;
  channelName: string;
}) => {
  const [slackEnabled, setSlackEnabled] = useState(props.enabled);
  const [, startTransition] = useTransition();

  return (
    <PostHogFeature flag="slack-secretary" match={true}>
      <div className="flex max-w-[800px] flex-col gap-4 bg-black p-4">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-4">
            <Image
              src="/assets/Senate_Logo/settings_slack_icon.svg"
              alt={""}
              width={24}
              height={24}
            />
            <div className="font-[18px] leading-[23px] text-white">
              Slack Notifications
            </div>
          </div>
          <label className="relative inline-flex cursor-pointer items-center bg-gray-400 hover:bg-gray-500">
            <input
              type="checkbox"
              checked={slackEnabled}
              onChange={(e) => {
                setSlackEnabled(e.target.checked);
                if (!e.target.checked) startTransition(() => setSlack(false));
                if (e.target.checked) {
                  if (props.webhook) startTransition(() => setSlack(true));
                }
              }}
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5  after:bg-black after:transition-all after:content-[''] peer-checked:bg-[#5EF413] peer-checked:after:translate-x-full peer-checked:hover:bg-[#7EF642]" />
          </label>
        </div>
        <div className="max-w-[610px] text-[15px] text-white">
          Receive instant notifications in your Slack server about proposals
          from all organisations you follow on Senate. This will help ensure
          that you and your team always remember to vote.
        </div>
        {slackEnabled && (
          <Enabled
            webhook={props.webhook}
            reminders={props.reminders}
            includeVotes={props.includeVotes}
            setSlackEnabled={setSlackEnabled}
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
  setSlackEnabled: (value: boolean) => void;
  userId: string;
}) => {
  const [isAdmin, setIsAdmin] = useState(props.webhook ? true : false);
  const [edit, setEdit] = useState(false);
  const [, startTransition] = useTransition();
  const [currentWebhook, setCurrentWebhook] = useState(props.webhook);

  const slackUrl = `https://slack.com/oauth/v2/authorize?client_id=5703914501122.5797273172388&scope=incoming-webhook&redirect_uri=${process.env.NEXT_PUBLIC_WEB_URL?.replace(
    "http://",
    "https://",
  ).replace("3000", "3001")}/api/slack/callback&state=${props.userId}`;
  return (
    <div className="flex flex-col gap-2">
      {isAdmin ? (
        <div className="flex flex-col gap-1">
          <div className="flex flex-row items-end gap-2">
            <div className="text-[18px] font-light text-white">
              Slack Webhook URL
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
                          setWebhookAndEnableSlack(currentWebhook),
                        );
                        setEdit(false);
                      }
                    }}
                    placeholder="https://slack.com/webhook/"
                  />

                  <div
                    className={`flex h-full w-[72px] cursor-pointer flex-col justify-center
                  bg-[#ABABAB] text-center hover:bg-[#999999]`}
                    onClick={() => {
                      startTransition(() =>
                        setWebhookAndEnableSlack(currentWebhook),
                      );
                      setEdit(false);
                    }}
                  >
                    Save
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
                  <Link
                    className="w-fit cursor-pointer text-[15px] font-light text-[#ABABAB] underline"
                    href={slackUrl}
                  >
                    Change Webhook
                  </Link>
                </div>
                <div className="flex flex-row gap-16">
                  <IncludeVotesSetting includeVotes={props.includeVotes} />
                  <RemindersSetting endingSoon={props.reminders} />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 text-white">
          Are you an admin in a Slack server?
          <div className="flex flex-row gap-8">
            <Link
              className="flex h-[44px] w-[320px] cursor-pointer flex-col justify-center bg-white text-center text-black"
              href={slackUrl}
            >
              Yes, I&apos;m a Slack server admin!
            </Link>
            <div
              className="flex h-[44px] w-[120px] cursor-pointer flex-col justify-center bg-black text-center text-white underline"
              onClick={() => {
                setIsAdmin(false);
                props.setSlackEnabled(false);
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
            startTransition(() => setSlackReminders(e.target.checked));
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
            startTransition(() => setSlackIncludeVotes(e.target.checked));
            setIV(e.target.checked);
          }}
          className="peer sr-only"
        />
        <div className="peer h-6 w-11 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5  after:bg-black after:transition-all after:content-[''] peer-checked:bg-[#5EF413] peer-checked:after:translate-x-full peer-checked:hover:bg-[#7EF642]" />
      </label>
    </div>
  );
};
