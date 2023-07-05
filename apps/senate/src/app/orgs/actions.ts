"use server";

import { prisma } from "@senate/database";
import { getAverageColor } from "fast-average-color-node";
import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

export type Subscribed = {
  subscriptions: Array<{
    id: string;
    name: string;
    picture: string;
    handlers: Array<{ type: string }>;
    proposals: unknown[];
  }>;
  backgroundColors: Array<{ color: string }>;
};

export type Unsubscribed = {
  unsubscriptions: Array<{
    id: string;
    name: string;
    picture: string;
    handlers: Array<{ type: string }>;
  }>;
  backgroundColors: Array<{ color: string }>;
};

export const getSubscriptions = async () => {
  "use server";

  const subscribed = await getSubscribedDAOs();
  const unsubscribed = await getUnsubscribedDAOs();

  return { subscribed, unsubscribed };
};

const getSubscribedDAOs = async (): Promise<Subscribed> => {
  "use server";

  const session = await getServerSession(authOptions());

  if (!session || !session.user || !session.user.name)
    return { subscriptions: [], backgroundColors: [] };

  const userAddress = session.user.name;

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
          some: {
            userid: user.id,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
      include: {
        handlers: { select: { type: true } },
        proposals: {
          where: { timeend: { gt: new Date() } },
          select: { _count: true },
        },
      },
    })
  ).sort((a, b) => a.name.localeCompare(b.name));

  const backgroundColors = await Promise.all(
    daosList.map(async (sub) => {
      const color = await getAverageColor(
        `${process.env.NEXT_PUBLIC_WEB_URL ?? ""}${sub.picture}.svg`,
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
    subscriptions: daosList,
    backgroundColors: backgroundColors,
  };
};

const getUnsubscribedDAOs = async (): Promise<Unsubscribed> => {
  "use server";

  const session = await getServerSession(authOptions());

  if (!session || !session.user || !session.user.name) {
    const daosList = (
      await prisma.dao.findMany({
        orderBy: {
          id: "asc",
        },
        include: {
          handlers: { select: { type: true } },
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
  }

  const userAddress = session.user.name;

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
        handlers: { select: { type: true } },
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
