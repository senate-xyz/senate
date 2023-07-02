import { prisma } from "@senate/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { Header } from "../components/csr/Header";
import SetupDailyBulletin from "./components/SetupDailyBulletin";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Senate - Orgs",
  icons: "/assets/Senate_Logo/64/Black.svg",
};

const hasUserBulletin = async () => {
  const session = await getServerSession(authOptions());
  if (!session || !session.user || !session.user.name) return true;
  const userAddress = session.user.name;

  const user = await prisma.user
    .findFirstOrThrow({
      where: {
        address: { equals: userAddress },
      },
      select: {
        emaildailybulletin: true,
      },
    })
    .catch(() => {
      return { emaildailybulletin: false };
    });

  return user.emaildailybulletin;
};

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
