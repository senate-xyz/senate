import React from "react";
import { FiBarChart2, FiHome, FiStar } from "react-icons/fi";
import { NavItemProps } from "./NavItem";
export enum ViewsEnum {
  None = 1,
  Dashboard = 2,
  Watchlist = 3,
  Tracker = 4,
  Settings = 5,
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
      <section className="border bg-red-200 absolute transition-all duration-500 -left-36 group-hover:left-0">
        <div className="h-screen grid place-items-start w-36">
          <ul className="mt-12 p-2 space-y-4">
            {linkItems.map((item) => {
              return (
                <li>
                  {
                    <div className="flex">
                      <item.icon size="1.5rem" />
                      {item.name}
                    </div>
                  }
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      <section className="h-screen grid place-items-start w-12 bg-red-100">
        <ul className="mt-12 p-2 space-y-4">
          {linkItems.map((item) => {
            return <li>{<item.icon size="1.5rem" />}</li>;
          })}
        </ul>
      </section>
    </main>
  );
}
