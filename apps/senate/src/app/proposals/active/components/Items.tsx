"use client";

import { type ProposalState } from "@senate/database";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroller";
import { DesktopItem } from "./ssr/DesktopItem";
import { useForceUpdate } from "framer-motion";

type Item = {
  proposalId: string;
  daoName: string;
  daoHandlerId: string;
  onchain: boolean;
  daoPicture: string;
  proposalTitle: string;
  state: ProposalState;
  proposalLink: string;
  timeEnd: Date;
};

type ItemsProps = {
  fetchItems: (
    from?: string,
    end?: number,
    voted?: string,
    proxy?: string,
    skip?: number,
    take?: number
  ) => Promise<Item[]>;
  searchParams?: { from: string; end: number; voted: string; proxy: string };
};

export default function Items({ fetchItems, searchParams }: ItemsProps) {
  const fetching = useRef(false);
  const [forceUpdate] = useForceUpdate();
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<Item[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    if (!fetching.current) {
      try {
        fetching.current = true;

        const data = await fetchItems(
          searchParams?.from ?? "any",
          searchParams?.end ?? 365,
          searchParams?.voted ?? "any",
          searchParams?.proxy ?? "any",
          page
        );

        setHasMore(data.length > 0);
        if (page == 0) setItems([...data]);
        else setItems((prev) => [...prev, ...data]);
        setPage(page + 1);
      } finally {
        fetching.current = false;
      }
    }
  };

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    forceUpdate();
  }, [searchParams]);

  return (
    <div>
      <table className="w-full table-auto border-separate border-spacing-y-[4px] text-left">
        <thead className="h-[56px] bg-black text-white">
          <tr>
            <th className="h-[56px] w-[200px] items-center pl-[16px]">
              <div className="flex gap-1">
                <div>DAO</div>
              </div>
            </th>
            <th className="h-[56px] items-center">
              <div className="flex gap-1">
                <div>Proposal Title</div>
              </div>
            </th>
            <th className="h-[56px] w-[250px] items-center font-normal">
              <div className="flex gap-1">
                <div>Ends in</div>
                <Image
                  loading="eager"
                  priority={true}
                  width={24}
                  height={24}
                  src={"/assets/Icon/SortDiscending.svg"}
                  alt="ends-in"
                />
              </div>
            </th>
            <th className="h-[56px] w-[200px] items-center text-center font-normal">
              <div className="flex justify-center gap-1">
                <div>Vote status</div>
              </div>
            </th>
          </tr>
        </thead>
      </table>
      <InfiniteScroll
        loadMore={loadMore}
        hasMore={hasMore}
        threshold={Infinity}
        loader={
          <div className="relative h-[96px] w-full overflow-hidden bg-[#262626] p-4 shadow hover:shadow-md">
            <div className="flex w-full animate-pulse flex-row items-center gap-5">
              <div className="h-[64px] w-[64px] bg-[#545454]" />
              <div className="h-[32px] w-[64px] bg-[#545454]" />
              <div className="flex h-[32px] grow bg-[#545454]" />
              <div className="h-[32px] w-[250px] bg-[#545454]" />
              <div className="h-10 w-10 rounded-full bg-[#545454]" />
            </div>
          </div>
        }
      >
        {items.map((item, index) => (
          <div key={index} className="pb-1">
            <DesktopItem proposal={item} />
          </div>
        ))}
      </InfiniteScroll>
      {!hasMore && (
        <div className="w-full p-8 text-center text-white">
          You have seen it all
        </div>
      )}
    </div>
  );
}
