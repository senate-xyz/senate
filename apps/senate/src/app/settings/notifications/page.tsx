import { MagicUser } from "./components/MagicUser";
import { Email } from "./components/Email";
import {
  getMagicUser,
  userDiscord,
  userEmail,
  userSlack,
  userTelegram,
} from "./actions";
import { Discord } from "./components/Discord";
import { ClientComponent } from "./components/ClientComponent";
import { Telegram } from "./components/Telegram";
import { Slack } from "./components/Slack";

export default async function Home() {
  const {
    enabled: emailEnabled,
    email: emailEmail,
    verified: emailVerified,
    quorum: emailQuorum,
    empty: emailEmpty,
  } = await userEmail();

  const {
    id: discordUserId,
    enabled: discordEnabled,
    webhook: discordWebhook,
    reminders: discordReminders,
    includeVotes: discordIncludeVotes,
  } = await userDiscord();

  const {
    userId: telegramUserId,
    enabled: telegramEnabled,
    reminders: telegramReminders,
    includeVotes: telegramIncludeVotes,
    chatId: telegramChatId,
    chatTitle: telegramChatTitle,
  } = await userTelegram();

  const {
    id: slackUserId,
    enabled: slackEnabled,
    webhook: slackWebhook,
    reminders: slackReminders,
    includeVotes: slackIncludeVotes,
    channelName: slackChannelName,
  } = await userSlack();

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
        userId={discordUserId}
      />

      <Slack
        enabled={slackEnabled}
        webhook={slackWebhook}
        reminders={slackReminders}
        includeVotes={slackIncludeVotes}
        userId={slackUserId}
        channelName={slackChannelName}
      />

      <Telegram
        userId={telegramUserId}
        enabled={telegramEnabled}
        reminders={telegramReminders}
        includeVotes={telegramIncludeVotes}
        chatId={telegramChatId}
        chatTitle={telegramChatTitle}
      />

      <MagicUser aave={aaveMagicUser} uniswap={uniswapMagicUser} />
    </div>
  );
}
