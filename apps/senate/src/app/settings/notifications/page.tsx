import Discord from "./components/Discord";
import Telegram from "./components/Telegram";
import { MagicUser } from "./components/MagicUser";
import { Email } from "./components/Email";
import { bulletinEnabled, userEmail } from "./actions";

export default async function Home() {
  const isBulletinEnabled = await bulletinEnabled();
  const { email, verified, quorum, empty } = await userEmail();

  return (
    <div className="flex min-h-screen flex-col gap-10">
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
        isBulletinEnabled={isBulletinEnabled}
        email={email}
        verified={verified}
        quorum={quorum}
        empty={empty}
      />

      <Discord />
      <Telegram />

      <div className="flex flex-row gap-8">
        <MagicUser />
      </div>
    </div>
  );
}
