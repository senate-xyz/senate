"use client";

import { trpc } from "../../../../../server/trpcClient";

const IsAaveUser = () => {
  const user = trpc.accountSettings.getUser.useQuery();

  const disableAaveUser = trpc.accountSettings.disableAaveUser.useMutation();

  if (user.data?.isaaveuser == "ENABLED")
    return (
      <div className="flex flex-col gap-2">
        <div className="text-[18px] font-light text-white">Aave magic user</div>

        <div className="flex flex-row items-center gap-4">
          <label className="relative inline-flex cursor-pointer items-center bg-gray-400">
            <input
              type="checkbox"
              checked={user.data?.isaaveuser == "ENABLED"}
              onChange={() => {
                disableAaveUser.mutate();
              }}
              className="peer sr-only"
            />
            <div className="bg-aave-gradient peer h-6 w-11 after:absolute after:left-[2px] after:top-[2px] after:h-5  after:w-5 after:bg-black after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-700" />
          </label>
        </div>
      </div>
    );
  else return <></>;
};

export default IsAaveUser;
