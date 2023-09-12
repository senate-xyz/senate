import "@rainbow-me/rainbowkit/styles.css";

import Link from "next/link";
import { isValidChallenge, verifyUser } from "./actions";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { challenge: string };
}) {
  const validChallenge = await isValidChallenge(String(params.challenge));

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
    await verifyUser(String(params.challenge)).then(() => {
      redirect("/orgs?connect");
    });

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
