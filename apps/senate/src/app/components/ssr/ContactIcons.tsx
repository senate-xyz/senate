import Link from "next/link";
import Image from "next/image";

export const ContactIcons = () => {
  return (
    <div className="flex grow flex-row items-end justify-between justify-self-end pb-2 opacity-50">
      <Link href="https://twitter.com/SenateLabs">
        <Image
          loading="eager"
          priority={true}
          src="/assets/Icon/Twitter.svg"
          alt="twitter"
          width={24}
          height={24}
        />
      </Link>

      <Link href="https://discord.gg/shtxfNqazd">
        <Image
          loading="eager"
          priority={true}
          src="/assets/Icon/DiscordWhite.svg"
          alt="discord"
          width={24}
          height={24}
        />
      </Link>

      <Link href="https://github.com/senate-xyz/senate">
        <Image
          loading="eager"
          priority={true}
          src="/assets/Icon/Github.svg"
          alt="github"
          width={24}
          height={24}
        />
      </Link>
    </div>
  );
};
