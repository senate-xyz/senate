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
  initialItems: Item[];
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

export default function Items({
  initialItems,
  fetchItems,
  searchParams,
}: ItemsProps) {
  const fetching = useRef(false);
  const [page, setPage] = useState(2);
  const [pages, setPages] = useState([initialItems]);
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
        setPages((prev) => [...prev, data]);
        setPage(page + 1);
      } finally {
        fetching.current = false;
      }
    }
  };

  useEffect(() => {
    setPage(2);
    setPages([]);
    setHasMore(true);
  }, [initialItems]);

  return (
    <InfiniteScroll
      pageStart={1}
      loadMore={loadMore}
      hasMore={hasMore}
      loader={
        <span key={0} className="loader">
          Loading ...
        </span>
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
