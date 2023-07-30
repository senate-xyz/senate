import "@rainbow-me/rainbowkit/styles.css";

import Link from "next/link";
import { isValidChallenge, verifyUser } from "./actions";

export default async function Page({ params }: { params: { slug: string[] } }) {
  const validChallenge = await isValidChallenge(String(params.slug[1]));

  if (!validChallenge)
    return (
      <div className="flex w-full flex-col items-center gap-4 pt-32">
        <p className="text-3xl font-bold text-white">Invalid challenge</p>
        <Link
          className="text-xl font-thin text-white underline"
          href="/orgs?connect"
        >
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
        <Link
          className="text-xl font-thin text-white underline"
          href="/orgs?connect"
        >
          Go back home
        </Link>
      </div>
    );
  }
}
