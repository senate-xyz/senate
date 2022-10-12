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

const LinkItems: Array<NavItemProps> = [
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
    <aside className="w-64" aria-label="Sidebar">
      navbar.tsx - page:{props.page}
      <div>
        <ul className="space-y-2">
          {LinkItems.map((view) => {
            return (
              <li>
                <a
                  onClick={() => {
                    props.setPage(view.id);
                  }}
                  href="#"
                >
                  <span className="ml-3">{view.name}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
