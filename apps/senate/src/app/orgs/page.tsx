import { type Metadata } from "next";
import SubscribedDAOs from "./subscribedDAOs/page";
import UnsubscribedDAOs from "./unsubscribedDAOs/page";
import { prisma } from "@senate/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { getAverageColor } from "fast-average-color-node";

export const metadata: Metadata = {
  title: "Senate - Orgs",
  icons: "/assets/Senate_Logo/64/Black.svg",
};

export const getSubscribedDAOs = async () => {
  "use server";
  const session = await getServerSession(authOptions());
  const userAddress = session?.user?.name ?? "";

  const user = await prisma.user
    .findFirstOrThrow({
      where: {
        address: { equals: userAddress },
      },
      select: {
        id: true,
      },
    })
    .catch(() => {
      return { id: "0" };
    });

  const subscriptionsList = (
    await prisma.subscription.findMany({
      where: {
        userid: user.id,
      },
      include: {
        dao: {
          include: {
            handlers: true,
            proposals: { where: { timeend: { gt: new Date() } } },
          },
        },
      },
      orderBy: {
        dao: {
          name: "asc",
        },
      },
    })
  ).sort((a, b) => a.dao.name.localeCompare(b.dao.name));

  const backgroundColors = await Promise.all(
    subscriptionsList.map(async (sub) => {
      const color = await getAverageColor(
        `${process.env.NEXT_PUBLIC_WEB_URL ?? ""}${sub.dao.picture}.svg`,
        {
          mode: "precision",
          algorithm: "sqrt",
        }
      )
        .then((color) => color)
        .catch(() => {
          return { hex: "#5A5A5A" };
        });
      return {
        color: `${color.hex}`,
      };
    })
  );

  return {
    subscriptions: subscriptionsList,
    backgroundColors: backgroundColors,
  };
};

export const getUnsubscribedDAOs = async () => {
  "use server";
  const session = await getServerSession(authOptions());
  const userAddress = session?.user?.name ?? "";

  const user = await prisma.user
    .findFirstOrThrow({
      where: {
        address: { equals: userAddress },
      },
      select: {
        id: true,
      },
    })
    .catch(() => {
      return { id: "0" };
    });

  const daosList = (
    await prisma.dao.findMany({
      where: {
        subscriptions: {
          none: {
            user: { is: user },
          },
        },
      },
      orderBy: {
        id: "asc",
      },
      include: {
        handlers: true,
        subscriptions: {
          where: {
            userid: { contains: user.id },
          },
        },
      },
    })
  ).sort((a, b) => a.name.localeCompare(b.name));

  const backgroundColors = await Promise.all(
    daosList.map(async (dao) => {
      const color = await getAverageColor(
        `${process.env.NEXT_PUBLIC_WEB_URL ?? ""}${dao.picture}.svg`,
        {
          mode: "precision",
          algorithm: "sqrt",
        }
      )
        .then((color) => color)
        .catch(() => {
          return { hex: "#5A5A5A" };
        });
      return {
        daoId: dao.id,
        color: `${color.hex}`,
      };
    })
  );

  return {
    unsubscriptions: daosList,
    backgroundColors: backgroundColors,
  };
};

// eslint-disable-next-line @typescript-eslint/require-await
export default async function Home() {
  return (
    <main className="flex w-full flex-col">
      <SubscribedDAOs />
      <UnsubscribedDAOs />
    </main>
  );
}
