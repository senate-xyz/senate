import fetch from "node-fetch";
import { type NextApiRequest, type NextApiResponse } from "next";
import { PostHog } from "posthog-node";
import { db, user, eq } from "@senate/database";

const scope = ["incoming-webhook identify.team"].join(" ");
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_WEB_URL}/api/slack/callback`;

const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
  host: `${process.env.NEXT_PUBLIC_WEB_URL ?? ""}/ingest`,
  disableGeoip: true,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") return res.redirect("/");

  const { code = null, state: userid } = req.query;

  if (!code || typeof code !== "string") return res.redirect("/");

  const body = new URLSearchParams({
    client_id: process.env.SLACK_CLIENT_ID ?? "",
    client_secret: process.env.SLACK_CLIENT_SECRET ?? "",
    grant_type: "authorization_code",
    redirect_uri: REDIRECT_URI,
    code,
    scope,
  }).toString();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const result = await fetch(
    "https://slack.com/api/oauth.v2.access",
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
    result.incoming_webhook == undefined ||
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    result.incoming_webhook.url == undefined ||
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    result.team.name == undefined ||
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    result.incoming_webhook.channel == undefined
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.log(JSON.stringify(result));
    res.send(`Oops, something went wrong! ${JSON.stringify(result)}`);
    return;
  }

  await db
    .update(user)
    .set({
      slacknotifications: true,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      slackwebhook: result.incoming_webhook.url,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      slackchannelname: `${result.team.name}${result.incoming_webhook.channel}`,
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
