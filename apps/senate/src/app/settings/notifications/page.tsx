import { MagicUser } from "./components/MagicUser";
import { Email } from "./components/Email";
import { getMagicUser, userDiscord, userEmail } from "./actions";
import { Discord } from "./components/Discord";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import { PostHog } from "posthog-node";
import { ClientComponent } from "./components/ClientComponent";

const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
  host: `${process.env.NEXT_PUBLIC_WEB_URL ?? ""}/ingest`,
  disableGeoip: true,
});

export default async function Home() {
  const session = await getServerSession(authOptions());

  const {
    enabled: emailEnabled,
    email: emailEmail,
    verified: emailVerified,
    quorum: emailQuorum,
    empty: emailEmpty,
  } = await userEmail();

  const {
    enabled: discordEnabled,
    webhook: discordWebhook,
    reminders: discordReminders,
    includeVotes: discordIncludeVotes,
  } = await userDiscord();

  const { aave: aaveMagicUser, uniswap: uniswapMagicUser } =
    await getMagicUser();

  return (
    <div className="flex min-h-screen flex-col gap-10">
      <ClientComponent />
      <div className="flex flex-col gap-4">
        <div className="text-[24px] font-light leading-[30px] text-white">
          Your Notifications
        </div>

        <div className="max-w-[580px] text-[18px] text-white">
          Here&apos;s the place to pick and choose which Senate notifications
          you want, and how you want them to reach you.
        </div>
      </div>

      <Email
        enabled={emailEnabled}
        email={emailEmail}
        verified={emailVerified}
        quorum={emailQuorum}
        empty={emailEmpty}
      />

      <Discord
        enabled={discordEnabled}
        webhook={discordWebhook}
        reminders={discordReminders}
        includeVotes={discordIncludeVotes}
      />

      <MagicUser aave={aaveMagicUser} uniswap={uniswapMagicUser} />
    </div>
  );
}
