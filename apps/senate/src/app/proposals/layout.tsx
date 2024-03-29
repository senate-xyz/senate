import dynamic from "next/dynamic";
import { Header } from "../components/csr/Header";
import { userHasProxies } from "./actions";

const SetupOtherAddress = dynamic(
  () => import("./components/SetupOtherAddress"),
  {
    ssr: false,
  },
);

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasProxies = await userHasProxies();
  return (
    <div className="bg-[#1E1B20] lg:pl-[92px]">
      <Header title="Proposals" />
      <div className="pt-[92px] lg:pt-[192px]">
        {!hasProxies && <SetupOtherAddress />}
        <div className="p-5 lg:p-10">
          <div className={`flex min-h-screen w-full grow flex-col`}>
            <div>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
