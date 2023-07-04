"use client";

import { useState, useTransition } from "react";
import { setAaveMagicUser, setUniswapMagicUser } from "../actions";

export const MagicUser = (props: { aave: boolean; uniswap: boolean }) => {
  return (
    <div className="flex max-w-[800px] flex-col gap-4 bg-black p-4">
      <IsAaveUser enabled={props.aave} />
      <IsUniswapUser enabled={props.uniswap} />
    </div>
  );
};

const IsUniswapUser = ({ enabled }: { enabled: boolean }) => {
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [, startTransition] = useTransition();

  return (
    <div className="flex flex-row justify-between">
      <div className="text-[18px] font-light text-white">
        Uniswap magic user
      </div>

      <div className="flex flex-row items-center">
        <label className="relative inline-flex cursor-pointer items-center bg-gray-400">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => {
              setIsEnabled(e.target.checked);
              startTransition(() => setUniswapMagicUser(e.target.checked));
            }}
            className="peer sr-only"
          />
          <div className="bg-uniswap-gradient peer h-6 w-11 after:absolute after:left-[2px] after:top-[2px] after:h-5  after:w-5 after:bg-black after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-700" />
        </label>
      </div>
    </div>
  );
};

const IsAaveUser = ({ enabled }: { enabled: boolean }) => {
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [, startTransition] = useTransition();

  return (
    <div className="flex flex-row justify-between">
      <div className="text-[18px] font-light text-white">Aave magic user</div>

      <div className="flex flex-row items-center">
        <label className="relative inline-flex cursor-pointer items-center bg-gray-400">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => {
              setIsEnabled(e.target.checked);
              startTransition(() => setAaveMagicUser(e.target.checked));
            }}
            className="peer sr-only"
          />
          <div className="bg-aave-gradient peer h-6 w-11 after:absolute after:left-[2px] after:top-[2px] after:h-5  after:w-5 after:bg-black after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-700" />
        </label>
      </div>
    </div>
  );
};
