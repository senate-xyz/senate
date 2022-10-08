import React from "react";

import { PagesEnum } from "@senate/common-types";

export default function NavBar(props: { page: PagesEnum; setPage: any }) {
  return (
    <aside className="w-64" aria-label="Sidebar">
      navbar.tsx - page:{props.page}
      <div>
        <ul className="space-y-2">
          <li>
            <a
              onClick={() => {
                props.setPage(PagesEnum.Dashboard);
              }}
              href="#"
            >
              <span className="ml-3">Dashboard</span>
            </a>
          </li>
          <li>
            <a
              onClick={() => {
                props.setPage(PagesEnum.Watchlist);
              }}
              href="#"
            >
              <span className="flex-1 ml-3 whitespace-nowrap">Watchlist</span>
            </a>
          </li>
          <li>
            <a
              onClick={() => {
                props.setPage(PagesEnum.Tracker);
              }}
              href="#"
            >
              <span className="flex-1 ml-3 whitespace-nowrap">Tracker</span>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
}
