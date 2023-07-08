"use client";

import {
  deleteUser,
  randomQA,
  lastQA,
  aaveQA,
  uniswapQA,
  deleteNotifs,
  sendBulletin,
} from "../actions";
import { PostHogFeature } from "posthog-js/react";

const Testing = () => {
  return (
    <PostHogFeature flag="testing-menu" match={true}>
      <div className="flex max-w-[400px] flex-col gap-2 border border-red-400 p-2">
        <div className="font-bold text-white">Testing stuff</div>
        <div />
        <div />
        <div
          className="w-max cursor-pointer bg-red-400 p-2 text-white active:bg-red-500"
          onClick={() => {
            void deleteUser();
          }}
        >
          Delete my own user!
        </div>
        <div />
        <div />
        <div className="text-white">Can take up to one minute</div>
        <div
          className="w-max cursor-pointer bg-red-400 p-2 text-white active:bg-red-500"
          onClick={() => {
            void randomQA();
          }}
        >
          Send random quorum alert
        </div>
        <div
          className="w-max cursor-pointer bg-red-400 p-2 text-white active:bg-red-500"
          onClick={() => {
            void lastQA();
          }}
        >
          Send last proposal quorum alert
        </div>
        <div
          className="w-max cursor-pointer bg-red-400 p-2 text-white active:bg-red-500"
          onClick={() => {
            void aaveQA();
          }}
        >
          Send last Aave proposal quorum alert
        </div>
        <div
          className="w-max cursor-pointer bg-red-400 p-2 text-white active:bg-red-500"
          onClick={() => {
            void uniswapQA();
          }}
        >
          Send last Uniswap proposal quorum alert
        </div>
        <div className="text-white">
          Because our backend service works on repeat every minute and it must
          not repeat sending the same notification every time, it saves
          &quot;already sent&quot; notifications. Because of this, you can send
          one notification only once.
        </div>
        <div className="text-white">
          You can delete all your saved, dispatched notification with this
          button.
        </div>
        <div
          className="w-max cursor-pointer bg-red-400 p-2 text-white active:bg-red-500"
          onClick={() => {
            void deleteNotifs();
          }}
        >
          Delete dispatched notifications
        </div>
        <div />
        <div />
        <div
          className="w-max cursor-pointer bg-red-400 p-2 text-white active:bg-red-500"
          onClick={() => {
            void sendBulletin();
          }}
        >
          Send bulletin
        </div>
      </div>
    </PostHogFeature>
  );
};
export default Testing;
