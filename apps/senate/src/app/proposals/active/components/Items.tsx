"use client";

import { type ProposalState } from "@senate/database";
import { useEffect, useState } from "react";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroller";
import Item from "./Item";

enum VoteResult {
  NOT_CONNECTED = "NOT_CONNECTED",
  LOADING = "LOADING",
  VOTED = "VOTED",
  NOT_VOTED = "NOT_VOTED",
}

export type Item = {
  proposalId: string;
  daoName: string;
  daoHandlerId: string;
  onchain: boolean;
  daoPicture: string;
  proposalTitle: string;
  state: ProposalState;
  proposalLink: string;
  timeEnd: Date;
  voteResult: VoteResult;
};

type ItemsProps = {
  fetchItems: (
    active: boolean,
    page: number,
    from: string,
    end: number,
    voted: string,
    proxy: string
  ) => Promise<Item[]>;
  fetchVote: (proposalId: string, proxy: string) => Promise<string>;
  searchParams?: { from: string; end: number; voted: string; proxy: string };
};

export default function Items({
  fetchItems,
  fetchVote,
  searchParams,
}: ItemsProps) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    if (!loading) {
      setLoading(true);

      const data = await fetchItems(
        true,
        items.length,
        searchParams?.from ?? "any",
        searchParams?.end ?? 365,
        searchParams?.voted ?? "any",
        searchParams?.proxy ?? "any"
      );

      const itemIds = new Set(items.map((item) => item.proposalId));
      const newItems = data.filter((d) => !itemIds.has(d.proposalId));

      if (newItems.length) setItems([...items, ...newItems]);

      if (!newItems.length) setHasMore(false);

      setLoading(false);
    }
  };

  useEffect(() => {
    setItems([]);
    if (!hasMore) setHasMore(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="pt-4">
      <div className="hidden h-[56px] flex-row items-center justify-between bg-black text-white lg:flex">
        <div className="flex flex-row items-center">
          <div className="w-[240px] items-center pl-[16px]">
            <div className="flex gap-1">
              <div>DAO</div>
            </div>
          </div>
          <div className="items-center">
            <div className="flex gap-1">
              <div>Proposal Title</div>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center">
          <div className="w-[250px] items-center font-normal">
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
          </div>
          <div className=" w-[200px] items-center text-center font-normal">
            <div className="flex justify-center gap-1">
              <div>Vote status</div>
            </div>
          </div>
        </div>
      </div>

      <InfiniteScroll
        loadMore={loadMore}
        hasMore={hasMore}
        threshold={1024}
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
        <ul className="pt-1">
          {items.map((item, index) => (
            <li className="pb-1" key={index}>
              <Item
                proposal={item}
                proxy={searchParams?.proxy ?? "any"}
                fetchVote={fetchVote}
              />
            </li>
          ))}
        </ul>
      </InfiniteScroll>
      {!hasMore && (
        <div className="w-full p-8 text-center text-white">
          You have seen it all
        </div>
      )}
    </div>
  );
}
