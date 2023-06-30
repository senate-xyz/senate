"use server";

import { prisma } from "@senate/database";
import { getServerSession } from "next-auth";
import { PostHog } from "posthog-node";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import { revalidateTag } from "next/cache";

const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
  host: `${process.env.NEXT_PUBLIC_WEB_URL ?? ""}/ingest`,
  disableGeoip: true,
});

export async function subscribe(daoId: string) {
  revalidateTag("subscriptions");
  const session = await getServerSession(authOptions());
  const userAddress = session?.user?.name ?? "";

  const user = await prisma.user.findFirstOrThrow({
    where: {
      address: {
        equals: userAddress,
      },
    },
  });

  const result = await prisma.subscription.upsert({
    where: {
      userid_daoid: {
        userid: user.id,
        daoid: daoId,
      },
    },
    update: {
      userid: user.id,
      daoid: daoId,
    },
    create: {
      userid: user.id,
      daoid: daoId,
    },
    select: {
      dao: { select: { name: true } },
    },
  });

  posthog.capture({
    distinctId: user.address,
    event: "unsubscribe",
    properties: {
      dao: result.dao.name,
      props: {
        app: "web-backend",
      },
    },
  });
}
