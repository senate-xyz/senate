"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroller";
import Item from "./Item";
import { LoadingItems } from "../../components/LoadingItems";
import { type fetchItemsType } from "../../actions";

type ItemsProps = {
  fetchItems: (
    active: boolean,
    page: number,
    from: string,
    voted: string,
    proxy: string,
  ) => Promise<fetchItemsType>;
  searchParams?: { from: string; voted: string; proxy: string };
};

export default function Items({
  fetchItems,

  searchParams,
}: ItemsProps) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<fetchItemsType>([]);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    if (!loading) {
      setLoading(true);

      const data = await fetchItems(
        true,
        items.length,
        searchParams?.from ?? "any",
        searchParams?.voted ?? "any",
        searchParams?.proxy ?? "any",
      );

      const itemIds = new Set(items.map((item) => item.proposal.id));
      const newItems = data.filter((d) => !itemIds.has(d.proposal.id));

      if (newItems.length) setItems([...items, ...newItems]);

      if (!newItems.length) setHasMore(false);

      setLoading(false);
    }
  };

  useEffect(() => {
    if (items.length) setItems([]);
    if (!hasMore) setHasMore(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <Suspense fallback={<LoadingItems />}>
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
            <div className="w-[340px] items-center font-normal">
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
        <ul className="pt-1">
          <InfiniteScroll
            loadMore={loadMore}
            hasMore={hasMore}
            threshold={1024}
            loader={<LoadingItems key="1" />}
          >
            {items.map((item, index) => (
              <li className="pb-1" key={index}>
                <Item item={item} proxy={searchParams?.proxy ?? "any"} />
              </li>
            ))}
          </InfiniteScroll>
        </ul>
        {!hasMore && (
          <div className="w-full p-8 text-center text-white">
            You have seen it all
          </div>
        )}
      </div>
    </Suspense>
  );
}
