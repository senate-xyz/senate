/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import "@rainbow-me/rainbowkit/styles.css";

import { prisma } from "@senate/database";
import Link from "next/link";
import { VerifyButton } from "./components/VerifyButton";

const isValidChallenge = async (challenge: string) => {
  const user = await prisma.user.findFirst({
    where: {
      challengecode: challenge,
    },
  });

  return user ? true : false;
};

export default async function Page({ params }) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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
    return (
      <div className="flex w-full flex-col items-center gap-4 pt-32">
        <p className="text-3xl font-bold text-white">
          Please connect your wallet and sign the message
        </p>

        <VerifyButton challenge={String(params.slug[1])} />
      </div>
    );
  }
}
