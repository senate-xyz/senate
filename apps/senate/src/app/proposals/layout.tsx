import { prisma } from "@senate/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { Header } from "../components/csr/Header";
import SetupOtherAddress from "./components/SetupOtherAddress";

const userHasProxies = async () => {
  "use server";

  const session = await getServerSession(authOptions());
  const userAddress = session?.user?.name ?? "";

  const result = await prisma.user.findFirstOrThrow({
    where: {
      address: { equals: userAddress },
    },
    include: {
      _count: {
        select: {
          voters: true,
        },
      },
    },
  });

  return result._count.voters > 1;
};

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
