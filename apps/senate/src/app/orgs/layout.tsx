import { Header } from "../components/csr/Header";
import { hasUserBulletin } from "./actions";
import SetupDailyBulletin from "./components/SetupDailyBulletin";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userBulletin = await hasUserBulletin();

  return (
    <div className="bg-[#1E1B20] lg:pl-[92px]">
      <Header title="Orgs" />
      <div className="pt-[92px] lg:pt-[192px]">
        {!userBulletin && <SetupDailyBulletin />}

        <div className="p-5 lg:p-10">
          <div className={`flex min-h-screen w-full grow flex-col`}>
            <div>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
