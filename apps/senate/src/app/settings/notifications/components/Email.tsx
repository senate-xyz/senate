"use client";

import { useFeatureFlagEnabled } from "posthog-js/react";
import Image from "next/image";
import { useState, useTransition } from "react";
import {
  setBulletin,
  resendVerification,
  setEmailAndEnableBulletin,
  setQuorumAlerts,
  setEmptyEmails,
} from "../actions";

export const Email = (props: {
  isBulletinEnabled: boolean;
  email: string;
  verified: boolean;
  quorum: boolean;
  empty: boolean;
}) => {
  const [bulletinEnabled, setBulletinEnabled] = useState(
    props.isBulletinEnabled
  );
  const [, startTransition] = useTransition();

  return (
    <div className="flex max-w-[800px] flex-col gap-4 bg-black p-4">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-4">
          <Image
            src="/assets/Senate_Logo/settings_email_icon.svg"
            alt={""}
            width={24}
            height={24}
          />
          <div className="font-[18px] leading-[23px] text-white">
            Daily Bulletin Notifications
          </div>
        </div>
        <label className="relative inline-flex cursor-pointer items-center bg-gray-400 hover:bg-gray-500">
          <input
            type="checkbox"
            checked={bulletinEnabled}
            onChange={(e) => {
              setBulletinEnabled(e.target.checked);
              if (!e.target.checked) startTransition(() => setBulletin(false));
              if (e.target.checked && props.email)
                startTransition(() => setBulletin(true));
            }}
            className="peer sr-only"
          />
          <div className="peer h-6 w-11 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5  after:bg-black after:transition-all after:content-[''] peer-checked:bg-[#5EF413] peer-checked:after:translate-x-full peer-checked:hover:bg-[#7EF642]" />
        </label>
      </div>
      <div className="max-w-[610px] text-[15px] text-white">
        Receive a daily email at 8:00am UTC, providing updates on past, new, and
        soon-ending proposals from all the organisations you follow on Senate.
        This ensures you won&apos;t forget to vote.
      </div>
      {bulletinEnabled && (
        <Enabled
          email={props.email}
          verified={props.verified}
          quorum={props.quorum}
          empty={props.empty}
        />
      )}
    </div>
  );
};

const Enabled = (props: {
  email: string;
  verified: boolean;
  quorum: boolean;
  empty: boolean;
}) => {
  const [edit, setEdit] = useState(false);
  const [currentEmail, setCurrentEmail] = useState(props.email);
  const [resend, setResend] = useState(true);
  const [, startTransition] = useTransition();

  const extendedMenu = useFeatureFlagEnabled("email-extended-menu");

  return (
    <div className="flex flex-col gap-2">
      <div className="text-[18px] font-light text-white">Email Address</div>
      {!edit ? (
        <div className={`flex h-[46px] max-w-[382px] flex-col`}>
          <div className="text-[18px] font-light text-[#D9D9D9]">
            {props.email}
          </div>
          <div
            className="cursor-pointer text-[15px] font-light text-[#ABABAB] underline"
            onClick={() => {
              setEdit(true);
            }}
          >
            Change Email
          </div>
        </div>
      ) : (
        <div className={`flex h-[46px] max-w-[382px] flex-row items-center`}>
          <input
            className={`h-full w-full bg-[#D9D9D9] px-2 text-black focus:outline-none lg:w-[320px] `}
            value={currentEmail}
            onChange={(e) => {
              setCurrentEmail(String(e.target.value));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                startTransition(() => setEmailAndEnableBulletin(currentEmail));
                setEdit(false);
              }
            }}
          />

          <div
            className={`flex h-full w-[72px] cursor-pointer flex-col justify-center
                  bg-[#ABABAB] text-center hover:bg-[#999999]`}
            onClick={() => {
              startTransition(() => setEmailAndEnableBulletin(currentEmail));
              setEdit(false);
            }}
          >
            Save
          </div>
        </div>
      )}

      {props.email && !props.verified && (
        <div className="flex flex-row gap-2">
          <div className="text-[18px] font-light text-red-400">
            Email not verified yet.
          </div>
          {resend && (
            <div
              className="cursor-pointer text-[18px] font-light text-white underline active:text-[#D9D9D9]"
              onClick={() => {
                startTransition(() => resendVerification());
                setResend(false);
              }}
            >
              Resend verification email
            </div>
          )}
        </div>
      )}

      {extendedMenu && <EmptySettings empty={props.empty} />}
      <QuorumSetting quorum={props.quorum} />
    </div>
  );
};

const QuorumSetting = ({ quorum }: { quorum: boolean }) => {
  const [QA, setQA] = useState(quorum);
  const [, startTransition] = useTransition();
  return (
    <div className="flex max-w-[382px] flex-row items-center justify-between gap-4">
      <div className="font-[18px] leading-[23px] text-white">
        Get quorum alerts
      </div>
      <label className="relative inline-flex cursor-pointer items-center bg-gray-400 hover:bg-gray-500">
        <input
          type="checkbox"
          checked={QA}
          onChange={(e) => {
            startTransition(() => setQuorumAlerts(e.target.checked));
            setQA(e.target.checked);
          }}
          className="peer sr-only"
        />
        <div className="peer h-6 w-11 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5  after:bg-black after:transition-all after:content-[''] peer-checked:bg-[#5EF413] peer-checked:after:translate-x-full peer-checked:hover:bg-[#7EF642]" />
      </label>
    </div>
  );
};

const EmptySettings = ({ empty }: { empty: boolean }) => {
  const [EE, setEE] = useState(empty);
  const [, startTransition] = useTransition();
  return (
    <div className="flex max-w-[382px] flex-row items-center justify-between gap-4">
      <div className="font-[18px] leading-[23px] text-white">
        Get quorum alerts
      </div>
      <label className="relative inline-flex cursor-pointer items-center bg-gray-400 hover:bg-gray-500">
        <input
          type="checkbox"
          checked={EE}
          onChange={(e) => {
            startTransition(() => setEmptyEmails(e.target.checked));
            setEE(e.target.checked);
          }}
          className="peer sr-only"
        />
        <div className="peer h-6 w-11 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5  after:bg-black after:transition-all after:content-[''] peer-checked:bg-[#5EF413] peer-checked:after:translate-x-full peer-checked:hover:bg-[#7EF642]" />
      </label>
    </div>
  );
};