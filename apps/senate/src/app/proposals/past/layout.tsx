import Link from "next/link";

const tabs: { id: number; name: string; color: string; link: string }[] = [
  {
    id: 0,
    name: "Active Proposals",
    color:
      "text-[#808080] text-[36px] font-light cursor-pointer hover:text-[#8c8c8c]",
    link: "/proposals/active",
  },
  {
    id: 1,
    name: "Past Proposals",
    color: "text-white text-[36px] font-bold cursor-pointer",
    link: "/proposals/past",
  },
];

// eslint-disable-next-line @typescript-eslint/require-await
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex grow flex-col">
      <div className="flex w-full flex-row gap-10 overflow-x-auto overflow-y-hidden leading-[36px]">
        {tabs.map((tab) => {
          return (
            <Link key={tab.id} className={tab.color} href={tab.link}>
              {tab.name}
            </Link>
          );
        })}
      </div>
      {children}
    </div>
  );
}
