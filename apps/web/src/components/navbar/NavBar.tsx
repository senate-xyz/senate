import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import { IconType } from "react-icons";
import { FiBarChart2, FiHome, FiStar } from "react-icons/fi";

export enum ViewsEnum {
  None = 1,
  Dashboard = 2,
  Watchlist = 3,
  Tracker = 4,
  Settings = 5,
}
export interface NavItemProps {
  name: string;
  id: ViewsEnum;
  icon: IconType;
}

const linkItems: Array<NavItemProps> = [
  { name: "Dashboard", id: ViewsEnum.Dashboard, icon: FiHome },
  {
    name: "Watchlist",
    id: ViewsEnum.Watchlist,
    icon: FiBarChart2,
  },
  { name: "Vote tracker", id: ViewsEnum.Tracker, icon: FiStar },
];

export default function NavBar(props: { page: ViewsEnum; setPage: any }) {
  return (
    <main className="w-16 h-screen place-items-center group">
      <section className="border bg-red-300 absolute transition-all duration-500 -left-96 group-hover:left-0 z-10">
        <div className="h-screen grid place-items-start w-48">
          <ul className="mt-12 p-2 space-y-4">
            <ConnectButton showBalance={false} />
            {linkItems.map((item, index) => {
              return (
                <li key={index}>
                  <button
                    onClick={() => {
                      props.setPage(item.id);
                    }}
                  >
                    <div className="flex">
                      {<item.icon size="1.5rem" />}
                      <p>{item.name}</p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      <section className="h-screen grid place-items-start w-12 bg-red-200">
        <ul className="mt-12 p-2 space-y-4">
          {linkItems.map((item, index) => {
            return <li key={index}>{<item.icon size="1.5rem" />}</li>;
          })}
        </ul>
      </section>
    </main>
  );
}