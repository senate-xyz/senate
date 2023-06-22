import "@rainbow-me/rainbowkit/styles.css";

import { prisma } from "@senate/database";
import Link from "next/link";
import { PostHog } from "posthog-node";

const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
  host: `${process.env.NEXT_PUBLIC_WEB_URL ?? ""}/ingest`,
});

const isValidChallenge = async (challenge: string) => {
  const user = await prisma.user.findFirst({
    where: {
      challengecode: challenge,
    },
  });

  return user ? true : false;
};

const verifyUser = async (dao: string, challenge: string) => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      challengecode: challenge,
    },
  });

  const subscribedao = await prisma.dao.findFirstOrThrow({
    where: {
      name: { equals: dao },
    },
  });

  switch (dao) {
    case "aave": {
      await prisma.user.updateMany({
        where: {
          challengecode: challenge,
        },
        data: {
          challengecode: "",
          isaaveuser: "ENABLED",
        },
      });
      break;
    }
    case "uniswap": {
      await prisma.user.updateMany({
        where: {
          challengecode: challenge,
        },
        data: {
          challengecode: "",
          isuniswapuser: "ENABLED",
        },
      });
      break;
    }
  }

  await prisma.subscription.createMany({
    data: {
      userid: user?.id,
      daoid: subscribedao?.id,
    },
    skipDuplicates: true,
  });

  let dao_name: string;
  switch (dao) {
    case "aave":
      dao_name = "Aave";
      break;
    case "uniswap":
      dao_name = "Uniswap";
      break;
    default:
      dao_name = "Unknown";
      break;
  }

  posthog.capture({
    distinctId: user.address,
    event: "subscribe_discourse",
    properties: {
      dao: dao_name,
    },
  });
};

export default async function Page({ params }: { params: { slug: string[] } }) {
  const validChallenge = await isValidChallenge(String(params.slug[1]));

  if (!validChallenge)
    return (
      <div className="flex w-full flex-col items-center gap-4 pt-32">
        <p className="text-3xl font-bold text-white">Invalid challenge</p>
        <Link className="text-xl font-thin text-white underline" href="/orgs">
          Go back home
        </Link>
      </div>
    );
  else {
    await verifyUser(String(params.slug[0]), String(params.slug[1]));

    return (
      <div className="flex w-full flex-col items-center gap-4 pt-32">
        <p className="text-3xl font-bold text-white">
          Thank you for verifying your email address.
        </p>
        <Link className="text-xl font-thin text-white underline" href="/orgs">
          Go back home
        </Link>
      </div>
    );
  }
}
