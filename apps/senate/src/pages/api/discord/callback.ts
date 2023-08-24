import fetch from "node-fetch";
import { type NextApiRequest, type NextApiResponse } from "next";
import { PostHog } from "posthog-node";
import { db, user, eq } from "@senate/database";

const scope = ["webhook.incoming"].join(" ");
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_WEB_URL}/api/discord/callback`;

const OAUTH_QS = new URLSearchParams({
  client_id: process.env.DISCORD_CLIENT_ID ?? "",
  redirect_uri: REDIRECT_URI,
  response_type: "code",
  scope,
}).toString();

const OAUTH_URI = `https://discord.com/api/oauth2/authorize?${OAUTH_QS}`;

const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
  host: `${process.env.NEXT_PUBLIC_WEB_URL ?? ""}/ingest`,
  disableGeoip: true,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") return res.redirect("/");

  const { code = null, error = null, state: userid } = req.query;

  if (error) {
    return res.redirect(`/?error=${req.query.error as string}`);
  }

  if (!code || typeof code !== "string") return res.redirect(OAUTH_URI);

  const body = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID ?? "",
    client_secret: process.env.DISCORD_CLIENT_SECRET ?? "",
    grant_type: "authorization_code",
    redirect_uri: REDIRECT_URI,
    code,
    scope,
  }).toString();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const result = await fetch(
    "https://discord.com/api/oauth2/token",
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
      body,
    },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  ).then((res) => res.json());

  if (
    result == undefined ||
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    result.webhook == undefined ||
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    result.webhook.url == undefined
  )
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    res.send(`Oops, something went wrong! ${result.body}`);

  await db
    .update(user)
    .set({
      discordnotifications: true,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      discordwebhook: result.webhook.url,
    })
    .where(eq(user.id, userid as string));
  const [u] = await db
    .select()
    .from(user)
    .where(eq(user.id, userid as string));

  posthog.capture({
    distinctId: u.address ?? "unknown",
    event: "discord_webhook_sets",
    properties: {
      props: {
        app: "web-backend",
      },
    },
  });

  posthog.capture({
    distinctId: u.address ?? "unknown",
    event: "discord_enable",
    properties: {
      props: {
        app: "web-backend",
      },
    },
  });

  res.redirect("/settings/notifications");
}
