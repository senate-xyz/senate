"use client";

import { type ProposalState } from "@senate/database";
import { useEffect, useRef, useState } from "react";

import InfiniteScroll from "react-infinite-scroller";

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
  voted: string;
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
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState<Item[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const items = pages.flatMap((page) => page);

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
        if (page == 0) setPages([...data]);
        else setPages((prev) => [...prev, ...data]);
        setPage(page + 1);
      } finally {
        fetching.current = false;
      }
    }
  };

  useEffect(() => {
    setPage(0);
    setHasMore(true);
  }, [searchParams]);

  return (
    <InfiniteScroll
      loadMore={loadMore}
      hasMore={hasMore}
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
      element="main"
    >
      {items.map((item, index) => (
        <div key={index}>
          <span className="item text-white">{item.proposalTitle}</span>
          <br />
        </div>
      ))}
    </InfiniteScroll>
  );
}
