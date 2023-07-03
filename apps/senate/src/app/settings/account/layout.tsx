"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useAccount } from "wagmi";

const defaultTab: { id: number; name: string; color: string; link: string } = {
  id: 0,
  name: "Account",
  color: "text-white text-[36px] font-bold cursor-pointer",
  link: "/settings/account",
};

const tabs: { id: number; name: string; color: string; link: string }[] = [
  {
    id: 0,
    name: "Account",
    color: "text-white text-[36px] font-bold cursor-pointer",
    link: "/settings/account",
  },
  {
    id: 1,
    name: "Other Addresses",
    color:
      "text-[#808080] text-[36px] font-light cursor-pointer hover:text-[#8c8c8c]",
    link: "/settings/proxy",
  },
  {
    id: 2,
    name: "Notifications",
    color:
      "text-[#808080] text-[36px] font-light cursor-pointer hover:text-[#8c8c8c]",
    link: "/settings/notifications",
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useSession();
  const account = useAccount();

  return (
    <>
      <div className="flex grow flex-col bg-[#1E1B20]">
        <div className="flex w-full flex-row gap-10 overflow-x-auto overflow-y-hidden leading-[36px]">
          {session?.status == "authenticated" && account.isConnected ? (
            tabs.map((tab) => {
              return (
                <Link key={tab.id} className={tab.color} href={tab.link}>
                  {tab.name}
                </Link>
              );
            })
          ) : (
            <Link
              key={defaultTab.id}
              className={defaultTab.color}
              href={defaultTab.link}
            >
              {defaultTab.name}
            </Link>
          )}
        </div>
        <div className="pl-2 pt-10 lg:w-[1150px]">{children}</div>
      </div>
    </>
  );
}
