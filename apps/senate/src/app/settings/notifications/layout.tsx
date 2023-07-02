import Link from "next/link";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Senate - Notification Settings",
  icons: "/assets/Senate_Logo/64/Black.svg",
};

const tabs: { id: number; name: string; color: string; link: string }[] = [
  {
    id: 0,
    name: "Account",
    color:
      "text-[#808080] text-[36px] font-light cursor-pointer hover:text-[#8c8c8c]",
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
    color: "text-white text-[36px] font-bold cursor-pointer",
    link: "/settings/notifications",
  },
];

// eslint-disable-next-line @typescript-eslint/require-await
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex grow flex-col bg-[#1E1B20]">
        <div className="flex w-full flex-row gap-10 overflow-x-auto overflow-y-hidden leading-[36px]">
          {tabs.map((tab) => {
            return (
              <Link key={tab.id} className={tab.color} href={tab.link}>
                {tab.name}
              </Link>
            );
          })}
        </div>
        <div className="pl-2 pt-10 lg:w-[1150px]">{children}</div>
      </div>
    </>
  );
}
