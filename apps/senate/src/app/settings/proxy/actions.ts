"use server";

import { prisma } from "@senate/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import { PostHog } from "posthog-node";
import { revalidateTag } from "next/cache";

export type Voter = {
  address: string;
};

const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
  host: `${process.env.NEXT_PUBLIC_WEB_URL ?? ""}/ingest`,
  disableGeoip: true,
});

export const addVoter = async (address: string) => {
  "use server";

  revalidateTag("voters");

  const session = await getServerSession(authOptions());

  if (!session || !session.user || !session.user.name) return;

  const userAddress = session.user.name;

  const user = await prisma.user.findFirstOrThrow({
    where: {
      address: {
        equals: userAddress,
      },
    },
  });

  await prisma.user.update({
    where: {
      id: user?.id,
    },
    data: {
      voters: {
        connectOrCreate: {
          where: {
            address: address,
          },
          create: {
            address: address,
          },
        },
      },
    },
  });

  posthog.capture({
    distinctId: user.address,
    event: "add_voter",
    properties: {
      voter: address,
      props: {
        app: "web-backend",
      },
    },
  });
};

export const removeVoter = async (address: string) => {
  "use server";

  revalidateTag("voters");

  const session = await getServerSession(authOptions());

  if (!session || !session.user || !session.user.name) return;

  const userAddress = session.user.name;

  const user = await prisma.user.findFirstOrThrow({
    where: {
      address: {
        equals: userAddress,
      },
    },
  });

  await prisma.user.update({
    where: {
      id: user?.id,
    },
    data: {
      voters: {
        disconnect: {
          address: address,
        },
      },
    },
  });

  posthog.capture({
    distinctId: user.address,
    event: "remove_voter",
    properties: {
      voter: address,
      props: {
        app: "web-backend",
      },
    },
  });
};

export const getVoters = async () => {
  "use server";

  revalidateTag("voters");

  const session = await getServerSession(authOptions());

  if (!session || !session.user || !session.user.name) return [];

  const userAddress = session.user.name;

  const user = await prisma.user.findFirstOrThrow({
    where: {
      address: {
        equals: userAddress,
      },
    },
    include: {
      voters: true,
    },
  });

  const filteredVoters = user.voters.filter(
    (voter) => voter.address !== userAddress
  );

  return filteredVoters as Array<Voter>;
};
